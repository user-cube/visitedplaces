import { MAP_STYLES } from '../types';

interface MapStyleSelectorProps {
  selectedStyle: keyof typeof MAP_STYLES;
  onStyleChange: (style: keyof typeof MAP_STYLES) => void;
}

export function MapStyleSelector({
  selectedStyle,
  onStyleChange,
}: MapStyleSelectorProps) {
  return (
    <div style={{ marginBottom: '16px' }}>
      <label
        style={{
          fontSize: '11px',
          fontWeight: '600',
          marginBottom: '8px',
          display: 'block',
          color: '#374151',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
        }}
      >
        🗺️ Map Style
      </label>

      {/* Map Style Preview Thumbnails */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '6px',
        }}
      >
        {Object.entries(MAP_STYLES).map(([key, style]) => (
          <div
            key={key}
            onClick={() => onStyleChange(key as keyof typeof MAP_STYLES)}
            style={{
              width: '100%',
              height: '32px',
              borderRadius: '6px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              transform: selectedStyle === key ? 'scale(1.05)' : 'scale(1)',
              boxShadow:
                selectedStyle === key
                  ? '0 2px 8px rgba(0, 0, 0, 0.2)'
                  : '0 1px 3px rgba(0, 0, 0, 0.1)',
              border:
                selectedStyle === key
                  ? '2px solid #3B82F6'
                  : '1px solid #E5E7EB',
              position: 'relative',
              overflow: 'hidden',
            }}
            title={`${style.name} map style`}
          >
            {/* Map style preview images */}
            <div
              style={{
                width: '100%',
                height: '100%',
                backgroundImage:
                  key === 'standard'
                    ? 'url("https://tile.openstreetmap.org/5/16/10.png")'
                    : key === 'dark'
                      ? 'url("https://cartodb-basemaps-a.global.ssl.fastly.net/dark_all/5/16/10.png")'
                      : key === 'light'
                        ? 'url("https://cartodb-basemaps-a.global.ssl.fastly.net/light_all/5/16/10.png")'
                        : key === 'satellite'
                          ? 'url("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/5/10/16")'
                          : key === 'terrain'
                            ? 'url("https://tile.opentopomap.org/5/16/10.png")'
                            : key === 'vintage'
                              ? 'url("https://stamen-tiles.a.ssl.fastly.net/watercolor/5/16/10.jpg")'
                              : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
              }}
            />

            {/* Style name overlay */}
            <div
              style={{
                position: 'absolute',
                bottom: '0',
                left: '0',
                right: '0',
                background: 'rgba(0, 0, 0, 0.7)',
                color: 'white',
                fontSize: '8px',
                padding: '2px 4px',
                textAlign: 'center',
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              {style.name}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
