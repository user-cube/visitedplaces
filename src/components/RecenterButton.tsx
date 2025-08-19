import { useMap } from 'react-leaflet';
import { useCallback, useEffect } from 'react';
import { MAP_CENTER, DEFAULT_ZOOM } from '../constants';
import { setGlobalRecenter } from './RecenterBridge';

interface RecenterButtonProps {
  onRecenter: () => void;
}

// No module-scoped state; use bridge instead

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
    setGlobalRecenter(handleRecenter);
    return () => setGlobalRecenter(null);
  }, [handleRecenter]);

  return null; // This component doesn't render anything, it just provides the function
}

// UI Button component for the control panel
export function RecenterButtonUI({ onRecenter }: RecenterButtonProps) {
  return (
    <button
      onClick={onRecenter}
      className="recenter-button"
      title="Recenter map to Europe"
    >
      🎯 Recenter
    </button>
  );
}

// Function to trigger recenter from outside
export { triggerRecenter } from './RecenterBridge';
