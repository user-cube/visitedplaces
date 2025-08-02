import React from 'react';
import { MapStyleSelector, ColorSchemeSelector, RecenterButtonUI } from './';
import { MAP_STYLES, COLOR_SCHEMES } from '../types';
import { getMapStylePreviewUrl } from '../utils/mapUtils';

interface MapControlsProps {
  selectedMapStyle: keyof typeof MAP_STYLES;
  selectedColorScheme: keyof typeof COLOR_SCHEMES;
  onMapStyleChange: (style: keyof typeof MAP_STYLES) => void;
  onColorSchemeChange: (scheme: keyof typeof COLOR_SCHEMES) => void;
  onRecenter: () => void;
}

export function MapControls({
  selectedMapStyle,
  selectedColorScheme,
  onMapStyleChange,
  onColorSchemeChange,
  onRecenter,
}: MapControlsProps) {
  const [isExpanded, setIsExpanded] = React.useState(false);

  const selectedScheme = COLOR_SCHEMES[selectedColorScheme];
  const mapPreviewUrl = getMapStylePreviewUrl(selectedMapStyle);

  return (
    <div className={`map-controls ${isExpanded ? 'expanded' : 'collapsed'}`}>
      <div
        className={`map-controls-header ${isExpanded ? 'expanded' : 'collapsed'}`}
      >
        {!isExpanded && (
          <div className="map-preview-container">
            <div
              className="map-style-preview"
              style={{ backgroundImage: `url('${mapPreviewUrl}')` }}
            />
            <div
              className="color-scheme-preview"
              style={{
                backgroundColor: selectedScheme.countryFill,
                borderColor: selectedScheme.countryBorder,
              }}
            >
              <div
                className="color-scheme-preview-dot"
                style={{
                  backgroundColor: selectedScheme.cityFill,
                  borderColor: selectedScheme.cityBorder,
                }}
              />
            </div>
          </div>
        )}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="toggle-button"
          title={isExpanded ? 'Minimize' : 'Expand'}
        >
          {isExpanded ? '−' : '+'}
        </button>
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

        <div className="recenter-button-container">
          <RecenterButtonUI onRecenter={onRecenter} />
        </div>
      </div>
    </div>
  );
}
