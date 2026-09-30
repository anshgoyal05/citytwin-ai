# Changelog

All notable changes to the **CityTwin AI** project are documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [3.0.0] - 2026-10-01 (Phase 3: Spatial ML Modeling, Hard Validation & Benchmarking)

### Added
- **Machine Learning Pipeline (`data_pipeline/train_models.py`):**
  - Supervised regressors: `RandomForestRegressor`, `GradientBoostingRegressor`, and `Ridge` linear baseline.
  - Spatial Grouped Cross-Validation (`GroupKFold` grouped by municipal Planning Zone) to eliminate spatial autocorrelation data leakage.
  - Leave-One-Out Ground-Truth Backtesting against existing hospitals (PGIMER, GMCH 32, GMSH 16, Civil 22, Civil 45, Civil Manimajra).
  - Serialized model artifacts saved in `models/` (`random_forest_suitability.joblib`, `gradient_boosting_suitability.joblib`, `ridge_linear_suitability.joblib`, `model_metadata.json`).
- **Monte Carlo Benchmark Suite (`data_pipeline/run_benchmarks.py`):**
  - Executed **1,000 independent simulation runs** across random weight configurations on the 5-simplex.
  - Evaluated candidate site ranking stability (Site Alpha 72.9% win rate, Site Beta 27.1% win rate).
  - Telemetry: **0.0044 ms average latency** per simulation (>100,000 evaluations/sec).
  - Outputs generated: `reports/benchmarks/benchmark_summary.json`, `reports/benchmarks/benchmark_runs.json`, `reports/benchmarks/benchmark_report.md`, and SQL seed `reports/benchmarks/seed_benchmark_results.sql`.
- **Comprehensive Hard Validation Test Suite (`tests/run_component_tests.py`):**
  - Executed **1,000 automated test cases** (250 tests across 4 subsystem components):
    - `scoring_engine` (250 tests): Mathematical boundedness $[0, 100]$, demand/gap monotonicity, scale invariance, zero/null edge cases.
    - `ml_model` (250 tests): Prediction boundedness, deterministic repeatability, out-of-distribution robustness.
    - `data_pipeline` (250 tests): Chandigarh UT coordinate bounding box checks, GeoJSON polygon ring closure invariants, non-null attribute assertions.
    - `api_routes` (250 tests): Sector lookup, 404 handlers, dynamic MCDA re-ranking, scenario trade-off deltas.
  - Achieved **100.0% pass rate** (1,000 / 1,000 tests passed).
  - Outputs generated: `reports/test_results.json`, `reports/test_results.md`, and SQL seed `reports/seed_test_results.sql`.
- **Technical Documentation:**
  - Authored comprehensive `reports/MODEL_REPORT.md` detailing architectures, CV metrics, feature importances, LOO backtest, and municipal limitations.
  - Updated `README.md` with complete setup instructions, API reference, architecture diagram, and hard validation summaries.
  - Updated `docs/DECISIONS.md` with ADR-006, ADR-007, and ADR-008.

---

## [2.0.0] - 2026-10-01 (Phase 2: Official Data Pipeline, Supabase PostGIS & Express API)

### Added
- **Official Data Ingestion & Cleaning (`data_pipeline/fetch_and_clean_chandigarh_data.py`):**
  - Ingested primary Census of India 2011 demographics, DHS UT Chandigarh health facilities, and Master Plan 2031 candidate parcels.
  - Implemented strict coordinate bounds validation (`30.6800 <= lat <= 30.7950`, `76.7000 <= lng <= 76.8550`, `EPSG:4326`).
  - Saved raw records in `data/raw/` and validated GeoJSON/JSON in `data/processed/`.
- **Dataset Registry & Exploratory Data Analysis:**
  - Created `docs/DATASETS.md` documenting provenance, licenses, source URLs, schemas, and join keys.
  - Created detailed EDA reports in `reports/eda/` (`eda_sectors.md`, `eda_hospitals.md`, `eda_candidate_sites.md`).
- **Supabase PostGIS Migration Schemas (`supabase/migrations/`):**
  - `001_initial_postgis_setup.sql`: PostGIS extensions, core tables (`sectors`, `hospitals`, `candidate_sites`, `model_runs`, `benchmark_results`, `test_results`, `dataset_registry`), spatial GIST indices, stored procedures (`fn_calculate_catchment_population`, `fn_find_nearest_hospital`, `fn_hospital_bed_deficit_by_zone`, `fn_recalculate_suitability`), and RLS policies.
  - `002_seed_data.sql`: Seed data for 64 sectors with spatial polygons, 11 hospitals, 6 candidate sites, and dataset registry entries.
  - Created `.env.example` template with full connection documentation.
- **Node/Express TypeScript REST API Backend (`server/`):**
  - Developed Express server with `/api/health`, `/api/sectors`, `/api/hospitals`, `/api/candidate-sites`, `/api/suitability`, `/api/scenarios/compare`, and `/api/benchmarks`.
  - Built `server/db.ts` with local JSON store fallback for zero-setup execution when external database credentials are not present.
  - Created automated API endpoint test suite in `tests/test_api_endpoints.ts` (100% pass rate across all endpoints).

---

## [1.0.0] - 2026-09-30 (Phase 1: Frontend Overhaul & Apple Polish)

### Added
- **Design System:** Created `src/styles/tokens.ts` and enhanced `src/index.css` with Apple glassmorphism, SF Pro/Inter typography, system accents, and custom map styling.
- **3D Spatial Map Component:** Built `src/components/map/Chandigarh3DMap.tsx` with MapLibre GL JS (Carto Positron basemap) + deck.gl layers (`GeoJsonLayer` sector choropleth, `ColumnLayer` 3D extruded population density columns, `ScatterplotLayer` for ground-truth hospitals, animated `#1`–`#6` candidate markers, and 5/10/15-minute catchment isochrone rings). Added automatic high-fidelity vector fallback for headless or non-WebGL environments.
- **Explainability Panel:** Built `src/components/ExplainabilityPanel.tsx` with Recharts radar charts, factor-by-factor horizontal progress bars, municipal specs, and plain-English rationales.
- **Scenario Sandbox:** Built `src/pages/Simulation.tsx` for side-by-side trade-off diffing of 2 candidate sites (catchment pop, ₹ Cr outlay, land acres, radar comparison, decision synthesis).
- **Core Views Upgraded:** `src/pages/Landing.tsx`, `src/pages/Dashboard.tsx`, `src/pages/Analytics.tsx`, `src/pages/Reports.tsx`, `src/pages/Assistant.tsx`, `src/pages/Agents.tsx`.
- **System Architecture & Data Flow Docs:** Created `ARCHITECTURE.md` and `DATA_FLOW.md` with complete Mermaid diagrams.
- **Visual Artifacts:** Captured and verified 7 high-resolution screenshots in `docs/screenshots/`.

---

## [0.1.0] - 2026-09-30 (Step 0: Document Audit & Architectural Alignment)

### Added
- Extracted and audited source presentation `FA-1 Presentation Slide Format (1).ppt` and proposal `FA2-Report_formatted (1).docx`.
- Created `docs/AUDIT.md` revealing disconnects in legacy code (mock sci-fi city, Tokyo coordinates, missing spatial database).
- Established initial `docs/DECISIONS.md`.
