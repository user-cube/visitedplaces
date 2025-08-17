import React from 'react';
import { useRouter } from 'next/router';
import { Itinerary } from '../types';

import { City } from '../types';

interface SidePanelProps {
  cities: City[];
  itineraries: Itinerary[];
}

export function SidePanel({ cities, itineraries }: SidePanelProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = React.useState(() => {
    // Start open on desktop, closed on mobile
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 768;
    }
    return true; // Default to open on server-side
  });

  // Listen for window resize to update the state
  React.useEffect(() => {
    const handleResize = () => {
      const shouldBeOpen = window.innerWidth >= 768;
      setIsOpen(shouldBeOpen);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Update body class to control map margin
  React.useEffect(() => {
    if (isOpen) {
      document.body.classList.remove('side-panel-closed');
      document.body.classList.add('side-panel-open');
    } else {
      document.body.classList.remove('side-panel-open');
      document.body.classList.add('side-panel-closed');
    }
  }, [isOpen]);

  // Calculate unique countries visited
  const uniqueCountries = new Set(cities.map(city => city.country)).size;

  // Get last 5 itineraries
  const last5Itineraries = itineraries.slice(-5).reverse();

  return (
    <>
      {/* Toggle button */}
      <button
        className="side-panel-toggle"
        onClick={() => setIsOpen(!isOpen)}
        title={isOpen ? 'Close panel' : 'Open panel'}
      >
        <div className="toggle-content">
          {isOpen ? (
            <>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M15 18l-6-6 6-6" />
              </svg>
              <span className="toggle-text">Close</span>
            </>
          ) : (
            <>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M9 18l6-6-6-6" />
              </svg>
              <span className="toggle-text">Menu</span>
            </>
          )}
        </div>
      </button>

      <div className={`side-panel ${isOpen ? 'open' : 'closed'}`}>
        <div className="side-panel-header">
          <h2>Travel Stats</h2>
        </div>

        <div className="side-panel-content">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-number">{cities.length}</div>
              <div className="stat-label">Cities</div>
            </div>

            <div className="stat-card">
              <div className="stat-number">{uniqueCountries}</div>
              <div className="stat-label">Countries</div>
            </div>

            <div className="stat-card">
              <div className="stat-number">{itineraries.length}</div>
              <div className="stat-label">Itineraries</div>
            </div>
          </div>

          <div className="itineraries-section">
            <div className="section-header">
              <h3>Itineraries</h3>
            </div>

            <button
              className="view-all-button"
              onClick={() => router.push('/itineraries')}
            >
              View All Itineraries
            </button>

            <div className="itineraries-list">
              {last5Itineraries.length > 0 ? (
                last5Itineraries.map(itinerary => (
                  <div
                    key={itinerary.id}
                    className="itinerary-card"
                    onClick={() => router.push(`/itineraries/${itinerary.id}`)}
                  >
                    <div className="itinerary-header">
                      {itinerary.image && (
                        <div className="itinerary-image">
                          <img
                            src={itinerary.image}
                            alt={`${itinerary.title} destination`}
                            className="w-full h-full object-cover rounded-lg"
                            loading="lazy"
                          />
                        </div>
                      )}
                      <div className="itinerary-content">
                        <div className="itinerary-title">{itinerary.title}</div>
                        <div className="itinerary-meta">
                          <span className="itinerary-dates">
                            {itinerary.startDate} - {itinerary.endDate}
                          </span>
                          <span className="itinerary-points">
                            {itinerary.metadata?.pointsCount ||
                              itinerary.points.length}{' '}
                            points
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-state">
                  <div className="empty-icon">🗺️</div>
                  <div className="empty-text">No itineraries yet</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
