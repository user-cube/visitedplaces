import { useCallback } from 'react';
import { triggerRecenter } from '../components/RecenterBridge';

export function useRecenter() {
  const handleRecenter = useCallback(() => {
    triggerRecenter();
  }, []);

  return { handleRecenter };
}
