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
            <div className="city-popup">
              <strong className="city-popup-title">{city.city}</strong>
              <br />
              <span className="city-popup-country">{city.country}</span>
              {city.photos && city.photos.length > 0 && (
                <div className="city-popup-photos">
                  <span className="city-popup-photos-text">
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
