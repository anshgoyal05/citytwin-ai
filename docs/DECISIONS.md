# CityTwin AI — Architecture & Design Decision Records (ADR)

## ADR-001: Scope & Geographical Focus
- **Decision:** Narrow scope exclusively to **Chandigarh, India**, with primary focus on **hospital location recommendation**.
- **Rationale:** Aligns strictly with the FA-1 Presentation and FA-2 Project Proposal. Chandigarh features a world-renowned, highly structured sector grid (Le Corbusier plan) which provides an ideal geometry for spatial accessibility modeling, polygon catchment analysis, and digital twin simulation.
- **Status:** Accepted.

## ADR-002: Spatial Database — Supabase (PostgreSQL + PostGIS)
- **Decision:** Migrate from document-based MongoDB (originally considered in FA-2) to **Supabase (PostgreSQL with PostGIS)**.
- **Rationale:** Native PostGIS spatial types (`GEOMETRY(Polygon, 4326)`, `GEOMETRY(Point, 4326)`), spatial indexing (`GIST`), and native functions (`ST_DWithin`, `ST_Distance`, `ST_Area`, `ST_Buffer`) provide mathematically exact GIS operations and high performance for urban catchment analysis, avoiding inefficient manual coordinates calculations.
- **Status:** Accepted.

## ADR-003: 3D Visualization Engine — MapLibre GL JS + deck.gl
- **Decision:** Replace standard 2D Leaflet with **MapLibre GL JS** combined with **deck.gl**.
- **Rationale:** Allows client-side 60fps WebGL rendering of 3D extruded building footprints, terrain, pitch/bearing camera transitions, polygon sector grids with dynamic choropleths, 3D extruded columns for population density, and animated isochrone wave catchments without requiring expensive proprietary API keys.
- **Status:** Accepted.

## ADR-004: Visual Language — Apple-Grade Human Interface Guidelines
- **Decision:** Adopt an Apple-inspired visual design system: generous whitespace, refined typography (`system-ui, -apple-system, BlinkMacSystemFont, "Inter"`), frosted glass glassmorphism (`backdrop-blur-2xl bg-white/80 border border-black/5`), soft progressive shadows, micro-interactions, and accessible contrast.
- **Rationale:** CityTwin AI is an executive decision-support tool for urban planners and administrators; clarity, restraint, and cinematic presentation elevate trust and usability.
- **Status:** Accepted.

## ADR-005: Explainable AI & Scoring Architecture
- **Decision:** Implement a dual-layer intelligence system:
  1. Multi-criteria weighted suitability scoring engine with transparent, normalized factor breakdowns (Population Demand, Existing Hospital Distance Gap, Road Connectivity, Transport Access, Land Availability).
  2. Machine learning layer (Random Forest Regressor / Gradient Boosting) trained with spatial sector grouping to prevent data leakage, benchmarked against baseline regressors.
- **Rationale:** Black-box recommendations are unacceptable for multimillion-dollar municipal infrastructure decisions. Planners must see exactly why a site scores higher and simulate "what-if" weight adjustments.
- **Status:** Accepted.

## ADR-006: Spatial GroupKFold Cross-Validation by Planning Zone
- **Decision:** Group observations strictly by administrative Planning Zone during 5-fold cross-validation rather than standard random k-fold splitting.
- **Rationale:** Standard random cross-validation leaks spatial autocorrelation between adjacent sectors (Tobler's First Law of Geography), creating unrealistically optimistic evaluation scores. Zone-grouped validation proves that models generalize across unseen geographical sub-districts.
- **Status:** Accepted.

## ADR-007: Resilient Fallback Architecture (Local Store & Vector Renderer)
- **Decision:** Implement zero-dependency fallback layers:
  1. Frontend: High-fidelity interactive vector canvas fallback in `Chandigarh3DMap.tsx` when WebGL2 context is unavailable (e.g. headless CI/CD, older laptops).
  2. Backend: In-memory/filesystem JSON data store fallback in `server/db.ts` when remote Supabase database credentials are not yet configured in `.env`.
- **Rationale:** Ensures immediate out-of-the-box evaluation without requiring developers or evaluators to provision external cloud credentials before viewing the platform.
- **Status:** Accepted.

## ADR-008: Monte Carlo Benchmark & Invariant-Based Hard Validation
- **Decision:** Enforce mandatory automated verification of $\ge 1,000$ Monte Carlo benchmark runs across the 5-simplex weight space and $\ge 200$ test cases per component ($\ge 800$ total) checking mathematical invariants (boundedness, monotonicity, scale invariance).
- **Rationale:** Infrastructure planning models must mathematically guarantee that they cannot produce nonsensical outputs (e.g. negative scores, scores exceeding 100, or score decreases upon population increases).
- **Status:** Accepted.
