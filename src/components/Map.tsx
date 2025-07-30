import {
  MapContainer,
  TileLayer,
  GeoJSON,
  CircleMarker,
  Popup,
  useMap,
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState, useCallback } from 'react';
import { SimpleGallery } from './SimpleGallery';
import { GeoJsonObject } from 'geojson';

interface City {
  city: string;
  country: string;
  coordinates: [number, number];
  photos?: string[];
}

interface GeoJSONFeature {
  type: 'Feature';
  properties: {
    name: string;
    [key: string]: unknown;
  };
  geometry: {
    type: string;
    coordinates: number[][][] | number[][][][];
  };
}

interface Country {
  name: string;
  geojson: GeoJSONFeature;
  cities: City[];
}

interface MapProps {
  cities: City[];
}

// Global variable to store the recenter function
let globalRecenterFunction: (() => void) | null = null;

// Component to handle map recentering (inside MapContainer)
function RecenterButton() {
  const map = useMap();

  const handleRecenter = useCallback(() => {
    map.setView([48.8566, 2.3522], 5, {
      animate: true,
      duration: 1,
    });
  }, [map]);

  useEffect(() => {
    globalRecenterFunction = handleRecenter;
  }, [handleRecenter]);

  return null; // This component doesn't render anything, it just provides the function
}

// UI Button component for the control panel
function RecenterButtonUI() {
  return (
    <button
      onClick={() => globalRecenterFunction?.()}
      style={{
        width: '100%',
        padding: '8px 12px',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        border: '1px solid rgba(59, 130, 246, 0.2)',
        borderRadius: '6px',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        fontSize: '11px',
        fontWeight: '600',
        color: '#3B82F6',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '6px',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.2)';
        e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.3)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.1)';
        e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.2)';
      }}
      title="Recenter map to Europe"
    >
      🎯 Recenter
    </button>
  );
}

// Map styles configuration
const MAP_STYLES = {
  standard: {
    name: 'Standard',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '© OpenStreetMap contributors',
  },
  dark: {
    name: 'Dark',
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '© CartoDB',
  },
  light: {
    name: 'Light',
    url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
    attribution: '© CartoDB',
  },
  satellite: {
    name: 'Satellite',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: '© Esri',
  },
  terrain: {
    name: 'Terrain',
    url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    attribution: '© OpenTopoMap',
  },
  vintage: {
    name: 'Vintage',
    url: 'https://{s}.tile.stamen.com/watercolor/{z}/{x}/{y}.jpg',
    attribution: '© Stamen Design',
  },
};

// Color schemes configuration
const COLOR_SCHEMES = {
  green: {
    name: 'Green',
    countryBorder: '#059669',
    countryFill: '#10B981',
    countryFillOpacity: 0.08,
    cityBorder: '#DC2626',
    cityFill: '#EF4444',
    cityFillOpacity: 0.9,
  },
  blue: {
    name: 'Blue',
    countryBorder: '#1E40AF',
    countryFill: '#3B82F6',
    countryFillOpacity: 0.08,
    cityBorder: '#DC2626',
    cityFill: '#EF4444',
    cityFillOpacity: 0.9,
  },
  purple: {
    name: 'Purple',
    countryBorder: '#7C3AED',
    countryFill: '#8B5CF6',
    countryFillOpacity: 0.08,
    cityBorder: '#F59E0B',
    cityFill: '#FBBF24',
    cityFillOpacity: 0.9,
  },
  orange: {
    name: 'Orange',
    countryBorder: '#EA580C',
    countryFill: '#F97316',
    countryFillOpacity: 0.08,
    cityBorder: '#059669',
    cityFill: '#10B981',
    cityFillOpacity: 0.9,
  },
  red: {
    name: 'Red',
    countryBorder: '#DC2626',
    countryFill: '#EF4444',
    countryFillOpacity: 0.08,
    cityBorder: '#059669',
    cityFill: '#10B981',
    cityFillOpacity: 0.9,
  },
  teal: {
    name: 'Teal',
    countryBorder: '#0F766E',
    countryFill: '#14B8A6',
    countryFillOpacity: 0.08,
    cityBorder: '#DC2626',
    cityFill: '#EF4444',
    cityFillOpacity: 0.9,
  },
};

