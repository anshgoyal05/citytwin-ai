/**
 * CityTwin AI — Core TypeScript Types & Data Models
 * Specifically typed for Chandigarh Urban Digital Twin & Hospital Location Planning.
 */

export interface SectorData {
  sector_name: string;
  center: [number, number]; // [lng, lat]
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
  suitability_score?: number;
}

export interface HospitalData {
  id: string;
  name: string;
  type: string;
  sector: string;
  coordinates: [number, number]; // [lng, lat]
  beds: number;
  emergency: boolean;
  trauma_center: boolean;
  icu_beds: number;
  daily_opd: number;
  source: string;
}

export interface CandidateSite {
  id: string;
  name: string;
  sector: string;
  coordinates: [number, number]; // [lng, lat]
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
}

export interface TransitHub {
  name: string;
  type: string;
  coordinates: [number, number];
  sector: string;
}

export interface SuitabilityWeights {
  populationDemand: number;
  healthcareGap: number;
  roadConnectivity: number;
  transitAccess: number;
  landAvailability: number;
}

export interface LayerToggles {
  sectors: boolean;
  extrudedDensity: boolean;
  existingHospitals: boolean;
  candidateSites: boolean;
  isochrones: boolean;
  transitStops: boolean;
  satelliteMode: boolean;
}

export interface CitySummaryMetrics {
  totalPopulation: number;
  totalSectors: number;
  totalHospitals: number;
  totalBeds: number;
  avgBedsPer1000: number;
  avgDistanceToNearestHospitalKm: number;
  criticalUnderservedSectorsCount: number;
}

export interface Scenario {
  id: string;
  title: string;
  siteAId: string;
  siteBId: string;
  description: string;
  category: string;
  metrics: {
    popCoverageDelta: string;
    responseTimeDelta: string;
    budgetDelta: string;
    equityImpactScore: number;
  };
}

export interface Agent {
  id: string;
  name: string;
  role: string;
  status: 'Analyzing' | 'Monitoring' | 'Calculating' | 'Evaluating' | 'Idle';
  avatar: string;
  activeTasks: number;
  confidence: number;
  lastAction: string;
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  agentName: string;
  message: string;
  severity: 'info' | 'warning' | 'critical' | 'success';
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  metricsBadge?: string;
  suggestedAction?: string;
}
