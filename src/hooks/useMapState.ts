import { useState, useEffect } from 'react';
import { City, Country, MAP_STYLES, COLOR_SCHEMES } from '../types';
import { loadCountryData } from '../utils';

export function useMapState(cities: City[]) {
  const [countries, setCountries] = useState<Record<string, Country>>({});
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [selectedMapStyle, setSelectedMapStyle] = useState<keyof typeof MAP_STYLES>('light');
  const [selectedColorScheme, setSelectedColorScheme] = useState<keyof typeof COLOR_SCHEMES>('green');

  useEffect(() => {
    const loadCountries = async () => {
      const countryData = await loadCountryData(cities);
      setCountries(countryData);
    };

    loadCountries();
  }, [cities]);

  const handleCityClick = (city: City) => {
    if (city.photos && city.photos.length > 0) {
      setSelectedCity(city);
    }
  };

  const handleCloseGallery = () => {
    setSelectedCity(null);
  };

  return {
    countries,
    selectedCity,
    selectedMapStyle,
    selectedColorScheme,
    setSelectedMapStyle,
    setSelectedColorScheme,
    handleCityClick,
    handleCloseGallery,
  };
} 