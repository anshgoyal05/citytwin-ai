import React, { useEffect, useRef, useState } from 'react';
import type * as maplibregl from 'maplibre-gl';
import { CloudRain, Sun, CloudFog, Moon, Car, Users, Volume2, VolumeX } from 'lucide-react';

export type WeatherMode = 'clear' | 'rain' | 'fog' | 'night';

interface WeatherAndTrafficSimulationProps {
  map: maplibregl.Map | null;
  weather: WeatherMode;
  onWeatherChange: (mode: WeatherMode) => void;
  showTraffic: boolean;
  onToggleTraffic: () => void;
  showPopulation: boolean;
  onTogglePopulation: () => void;
  fallbackProj?: {
    projX: (lng: number, width: number) => number;
    projY: (lat: number, height: number) => number;
  };
}

// Key Chandigarh Corbusier Arterials & Avenues (GPS Coordinates)
const CHANDIGARH_CORRIDORS: Array<{
  name: string;
  points: [number, number][];
}> = [
  // Madhya Marg (East-West northern artery connecting PGIMER to Transport Chowk)
  {
    name: 'Madhya Marg',
    points: [
      [76.7765, 30.7645], // PGIMER Sec 12
      [76.784, 30.758],   // Sec 11/10
      [76.793, 30.751],   // Sec 9/8
      [76.802, 30.744],   // Sec 7/26
      [76.814, 30.735],   // Transport Chowk
      [76.825, 30.725],   // Railway Station Link
    ],
  },
  // Dakshin Marg (East-West central artery connecting Sec 38 to Tribune Chowk & GMCH 32)
  {
    name: 'Dakshin Marg',
    points: [
      [76.742, 30.742],
      [76.755, 30.732], // Sec 37/38
      [76.768, 30.722], // Sec 36/35
      [76.782, 30.712], // Sec 34/33
      [76.792, 30.702], // GMCH 32 Junction
      [76.808, 30.692], // Tribune Chowk
    ],
  },
  // Vikas Marg / PR-7 (South Growth Corridor connecting Sector 52 to Airport Road)
  {
    name: 'Vikas Marg / PR-7',
    points: [
      [76.732, 30.718], // Sec 52 Maloya growth corridor
      [76.745, 30.710], // ISBT 43 Junction
      [76.760, 30.698], // Sec 44/45
      [76.775, 30.686], // Sec 46/47
      [76.795, 30.672], // Airport Expressway Link
    ],
  },
  // Jan Marg (North-South grand boulevard from Capitol Complex to ISBT 43)
  {
    name: 'Jan Marg',
    points: [
      [76.802, 30.758], // Sector 1 Capitol Complex
      [76.789, 30.748], // Matka Chowk (Sec 9/17)
      [76.778, 30.738], // Sector 17 Plaza Center
      [76.765, 30.725], // Sector 22 Aroma Chowk
      [76.755, 30.715], // Sector 35 Commercial Hub
      [76.745, 30.708], // ISBT Sector 43
    ],
  },
  // Himalaya Marg (North-South Avenue)
  {
    name: 'Himalaya Marg',
    points: [
      [76.792, 30.748], // Sec 9/10
      [76.780, 30.734], // Sec 17/18
      [76.770, 30.720], // Sec 21/22
      [76.760, 30.706], // Sec 34/35
      [76.750, 30.692], // Sec 43/44
    ],
  },
  // Sarovar Path (Sukhna Lake to Industrial Area)
  {
    name: 'Sarovar Path',
    points: [
      [76.812, 30.742], // Sukhna Lake
      [76.800, 30.728], // Sec 18/19
      [76.790, 30.715], // Sec 27/28
      [76.810, 30.700], // Industrial Area Phase 1
    ],
  },
];

