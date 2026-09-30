import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';
import type {
  SectorData,
  HospitalData,
  CandidateSite,
  TransitHub,
  SuitabilityWeights,
  LayerToggles,
  CitySummaryMetrics,
} from '../types';

import sectorsDataRaw from '../data/chandigarh_sectors.json';
import hospitalsDataRaw from '../data/chandigarh_hospitals.json';
import candidateSitesRaw from '../data/chandigarh_candidate_sites.json';
import transitDataRaw from '../data/chandigarh_transit.json';

const DEFAULT_WEIGHTS: SuitabilityWeights = {
  populationDemand: 0.30,
  healthcareGap: 0.25,
  roadConnectivity: 0.15,
  transitAccess: 0.15,
  landAvailability: 0.15,
};

interface CityContextType {
  selectedCity: string;
  sectors: SectorData[];
  hospitals: HospitalData[];
  candidateSites: CandidateSite[];
  transitHubs: TransitHub[];
  selectedSector: SectorData | null;
  setSelectedSector: (s: SectorData | null) => void;
  selectedCandidate: CandidateSite | null;
  setSelectedCandidate: (c: CandidateSite | null) => void;
  weights: SuitabilityWeights;
  updateWeight: (key: keyof SuitabilityWeights, val: number) => void;
  resetWeights: () => void;
  layers: LayerToggles;
  toggleLayer: (k: keyof LayerToggles) => void;
  comparisonSiteA: CandidateSite | null;
  setComparisonSiteA: (c: CandidateSite | null) => void;
  comparisonSiteB: CandidateSite | null;
  setComparisonSiteB: (c: CandidateSite | null) => void;
  mapViewState: {
    longitude: number;
    latitude: number;
    zoom: number;
    pitch: number;
    bearing: number;
  };
  setMapViewState: React.Dispatch<React.SetStateAction<any>>;
  flyToLocation: (lng: number, lat: number, zoom?: number, pitch?: number) => void;
  summaryMetrics: CitySummaryMetrics;
  isRecalculating: boolean;
  activeFilterZone: string;
  setActiveFilterZone: (z: string) => void;
}

const CityContext = createContext<CityContextType | undefined>(undefined);

