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
      className="recenter-button"
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
