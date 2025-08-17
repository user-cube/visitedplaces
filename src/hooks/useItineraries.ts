import { useState, useEffect } from 'react';
import { Itinerary } from '../types';

export function useItineraries() {
  const [itineraries, setItineraries] = useState<Itinerary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadItineraries() {
      try {
        const response = await fetch('/data/itineraries.json');
        if (!response.ok) {
          throw new Error('Failed to load itineraries');
        }
        const data = await response.json();
        setItineraries(data.itineraries || []);
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
