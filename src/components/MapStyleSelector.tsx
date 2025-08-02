import { MAP_STYLES } from '../types';
import { getMapStylePreviewUrl } from '../utils/mapUtils';

interface MapStyleSelectorProps {
  selectedStyle: keyof typeof MAP_STYLES;
  onStyleChange: (style: keyof typeof MAP_STYLES) => void;
}

export function MapStyleSelector({
  selectedStyle,
  onStyleChange,
}: MapStyleSelectorProps) {
  return (
    <div className="map-style-selector">
      <label className="map-style-label">🗺️ Map Style</label>

      <div className="map-style-grid">
        {Object.entries(MAP_STYLES).map(([key, style]) => (
          <div
            key={key}
            onClick={() => onStyleChange(key as keyof typeof MAP_STYLES)}
            className={`map-style-thumbnail ${selectedStyle === key ? 'selected' : ''}`}
            title={`${style.name} map style`}
          >
            <div
              className="map-style-thumbnail-image"
              style={{
                backgroundImage: `url("${getMapStylePreviewUrl(key as keyof typeof MAP_STYLES)}")`,
              }}
            />
            <div className="map-style-name">{style.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
