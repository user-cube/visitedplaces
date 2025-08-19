import { Itinerary, ItineraryMetadata } from '../types';

export interface ItineraryIndex {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  description: string;
  image?: string;
  file: string;
  metadata?: ItineraryMetadata;
  galleries?: string[];
}

export interface ItineraryIndexData {
  itineraries: ItineraryIndex[];
}

/**
 * Load all itineraries from the new file structure
 */
export async function loadAllItineraries(): Promise<Itinerary[]> {
  try {
    // Load the index file
    const indexResponse = await fetch('/data/itineraries/index.json');
    if (!indexResponse.ok) {
      throw new Error('Failed to load itineraries index');
    }

    const indexData: ItineraryIndexData = await indexResponse.json();
    const loadedItineraries: Itinerary[] = [];

    // Load each individual itinerary file
    for (const itineraryIndex of indexData.itineraries) {
      try {
        const itineraryResponse = await fetch(
          `/data/itineraries/${itineraryIndex.file}`
        );
        if (itineraryResponse.ok) {
          const itineraryData: Itinerary = await itineraryResponse.json();
          loadedItineraries.push(itineraryData);
        } else {
          console.warn(`Failed to load itinerary: ${itineraryIndex.file}`);
        }
      } catch (err) {
        console.warn(`Error loading itinerary ${itineraryIndex.file}:`, err);
      }
    }

    return loadedItineraries;
  } catch (error) {
    console.error('Error loading itineraries:', error);
    throw error;
  }
}

/**
 * Load a specific itinerary by ID
 */
export async function loadItineraryById(id: string): Promise<Itinerary | null> {
  try {
    // First, find the itinerary in the index
    const indexResponse = await fetch('/data/itineraries/index.json');
    if (!indexResponse.ok) {
      throw new Error('Failed to load itineraries index');
    }

    const indexData: ItineraryIndexData = await indexResponse.json();
    const itineraryIndex = indexData.itineraries.find(item => item.id === id);

    if (!itineraryIndex) {
      return null;
    }

    // Load the specific itinerary file
    const itineraryResponse = await fetch(
      `/data/itineraries/${itineraryIndex.file}`
    );
    if (!itineraryResponse.ok) {
      throw new Error(`Failed to load itinerary: ${itineraryIndex.file}`);
    }

    const itineraryData: Itinerary = await itineraryResponse.json();
    return itineraryData;
  } catch (error) {
    console.error(`Error loading itinerary ${id}:`, error);
    throw error;
  }
}

/**
 * Get itinerary index data (metadata only, without full details)
 */
export async function getItineraryIndex(): Promise<ItineraryIndex[]> {
  try {
    const indexResponse = await fetch('/data/itineraries/index.json');
    if (!indexResponse.ok) {
      throw new Error('Failed to load itineraries index');
    }

    const indexData: ItineraryIndexData = await indexResponse.json();
    return indexData.itineraries;
  } catch (error) {
    console.error('Error loading itinerary index:', error);
    throw error;
  }
}

/**
 * Generate a filename for a new itinerary based on title and date
 */
export function generateItineraryFilename(
  title: string,
  startDate: string
): string {
  const year = new Date(startDate).getFullYear();
  const sanitizedTitle = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();

  return `${year}/${sanitizedTitle}.json`;
}

/**
 * Get the year from a date string
 */
export function getYearFromDate(dateString: string): string {
  return new Date(dateString).getFullYear().toString();
}