export const CityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const selectedCity = 'Chandigarh, India';
  const [sectors] = useState<SectorData[]>(sectorsDataRaw as unknown as SectorData[]);
  const [hospitals] = useState<HospitalData[]>(hospitalsDataRaw as unknown as HospitalData[]);
  const [transitHubs] = useState<TransitHub[]>(transitDataRaw as unknown as TransitHub[]);
  
  const [weights, setWeights] = useState<SuitabilityWeights>(DEFAULT_WEIGHTS);
  const [selectedSector, setSelectedSector] = useState<SectorData | null>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<CandidateSite | null>(
    (candidateSitesRaw as unknown as CandidateSite[])[0] || null
  );
  
  const [comparisonSiteA, setComparisonSiteA] = useState<CandidateSite | null>(
    (candidateSitesRaw as unknown as CandidateSite[])[0] || null
  );
  const [comparisonSiteB, setComparisonSiteB] = useState<CandidateSite | null>(
    (candidateSitesRaw as unknown as CandidateSite[])[1] || null
  );

  const [activeFilterZone, setActiveFilterZone] = useState<string>('All');
  const [isRecalculating, setIsRecalculating] = useState<boolean>(false);

  const [layers, setLayers] = useState<LayerToggles>({
    sectors: true,
    extrudedDensity: true,
    existingHospitals: true,
    candidateSites: true,
    isochrones: true,
    transitStops: false,
    satelliteMode: false,
  });

  const [mapViewState, setMapViewState] = useState({
    longitude: 76.7794,
    latitude: 30.7333,
    zoom: 12.4,
    pitch: 52,
    bearing: -18,
  });

  // Dynamically recalculate candidate site scores and ranks based on user-controlled weights
  const candidateSites = useMemo(() => {
    const rawList = candidateSitesRaw as unknown as CandidateSite[];
    const totalWeight =
      weights.populationDemand +
      weights.healthcareGap +
      weights.roadConnectivity +
      weights.transitAccess +
      weights.landAvailability || 1.0;

    const scored = rawList.map((site) => {
      const wPop = weights.populationDemand / totalWeight;
      const wGap = weights.healthcareGap / totalWeight;
      const wRoad = weights.roadConnectivity / totalWeight;
      const wTransit = weights.transitAccess / totalWeight;
      const wLand = weights.landAvailability / totalWeight;

      const compositeScore =
        site.population_demand_score * 100 * wPop +
        site.healthcare_gap_score * 100 * wGap +
        site.road_connectivity_score * 100 * wRoad +
        site.transit_access_score * 100 * wTransit +
        site.land_availability_score * 100 * wLand;

      return {
        ...site,
        suitability_score: Math.round(compositeScore * 10) / 10,
      };
    });

    // Re-rank descending
    scored.sort((a, b) => b.suitability_score - a.suitability_score);
    return scored.map((item, index) => ({
      ...item,
      rank: index + 1,
    }));
  }, [weights]);

  // Keep selected candidate synced with new rank/score
  const currentSelectedCandidate = useMemo(() => {
    if (!selectedCandidate) return candidateSites[0] || null;
    return candidateSites.find((c) => c.id === selectedCandidate.id) || candidateSites[0];
  }, [candidateSites, selectedCandidate]);

  const updateWeight = useCallback((key: keyof SuitabilityWeights, val: number) => {
    setIsRecalculating(true);
    setWeights((prev) => ({ ...prev, [key]: val }));
    setTimeout(() => setIsRecalculating(false), 200);
  }, []);

  const resetWeights = useCallback(() => {
    setIsRecalculating(true);
    setWeights(DEFAULT_WEIGHTS);
    setTimeout(() => setIsRecalculating(false), 200);
  }, []);

  const toggleLayer = useCallback((k: keyof LayerToggles) => {
    setLayers((prev) => ({ ...prev, [k]: !prev[k] }));
  }, []);

  const flyToLocation = useCallback((lng: number, lat: number, zoom = 14.2, pitch = 55) => {
    setMapViewState((prev) => ({
      ...prev,
      longitude: lng,
      latitude: lat,
      zoom,
      pitch,
      transitionDuration: 1400,
    }));
  }, []);

  const summaryMetrics: CitySummaryMetrics = useMemo(() => {
    const totalPop = sectors.reduce((acc, s) => acc + s.population, 0);
    const totalBeds = hospitals.reduce((acc, h) => acc + h.beds, 0);
    const bedsPer1000 = Math.round((totalBeds / (totalPop / 1000)) * 10) / 10;
    const avgDist =
      Math.round(
        (sectors.reduce((acc, s) => acc + s.distance_to_nearest_hospital_km, 0) /
          sectors.length) *
          10
      ) / 10;
    const criticalCount = sectors.filter(
      (s) => s.distance_to_nearest_hospital_km > 3.0 && s.population > 25000
    ).length;

    return {
      totalPopulation: totalPop,
      totalSectors: sectors.length,
      totalHospitals: hospitals.length,
      totalBeds,
      avgBedsPer1000: bedsPer1000,
      avgDistanceToNearestHospitalKm: avgDist,
      criticalUnderservedSectorsCount: criticalCount,
    };
  }, [sectors, hospitals]);

  return (
    <CityContext.Provider
      value={{
        selectedCity,
        sectors,
        hospitals,
        candidateSites,
        transitHubs,
        selectedSector,
        setSelectedSector,
        selectedCandidate: currentSelectedCandidate,
        setSelectedCandidate,
        weights,
        updateWeight,
        resetWeights,
        layers,
        toggleLayer,
        comparisonSiteA,
        setComparisonSiteA,
        comparisonSiteB,
        setComparisonSiteB,
        mapViewState,
        setMapViewState,
        flyToLocation,
        summaryMetrics,
        isRecalculating,
        activeFilterZone,
        setActiveFilterZone,
      }}
    >
      {children}
    </CityContext.Provider>
  );
};

export const useCity = () => {
  const context = useContext(CityContext);
  if (!context) {
    throw new Error('useCity must be used within a CityProvider');
  }
  return context;
};
