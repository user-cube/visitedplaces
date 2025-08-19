import { Gallery, GalleryLocation } from '../types';

export interface GalleryIndexItem {
  id: string;
  title: string;
  description?: string;
  image?: string;
  file: string;
  tags?: string[];
  year?: number;
  location?: GalleryLocation;
}

export interface GalleryIndexData {
  galleries: GalleryIndexItem[];
}

export async function getGalleryIndex(): Promise<GalleryIndexItem[]> {
  const response = await fetch('/data/galleries/index.json');
  if (!response.ok) throw new Error('Failed to load galleries index');
  const data: GalleryIndexData = await response.json();
  return data.galleries;
}

export async function loadGalleryById(id: string): Promise<Gallery | null> {
  const index = await getGalleryIndex();
  const match = index.find(g => g.id === id);
  if (!match) return null;
  const response = await fetch(`/data/galleries/${match.file}`);
  if (!response.ok) throw new Error(`Failed to load gallery: ${match.file}`);
  const data: Gallery = await response.json();
  return data;
}

export async function loadAllGalleries(): Promise<Gallery[]> {
  const index = await getGalleryIndex();
  const galleries: Gallery[] = [];
  for (const item of index) {
    try {
      const resp = await fetch(`/data/galleries/${item.file}`);
      if (resp.ok) {
        galleries.push(await resp.json());
      }
    } catch {}
  }
  return galleries;
}
