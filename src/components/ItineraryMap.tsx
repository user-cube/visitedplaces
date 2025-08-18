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

    // Initialize map with explicit control positioning
    const map = L.map(mapRef.current, {
      attributionControl: false, // Disable default attribution
      zoomControl: false, // We'll add it manually with specific position
    }).setView([47.4979, 19.0402], 10);
    mapInstanceRef.current = map;

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(map);

    // Add zoom control manually to ensure it appears
    const zoomControl = L.control.zoom({ position: 'bottomright' });
    zoomControl.addTo(map);
    console.log('Zoom control added to map');

    // Force the control to be visible with inline styles
    setTimeout(() => {
      const controlElements = document.querySelectorAll(
        '.leaflet-control-zoom, .leaflet-bar.leaflet-control'
      );
      console.log('Found control elements:', controlElements.length);
      controlElements.forEach(el => {
        const element = el as HTMLElement;
        element.style.display = 'block';
        element.style.visibility = 'visible';
        element.style.opacity = '1';
        element.style.zIndex = '15000';
        element.style.position = 'relative';
        console.log('Applied styles to control element');
      });
    }, 100);

    // Build day→color mapping shared with sidebar via localStorage
    const dates = Array.from(new Set(itinerary.points.map(p => p.date))).sort();
    const storageKey = `itinerary-day-colors::${itinerary.id}`;
    let dayColorMap: Record<string, string> | null = null;
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        dayColorMap = JSON.parse(stored);
      }
    } catch {}

    if (!dayColorMap) {
      const candidateColors = [
        '#667eea',
        '#764ba2',
        '#10B981',
        '#0EA5E9',
        '#F59E0B',
        '#EF4444',
        '#14B8A6',
        '#F472B6',
        '#22C55E',
        '#06B6D4',
        '#A78BFA',
        '#FB923C',
      ];
      const used = new Set<string>();
      dayColorMap = {};
      dates.forEach(d => {
        const available = candidateColors.filter(c => !used.has(c));
        const pick =
          available.length > 0
            ? available[Math.floor(Math.random() * available.length)]
            : candidateColors[
                Math.floor(Math.random() * candidateColors.length)
              ];
        dayColorMap![d] = pick;
        used.add(pick);
      });
      try {
        localStorage.setItem(storageKey, JSON.stringify(dayColorMap));
      } catch {}
    }

    // Create markers and route arrays
    const markers: L.Marker[] = [];
    const routePoints: [number, number][] = [];
    const dayRoutes: Record<string, [number, number][]> = {};

    // Add simple recenter control
    const RecenterControl = L.Control.extend({
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
        button.href = '#';
        button.style.fontSize = '16px';
        button.style.lineHeight = '30px';
        button.style.textAlign = 'center';

        L.DomEvent.on(button, 'click', function (e) {
          L.DomEvent.stopPropagation(e);
          L.DomEvent.preventDefault(e);
          if (routePoints.length > 1) {
            const group = L.featureGroup(markers);
            map.fitBounds(group.getBounds().pad(0.1));
          }
        });

        return container;
      },
    });

    // Add recenter control to bottom right
    new RecenterControl({ position: 'bottomright' }).addTo(map);

    // Jitter overlapping points so they don't cover each other
    function jitterIfClose(
      lat: number,
      lng: number,
      occurrenceIndex: number
    ): [number, number] {
      if (occurrenceIndex === 0) return [lat, lng];
      const meters = 12 + occurrenceIndex * 6; // outward spiral radius in meters
      const angle = (occurrenceIndex * 137.5 * Math.PI) / 180; // golden-angle spiral
      const dLat = (meters * Math.cos(angle)) / 111111; // ~meters per degree
      const dLng =
        (meters * Math.sin(angle)) / (111111 * Math.cos((lat * Math.PI) / 180));
      return [lat + dLat, lng + dLng];
    }

    const coordCount: Record<string, number> = {};

    itinerary.points.forEach((point: ItineraryPoint, index: number) => {
      const [lng, lat] = point.coordinates;
      const key = `${lat.toFixed(5)},${lng.toFixed(5)}`;
      coordCount[key] = (coordCount[key] || 0) + 1;
      const occur = coordCount[key] - 1;
      const [latAdj, lngAdj] = jitterIfClose(lat, lng, occur);
      routePoints.push([latAdj, lngAdj]);
      if (!dayRoutes[point.date]) dayRoutes[point.date] = [];
      dayRoutes[point.date].push([latAdj, lngAdj]);
      const markerColor = (dayColorMap && dayColorMap[point.date]) || '#3B82F6';

      // Create custom icon
      const customIcon = L.divIcon({
        className: 'custom-marker',
        html: `
          <div class="marker-content" style="--marker-bg: ${markerColor}; background: ${markerColor};">
            <div class="marker-number">${index + 1}</div>
            <div class="marker-tooltip">${point.name}</div>
          </div>
        `,
        iconSize: [30, 30],
        iconAnchor: [15, 15],
        popupAnchor: [0, -15],
      });

      // Create marker
      const marker = L.marker([latAdj, lngAdj], { icon: customIcon }).addTo(map)
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

    // Draw per-day colored route segments
    const orderedDates = dates; // already sorted above
    let previousEnd: [number, number] | null = null;
    orderedDates.forEach(d => {
      const seg = dayRoutes[d] || [];
      if (seg.length > 1) {
        L.polyline(seg, {
          color: dayColorMap?.[d] || '#3B82F6',
          weight: 4,
          opacity: 0.9,
        }).addTo(map);
      }
      // draw connector from previous day end to current day start (thin, subtle)
      if (previousEnd && seg.length > 0) {
        L.polyline([previousEnd, seg[0]], {
          color: '#94A3B8',
          weight: 2,
          opacity: 0.6,
          dashArray: '6,8',
        }).addTo(map);
      }
      if (seg.length > 0) previousEnd = seg[seg.length - 1];
    });

    // Fit map to show all markers
    if (markers.length > 0) {
      const group = L.featureGroup(markers);
      map.fitBounds(group.getBounds().pad(0.1));
    }

    // Add custom CSS for markers (uses CSS variable for background)
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
        background: var(--marker-bg, #3B82F6);
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
        filter: brightness(0.9);
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
    <>
      <style jsx>{`
        :global(.leaflet-control-zoom),
        :global(.leaflet-bar.leaflet-control) {
          display: block !important;
          visibility: visible !important;
          opacity: 1 !important;
          z-index: 15000 !important;
          pointer-events: auto !important;
        }
        :global(.leaflet-control-zoom a) {
          display: block !important;
          visibility: visible !important;
          opacity: 1 !important;
        }
      `}</style>
      <div
        ref={mapRef}
        className="w-full h-full"
        style={{ height: 'calc(100vh - 64px)' }}
      />
    </>
  );
}
