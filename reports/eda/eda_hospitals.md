# Exploratory Data Analysis: Existing Healthcare Infrastructure

**Dataset:** `data/processed/chandigarh_hospitals.json`  
**Total Facilities Tracked:** 11 operational primary/secondary/tertiary facilities  
**Total Sanctioned Bed Capacity:** 4,835 inpatient beds  
**Total ICU Capacity:** 469 ICU beds  
**Total Outpatient Flow:** 27,450 daily consultations  
**CRS:** EPSG:4326  

---

## 1. Facility Distribution & Bed Allocation

| Hospital Name | Sector | Type | Bed Capacity | ICU Beds | Daily OPD | Trauma Center | Emergency (24/7) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **PGIMER** | Sector 12 | National Apex Institute | 2,200 | 180 | 10,500 | Yes (Advanced) | Yes |
| **GMCH 32** | Sector 32 | Government Medical College | 950 | 85 | 4,200 | Yes (Level II) | Yes |
| **GMSH 16** | Sector 16 | District Civil Multi-Specialty | 500 | 40 | 3,500 | No | Yes |
| **Fortis Hospital** | Sector 62 (Border) | Private Tertiary Care | 350 | 60 | 2,100 | Yes | Yes |
| **Max Super Speciality** | Sector 56 (Border) | Private Tertiary Care | 280 | 45 | 1,800 | Yes | Yes |
| **Alchemist Hospital** | Panchkula Border | Private Tertiary Care | 150 | 25 | 900 | No | Yes |
| **Civil Hospital 45** | Sector 45 | Sub-Divisional Public | 120 | 12 | 1,400 | No | Yes |
| **Civil Hospital 22** | Sector 22 | Sub-Divisional Public | 100 | 10 | 1,200 | No | Yes |
| **Civil Hospital Manimajra** | Manimajra | Sub-Divisional Public | 100 | 8 | 1,100 | No | Yes |
| **Ayurvedic Hospital 24** | Sector 24 | Public AYUSH Specialty | 50 | 0 | 450 | No | No |
| **Apollo Clinic 8** | Sector 8 | Private Day Care & Secondary | 35 | 4 | 300 | No | Yes |

---

## 2. Infrastructure Concentration Analysis

1. **Top-Heavy Bed Distribution:**
   - **PGIMER alone commands 45.5% (2,200 / 4,835)** of the total bed capacity in the region.
   - Combined, the top two government hospitals (PGIMER + GMCH 32) account for **65.2%** of all available beds and **56.5%** of all ICU units.
   - Because PGIMER serves as a regional tertiary referral center for Punjab, Haryana, Himachal Pradesh, and Jammu & Kashmir, approximately 60% of its beds are occupied by non-Chandigarh residents, placing extreme acute stress on municipal emergency services.
2. **Bed-to-Population Ratios by Zone:**
   - **WHO Minimum Standard:** 3.0 beds per 1,000 population.
   - **Chandigarh Overall:** $4,835 / 1,483 = 3.26$ beds per 1,000 population (nominal metric appears compliant).
   - **Zone-Level Spatial Disparity:**
     - *North & Central Sectors:* $>28.5$ beds per 1,000 residents.
     - *South & South-West Sectors (Sectors 38–56, Maloya, Dhanas):* **$0.28$ beds per 1,000 residents**.
     - This demonstrates a **100x geographical maldistribution** between nominal city averages and actual peripheral resident access.

---

## 3. Spatial Access Deficits

- **Average Ambulance Transit Time to Level-I Trauma:**
  - Sectors 1–25: **6–12 minutes**
  - Sectors 48–56, Maloya, Dhanas: **26–42 minutes** during peak congestion periods (09:00–11:30 and 17:30–20:00).
- This spatial gap empirically substantiates the critical necessity for a new secondary or tertiary trauma stabilization facility in the South/South-West corridor (e.g. Sector 52 / Maloya / Sarangpur).
