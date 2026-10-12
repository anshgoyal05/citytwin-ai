/**
 * Authentic Road Network of Chandigarh (Le Corbusier 7Vs System)
 * Geographically accurate coordinates for V2 Boulevards, V3 Arterials,
 * major roundabouts (chowks), and connected graph topology for 3D vehicle navigation.
 */

export interface RoadNode {
  id: string;
  name: string;
  coords: [number, number]; // [lng, lat]
  isRoundabout?: boolean;
}

export interface RoadSegment {
  id: string;
  name: string;
  type: 'v2_boulevard' | 'v3_arterial' | 'v4_collector';
  fromNode: string;
  toNode: string;
  points: [number, number][]; // [lng, lat][] polyline
  lanes: number;
  speedLimitKmH: number;
  trafficFlow: 'smooth' | 'moderate' | 'congested';
}

// ---------------------------------------------------------------------------
// 1. KEY INTERSECTIONS & ROUNDABOUTS (CHOWKS)
// ---------------------------------------------------------------------------
export const ROAD_NODES: Record<string, RoadNode> = {
  // Northern Arterial / Madhya Marg Nodes
  pgimer_junction: {
    id: 'pgimer_junction',
    name: 'PGIMER Gate / Sector 12 Junction',
    coords: [76.7765, 30.7645],
  },
  pu_gate_junction: {
    id: 'pu_gate_junction',
    name: 'Panjab University Sector 14 Junction',
    coords: [76.768, 30.760],
  },
  sec11_sec10_chowk: {
    id: 'sec11_sec10_chowk',
    name: 'Sector 10/11 Roundabout',
    coords: [76.785, 30.757],
    isRoundabout: true,
  },
  matka_chowk: {
    id: 'matka_chowk',
    name: 'Matka Chowk (Madhya Marg x Jan Marg)',
    coords: [76.7935, 30.7505],
    isRoundabout: true,
  },
  sec8_sec7_chowk: {
    id: 'sec8_sec7_chowk',
    name: 'Sector 7/8 Roundabout',
    coords: [76.804, 30.743],
    isRoundabout: true,
  },
  transport_chowk: {
    id: 'transport_chowk',
    name: 'Transport Chowk (Madhya Marg x Purv Marg)',
    coords: [76.8155, 30.7345],
    isRoundabout: true,
  },
  railway_station_junction: {
    id: 'railway_station_junction',
    name: 'Railway Station Access Chowk',
    coords: [76.826, 30.718],
    isRoundabout: true,
  },

  // Central North-South Axis / Jan Marg Nodes
  capitol_complex_terminal: {
    id: 'capitol_complex_terminal',
    name: 'Capitol Complex Sector 1 Plaza',
    coords: [76.802, 30.759],
  },
  sec17_plaza_chowk: {
    id: 'sec17_plaza_chowk',
    name: 'Sector 17 Central Plaza Access',
    coords: [76.782, 30.741],
    isRoundabout: true,
  },
  aroma_chowk: {
    id: 'aroma_chowk',
    name: 'Aroma Chowk (Jan Marg x Sector 21/22)',
    coords: [76.769, 30.728],
    isRoundabout: true,
  },
  piccadilly_chowk: {
    id: 'piccadilly_chowk',
    name: 'Piccadilly Chowk (Jan Marg x Dakshin Marg)',
    coords: [76.757, 30.718],
    isRoundabout: true,
  },
  isbt43_junction: {
    id: 'isbt43_junction',
    name: 'ISBT Sector 43 Main Terminal Chowk',
    coords: [76.745, 30.709],
    isRoundabout: true,
  },

  // Central East-West / Dakshin Marg Nodes
  sec38_west_chowk: {
    id: 'sec38_west_chowk',
    name: 'Sector 38 West Corridor',
    coords: [76.742, 30.740],
  },
  sec37_sec36_chowk: {
    id: 'sec37_sec36_chowk',
    name: 'Sector 36/37 Chowk',
    coords: [76.756, 30.730],
    isRoundabout: true,
  },
  kisan_bhawan_chowk: {
    id: 'kisan_bhawan_chowk',
    name: 'Kisan Bhawan Chowk (Dakshin Marg x Sec 35)',
    coords: [76.768, 30.721],
    isRoundabout: true,
  },
  gmch32_junction: {
    id: 'gmch32_junction',
    name: 'GMCH Sector 32 Hospital Chowk',
    coords: [76.788, 30.706],
    isRoundabout: true,
  },
  tribune_chowk: {
    id: 'tribune_chowk',
    name: 'Tribune Chowk (Dakshin Marg x Purv Marg)',
    coords: [76.8085, 30.6924],
    isRoundabout: true,
  },

  // South Corridor / Vikas Marg & PR-7 Nodes
  maloya_growth_junction: {
    id: 'maloya_growth_junction',
    name: 'Maloya Sector 52 Candidate Hub',
    coords: [76.7215, 30.7095],
  },
  sec50_sec51_chowk: {
    id: 'sec50_sec51_chowk',
    name: 'Sector 50/51 South Boulevard',
    coords: [76.758, 30.693],
    isRoundabout: true,
  },
  sec48_health_hub: {
    id: 'sec48_health_hub',
    name: 'Sector 48 Health Hub Junction',
    coords: [76.759, 30.687],
  },
  airport_link_chowk: {
    id: 'airport_link_chowk',
    name: 'PR-7 Airport Expressway Interchange',
    coords: [76.795, 30.672],
    isRoundabout: true,
  },

  // Himalaya Marg Nodes (Parallel North-South)
  sec9_sec10_himalaya: {
    id: 'sec9_sec10_himalaya',
    name: 'Sector 9/10 Himalaya Junction',
    coords: [76.791, 30.748],
  },
  sec17_sec18_himalaya: {
    id: 'sec17_sec18_himalaya',
    name: 'Sector 17/18 Himalaya Junction',
    coords: [76.780, 30.733],
    isRoundabout: true,
  },
  sec34_sec35_himalaya: {
    id: 'sec34_sec35_himalaya',
    name: 'Sector 34/35 Commercial Cross',
    coords: [76.764, 30.710],
    isRoundabout: true,
  },

  // Sarangpur North Corridor
  sarangpur_institutional_hub: {
    id: 'sarangpur_institutional_hub',
    name: 'Sarangpur Institutional Reserve',
    coords: [76.751, 30.771],
  },

  // East Corridor / Purv Marg Nodes
  sec26_institutional_hub: {
    id: 'sec26_institutional_hub',
    name: 'Sector 26 Institutional Corridor',
    coords: [76.812, 30.724],
  },
  industrial_area_phase1: {
    id: 'industrial_area_phase1',
    name: 'Industrial Area Phase 1 / Elante Chowk',
    coords: [76.804, 30.704],
    isRoundabout: true,
  },
};

