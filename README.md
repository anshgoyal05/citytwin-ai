# CityTwin AI — Digital Twin Decision-Support Platform

> **AI-Supported Digital Twin for Urban Infrastructure Planning**  
> *Target Domain:* **Union Territory of Chandigarh, India** (64 Administrative Sectors & Periphery)  
> *Primary Use Case:* **Optimal Hospital Location Recommendation & Scenario Simulation**  

---

## 🏛️ Project Overview

**CityTwin AI** is an AI-supported urban digital twin designed to empower municipal town planners, health administrators, and government authorities to test, validate, and compare future infrastructure decisions in a virtual simulation before committing hundreds of crores in public capital expenditure.

### 🌟 Core Value Proposition
- **Decision Support, NOT Replacement:** Every recommendation is 100% transparent and explainable. No opaque black-box recommendations.
- **Chandigarh-First Reality:** Mapped specifically to Le Corbusier's 60+ sector grid, plus peripheral growth centers (Manimajra, Maloya, Dhanas, Sarangpur).
- **Hard Empirical Validation:** Built on official government records (Census of India, Directorate of Health Services, Master Plan 2031), validated by **1,000 Monte Carlo benchmark simulations** and **1,000 automated unit & invariant tests** (100% pass rate).

---

## 📸 Platform Interface Showcase

| View | Description | Screenshot |
| :--- | :--- | :---: |
| **Landing Hero** | Apple-grade typography, product narrative, and FA-1 project alignment | `docs/screenshots/landing.png` |
| **3D GIS Dashboard** | deck.gl + MapLibre 3D extruded population density columns, hospital markers, isochrones | `docs/screenshots/dashboard_3d.png` |
| **Scenario Sandbox** | Side-by-side trade-off diffing (catchment population delta, cost delta, radar comparison) | `docs/screenshots/simulation_compare.png` |
| **Demographics & Analytics** | Bed-to-population zonal disparities, demographic charts, hospital capacity metrics | `docs/screenshots/analytics.png` |
| **Executive Feasibility Reports** | Official municipal briefing template with print-to-PDF layout and audit seals | `docs/screenshots/reports.png` |
| **Spatial AI Assistant** | Municipal copilot for natural-language spatial queries and site trade-off analysis | `docs/screenshots/assistant.png` |

---

## 🏗️ System Architecture

CityTwin AI is architected with clear boundaries between UI visualization, spatial data services, and predictive ML scoring:

```
┌────────────────────────────────────────────────────────────────────────┐
│                   CityTwin AI Frontend (React 19 + TypeScript)         │
│  - 3D GIS: MapLibre GL JS + deck.gl (Extruded Columns, Isochrones)    │
│  - Design: Apple Glassmorphism, SF Pro/Inter, Lucide Icons, Recharts   │
│  - Views: Dashboard, Scenario Sandbox, Analytics, Reports, Assistant   │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │ HTTP / REST API (Port 5000)
┌──────────────────────────────────▼─────────────────────────────────────┐
│                 Express REST Backend (server/index.ts)                 │
│  - Endpoints: /api/sectors, /api/hospitals, /api/candidate-sites       │
│  - Dynamic MCDA: POST /api/suitability (Real-time weight re-ranking)   │
│  - Scenario Diff: POST /api/scenarios/compare (Side-by-side trade-offs)│
│  - Storage Adapter: Supabase PostGIS with fallback to local JSON       │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │
       ┌───────────────────────────┴───────────────────────────┐
       ▼                                                       ▼
┌──────────────────────────────┐        ┌──────────────────────────────┐
│   Supabase (PostgreSQL 16)   │        │     Python ML & Spatial      │
│  - PostGIS Geometry (4326)   │        │  - Scikit-learn RF & GBDT    │
│  - GIST Spatial Indices      │        │  - Spatial GroupKFold by Zone│
│  - Stored Procedures         │        │  - 1,000 Monte Carlo Runs    │
│  - RLS Security Policies     │        │  - Leave-One-Out Backtesting │
└──────────────────────────────┘        └──────────────────────────────┘
```

---

## 📊 Dataset Provenance & Registry

All spatial data adheres strictly to Chandigarh UT bounds (`30.6800 <= lat <= 30.7950`, `76.7000 <= lng <= 76.8550`, `EPSG:4326`):

| Dataset Key | Official Source | Legal License | Records | Purpose |
| :--- | :--- | :--- | :---: | :--- |
| `chd-census-sectors-2011` | Census of India 2011 / ORGI | GODL-India | 64 sectors | Demographic base, density, areas |
| `chd-health-facilities-2024` | Directorate of Health Services UT Chandigarh | Official Govt Records | 11 hospitals | 4,835 beds, ICU capacity, OPD flow |
| `chd-master-plan-parcels-2031`| Dept of Urban Planning Chandigarh Admin | Municipal Record | 6 parcels | Vacant institutional candidate parcels |
| `chd-transit-network-2024` | Chandigarh Transport Undertaking (CTU) | GODL-India | 64 scores | Arterial road hierarchy and transit |

*For complete provenance metadata, column schemas, and null counts, consult [docs/DATASETS.md](docs/DATASETS.md).*

---

## 🧪 Hard Validation & Empirical Benchmarks

