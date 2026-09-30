# Exploratory Data Analysis: Chandigarh Urban Sectors

**Dataset:** `data/processed/chandigarh_sectors.json` & `chandigarh_sectors.geojson`  
**Temporal Base:** Census of India 2011 escalated to 2026 infrastructure planning horizon  
**Spatial Coverage:** 64 administrative sectors, including peripheral townships (Manimajra, Maloya, Dhanas, Sarangpur, Industrial Area Phase 1 & 2)  
**Total Population:** 1,483,200  
**Total Land Area:** 36.80 $\text{km}^2$  

---

## 1. Summary Statistics

| Metric | Minimum | 25th Percentile | Median | 75th Percentile | Maximum | Mean | Std Dev |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Population** | 3,200 | 12,400 | 21,800 | 32,500 | 78,500 | 23,175.0 | 14,820.4 |
| **Area ($\text{km}^2$)** | 0.575 | 0.575 | 0.575 | 0.575 | 0.575 | 0.575 | 0.000 |
| **Density ($\text{people}/\text{km}^2$)** | 5,565.2 | 21,565.2 | 37,913.0 | 56,521.7 | 136,521.7 | 40,304.3 | 25,774.6 |
| **Hospital Gap ($\text{km}$)** | 0.00 | 0.88 | 1.42 | 2.15 | 3.31 | 1.49 | 0.79 |
| **Road Connectivity Score** | 0.65 | 0.75 | 0.84 | 0.88 | 0.94 | 0.82 | 0.08 |
| **Transit Accessibility Score** | 0.08 | 0.42 | 0.65 | 0.82 | 0.95 | 0.61 | 0.23 |

---

## 2. Zonal Distribution & Spatial Stratification

| Planning Zone | Sectors Count | Total Population | % of City Population | Mean Density ($\text{pop}/\text{km}^2$) | Existing Hospitals |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **South-West** | 7 | 203,200 | 13.7% | 50,484 | 0 |
| **South** | 5 | 147,500 | 9.9% | 51,304 | 1 (Civil Hospital 45) |
| **Central-West** | 4 | 116,300 | 7.8% | 50,565 | 1 (Civil Hospital 22) |
| **North (Low Density Grid)** | 10 | 93,900 | 6.3% | 16,330 | 2 (PGIMER, GMSH 16) |
| **Far South** | 3 | 83,200 | 5.6% | 48,232 | 0 |
| **West Border** | 3 | 80,200 | 5.4% | 46,493 | 1 (Max Border) |
| **West** | 3 | 79,100 | 5.3% | 45,855 | 1 (AYUSH 24) |
| **East Sub-City (Manimajra)** | 1 | 78,500 | 5.3% | 136,522 | 1 (Civil Hospital Manimajra) |
| **South-East** | 3 | 75,400 | 5.1% | 43,710 | 1 (GMCH 32) |
| **Central** | 4 | 64,300 | 4.3% | 27,957 | 0 |
| **Central-East** | 2 | 62,700 | 4.2% | 54,522 | 0 |
| **East** | 3 | 57,400 | 3.9% | 33,275 | 0 |
| **West Periphery (Maloya)** | 1 | 44,800 | 3.0% | 77,913 | 0 |
| **Far South-West** | 2 | 41,900 | 2.8% | 36,435 | 0 |
| **North-West Periphery (Dhanas)** | 1 | 41,200 | 2.8% | 71,652 | 0 |
| **North-West** | 2 | 36,000 | 2.4% | 31,304 | 0 |
| **South-Central** | 3 | 66,400 | 4.5% | 38,493 | 0 |
| **Far South Border** | 1 | 24,500 | 1.7% | 42,609 | 1 (Fortis Border) |
| **North-East** | 1 | 14,200 | 1.0% | 24,696 | 0 |
| **North-West Hub (Sarangpur)** | 1 | 9,800 | 0.7% | 17,043 | 0 |
| **Industrial Areas (1 & 2)** | 2 | 27,400 | 1.8% | 23,826 | 0 |

---

## 3. Key Spatial Findings & Planning Inequities

1. **The North-South Density Asymmetry:**
   - Sectors 1 through 9 (North Zone) represent low-density, high-income residential and governmental estates (mean density: $16,330/\text{km}^2$), yet host the city's largest healthcare assets: **PGIMER (2,200 beds)** in Sector 12 and **GMSH 16 (500 beds)** in Sector 16.
   - In contrast, the Southern and South-Western sectors (Sectors 38 through 56, Maloya, Dhanas) have densities ranging between $50,000$ and $78,000/\text{km}^2$ and house over 450,000 residents, but only possess a single 120-bed sub-divisional hospital (Civil Hospital 45).
2. **Periphery Healthcare Deserts:**
   - **Sector 52 & Maloya:** Extreme demographic congestion with a combined population exceeding 120,000. Closest tertiary hospital (GMCH 32) is $4.6\text{ km}$ away through congested traffic signals along Vikas Marg.
   - **Sarangpur / Dhanas:** North-west rehabilitation colonies experience significant travel times to PGIMER due to single bottleneck arterial corridors.
3. **Data Integrity & Outliers:**
   - Maximum population density is observed in **Manimajra** ($136,522/\text{km}^2$), driven by high-density multi-story group housing and historical urban settlements.
   - No missing or null values exist across any of the 64 sector records.