// ---------------------------------------------------------------------------
// 2. CONNECTED ROAD SEGMENTS WITH ACCURATE MULTI-LANE POLYLINES
// ---------------------------------------------------------------------------
export const ROAD_SEGMENTS: RoadSegment[] = [
  // MADHYA MARG (V2 Boulevard: East-West Corridor)
  {
    id: 'madhya_marg_w1',
    name: 'Madhya Marg (PGIMER to Sec 10/11)',
    type: 'v2_boulevard',
    fromNode: 'pgimer_junction',
    toNode: 'sec11_sec10_chowk',
    points: [
      [76.7765, 30.7645],
      [76.7805, 30.761],
      [76.785, 30.757],
    ],
    lanes: 6,
    speedLimitKmH: 60,
    trafficFlow: 'moderate',
  },
  {
    id: 'madhya_marg_w2',
    name: 'Madhya Marg (Sec 10/11 to Matka Chowk)',
    type: 'v2_boulevard',
    fromNode: 'sec11_sec10_chowk',
    toNode: 'matka_chowk',
    points: [
      [76.785, 30.757],
      [76.7895, 30.7538],
      [76.7935, 30.7505],
    ],
    lanes: 6,
    speedLimitKmH: 60,
    trafficFlow: 'congested',
  },
  {
    id: 'madhya_marg_e1',
    name: 'Madhya Marg (Matka Chowk to Sec 7/8)',
    type: 'v2_boulevard',
    fromNode: 'matka_chowk',
    toNode: 'sec8_sec7_chowk',
    points: [
      [76.7935, 30.7505],
      [76.7985, 30.7468],
      [76.804, 30.743],
    ],
    lanes: 6,
    speedLimitKmH: 60,
    trafficFlow: 'smooth',
  },
  {
    id: 'madhya_marg_e2',
    name: 'Madhya Marg (Sec 7/8 to Transport Chowk)',
    type: 'v2_boulevard',
    fromNode: 'sec8_sec7_chowk',
    toNode: 'transport_chowk',
    points: [
      [76.804, 30.743],
      [76.8095, 30.7388],
      [76.8155, 30.7345],
    ],
    lanes: 6,
    speedLimitKmH: 60,
    trafficFlow: 'moderate',
  },
  {
    id: 'madhya_railway_link',
    name: 'Railway Station Access Link',
    type: 'v3_arterial',
    fromNode: 'transport_chowk',
    toNode: 'railway_station_junction',
    points: [
      [76.8155, 30.7345],
      [76.821, 30.726],
      [76.826, 30.718],
    ],
    lanes: 4,
    speedLimitKmH: 50,
    trafficFlow: 'smooth',
  },

  // JAN MARG (V2 Boulevard: North-South Grand Axis)
  {
    id: 'jan_marg_n1',
    name: 'Jan Marg (Capitol Complex to Matka Chowk)',
    type: 'v2_boulevard',
    fromNode: 'capitol_complex_terminal',
    toNode: 'matka_chowk',
    points: [
      [76.802, 30.759],
      [76.7975, 30.7548],
      [76.7935, 30.7505],
    ],
    lanes: 6,
    speedLimitKmH: 60,
    trafficFlow: 'smooth',
  },
  {
    id: 'jan_marg_c1',
    name: 'Jan Marg (Matka Chowk to Sector 17 Plaza)',
    type: 'v2_boulevard',
    fromNode: 'matka_chowk',
    toNode: 'sec17_plaza_chowk',
    points: [
      [76.7935, 30.7505],
      [76.7875, 30.7455],
      [76.782, 30.741],
    ],
    lanes: 6,
    speedLimitKmH: 50,
    trafficFlow: 'congested',
  },
  {
    id: 'jan_marg_c2',
    name: 'Jan Marg (Sector 17 Plaza to Aroma Chowk)',
    type: 'v2_boulevard',
    fromNode: 'sec17_plaza_chowk',
    toNode: 'aroma_chowk',
    points: [
      [76.782, 30.741],
      [76.775, 30.7345],
      [76.769, 30.728],
    ],
    lanes: 6,
    speedLimitKmH: 50,
    trafficFlow: 'moderate',
  },
  {
    id: 'jan_marg_s1',
    name: 'Jan Marg (Aroma Chowk to Piccadilly Chowk)',
    type: 'v2_boulevard',
    fromNode: 'aroma_chowk',
    toNode: 'piccadilly_chowk',
    points: [
      [76.769, 30.728],
      [76.763, 30.723],
      [76.757, 30.718],
    ],
    lanes: 6,
    speedLimitKmH: 60,
    trafficFlow: 'moderate',
  },
  {
    id: 'jan_marg_s2',
    name: 'Jan Marg (Piccadilly Chowk to ISBT 43)',
    type: 'v2_boulevard',
    fromNode: 'piccadilly_chowk',
    toNode: 'isbt43_junction',
    points: [
      [76.757, 30.718],
      [76.751, 30.7135],
      [76.745, 30.709],
    ],
    lanes: 6,
    speedLimitKmH: 60,
    trafficFlow: 'congested',
  },

  // DAKSHIN MARG (V2 Boulevard: Central Transverse Artery)
  {
    id: 'dakshin_marg_w1',
    name: 'Dakshin Marg (Sec 38 to Sec 36/37)',
    type: 'v2_boulevard',
    fromNode: 'sec38_west_chowk',
    toNode: 'sec37_sec36_chowk',
    points: [
      [76.742, 30.740],
      [76.749, 30.735],
      [76.756, 30.730],
    ],
    lanes: 6,
    speedLimitKmH: 60,
    trafficFlow: 'smooth',
  },
  {
    id: 'dakshin_marg_w2',
    name: 'Dakshin Marg (Sec 36/37 to Piccadilly Chowk)',
    type: 'v2_boulevard',
    fromNode: 'sec37_sec36_chowk',
    toNode: 'piccadilly_chowk',
    points: [
      [76.756, 30.730],
      [76.7565, 30.724],
      [76.757, 30.718],
    ],
    lanes: 6,
    speedLimitKmH: 60,
    trafficFlow: 'congested',
  },
  {
    id: 'dakshin_marg_c1',
    name: 'Dakshin Marg (Piccadilly to Kisan Bhawan)',
    type: 'v2_boulevard',
    fromNode: 'piccadilly_chowk',
    toNode: 'kisan_bhawan_chowk',
    points: [
      [76.757, 30.718],
      [76.7625, 30.7195],
      [76.768, 30.721],
    ],
    lanes: 6,
    speedLimitKmH: 60,
    trafficFlow: 'moderate',
  },
  {
    id: 'dakshin_marg_c2',
    name: 'Dakshin Marg (Kisan Bhawan to GMCH 32)',
    type: 'v2_boulevard',
    fromNode: 'kisan_bhawan_chowk',
    toNode: 'gmch32_junction',
    points: [
      [76.768, 30.721],
      [76.778, 30.7135],
      [76.788, 30.706],
    ],
    lanes: 6,
    speedLimitKmH: 60,
    trafficFlow: 'congested',
  },
  {
    id: 'dakshin_marg_e1',
    name: 'Dakshin Marg (GMCH 32 to Tribune Chowk)',
    type: 'v2_boulevard',
    fromNode: 'gmch32_junction',
    toNode: 'tribune_chowk',
    points: [
      [76.788, 30.706],
      [76.798, 30.699],
      [76.8085, 30.6924],
    ],
    lanes: 6,
    speedLimitKmH: 60,
    trafficFlow: 'congested',
  },

  // PURV MARG (V2 Boulevard: Eastern Industrial & Railway Corridor)
  {
    id: 'purv_marg_n1',
    name: 'Purv Marg (Transport Chowk to Sec 26)',
    type: 'v2_boulevard',
    fromNode: 'transport_chowk',
    toNode: 'sec26_institutional_hub',
    points: [
      [76.8155, 30.7345],
      [76.814, 30.729],
      [76.812, 30.724],
    ],
    lanes: 6,
    speedLimitKmH: 60,
    trafficFlow: 'smooth',
  },
  {
    id: 'purv_marg_c1',
    name: 'Purv Marg (Sec 26 to Industrial Area Phase 1)',
    type: 'v2_boulevard',
    fromNode: 'sec26_institutional_hub',
    toNode: 'industrial_area_phase1',
    points: [
      [76.812, 30.724],
      [76.808, 30.714],
      [76.804, 30.704],
    ],
    lanes: 6,
    speedLimitKmH: 60,
    trafficFlow: 'moderate',
  },
  {
    id: 'purv_marg_s1',
    name: 'Purv Marg (Industrial Area to Tribune Chowk)',
    type: 'v2_boulevard',
    fromNode: 'industrial_area_phase1',
    toNode: 'tribune_chowk',
    points: [
      [76.804, 30.704],
      [76.806, 30.698],
      [76.8085, 30.6924],
    ],
    lanes: 6,
    speedLimitKmH: 60,
    trafficFlow: 'moderate',
  },

  // VIKAS MARG & PR-7 (South Rapid Transit & Healthcare Corridor)
  {
    id: 'vikas_marg_w1',
    name: 'Vikas Marg (Maloya Hub to ISBT 43)',
    type: 'v2_boulevard',
    fromNode: 'maloya_growth_junction',
    toNode: 'isbt43_junction',
    points: [
      [76.7215, 30.7095],
      [76.733, 30.7092],
      [76.745, 30.709],
    ],
    lanes: 6,
    speedLimitKmH: 70,
    trafficFlow: 'smooth',
  },
  {
    id: 'vikas_marg_c1',
    name: 'Vikas Marg (ISBT 43 to Sec 50/51)',
    type: 'v2_boulevard',
    fromNode: 'isbt43_junction',
    toNode: 'sec50_sec51_chowk',
    points: [
      [76.745, 30.709],
      [76.7515, 30.701],
      [76.758, 30.693],
    ],
    lanes: 6,
    speedLimitKmH: 70,
    trafficFlow: 'moderate',
  },
  {
    id: 'sec48_link',
    name: 'Sector 48 Health Corridor Access',
    type: 'v3_arterial',
    fromNode: 'sec50_sec51_chowk',
    toNode: 'sec48_health_hub',
    points: [
      [76.758, 30.693],
      [76.7585, 30.690],
      [76.759, 30.687],
    ],
    lanes: 4,
    speedLimitKmH: 50,
    trafficFlow: 'smooth',
  },
  {
    id: 'pr7_airport_link',
    name: 'PR-7 Airport Expressway (Tribune Chowk to Airport Link)',
    type: 'v2_boulevard',
    fromNode: 'tribune_chowk',
    toNode: 'airport_link_chowk',
    points: [
      [76.8085, 30.6924],
      [76.802, 30.682],
      [76.795, 30.672],
    ],
    lanes: 6,
    speedLimitKmH: 80,
    trafficFlow: 'smooth',
  },

  // HIMALAYA MARG & ARTERIAL GRID (V3 Sector Connections)
  {
    id: 'himalaya_sec17_sec35',
    name: 'Himalaya Marg (Sec 17/18 to Sec 34/35)',
    type: 'v3_arterial',
    fromNode: 'sec17_sec18_himalaya',
    toNode: 'sec34_sec35_himalaya',
    points: [
      [76.780, 30.733],
      [76.772, 30.721],
      [76.764, 30.710],
    ],
    lanes: 4,
    speedLimitKmH: 50,
    trafficFlow: 'congested',
  },
  {
    id: 'himalaya_to_dakshin',
    name: 'Himalaya Marg to GMCH Link',
    type: 'v3_arterial',
    fromNode: 'sec34_sec35_himalaya',
    toNode: 'gmch32_junction',
    points: [
      [76.764, 30.710],
      [76.776, 30.708],
      [76.788, 30.706],
    ],
    lanes: 4,
    speedLimitKmH: 50,
    trafficFlow: 'moderate',
  },
  {
    id: 'sarangpur_pgimer_link',
    name: 'Sarangpur New Chandigarh Access Corridor',
    type: 'v3_arterial',
    fromNode: 'sarangpur_institutional_hub',
    toNode: 'pgimer_junction',
    points: [
      [76.751, 30.771],
      [76.763, 30.768],
      [76.7765, 30.7645],
    ],
    lanes: 4,
    speedLimitKmH: 60,
    trafficFlow: 'smooth',
  },
  {
    id: 'pu_pgimer_link',
    name: 'Vidya Path (PU to PGIMER)',
    type: 'v3_arterial',
    fromNode: 'pu_gate_junction',
    toNode: 'pgimer_junction',
    points: [
      [76.768, 30.760],
      [76.772, 30.762],
      [76.7765, 30.7645],
    ],
    lanes: 4,
    speedLimitKmH: 45,
    trafficFlow: 'smooth',
  },
];

