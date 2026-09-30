# CityTwin AI — Codebase & Architectural Audit

**Document Date:** October 2026  
**Auditor:** Senior Full-Stack & Spatial Data/ML Engineering Team  
**Scope:** Initial state evaluation against FA-1 Presentation, FA-2 Project Proposal, and System Requirements.

---

## 1. Executive Summary & Source Document Alignment

### 1.1 Foundation & Ground Truth Documents
- **FA-1 Presentation (`docs/source/FA-1 Presentation Slide Format (1).ppt`)**:
  - Defines the core rationale: *"If we compare multiple options before buying a ₹1 lakh laptop, shouldn't governments do the same before investing thousands of crores in building a city's future?"*
  - Identifies the vision: AI-powered Digital Twin platform to analyze urban data, forecast infrastructure demand, recommend optimal facility locations, simulate planning scenarios, and provide explainable AI recommendations.
- **FA-2 Project Report (`docs/source/FA2-Report_formatted (1).docx`)**:
  - Focuses the prototype strictly on **Chandigarh, India**, with the primary operational use case being **hospital location recommendation**.
  - Mandates the use of primary, official government datasets (Census of India, Open Government Data Platform `data.gov.in`, Chandigarh Administration GIS / health portals), with OpenStreetMap (OSM) as a fallback geometry provider.
  - Specifies an explainable multi-criteria weighted suitability scoring engine (population demand, distance to existing hospitals, road connectivity, transport accessibility, land availability), combined with machine learning models for demand and site suitability.
- **Architectural Evolutions from Original Proposal**:
  1. **Database:** Upgraded from document-store MongoDB to **Supabase (PostgreSQL with PostGIS extensions)** to support native spatial queries (e.g., `ST_DWithin`, `ST_Distance`, `ST_Contains`, `ST_Buffer`, spatial indexing).
  2. **Map & 3D Visualization:** Upgraded from standard 2D Leaflet to **MapLibre GL JS + deck.gl** for a real 3D digital twin of Chandigarh with extruded buildings, sector boundaries, terrain/camera tilt, smooth fly-tos, and spatial overlays.

---

## 2. Codebase Structure & Architecture Audit

