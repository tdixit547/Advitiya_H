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
<<<<<<< Updated upstream
    setLocalSelected(prev => 
      prev.includes(code) 
=======
    setLocalSelected(prev =>
      prev.includes(code)
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
    
    const countryCode = feature.properties.ISO_A2;
    const isSelected = localSelected.includes(countryCode);
    
=======

    const countryCode = feature.properties.ISO_A2;
    const isSelected = localSelected.includes(countryCode);

>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
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
=======
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div
        className="w-full max-w-5xl rounded-2xl flex flex-col"
        style={{
          backgroundColor: '#111',
          border: '1px solid #333',
          height: '85vh',
          maxHeight: '700px',
        }}
      >
        {/* Header - Fixed Height */}
        <div className="shrink-0 p-4 border-b border-[#333]">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-bold text-white">
>>>>>>> Stashed changes
              🌍 Select Countries
            </h2>
            <button
              onClick={onClose}
<<<<<<< Updated upstream
              className="p-2 hover:opacity-70 transition-opacity text-xl"
              style={{ color: 'var(--foreground-secondary)' }}
=======
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors text-[#888] hover:text-white"
>>>>>>> Stashed changes
            >
              ✕
            </button>
          </div>
<<<<<<< Updated upstream
          
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
=======

          {/* Search Bar */}
          <div className="flex gap-3 items-center">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search countries..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2.5 bg-black border border-[#444] rounded-lg text-white placeholder-[#666] focus:border-[#00C853] focus:outline-none transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#666] hover:text-white"
                >
                  ✕
                </button>
              )}
            </div>
            <div className="px-3 py-2 bg-[#00C853]/20 text-[#00C853] rounded-lg text-sm font-medium whitespace-nowrap">
              {localSelected.length} selected
            </div>
          </div>
        </div>

        {/* Main Content - Map + List */}
        <div className="flex-1 flex min-h-0 overflow-hidden">
          {/* Map Container */}
          <div className="flex-1 relative bg-[#1a1a1a]">
            {mapReady && geoJsonData ? (
>>>>>>> Stashed changes
              <MapWithGeoJSON
                geoJsonData={geoJsonData}
                selectedCountries={localSelected}
                onCountryClick={toggleCountry}
                onCountryHover={setHoveredCountry}
                getCountryStyle={getCountryStyle}
                mapRef={mapRef}
                geoJsonRef={geoJsonRef}
              />
<<<<<<< Updated upstream
            )}
            {(!mapReady || !geoJsonData) && (
              <div className="absolute inset-0 flex items-center justify-center" style={{ backgroundColor: 'var(--background-secondary)' }}>
                <div className="flex flex-col items-center gap-3" style={{ color: 'var(--foreground-secondary)' }}>
                  <span className="w-8 h-8 border-3 border-current border-t-transparent rounded-full animate-spin"></span>
=======
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex flex-col items-center gap-3 text-[#666]">
                  <div className="w-8 h-8 border-2 border-[#00C853] border-t-transparent rounded-full animate-spin"></div>
>>>>>>> Stashed changes
                  <span>Loading world map...</span>
                </div>
              </div>
            )}
<<<<<<< Updated upstream
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
=======

            {/* Hover Tooltip - Positioned Absolutely */}
            {hoveredCountry && (
              <div className="absolute bottom-4 left-4 px-4 py-2 bg-black/90 border border-[#333] rounded-lg shadow-lg z-10">
                <span className="text-[#00C853] font-medium">
                  {getCountryName(hoveredCountry)}
                </span>
                <span className="text-[#888] ml-2">({hoveredCountry})</span>
                <span className="text-[#666] ml-3 text-sm">
                  Click to {localSelected.includes(hoveredCountry) ? 'deselect' : 'select'}
                </span>
              </div>
            )}
          </div>

          {/* Country List Sidebar - Fixed Width */}
          <div className="w-72 border-l border-[#333] flex flex-col bg-[#0a0a0a]">
            <div className="shrink-0 px-3 py-2 border-b border-[#333] text-xs font-medium uppercase tracking-wide text-[#666]">
              {searchQuery ? 'Search Results' : 'All Countries'} ({countryList.length})
            </div>
            <div className="flex-1 overflow-y-auto p-2">
              {countryList.map((country) => {
                const isSelected = localSelected.includes(country.code);
                const isHovered = hoveredCountry === country.code;
                return (
                  <button
                    key={country.code}
                    onClick={() => toggleCountry(country.code)}
                    onMouseEnter={() => setHoveredCountry(country.code)}
                    onMouseLeave={() => setHoveredCountry(null)}
                    className={`w-full text-left px-3 py-2.5 rounded-lg flex items-center gap-3 transition-all mb-1 ${isSelected
                      ? 'bg-[#00C853]/15 text-[#00C853]'
                      : isHovered
                        ? 'bg-white/5 text-white'
                        : 'text-[#ccc] hover:bg-white/5'
                      }`}
                  >
                    <span className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${isSelected ? 'bg-[#00C853] border-[#00C853]' : 'border-[#444]'
                      }`}>
                      {isSelected && <span className="text-black text-xs">✓</span>}
                    </span>
                    <span className="text-sm font-medium flex-1 truncate">{country.name}</span>
                    <span className={`text-xs px-1.5 py-0.5 rounded shrink-0 ${isSelected ? 'bg-[#00C853] text-black' : 'bg-[#222] text-[#888]'
                      }`}>
                      {country.code}
                    </span>
                  </button>
                );
              })}
              {countryList.length === 0 && (
                <div className="text-sm p-4 text-center text-[#666]">
                  No countries found
                </div>
>>>>>>> Stashed changes
              )}
            </div>
          </div>
        </div>

<<<<<<< Updated upstream
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
=======
        {/* Selected Countries Tags - Fixed Height */}
        <div className="shrink-0 h-16 border-t border-[#333] flex items-center px-4 overflow-hidden">
          {localSelected.length > 0 ? (
            <div className="flex gap-2 overflow-x-auto flex-1 py-2">
              {localSelected.map((code) => (
                <span
                  key={code}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#00C853]/20 text-[#00C853] rounded-full text-sm whitespace-nowrap shrink-0"
                >
                  {getCountryName(code)}
                  <button
                    onClick={() => toggleCountry(code)}
                    className="w-4 h-4 rounded-full bg-[#00C853]/30 hover:bg-[#00C853]/50 flex items-center justify-center text-xs"
>>>>>>> Stashed changes
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
<<<<<<< Updated upstream
          </div>
        )}

        {/* Footer */}
        <div className="p-4 border-t flex justify-between" style={{ borderColor: 'var(--border)' }}>
          <button
            onClick={handleClear}
            className="btn btn-secondary px-4 py-2"
=======
          ) : (
            <span className="text-[#666] text-sm">No countries selected. Click on a country to select it.</span>
          )}
        </div>

        {/* Footer - Fixed Height */}
        <div className="shrink-0 p-4 border-t border-[#333] flex justify-between items-center bg-[#0a0a0a]">
          <button
            onClick={handleClear}
            className="px-4 py-2 rounded-lg border border-[#444] text-[#888] hover:text-white hover:border-[#666] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
>>>>>>> Stashed changes
            disabled={localSelected.length === 0}
          >
            Clear All
          </button>
          <div className="flex gap-3">
            <button
              onClick={onClose}
<<<<<<< Updated upstream
              className="btn btn-secondary px-6 py-2"
=======
              className="px-6 py-2 rounded-lg border border-[#444] text-white hover:bg-white/10 transition-colors"
>>>>>>> Stashed changes
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
<<<<<<< Updated upstream
              className="btn btn-primary px-6 py-2"
            >
              Confirm ({localSelected.length})
=======
              className="px-6 py-2 rounded-lg bg-[#00C853] text-black font-medium hover:bg-[#00E676] transition-colors"
            >
              Confirm Selection
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
  getCountryStyle,
=======
>>>>>>> Stashed changes
  mapRef,
  geoJsonRef,
}: MapWithGeoJSONProps) {
  const [leafletLoaded, setLeafletLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

<<<<<<< Updated upstream
=======
  // Use refs to avoid stale closures
  const selectedCountriesRef = useRef(selectedCountries);
  const onCountryClickRef = useRef(onCountryClick);

  // Keep refs updated
  useEffect(() => {
    selectedCountriesRef.current = selectedCountries;
  }, [selectedCountries]);

  useEffect(() => {
    onCountryClickRef.current = onCountryClick;
  }, [onCountryClick]);

  // Get style based on selection status
  const getStyle = (countryCode: string | null, isHovered: boolean = false): Record<string, unknown> => {
    if (!countryCode) {
      return {
        fillColor: '#2d2d2d',
        weight: 1,
        opacity: 1,
        color: '#444',
        fillOpacity: 0.3,
      };
    }
    const isSelected = selectedCountriesRef.current.includes(countryCode);
    if (isSelected) {
      return {
        fillColor: '#00C853',
        weight: 2,
        opacity: 1,
        color: '#00E676',
        fillOpacity: 0.7,
      };
    }
    if (isHovered) {
      return {
        fillColor: '#00C853',
        weight: 2,
        opacity: 1,
        color: '#00C853',
        fillOpacity: 0.4,
      };
    }
    return {
      fillColor: '#2d2d2d',
      weight: 1,
      opacity: 1,
      color: '#444',
      fillOpacity: 0.3,
    };
  };

>>>>>>> Stashed changes
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

<<<<<<< Updated upstream
      // Add GeoJSON layer
      const geoJsonLayer = L.geoJSON(geoJsonData, {
        style: (feature) => getCountryStyle(feature) as L.PathOptions,
        onEachFeature: (feature, layer) => {
          const countryCode = feature.properties?.ISO_A2;
          const countryName = feature.properties?.ADMIN || feature.properties?.name || countryCode;
          
          // Bind tooltip
          layer.bindTooltip(
            `<strong>${countryName}</strong><br/><span style="opacity: 0.7">${countryCode}</span>`,
            { 
=======
      // Helper function to get country code from feature properties
      const getCountryCode = (properties: Record<string, unknown> | null | undefined): string | null => {
        if (!properties) return null;
        return (
          (properties.ISO_A2 as string) ||
          (properties.iso_a2 as string) ||
          (properties.ISO3166_1_A2 as string) ||
          null
        );
      };

      // Add GeoJSON layer with interactive polygons
      const geoJsonLayer = L.geoJSON(geoJsonData, {
        style: (feature) => {
          const code = getCountryCode(feature?.properties);
          return getStyle(code) as L.PathOptions;
        },
        interactive: true,
        onEachFeature: (feature, layer) => {
          const properties = feature.properties;
          const countryCode = getCountryCode(properties);
          const countryName = properties?.ADMIN || properties?.name || properties?.NAME || countryCode || 'Unknown';

          if (!countryCode) return;

          // Make layer interactive
          (layer as L.Path).options.interactive = true;

          // Bind tooltip
          layer.bindTooltip(
            `<strong>${countryName}</strong><br/><span style="opacity: 0.7">${countryCode}</span>`,
            {
>>>>>>> Stashed changes
              sticky: true,
              className: 'country-tooltip',
              direction: 'top',
              offset: [0, -10],
            }
          );

<<<<<<< Updated upstream
          // Event handlers - apply hover style ONLY to this layer
          layer.on({
            mouseover: (e) => {
              onCountryHover(countryCode);
              const target = e.target as L.Path;
              // Apply hover style only if not selected
              const isSelected = selectedCountries.includes(countryCode);
              if (!isSelected) {
                target.setStyle({
                  fillColor: '#4a9960',
                  weight: 2,
                  color: '#00C853',
                  fillOpacity: 0.5,
                });
              }
              target.bringToFront();
            },
            mouseout: (e) => {
              onCountryHover(null);
              const target = e.target as L.Path;
              // Reset to base style (selected or not)
              const isSelected = selectedCountries.includes(countryCode);
              target.setStyle({
                fillColor: isSelected ? '#00C853' : '#2d2d2d',
                weight: isSelected ? 2 : 1,
                color: isSelected ? '#00E676' : '#444',
                fillOpacity: isSelected ? 0.7 : 0.3,
              });
            },
            click: () => {
              if (countryCode) {
                onCountryClick(countryCode);
              }
            },
=======
          // Click handler
          layer.on('click', () => {
            console.log('🗺️ Country clicked:', countryCode);
            onCountryClickRef.current(countryCode);
          });

          // Mouse enter - highlight
          layer.on('mouseover', (e) => {
            onCountryHover(countryCode);
            const target = e.target as L.Path;
            const isSelected = selectedCountriesRef.current.includes(countryCode);

            // Always apply hover style (brighter green)
            target.setStyle({
              fillColor: isSelected ? '#00E676' : '#00C853',
              weight: 2,
              color: '#00C853',
              fillOpacity: isSelected ? 0.8 : 0.5,
            });

            target.bringToFront();
          });

          // Mouse leave - reset to base style
          layer.on('mouseout', (e) => {
            onCountryHover(null);
            const target = e.target as L.Path;
            const isSelected = selectedCountriesRef.current.includes(countryCode);

            target.setStyle({
              fillColor: isSelected ? '#00C853' : '#2d2d2d',
              weight: isSelected ? 2 : 1,
              color: isSelected ? '#00E676' : '#444',
              fillOpacity: isSelected ? 0.7 : 0.3,
            });
>>>>>>> Stashed changes
          });
        },
      }).addTo(map);

      mapRef.current = map;
      geoJsonRef.current = geoJsonLayer;
      setLeafletLoaded(true);
<<<<<<< Updated upstream
=======
      console.log('🗺️ Map initialized with', geoJsonData.features.length, 'countries');
>>>>>>> Stashed changes
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        geoJsonRef.current = null;
      }
    };
  }, [geoJsonData]);

<<<<<<< Updated upstream
  // Update styles when selection changes (not hover - hover is per-layer)
  useEffect(() => {
    if (geoJsonRef.current && leafletLoaded) {
      geoJsonRef.current.eachLayer((layer) => {
        const feature = (layer as L.GeoJSON).feature as GeoJSON.Feature | undefined;
        if (feature?.properties) {
          const countryCode = feature.properties.ISO_A2;
          const isSelected = selectedCountries.includes(countryCode);
          (layer as L.Path).setStyle({
            fillColor: isSelected ? '#00C853' : '#2d2d2d',
            weight: isSelected ? 2 : 1,
            color: isSelected ? '#00E676' : '#444',
            fillOpacity: isSelected ? 0.7 : 0.3,
          });
=======
  // Update styles when selection changes
  useEffect(() => {
    if (geoJsonRef.current && leafletLoaded) {
      geoJsonRef.current.eachLayer((layer) => {
        const geoLayer = layer as L.GeoJSON & { feature?: GeoJSON.Feature };
        const feature = geoLayer.feature;
        if (feature?.properties) {
          const countryCode = feature.properties.ISO_A2 || feature.properties.iso_a2;
          if (countryCode) {
            const isSelected = selectedCountries.includes(countryCode);
            (layer as L.Path).setStyle({
              fillColor: isSelected ? '#00C853' : '#2d2d2d',
              weight: isSelected ? 2 : 1,
              color: isSelected ? '#00E676' : '#444',
              fillOpacity: isSelected ? 0.7 : 0.3,
            });
          }
>>>>>>> Stashed changes
        }
      });
    }
  }, [selectedCountries, leafletLoaded]);

  return (
    <>
<<<<<<< Updated upstream
      <div ref={containerRef} style={{ height: '100%', width: '100%' }} />
      <style jsx global>{`
        .country-tooltip {
          background: var(--card-bg, #111) !important;
          color: var(--foreground, #fff) !important;
          border: 1px solid var(--border, #333) !important;
=======
      <div
        ref={containerRef}
        style={{
          height: '100%',
          width: '100%',
          cursor: 'pointer',
        }}
      />
      <style jsx global>{`
        .country-tooltip {
          background: #111 !important;
          color: #fff !important;
          border: 1px solid #333 !important;
>>>>>>> Stashed changes
          border-radius: 8px !important;
          padding: 8px 12px !important;
          font-size: 14px !important;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5) !important;
        }
        .country-tooltip::before {
<<<<<<< Updated upstream
          border-top-color: var(--border, #333) !important;
        }
        .leaflet-container {
          background: #1a1a1a !important;
=======
          border-top-color: #333 !important;
        }
        .leaflet-container {
          background: #1a1a1a !important;
          cursor: crosshair !important;
        }
        .leaflet-interactive {
          cursor: pointer !important;
        }
        .leaflet-interactive:hover {
          cursor: pointer !important;
>>>>>>> Stashed changes
        }
      `}</style>
    </>
  );
}
<<<<<<< Updated upstream
=======

>>>>>>> Stashed changes
