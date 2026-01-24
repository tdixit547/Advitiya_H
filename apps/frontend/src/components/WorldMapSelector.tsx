// ============================================
// SMART LINK HUB - World Map Country Selector
// Leaflet-based interactive country selection with GeoJSON boundaries
// ============================================

'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import dynamic from 'next/dynamic';
import type { Map as LeafletMap, Layer, GeoJSON as LeafletGeoJSON } from 'leaflet';

// Country data with ISO codes and names
const COUNTRY_DATA: Record<string, { name: string; lat: number; lng: number }> = {
  'US': { name: 'United States', lat: 37.0902, lng: -95.7129 },
  'CA': { name: 'Canada', lat: 56.1304, lng: -106.3468 },
  'GB': { name: 'United Kingdom', lat: 55.3781, lng: -3.4360 },
  'DE': { name: 'Germany', lat: 51.1657, lng: 10.4515 },
  'FR': { name: 'France', lat: 46.2276, lng: 2.2137 },
  'IT': { name: 'Italy', lat: 41.8719, lng: 12.5674 },
  'ES': { name: 'Spain', lat: 40.4637, lng: -3.7492 },
  'PT': { name: 'Portugal', lat: 39.3999, lng: -8.2245 },
  'NL': { name: 'Netherlands', lat: 52.1326, lng: 5.2913 },
  'BE': { name: 'Belgium', lat: 50.5039, lng: 4.4699 },
  'CH': { name: 'Switzerland', lat: 46.8182, lng: 8.2275 },
  'AT': { name: 'Austria', lat: 47.5162, lng: 14.5501 },
  'SE': { name: 'Sweden', lat: 60.1282, lng: 18.6435 },
  'NO': { name: 'Norway', lat: 60.4720, lng: 8.4689 },
  'DK': { name: 'Denmark', lat: 56.2639, lng: 9.5018 },
  'FI': { name: 'Finland', lat: 61.9241, lng: 25.7482 },
  'PL': { name: 'Poland', lat: 51.9194, lng: 19.1451 },
  'CZ': { name: 'Czechia', lat: 49.8175, lng: 15.4730 },
  'RO': { name: 'Romania', lat: 45.9432, lng: 24.9668 },
  'HU': { name: 'Hungary', lat: 47.1625, lng: 19.5033 },
  'GR': { name: 'Greece', lat: 39.0742, lng: 21.8243 },
  'RU': { name: 'Russia', lat: 61.5240, lng: 105.3188 },
  'UA': { name: 'Ukraine', lat: 48.3794, lng: 31.1656 },
  'TR': { name: 'Turkey', lat: 38.9637, lng: 35.2433 },
  'IN': { name: 'India', lat: 20.5937, lng: 78.9629 },
  'CN': { name: 'China', lat: 35.8617, lng: 104.1954 },
  'JP': { name: 'Japan', lat: 36.2048, lng: 138.2529 },
  'KR': { name: 'South Korea', lat: 35.9078, lng: 127.7669 },
  'AU': { name: 'Australia', lat: -25.2744, lng: 133.7751 },
  'NZ': { name: 'New Zealand', lat: -40.9006, lng: 174.8860 },
  'BR': { name: 'Brazil', lat: -14.2350, lng: -51.9253 },
  'AR': { name: 'Argentina', lat: -38.4161, lng: -63.6167 },
  'MX': { name: 'Mexico', lat: 23.6345, lng: -102.5528 },
  'CO': { name: 'Colombia', lat: 4.5709, lng: -74.2973 },
  'CL': { name: 'Chile', lat: -35.6751, lng: -71.5430 },
  'PE': { name: 'Peru', lat: -9.1900, lng: -75.0152 },
  'ZA': { name: 'South Africa', lat: -30.5595, lng: 22.9375 },
  'EG': { name: 'Egypt', lat: 26.8206, lng: 30.8025 },
  'NG': { name: 'Nigeria', lat: 9.0820, lng: 8.6753 },
  'KE': { name: 'Kenya', lat: -0.0236, lng: 37.9062 },
  'MA': { name: 'Morocco', lat: 31.7917, lng: -7.0926 },
  'SA': { name: 'Saudi Arabia', lat: 23.8859, lng: 45.0792 },
  'AE': { name: 'UAE', lat: 23.4241, lng: 53.8478 },
  'IL': { name: 'Israel', lat: 31.0461, lng: 34.8516 },
  'SG': { name: 'Singapore', lat: 1.3521, lng: 103.8198 },
  'MY': { name: 'Malaysia', lat: 4.2105, lng: 101.9758 },
  'TH': { name: 'Thailand', lat: 15.8700, lng: 100.9925 },
  'VN': { name: 'Vietnam', lat: 14.0583, lng: 108.2772 },
  'ID': { name: 'Indonesia', lat: -0.7893, lng: 113.9213 },
  'PH': { name: 'Philippines', lat: 12.8797, lng: 121.7740 },
  'PK': { name: 'Pakistan', lat: 30.3753, lng: 69.3451 },
  'BD': { name: 'Bangladesh', lat: 23.6850, lng: 90.3563 },
  'IE': { name: 'Ireland', lat: 53.4129, lng: -8.2439 },
  'NP': { name: 'Nepal', lat: 28.3949, lng: 84.1240 },
  'LK': { name: 'Sri Lanka', lat: 7.8731, lng: 80.7718 },
};

