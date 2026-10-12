/**
 * High-Performance WebGL 3D Vehicle Simulation Engine
 * Simulates realistic traffic along Chandigarh's 7Vs road network.
 * Features:
 * - Graph-based routing: vehicles navigate seamlessly across intersections & roundabouts
 * - Left-hand drive lane discipline (authentic to India)
 * - 3D extruded geometry (chassis, cabin, emergency strobe beacons, headlights)
 * - Real-time smooth animation synced with Deck.gl WebGL rendering
 */

import {
  ROAD_SEGMENTS,
  ROAD_NODES,
  getRoadGraph,
  getPositionAndHeadingOnSegment,
  METERS_TO_DEG_LAT,
  METERS_TO_DEG_LNG,
  type RoadSegment,
} from '../../data/chandigarh_road_network';

export type VehicleType = 'car' | 'ambulance' | 'bus';

export interface SimulatedVehicle {
  id: number;
  segmentId: string;
  direction: 1 | -1;
  targetNodeId: string;
  progress: number; // 0.0 to 1.0
  speed: number;    // delta progress per second
  type: VehicleType;
  color: [number, number, number];
  lengthM: number;
  widthM: number;
  heightM: number;
  laneOffsetM: number;
  // Dynamic state
  currentLng: number;
  currentLat: number;
  bearingDeg: number;
}

export interface Vehicle3DPolygon {
  id: string;
  polygon: [number, number][]; // coordinates
  elevation: number;
  baseElevation: number;
  color: [number, number, number, number];
  isStrobe?: boolean;
}

// Vehicle Color Palettes
const CAR_COLORS: Array<[number, number, number]> = [
  [30, 41, 59],    // Slate Metallic
  [248, 250, 252], // Pearl White
  [37, 99, 235],   // Royal Sapphire
  [71, 85, 105],   // Graphite Grey
  [220, 38, 38],   // Crimson Red
  [15, 23, 42],    // Midnight Black
];

/**
 * Initializes a fleet of simulated vehicles distributed across Chandigarh roads.
 */
export function initVehicleFleet(count: number = 48): SimulatedVehicle[] {
  const vehicles: SimulatedVehicle[] = [];
  const segments = ROAD_SEGMENTS;
  const numSegments = segments.length;

  for (let i = 0; i < count; i++) {
    const seg = segments[i % numSegments];
    const direction: 1 | -1 = i % 2 === 0 ? 1 : -1;
    const targetNodeId = direction === 1 ? seg.toNode : seg.fromNode;

    // Determine type: 1 in 8 is an ambulance, 1 in 6 is a CTU bus, rest are cars
    let type: VehicleType = 'car';
    if (i % 8 === 0) {
      type = 'ambulance';
    } else if (i % 5 === 0) {
      type = 'bus';
    }

    let lengthM = 4.5;
    let widthM = 1.9;
    let heightM = 1.5;
    let color: [number, number, number] = CAR_COLORS[i % CAR_COLORS.length];
    let laneOffsetM = 2.2;

    if (type === 'ambulance') {
      lengthM = 5.8;
      widthM = 2.2;
      heightM = 2.4;
      color = [255, 255, 255];
      laneOffsetM = 2.4;
    } else if (type === 'bus') {
      lengthM = 11.2;
      widthM = 2.6;
      heightM = 3.2;
      color = [5, 150, 105]; // CTU Emerald Green
      laneOffsetM = 3.0;
    }

    // Calculate speed based on road speed limit (progress units per second)
    // Approximate segment length in meters
    const approxSegLenMeters = 800;
    const speedMps = (seg.speedLimitKmH * 1000) / 3600;
    const baseSpeed = (speedMps / approxSegLenMeters) * (0.8 + Math.random() * 0.4) * 0.35; // tuned for realistic visual speed

    const initialProgress = (i * 0.23 + Math.random() * 0.1) % 1.0;
    const { position, bearingDeg } = getPositionAndHeadingOnSegment(
      seg,
      direction,
      initialProgress,
      laneOffsetM
    );

    vehicles.push({
      id: i + 1,
      segmentId: seg.id,
      direction,
      targetNodeId,
      progress: initialProgress,
      speed: Math.max(0.015, Math.min(0.05, baseSpeed)),
      type,
      color,
      lengthM,
      widthM,
      heightM,
      laneOffsetM,
      currentLng: position[0],
      currentLat: position[1],
      bearingDeg,
    });
  }

  return vehicles;
}

/**
 * Updates vehicle positions along the road network graph.
 * When reaching an intersection, picks a connected outgoing road to continue.
 */
