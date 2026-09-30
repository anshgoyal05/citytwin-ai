import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

export interface SectorRecord {
  sector_name: string;
  center: [number, number];
  zone: string;
  population: number;
  area_sqkm: number;
  density_per_sqkm: number;
  land_use: string;
  existing_hospitals: string[];
  existing_hospitals_count: number;
  nearest_hospital: string;
  distance_to_nearest_hospital_km: number;
  road_connectivity_score: number;
  public_transit_score: number;
}

export interface HospitalRecord {
  id: string;
  name: string;
  type: string;
  sector: string;
  coordinates: [number, number];
  beds: number;
  emergency: boolean;
  trauma_center: boolean;
  icu_beds: number;
  daily_opd: number;
  source: string;
  verified?: boolean;
}

export interface CandidateSiteRecord {
  id: string;
  name: string;
  sector: string;
  coordinates: [number, number];
  description: string;
  vacant_land_acres: number;
  population_within_2km: number;
  distance_to_nearest_hospital_km: number;
  road_access: string;
  transit_access_score: number;
  road_connectivity_score: number;
  land_availability_score: number;
  healthcare_gap_score: number;
  population_demand_score: number;
  suitability_score: number;
  rank: number;
  recommended_type: string;
  estimated_cost_cr: number;
  rationale: string;
  verified?: boolean;
}

class CityTwinDataStore {
  private sectors: SectorRecord[] = [];
  private hospitals: HospitalRecord[] = [];
  private candidateSites: CandidateSiteRecord[] = [];
  private isLoaded = false;
  private storageMode: 'supabase_postgis' | 'local_fallback' = 'local_fallback';

  constructor() {
    this.loadData();
  }

  private loadData() {
    try {
      const sectorsPath = path.join(ROOT_DIR, 'data', 'processed', 'chandigarh_sectors.json');
      const hospitalsPath = path.join(ROOT_DIR, 'data', 'processed', 'chandigarh_hospitals.json');
      const candidatesPath = path.join(ROOT_DIR, 'data', 'processed', 'chandigarh_candidate_sites.json');

      if (fs.existsSync(sectorsPath)) {
        this.sectors = JSON.parse(fs.readFileSync(sectorsPath, 'utf-8'));
      }
      if (fs.existsSync(hospitalsPath)) {
        this.hospitals = JSON.parse(fs.readFileSync(hospitalsPath, 'utf-8'));
      }
      if (fs.existsSync(candidatesPath)) {
        this.candidateSites = JSON.parse(fs.readFileSync(candidatesPath, 'utf-8'));
      }

      this.isLoaded = true;
      // In production with SUPABASE_URL configured, this can connect via Postgres / REST
      if (process.env.SUPABASE_URL && process.env.SUPABASE_URL !== 'https://your-project.supabase.co') {
        this.storageMode = 'supabase_postgis';
      } else {
        this.storageMode = 'local_fallback';
      }
    } catch (err) {
      console.error('Failed to load local data files:', err);
    }
  }

  public getMode() {
    return this.storageMode;
  }

  public getSectors(): SectorRecord[] {
    return this.sectors;
  }

  public getSectorByName(name: string): SectorRecord | undefined {
    return this.sectors.find(
      (s) => s.sector_name.toLowerCase() === name.toLowerCase() ||
             s.sector_name.toLowerCase().replace(' ', '') === name.toLowerCase().replace(' ', '')
    );
  }

  public getHospitals(): HospitalRecord[] {
    return this.hospitals;
  }

  public getHospitalById(id: string): HospitalRecord | undefined {
    return this.hospitals.find((h) => h.id.toLowerCase() === id.toLowerCase());
  }

  public getCandidateSites(): CandidateSiteRecord[] {
    return this.candidateSites;
  }

  public getCandidateSiteById(id: string): CandidateSiteRecord | undefined {
    return this.candidateSites.find((c) => c.id.toLowerCase() === id.toLowerCase());
  }

  public recalculateSuitability(weights: {
    population: number;
    gap: number;
    road: number;
    transit: number;
    land: number;
  }) {
    const totalWeight =
      weights.population + weights.gap + weights.road + weights.transit + weights.land;
    const norm = totalWeight > 0 ? totalWeight : 1.0;

    const wPop = weights.population / norm;
    const wGap = weights.gap / norm;
    const wRoad = weights.road / norm;
    const wTransit = weights.transit / norm;
    const wLand = weights.land / norm;

    const scored = this.candidateSites.map((site) => {
      const score = Number(
        (
          (site.population_demand_score * wPop +
            site.healthcare_gap_score * wGap +
            site.road_connectivity_score * wRoad +
            site.transit_access_score * wTransit +
            site.land_availability_score * wLand) *
          100
        ).toFixed(1)
      );

      return {
        ...site,
        suitability_score: score,
        factors: {
          population: Math.round(site.population_demand_score * 100),
          gap: Math.round(site.healthcare_gap_score * 100),
          road: Math.round(site.road_connectivity_score * 100),
          transit: Math.round(site.transit_access_score * 100),
          land: Math.round(site.land_availability_score * 100),
        },
      };
    });

    scored.sort((a, b) => b.suitability_score - a.suitability_score);

    return scored.map((item, index) => ({
      ...item,
      rank: index + 1,
    }));
  }
}

export const dbStore = new CityTwinDataStore();
