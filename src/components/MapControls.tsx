import React from 'react';
import { MapStyleSelector, ColorSchemeSelector } from './';
import { MAP_STYLES, COLOR_SCHEMES } from '../types';
import { getMapStylePreviewUrl } from '../utils/mapUtils';

interface MapControlsProps {
  selectedMapStyle: keyof typeof MAP_STYLES;
  selectedColorScheme: keyof typeof COLOR_SCHEMES;
  onMapStyleChange: (style: keyof typeof MAP_STYLES) => void;
  onColorSchemeChange: (scheme: keyof typeof COLOR_SCHEMES) => void;
}

export function MapControls({
  selectedMapStyle,
  selectedColorScheme,
  onMapStyleChange,
  onColorSchemeChange,
}: MapControlsProps) {
  const [isExpanded, setIsExpanded] = React.useState(() => {
    // Check if we're on mobile (screen width < 768px)
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 768;
    }
    return true; // Default to expanded on server-side
  });

  // Listen for window resize to update the state
  React.useEffect(() => {
    const handleResize = () => {
      const shouldBeExpanded = window.innerWidth >= 768;
      setIsExpanded(shouldBeExpanded);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const mapPreviewUrl = getMapStylePreviewUrl(selectedMapStyle);

  return (
    <div className={`map-controls ${isExpanded ? 'expanded' : 'collapsed'}`}>
      <div
        className={`map-controls-header ${isExpanded ? 'expanded' : 'collapsed'}`}
        onClick={!isExpanded ? () => setIsExpanded(true) : undefined}
        style={!isExpanded ? { cursor: 'pointer' } : {}}
      >
        {!isExpanded && (
          <div className="map-preview-container">
            <div
              className="map-style-preview"
              style={{ backgroundImage: `url('${mapPreviewUrl}')` }}
            />
          </div>
        )}
        {isExpanded && (
          <button
            onClick={() => setIsExpanded(false)}
            className="toggle-button"
            title="Minimize"
          >
            −
          </button>
        )}
      </div>

      <div
        className={`map-controls-content ${isExpanded ? 'expanded' : 'collapsed'}`}
      >
        <MapStyleSelector
          selectedStyle={selectedMapStyle}
          onStyleChange={onMapStyleChange}
        />

        <ColorSchemeSelector
          selectedScheme={selectedColorScheme}
          onSchemeChange={onColorSchemeChange}
        />
      </div>
    </div>
  );
}
