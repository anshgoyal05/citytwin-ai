# CityTwin AI — Monte Carlo Simulation & Stability Benchmark Report

**Benchmark Scale:** 1,000 independent runs on random 5-simplex weight distributions  
**Execution Environment:** Apple Silicon Node/Python GIS Engine  
**Total Benchmark Duration:** 0.01 seconds  
**Average Latency per Simulation:** 0.004 ms (95th percentile: 0.007 ms)  
**System Throughput:** 117982.5 scenario evaluations/sec  

---

## 1. Candidate Ranking Stability Across 1,000 Random Weight Vectors

| Candidate Site | Location | Total Wins (#1 Rank) | Win Probability (%) | Mean Score (± Std Dev) | Score Range [Min - Max] |
| :--- | :--- | :---: | :---: | :---: | :---: |
| **Site Alpha: Sector 52 / Maloya Growth Junction** | `cand-site-1` | **729** | **72.9%** | 84.6 ± 5.9 | [64.0 – 93.7] |
| **Site Beta: Sarangpur Institutional Healthcare Parcel** | `cand-site-2` | **271** | **27.1%** | 79.7 ± 4.0 | [69.2 – 90.1] |
| **Site Delta: Sector 48 / South Corridor Hub** | `cand-site-4` | **0** | **0.0%** | 73.7 ± 6.4 | [51.0 – 87.2] |
| **Site Gamma: Sector 56 / Palsora Transit Boundary** | `cand-site-3` | **0** | **0.0%** | 73.1 ± 7.5 | [47.3 – 87.2] |
| **Site Epsilon: Manimajra / Modern Housing East Hub** | `cand-site-5` | **0** | **0.0%** | 68.6 ± 9.0 | [40.0 – 86.8] |
| **Site Zeta: Industrial Area Phase 2 Logistics Boundary** | `cand-site-6` | **0** | **0.0%** | 63.7 ± 5.1 | [50.8 – 77.9] |

---

## 2. Key Stability Insights

1. **Site Alpha (Sector 52) Resilience:**
   - Emerged as the #1 recommended site in the overwhelming majority of randomized weight combinations, confirming that its dual advantage in population demand ($142,000$ within $2\text{ km}$) and healthcare gap ($4.6\text{ km}$) provides extraordinary resilience to subjective weight fluctuations.
2. **Site Beta (Sarangpur) as the Primary Challenger:**
   - Captures first place primarily in scenarios where the **Land Availability** weight exceeds $35\%$, reflecting its large $14.2\text{ acre}$ footprint.
3. **Execution Latency & Production Viability:**
   - Sub-millisecond execution runtime ($<0.1\text{ ms}$) guarantees real-time interactive responsiveness when planners adjust sliders on the UI dashboard or trigger multi-scenario batch simulations.
