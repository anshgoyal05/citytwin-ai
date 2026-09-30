import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import * as maplibregl from 'maplibre-gl';
import { MapboxOverlay } from '@deck.gl/mapbox';
import { GeoJsonLayer, ScatterplotLayer, ColumnLayer, TextLayer } from '@deck.gl/layers';
import { useCity } from '../../context/CityContext';
import type { SectorData, CandidateSite, HospitalData } from '../../types';
import sectorsGeoJson from '../../data/chandigarh_sectors_geojson';
import {
  ZoomIn,
  ZoomOut,
  Compass,
  Navigation,
  HeartPulse,
  Sparkles,
  Layers,
  Building,
} from 'lucide-react';

const BASEMAP_STYLE: any = {
  version: 8,
  sources: {
    'carto-positron': {
      type: 'raster',
      tiles: [
        'https://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
        'https://b.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
        'https://c.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
      ],
      tileSize: 256,
      attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
    },
  },
  layers: [
    {
      id: 'carto-positron-layer',
      type: 'raster',
      source: 'carto-positron',
      minzoom: 0,
      maxzoom: 19,
    },
  ],
};

interface TooltipInfo {
  x: number;
  y: number;
  object: any;
  type: 'sector' | 'candidate' | 'hospital';
}

function checkWebGL2Support(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return !!(window.WebGL2RenderingContext && canvas.getContext('webgl2'));
  } catch {
    return false;
  }
}

