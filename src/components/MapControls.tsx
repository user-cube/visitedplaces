import React from 'react';
import { MapStyleSelector, ColorSchemeSelector, RecenterButtonUI } from './';
import { MAP_STYLES, COLOR_SCHEMES } from '../types';

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
  const [isExpanded, setIsExpanded] = React.useState(true);

  return (
    <div
      style={{
        position: 'absolute',
        top: '15px',
        right: '15px',
        zIndex: 1000,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderRadius: '12px',
        padding: '16px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        minWidth: isExpanded ? '200px' : 'auto',
        transition: 'min-width 0.3s ease',
      }}
    >
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: isExpanded ? '12px' : '0',
        gap: '8px'
      }}>
        {!isExpanded && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            {/* Map Style Preview */}
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '6px',
              cursor: 'default',
              border: '1px solid rgba(0,0,0,0.1)',
              backgroundImage: `url('${selectedMapStyle === 'standard' ? 'https://a.tile.openstreetmap.org/5/16/10.png' :
                  selectedMapStyle === 'dark' ? 'https://a.basemaps.cartocdn.com/dark_all/5/16/10.png' :
                    selectedMapStyle === 'light' ? 'https://a.basemaps.cartocdn.com/light_all/5/16/10.png' :
                      selectedMapStyle === 'satellite' ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/5/10/16' :
                        selectedMapStyle === 'terrain' ? 'https://a.tile.opentopomap.org/5/16/10.png' :
                          'https://a.tile.stamen.com/watercolor/5/16/10.jpg'
                }')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center center',
              backgroundRepeat: 'no-repeat',
              filter: 'none'
            }} />
            {/* Color Scheme Preview */}
            <div style={{
              width: '20px',
              height: '20px',
              borderRadius: '4px',
              backgroundColor: COLOR_SCHEMES[selectedColorScheme].countryFill,
              border: `2px solid ${COLOR_SCHEMES[selectedColorScheme].countryBorder}`,
              transition: 'all 0.2s ease',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              position: 'relative'
            }}>
              <div style={{
                position: 'absolute',
                top: '2px',
                right: '2px',
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: COLOR_SCHEMES[selectedColorScheme].cityFill,
                border: `1px solid ${COLOR_SCHEMES[selectedColorScheme].cityBorder}`
              }} />
            </div>
          </div>
        )}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '20px',
            padding: '4px',
            color: '#666',
          }}
          title={isExpanded ? 'Minimizar' : 'Expandir'}
        >
          {isExpanded ? '−' : '+'}
        </button>
      </div>

      <div style={{
        display: isExpanded ? 'block' : 'none',
        opacity: isExpanded ? 1 : 0,
        transition: 'opacity 0.3s ease',
      }}>
        <MapStyleSelector
          selectedStyle={selectedMapStyle}
          onStyleChange={onMapStyleChange}
        />

        <ColorSchemeSelector
          selectedScheme={selectedColorScheme}
          onSchemeChange={onColorSchemeChange}
        />

        {/* Recenter Button */}
        <div style={{ marginTop: '12px' }}>
          <RecenterButtonUI onRecenter={onRecenter} />
        </div>
      </div>
    </div>
  );
}
