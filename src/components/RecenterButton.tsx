import { useMap } from 'react-leaflet';
import { useCallback, useEffect } from 'react';
import { MAP_CENTER, DEFAULT_ZOOM } from '../constants';

interface RecenterButtonProps {
  onRecenter: () => void;
}

// Global variable to store the recenter function
let globalRecenterFunction: (() => void) | null = null;

// Component to handle map recentering (inside MapContainer)
export function RecenterButton() {
  const map = useMap();

  const handleRecenter = useCallback(() => {
    map.setView(MAP_CENTER, DEFAULT_ZOOM, {
      animate: true,
      duration: 1,
    });
  }, [map]);

  useEffect(() => {
    globalRecenterFunction = handleRecenter;
  }, [handleRecenter]);

  return null; // This component doesn't render anything, it just provides the function
}

// UI Button component for the control panel
export function RecenterButtonUI({ onRecenter }: RecenterButtonProps) {
  return (
    <button
      onClick={onRecenter}
      style={{
        width: '100%',
        padding: '8px 12px',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        border: '1px solid rgba(59, 130, 246, 0.2)',
        borderRadius: '6px',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        fontSize: '11px',
        fontWeight: '600',
        color: '#3B82F6',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '6px',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.2)';
        e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.3)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.1)';
        e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.2)';
      }}
      title="Recenter map to Europe"
    >
      🎯 Recenter
    </button>
  );
}

// Function to trigger recenter from outside
export function triggerRecenter() {
  globalRecenterFunction?.();
}
