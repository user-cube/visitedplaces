import { GeoJSON } from 'react-leaflet';
import { GeoJsonObject } from 'geojson';
import { Country, ColorScheme } from '../types';

interface CountryLayerProps {
  countries: Record<string, Country>;
  colorScheme: ColorScheme;
}

export function CountryLayer({ countries, colorScheme }: CountryLayerProps) {
  return (
    <>
      {Object.values(countries).map(country => (
        <GeoJSON
          key={country.name}
          data={country.geojson as GeoJsonObject}
          style={{
            color: colorScheme.countryBorder,
            weight: 3,
            fillColor: colorScheme.countryFill,
            fillOpacity: colorScheme.countryFillOpacity,
          }}
          onEachFeature={(feature, layer) => {
            layer.bindPopup(
              `<strong>${country.name}</strong><br/>${country.cities.length} city(ies) visited`
            );
          }}
        />
      ))}
    </>
  );
} 