### 2.1 Directory Structure
```
AAIPD Project/
├── dist/                     # Static build output (pre-existing)
├── docs/
│   ├── source/               # Source FA-1 (.ppt) and FA-2 (.docx)
│   └── AUDIT.md              # This audit report
├── public/                   # Static icons & favicons
├── src/
│   ├── assets/               # Hero images and Vite/React SVGs
│   ├── components/
│   │   ├── BuildingPopup.tsx # Procedural building popup modal
│   │   ├── MiniMap.tsx       # Leaflet 2D map widget
│   │   ├── Navbar.tsx        # Top navigation bar
│   │   ├── Sidebar.tsx       # Navigation sidebar
│   │   └── three/            # React Three Fiber components
│   │       ├── BuildingGenerator.tsx
│   │       ├── CityLighting.tsx
│   │       ├── CityScene.tsx
│   │       ├── RoadSystem.tsx
│   │       ├── TreeGenerator.tsx
│   │       ├── VehicleSystem.tsx
│   │       ├── WaterBody.tsx
│   │       └── WeatherSystem.tsx
│   ├── context/
│   │   └── CityContext.tsx   # Global state provider
│   ├── pages/
│   │   ├── Agents.tsx        # Simulated agent status list
│   │   ├── Analytics.tsx     # Recharts analytical charts
│   │   ├── Assistant.tsx     # Mock conversational assistant
│   │   ├── Dashboard.tsx     # Main 3D Three.js view + controls
│   │   ├── Landing.tsx       # Landing page with hero 3D canvas
│   │   ├── Reports.tsx       # Simulated report generator
│   │   └── Simulation.tsx    # Scenario comparison mockup
│   ├── types.ts              # TypeScript type definitions
│   ├── App.tsx               # Route definitions
│   ├── main.tsx              # React DOM entry point
│   ├── index.css             # Tailwind and global styles
│   └── App.css
├── package.json              # Client dependencies
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

### 2.2 Dependencies & Stack
- **UI Framework:** React 19 (`react: ^19.2.7`, `react-dom: ^19.2.7`), React Router DOM v7 (`^7.18.1`).
- **Styling:** Tailwind CSS v4 (`tailwindcss: ^4.3.3`, `@tailwindcss/postcss: ^4.3.3`), `clsx`, `tailwind-merge`.
- **Motion & Icons:** Framer Motion (`framer-motion: ^12.42.2`), Lucide React (`lucide-react: ^1.27.0`).
- **3D Engine:** Three.js (`three: ^0.185.1`, `@react-three/fiber: ^9.6.1`, `@react-three/drei: ^10.7.7`).
- **2D Mapping:** Leaflet (`leaflet: ^1.9.4`, `react-leaflet: ^5.0.0`).
- **Charts:** Recharts (`recharts: ^3.10.1`).

---

## 3. Findings: What Works vs. Mocked vs. Missing

| Area | Current Codebase State | FA-1 / FA-2 & Specification Requirement | Gap Classification |
| :--- | :--- | :--- | :--- |
| **Target City** | Fictional city named `"Neo-Veridia"` with zones "Zone A", "Zone B", etc. | **Chandigarh, India ONLY** (Sectors 1 to 60+, Manimajra, Industrial Area, etc.) | **Critical Mismatch** |
| **Geospatial Coordinates** | MiniMap centers on Tokyo, Japan (`[35.6762, 139.6503]`). | Chandigarh bounds (~`30.68° N to 30.79° N, 76.72° E to 76.84° E`). | **Critical Mismatch** |
| **3D Representation** | Three.js procedural grid of random colored boxes and looping vehicle animations. | **MapLibre GL JS + deck.gl** real 3D GIS city: extruded buildings, real sector polygons, terrain, hospital POIs. | **Core Upgrade Required** |
| **Use Case Focus** | Generic urban themes: fake metro lines, green space carbon credits, air scrubbing. | **Hospital Location Recommendation**: demand analysis, distance to existing hospitals, coverage gap, road connectivity. | **Functional Pivot Required** |
| **Candidate Scoring** | None. Pure static numbers without algorithmic backing. | **Configurable Weighted Suitability Engine** + explainable factor contributions (radar/bar charts). | **Missing** |
| **Machine Learning** | None. Hardcoded text strings in preset responses. | **Scikit-learn ML layer** (spatial cross-validation, train/val/test splits, baseline comparisons). | **Missing** |
| **Backend API** | None. Frontend runs as standalone Vite SPA with in-memory state. | **Node.js / Express REST API** connecting to PostGIS and serving analytical endpoints. | **Missing** |
| **Database** | None. In-memory dummy state with randomized `setInterval` jitter. | **Supabase (Postgres + PostGIS)** with migrations, spatial indices, candidate sites, runs, benchmarks. | **Missing** |
| **Data Pipeline** | None. No raw data, no ETL scripts, no processed datasets. | **Python reproducible data pipeline** in `/data_pipeline/`, raw files in `/data/raw/`, processed in `/data/processed/`. | **Missing** |
| **Validation & Testing** | Zero tests (`oxlint` only). | ≥1,000 benchmark runs, ≥200 tests per component, real hospital back-testing. | **Missing** |

---

## 4. Detailed Component & Route Breakdown

### 4.1 `src/context/CityContext.tsx`
- **Current State:** Stores `selectedCity: 'Neo-Veridia'`, `selectedZone: 'All'`, dummy layers (`traffic`, `pollution`, `population`, `water`, `infrastructure`), and a `setInterval` that fluctuates metrics with `Math.random()`.
- **Issues:** No connection to actual city data or API endpoints. No support for candidate site selection, weight adjustments, or scenario loading.
- **Required Changes:** Refactor to manage Chandigarh sectors, active layers (existing hospitals, candidate locations, population density, road networks, isochrones/catchment buffers), candidate comparison slots, and live suitability weight configs.

### 4.2 `src/pages/Dashboard.tsx` & `src/components/three/CityScene.tsx`
- **Current State:** Loads a 3D R3F canvas rendering `BuildingGenerator.tsx` (a 6x6 grid of abstract rectangular meshes) and a tiny Leaflet box in the sidebar pointing at Tokyo.
- **Issues:** Does not represent Chandigarh's famous Le Corbusier grid sector structure. Cannot interact with real geographical features or candidate sites.
- **Required Changes:** Upgrade to a unified, full-fidelity **MapLibre GL JS + deck.gl** 3D viewer. Feature Chandigarh's sector boundaries, extruded buildings, layered data filters, clickable sector info cards, animated candidate site markers, and a rich slide-out explanation drawer.

### 4.3 `src/pages/Simulation.tsx`
- **Current State:** Displays three hardcoded cards: "Build New Metro Station", "Increase Green Zones", "Add Smart Traffic Signals" with synthetic Recharts line graphs.
- **Issues:** Unrelated to hospital location planning. Does not allow dynamic scenario comparison or custom candidate evaluation.
- **Required Changes:** Turn into a true **Scenario Comparison Engine** where planners select 2–3 candidate hospital sites (or custom coordinates) and compare coverage gains, population served, accessibility shifts, and trade-offs side by side with visual diffing and map synchronization.

### 4.4 `src/pages/Landing.tsx`
- **Current State:** Generic dark-blue landing page with sci-fi tech buzzwords ("Autonomous multi-agent neural network", "Apple Spatial Urban Intelligence").
- **Issues:** Disconnected from the real mission of CityTwin AI.
- **Required Changes:** Elevate to an **Apple-grade, cinematic product reveal page**:
  - Confident typography (Inter / SF Pro stack), generous whitespace, refined glassmorphism, subtle borders (`border-black/5` / `border-white/10`).
  - Interactive hero featuring a real 3D Chandigarh sector model.
  - Interactive "Why Before Building" interactive simulator highlighting the ₹1 lakh laptop vs. ₹1,000 Cr city infrastructure paradigm from FA-1.
  - Clear entry point into the Hospital Decision Support Platform.

### 4.5 `src/pages/Analytics.tsx`, `Reports.tsx`, `Assistant.tsx`, `Agents.tsx`
- **Current State:** Standalone mock views with simulated timers and static strings.
- **Required Changes:**
  - `Analytics.tsx`: Bind to real Chandigarh spatial demographics (population per sector, hospital bed ratios, distance distributions, road connectivity index).
  - `Reports.tsx`: Generate comprehensive, exportable urban planning feasibility reports based on the suitability engine and ML model predictions.
  - `Assistant.tsx`: Ground conversational query answering in the real Chandigarh spatial database (e.g., "Which sectors are underserved by tertiary healthcare?").
  - `Agents.tsx`: Present real pipeline and validation tasks (Data Ingestion, PostGIS Spatial Engine, Suitability Scorer, ML Validator).

---

## 5. Technical Debt & Immediate Action Items

1. **Version Control:** Initialize git repository, configure `.gitignore` (completed).
2. **Design Tokens:** Standardize Apple-style design tokens (colors: Apple neutral grays `#f5f5f7`, `#1d1d1f`, `#86868b`, system accents; typography; spacing; blur radii; subtle borders) across all views.
3. **Map Upgrade:** Install MapLibre GL JS and deck.gl (`maplibre-gl`, `@deck.gl/core`, `@deck.gl/layers`, `@deck.gl/geo-layers`, `@deck.gl/mapbox`).
4. **Backend Architecture:** Build a robust Node.js / Express backend with spatial API endpoints connecting to PostgreSQL/PostGIS.
5. **Data Pipeline:** Create Python pipeline scripts to fetch, clean, and standardize primary Chandigarh datasets from official portals.
6. **Model & Validation Framework:** Implement the weighted suitability scoring engine and Scikit-learn models, backed by 1,000+ benchmark runs and 200+ unit/integration tests per component.
