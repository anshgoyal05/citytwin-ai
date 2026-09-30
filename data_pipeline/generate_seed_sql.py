"""
CityTwin AI — Supabase PostGIS Seed Generator
Generates supabase/migrations/002_seed_data.sql from clean processed datasets.
Formats geometry points using ST_SetSRID(ST_MakePoint(lng, lat), 4326)
and polygons using ST_GeomFromGeoJSON(...).
"""

import json
import os

def generate_seed():
    os.makedirs("supabase/migrations", exist_ok=True)

    with open("data/processed/chandigarh_sectors.geojson") as f:
        geojson = json.load(f)

    with open("data/processed/chandigarh_sectors.json") as f:
        sectors = json.load(f)

    with open("data/processed/chandigarh_hospitals.json") as f:
        hospitals = json.load(f)

    with open("data/processed/chandigarh_candidate_sites.json") as f:
        candidates = json.load(f)

    # Map polygons from geojson
    polygon_map = {}
    for feat in geojson["features"]:
        sname = feat["properties"]["sector_name"]
        polygon_map[sname] = json.dumps(feat["geometry"])

    sql_lines = [
        "-- ==============================================================================",
        "-- CityTwin AI — Migration 002: Seed Data for Chandigarh Union Territory",
        "-- Contains authoritative data for 64 sectors, 11 hospitals, 6 candidate sites",
        "-- and dataset registry entries.",
        "-- ==============================================================================",
        "",
        "BEGIN;",
        "",
        "-- 1. Seed Dataset Registry",
        "INSERT INTO dataset_registry (dataset_key, domain, name, official_source, source_url, license, row_count, crs, bbox) VALUES",
        "('chd-census-sectors-2011', 'Demographics', 'Chandigarh Sector Demographics & Boundaries', 'Office of Registrar General & Census Commissioner, India', 'https://censusindia.gov.in', 'GODL-India', 64, 'EPSG:4326', '{\"min_lng\": 76.7000, \"min_lat\": 30.6800, \"max_lng\": 76.8550, \"max_lat\": 30.7950}'::jsonb),",
        "('chd-health-facilities-2024', 'Healthcare Infrastructure', 'Chandigarh Public & Private Hospital Registry', 'Directorate of Health Services UT Chandigarh', 'http://chandigarh.gov.in', 'Official Records', 11, 'EPSG:4326', '{\"min_lng\": 76.7210, \"min_lat\": 30.6970, \"max_lng\": 76.8480, \"max_lat\": 30.7645}'::jsonb),",
        "('chd-master-plan-parcels-2031', 'Urban Planning', 'Chandigarh Master Plan 2031 Institutional Parcels', 'Department of Urban Planning Chandigarh Admin', 'http://chandigarh.gov.in/plan_mp2031.htm', 'Municipal Record', 6, 'EPSG:4326', '{\"min_lng\": 76.7020, \"min_lat\": 30.6870, \"max_lng\": 76.8490, \"max_lat\": 30.7710}'::jsonb),",
        "('chd-transit-network-2024', 'Transportation', 'CTU Transit Terminals & Arterial Hierarchy', 'Chandigarh Transport Undertaking', 'https://tu.chd.gov.in', 'GODL-India', 64, 'EPSG:4326', '{\"min_lng\": 76.7000, \"min_lat\": 30.6800, \"max_lng\": 76.8550, \"max_lat\": 30.7950}'::jsonb)",
        "ON CONFLICT (dataset_key) DO NOTHING;",
        ""
    ]

    # 2. Seed Sectors
    sql_lines.append("-- 2. Seed Sectors (64 sectors)")
    sql_lines.append("INSERT INTO sectors (sector_name, zone, population, area_sqkm, density_per_sqkm, land_use, existing_hospitals_count, nearest_hospital, distance_to_nearest_hospital_km, road_connectivity_score, public_transit_score, center_point, geom) VALUES")

    sector_rows = []
    for s in sectors:
        sname = s["sector_name"].replace("'", "''")
        zone = s["zone"].replace("'", "''")
        land_use = s["land_use"].replace("'", "''")
        nearest = s["nearest_hospital"].replace("'", "''")
        c_lng, c_lat = s["center"]
        poly_geom = polygon_map.get(s["sector_name"], "{}")

        row = f"('{sname}', '{zone}', {s['population']}, {s['area_sqkm']}, {s['density_per_sqkm']}, '{land_use}', {s['existing_hospitals_count']}, '{nearest}', {s['distance_to_nearest_hospital_km']}, {s['road_connectivity_score']}, {s['public_transit_score']}, ST_SetSRID(ST_MakePoint({c_lng}, {c_lat}), 4326), ST_SetSRID(ST_GeomFromGeoJSON('{poly_geom}'), 4326))"
        sector_rows.append(row)

    sql_lines.append(",\n".join(sector_rows))
    sql_lines.append("ON CONFLICT (sector_name) DO UPDATE SET population = EXCLUDED.population, density_per_sqkm = EXCLUDED.density_per_sqkm;")
    sql_lines.append("")

    # 3. Seed Hospitals
    sql_lines.append("-- 3. Seed Existing Hospitals (11 facilities)")
    sql_lines.append("INSERT INTO hospitals (id, name, type, sector, beds, emergency, trauma_center, icu_beds, daily_opd, source, location) VALUES")
    hosp_rows = []
    for h in hospitals:
        hid = h["id"]
        hname = h["name"].replace("'", "''")
        htype = h["type"].replace("'", "''")
        hsec = h["sector"].replace("'", "''")
        hsrc = h["source"].replace("'", "''")
        lng, lat = h["coordinates"]
        row = f"('{hid}', '{hname}', '{htype}', '{hsec}', {h['beds']}, {str(h['emergency']).upper()}, {str(h['trauma_center']).upper()}, {h['icu_beds']}, {h['daily_opd']}, '{hsrc}', ST_SetSRID(ST_MakePoint({lng}, {lat}), 4326))"
        hosp_rows.append(row)
    sql_lines.append(",\n".join(hosp_rows))
    sql_lines.append("ON CONFLICT (id) DO UPDATE SET beds = EXCLUDED.beds, daily_opd = EXCLUDED.daily_opd;")
    sql_lines.append("")

    # 4. Seed Candidate Sites
    sql_lines.append("-- 4. Seed Candidate Hospital Sites (6 parcels)")
    sql_lines.append("INSERT INTO candidate_sites (id, name, sector, description, vacant_land_acres, population_within_2km, distance_to_nearest_hospital_km, road_access, transit_access_score, road_connectivity_score, land_availability_score, healthcare_gap_score, population_demand_score, suitability_score, rank, recommended_type, estimated_cost_cr, rationale, location) VALUES")
    cand_rows = []
    for c in candidates:
        cid = c["id"]
        cname = c["name"].replace("'", "''")
        csec = c["sector"].replace("'", "''")
        cdesc = c["description"].replace("'", "''")
        croad = c["road_access"].replace("'", "''")
        crec = c["recommended_type"].replace("'", "''")
        crat = c["rationale"].replace("'", "''")
        lng, lat = c["coordinates"]
        row = f"('{cid}', '{cname}', '{csec}', '{cdesc}', {c['vacant_land_acres']}, {c['population_within_2km']}, {c['distance_to_nearest_hospital_km']}, '{croad}', {c['transit_access_score']}, {c['road_connectivity_score']}, {c['land_availability_score']}, {c['healthcare_gap_score']}, {c['population_demand_score']}, {c['suitability_score']}, {c['rank']}, '{crec}', {c['estimated_cost_cr']}, '{crat}', ST_SetSRID(ST_MakePoint({lng}, {lat}), 4326))"
        cand_rows.append(row)
    sql_lines.append(",\n".join(cand_rows))
    sql_lines.append("ON CONFLICT (id) DO UPDATE SET suitability_score = EXCLUDED.suitability_score, rank = EXCLUDED.rank;")
    sql_lines.append("")

    sql_lines.append("COMMIT;")
    sql_lines.append("")

    with open("supabase/migrations/002_seed_data.sql", "w") as f:
        f.write("\n".join(sql_lines))

    print("✓ Successfully generated supabase/migrations/002_seed_data.sql")

if __name__ == "__main__":
    generate_seed()
