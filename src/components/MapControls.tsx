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
        minWidth: '200px',
      }}
    >
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
  );
}
