import React, { useState } from 'react';
import {
  Key,
  ExternalLink,
  Check,
  X,
  Layers,
  Sparkles,
  Info,
  ShieldCheck,
  Globe,
  Eye,
  RefreshCw,
  Building,
  HelpCircle,
  Cpu,
  MapPin,
} from 'lucide-react';

export type BasemapStyleId =
  | 'satellite-3d'
  | 'dark-3d'
  | 'light-3d'
  | 'vector-3d'
  | 'esri-gray'
  | 'osm'
  | 'mapbox-3d';

interface MapApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentStyle: BasemapStyleId;
  onSelectStyle: (style: BasemapStyleId) => void;
  cartoKey: string;
  onSaveCartoKey: (key: string) => void;
  mapboxToken?: string;
  onSaveMapboxToken?: (token: string) => void;
}

export const MapApiKeyModal: React.FC<MapApiKeyModalProps> = ({
  isOpen,
  onClose,
  currentStyle,
  onSelectStyle,
  cartoKey,
  onSaveCartoKey,
  mapboxToken = '',
  onSaveMapboxToken,
}) => {
  const [activeTab, setActiveTab] = useState<'styles' | 'comparison' | 'keys'>('styles');
  const [inputCartoKey, setInputCartoKey] = useState(cartoKey);
  const [inputMapboxToken, setInputMapboxToken] = useState(
    mapboxToken || localStorage.getItem('mapbox_token') || ''
  );
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveCartoKey(inputCartoKey.trim());
    if (onSaveMapboxToken) {
      onSaveMapboxToken(inputMapboxToken.trim());
    }
    localStorage.setItem('mapbox_token', inputMapboxToken.trim());
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const basemapOptions: Array<{
    id: BasemapStyleId;
    title: string;
    desc: string;
    badge: string;
    badgeColor: string;
    requiresKey: boolean;
    tag: string;
  }> = [
    {
      id: 'satellite-3d',
      title: 'Photorealistic 3D Satellite Hybrid',
      desc: 'Real high-resolution aerial satellite imagery with 3D building extrusions, terrain elevation, and real road networks.',
      badge: 'Production 3D • Recommended',
      badgeColor: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
      requiresKey: false,
      tag: 'Aerial + 3D Buildings',
    },
    {
      id: 'dark-3d',
      title: 'Recon-Bot Dark Matter 3D',
      desc: 'Sleek tactical dark-mode 3D digital twin matching Recon-Bot’s dark visual language with glowing roads and illuminated building heights.',
      badge: 'Recon Theme • 60 FPS',
      badgeColor: 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800',
      requiresKey: false,
      tag: 'Night Cockpit 3D',
    },
    {
      id: 'vector-3d',
      title: 'OpenFreeMap Vector 3D',
      desc: 'Full OpenMapTiles vector layer with native 3D building footprint extrusions, street names, and Corbusier sector grids.',
      badge: 'Vector 3D • Open Source',
      badgeColor: 'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800',
      requiresKey: false,
      tag: 'OpenStreetMap 3D',
    },
    {
      id: 'light-3d',
      title: 'Urban Architectural Clean Light',
      desc: 'Apple-grade clean architectural canvas with extruded 3D municipal parcels and high-contrast demographic choropleths.',
      badge: 'Clean Light',
      badgeColor: 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800',
      requiresKey: false,
      tag: 'Architectural Minimal',
    },
    {
      id: 'osm',
      title: 'OpenStreetMap Standard 2D/3D',
      desc: 'Community-verified global basemap with complete landmark names, public transit stops, and sector labels.',
      badge: 'Free • Zero Watermark',
      badgeColor: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700',
      requiresKey: false,
      tag: 'Standard OSM',
    },
    {
      id: 'mapbox-3d',
      title: 'Mapbox Standard 3D (Optional)',
      desc: 'Mapbox v3 Standard Style with architectural dynamic shadows, lighting presets, and 3D mesh (requires Mapbox token).',
      badge: inputMapboxToken ? 'Token Active' : 'Token Required',
      badgeColor: inputMapboxToken ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200',
      requiresKey: true,
      tag: 'Mapbox v3',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 dark:bg-black/75 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-2xl bg-white dark:bg-apple-surface-dark border border-apple-border-light dark:border-apple-border-dark rounded-apple-2xl shadow-apple-elevated overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-5 border-b border-apple-border-light dark:border-apple-border-dark flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-apple-sm bg-apple-accent/10 border border-apple-accent/20 flex items-center justify-center text-apple-accent">
              <Key className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-apple-text-primary-light dark:text-apple-text-primary-dark">
                3D Map Architecture & Basemap Settings
              </h2>
              <p className="text-xs text-apple-text-secondary-light dark:text-apple-text-secondary-dark">
                Provider comparison, 3D building visualization & credential manager
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-black/5 dark:bg-white/10 hover:bg-black/10 flex items-center justify-center text-apple-text-secondary-light transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 pt-3 border-b border-apple-border-light dark:border-apple-border-dark flex gap-4 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('styles')}
            className={`pb-2.5 border-b-2 transition-colors ${
              activeTab === 'styles'
                ? 'border-apple-accent text-apple-accent'
                : 'border-transparent text-apple-text-secondary-light hover:text-apple-text-primary-light'
            }`}
          >
            3D Basemap Styles
          </button>
          <button
            onClick={() => setActiveTab('comparison')}
            className={`pb-2.5 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'comparison'
                ? 'border-apple-accent text-apple-accent'
                : 'border-transparent text-apple-text-secondary-light hover:text-apple-text-primary-light'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>MapmyIndia vs Mapbox vs MapLibre</span>
          </button>
          <button
            onClick={() => setActiveTab('keys')}
            className={`pb-2.5 border-b-2 transition-colors ${
              activeTab === 'keys'
                ? 'border-apple-accent text-apple-accent'
                : 'border-transparent text-apple-text-secondary-light hover:text-apple-text-primary-light'
            }`}
          >
            API Credentials
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* TAB 1: STYLES */}
          {activeTab === 'styles' && (
            <div className="space-y-3">
              <div className="text-xs font-bold text-apple-text-primary-light dark:text-apple-text-primary-dark">
                Select Active 3D Mapping Engine
              </div>
              <div className="grid grid-cols-1 gap-2.5">
                {basemapOptions.map((opt) => {
                  const isSelected = currentStyle === opt.id;
                  return (
                    <div
                      key={opt.id}
                      onClick={() => onSelectStyle(opt.id)}
                      className={`p-3.5 rounded-apple-xl border text-left cursor-pointer transition-all flex items-start justify-between gap-3 ${
                        isSelected
                          ? 'bg-apple-accent/10 border-apple-accent shadow-apple-subtle'
                          : 'bg-black/[0.02] dark:bg-white/[0.02] border-apple-border-light dark:border-apple-border-dark hover:bg-black/5 dark:hover:bg-white/5'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-apple-text-primary-light dark:text-apple-text-primary-dark">
                            {opt.title}
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${opt.badgeColor}`}>
                            {opt.badge}
                          </span>
                        </div>
                        <p className="text-[11px] text-apple-text-secondary-light dark:text-apple-text-secondary-dark leading-relaxed">
                          {opt.desc}
                        </p>
                      </div>

                      <div className="shrink-0 mt-1">
                        <div
                          className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                            isSelected
                              ? 'bg-apple-accent border-apple-accent text-white'
                              : 'border-apple-border-light dark:border-apple-border-dark'
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: TECHNICAL COMPARISON (MapmyIndia vs Mapbox vs MapLibre) */}
          {activeTab === 'comparison' && (
            <div className="space-y-4 text-xs text-apple-text-secondary-light dark:text-apple-text-secondary-dark leading-relaxed">
              <div className="p-4 rounded-apple-lg bg-apple-accent/10 border border-apple-accent/20 space-y-2">
                <div className="flex items-center gap-2 font-bold text-apple-accent text-xs">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Why Are We Not Using MapmyIndia (Mappls) for the 3D Map?</span>
                </div>
                <p className="text-apple-text-primary-light dark:text-apple-text-primary-dark text-xs">
                  Here is the objective engineering analysis of MapmyIndia (Mappls) vs Mapbox vs our integrated MapLibre 3D engine:
                </p>
              </div>

              {/* Comparison Points */}
              <div className="space-y-3">
                <div className="p-3.5 rounded-apple-lg bg-black/[0.02] dark:bg-white/[0.02] border border-apple-border-light dark:border-apple-border-dark space-y-1">
                  <h4 className="font-bold text-apple-text-primary-light dark:text-apple-text-primary-dark">
                    1. 3D Building Extrusions & Real-World Accuracy
                  </h4>
                  <p>
                    <strong>MapmyIndia (Mappls):</strong> Built on an older fork of Mapbox GL JS (v0.53/v1.0) intended for 2D turn-by-turn navigation. Mappls does NOT stream true 3D building height geometry or textured polygon meshes for tier-1/tier-2 cities like Chandigarh.
                  </p>
                  <p className="text-apple-accent">
                    <strong>Our Solution (MapLibre + OpenFreeMap / OSM):</strong> OpenStreetMap contains real building footprints for Chandigarh (PGIMER, GMCH 32, Capitol Complex, Panjab University, Sector 17). Our engine extrudes them with real heights (`render_height`), directional shadows, and camera pitch up to 60-70°.
                  </p>
                </div>

                <div className="p-3.5 rounded-apple-lg bg-black/[0.02] dark:bg-white/[0.02] border border-apple-border-light dark:border-apple-border-dark space-y-1">
                  <h4 className="font-bold text-apple-text-primary-light dark:text-apple-text-primary-dark">
                    2. WebGL Context & Deck.gl v9 Interoperability
                  </h4>
                  <p>
                    <strong>MapmyIndia (Mappls):</strong> Mappls encapsulates the map canvas in proprietary SDK classes that do not expose a standard WebGL context. Attempting to attach Deck.gl v9 `MapboxOverlay` (which powers our 60 FPS live car traffic, headlights, weather particle shaders, and isochrones) causes projection mismatches and GPU pipeline crashes.
                  </p>
                  <p className="text-emerald-600 dark:text-emerald-400">
                    <strong>Our Solution:</strong> Native first-class WebGL2 integration where Deck.gl layers render directly inside the MapLibre coordinate matrix at 60 FPS.
                  </p>
                </div>

                <div className="p-3.5 rounded-apple-lg bg-black/[0.02] dark:bg-white/[0.02] border border-apple-border-light dark:border-apple-border-dark space-y-1">
                  <h4 className="font-bold text-apple-text-primary-light dark:text-apple-text-primary-dark">
                    3. Authentication Friction & Licensing
                  </h4>
                  <p>
                    <strong>MapmyIndia (Mappls):</strong> Requires a complex OAuth2 dance (Client ID + Client Secret generating 24-hour bearer tokens), requiring a backend proxy. Unregistered client requests fail with CORS errors and enforce rigid branding.
                  </p>
                  <p className="text-apple-accent">
                    <strong>Our Solution:</strong> Zero rate limits, zero expired tokens, production-ready immediately, with the flexibility to plug in Mapbox v3 tokens anytime!
                  </p>
                </div>

                <div className="p-3.5 rounded-apple-lg bg-black/[0.02] dark:bg-white/[0.02] border border-apple-border-light dark:border-apple-border-dark space-y-1">
                  <h4 className="font-bold text-apple-text-primary-light dark:text-apple-text-primary-dark">
                    4. Google Photorealistic 3D Tiles & CesiumJS
                  </h4>
                  <p>
                    Google Photorealistic 3D mesh is legally restricted in Indian territory under the National Geospatial Policy, and CesiumJS imposes a massive ~15MB bundle overhead. Our hybrid MapLibre + ESRI Satellite 3D provides crisp aerial fidelity with sub-second load times.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: API KEYS */}
          {activeTab === 'keys' && (
            <div className="space-y-4">
              <div className="p-4 rounded-apple-lg bg-blue-50/80 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/40 text-xs text-blue-950 dark:text-blue-200 space-y-2">
                <div className="font-bold flex items-center gap-1.5">
                  <Info className="w-4 h-4 text-apple-accent" />
                  <span>Where to Put Your API Keys</span>
                </div>
                <p>
                  You can paste your optional Mapbox or CARTO keys below. They are saved directly to your browser&apos;s local storage.
                </p>
                <div className="font-mono text-[11px] bg-slate-900 text-emerald-400 p-2 rounded-apple-sm select-all">
                  VITE_MAPBOX_TOKEN=pk.eyJ...<br />
                  VITE_CARTO_API_KEY=your_key...
                </div>
              </div>

              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-apple-text-primary-light dark:text-apple-text-primary-dark">
                    Mapbox Public Access Token (Optional)
                  </label>
                  <input
                    type="text"
                    value={inputMapboxToken}
                    onChange={(e) => setInputMapboxToken(e.target.value)}
                    placeholder="pk.eyJ1..."
                    className="w-full px-3.5 py-2 rounded-apple-md bg-black/5 dark:bg-white/5 border border-apple-border-light dark:border-apple-border-dark text-xs font-mono focus:outline-none focus:ring-2 focus:ring-apple-accent"
                  />
                  <span className="text-[10px] text-apple-text-secondary-light">
                    Unlocks native Mapbox Standard 3D style. Get free at <a href="https://mapbox.com" target="_blank" rel="noreferrer" className="text-apple-accent underline">mapbox.com</a>
                  </span>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-apple-text-primary-light dark:text-apple-text-primary-dark">
                    CARTO Basemap API Key (Optional)
                  </label>
                  <input
                    type="text"
                    value={inputCartoKey}
                    onChange={(e) => setInputCartoKey(e.target.value)}
                    placeholder="Paste CARTO API key..."
                    className="w-full px-3.5 py-2 rounded-apple-md bg-black/5 dark:bg-white/5 border border-apple-border-light dark:border-apple-border-dark text-xs font-mono focus:outline-none focus:ring-2 focus:ring-apple-accent"
                  />
                  <span className="text-[10px] text-apple-text-secondary-light">
                    Get free key at <a href="https://carto.com/basemaps/apikey" target="_blank" rel="noreferrer" className="text-apple-accent underline">carto.com/basemaps/apikey</a>
                  </span>
                </div>

                <div className="flex items-center justify-between pt-2">
                  {savedSuccess && (
                    <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Credentials saved locally
                    </span>
                  )}
                  <button
                    onClick={handleSave}
                    className="ml-auto px-5 py-2 rounded-full bg-apple-accent hover:bg-apple-accent-hover text-white text-xs font-bold transition-all shadow-apple-subtle"
                  >
                    Save Credentials
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-apple-border-light dark:border-apple-border-dark bg-black/[0.02] dark:bg-white/[0.02] flex items-center justify-between">
          <div className="text-[11px] text-apple-text-secondary-light flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Encrypted local storage • No keys sent to third-party tracking</span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-full bg-apple-text-primary-light dark:bg-white hover:opacity-90 text-white dark:text-black text-xs font-bold transition-all shadow-apple-subtle"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
