import { useMap } from 'react-leaflet';
import { useEffect } from 'react';
import L from 'leaflet';
import { MAP_CENTER, DEFAULT_ZOOM } from '../constants';

interface CustomZoomControlProps {
  position: 'topleft' | 'topright' | 'bottomleft' | 'bottomright';
}

export function CustomZoomControl({ position }: CustomZoomControlProps) {
  const map = useMap();

  useEffect(() => {
    const CustomControl = L.Control.extend({
      onAdd: function () {
        const container = L.DomUtil.create(
          'div',
          'leaflet-bar leaflet-control'
        );

        // Zoom in button
        const zoomIn = L.DomUtil.create(
          'a',
          'leaflet-control-zoom-in',
          container
        );
        zoomIn.innerHTML = '+';
        zoomIn.title = 'Zoom in';
        zoomIn.href = '#';

        L.DomEvent.on(zoomIn, 'click', function (e) {
          L.DomEvent.stopPropagation(e);
          L.DomEvent.preventDefault(e);
          map.zoomIn();
        });

        // Zoom out button
        const zoomOut = L.DomUtil.create(
          'a',
          'leaflet-control-zoom-out',
          container
        );
        zoomOut.innerHTML = '−';
        zoomOut.title = 'Zoom out';
        zoomOut.href = '#';

        L.DomEvent.on(zoomOut, 'click', function (e) {
          L.DomEvent.stopPropagation(e);
          L.DomEvent.preventDefault(e);
          map.zoomOut();
        });

        // Recenter button
        const recenter = L.DomUtil.create(
          'a',
          'leaflet-control-zoom-in',
          container
        );
        recenter.innerHTML = '🎯';
        recenter.title = 'Recenter map to Europe';
        recenter.href = '#';
        recenter.style.fontSize = '16px';
        recenter.style.lineHeight = '30px';
        recenter.style.textAlign = 'center';

        L.DomEvent.on(recenter, 'click', function (e) {
          L.DomEvent.stopPropagation(e);
          L.DomEvent.preventDefault(e);
          map.setView(MAP_CENTER, DEFAULT_ZOOM, {
            animate: true,
            duration: 1,
          });
        });

        return container;
      },
    });

    const customControl = new CustomControl({ position });
    customControl.addTo(map);

    return () => {
      map.removeControl(customControl);
    };
  }, [map, position]);

  return null;
}
