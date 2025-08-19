import { useState, useEffect } from 'react';
import { Gallery } from '../types';
import { getGalleryIndex } from '../utils/galleryUtils';

export function useGalleries() {
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const index = await getGalleryIndex();
        const mapped = index.map(item => ({
          id: item.id,
          title: item.title,
          description: item.description,
          image: item.image,
          photos: [],
          tags: item.tags,
          year: item.year,
          location: item.location,
          // carry count into runtime object for list display
          // optional: used only on the list page; detail page loads full file
          // @ts-expect-error allow extra property for convenience
          photosCount: item.photosCount,
        }));
        setGalleries(mapped);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return { galleries, loading, error };
}