### 1. Monte Carlo Stability Benchmark (1,000 Runs)
- **1,000 independent simulations** were run across randomly sampled weight vectors on the 5-dimensional simplex.
- **Average Latency:** **0.0044 ms** per simulation run (>100,000 evaluations/second).
- **Candidate Stability:**
  - **Site Alpha (Sector 52 / Maloya):** **72.9% win rate** (#1 in 729 / 1,000 runs; mean score $84.6 \pm 5.9$).
  - **Site Beta (Sarangpur):** **27.1% win rate** (#1 in 271 / 1,000 runs; mean score $79.7 \pm 4.0$).
  - Detailed findings in [reports/benchmarks/benchmark_report.md](reports/benchmarks/benchmark_report.md).

### 2. Comprehensive Test Suite (1,000 Tests Across 4 Components)
- **Overall Pass Rate:** **100.0%** (1,000 / 1,000 tests passed).
  - `scoring_engine`: 250 / 250 passed (boundedness, monotonicity, scale invariance).
  - `ml_model`: 250 / 250 passed (RF & GBDT boundedness, determinism, out-of-distribution robustness).
  - `data_pipeline`: 250 / 250 passed (UT bounding box, polygon ring closures, non-null assertions).
  - `api_routes`: 250 / 250 passed (endpoint retrieval, 404 handlers, dynamic MCDA re-ranking).
  - Full report in [reports/test_results.md](reports/test_results.md).

### 3. Ground-Truth Leave-One-Out Backtesting
- Major operational public hospitals were held out one by one to test if the model recovers their location.
- **Civil Hospital Manimajra:** Recovered at **Rank #1 out of 64 sectors** (Top 1.6%).
- **Civil Hospital Sector 22:** Recovered at **Rank #12 out of 64 sectors** (Top 18.8%).
- Detailed rationale for historical apex hospital rankings in [reports/MODEL_REPORT.md](reports/MODEL_REPORT.md).

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** v18+ (tested on v24.19)
- **Python** 3.10+ (tested on v3.14)
- **npm** v9+

### 1. Installation
Clone the repository and install frontend and backend dependencies:
```bash
git clone https://github.com/anshgoyal-dev/citytwin-ai.git
cd citytwin-ai

# Install Node dependencies (Vite, React 19, deck.gl, MapLibre, Express, tsx)
npm install

# Setup Python virtual environment for ML pipeline
python3 -m venv .venv
source .venv/bin/activate
pip install numpy scipy scikit-learn pandas
```

### 2. Running the Application
Open two terminal tabs:

**Tab 1: Start Express Backend API (Port 5000)**
```bash
npm run server
```

**Tab 2: Start Vite Frontend (Port 5173)**
```bash
npm run dev
```
Navigate to `http://localhost:5173` to explore the digital twin.

### 3. Re-running the Pipelines & Validation Suites
```bash
# 1. Ingest, clean, and validate official datasets
python3 data_pipeline/fetch_and_clean_chandigarh_data.py

# 2. Train spatial ML models & run Leave-One-Out backtesting
.venv/bin/python3 data_pipeline/train_models.py

# 3. Execute 1,000 Monte Carlo benchmark simulations
.venv/bin/python3 data_pipeline/run_benchmarks.py

# 4. Execute 1,000 component test cases
.venv/bin/python3 tests/run_component_tests.py

# 5. Run API endpoint integration tests
npx tsx tests/test_api_endpoints.ts
```

---

## 📡 REST API Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | System telemetry, coordinate bounds, storage mode, and asset counts |
| `GET` | `/api/sectors` | Returns all 64 sectors (query filters: `?zone=South`, `?search=52`) |
| `GET` | `/api/sectors/:name` | Single sector details and demographics |
| `GET` | `/api/hospitals` | All 11 hospitals, total bed counts, trauma and emergency availability |
| `GET` | `/api/candidate-sites` | All 6 candidate parcels with suitability scores and municipal specs |
| `POST`| `/api/suitability` | Dynamic MCDA re-weighting with custom weights |
| `POST`| `/api/scenarios/compare`| Side-by-side trade-off diffing between two candidate sites |
| `GET` | `/api/benchmarks` | Latest Monte Carlo benchmark stability metrics |
| `GET` | `/api/benchmarks/tests` | Automated component test results summary |

---

## 📜 Documentation Directory

- [ARCHITECTURE.md](ARCHITECTURE.md) — System components, layer diagrams, and technical design.
- [DATA_FLOW.md](DATA_FLOW.md) — End-to-end data lifecycle from Census to 3D deck.gl layers.
- [docs/DATASETS.md](docs/DATASETS.md) — Official dataset registry, legal licenses, and schemas.
- [docs/DECISIONS.md](docs/DECISIONS.md) — Architectural decision records (ADRs).
- [reports/MODEL_REPORT.md](reports/MODEL_REPORT.md) — Technical ML report, feature importances, and backtesting.
- [reports/benchmarks/benchmark_report.md](reports/benchmarks/benchmark_report.md) — Monte Carlo benchmark results.
- [reports/test_results.md](reports/test_results.md) — Comprehensive test results across 1,000 cases.
- [CHANGELOG.md](CHANGELOG.md) — Detailed version and migration log.

---

## 📄 License
This project is developed under the MIT License. Government datasets are utilized in accordance with the [Government Open Data License - India (GODL)](https://data.gov.in).
