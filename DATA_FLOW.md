# CityTwin AI — End-to-End Spatial Data Flow

## 1. End-to-End Data Pipeline Architecture

```mermaid
sequenceDiagram
    autonumber
    participant Raw as Primary Gov Sources (data.gov.in / Census)
    participant Pipeline as Python Data Pipeline (/data_pipeline/)
    participant DB as Supabase PostGIS (PostgreSQL 16)
    participant Model as Spatial MCDA & ML Engine
    participant API as Node/Express Spatial API
    participant Client as 3D Planning Dashboard (Deck.GL + React)

    Raw->>Pipeline: Raw CSV, SHP, GeoJSON (Census 2011, Health Directory)
    Note over Pipeline: Data Cleaning, Deduplication, CRS Standardization (EPSG:4326), Spatial Joins on Sector Keys
    Pipeline->>DB: Bulk Upsert into PostGIS (sectors, hospitals, candidate_sites)
    
    Model->>DB: Query Spatial Points & Polygons
    Note over Model: Calculate ST_Distance, Population Density Choropleths, 5/10/15-min Catchment Isochrones
    Model->>DB: Store Scored Candidate Sites & 1,000+ Benchmark Runs
    
    Client->>API: GET /api/sectors, GET /api/candidate-sites?weights={...}
    API->>DB: Execute Indexed Spatial Query (GIST)
    DB-->>API: Return GeoJSON FeatureCollections
    API-->>Client: Stream Standardized Spatial Telemetry
    
    Note over Client: Client renders 60fps 3D Extruded Columns, Ranked Markers, & Explainability Radar
    Client->>Client: Planner adjusts weight sliders -> Instant Dynamic Score Recalculation
```

---

## 2. Key Dataset Ingestion & Join Relations

```mermaid
erDiagram
    SECTORS ||--o{ HOSPITALS : contains
    SECTORS ||--o{ CANDIDATE_SITES : bounds
    CANDIDATE_SITES ||--o{ BENCHMARK_RESULTS : evaluated_in
    DATASET_REGISTRY ||--o{ SECTORS : provenance_of

    SECTORS {
        string sector_name PK "e.g. 'Sector 52', 'Manimajra'"
        string zone "North, Central, South, West"
        int population "Census 2011 / 2026 Proj"
        float area_sqkm "Calculated geometric area"
        float density_per_sqkm "population / area"
        geometry geom "Polygon EPSG:4326"
    }

    HOSPITALS {
        string id PK "e.g. 'hosp-pgimer'"
        string name "PGIMER, GMCH 32, etc."
        string sector FK "Foreign key to SECTORS.sector_name"
        int beds "Total staffed beds"
        geometry geom "Point EPSG:4326"
    }

    CANDIDATE_SITES {
        string id PK "e.g. 'cand-site-1'"
        string name "Site Alpha: Sector 52"
        string sector FK "Foreign key to SECTORS.sector_name"
        float vacant_land_acres "Municipal parcel size"
        int population_within_2km "PostGIS ST_DWithin aggregate"
        float distance_to_nearest_hospital_km "PostGIS ST_Distance minimum"
        float suitability_score "Composite 0-100 score"
        int rank "Priority order 1..6"
        geometry geom "Point EPSG:4326"
    }

    BENCHMARK_RESULTS {
        uuid id PK
        int iteration_number "1 to 1000"
        jsonb weight_configuration "Active weights snapshot"
        string top_candidate_id FK
        float mean_score
        float std_score
        float execution_time_ms
    }

    DATASET_REGISTRY {
        string dataset_id PK
        string source_name "Census of India / OGD India"
        string source_url "Primary portal URL"
        string license "Government Open Data License - India"
        string retrieval_date "ISO 8601"
        int record_count
        string coordinate_validity "Validated inside Chandigarh bounding box"
    }
```

---

## 3. Data Processing & Cleaning Protocol

1. **Raw Ingestion (`/data/raw/`)**:
   - Files are stored in immutable raw formats.
   - Primary sources: Census of India 2011 Village/Town Directory, UT Chandigarh Health Department Official Directory, OGD Platform India.
2. **Quality & Validation Checks**:
   - Coordinate bounding box check: Latitude `30.6800` to `30.7950` N, Longitude `76.7200` to `76.8450` E. All records outside this box are flagged as invalid.
   - Sector Name Standardization: Fuzzy mapping ("Sec 52", "Sector-52", "52 Sector" $\rightarrow$ `"Sector 52"`).
   - Coordinate Reference System (CRS): Standardized strictly to `WGS84 (EPSG:4326)`.
3. **Feature Derivation**:
   - Population density: $\text{Density} = \frac{\text{Population}}{\text{Area}_{\text{sqkm}}}$.
   - Distance to Nearest Hospital: Euclidean and road-corridor distance in kilometers to nearest operational facility with emergency wards.
   - Healthcare Coverage Gap Score: Higher distance to existing hospitals yields higher priority for new facility intervention.