export default function Map({ cities }: MapProps) {
  const [countries, setCountries] = useState<Record<string, Country>>({});
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [selectedMapStyle, setSelectedMapStyle] =
    useState<keyof typeof MAP_STYLES>('light');
  const [selectedColorScheme, setSelectedColorScheme] =
    useState<keyof typeof COLOR_SCHEMES>('green');

  useEffect(() => {
    const loadCountries = async () => {
      try {
        // Load local GeoJSON data
        const geojsonResponse = await fetch(`/countries-features.json`);
        const geojsonData: { features: GeoJSONFeature[] } =
          await geojsonResponse.json();

        // Group cities by country
        const citiesByCountry: Record<string, City[]> = {};
        cities.forEach(city => {
          if (!citiesByCountry[city.country]) {
            citiesByCountry[city.country] = [];
          }
          citiesByCountry[city.country].push(city);
        });

        // Find GeoJSON features for each country
        const countryData: Record<string, Country> = {};

        for (const [countryName, countryCities] of Object.entries(
          citiesByCountry
        )) {
          // Find the country in GeoJSON data
          let countryFeatures = geojsonData.features.filter(
            (feature: GeoJSONFeature) => {
              return feature.properties.name === countryName;
            }
          );

          if (countryFeatures.length === 0) {
            // Try alternative names
            const alternativeNames: Record<string, string> = {
              Spain: 'España',
              Germany: 'Deutschland',
              Italy: 'Italia',
              Netherlands: 'Nederland',
              Switzerland: 'Schweiz',
              'Czech Republic': 'Czechia',
              'United Kingdom':
                'United Kingdom of Great Britain and Northern Ireland',
            };

            const altName = alternativeNames[countryName];
            if (altName) {
              countryFeatures = geojsonData.features.filter(
                (feature: GeoJSONFeature) => {
                  return feature.properties.name === altName;
                }
              );
            }
          }

          if (countryFeatures.length > 0) {
            // For European countries, filter to mainland Europe
            let selectedFeature = countryFeatures[0];

            if (
              [
                'France',
                'Spain',
                'Portugal',
                'Italy',
                'Germany',
                'Netherlands',
                'Belgium',
                'Switzerland',
                'Austria',
              ].includes(countryName)
            ) {
              // Find the feature that is in Europe
              const europeanFeature = countryFeatures.find(
                (feature: GeoJSONFeature) => {
                  try {
                    const geometry = feature.geometry;
                    if (!geometry || !geometry.coordinates) return false;

                    // Calculate centroid
                    let totalLon = 0;
                    let totalLat = 0;
                    let pointCount = 0;

                    const extractCoords = (coords: unknown) => {
                      if (Array.isArray(coords)) {
                        if (
                          coords.length >= 2 &&
                          typeof coords[0] === 'number' &&
                          typeof coords[1] === 'number'
                        ) {
                          totalLon += coords[0];
                          totalLat += coords[1];
                          pointCount++;
                        } else {
                          coords.forEach(coord => extractCoords(coord));
                        }
                      }
                    };

                    extractCoords(geometry.coordinates);

                    if (pointCount === 0) return false;

                    const avgLon = totalLon / pointCount;
                    const avgLat = totalLat / pointCount;

                    // Europe boundaries
                    return (
                      avgLon >= -10 &&
                      avgLon <= 30 &&
                      avgLat >= 35 &&
                      avgLat <= 70
                    );
                  } catch {
                    return false;
                  }
                }
              );

              if (europeanFeature) {
                selectedFeature = europeanFeature;
              }
            }

            countryData[countryName] = {
              name: countryName,
              geojson: selectedFeature,
              cities: countryCities,
            };
          }
        }

        setCountries(countryData);
      } catch {
        console.error('Error loading countries');
      }
    };

    loadCountries();
  }, [cities]);

  return (
    <div
      style={{
        height: '100vh',
        width: '100vw',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: 'hidden',
        margin: 0,
        padding: 0,
      }}
    >
      {/* Map Controls Panel */}
      <div
        style={{
          position: 'absolute',
          top: '15px',
          right: '15px',
          zIndex: 1000,
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          borderRadius: '12px',
          padding: '16px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          minWidth: '200px',
        }}
      >
        {/* Map Style Selector */}
        <div style={{ marginBottom: '16px' }}>
          <label
            style={{
              fontSize: '11px',
              fontWeight: '600',
              marginBottom: '8px',
              display: 'block',
              color: '#374151',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}
          >
            🗺️ Map Style
          </label>

          {/* Map Style Preview Thumbnails */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '6px',
            }}
          >
            {Object.entries(MAP_STYLES).map(([key, style]) => (
              <div
                key={key}
                onClick={() =>
                  setSelectedMapStyle(key as keyof typeof MAP_STYLES)
                }
                style={{
                  width: '100%',
                  height: '32px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  transform:
                    selectedMapStyle === key ? 'scale(1.05)' : 'scale(1)',
                  boxShadow:
                    selectedMapStyle === key
                      ? '0 2px 8px rgba(0, 0, 0, 0.2)'
                      : '0 1px 3px rgba(0, 0, 0, 0.1)',
                  border:
                    selectedMapStyle === key
                      ? '2px solid #3B82F6'
                      : '1px solid #E5E7EB',
                  position: 'relative',
                  overflow: 'hidden',
                }}
                title={`${style.name} map style`}
              >
                {/* Map style preview images */}
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    backgroundImage:
                      key === 'standard'
                        ? 'url("https://tile.openstreetmap.org/5/16/10.png")'
                        : key === 'dark'
                          ? 'url("https://cartodb-basemaps-a.global.ssl.fastly.net/dark_all/5/16/10.png")'
                          : key === 'light'
                            ? 'url("https://cartodb-basemaps-a.global.ssl.fastly.net/light_all/5/16/10.png")'
                            : key === 'satellite'
                              ? 'url("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/5/10/16")'
                              : key === 'terrain'
                                ? 'url("https://tile.opentopomap.org/5/16/10.png")'
                                : key === 'vintage'
                                  ? 'url("https://stamen-tiles.a.ssl.fastly.net/watercolor/5/16/10.jpg")'
                                  : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                  }}
                />

                {/* Style name overlay */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: '0',
                    left: '0',
                    right: '0',
                    background: 'rgba(0, 0, 0, 0.7)',
                    color: 'white',
                    fontSize: '8px',
                    padding: '2px 4px',
                    textAlign: 'center',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}
                >
                  {style.name}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Color Scheme Selector */}
        <div>
          <label
            style={{
              fontSize: '11px',
              fontWeight: '600',
              marginBottom: '8px',
              display: 'block',
              color: '#374151',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}
          >
            🎨 Color Scheme
          </label>

          {/* Color Preview Squares */}
          <div
            style={{
              display: 'flex',
              gap: '4px',
              justifyContent: 'center',
            }}
          >
            {Object.entries(COLOR_SCHEMES).map(([key, scheme]) => (
              <div
                key={key}
                onClick={() =>
                  setSelectedColorScheme(key as keyof typeof COLOR_SCHEMES)
                }
                style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '4px',
                  backgroundColor: scheme.countryFill,
                  border: `2px solid ${scheme.countryBorder}`,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  transform:
                    selectedColorScheme === key ? 'scale(1.1)' : 'scale(1)',
                  boxShadow:
                    selectedColorScheme === key
                      ? '0 2px 8px rgba(0, 0, 0, 0.2)'
                      : '0 1px 3px rgba(0, 0, 0, 0.1)',
                  position: 'relative',
                }}
                title={`${scheme.name} color scheme`}
              >
                {/* Small red dot to show city color */}
                <div
                  style={{
                    position: 'absolute',
                    top: '2px',
                    right: '2px',
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: scheme.cityFill,
                    border: `1px solid ${scheme.cityBorder}`,
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Recenter Button */}
        <div style={{ marginTop: '12px' }}>
          <RecenterButtonUI />
        </div>
      </div>

      <MapContainer
        center={[48.8566, 2.3522]}
        zoom={5}
        style={{
          height: '100vh',
          width: '100vw',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          margin: 0,
          padding: 0,
          backgroundColor: '#f8f9fa',
        }}
        worldCopyJump={true}
        minZoom={2}
        maxZoom={18}
        maxBounds={[
          [-90, -180],
          [90, 180],
        ]}
        maxBoundsViscosity={1.0}
        zoomControl={true}
        attributionControl={false}
        bounceAtZoomLimits={false}
        zoomAnimation={true}
        zoomAnimationThreshold={10}
      >
        <TileLayer
          url={MAP_STYLES[selectedMapStyle].url}
          attribution={MAP_STYLES[selectedMapStyle].attribution}
          noWrap={false}
          bounds={[
            [-90, -180],
            [90, 180],
          ]}
          tileSize={256}
          zoomOffset={0}
          updateWhenZooming={true}
          updateWhenIdle={true}
        />
        <RecenterButton />

        {/* Render country outlines */}
        {Object.values(countries).map(country => (
          <GeoJSON
            key={country.name}
            data={country.geojson as GeoJsonObject}
            style={{
              color: COLOR_SCHEMES[selectedColorScheme].countryBorder,
              weight: 3,
              fillColor: COLOR_SCHEMES[selectedColorScheme].countryFill,
              fillOpacity:
                COLOR_SCHEMES[selectedColorScheme].countryFillOpacity,
            }}
            onEachFeature={(feature, layer) => {
              layer.bindPopup(
                `<strong>${country.name}</strong><br/>${country.cities.length} city(ies) visited`
              );
            }}
          />
        ))}

        {/* Render city markers - AFTER countries so they appear on top */}
        {cities.map(city => (
          <CircleMarker
            key={`${city.city}-${city.country}`}
            center={city.coordinates}
            radius={city.photos && city.photos.length > 0 ? 12 : 10}
            pathOptions={{
              color: COLOR_SCHEMES[selectedColorScheme].cityBorder,
              weight: city.photos && city.photos.length > 0 ? 3 : 2,
              fillColor: COLOR_SCHEMES[selectedColorScheme].cityFill,
              fillOpacity: COLOR_SCHEMES[selectedColorScheme].cityFillOpacity,
            }}
            eventHandlers={{
              click: () => {
                if (city.photos && city.photos.length > 0) {
                  setSelectedCity(city);
                }
              },
            }}
            pane="markerPane"
          >
            <Popup>
              <div style={{ textAlign: 'center' }}>
                <strong style={{ fontSize: '16px' }}>{city.city}</strong>
                <br />
                <span style={{ color: '#666' }}>{city.country}</span>
                {city.photos && city.photos.length > 0 && (
                  <div style={{ marginTop: '8px' }}>
                    <span
                      style={{
                        color: '#007bff',
                        fontSize: '12px',
                        display: 'block',
                      }}
                    >
                      📸 Click on marker to see {city.photos.length} photo(s)
                    </span>
                  </div>
                )}
              </div>
            </Popup>
          </CircleMarker>
        ))}

        {/* Photo Gallery Modal */}
        {selectedCity && selectedCity.photos && (
          <SimpleGallery
            photos={selectedCity.photos}
            cityName={selectedCity.city}
            onClose={() => setSelectedCity(null)}
          />
        )}
      </MapContainer>
    </div>
  );
}