export const Chandigarh3DMap: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const overlayRef = useRef<MapboxOverlay | null>(null);

  const {
    sectors,
    candidateSites,
    hospitals,
    layers,
    selectedSector,
    setSelectedSector,
    selectedCandidate,
    setSelectedCandidate,
    mapViewState,
    setMapViewState,
  } = useCity();

  const [hasWebGL, setHasWebGL] = useState<boolean>(true);
  const [hoverInfo, setHoverInfo] = useState<TooltipInfo | null>(null);

  // Chandigarh Mercator projection parameters for fallback 2D/pseudo-3D canvas
  // Bounds: lng 76.68 to 76.88, lat 30.66 to 30.80
  const projX = useCallback((lng: number, width: number) => {
    const minLng = 76.68;
    const maxLng = 76.88;
    return ((lng - minLng) / (maxLng - minLng)) * width;
  }, []);

  const projY = useCallback((lat: number, height: number) => {
    const minLat = 30.66;
    const maxLat = 30.80;
    return height - ((lat - minLat) / (maxLat - minLat)) * height;
  }, []);

  // Check WebGL availability on mount
  useEffect(() => {
    const webglSupported = checkWebGL2Support();
    if (!webglSupported) {
      console.warn('WebGL2 not supported in current environment; switching to high-precision 2D/3D fallback renderer.');
      setHasWebGL(false);
    }
  }, []);

  // Deck.GL layers for WebGL mode
  const isochroneFeatures = useMemo(() => {
    if (!layers.isochrones) return [];
    const circles: Array<{
      center: [number, number];
      radiusMeters: number;
      label: string;
      color: [number, number, number, number];
      siteId: string;
      siteName: string;
    }> = [];

    const focusSites = selectedCandidate ? [selectedCandidate] : candidateSites.slice(0, 3);
    focusSites.forEach((site) => {
      circles.push({
        center: site.coordinates,
        radiusMeters: 1500,
        label: '5-min (1.5 km)',
        color: [52, 199, 89, 45],
        siteId: site.id,
        siteName: site.name,
      });
      circles.push({
        center: site.coordinates,
        radiusMeters: 3000,
        label: '10-min (3.0 km)',
        color: [0, 113, 227, 30],
        siteId: site.id,
        siteName: site.name,
      });
      circles.push({
        center: site.coordinates,
        radiusMeters: 5000,
        label: '15-min (5.0 km)',
        color: [175, 82, 222, 20],
        siteId: site.id,
        siteName: site.name,
      });
    });
    return circles;
  }, [layers.isochrones, selectedCandidate, candidateSites]);

  const deckLayers = useMemo(() => {
    if (!hasWebGL) return [];
    const layerList: any[] = [];

    if (layers.sectors) {
      layerList.push(
        new GeoJsonLayer({
          id: 'chandigarh-sectors-layer',
          data: sectorsGeoJson as any,
          pickable: true,
          stroked: true,
          filled: true,
          lineWidthMinPixels: 1.5,
          getLineColor: (f: any) => {
            const isSelected = selectedSector && selectedSector.sector_name === f.properties.sector_name;
            return isSelected ? [0, 113, 227, 255] : [100, 116, 139, 140];
          },
          getLineWidth: (f: any) => {
            const isSelected = selectedSector && selectedSector.sector_name === f.properties.sector_name;
            return isSelected ? 4 : 1.5;
          },
          getFillColor: (f: any) => {
            const density = f.properties.density_per_sqkm || 20000;
            const isSelected = selectedSector && selectedSector.sector_name === f.properties.sector_name;
            if (isSelected) return [0, 113, 227, 85];
            if (density > 45000) return [239, 68, 68, 90];
            if (density > 35000) return [249, 115, 22, 75];
            if (density > 25000) return [59, 130, 246, 65];
            if (density > 15000) return [147, 197, 253, 50];
            return [226, 232, 240, 40];
          },
          updateTriggers: {
            getLineColor: [selectedSector],
            getLineWidth: [selectedSector],
            getFillColor: [selectedSector],
          },
          onHover: (info: any) => {
            if (info.object) {
              setHoverInfo({
                x: info.x,
                y: info.y,
                object: info.object.properties,
                type: 'sector',
              });
            } else {
              setHoverInfo(null);
            }
          },
          onClick: (info: any) => {
            if (info.object) {
              const matched = sectors.find(
                (s) => s.sector_name === info.object.properties.sector_name
              );
              if (matched) {
                setSelectedSector(matched);
                if (mapRef.current) {
                  mapRef.current.flyTo({
                    center: [matched.center[0], matched.center[1]],
                    zoom: 14,
                    pitch: 50,
                    duration: 1200,
                  });
                }
              }
            }
          },
        })
      );
    }

    if (layers.extrudedDensity) {
      layerList.push(
        new ColumnLayer({
          id: 'extruded-population-columns',
          data: sectors,
          diskResolution: 6,
          radius: 120,
          extruded: true,
          pickable: true,
          elevationScale: 0.08,
          getPosition: (d: SectorData) => [d.center[0], d.center[1]],
          getElevation: (d: SectorData) => Math.max(50, d.density_per_sqkm * 0.05),
          getFillColor: (d: SectorData) => {
            const dens = d.density_per_sqkm;
            if (dens > 40000) return [239, 68, 68, 190];
            if (dens > 30000) return [249, 115, 22, 175];
            if (dens > 20000) return [0, 113, 227, 160];
            return [52, 199, 89, 140];
          },
          onHover: (info: any) => {
            if (info.object) {
              setHoverInfo({
                x: info.x,
                y: info.y,
                object: info.object,
                type: 'sector',
              });
            }
          },
          onClick: (info: any) => {
            if (info.object) {
              setSelectedSector(info.object as SectorData);
            }
          },
        })
      );
    }

    if (layers.isochrones && isochroneFeatures.length > 0) {
      layerList.push(
        new ScatterplotLayer({
          id: 'isochrone-rings-layer',
          data: isochroneFeatures,
          pickable: false,
          stroked: true,
          filled: true,
          radiusScale: 1,
          radiusMinPixels: 20,
          getPosition: (d: any) => d.center,
          getRadius: (d: any) => d.radiusMeters,
          getFillColor: (d: any) => d.color,
          getLineColor: (d: any) => [d.color[0], d.color[1], d.color[2], 180],
          getLineWidth: 2,
        })
      );
    }

    if (layers.existingHospitals) {
      layerList.push(
        new ScatterplotLayer({
          id: 'existing-hospitals-core',
          data: hospitals,
          pickable: true,
          stroked: true,
          filled: true,
          radiusMinPixels: 6,
          radiusMaxPixels: 16,
          getPosition: (d: HospitalData) => d.coordinates,
          getRadius: 160,
          getFillColor: [239, 68, 68, 230],
          getLineColor: [255, 255, 255, 255],
          getLineWidth: 2,
          onHover: (info: any) => {
            if (info.object) {
              setHoverInfo({
                x: info.x,
                y: info.y,
                object: info.object,
                type: 'hospital',
              });
            } else {
              setHoverInfo(null);
            }
          },
          onClick: (info: any) => {
            if (info.object) {
              const h = info.object as HospitalData;
              if (mapRef.current) {
                mapRef.current.flyTo({
                  center: h.coordinates,
                  zoom: 14.8,
                  pitch: 58,
                  duration: 1200,
                });
              }
            }
          },
        })
      );
    }

    if (layers.candidateSites) {
      layerList.push(
        new ScatterplotLayer({
          id: 'candidate-sites-pin',
          data: candidateSites,
          pickable: true,
          stroked: true,
          filled: true,
          radiusMinPixels: 8,
          radiusMaxPixels: 20,
          getPosition: (d: CandidateSite) => d.coordinates,
          getRadius: 180,
          getFillColor: (d: CandidateSite) => {
            return d.rank === 1 ? [52, 199, 89, 255] : [0, 113, 227, 255];
          },
          getLineColor: [255, 255, 255, 255],
          getLineWidth: 2.5,
          onHover: (info: any) => {
            if (info.object) {
              setHoverInfo({
                x: info.x,
                y: info.y,
                object: info.object,
                type: 'candidate',
              });
            } else {
              setHoverInfo(null);
            }
          },
          onClick: (info: any) => {
            if (info.object) {
              const c = info.object as CandidateSite;
              setSelectedCandidate(c);
            }
          },
        })
      );

      layerList.push(
        new TextLayer({
          id: 'candidate-sites-rank-text',
          data: candidateSites,
          pickable: false,
          getPosition: (d: CandidateSite) => [d.coordinates[0], d.coordinates[1]],
          getText: (d: CandidateSite) => `#${d.rank}`,
          getSize: 12,
          getColor: [255, 255, 255, 255],
          getTextAnchor: 'middle',
          getAlignmentBaseline: 'center',
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
          fontWeight: 700,
        })
      );
    }

    return layerList;
  }, [
    hasWebGL,
    layers,
    sectors,
    candidateSites,
    hospitals,
    selectedSector,
    selectedCandidate,
    isochroneFeatures,
    setSelectedCandidate,
    setSelectedSector,
  ]);

  // Mount MapLibre when WebGL is available
  useEffect(() => {
    if (!hasWebGL || !mapContainerRef.current || mapRef.current) return;

    try {
      const map = new maplibregl.Map({
        container: mapContainerRef.current,
        style: BASEMAP_STYLE,
        center: [mapViewState.longitude, mapViewState.latitude],
        zoom: mapViewState.zoom,
        pitch: mapViewState.pitch,
        bearing: mapViewState.bearing,
      });

      const overlay = new MapboxOverlay({
        layers: deckLayers,
      });

      map.on('load', () => {
        try {
          map.addControl(overlay as any);
        } catch (e) {
          console.warn('MapboxOverlay attachment deferred:', e);
        }
      });

      map.on('move', () => {
        const c = map.getCenter();
        setMapViewState((prev: any) => ({
          ...prev,
          longitude: c.lng,
          latitude: c.lat,
          zoom: map.getZoom(),
          pitch: map.getPitch(),
          bearing: map.getBearing(),
        }));
      });

      mapRef.current = map;
      overlayRef.current = overlay;
    } catch (err) {
      console.warn('MapLibre GL failed to initialize (no WebGL2 GPU); falling back to SVG renderer:', err);
      setHasWebGL(false);
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [hasWebGL]);

  // Sync overlay layers
  useEffect(() => {
    if (overlayRef.current) {
      overlayRef.current.setProps({
        layers: deckLayers,
      });
    }
  }, [deckLayers]);

  // Camera handlers
  const handleZoomIn = () => {
    if (mapRef.current) {
      mapRef.current.zoomIn({ duration: 300 });
    } else {
      setMapViewState((v: any) => ({ ...v, zoom: v.zoom + 0.5 }));
    }
  };

  const handleZoomOut = () => {
    if (mapRef.current) {
      mapRef.current.zoomOut({ duration: 300 });
    } else {
      setMapViewState((v: any) => ({ ...v, zoom: v.zoom - 0.5 }));
    }
  };

  const handleResetBearing = () => {
    if (mapRef.current) {
      mapRef.current.easeTo({ bearing: 0, pitch: 45, duration: 600 });
    }
  };

  const handleChandigarhOverview = () => {
    if (mapRef.current) {
      mapRef.current.flyTo({
        center: [76.7794, 30.7333],
        zoom: 12.4,
        pitch: 52,
        bearing: -18,
        duration: 1200,
      });
    }
  };

  return (
    <div className="w-full h-full relative overflow-hidden bg-[#eef1f5]">
      {hasWebGL ? (
        <div ref={mapContainerRef} className="w-full h-full" />
      ) : (
        /* Fallback High-Fidelity 2D/3D SVG Spatial Vector Engine */
        <div className="w-full h-full relative overflow-hidden bg-[#f4f6f9] flex items-center justify-center select-none">
          <svg
            viewBox="0 0 1000 700"
            className="w-full h-full cursor-crosshair"
            style={{ filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.06))' }}
          >
            {/* Background Grid Pattern */}
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(0,0,0,0.04)" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="1000" height="700" fill="url(#grid)" />

            {/* Isochrone Catchment Waves around Candidate Sites */}
            {layers.isochrones &&
              candidateSites.slice(0, 3).map((site) => {
                const cx = projX(site.coordinates[0], 1000);
                const cy = projY(site.coordinates[1], 700);
                return (
                  <g key={`iso-${site.id}`}>
                    <circle cx={cx} cy={cy} r="160" fill="rgba(175, 82, 222, 0.08)" stroke="rgba(175, 82, 222, 0.3)" strokeDasharray="4 4" />
                    <circle cx={cx} cy={cy} r="100" fill="rgba(0, 113, 227, 0.12)" stroke="rgba(0, 113, 227, 0.4)" />
                    <circle cx={cx} cy={cy} r="50" fill="rgba(52, 199, 89, 0.18)" stroke="rgba(52, 199, 89, 0.5)" />
                  </g>
                );
              })}

            {/* Chandigarh Sector Grid Polygons */}
            {layers.sectors &&
              sectorsGeoJson.features.map((feat: any, idx: number) => {
                const coords = feat.geometry.coordinates[0];
                const pts = coords
                  .map((pt: [number, number]) => `${projX(pt[0], 1000)},${projY(pt[1], 700)}`)
                  .join(' ');
                const density = feat.properties.density_per_sqkm;
                const isSelected = selectedSector && selectedSector.sector_name === feat.properties.sector_name;

                let fillColor = 'rgba(226, 232, 240, 0.5)';
                if (density > 40000) fillColor = 'rgba(239, 68, 68, 0.45)';
                else if (density > 30000) fillColor = 'rgba(249, 115, 22, 0.4)';
                else if (density > 20000) fillColor = 'rgba(59, 130, 246, 0.35)';

                if (isSelected) fillColor = 'rgba(0, 113, 227, 0.7)';

                return (
                  <g key={`sec-${idx}`}>
                    <polygon
                      points={pts}
                      fill={fillColor}
                      stroke={isSelected ? '#0071e3' : 'rgba(100, 116, 139, 0.4)'}
                      strokeWidth={isSelected ? '2.5' : '1'}
                      className="transition-colors duration-200 hover:fill-blue-500/60 cursor-pointer"
                      onClick={() => {
                        const s = sectors.find((sec) => sec.sector_name === feat.properties.sector_name);
                        if (s) setSelectedSector(s);
                      }}
                      onMouseEnter={(e) => {
                        setHoverInfo({
                          x: e.clientX,
                          y: e.clientY,
                          object: feat.properties,
                          type: 'sector',
                        });
                      }}
                      onMouseLeave={() => setHoverInfo(null)}
                    />
                    {/* Sector Centroid Label */}
                    <text
                      x={projX(feat.properties.center[0], 1000)}
                      y={projY(feat.properties.center[1], 700) + 3}
                      fontSize="8"
                      fontWeight="bold"
                      fill="#475569"
                      textAnchor="middle"
                      pointerEvents="none"
                    >
                      {feat.properties.sector_name.replace('Sector ', 'S-')}
                    </text>
                  </g>
                );
              })}

            {/* 3D Pseudo-Extruded Density Columns */}
            {layers.extrudedDensity &&
              sectors.map((sec) => {
                const cx = projX(sec.center[0], 1000);
                const cy = projY(sec.center[1], 700);
                const barHeight = Math.min(65, Math.max(12, (sec.density_per_sqkm / 50000) * 65));
                const colColor = sec.density_per_sqkm > 35000 ? '#ef4444' : sec.density_per_sqkm > 22000 ? '#0071e3' : '#10b981';

                return (
                  <g key={`col-${sec.sector_name}`} pointerEvents="none">
                    {/* Base shadow */}
                    <ellipse cx={cx} cy={cy} rx="5" ry="2.5" fill="rgba(0,0,0,0.2)" />
                    {/* Column body */}
                    <rect
                      x={cx - 3.5}
                      y={cy - barHeight}
                      width="7"
                      height={barHeight}
                      fill={colColor}
                      rx="2"
                      opacity="0.85"
                    />
                    {/* Top cap */}
                    <circle cx={cx} cy={cy - barHeight} r="3.5" fill="#ffffff" opacity="0.9" />
                  </g>
                );
              })}

            {/* Ground-Truth Existing Hospitals */}
            {layers.existingHospitals &&
              hospitals.map((h) => {
                const cx = projX(h.coordinates[0], 1000);
                const cy = projY(h.coordinates[1], 700);
                return (
                  <g
                    key={h.id}
                    className="cursor-pointer"
                    onClick={() => {
                      const s = sectors.find((sec) => sec.sector_name === h.sector);
                      if (s) setSelectedSector(s);
                    }}
                    onMouseEnter={(e) => {
                      setHoverInfo({
                        x: e.clientX,
                        y: e.clientY,
                        object: h,
                        type: 'hospital',
                      });
                    }}
                    onMouseLeave={() => setHoverInfo(null)}
                  >
                    <circle cx={cx} cy={cy} r="12" fill="rgba(239, 68, 68, 0.2)" className="animate-ping" />
                    <circle cx={cx} cy={cy} r="7" fill="#ef4444" stroke="#ffffff" strokeWidth="2" />
                    <text x={cx} y={cy + 3} fontSize="9" fontWeight="bold" fill="#ffffff" textAnchor="middle" pointerEvents="none">
                      +
                    </text>
                  </g>
                );
              })}

            {/* AI Ranked Candidate Sites */}
            {layers.candidateSites &&
              candidateSites.map((c) => {
                const cx = projX(c.coordinates[0], 1000);
                const cy = projY(c.coordinates[1], 700);
                const isSelected = selectedCandidate && selectedCandidate.id === c.id;
                const pinColor = c.rank === 1 ? '#10b981' : '#0071e3';

                return (
                  <g
                    key={c.id}
                    className="cursor-pointer"
                    onClick={() => setSelectedCandidate(c)}
                    onMouseEnter={(e) => {
                      setHoverInfo({
                        x: e.clientX,
                        y: e.clientY,
                        object: c,
                        type: 'candidate',
                      });
                    }}
                    onMouseLeave={() => setHoverInfo(null)}
                  >
                    <circle cx={cx} cy={cy} r={isSelected ? '22' : '15'} fill={c.rank === 1 ? 'rgba(16,185,129,0.25)' : 'rgba(0,113,227,0.2)'} />
                    <circle cx={cx} cy={cy} r="10" fill={pinColor} stroke="#ffffff" strokeWidth="2" />
                    <text x={cx} y={cy + 3.5} fontSize="9" fontWeight="900" fill="#ffffff" textAnchor="middle" pointerEvents="none">
                      #{c.rank}
                    </text>
                  </g>
                );
              })}
          </svg>
        </div>
      )}

      {/* Floating HUD Controls (Apple Minimalist Glass) */}
      <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
        <div className="glass-panel p-1.5 rounded-2xl flex flex-col gap-1 shadow-apple-md">
          <button
            onClick={handleZoomIn}
            title="Zoom In"
            className="p-2 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-black/5 transition-colors"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={handleZoomOut}
            title="Zoom Out"
            className="p-2 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-black/5 transition-colors"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={handleResetBearing}
            title="Reset North & Tilt"
            className="p-2 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-black/5 transition-colors"
          >
            <Compass className="w-4 h-4" />
          </button>
          <button
            onClick={handleChandigarhOverview}
            title="Chandigarh Overview"
            className="p-2 rounded-xl text-blue-600 hover:bg-blue-50 transition-colors"
          >
            <Navigation className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Map Legend Overlay (Bottom Left) */}
      <div className="absolute bottom-4 left-4 z-20 glass-panel p-3 rounded-2xl text-[11px] font-sans max-w-xs space-y-2 pointer-events-auto">
        <div className="font-semibold text-slate-900 flex items-center justify-between">
          <span>Chandigarh Spatial Telemetry</span>
          <span className="text-[10px] text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded-full">
            REAL GIS (64 SECTORS)
          </span>
        </div>
        <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-slate-600">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-emerald-200" />
            <span>#1 Top Candidate</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
            <span>Candidates (#2-#6)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
            <span>Existing Hospitals</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-blue-600/30 border border-blue-600" />
            <span>3D Density Columns</span>
          </div>
        </div>
      </div>

      {/* Interactive Tooltip Card */}
      {hoverInfo && (
        <div
          className="deck-tooltip"
          style={{
            position: 'fixed',
            left: Math.min(window.innerWidth - 260, hoverInfo.x + 15),
            top: Math.max(70, hoverInfo.y - 25),
          }}
        >
          {hoverInfo.type === 'candidate' && (
            <div className="space-y-1 max-w-xs">
              <div className="flex items-center justify-between gap-3">
                <span className="font-bold text-slate-900">{hoverInfo.object.name}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  RANK #{hoverInfo.object.rank}
                </span>
              </div>
              <div className="text-[11px] text-slate-600">
                Suitability Score:{' '}
                <strong className="text-emerald-600">
                  {hoverInfo.object.suitability_score} / 100
                </strong>
              </div>
              <div className="text-[10px] text-slate-500">
                Vacant Land: {hoverInfo.object.vacant_land_acres} Acres | Nearest Hospital:{' '}
                {hoverInfo.object.distance_to_nearest_hospital_km} km
              </div>
            </div>
          )}

          {hoverInfo.type === 'hospital' && (
            <div className="space-y-1 max-w-xs">
              <div className="flex items-center gap-1.5 text-red-600 font-bold">
                <HeartPulse className="w-3.5 h-3.5" />
                <span>{hoverInfo.object.name}</span>
              </div>
              <div className="text-[11px] text-slate-700">
                {hoverInfo.object.type} • {hoverInfo.object.sector}
              </div>
              <div className="text-[10px] text-slate-500 flex items-center gap-2">
                <span>Beds: {hoverInfo.object.beds}</span>
                <span>•</span>
                <span>ICU: {hoverInfo.object.icu_beds}</span>
                <span>•</span>
                <span>OPD/Day: {hoverInfo.object.daily_opd}</span>
              </div>
            </div>
          )}

          {hoverInfo.type === 'sector' && (
            <div className="space-y-1 max-w-xs">
              <div className="flex items-center justify-between gap-3">
                <span className="font-bold text-slate-900">{hoverInfo.object.sector_name}</span>
                <span className="text-[10px] text-slate-500">{hoverInfo.object.zone}</span>
              </div>
              <div className="text-[11px] text-slate-600">
                Population: <strong>{hoverInfo.object.population?.toLocaleString()}</strong> (
                {hoverInfo.object.density_per_sqkm?.toLocaleString()}/km²)
              </div>
              <div className="text-[10px] text-slate-500">
                Nearest Hospital: {hoverInfo.object.nearest_hospital} (
                {hoverInfo.object.distance_to_nearest_hospital_km} km)
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
