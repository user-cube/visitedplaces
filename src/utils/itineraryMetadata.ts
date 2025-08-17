import { Itinerary, ItineraryMetadata } from '../types';

// Country to flag mapping
const COUNTRY_FLAGS: Record<string, string> = {
  'Hungary': '🇭🇺',
  'Austria': '🇦🇹',
  'France': '🇫🇷',
  'United Kingdom': '🇬🇧',
  'Italy': '🇮🇹',
  'Spain': '🇪🇸',
  'Germany': '🇩🇪',
  'Netherlands': '🇳🇱',
  'Czech Republic': '🇨🇿',
  'Czechia': '🇨🇿',
  'Portugal': '🇵🇹',
  'Switzerland': '🇨🇭',
  'Belgium': '🇧🇪',
  'Denmark': '🇩🇰',
  'Sweden': '🇸🇪',
  'Norway': '🇳🇴',
  'Finland': '🇫🇮',
  'Ireland': '🇮🇪',
  'Poland': '🇵🇱',
  'Greece': '🇬🇷',
  'Croatia': '🇭🇷',
  'Slovenia': '🇸🇮',
  'Slovakia': '🇸🇰',
  'Romania': '🇷🇴',
  'Bulgaria': '🇧🇬',
  'Serbia': '🇷🇸',
  'Bosnia and Herzegovina': '🇧🇦',
  'Montenegro': '🇲🇪',
  'Albania': '🇦🇱',
  'North Macedonia': '🇲🇰',
  'Kosovo': '🇽🇰',
  'Moldova': '🇲🇩',
  'Ukraine': '🇺🇦',
  'Belarus': '🇧🇾',
  'Lithuania': '🇱🇹',
  'Latvia': '🇱🇻',
  'Estonia': '🇪🇪',
  'Russia': '🇷🇺',
  'Turkey': '🇹🇷',
  'Cyprus': '🇨🇾',
  'Malta': '🇲🇹',
  'Iceland': '🇮🇸',
  'Luxembourg': '🇱🇺',
  'Liechtenstein': '🇱🇮',
  'Monaco': '🇲🇨',
  'San Marino': '🇸🇲',
  'Vatican City': '🇻🇦',
  'Andorra': '🇦🇩',
};

// Country to emoji mapping
const COUNTRY_EMOJIS: Record<string, string> = {
  'Hungary': '🏛️',
  'Austria': '🎭',
  'France': '🗼',
  'United Kingdom': '🇬🇧',
  'Italy': '🏛️',
  'Spain': '🌞',
  'Germany': '🏛️',
  'Netherlands': '🌷',
  'Czech Republic': '🏰',
  'Czechia': '🏰',
  'Portugal': '🍷',
  'Switzerland': '🏔️',
  'Belgium': '🍫',
  'Denmark': '🧜‍♀️',
  'Sweden': '🏰',
  'Norway': '❄️',
  'Finland': '🎅',
  'Ireland': '🍺',
  'Poland': '🏰',
  'Greece': '🏛️',
  'Croatia': '🏖️',
  'Slovenia': '🏔️',
  'Slovakia': '🏰',
  'Romania': '🏰',
  'Bulgaria': '🌹',
  'Serbia': '🏰',
  'Bosnia and Herzegovina': '🏔️',
  'Montenegro': '🏔️',
  'Albania': '🏔️',
  'North Macedonia': '🏔️',
  'Kosovo': '🏔️',
  'Moldova': '🍇',
  'Ukraine': '🌻',
  'Belarus': '🌲',
  'Lithuania': '🏰',
  'Latvia': '🌲',
  'Estonia': '🌲',
  'Russia': '🏰',
  'Turkey': '🕌',
  'Cyprus': '🏖️',
  'Malta': '🏰',
  'Iceland': '🌋',
  'Luxembourg': '🏰',
  'Liechtenstein': '🏔️',
  'Monaco': '🏎️',
  'San Marino': '🏰',
  'Vatican City': '⛪',
  'Andorra': '🏔️',
};

/**
 * Extract countries from itinerary points
 */
export function extractCountriesFromItinerary(itinerary: Itinerary): string[] {
  const countries = new Set<string>();
  
  itinerary.points.forEach(point => {
    // Try to extract country from address
    const addressParts = point.address.split(',').map(part => part.trim());
    const lastPart = addressParts[addressParts.length - 1];
    
    if (lastPart && COUNTRY_FLAGS[lastPart]) {
      countries.add(lastPart);
    }
  });
  
  return Array.from(countries);
}

/**
 * Generate flags string from countries
 */
export function generateFlagsFromCountries(countries: string[]): string {
  return countries
    .map(country => COUNTRY_FLAGS[country] || '🌍')
    .join(' ');
}

/**
 * Generate emoji from countries (use the first country's emoji)
 */
export function generateEmojiFromCountries(countries: string[]): string {
  if (countries.length === 0) return '✈️';
  
  const firstCountry = countries[0];
  return COUNTRY_EMOJIS[firstCountry] || '✈️';
}

/**
 * Generate metadata for an itinerary
 */
export function generateItineraryMetadata(itinerary: Itinerary): ItineraryMetadata {
  const countries = extractCountriesFromItinerary(itinerary);
  
  return {
    flags: generateFlagsFromCountries(countries),
    emoji: generateEmojiFromCountries(countries),
    countries
  };
}

/**
 * Add metadata to an itinerary if it doesn't exist
 */
export function ensureItineraryMetadata(itinerary: Itinerary): Itinerary {
  if (itinerary.metadata) {
    return itinerary;
  }
  
  return {
    ...itinerary,
    metadata: generateItineraryMetadata(itinerary)
  };
}