export function tickVehicleFleet(
  fleet: SimulatedVehicle[],
  deltaSeconds: number
): void {
  const roadGraph = getRoadGraph();

  for (const v of fleet) {
    const currentSeg = ROAD_SEGMENTS.find((s) => s.id === v.segmentId);
    if (!currentSeg) continue;

    // Advance vehicle
    v.progress += v.speed * deltaSeconds;

    if (v.progress >= 1.0) {
      // Reached target intersection node
      const currentNodeId = v.targetNodeId;
      const connectedEdges = roadGraph.get(currentNodeId) || [];

      // Filter options (prefer edges that don't immediately backtrack if multiple options exist)
      let candidates = connectedEdges.filter(
        (edge) => edge.segment.id !== v.segmentId
      );
      if (candidates.length === 0) {
        // Dead end or loopback - allow turning back
        candidates = connectedEdges;
      }

      if (candidates.length > 0) {
        // Randomly choose branch (e.g. turn right, left, or straight)
        const chosenEdge = candidates[Math.floor(Math.random() * candidates.length)];
        v.segmentId = chosenEdge.segment.id;
        v.direction = chosenEdge.direction;
        v.targetNodeId = chosenEdge.targetNodeId;
        v.progress = 0.0;
      } else {
        // Reverse along same segment
        v.direction = (v.direction * -1) as 1 | -1;
        v.targetNodeId = v.direction === 1 ? currentSeg.toNode : currentSeg.fromNode;
        v.progress = 0.0;
      }
    }

    // Calculate new position and heading
    const activeSeg = ROAD_SEGMENTS.find((s) => s.id === v.segmentId) || currentSeg;
    const { position, bearingDeg } = getPositionAndHeadingOnSegment(
      activeSeg,
      v.direction,
      v.progress,
      v.laneOffsetM
    );

    v.currentLng = position[0];
    v.currentLat = position[1];
    v.bearingDeg = bearingDeg;
  }
}

/**
 * Generates true 3D WebGL extruded polygons for all vehicles.
 * Ready for Deck.gl PolygonLayer.
 */
export function generate3DVehiclePolygons(
  fleet: SimulatedVehicle[],
  isNightOrRain: boolean,
  currentTimeMs: number
): Vehicle3DPolygon[] {
  const polygons: Vehicle3DPolygon[] = [];
  const strobeState = Math.floor(currentTimeMs / 180) % 2 === 0;

  for (const v of fleet) {
    const rad = (v.bearingDeg * Math.PI) / 180;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);

    const hw = v.widthM / 2;
    const hl = v.lengthM / 2;

    // 4 corners in local vehicle coordinates (dy = forward along heading, dx = lateral)
    const localCorners = [
      [-hw, -hl],
      [hw, -hl],
      [hw, hl],
      [-hw, hl],
      [-hw, -hl],
    ];

    // Transform to GPS coordinates
    const footprint: [number, number][] = localCorners.map(([x, y]) => {
      // Rotate by bearing (bearing is clockwise from North)
      // forward is along heading angle:
      const rx = x * cos + y * sin;
      const ry = -x * sin + y * cos;
      return [
        v.currentLng + rx * METERS_TO_DEG_LNG,
        v.currentLat + ry * METERS_TO_DEG_LAT,
      ];
    });

    // 1. Vehicle Main Body
    polygons.push({
      id: `v_body_${v.id}`,
      polygon: footprint,
      baseElevation: 0.2,
      elevation: v.heightM,
      color: [v.color[0], v.color[1], v.color[2], 245],
    });

    // 2. Ambulance Flashing Strobe Beacon on Roof
    if (v.type === 'ambulance') {
      const beaconW = 0.8;
      const beaconL = 0.8;
      const beaconCorners: [number, number][] = [
        [-beaconW / 2, -beaconL / 2],
        [beaconW / 2, -beaconL / 2],
        [beaconW / 2, beaconL / 2],
        [-beaconW / 2, beaconL / 2],
        [-beaconW / 2, -beaconL / 2],
      ].map(([x, y]) => {
        const rx = x * cos + y * sin;
        const ry = -x * sin + y * cos;
        return [
          v.currentLng + rx * METERS_TO_DEG_LNG,
          v.currentLat + ry * METERS_TO_DEG_LAT,
        ];
      });

      // Alternate flashing red and blue
      const strobeColor: [number, number, number, number] = strobeState
        ? [239, 68, 68, 255] // Emergency Red
        : [59, 130, 246, 255]; // Emergency Blue

      polygons.push({
        id: `v_strobe_${v.id}`,
        polygon: beaconCorners,
        baseElevation: v.heightM,
        elevation: v.heightM + 0.5,
        color: strobeColor,
        isStrobe: true,
      });
    }

    // 3. Headlight Light Cones onto the asphalt (Night or Rain)
    if (isNightOrRain) {
      const beamLength = 14; // meters forward
      const beamSpread = 6;  // meters wide at tip
      const beamCorners: [number, number][] = [
        [-hw * 0.8, hl],
        [hw * 0.8, hl],
        [beamSpread / 2, hl + beamLength],
        [-beamSpread / 2, hl + beamLength],
        [-hw * 0.8, hl],
      ].map(([x, y]) => {
        const rx = x * cos + y * sin;
        const ry = -x * sin + y * cos;
        return [
          v.currentLng + rx * METERS_TO_DEG_LNG,
          v.currentLat + ry * METERS_TO_DEG_LAT,
        ];
      });

      polygons.push({
        id: `v_light_${v.id}`,
        polygon: beamCorners,
        baseElevation: 0.05,
        elevation: 0.1,
        color: [255, 255, 210, 45], // Soft warm halogen / LED glow
      });
    }
  }

  return polygons;
}
