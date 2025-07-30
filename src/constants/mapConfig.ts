// Map center coordinates (Paris, France)
export const MAP_CENTER: [number, number] = [48.8566, 2.3522];

// Default zoom level
export const DEFAULT_ZOOM = 5;

// Map bounds
export const MAP_BOUNDS: [[number, number], [number, number]] = [
  [-90, -180],
  [90, 180],
];

// Map configuration
export const MAP_CONFIG = {
  worldCopyJump: true,
  minZoom: 2,
  maxZoom: 18,
  maxBoundsViscosity: 1.0,
  zoomControl: true,
  attributionControl: false,
  bounceAtZoomLimits: false,
  zoomAnimation: true,
  zoomAnimationThreshold: 10,
};

// Tile layer configuration
export const TILE_CONFIG = {
  noWrap: false,
  tileSize: 256,
  zoomOffset: 0,
  updateWhenZooming: true,
  updateWhenIdle: true,
};

// Container styles
export const CONTAINER_STYLES = {
  height: '100vh',
  width: '100vw',
  position: 'absolute' as const,
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  overflow: 'hidden',
  margin: 0,
  padding: 0,
};

export const MAP_CONTAINER_STYLES = {
  ...CONTAINER_STYLES,
  backgroundColor: '#f8f9fa',
}; 