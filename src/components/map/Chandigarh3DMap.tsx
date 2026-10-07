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
  Key,
  Sun,
  Moon,
  Maximize2,
  Minimize2,
  Box,
} from 'lucide-react';
import {
  WeatherAndTrafficSimulation,
  type WeatherMode,
} from './WeatherAndTrafficSimulation';
import {
  MapApiKeyModal,
  type BasemapStyleId,
} from './MapApiKeyModal';

const getBasemapStyle = (styleId: BasemapStyleId, cartoKey: string, isDark: boolean): any => {
  // 1. Photorealistic 3D Hybrid Satellite (Aerial Satellite + 3D Building vector source)
  if (styleId === 'satellite-3d') {
    return {
      version: 8,
      sources: {
        'satellite-tiles': {
          type: 'raster',
          tiles: [
            'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
          ],
          tileSize: 256,
          attribution: '&copy; Esri, Maxar, Earthstar Geographics',
        },
        'openmaptiles-buildings': {
          type: 'vector',
          url: 'https://tiles.openfreemap.org/planet',
        },
      },
      layers: [
        {
          id: 'satellite-base',
          type: 'raster',
          source: 'satellite-tiles',
          minzoom: 0,
          maxzoom: 19,
        },
      ],
    };
  }

  // 2. Recon-Bot Dark Matter 3D
  if (styleId === 'dark-3d') {
    const tileUrl = cartoKey
      ? `https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png?api_key=${cartoKey}`
      : 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}';
    return {
      version: 8,
      sources: {
        'dark-tiles': {
          type: 'raster',
          tiles: [tileUrl],
          tileSize: 256,
          attribution: '&copy; CARTO &copy; Esri',
        },
        'openmaptiles-buildings': {
          type: 'vector',
          url: 'https://tiles.openfreemap.org/planet',
        },
      },
      layers: [
        {
          id: 'dark-base',
          type: 'raster',
          source: 'dark-tiles',
          minzoom: 0,
          maxzoom: 19,
        },
      ],
    };
  }

  // 3. OpenFreeMap Vector 3D
  if (styleId === 'vector-3d') {
    return 'https://tiles.openfreemap.org/styles/liberty';
  }

  // 4. Urban Clean Light 3D
  if (styleId === 'light-3d' || styleId === 'esri-gray') {
    return {
      version: 8,
      sources: {
        'esri-gray-tiles': {
          type: 'raster',
          tiles: [
            'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}',
          ],
          tileSize: 256,
          attribution: '&copy; Esri &mdash; DeLorme, NAVTEQ',
        },
        'openmaptiles-buildings': {
          type: 'vector',
          url: 'https://tiles.openfreemap.org/planet',
        },
      },
      layers: [
        {
          id: 'esri-gray-base',
          type: 'raster',
          source: 'esri-gray-tiles',
          minzoom: 0,
          maxzoom: 19,
        },
      ],
    };
  }

  // 5. Standard OSM
  if (styleId === 'osm') {
    return {
      version: 8,
      sources: {
        'osm-tiles': {
          type: 'raster',
          tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
          tileSize: 256,
          attribution: '&copy; OpenStreetMap contributors',
        },
      },
      layers: [
        {
          id: 'osm-base',
          type: 'raster',
          source: 'osm-tiles',
          minzoom: 0,
          maxzoom: 19,
        },
      ],
    };
  }

  // Default fallback: Satellite 3D
  return {
    version: 8,
    sources: {
      'satellite-tiles': {
        type: 'raster',
        tiles: [
          'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        ],
        tileSize: 256,
        attribution: '&copy; Esri, Maxar',
      },
      'openmaptiles-buildings': {
        type: 'vector',
        url: 'https://tiles.openfreemap.org/planet',
      },
    },
    layers: [
      {
        id: 'satellite-base',
        type: 'raster',
        source: 'satellite-tiles',
        minzoom: 0,
        maxzoom: 19,
      },
    ],
  };
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

  // Basemap & 3D Building State
  const [basemapStyle, setBasemapStyle] = useState<BasemapStyleId>('satellite-3d');
  const [enable3DBuildings, setEnable3DBuildings] = useState<boolean>(true);
  const [cartoKey, setCartoKey] = useState<string>(() => {
    return localStorage.getItem('carto_api_key') || import.meta.env.VITE_CARTO_API_KEY || '';
  });
  const [mapboxToken, setMapboxToken] = useState<string>(() => {
    return localStorage.getItem('mapbox_token') || import.meta.env.VITE_MAPBOX_TOKEN || '';
  });
  const [showApiKeyModal, setShowApiKeyModal] = useState<boolean>(false);

  // Detect dark mode class on document
  const [isDark, setIsDark] = useState<boolean>(() => {
    return typeof document !== 'undefined' && document.documentElement.classList.contains('dark');
  });

  // Weather & Live Simulation State
  const [weather, setWeather] = useState<WeatherMode>('clear');
  const [showTraffic, setShowTraffic] = useState<boolean>(true);
  const [showPopulation, setShowPopulation] = useState<boolean>(true);

  // Listen to theme changes from ThemeToggle
  useEffect(() => {
    const handleTheme = (e: any) => {
      const mode = e.detail === 'dark';
      setIsDark(mode);
      if (mode && basemapStyle === 'light-3d') {
        setBasemapStyle('dark-3d');
      } else if (!mode && basemapStyle === 'dark-3d') {
        setBasemapStyle('satellite-3d');
      }
    };
    window.addEventListener('theme-change', handleTheme);
    return () => window.removeEventListener('theme-change', handleTheme);
  }, [basemapStyle]);

  // Fallback 2D Mercator bounds
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

  // Save Carto API Key
  const handleSaveCartoKey = (key: string) => {
    setCartoKey(key);
    localStorage.setItem('carto_api_key', key);
  };

  const handleSaveMapboxToken = (token: string) => {
    setMapboxToken(token);
    localStorage.setItem('mapbox_token', token);
  };

  // Change Basemap Style
  const handleSelectStyle = (styleId: BasemapStyleId) => {
    setBasemapStyle(styleId);
    if (mapRef.current) {
      mapRef.current.setStyle(getBasemapStyle(styleId, cartoKey, isDark));
    }
  };

  // Check WebGL availability
  useEffect(() => {
    const webglSupported = checkWebGL2Support();
    if (!webglSupported) {
      console.warn('WebGL2 not supported in current environment; switching to SVG fallback renderer.');
      setHasWebGL(false);
    }
  }, []);

  // Helper to attach 3D building extrusions
  const attach3DBuildingLayer = useCallback((map: maplibregl.Map) => {
    if (!enable3DBuildings) return;
    try {
      if (map.getLayer('3d-buildings-extrusion')) return;

      const layers = map.getStyle().layers;
      let labelLayerId;
      if (layers) {
        for (let i = 0; i < layers.length; i++) {
          if (layers[i].type === 'symbol' && (layers[i].layout as any)?.['text-field']) {
            labelLayerId = layers[i].id;
            break;
          }
        }
      }

      map.addLayer(
        {
          id: '3d-buildings-extrusion',
          source: 'openmaptiles-buildings',
          'source-layer': 'building',
          type: 'fill-extrusion',
          minzoom: 13,
          paint: {
            'fill-extrusion-color': isDark
              ? [
                  'interpolate',
                  ['linear'],
                  ['get', 'render_height'],
                  0, '#111827',
                  15, '#1e293b',
                  30, '#1e3a8a',
                  60, '#2563eb',
                  100, '#38bdf8',
                ]
              : [
                  'interpolate',
                  ['linear'],
                  ['get', 'render_height'],
                  0, '#e2e8f0',
                  15, '#cbd5e1',
                  30, '#94a3b8',
                  60, '#64748b',
                  100, '#0071e3',
                ],
            'fill-extrusion-height': [
              'interpolate',
              ['linear'],
              ['zoom'],
              13, 0,
              14.2, ['coalesce', ['get', 'render_height'], 14],
            ],
            'fill-extrusion-base': [
              'interpolate',
              ['linear'],
              ['zoom'],
              13, 0,
              14.2, ['coalesce', ['get', 'render_min_height'], 0],
            ],
            'fill-extrusion-opacity': 0.85,
          },
        },
        labelLayerId
      );
    } catch (e) {
      // Source might not have loaded yet or not available in current style
    }
  }, [enable3DBuildings, isDark]);

  // Sync camera when mapViewState updates externally
  useEffect(() => {
    if (!mapRef.current) return;
    const center = mapRef.current.getCenter();
    const dist = Math.hypot(center.lng - mapViewState.longitude, center.lat - mapViewState.latitude);
    const zoomDiff = Math.abs(mapRef.current.getZoom() - mapViewState.zoom);
    if (dist > 0.0005 || zoomDiff > 0.3) {
      mapRef.current.flyTo({
        center: [mapViewState.longitude, mapViewState.latitude],
        zoom: mapViewState.zoom,
        pitch: mapViewState.pitch,
        bearing: mapViewState.bearing,
        duration: 1200,
      });
    }
  }, [mapViewState.longitude, mapViewState.latitude, mapViewState.zoom, mapViewState.pitch, mapViewState.bearing]);

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
        color: [48, 209, 88, 45],
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
            return isSelected ? [0, 113, 227, 255] : [148, 163, 184, 150];
          },
          getLineWidth: (f: any) => {
            const isSelected = selectedSector && selectedSector.sector_name === f.properties.sector_name;
            return isSelected ? 4 : 1.5;
          },
          getFillColor: (f: any) => {
            const density = f.properties.density_per_sqkm || 20000;
            const isSelected = selectedSector && selectedSector.sector_name === f.properties.sector_name;
            if (isSelected) return [0, 113, 227, 100];
            if (density > 45000) return [255, 69, 58, 95];
            if (density > 35000) return [255, 159, 10, 80];
            if (density > 25000) return [0, 113, 227, 70];
            if (density > 15000) return [147, 197, 253, 50];
            return [226, 232, 240, 35];
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
                    zoom: 14.8,
                    pitch: 55,
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
            if (dens > 40000) return [255, 69, 58, 200];
            if (dens > 30000) return [255, 159, 10, 180];
            if (dens > 20000) return [0, 113, 227, 170];
            return [48, 209, 88, 150];
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
          radiusMinPixels: 8,
          radiusMaxPixels: 20,
          getPosition: (d: HospitalData) => d.coordinates,
          getRadius: 160,
          getFillColor: [255, 69, 58, 240],
          getLineColor: [255, 255, 255, 255],
          getLineWidth: 2.5,
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
                  zoom: 15.2,
                  pitch: 60,
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
          radiusMinPixels: 10,
          radiusMaxPixels: 24,
          getPosition: (d: CandidateSite) => d.coordinates,
          getRadius: 180,
          getFillColor: (d: CandidateSite) => {
            return d.rank === 1 ? [48, 209, 88, 255] : [0, 113, 227, 255];
          },
          getLineColor: [255, 255, 255, 255],
          getLineWidth: 3,
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

  // Mount MapLibre
  useEffect(() => {
    if (!hasWebGL || !mapContainerRef.current || mapRef.current) return;

    try {
      const map = new maplibregl.Map({
        container: mapContainerRef.current,
        style: getBasemapStyle(basemapStyle, cartoKey, isDark),
        center: [mapViewState.longitude, mapViewState.latitude],
        zoom: mapViewState.zoom,
        pitch: mapViewState.pitch,
        bearing: mapViewState.bearing,
        maxPitch: 75,
      });

      const overlay = new MapboxOverlay({
        layers: deckLayers,
      });

      map.on('load', () => {
        try {
          map.addControl(overlay as any);
          attach3DBuildingLayer(map);
        } catch (e) {
          console.warn('MapboxOverlay attachment deferred:', e);
        }
      });

      map.on('styledata', () => {
        attach3DBuildingLayer(map);
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
      console.warn('MapLibre GL failed to initialize; falling back to SVG spatial vector engine:', err);
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
      mapRef.current.easeTo({ bearing: 0, pitch: 55, duration: 600 });
    }
  };

  const handleToggle3DBuildings = () => {
    const next = !enable3DBuildings;
    setEnable3DBuildings(next);
    if (mapRef.current) {
      if (next) {
        attach3DBuildingLayer(mapRef.current);
      } else if (mapRef.current.getLayer('3d-buildings-extrusion')) {
        mapRef.current.removeLayer('3d-buildings-extrusion');
      }
    }
  };

  const handleChandigarhOverview = () => {
    if (mapRef.current) {
      mapRef.current.flyTo({
        center: [76.7794, 30.7333],
        zoom: 12.4,
        pitch: 55,
        bearing: -18,
        duration: 1200,
      });
    }
  };

  return (
    <div className="w-full h-full relative overflow-hidden bg-slate-950">
      {hasWebGL ? (
        <div ref={mapContainerRef} className="w-full h-full" />
      ) : (
        /* Fallback High-Fidelity 2D/3D SVG Spatial Vector Engine */
        <div className="w-full h-full relative overflow-hidden bg-slate-900 flex items-center justify-center select-none">
          <svg
            viewBox="0 0 1000 700"
            className="w-full h-full cursor-crosshair"
            style={{ filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.2))' }}
          >
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="1000" height="700" fill="url(#grid)" />

            {/* Isochrones */}
            {layers.isochrones &&
              candidateSites.slice(0, 3).map((site) => {
                const cx = projX(site.coordinates[0], 1000);
                const cy = projY(site.coordinates[1], 700);
                return (
                  <g key={`iso-${site.id}`}>
                    <circle cx={cx} cy={cy} r="160" fill="rgba(175, 82, 222, 0.08)" stroke="rgba(175, 82, 222, 0.3)" strokeDasharray="4 4" />
                    <circle cx={cx} cy={cy} r="100" fill="rgba(0, 113, 227, 0.12)" stroke="rgba(0, 113, 227, 0.4)" />
                    <circle cx={cx} cy={cy} r="50" fill="rgba(48, 209, 88, 0.18)" stroke="rgba(48, 209, 88, 0.5)" />
                  </g>
                );
              })}

            {/* Sector Polygons */}
            {layers.sectors &&
              sectorsGeoJson.features.map((feat: any, idx: number) => {
                const coords = feat.geometry.coordinates[0];
                const pts = coords
                  .map((pt: [number, number]) => `${projX(pt[0], 1000)},${projY(pt[1], 700)}`)
                  .join(' ');
                const density = feat.properties.density_per_sqkm;
                const isSelected = selectedSector && selectedSector.sector_name === feat.properties.sector_name;

                let fillColor = 'rgba(255, 255, 255, 0.08)';
                if (density > 40000) fillColor = 'rgba(255, 69, 58, 0.45)';
                else if (density > 30000) fillColor = 'rgba(255, 159, 10, 0.4)';
                else if (density > 20000) fillColor = 'rgba(0, 113, 227, 0.35)';

                if (isSelected) fillColor = 'rgba(0, 113, 227, 0.7)';

                return (
                  <g key={`sec-${idx}`}>
                    <polygon
                      points={pts}
                      fill={fillColor}
                      stroke={isSelected ? '#0071e3' : 'rgba(255, 255, 255, 0.18)'}
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
                    <text
                      x={projX(feat.properties.center[0], 1000)}
                      y={projY(feat.properties.center[1], 700) + 3}
                      fontSize="8"
                      fontWeight="bold"
                      fill="#94a3b8"
                      textAnchor="middle"
                      pointerEvents="none"
                    >
                      {feat.properties.sector_name.replace('Sector ', 'S-')}
                    </text>
                  </g>
                );
              })}

            {/* 3D Density Columns */}
            {layers.extrudedDensity &&
              sectors.map((sec) => {
                const cx = projX(sec.center[0], 1000);
                const cy = projY(sec.center[1], 700);
                const barHeight = Math.min(65, Math.max(12, (sec.density_per_sqkm / 50000) * 65));
                const colColor = sec.density_per_sqkm > 35000 ? '#ff453a' : sec.density_per_sqkm > 22000 ? '#0071e3' : '#30d158';

                return (
                  <g key={`col-${sec.sector_name}`} pointerEvents="none">
                    <ellipse cx={cx} cy={cy} rx="5" ry="2.5" fill="rgba(0,0,0,0.4)" />
                    <rect
                      x={cx - 3.5}
                      y={cy - barHeight}
                      width="7"
                      height={barHeight}
                      fill={colColor}
                      rx="2"
                      opacity="0.85"
                    />
                    <circle cx={cx} cy={cy - barHeight} r="3.5" fill="#ffffff" opacity="0.9" />
                  </g>
                );
              })}

            {/* Hospitals */}
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
                    <circle cx={cx} cy={cy} r="12" fill="rgba(255, 69, 58, 0.3)" className="animate-ping" />
                    <circle cx={cx} cy={cy} r="7" fill="#ff453a" stroke="#ffffff" strokeWidth="2" />
                    <text x={cx} y={cy + 3} fontSize="9" fontWeight="bold" fill="#ffffff" textAnchor="middle" pointerEvents="none">
                      +
                    </text>
                  </g>
                );
              })}

            {/* Candidates */}
            {layers.candidateSites &&
              candidateSites.map((c) => {
                const cx = projX(c.coordinates[0], 1000);
                const cy = projY(c.coordinates[1], 700);
                const isSelected = selectedCandidate && selectedCandidate.id === c.id;
                const pinColor = c.rank === 1 ? '#30d158' : '#0071e3';

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
                    <circle cx={cx} cy={cy} r={isSelected ? '22' : '15'} fill={c.rank === 1 ? 'rgba(48,209,88,0.3)' : 'rgba(0,113,227,0.3)'} />
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

      {/* Weather, Traffic & Population Simulation Overlay */}
      <WeatherAndTrafficSimulation
        map={mapRef.current}
        weather={weather}
        onWeatherChange={setWeather}
        showTraffic={showTraffic}
        onToggleTraffic={() => setShowTraffic(!showTraffic)}
        showPopulation={showPopulation}
        onTogglePopulation={() => setShowPopulation(!showPopulation)}
        fallbackProj={{ projX, projY }}
      />

      {/* Floating HUD Controls (Recon-Bot Glass Style) */}
      <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
        <div className="glass-panel p-1.5 rounded-apple-md flex flex-col gap-1 shadow-apple-elevated">
          {/* Basemap & 3D Settings Button */}
          <button
            onClick={() => setShowApiKeyModal(true)}
            title="3D Mapping Styles & Provider Engine"
            className="p-2 rounded-apple-sm text-apple-accent hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
          >
            <Key className="w-4 h-4" />
          </button>

          {/* Toggle 3D Buildings Button */}
          <button
            onClick={handleToggle3DBuildings}
            title={enable3DBuildings ? 'Disable 3D Buildings' : 'Enable 3D Buildings'}
            className={`p-2 rounded-apple-sm transition-colors ${
              enable3DBuildings
                ? 'text-apple-accent bg-apple-accent/10'
                : 'text-apple-text-secondary-light hover:bg-black/5 dark:hover:bg-white/10'
            }`}
          >
            <Box className="w-4 h-4" />
          </button>

          <button
            onClick={handleZoomIn}
            title="Zoom In"
            className="p-2 rounded-apple-sm text-apple-text-secondary-light dark:text-apple-text-secondary-dark hover:text-apple-text-primary-light hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={handleZoomOut}
            title="Zoom Out"
            className="p-2 rounded-apple-sm text-apple-text-secondary-light dark:text-apple-text-secondary-dark hover:text-apple-text-primary-light hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={handleResetBearing}
            title="Reset North & 3D Tilt"
            className="p-2 rounded-apple-sm text-apple-text-secondary-light dark:text-apple-text-secondary-dark hover:text-apple-text-primary-light hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
          >
            <Compass className="w-4 h-4" />
          </button>
          <button
            onClick={handleChandigarhOverview}
            title="Chandigarh Overview"
            className="p-2 rounded-apple-sm text-apple-accent hover:bg-apple-accent/10 transition-colors"
          >
            <Navigation className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Map Legend Overlay (Bottom Left) */}
      <div className="absolute bottom-4 left-4 z-20 glass-panel p-3 rounded-apple-md text-[11px] font-sans max-w-xs space-y-2 pointer-events-auto shadow-apple-card">
        <div className="font-semibold text-apple-text-primary-light dark:text-apple-text-primary-dark flex items-center justify-between">
          <span>Spatial 3D Telemetry</span>
          <span className="text-[10px] text-apple-accent font-bold bg-apple-accent/10 px-2 py-0.5 rounded-full">
            REAL GIS (64 SECTORS)
          </span>
        </div>
        <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-apple-text-secondary-light dark:text-apple-text-secondary-dark">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-emerald-400/30" />
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
            <span className="w-2.5 h-2.5 rounded bg-blue-500/30 border border-blue-500" />
            <span>3D Density Columns</span>
          </div>
        </div>
      </div>

      {/* Tooltip Overlay */}
      {hoverInfo && (
        <div
          className="deck-tooltip"
          style={{
            position: 'fixed',
            left: Math.min(window.innerWidth - 270, hoverInfo.x + 15),
            top: Math.max(70, hoverInfo.y - 25),
          }}
        >
          {hoverInfo.type === 'candidate' && (
            <div className="space-y-1 max-w-xs">
              <div className="flex items-center justify-between gap-3">
                <span className="font-bold text-apple-text-primary-light dark:text-apple-text-primary-dark">
                  {hoverInfo.object.name}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  RANK #{hoverInfo.object.rank}
                </span>
              </div>
              <div className="text-[11px] text-apple-text-secondary-light dark:text-apple-text-secondary-dark">
                Suitability Score:{' '}
                <strong className="text-emerald-600 dark:text-emerald-400">
                  {hoverInfo.object.suitability_score} / 100
                </strong>
              </div>
              <div className="text-[10px] text-apple-text-tertiary">
                Vacant Land: {hoverInfo.object.vacant_land_acres} Acres | Nearest Hospital:{' '}
                {hoverInfo.object.distance_to_nearest_hospital_km} km
              </div>
            </div>
          )}

          {hoverInfo.type === 'hospital' && (
            <div className="space-y-1 max-w-xs">
              <div className="flex items-center gap-1.5 text-red-500 font-bold">
                <HeartPulse className="w-3.5 h-3.5" />
                <span>{hoverInfo.object.name}</span>
              </div>
              <div className="text-[11px] text-apple-text-secondary-light dark:text-apple-text-secondary-dark">
                {hoverInfo.object.type} • {hoverInfo.object.sector}
              </div>
              <div className="text-[10px] text-apple-text-tertiary flex items-center gap-2">
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
                <span className="font-bold text-apple-text-primary-light dark:text-apple-text-primary-dark">
                  {hoverInfo.object.sector_name}
                </span>
                <span className="text-[10px] text-apple-text-tertiary">{hoverInfo.object.zone}</span>
              </div>
              <div className="text-[11px] text-apple-text-secondary-light dark:text-apple-text-secondary-dark">
                Population: <strong>{hoverInfo.object.population?.toLocaleString()}</strong> (
                {hoverInfo.object.density_per_sqkm?.toLocaleString()}/km²)
              </div>
              <div className="text-[10px] text-apple-text-tertiary">
                Nearest Hospital: {hoverInfo.object.nearest_hospital} (
                {hoverInfo.object.distance_to_nearest_hospital_km} km)
              </div>
            </div>
          )}
        </div>
      )}

      {/* Map Style & API Key Modal */}
      <MapApiKeyModal
        isOpen={showApiKeyModal}
        onClose={() => setShowApiKeyModal(false)}
        currentStyle={basemapStyle}
        onSelectStyle={handleSelectStyle}
        cartoKey={cartoKey}
        onSaveCartoKey={handleSaveCartoKey}
        mapboxToken={mapboxToken}
        onSaveMapboxToken={handleSaveMapboxToken}
      />
    </div>
  );
};
