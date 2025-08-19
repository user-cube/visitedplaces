export interface City {
  city: string;
  country: string;
  coordinates: [number, number];
  photos?: string[];
}

export interface VisitedData {
  visited: City[];
}

export interface GeoJSONFeature {
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

export interface Country {
  name: string;
  geojson: GeoJSONFeature;
  cities: City[];
}

export interface MapProps {
  cities: City[];
}

export interface MapStyle {
  name: string;
  url: string;
  attribution: string;
}

export interface ColorScheme {
  name: string;
  countryBorder: string;
  countryFill: string;
  countryFillOpacity: number;
  cityBorder: string;
  cityFill: string;
  cityFillOpacity: number;
}

export interface MapControlsProps {
  selectedMapStyle: keyof typeof MAP_STYLES;
  selectedColorScheme: keyof typeof COLOR_SCHEMES;
  onMapStyleChange: (style: keyof typeof MAP_STYLES) => void;
  onColorSchemeChange: (scheme: keyof typeof COLOR_SCHEMES) => void;
}

export interface RecenterButtonProps {
  onRecenter: () => void;
}

export interface MapStyleSelectorProps {
  selectedStyle: keyof typeof MAP_STYLES;
  onStyleChange: (style: keyof typeof MAP_STYLES) => void;
}

export interface ColorSchemeSelectorProps {
  selectedScheme: keyof typeof COLOR_SCHEMES;
  onSchemeChange: (scheme: keyof typeof COLOR_SCHEMES) => void;
}

export interface CountryLayerProps {
  countries: Record<string, Country>;
  colorScheme: ColorScheme;
}

export interface CityMarkersProps {
  cities: City[];
  colorScheme: ColorScheme;
  onCityClick: (city: City) => void;
}

export interface ItineraryPoint {
  name: string;
  address: string;
  date: string;
  phone?: string;
  website?: string;
  coordinates: [number, number];
  category?: string;
  description?: string;
}

export interface ItineraryMetadata {
  flags: string;
  emoji: string;
  countries: string[];
  pointsCount: number;
}

export interface Itinerary {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  points: ItineraryPoint[];
  description?: string;
  image?: string;
  metadata?: ItineraryMetadata;
  notes?: string[];
  links?: Array<{
    label: string;
    url: string;
  }>;
  /** Optional list of related gallery IDs */
  galleries?: string[];
}

export interface ItineraryListProps {
  itineraries: Itinerary[];
  onItinerarySelect: (itinerary: Itinerary) => void;
}

export interface ItineraryMapProps {
  itinerary: Itinerary;
}

export interface ItinerarySidebarProps {
  itinerary: Itinerary;
  onClose: () => void;
}

// Gallery types
export interface GalleryLocation {
  city?: string;
  country?: string;
  flag?: string;
}

export interface GalleryPhoto {
  src: string;
  caption?: string;
}

export interface Gallery {
  id: string;
  title: string;
  description?: string;
  image?: string; // cover image
  photos: Array<string | GalleryPhoto>;
  location?: GalleryLocation;
  tags?: string[];
  year?: number;
  /** Optional, available on list views when provided by the index */
  photosCount?: number;
}

// Map styles configuration
export const MAP_STYLES: Record<string, MapStyle> = {
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
export const COLOR_SCHEMES: Record<string, ColorScheme> = {
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
