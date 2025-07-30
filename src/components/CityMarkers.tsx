import { CircleMarker, Popup } from 'react-leaflet';
import { City, ColorScheme } from '../types';

interface CityMarkersProps {
  cities: City[];
  colorScheme: ColorScheme;
  onCityClick: (city: City) => void;
}

export function CityMarkers({
  cities,
  colorScheme,
  onCityClick,
}: CityMarkersProps) {
  return (
    <>
      {cities.map(city => (
        <CircleMarker
          key={`${city.city}-${city.country}`}
          center={city.coordinates}
          radius={city.photos && city.photos.length > 0 ? 12 : 10}
          pathOptions={{
            color: colorScheme.cityBorder,
            weight: city.photos && city.photos.length > 0 ? 3 : 2,
            fillColor: colorScheme.cityFill,
            fillOpacity: colorScheme.cityFillOpacity,
          }}
          eventHandlers={{
            click: () => {
              if (city.photos && city.photos.length > 0) {
                onCityClick(city);
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
    </>
  );
}