// High-Footfall Population Centers for Pedestrian Simulation
const POPULATION_HUBS: Array<{
  name: string;
  coords: [number, number];
  density: number; // number of pedestrian dots
  radius: number;
}> = [
  { name: 'Sector 17 City Plaza', coords: [76.778, 30.738], density: 35, radius: 0.0035 },
  { name: 'PGIMER Hospital Campus', coords: [76.7765, 30.7645], density: 40, radius: 0.004 },
  { name: 'GMCH Sector 32', coords: [76.7925, 30.7085], density: 30, radius: 0.0035 },
  { name: 'ISBT Sector 43 Terminal', coords: [76.745, 30.718], density: 30, radius: 0.0035 },
  { name: 'Sector 22 Shastri Market', coords: [76.768, 30.728], density: 28, radius: 0.003 },
  { name: 'Sector 52 Maloya Rehabilitation Hub', coords: [76.732, 30.718], density: 35, radius: 0.004 },
  { name: 'Panjab University Campus', coords: [76.770, 30.760], density: 25, radius: 0.0035 },
];

interface VehicleState {
  id: number;
  corridorIdx: number;
  segmentIdx: number;
  t: number; // 0 to 1 along current segment
  speed: number;
  direction: 1 | -1;
  type: 'car' | 'ambulance' | 'bus';
  color: string;
}

interface PedestrianState {
  id: number;
  hubIdx: number;
  angle: number;
  dist: number;
  speed: number;
  pulseOffset: number;
}

