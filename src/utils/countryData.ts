import { City, Country, GeoJSONFeature } from '../types';

// Alternative country names mapping
const ALTERNATIVE_NAMES: Record<string, string> = {
  Spain: 'España',
  Germany: 'Deutschland',
  Italy: 'Italia',
  Netherlands: 'Nederland',
  Switzerland: 'Schweiz',
  'Czech Republic': 'Czechia',
  'United Kingdom': 'United Kingdom of Great Britain and Northern Ireland',
  'Vatican City': 'Vatican',
};

// European countries that need special filtering
const EUROPEAN_COUNTRIES = [
  'France',
  'Spain',
  'Portugal',
  'Italy',
  'Germany',
  'Netherlands',
  'Belgium',
  'Switzerland',
  'Austria',
  'Vatican City',
];

/**
 * Calculate the centroid of a geometry
 */
function calculateCentroid(coordinates: unknown): { lat: number; lon: number } | null {
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

  extractCoords(coordinates);

  if (pointCount === 0) return null;

  return {
    lon: totalLon / pointCount,
    lat: totalLat / pointCount,
  };
}

/**
 * Check if a point is within Europe boundaries
 */
function isInEurope(lat: number, lon: number): boolean {
  return lon >= -10 && lon <= 30 && lat >= 35 && lat <= 70;
}

/**
 * Find the best GeoJSON feature for a country
 */
function findBestFeature(
  features: GeoJSONFeature[],
  countryName: string
): GeoJSONFeature | null {
  if (features.length === 0) return null;

  // For European countries, try to find the feature that is in Europe
  if (EUROPEAN_COUNTRIES.includes(countryName)) {
    const europeanFeature = features.find((feature) => {
      try {
        const centroid = calculateCentroid(feature.geometry.coordinates);
        return centroid ? isInEurope(centroid.lat, centroid.lon) : false;
      } catch {
        return false;
      }
    });

    if (europeanFeature) {
      return europeanFeature;
    }
  }

  // Fallback to the first feature
  return features[0];
}

/**
 * Load and process country data
 */
export async function loadCountryData(cities: City[]): Promise<Record<string, Country>> {
  try {
    // Load local GeoJSON data
    const geojsonResponse = await fetch('/countries-features.json');
    const geojsonData: { features: GeoJSONFeature[] } = await geojsonResponse.json();

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

    for (const [countryName, countryCities] of Object.entries(citiesByCountry)) {
      // Find the country in GeoJSON data
      let countryFeatures = geojsonData.features.filter((feature: GeoJSONFeature) => {
        return feature.properties.name === countryName;
      });

      if (countryFeatures.length === 0) {
        // Try alternative names
        const altName = ALTERNATIVE_NAMES[countryName];
        if (altName) {
          countryFeatures = geojsonData.features.filter((feature: GeoJSONFeature) => {
            return feature.properties.name === altName;
          });
        }
      }

      const selectedFeature = findBestFeature(countryFeatures, countryName);

      if (selectedFeature) {
        countryData[countryName] = {
          name: countryName,
          geojson: selectedFeature,
          cities: countryCities,
        };
      }
    }

    return countryData;
  } catch (error) {
    console.error('Error loading countries:', error);
    return {};
  }
} 