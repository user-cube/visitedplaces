import { MAP_STYLES } from '../types';

export function getMapStylePreviewUrl(styleKey: keyof typeof MAP_STYLES): string {
  const previewUrls = {
    standard: 'https://a.tile.openstreetmap.org/5/16/10.png',
    dark: 'https://a.basemaps.cartocdn.com/dark_all/5/16/10.png',
    light: 'https://a.basemaps.cartocdn.com/light_all/5/16/10.png',
    satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/5/10/16',
    terrain: 'https://a.tile.opentopomap.org/5/16/10.png',
    vintage: 'https://a.tile.stamen.com/watercolor/5/16/10.jpg'
  };
  
  return previewUrls[styleKey] || previewUrls.standard;
} 