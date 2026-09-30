# CityTwin AI — Official Dataset Registry & Provenance Specification

This document serves as the single source of truth for all spatial, demographic, infrastructure, and healthcare datasets utilized across **CityTwin AI** for the Union Territory of Chandigarh, India.

---

## 1. Master Dataset Provenance Table

| Dataset Identifier | Domain | Official Source | Source URL | Legal License | Geographic Bounding Box | CRS | Format | Row Count | Null Count |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `chd-census-sectors-2011` | Demographics | Office of the Registrar General & Census Commissioner, India (Census 2011) | [censusindia.gov.in](https://censusindia.gov.in) | GODL-India (Government Open Data License) | `[76.7000, 30.6800, 76.8550, 30.7950]` | EPSG:4326 | GeoJSON / JSON | 64 sectors | 0 |
| `chd-health-facilities-2024` | Healthcare Infrastructure | Directorate of Health Services UT Chandigarh & MoHFW Facility Registry | [chandigarh.gov.in](http://chandigarh.gov.in/health_gmsh.htm) / [pgimer.edu.in](https://pgimer.edu.in) | Public Official Records | `[76.7210, 30.6970, 76.8480, 30.7645]` | EPSG:4326 | JSON | 11 facilities | 0 |
| `chd-master-plan-parcels-2031` | Urban Planning / Land Banks | Department of Urban Planning, Chandigarh Administration (Master Plan 2031) | [chandigarh.gov.in/plan_mp2031.htm](http://chandigarh.gov.in/plan_mp2031.htm) | Official Municipal Town Planning Record | `[76.7020, 30.6870, 76.8490, 30.7710]` | EPSG:4326 | JSON | 6 candidate sites | 0 |
| `chd-corbusier-v7-transit` | Transportation & Connectivity | Chandigarh Transport Undertaking (CTU) & Master Plan 7Vs Road Grid | [tu.chd.gov.in](https://tu.chd.gov.in) | GODL-India | `[76.7000, 30.6800, 76.8550, 30.7950]` | EPSG:4326 | JSON | 2 key terminals + 64 sector scores | 0 |

---

## 2. Dataset Schema & Column Dictionaries

### A. Sectors Dataset (`chandigarh_sectors.json` / `chandigarh_sectors.geojson`)
- **Primary Key:** `sector_name` (String, e.g., `"Sector 52"`, `"Manimajra"`)
- **Foreign Keys / Joins:** Joined to candidate sites via `sector_name`; joined to hospitals via `sector`.

| Column | Type | Nullable | Units / Scale | Description |
| :--- | :--- | :--- | :--- | :--- |
| `sector_name` | String | No | Unique identifier | Official Le Corbusier Sector or Periphery Township Name |
| `center` | Array[Float] | No | `[lng, lat]` | Geometric centroid of sector polygon in EPSG:4326 |
| `zone` | String | No | Categorical | Planning Zone (North, Central, South, South-West, East, etc.) |
| `population` | Integer | No | Persons | 2011 Census population extrapolated to 2026 planning base |
| `area_sqkm` | Float | No | $km^2$ | Planar area of the sector polygon ($0.575\text{ km}^2$ standard grid) |
| `density_per_sqkm` | Float | No | $\text{Persons}/km^2$ | Population density per square kilometer |
| `land_use` | String | No | Categorical | Primary Le Corbusier zoning classification |
| `existing_hospitals_count` | Integer | No | Count | Number of primary/tertiary hospitals inside this sector |
| `nearest_hospital` | String | No | Facility Name | Nearest public/private major hospital |
| `distance_to_nearest_hospital_km` | Float | No | Kilometers | Euclidean/Network distance from centroid to nearest hospital |
| `road_connectivity_score` | Float | No | $0.0 - 1.0$ | V1-V3 arterial road frontage and intersection density score |
| `public_transit_score` | Float | No | $0.0 - 1.0$ | CTU bus frequency and terminal accessibility index |

---

### B. Existing Healthcare Facilities (`chandigarh_hospitals.json`)
- **Primary Key:** `id` (String, e.g., `"hosp-pgimer"`, `"hosp-gmch-32"`)

| Column | Type | Nullable | Units / Scale | Description |
| :--- | :--- | :--- | :--- | :--- |
| `id` | String | No | Slug | Unique hospital identifier |
| `name` | String | No | String | Official registered name of hospital |
| `type` | String | No | Categorical | Hierarchy: Apex Institute, Medical College, Civil Hospital, Clinic |
| `sector` | String | No | Sector link | Sector where facility is situated |
| `coordinates` | Array[Float] | No | `[lng, lat]` | Facility entrance coordinate in EPSG:4326 |
| `beds` | Integer | No | Count | Sanctioned operational inpatient bed capacity |
| `emergency` | Boolean | No | True / False | 24/7 dedicated emergency casualty department availability |
| `trauma_center` | Boolean | No | True / False | Dedicated Level-I/II/III trauma facility availability |
| `icu_beds` | Integer | No | Count | Operational intensive care unit beds |
| `daily_opd` | Integer | No | Patients / Day | Average daily outpatient department attendance |
| `source` | String | No | Reference | Official government health registry source |

---

### C. Candidate Hospital Sites (`chandigarh_candidate_sites.json`)
- **Primary Key:** `id` (String, e.g., `"cand-site-1"`, `"cand-site-2"`)

| Column | Type | Nullable | Units / Scale | Description |
| :--- | :--- | :--- | :--- | :--- |
| `id` | String | No | Slug | Unique candidate parcel identifier |
| `name` | String | No | String | Site nomenclature and location descriptor |
| `sector` | String | No | Sector link | Sector in which the vacant parcel resides |
| `coordinates` | Array[Float] | No | `[lng, lat]` | Parcel centroid in EPSG:4326 |
| `vacant_land_acres` | Float | No | Acres | Available contiguous land area zoned for institutional development |
| `population_within_2km` | Integer | No | Persons | Demographic catchment radius (2.0 km) |
| `distance_to_nearest_hospital_km` | Float | No | Kilometers | Shortest distance to existing operational hospital |
| `road_access` | String | No | Description | Frontage road corridor classification (e.g. Vikas Marg, PR-7) |
| `transit_access_score` | Float | No | $0.0 - 1.0$ | Proximity to CTU terminals and bus route frequency |
| `road_connectivity_score` | Float | No | $0.0 - 1.0$ | V2/V3 arterial ingress/egress capability |
| `land_availability_score` | Float | No | $0.0 - 1.0$ | Normalized land score (target: 15 acres) |
| `healthcare_gap_score` | Float | No | $0.0 - 1.0$ | Distance to nearest facility (target: 5 km) |
| `population_demand_score` | Float | No | $0.0 - 1.0$ | Catchment demand index (target: 150,000 persons) |
| `suitability_score` | Float | No | $0 - 100$ | Baseline multi-criteria decision composite suitability score |
| `rank` | Integer | No | 1 to 6 | Relative priority ranking under baseline planning weights |
| `recommended_type` | String | No | Facility spec | Specific hospital tier recommended for the site |
| `estimated_cost_cr` | Float | No | ₹ Crores | Projected capital expenditure including land civil works |
| `rationale` | String | No | Text | Municipal explainability justification |

---

## 3. Spatial Quality Assurance & Validation Rules

1. **Strict Spatial Enclosure:**
   - Every coordinate must satisfy:
     $$\text{Latitude} \in [30.6800^\circ\text{N}, 30.7950^\circ\text{N}]$$
     $$\text{Longitude} \in [76.7000^\circ\text{E}, 76.8550^\circ\text{E}]$$
   - Any point violating these limits triggers a fatal build error.
2. **Coordinate Reference System (CRS):**
   - Strictly `EPSG:4326` (WGS 84) across all GeoJSON and JSON outputs.
   - For planar distance calculations, Euclidean spherical approximations via Haversine or PostGIS `ST_Distance(geography, geography)` are enforced.
3. **No Fabricated Data Rule:**
   - Real hospitals reflect actual operational data (PGIMER, GMCH 32, GMSH 16, Civil Hospitals 22, 45, Manimajra).
   - Candidate parcels reflect real vacant institutional zones designated in the Chandigarh Master Plan 2031.
