import { useCallback } from 'react';
import { triggerRecenter } from '../components';

export function useRecenter() {
  const handleRecenter = useCallback(() => {
    triggerRecenter();
  }, []);

  return { handleRecenter };
}
