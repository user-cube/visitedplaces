import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Itinerary, ItineraryPoint } from '../types';

interface ItineraryMapProps {
  itinerary: Itinerary;
}

export default function ItineraryMap({ itinerary }: ItineraryMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Initialize map
    const map = L.map(mapRef.current, {
      attributionControl: false, // Disable default attribution
    }).setView([47.4979, 19.0402], 10);
    mapInstanceRef.current = map;

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(map);

    // Add zoom control to bottom right
    L.control
      .zoom({
        position: 'bottomright',
      })
      .addTo(map);

    // Add attribution to bottom right (commented out to remove the message)
    // const attributionControl = L.control
    //   .attribution({
    //     position: 'bottomright',
    //   })
    //   .addTo(map);

    // Add custom recenter control
    const recenterControl = L.Control.extend({
      onAdd: function () {
        const container = L.DomUtil.create(
          'div',
          'leaflet-bar leaflet-control'
        );
        const button = L.DomUtil.create(
          'a',
          'leaflet-control-zoom-in',
          container
        );
        button.innerHTML = '📍';
        button.title = 'Recenter to itinerary';
        button.style.fontSize = '16px';
        button.style.lineHeight = '30px';
        button.style.textAlign = 'center';

        L.DomEvent.on(button, 'click', function () {
          if (routePoints.length > 1) {
            const group = L.featureGroup(markers);
            map.fitBounds(group.getBounds().pad(0.1));
          }
        });

        return container;
      },
    });

    new recenterControl({ position: 'bottomright' }).addTo(map);

    // Create markers and route
    const markers: L.Marker[] = [];
    const routePoints: [number, number][] = [];

    itinerary.points.forEach((point: ItineraryPoint, index: number) => {
      const [lng, lat] = point.coordinates;
      routePoints.push([lat, lng]);

      // Create custom icon
      const customIcon = L.divIcon({
        className: 'custom-marker',
        html: `
          <div class="marker-content">
            <div class="marker-number">${index + 1}</div>
            <div class="marker-tooltip">${point.name}</div>
          </div>
        `,
        iconSize: [30, 30],
        iconAnchor: [15, 15],
        popupAnchor: [0, -15],
      });

      // Create marker
      const marker = L.marker([lat, lng], { icon: customIcon }).addTo(map)
        .bindPopup(`
          <div class="popup-content">
            <h3 class="font-semibold text-lg mb-2">${point.name}</h3>
            <p class="text-gray-600 text-sm mb-2">${point.address}</p>
            <p class="text-gray-500 text-xs mb-2">Date: ${new Date(point.date).toLocaleDateString('en-US')}</p>
            ${point.category ? `<span class="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">${point.category}</span>` : ''}
          </div>
        `);

      markers.push(marker);
    });

    // Draw route line
    if (routePoints.length > 1) {
      L.polyline(routePoints, {
        color: '#3B82F6',
        weight: 4,
        opacity: 0.8,
        dashArray: '10, 10',
      }).addTo(map);

      // Fit map to show all markers
      const group = L.featureGroup(markers);
      map.fitBounds(group.getBounds().pad(0.1));
    }

    // Add custom CSS for markers
    const style = document.createElement('style');
    style.textContent = `
      .custom-marker {
        background: transparent;
        border: none;
      }

      .marker-content {
        position: relative;
        width: 30px;
        height: 30px;
        background: #3B82F6;
        border: 3px solid white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        cursor: pointer;
        transition: all 0.2s ease;
      }

      .marker-content:hover {
        transform: scale(1.1);
        background: #2563EB;
      }

      .marker-number {
        color: white;
        font-weight: bold;
        font-size: 12px;
      }

      .marker-tooltip {
        position: absolute;
        bottom: 100%;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(0,0,0,0.8);
        color: white;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 12px;
        white-space: nowrap;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.2s ease;
        margin-bottom: 5px;
      }

      .marker-content:hover .marker-tooltip {
        opacity: 1;
      }

      .popup-content {
        min-width: 200px;
      }
    `;
    document.head.appendChild(style);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
      document.head.removeChild(style);
    };
  }, [itinerary]);

  return (
    <div
      ref={mapRef}
      className="w-full h-full"
      style={{ height: 'calc(100vh - 64px)' }}
    />
  );
}
