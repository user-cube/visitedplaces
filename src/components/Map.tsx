import {
  MapContainer,
  TileLayer,
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { MapProps, MAP_STYLES, COLOR_SCHEMES } from '../types';
import { MapControls, RecenterButton, CountryLayer, CityMarkers, SimpleGallery } from './';
import { useMapState, useRecenter } from '../hooks';
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

  const { handleRecenter } = useRecenter();

  const currentColorScheme = COLOR_SCHEMES[selectedColorScheme];

  return (
    <div style={CONTAINER_STYLES}>
      {/* Map Controls Panel */}
      <MapControls
        selectedMapStyle={selectedMapStyle}
        selectedColorScheme={selectedColorScheme}
        onMapStyleChange={setSelectedMapStyle}
        onColorSchemeChange={setSelectedColorScheme}
        onRecenter={handleRecenter}
      />

      <MapContainer
        center={MAP_CENTER}
        zoom={DEFAULT_ZOOM}
        style={MAP_CONTAINER_STYLES}
        {...MAP_CONFIG}
        maxBounds={MAP_BOUNDS}
      >
        <TileLayer
          url={MAP_STYLES[selectedMapStyle].url}
          attribution={MAP_STYLES[selectedMapStyle].attribution}
          bounds={MAP_BOUNDS}
          {...TILE_CONFIG}
        />
        <RecenterButton />

        {/* Render country outlines */}
        <CountryLayer
          countries={countries}
          colorScheme={currentColorScheme}
        />

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