// Get country name by code
export function getCountryName(code: string): string {
  return COUNTRY_DATA[code]?.name || code;
}

interface WorldMapSelectorProps {
  selectedCountries: string[];
  onCountriesChange: (countries: string[]) => void;
  isOpen: boolean;
  onClose: () => void;
}

// GeoJSON URL for world countries
const GEOJSON_URL = 'https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson';

export default function WorldMapSelector({
  selectedCountries,
  onCountriesChange,
  isOpen,
  onClose,
}: WorldMapSelectorProps) {
  const [localSelected, setLocalSelected] = useState<string[]>(selectedCountries);
  const [searchQuery, setSearchQuery] = useState('');
  const [mapReady, setMapReady] = useState(false);
  const [geoJsonData, setGeoJsonData] = useState<GeoJSON.FeatureCollection | null>(null);
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const geoJsonRef = useRef<LeafletGeoJSON | null>(null);

  useEffect(() => {
    setLocalSelected(selectedCountries);
  }, [selectedCountries]);

  // Load GeoJSON data
  useEffect(() => {
    if (isOpen && !geoJsonData) {
      fetch(GEOJSON_URL)
        .then(res => res.json())
        .then(data => {
          setGeoJsonData(data);
        })
        .catch(err => {
          console.error('Failed to load GeoJSON:', err);
        });
    }
  }, [isOpen, geoJsonData]);

  useEffect(() => {
    // Load Leaflet CSS
    if (isOpen && typeof window !== 'undefined') {
      const linkId = 'leaflet-css';
      if (!document.getElementById(linkId)) {
        const link = document.createElement('link');
        link.id = linkId;
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);
      }
      const timer = setTimeout(() => setMapReady(true), 200);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const toggleCountry = useCallback((code: string) => {
    setLocalSelected(prev => 
      prev.includes(code) 
        ? prev.filter(c => c !== code)
        : [...prev, code]
    );
  }, []);

  const handleConfirm = () => {
    onCountriesChange(localSelected);
    onClose();
  };

  const handleClear = () => {
    setLocalSelected([]);
  };

  // Get style for each country feature - NO HOVER here, hover is handled per-layer
  const getCountryStyle = useCallback((feature: GeoJSON.Feature | undefined) => {
    if (!feature?.properties) return {};
    
    const countryCode = feature.properties['ISO3166-1-Alpha-2'];
    const isSelected = localSelected.includes(countryCode);
    
    return {
      fillColor: isSelected ? '#00C853' : '#2d2d2d',
      weight: isSelected ? 2 : 1,
      opacity: 1,
      color: isSelected ? '#00E676' : '#444',
      fillOpacity: isSelected ? 0.7 : 0.3,
    };
  }, [localSelected]); // Remove hoveredCountry dependency

  const countryList = Object.entries(COUNTRY_DATA)
    .map(([code, data]) => ({ code, ...data }))
    .filter(country =>
      country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      country.code.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => a.name.localeCompare(b.name));

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div 
        className="w-full max-w-5xl max-h-[90vh] overflow-hidden rounded-2xl flex flex-col"
        style={{ 
          backgroundColor: 'var(--card-bg)',
          border: '1px solid var(--border)'
        }}
      >
        {/* Header */}
        <div className="p-4 border-b" style={{ borderColor: 'var(--border)' }}>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-bold" style={{ color: 'var(--foreground)' }}>
              🌍 Select Countries
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:opacity-70 transition-opacity text-xl"
              style={{ color: 'var(--foreground-secondary)' }}
            >
              ✕
            </button>
          </div>
          
          {/* Search and Stats */}
          <div className="flex gap-4 items-center">
            <input
              type="text"
              placeholder="Search countries..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field flex-1"
            />
            <span className="text-sm whitespace-nowrap" style={{ color: 'var(--foreground-secondary)' }}>
              {localSelected.length} selected
            </span>
          </div>
          
          {/* Hover instruction */}
          {hoveredCountry && (
            <div className="mt-2 px-3 py-1.5 rounded-lg inline-flex items-center gap-2" style={{ backgroundColor: 'rgba(0, 200, 83, 0.15)' }}>
              <span style={{ color: 'var(--accent)' }} className="font-medium">
                {getCountryName(hoveredCountry)} ({hoveredCountry})
              </span>
              <span style={{ color: 'var(--foreground-muted)' }} className="text-sm">
                — Click to {localSelected.includes(hoveredCountry) ? 'deselect' : 'select'}
              </span>
            </div>
          )}
        </div>

        {/* Map and List Container */}
        <div className="flex-1 flex min-h-0">
          {/* Map */}
          <div className="flex-1 relative" style={{ minHeight: '450px' }}>
            {mapReady && geoJsonData && (
              <MapWithGeoJSON
                geoJsonData={geoJsonData}
                selectedCountries={localSelected}
                onCountryClick={toggleCountry}
                onCountryHover={setHoveredCountry}
                getCountryStyle={getCountryStyle}
                mapRef={mapRef}
                geoJsonRef={geoJsonRef}
              />
            )}
            {(!mapReady || !geoJsonData) && (
              <div className="absolute inset-0 flex items-center justify-center" style={{ backgroundColor: 'var(--background-secondary)' }}>
                <div className="flex flex-col items-center gap-3" style={{ color: 'var(--foreground-secondary)' }}>
                  <span className="w-8 h-8 border-3 border-current border-t-transparent rounded-full animate-spin"></span>
                  <span>Loading world map...</span>
                </div>
              </div>
            )}
          </div>

          {/* Country List */}
          <div 
            className="w-64 overflow-y-auto border-l"
            style={{ borderColor: 'var(--border)' }}
          >
            <div className="p-2">
              <div className="text-xs font-medium uppercase tracking-wide mb-2 px-2" style={{ color: 'var(--foreground-muted)' }}>
                {searchQuery ? 'Search Results' : 'All Countries'} ({countryList.length})
              </div>
              {countryList.map((country) => (
                <button
                  key={country.code}
                  onClick={() => toggleCountry(country.code)}
                  onMouseEnter={() => setHoveredCountry(country.code)}
                  onMouseLeave={() => setHoveredCountry(null)}
                  className="w-full text-left px-3 py-2 rounded-lg flex items-center gap-2 transition-all"
                  style={{
                    backgroundColor: localSelected.includes(country.code) 
                      ? 'rgba(0, 200, 83, 0.15)' 
                      : hoveredCountry === country.code
                        ? 'rgba(255, 255, 255, 0.05)'
                        : 'transparent',
                    color: localSelected.includes(country.code)
                      ? 'var(--accent)'
                      : 'var(--foreground)',
                  }}
                >
                  <span className="text-sm font-medium flex-1 truncate">{country.name}</span>
                  <span 
                    className="text-xs px-1.5 py-0.5 rounded shrink-0"
                    style={{ 
                      backgroundColor: localSelected.includes(country.code) 
                        ? 'var(--accent)' 
                        : 'var(--background-tertiary)',
                      color: localSelected.includes(country.code) 
                        ? '#000' 
                        : 'var(--foreground-muted)'
                    }}
                  >
                    {country.code}
                  </span>
                </button>
              ))}
              {countryList.length === 0 && (
                <p className="text-sm p-3 text-center" style={{ color: 'var(--foreground-muted)' }}>
                  No countries found
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Selected Countries Tags */}
        {localSelected.length > 0 && (
          <div className="p-3 border-t" style={{ borderColor: 'var(--border)' }}>
            <div className="flex flex-wrap gap-2 max-h-20 overflow-y-auto">
              {localSelected.map((code) => (
                <span
                  key={code}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded text-sm"
                  style={{
                    backgroundColor: 'rgba(0, 200, 83, 0.2)',
                    color: 'var(--accent)'
                  }}
                >
                  🌍 {getCountryName(code)}
                  <button
                    onClick={() => toggleCountry(code)}
                    className="hover:opacity-70 ml-1"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="p-4 border-t flex justify-between" style={{ borderColor: 'var(--border)' }}>
          <button
            onClick={handleClear}
            className="btn btn-secondary px-4 py-2"
            disabled={localSelected.length === 0}
          >
            Clear All
          </button>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="btn btn-secondary px-6 py-2"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              className="btn btn-primary px-6 py-2"
            >
              Confirm ({localSelected.length})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Separate component for the map to handle dynamic imports properly
interface MapWithGeoJSONProps {
  geoJsonData: GeoJSON.FeatureCollection;
  selectedCountries: string[];
  onCountryClick: (code: string) => void;
  onCountryHover: (code: string | null) => void;
  getCountryStyle: (feature: GeoJSON.Feature | undefined) => Record<string, unknown>;
  mapRef: React.MutableRefObject<LeafletMap | null>;
  geoJsonRef: React.MutableRefObject<LeafletGeoJSON | null>;
}

function MapWithGeoJSON({
  geoJsonData,
  selectedCountries,
  onCountryClick,
  onCountryHover,
  getCountryStyle,
  mapRef,
  geoJsonRef,
}: MapWithGeoJSONProps) {
  const [leafletLoaded, setLeafletLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  // Use ref to track current selectedCountries for event handlers
  const selectedRef = useRef<string[]>(selectedCountries);
  
  // Keep ref in sync with prop
  useEffect(() => {
    selectedRef.current = selectedCountries;
  }, [selectedCountries]);

  useEffect(() => {
    if (typeof window === 'undefined' || !containerRef.current) return;

    // Dynamically import Leaflet
    import('leaflet').then((L) => {
      if (mapRef.current) return; // Already initialized

      // Create map
      const map = L.map(containerRef.current!, {
        center: [20, 0],
        zoom: 2,
        minZoom: 1,
        maxZoom: 8,
        worldCopyJump: true,
      });

      // Add dark tile layer
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
      }).addTo(map);

      // Add GeoJSON layer
      const geoJsonLayer = L.geoJSON(geoJsonData, {
        style: (feature) => getCountryStyle(feature) as L.PathOptions,
        onEachFeature: (feature, layer) => {
          const countryCode = feature.properties?.['ISO3166-1-Alpha-2'];
          const countryName = feature.properties?.name || countryCode;
          
          // Bind tooltip
          layer.bindTooltip(
            `<strong>${countryName}</strong><br/><span style="opacity: 0.7">${countryCode}</span>`,
            { 
              sticky: true,
              className: 'country-tooltip',
              direction: 'top',
              offset: [0, -10],
            }
          );

          // Event handlers - MOVED TO USEEFFECT
          // We don't attach handlers here anymore to avoid stale closures
          // and ensure cleaner event delegation via the GeoJSON layer
        },
      }).addTo(map);

      mapRef.current = map;
      geoJsonRef.current = geoJsonLayer;
      setLeafletLoaded(true);
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        geoJsonRef.current = null;
      }
    };
  }, [geoJsonData]);

  // Event handlers using delegation - Attached to the GeoJSON layer group
  useEffect(() => {
    if (!geoJsonRef.current || !leafletLoaded) return;

    const layerGroup = geoJsonRef.current;

    const handleClick = (e: any) => {
      const countryCode = e.layer.feature?.properties?.['ISO3166-1-Alpha-2'];
      if (countryCode) {
        // Toggle the selection in the ref immediately for accurate hover/mouseout behavior
        const isCurrentlySelected = selectedRef.current.includes(countryCode);
        const willBeSelected = !isCurrentlySelected;
        
        // Immediately apply the visual style change
        const target = e.layer;
        target.setStyle({
          fillColor: willBeSelected ? '#00C853' : '#2d2d2d',
          weight: willBeSelected ? 2 : 1,
          color: willBeSelected ? '#00E676' : '#444',
          fillOpacity: willBeSelected ? 0.7 : 0.3,
        });
        target.bringToFront();
        
        // Trigger the state update (this will also update selectedRef via useEffect)
        onCountryClick(countryCode);
      }
    };

    const handleMouseOver = (e: any) => {
      const countryCode = e.layer.feature?.properties?.['ISO3166-1-Alpha-2'];
      if (!countryCode) return;

      onCountryHover(countryCode);
      
      const target = e.layer;
      const isSelected = selectedRef.current.includes(countryCode);
      
      if (!isSelected) {
        target.setStyle({
          fillColor: '#4a9960',
          weight: 2,
          color: '#00C853',
          fillOpacity: 0.5,
        });
      }
      target.bringToFront();
    };

    const handleMouseOut = (e: any) => {
      const countryCode = e.layer.feature?.properties?.['ISO3166-1-Alpha-2'];
      if (!countryCode) return;

      onCountryHover(null);
      
      const target = e.layer;
      const isSelected = selectedRef.current.includes(countryCode);
      
      target.setStyle({
        fillColor: isSelected ? '#00C853' : '#2d2d2d',
        weight: isSelected ? 2 : 1,
        color: isSelected ? '#00E676' : '#444',
        fillOpacity: isSelected ? 0.7 : 0.3,
      });
    };

    layerGroup.on('click', handleClick);
    layerGroup.on('mouseover', handleMouseOver);
    layerGroup.on('mouseout', handleMouseOut);

    return () => {
      layerGroup.off('click', handleClick);
      layerGroup.off('mouseover', handleMouseOver);
      layerGroup.off('mouseout', handleMouseOut);
    };
  }, [leafletLoaded, onCountryClick, onCountryHover]);

  // Update styles when selection changes (not hover - hover is per-layer)
  useEffect(() => {
    if (geoJsonRef.current && leafletLoaded) {
      geoJsonRef.current.eachLayer((layer) => {
        const feature = (layer as L.GeoJSON).feature as GeoJSON.Feature | undefined;
        if (feature?.properties) {
          const countryCode = feature.properties['ISO3166-1-Alpha-2'];
          const isSelected = selectedCountries.includes(countryCode);
          (layer as L.Path).setStyle({
            fillColor: isSelected ? '#00C853' : '#2d2d2d',
            weight: isSelected ? 2 : 1,
            color: isSelected ? '#00E676' : '#444',
            fillOpacity: isSelected ? 0.7 : 0.3,
          });
        }
      });
    }
  }, [selectedCountries, leafletLoaded]);

  return (
    <>
      <div ref={containerRef} style={{ height: '100%', width: '100%' }} />
      <style jsx global>{`
        .country-tooltip {
          background: var(--card-bg, #111) !important;
          color: var(--foreground, #fff) !important;
          border: 1px solid var(--border, #333) !important;
          border-radius: 8px !important;
          padding: 8px 12px !important;
          font-size: 14px !important;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5) !important;
        }
        .country-tooltip::before {
          border-top-color: var(--border, #333) !important;
        }
        .leaflet-container {
          background: #1a1a1a !important;
        }
      `}</style>
    </>
  );
}
