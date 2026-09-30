-- ==============================================================================
-- CityTwin AI — Migration 001: Initial PostGIS Schema & Stored Procedures
-- Union Territory of Chandigarh Urban Infrastructure Planning Platform
-- ==============================================================================

-- 1. Enable Required PostgreSQL Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- 2. Clean Drop if exists (Idempotent Migration)
DROP TABLE IF EXISTS test_results CASCADE;
DROP TABLE IF EXISTS benchmark_results CASCADE;
DROP TABLE IF EXISTS model_runs CASCADE;
DROP TABLE IF EXISTS candidate_sites CASCADE;
DROP TABLE IF EXISTS hospitals CASCADE;
DROP TABLE IF EXISTS sectors CASCADE;
DROP TABLE IF EXISTS dataset_registry CASCADE;

-- ==============================================================================
-- 3. Core Tables
-- ==============================================================================

-- 3.1 Dataset Registry & Provenance Tracking
CREATE TABLE dataset_registry (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    dataset_key VARCHAR(100) UNIQUE NOT NULL,
    domain VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL,
    official_source VARCHAR(255) NOT NULL,
    source_url TEXT,
    license VARCHAR(100) NOT NULL,
    row_count INT NOT NULL DEFAULT 0,
    crs VARCHAR(20) NOT NULL DEFAULT 'EPSG:4326',
    bbox JSONB NOT NULL,
    last_verified_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3.2 Chandigarh Administrative Sectors (64 sectors grid + periphery)
CREATE TABLE sectors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sector_name VARCHAR(100) UNIQUE NOT NULL,
    zone VARCHAR(50) NOT NULL,
    population INT NOT NULL,
    area_sqkm NUMERIC(8, 4) NOT NULL,
    density_per_sqkm NUMERIC(10, 2) NOT NULL,
    land_use VARCHAR(100) NOT NULL,
    existing_hospitals_count INT DEFAULT 0,
    nearest_hospital VARCHAR(255),
    distance_to_nearest_hospital_km NUMERIC(6, 2),
    road_connectivity_score NUMERIC(4, 2) NOT NULL,
    public_transit_score NUMERIC(4, 2) NOT NULL,
    center_point GEOMETRY(Point, 4326) NOT NULL,
    geom GEOMETRY(Polygon, 4326) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3.3 Existing Healthcare Infrastructure (Ground Truth Facilities)
CREATE TABLE hospitals (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL,
    sector VARCHAR(100) NOT NULL,
    beds INT NOT NULL,
    emergency BOOLEAN DEFAULT TRUE,
    trauma_center BOOLEAN DEFAULT FALSE,
    icu_beds INT NOT NULL DEFAULT 0,
    daily_opd INT NOT NULL DEFAULT 0,
    source VARCHAR(255) NOT NULL,
    location GEOMETRY(Point, 4326) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3.4 Candidate Hospital Parcels (Master Plan 2031 Reserves)
CREATE TABLE candidate_sites (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    sector VARCHAR(100) NOT NULL,
    description TEXT,
    vacant_land_acres NUMERIC(6, 2) NOT NULL,
    population_within_2km INT NOT NULL,
    distance_to_nearest_hospital_km NUMERIC(6, 2) NOT NULL,
    road_access TEXT NOT NULL,
    transit_access_score NUMERIC(4, 2) NOT NULL,
    road_connectivity_score NUMERIC(4, 2) NOT NULL,
    land_availability_score NUMERIC(4, 2) NOT NULL,
    healthcare_gap_score NUMERIC(4, 2) NOT NULL,
    population_demand_score NUMERIC(4, 2) NOT NULL,
    suitability_score NUMERIC(5, 2) NOT NULL,
    rank INT NOT NULL,
    recommended_type VARCHAR(255) NOT NULL,
    estimated_cost_cr NUMERIC(8, 2) NOT NULL,
    rationale TEXT NOT NULL,
    location GEOMETRY(Point, 4326) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3.5 Model Simulation Runs & Scenario Logs
CREATE TABLE model_runs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    run_type VARCHAR(50) NOT NULL DEFAULT 'mcda_suitability',
    weights JSONB NOT NULL,
    top_site_id VARCHAR(50) REFERENCES candidate_sites(id),
    rankings JSONB NOT NULL,
    execution_time_ms NUMERIC(8, 2),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3.6 Automated Benchmark Logs (Hard Validation: >= 1,000 runs)
CREATE TABLE benchmark_results (
    id BIGSERIAL PRIMARY KEY,
    run_id UUID DEFAULT uuid_generate_v4(),
    scenario_name VARCHAR(100) NOT NULL,
    weights JSONB NOT NULL,
    top_recommended_site VARCHAR(50) NOT NULL,
    top_score NUMERIC(6, 2) NOT NULL,
    rankings JSONB NOT NULL,
    execution_time_ms NUMERIC(8, 3) NOT NULL,
    passed_validation BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3.7 Automated Test Execution Logs (Hard Validation: >= 200 per component)
CREATE TABLE test_results (
    id BIGSERIAL PRIMARY KEY,
    test_id VARCHAR(100) NOT NULL,
    component VARCHAR(50) NOT NULL, -- 'scoring_engine', 'ml_model', 'data_pipeline', 'api_routes'
    test_name VARCHAR(255) NOT NULL,
    status VARCHAR(20) NOT NULL, -- 'PASSED', 'FAILED', 'SKIPPED'
    duration_ms NUMERIC(8, 3) NOT NULL,
    input_params JSONB,
    actual_output JSONB,
    error_message TEXT,
    executed_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 4. Spatial & Performance Indices
-- ==============================================================================

CREATE INDEX idx_sectors_geom ON sectors USING GIST(geom);
CREATE INDEX idx_sectors_center ON sectors USING GIST(center_point);
CREATE INDEX idx_sectors_zone ON sectors(zone);
CREATE INDEX idx_hospitals_location ON hospitals USING GIST(location);
CREATE INDEX idx_candidate_sites_location ON candidate_sites USING GIST(location);
CREATE INDEX idx_benchmark_scenario ON benchmark_results(scenario_name);
CREATE INDEX idx_test_component ON test_results(component);

-- ==============================================================================
-- 5. PostGIS Spatial Stored Procedures
-- ==============================================================================

-- 5.1 Calculate Demographics within Isochrone/Radius of a Candidate Site
CREATE OR REPLACE FUNCTION fn_calculate_catchment_population(
    p_candidate_id TEXT,
    p_radius_km DOUBLE PRECISION DEFAULT 2.0
)
RETURNS TABLE (
    candidate_id VARCHAR(50),
    total_catchment_population BIGINT,
    intersected_sectors_count INT,
    sector_names TEXT[]
)
LANGUAGE plpgsql
AS $$
DECLARE
    cand_geom GEOMETRY;
BEGIN
    SELECT location INTO cand_geom FROM candidate_sites WHERE id = p_candidate_id;
    IF cand_geom IS NULL THEN
        RAISE EXCEPTION 'Candidate site with id % not found', p_candidate_id;
    END IF;

    RETURN QUERY
    SELECT 
        p_candidate_id::VARCHAR(50),
        COALESCE(SUM(s.population), 0)::BIGINT AS total_catchment_population,
        COUNT(s.id)::INT AS intersected_sectors_count,
        ARRAY_AGG(s.sector_name ORDER BY s.population DESC) AS sector_names
    FROM sectors s
    WHERE ST_DWithin(
        s.center_point::geography,
        cand_geom::geography,
        p_radius_km * 1000.0
    );
END;
$$;

-- 5.2 Find Nearest Hospital for Any Coordinate
CREATE OR REPLACE FUNCTION fn_find_nearest_hospital(
    p_lng DOUBLE PRECISION,
    p_lat DOUBLE PRECISION
)
RETURNS TABLE (
    hospital_id VARCHAR(50),
    hospital_name VARCHAR(255),
    hospital_sector VARCHAR(100),
    distance_km DOUBLE PRECISION
)
LANGUAGE plpgsql
AS $$
DECLARE
    query_point GEOMETRY;
BEGIN
    query_point := ST_SetSRID(ST_MakePoint(p_lng, p_lat), 4326);

    RETURN QUERY
    SELECT 
        h.id,
        h.name,
        h.sector,
        ROUND((ST_Distance(h.location::geography, query_point::geography) / 1000.0)::NUMERIC, 2)::DOUBLE PRECISION AS distance_km
    FROM hospitals h
    ORDER BY h.location <-> query_point
    LIMIT 1;
END;
$$;

-- 5.3 Aggregated Hospital Bed Deficit by Zone
CREATE OR REPLACE FUNCTION fn_hospital_bed_deficit_by_zone()
RETURNS TABLE (
    zone VARCHAR(50),
    total_population BIGINT,
    total_beds BIGINT,
    beds_per_1000 NUMERIC(6, 2),
    who_standard_deficit_beds BIGINT
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    WITH zone_pop AS (
        SELECT s.zone, SUM(s.population) AS pop
        FROM sectors s
        GROUP BY s.zone
    ),
    zone_hosp AS (
        SELECT s.zone, COALESCE(SUM(h.beds), 0) AS beds
        FROM sectors s
        LEFT JOIN hospitals h ON h.sector = s.sector_name
        GROUP BY s.zone
    )
    SELECT 
        zp.zone,
        zp.pop AS total_population,
        COALESCE(zh.beds, 0)::BIGINT AS total_beds,
        ROUND((COALESCE(zh.beds, 0)::NUMERIC / (zp.pop::NUMERIC / 1000.0)), 2) AS beds_per_1000,
        GREATEST(0, CEIL((zp.pop * 3.0 / 1000.0) - COALESCE(zh.beds, 0)))::BIGINT AS who_standard_deficit_beds
    FROM zone_pop zp
    LEFT JOIN zone_hosp zh ON zh.zone = zp.zone
    ORDER BY who_standard_deficit_beds DESC;
END;
$$;

-- 5.4 Dynamic MCDA Re-weighting Stored Procedure
CREATE OR REPLACE FUNCTION fn_recalculate_suitability(
    p_w_pop DOUBLE PRECISION DEFAULT 0.30,
    p_w_gap DOUBLE PRECISION DEFAULT 0.25,
    p_w_road DOUBLE PRECISION DEFAULT 0.15,
    p_w_transit DOUBLE PRECISION DEFAULT 0.15,
    p_w_land DOUBLE PRECISION DEFAULT 0.15
)
RETURNS TABLE (
    site_id VARCHAR(50),
    site_name VARCHAR(255),
    composite_score NUMERIC(5, 2),
    new_rank BIGINT
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    WITH calculated AS (
        SELECT 
            c.id,
            c.name,
            ROUND((
                (c.population_demand_score * p_w_pop +
                 c.healthcare_gap_score * p_w_gap +
                 c.road_connectivity_score * p_w_road +
                 c.transit_access_score * p_w_transit +
                 c.land_availability_score * p_w_land) * 100.0
            )::NUMERIC, 2) AS score
        FROM candidate_sites c
    )
    SELECT 
        calc.id,
        calc.name,
        calc.score,
        DENSE_RANK() OVER (ORDER BY calc.score DESC) AS new_rank
    FROM calculated calc
    ORDER BY calc.score DESC;
END;
$$;

-- ==============================================================================
-- 6. Row Level Security (RLS) Configuration
-- ==============================================================================

ALTER TABLE sectors ENABLE ROW LEVEL SECURITY;
ALTER TABLE hospitals ENABLE ROW LEVEL SECURITY;
ALTER TABLE candidate_sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE model_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE benchmark_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE dataset_registry ENABLE ROW LEVEL SECURITY;

-- Public Read Policies (Allow frontend/planners to query data freely)
CREATE POLICY "Public Read Access: Sectors" ON sectors FOR SELECT USING (true);
CREATE POLICY "Public Read Access: Hospitals" ON hospitals FOR SELECT USING (true);
CREATE POLICY "Public Read Access: Candidate Sites" ON candidate_sites FOR SELECT USING (true);
CREATE POLICY "Public Read Access: Benchmarks" ON benchmark_results FOR SELECT USING (true);
CREATE POLICY "Public Read Access: Tests" ON test_results FOR SELECT USING (true);
CREATE POLICY "Public Read Access: Dataset Registry" ON dataset_registry FOR SELECT USING (true);
CREATE POLICY "Public Read Access: Model Runs" ON model_runs FOR SELECT USING (true);

-- Authenticated / Service Role Insert Policies
CREATE POLICY "Service Role Full Access: Model Runs" ON model_runs FOR ALL USING (true);
CREATE POLICY "Service Role Full Access: Benchmarks" ON benchmark_results FOR ALL USING (true);
CREATE POLICY "Service Role Full Access: Tests" ON test_results FOR ALL USING (true);
