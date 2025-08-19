import { useState, useEffect } from 'react';
import { Itinerary } from '../types';
import { getItineraryIndex } from '../utils/itineraryUtils';

export function useItineraries() {
  const [itineraries, setItineraries] = useState<Itinerary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadItineraries() {
      try {
        const itineraryIndexes = await getItineraryIndex();
        // Convert index entries to Itinerary objects for compatibility
        const itinerariesFromIndex = itineraryIndexes.map(index => ({
          id: index.id,
          title: index.title,
          startDate: index.startDate,
          endDate: index.endDate,
          description: index.description,
          image: index.image,
          points: [], // We don't load points for the list view
          metadata: index.metadata,
          galleries: index.galleries,
        }));
        setItineraries(itinerariesFromIndex);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    loadItineraries();
  }, []);

  return { itineraries, loading, error };
}
