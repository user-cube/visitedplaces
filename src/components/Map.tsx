import { MapContainer, TileLayer, ZoomControl } from 'react-leaflet';
import { useRouter } from 'next/router';
import 'leaflet/dist/leaflet.css';
import { MapProps, MAP_STYLES, COLOR_SCHEMES } from '../types';
import {
  MapControls,
  RecenterButton,
  CustomZoomControl,
  CountryLayer,
  CityMarkers,
  SimpleGallery,
} from './';
import { useMapState } from '../hooks';
import {
  MAP_CENTER,
  DEFAULT_ZOOM,
  MAP_BOUNDS,
  MAP_CONFIG,
  TILE_CONFIG,
  CONTAINER_STYLES,
  MAP_CONTAINER_STYLES,
} from '../constants';

export default function Map({ cities }: MapProps) {
  const router = useRouter();
  const {
    countries,
    selectedCity,
    selectedMapStyle,
    selectedColorScheme,
    setSelectedMapStyle,
    setSelectedColorScheme,
    handleCityClick,
    handleCloseGallery,
  } = useMapState(cities);

  const currentColorScheme = COLOR_SCHEMES[selectedColorScheme];

  return (
    <div style={CONTAINER_STYLES}>
      {/* Navigation Button */}
      <div className="absolute top-4 right-4 z-50">
        <button
          onClick={() => router.push('/itineraries')}
          className="floating-control flex items-center space-x-2"
        >
          <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m-6 3l6-3" />
          </svg>
          <span className="text-sm font-medium text-gray-700">Itineraries</span>
        </button>
      </div>

      {/* Map Controls Panel */}
      <MapControls
        selectedMapStyle={selectedMapStyle}
        selectedColorScheme={selectedColorScheme}
        onMapStyleChange={setSelectedMapStyle}
        onColorSchemeChange={setSelectedColorScheme}
      />

      <MapContainer
        center={MAP_CENTER}
        zoom={DEFAULT_ZOOM}
        style={MAP_CONTAINER_STYLES}
        {...MAP_CONFIG}
        zoomControl={false}
        maxBounds={MAP_BOUNDS}
      >
        <TileLayer
          url={MAP_STYLES[selectedMapStyle].url}
          attribution={MAP_STYLES[selectedMapStyle].attribution}
          bounds={MAP_BOUNDS}
          {...TILE_CONFIG}
        />
        <RecenterButton />
        <CustomZoomControl position="bottomright" />

        {/* Render country outlines */}
        <CountryLayer countries={countries} colorScheme={currentColorScheme} />

        {/* Render city markers - AFTER countries so they appear on top */}
        <CityMarkers
          cities={cities}
          colorScheme={currentColorScheme}
          onCityClick={handleCityClick}
        />

        {/* Photo Gallery Modal */}
        {selectedCity && selectedCity.photos && (
          <SimpleGallery
            photos={selectedCity.photos}
            cityName={selectedCity.city}
            onClose={handleCloseGallery}
          />
        )}
      </MapContainer>
    </div>
  );
}