// ---------------------------------------------------------------------------
// 3. GRAPH CONNECTIVITY MAP (Node -> Connected Outgoing/Incoming Segments)
// ---------------------------------------------------------------------------
const adjacencyMap: Map<string, Array<{ segment: RoadSegment; direction: 1 | -1; targetNodeId: string }>> = new Map();

export function getRoadGraph(): Map<string, Array<{ segment: RoadSegment; direction: 1 | -1; targetNodeId: string }>> {
  if (adjacencyMap.size > 0) return adjacencyMap;

  for (const nodeKey of Object.keys(ROAD_NODES)) {
    adjacencyMap.set(nodeKey, []);
  }

  for (const seg of ROAD_SEGMENTS) {
    // Forward fromNode -> toNode
    const fromList = adjacencyMap.get(seg.fromNode) || [];
    fromList.push({ segment: seg, direction: 1, targetNodeId: seg.toNode });
    adjacencyMap.set(seg.fromNode, fromList);

    // Reverse toNode -> fromNode (Two-way road)
    const toList = adjacencyMap.get(seg.toNode) || [];
    toList.push({ segment: seg, direction: -1, targetNodeId: seg.fromNode });
    adjacencyMap.set(seg.toNode, toList);
  }

  return adjacencyMap;
}

// ---------------------------------------------------------------------------
// 4. KINEMATIC & GEOMETRIC UTILITIES (Left-Hand Driving in India)
// ---------------------------------------------------------------------------