export const WeatherAndTrafficSimulation: React.FC<WeatherAndTrafficSimulationProps> = ({
  map,
  weather,
  onWeatherChange,
  showTraffic,
  onToggleTraffic,
  showPopulation,
  onTogglePopulation,
  fallbackProj,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const vehiclesRef = useRef<VehicleState[]>([]);
  const pedestriansRef = useRef<PedestrianState[]>([]);
  const rainDropsRef = useRef<Array<{ x: number; y: number; l: number; v: number; splash: number }>>([]);
  const fogCloudsRef = useRef<Array<{ x: number; y: number; r: number; dx: number; opacity: number }>>([]);
  
  const [soundEnabled, setSoundEnabled] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const noiseNodeRef = useRef<AudioNode | null>(null);

  // Initialize Vehicles
  useEffect(() => {
    const list: VehicleState[] = [];
    let idCounter = 1;
    CHANDIGARH_CORRIDORS.forEach((corridor, cIdx) => {
      const vehicleCount = 8; // 8 vehicles per primary corridor = ~50+ live vehicles
      for (let i = 0; i < vehicleCount; i++) {
        const isAmbulance = i === 0 && (cIdx === 0 || cIdx === 1 || cIdx === 2); // Dedicated ambulances towards PGIMER / GMCH
        const isBus = i === 1 || i === 4;
        list.push({
          id: idCounter++,
          corridorIdx: cIdx,
          segmentIdx: Math.floor(Math.random() * (corridor.points.length - 1)),
          t: Math.random(),
          speed: 0.003 + Math.random() * 0.004,
          direction: Math.random() > 0.5 ? 1 : -1,
          type: isAmbulance ? 'ambulance' : isBus ? 'bus' : 'car',
          color: isAmbulance ? '#ef4444' : isBus ? '#10b981' : '#ffffff',
        });
      }
    });
    vehiclesRef.current = list;
  }, []);

  // Initialize Pedestrians
  useEffect(() => {
    const peds: PedestrianState[] = [];
    let pId = 1;
    POPULATION_HUBS.forEach((hub, hIdx) => {
      for (let i = 0; i < hub.density; i++) {
        peds.push({
          id: pId++,
          hubIdx: hIdx,
          angle: Math.random() * Math.PI * 2,
          dist: Math.random() * hub.radius,
          speed: 0.005 + Math.random() * 0.008,
          pulseOffset: Math.random() * Math.PI * 2,
        });
      }
    });
    pedestriansRef.current = peds;
  }, []);

  // Initialize Rain & Fog
  useEffect(() => {
    const drops = [];
    for (let i = 0; i < 400; i++) {
      drops.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        l: 12 + Math.random() * 14,
        v: 12 + Math.random() * 16,
        splash: 0,
      });
    }
    rainDropsRef.current = drops;

    const clouds = [];
    for (let i = 0; i < 15; i++) {
      clouds.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        r: 120 + Math.random() * 160,
        dx: 0.2 + Math.random() * 0.4,
        opacity: 0.06 + Math.random() * 0.08,
      });
    }
    fogCloudsRef.current = clouds;
  }, []);

  // Synthetic Rain Audio using Web Audio API (No external file needed!)
  useEffect(() => {
    if (weather === 'rain' && soundEnabled) {
      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (!audioCtxRef.current) {
          audioCtxRef.current = new AudioContextClass();
        }
        const ctx = audioCtxRef.current;
        if (ctx.state === 'suspended') {
          ctx.resume();
        }

        // Generate Pink Noise for authentic rain sound
        const bufferSize = ctx.sampleRate * 2;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.96900 * b2 + white * 0.1538520;
          b3 = 0.86650 * b3 + white * 0.3104856;
          b4 = 0.55000 * b4 + white * 0.5329522;
          b5 = -0.7616 * b5 - white * 0.0168980;
          output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.04;
          b6 = white * 0.115926;
        }

        const whiteNoise = ctx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(800, ctx.currentTime);

        const gainNode = ctx.createGain();
        gainNode.gain.setValueAtTime(0.2, ctx.currentTime);

        whiteNoise.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(ctx.destination);

        whiteNoise.start(0);
        noiseNodeRef.current = whiteNoise;
      } catch (err) {
        console.warn('Web Audio rain synth failed:', err);
      }
    } else {
      if (noiseNodeRef.current) {
        try {
          (noiseNodeRef.current as any).stop();
        } catch {}
        noiseNodeRef.current = null;
      }
    }

    return () => {
      if (noiseNodeRef.current) {
        try {
          (noiseNodeRef.current as any).stop();
        } catch {}
        noiseNodeRef.current = null;
      }
    };
  }, [weather, soundEnabled]);

  // Main 60 FPS Render Loop
  useEffect(() => {
    let animId: number;

    const render = () => {
      const canvas = canvasRef.current;
      if (!canvas) {
        animId = requestAnimationFrame(render);
        return;
      }

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        animId = requestAnimationFrame(render);
        return;
      }

      const width = canvas.width;
      const height = canvas.height;

      // Handle Resize
      if (canvas.clientWidth !== width || canvas.clientHeight !== height) {
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
      }

      ctx.clearRect(0, 0, width, height);

      // Coordinate Projector: Uses MapLibre if loaded, else fallback
      const projectLngLat = (lng: number, lat: number): { x: number; y: number } | null => {
        if (map && (map as any).project) {
          const pt = map.project([lng, lat]);
          return { x: pt.x, y: pt.y };
        }
        if (fallbackProj) {
          return {
            x: fallbackProj.projX(lng, width),
            y: fallbackProj.projY(lat, height),
          };
        }
        return null;
      };

      // -------------------------------------------------------------
      // 1. NIGHT OVERLAY
      // -------------------------------------------------------------
      if (weather === 'night') {
        ctx.fillStyle = 'rgba(6, 12, 28, 0.62)';
        ctx.fillRect(0, 0, width, height);
      }

      // -------------------------------------------------------------
      // 2. LIVE VEHICLE / CARS SIMULATION
      // -------------------------------------------------------------
      if (showTraffic) {
        const vehicles = vehiclesRef.current;
        vehicles.forEach((v) => {
          const corridor = CHANDIGARH_CORRIDORS[v.corridorIdx];
          if (!corridor) return;

          // Advance vehicle
          v.t += v.speed * v.direction;
          if (v.t > 1) {
            v.t = 0;
            v.segmentIdx++;
            if (v.segmentIdx >= corridor.points.length - 1) {
              v.segmentIdx = corridor.points.length - 2;
              v.direction = -1;
            }
          } else if (v.t < 0) {
            v.t = 1;
            v.segmentIdx--;
            if (v.segmentIdx < 0) {
              v.segmentIdx = 0;
              v.direction = 1;
            }
          }

          const p1 = corridor.points[v.segmentIdx];
          const p2 = corridor.points[v.segmentIdx + 1];
          if (!p1 || !p2) return;

          // Interpolated GPS position
          const lng = p1[0] + (p2[0] - p1[0]) * v.t;
          const lat = p1[1] + (p2[1] - p1[1]) * v.t;

          const screenPt = projectLngLat(lng, lat);
          if (!screenPt || screenPt.x < -50 || screenPt.x > width + 50 || screenPt.y < -50 || screenPt.y > height + 50) {
            return;
          }

          // Compute road angle
          const pt1 = projectLngLat(p1[0], p1[1]);
          const pt2 = projectLngLat(p2[0], p2[1]);
          let angle = 0;
          if (pt1 && pt2) {
            angle = Math.atan2(pt2.y - pt1.y, pt2.x - pt1.x);
            if (v.direction === -1) angle += Math.PI;
          }

          ctx.save();
          ctx.translate(screenPt.x, screenPt.y);
          ctx.rotate(angle);

          // Headlights Beam (Crisp warm glow forward)
          const isNightOrRain = weather === 'night' || weather === 'rain';
          if (isNightOrRain) {
            const beamGradient = ctx.createRadialGradient(8, 0, 1, 35, 0, 24);
            beamGradient.addColorStop(0, 'rgba(255, 255, 230, 0.6)');
            beamGradient.addColorStop(1, 'rgba(255, 255, 200, 0)');
            ctx.fillStyle = beamGradient;
            ctx.beginPath();
            ctx.moveTo(6, -4);
            ctx.lineTo(38, -14);
            ctx.lineTo(38, 14);
            ctx.lineTo(6, 4);
            ctx.closePath();
            ctx.fill();
          }

          // Ambulance Flashing Strobe Light
          if (v.type === 'ambulance') {
            const now = Date.now();
            const strobe = Math.floor(now / 150) % 2 === 0;
            // Vehicle body
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.roundRect(-7, -4, 14, 8, 2);
            ctx.fill();
            ctx.strokeStyle = '#ef4444';
            ctx.lineWidth = 1;
            ctx.stroke();

            // Emergency Flashing Beacon
            ctx.fillStyle = strobe ? '#3b82f6' : '#ef4444';
            ctx.beginPath();
            ctx.arc(0, 0, 3, 0, Math.PI * 2);
            ctx.fill();

            // Strobe beacon halo
            ctx.fillStyle = strobe ? 'rgba(59, 130, 246, 0.4)' : 'rgba(239, 68, 68, 0.4)';
            ctx.beginPath();
            ctx.arc(0, 0, 10, 0, Math.PI * 2);
            ctx.fill();
          } else if (v.type === 'bus') {
            // City Transit Bus (Longer Emerald Body)
            ctx.fillStyle = '#10b981';
            ctx.beginPath();
            ctx.roundRect(-10, -4.5, 20, 9, 3);
            ctx.fill();
            ctx.fillStyle = '#ffffff';
            // Windshield
            ctx.fillRect(4, -3.5, 4, 7);
          } else {
            // Standard Car
            ctx.fillStyle = weather === 'night' ? '#38bdf8' : '#1e293b';
            ctx.beginPath();
            ctx.roundRect(-6, -3.5, 12, 7, 2);
            ctx.fill();

            // Windshield
            ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
            ctx.fillRect(1, -2.5, 3, 5);
          }

          // Taillights (Red dots on back)
          ctx.fillStyle = isNightOrRain ? '#ff2222' : '#cc1111';
          ctx.beginPath();
          ctx.arc(-6, -2.5, 1.2, 0, Math.PI * 2);
          ctx.arc(-6, 2.5, 1.2, 0, Math.PI * 2);
          ctx.fill();

          // Headlights (Warm White on front)
          ctx.fillStyle = '#ffffcc';
          ctx.beginPath();
          ctx.arc(6, -2.5, 1.4, 0, Math.PI * 2);
          ctx.arc(6, 2.5, 1.4, 0, Math.PI * 2);
          ctx.fill();

          ctx.restore();
        });
      }

      // -------------------------------------------------------------
      // 3. LIVE POPULATION PEDESTRIAN SIMULATION
      // -------------------------------------------------------------
      if (showPopulation) {
        const peds = pedestriansRef.current;
        const now = Date.now() / 1000;

        peds.forEach((p) => {
          const hub = POPULATION_HUBS[p.hubIdx];
          if (!hub) return;

          // Pedestrian wandering motion
          p.angle += (p.speed * 0.2);
          const currentDist = p.dist + Math.sin(now * 2 + p.pulseOffset) * 0.0004;

          const pLng = hub.coords[0] + Math.cos(p.angle) * currentDist;
          const pLat = hub.coords[1] + Math.sin(p.angle) * currentDist * 0.8; // Elliptical sector spread

          const pt = projectLngLat(pLng, pLat);
          if (!pt || pt.x < -10 || pt.x > width + 10 || pt.y < -10 || pt.y > height + 10) return;

          // Pedestrian dot with subtle walking pulse
          ctx.fillStyle = weather === 'night' ? 'rgba(56, 189, 248, 0.9)' : 'rgba(30, 41, 59, 0.85)';
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, 2, 0, Math.PI * 2);
          ctx.fill();

          // Pulse wave on periodic clusters
          if (p.id % 6 === 0) {
            const wave = (now * 1.5 + p.pulseOffset) % 1;
            ctx.strokeStyle = `rgba(0, 113, 227, ${0.4 * (1 - wave)})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, 4 + wave * 12, 0, Math.PI * 2);
            ctx.stroke();
          }
        });
      }

      // -------------------------------------------------------------
      // 4. WEATHER: RAIN SIMULATION
      // -------------------------------------------------------------
      if (weather === 'rain') {
        // Dark rainy overcast sky tint
        ctx.fillStyle = 'rgba(15, 23, 42, 0.22)';
        ctx.fillRect(0, 0, width, height);

        const drops = rainDropsRef.current;
        ctx.strokeStyle = 'rgba(200, 225, 255, 0.55)';
        ctx.lineWidth = 1.3;

        drops.forEach((d) => {
          d.y += d.v;
          d.x += 1.8; // wind slant

          if (d.y > height) {
            d.y = -d.l;
            d.x = Math.random() * (width + 100) - 50;
            d.splash = 1;
          }

          // Rain streak
          ctx.beginPath();
          ctx.moveTo(d.x, d.y);
          ctx.lineTo(d.x + 2.5, d.y + d.l);
          ctx.stroke();

          // Ground Splash Ring
          if (d.splash > 0) {
            ctx.strokeStyle = `rgba(220, 235, 255, ${d.splash * 0.35})`;
            ctx.beginPath();
            ctx.ellipse(d.x, d.y + d.l, 3 * (1 - d.splash + 0.5), 1.5 * (1 - d.splash + 0.5), 0, 0, Math.PI * 2);
            ctx.stroke();
            d.splash -= 0.1;
          }
        });
      }

      // -------------------------------------------------------------
      // 5. WEATHER: FOG SIMULATION
      // -------------------------------------------------------------
      if (weather === 'fog') {
        const clouds = fogCloudsRef.current;
        clouds.forEach((c) => {
          c.x += c.dx;
          if (c.x - c.r > width) c.x = -c.r;

          const grad = ctx.createRadialGradient(c.x, c.y, 10, c.x, c.y, c.r);
          grad.addColorStop(0, `rgba(240, 245, 255, ${c.opacity * 1.5})`);
          grad.addColorStop(0.7, `rgba(230, 238, 250, ${c.opacity * 0.7})`);
          grad.addColorStop(1, 'rgba(255, 255, 255, 0)');

          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
          ctx.fill();
        });
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [map, weather, showTraffic, showPopulation, fallbackProj]);

  return (
    <>
      {/* 60 FPS Particle Canvas Overlay */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-10"
      />

      {/* Weather & Live Simulation Floating Apple Pill Toolbar */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 p-1 rounded-full glass-panel border border-apple-border-light dark:border-apple-border-dark shadow-apple-card whitespace-nowrap">
        {/* Weather Selector Segmented Control */}
        <div className="flex items-center gap-0.5">
          {[
            { id: 'clear', label: 'Clear', icon: Sun },
            { id: 'rain', label: 'Rain', icon: CloudRain },
            { id: 'fog', label: 'Fog', icon: CloudFog },
            { id: 'night', label: 'Night', icon: Moon },
          ].map((item) => {
            const Icon = item.icon;
            const active = weather === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onWeatherChange(item.id as WeatherMode)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                  active
                    ? 'bg-apple-accent text-white shadow-apple-subtle font-semibold'
                    : 'text-apple-text-secondary-light dark:text-apple-text-secondary-dark hover:text-apple-text-primary-light dark:hover:text-apple-text-primary-dark hover:bg-black/5 dark:hover:bg-white/10'
                }`}
                title={`Switch to ${item.label} conditions`}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span className="hidden sm:inline">{item.label}</span>
              </button>
            );
          })}

          {/* Rain Sound Toggle if in Rain Mode */}
          {weather === 'rain' && (
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-1 rounded-full transition-all ml-0.5 ${
                soundEnabled
                  ? 'bg-blue-500/20 text-blue-600 dark:text-blue-400'
                  : 'text-apple-text-secondary-light hover:bg-black/5 dark:hover:bg-white/10'
              }`}
              title={soundEnabled ? 'Mute Rain Ambience' : 'Play Ambient Rain Sound'}
            >
              {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            </button>
          )}
        </div>

        {/* Divider */}
        <div className="w-px h-4 bg-apple-border-light dark:border-apple-border-dark shrink-0 mx-0.5" />

        {/* Live Traffic Toggle Pill */}
        <button
          onClick={onToggleTraffic}
          className={`px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 transition-all whitespace-nowrap ${
            showTraffic
              ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-semibold'
              : 'text-apple-text-secondary-light dark:text-apple-text-secondary-dark hover:text-apple-text-primary-light dark:hover:text-apple-text-primary-dark hover:bg-black/5 dark:hover:bg-white/10'
          }`}
          title="Toggle animated live vehicle traffic on Chandigarh avenues"
        >
          <Car className={`w-3.5 h-3.5 shrink-0 ${showTraffic ? 'text-emerald-600 dark:text-emerald-400 animate-pulse' : ''}`} />
          <span className="hidden md:inline">Cars</span>
          <span
            className={`w-1.5 h-1.5 rounded-full shrink-0 ${
              showTraffic ? 'bg-emerald-500 animate-ping' : 'bg-black/20 dark:bg-white/20'
            }`}
          />
        </button>

        {/* Live Population Toggle Pill */}
        <button
          onClick={onTogglePopulation}
          className={`px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 transition-all whitespace-nowrap ${
            showPopulation
              ? 'bg-indigo-500/15 border border-indigo-500/30 text-indigo-600 dark:text-indigo-400 font-semibold'
              : 'text-apple-text-secondary-light dark:text-apple-text-secondary-dark hover:text-apple-text-primary-light dark:hover:text-apple-text-primary-dark hover:bg-black/5 dark:hover:bg-white/10'
          }`}
          title="Toggle live pedestrian flow and density pulses around commercial and hospital hubs"
        >
          <Users className={`w-3.5 h-3.5 shrink-0 ${showPopulation ? 'text-indigo-600 dark:text-indigo-400' : ''}`} />
          <span className="hidden md:inline">Population</span>
          <span
            className={`w-1.5 h-1.5 rounded-full shrink-0 ${
              showPopulation ? 'bg-indigo-500' : 'bg-black/20 dark:bg-white/20'
            }`}
          />
        </button>
      </div>
    </>
  );
};