/**
 * Approximate meters to degrees for Chandigarh (latitude ~30.73 N)
 */
export const METERS_TO_DEG_LAT = 1 / 111320;
export const METERS_TO_DEG_LNG = 1 / (111320 * Math.cos((30.73 * Math.PI) / 180));

/**
 * Calculates a point along a polyline segment with a lateral lane offset.
 * In India, vehicles drive on the LEFT side of the road.
 * When traveling along the direction vector (dx, dy), the left-side normal is (-dy, dx).
 */
export function getPositionAndHeadingOnSegment(
  segment: RoadSegment,
  direction: 1 | -1,
  progress: number, // 0.0 to 1.0 along the segment in the current travel direction
  laneOffsetMeters: number = 2.4 // positive offset shifts car to its driving lane (left)
): { position: [number, number]; bearingDeg: number } {
  const rawPoints = direction === 1 ? segment.points : [...segment.points].reverse();
  const n = rawPoints.length;
  if (n < 2) {
    return { position: rawPoints[0] || [76.779, 30.733], bearingDeg: 0 };
  }

  // Calculate cumulative distances
  const dists: number[] = [0];
  let totalDist = 0;
  for (let i = 0; i < n - 1; i++) {
    const p1 = rawPoints[i];
    const p2 = rawPoints[i + 1];
    const dx = (p2[0] - p1[0]) / METERS_TO_DEG_LNG;
    const dy = (p2[1] - p1[1]) / METERS_TO_DEG_LAT;
    const d = Math.hypot(dx, dy);
    totalDist += d;
    dists.push(totalDist);
  }

  const targetDist = Math.max(0, Math.min(1, progress)) * totalDist;

  // Find sub-segment
  let subIdx = 0;
  for (let i = 0; i < n - 1; i++) {
    if (targetDist >= dists[i] && targetDist <= dists[i + 1]) {
      subIdx = i;
      break;
    }
  }

  const p1 = rawPoints[subIdx];
  const p2 = rawPoints[subIdx + 1] || rawPoints[subIdx];
  const segLength = dists[subIdx + 1] - dists[subIdx];
  const localT = segLength > 0 ? (targetDist - dists[subIdx]) / segLength : 0;

  // Centerline point
  const centerLng = p1[0] + (p2[0] - p1[0]) * localT;
  const centerLat = p1[1] + (p2[1] - p1[1]) * localT;

  // Direction vector in meters
  const dxMeters = (p2[0] - p1[0]) / METERS_TO_DEG_LNG;
  const dyMeters = (p2[1] - p1[1]) / METERS_TO_DEG_LAT;
  const mag = Math.hypot(dxMeters, dyMeters) || 1;

  // Unit tangent & left normal (-dy, dx)
  const ux = dxMeters / mag;
  const uy = dyMeters / mag;
  const nx = -uy;
  const ny = ux;

  // Shift by lane offset (left)
  const offsetLng = centerLng + nx * laneOffsetMeters * METERS_TO_DEG_LNG;
  const offsetLat = centerLat + ny * laneOffsetMeters * METERS_TO_DEG_LAT;

  // Bearing in degrees (0 = North, 90 = East, 180 = South, 270 = West)
  const angleRad = Math.atan2(dxMeters, dyMeters); // dy is North (+y), dx is East (+x)
  let bearingDeg = (angleRad * 180) / Math.PI;
  if (bearingDeg < 0) bearingDeg += 360;

  return {
    position: [offsetLng, offsetLat],
    bearingDeg,
  };
}

/**
 * GeoJSON FeatureCollection for rendering the 3D Road Network with lane styles
 */
export function getRoadNetworkGeoJSON() {
  return {
    type: 'FeatureCollection' as const,
    features: ROAD_SEGMENTS.map((seg) => ({
      type: 'Feature' as const,
      properties: {
        id: seg.id,
        name: seg.name,
        type: seg.type,
        lanes: seg.lanes,
        speedLimitKmH: seg.speedLimitKmH,
        trafficFlow: seg.trafficFlow,
      },
      geometry: {
        type: 'LineString' as const,
        coordinates: seg.points,
      },
    })),
  };
}
