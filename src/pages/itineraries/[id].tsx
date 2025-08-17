import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import itinerariesData from '../../../data/itineraries.json';
import { Itinerary } from '../../types';
import ItinerarySidebar from '../../components/ItinerarySidebar';

const ItineraryMap = dynamic(() => import('../../components/ItineraryMap'), { ssr: false });

export default function ItineraryPage() {
  const router = useRouter();
  const { id } = router.query;
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [showSidebar, setShowSidebar] = useState(true);

  useEffect(() => {
    if (id && typeof id === 'string') {
      const foundItinerary = (itinerariesData.itineraries as Itinerary[]).find(
        (it: Itinerary) => it.id === id
      );
      setItinerary(foundItinerary || null);
    }
  }, [id]);

  if (!itinerary) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Itinerary not found</h1>
          <button
            onClick={() => router.push('/itineraries')}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Back to itineraries list
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex">
      {/* Main Map Area */}
      <div 
        className={`flex-1 relative ${showSidebar ? 'mr-96' : ''}`}
        style={{
          flex: 1,
          position: 'relative',
          marginRight: showSidebar ? '384px' : '0'
        }}
      >
        <ItineraryMap itinerary={itinerary} />
        
        {/* Floating Controls */}
        <div className="absolute top-4 left-4" style={{ zIndex: 10000 }}>
          <button
            onClick={() => router.push('/itineraries')}
            style={{
              backgroundColor: 'white',
              padding: '12px',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            <svg style={{ width: '24px', height: '24px', color: '#374151' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
        </div>

        {/* Toggle Sidebar Button */}
        <div className="absolute top-4 right-4" style={{ zIndex: 10000 }}>
          <button
            onClick={() => setShowSidebar(!showSidebar)}
            style={{
              backgroundColor: 'white',
              padding: '12px',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            <svg style={{ width: '24px', height: '24px', color: '#374151' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Itinerary Info Overlay */}
        <div className="absolute top-16 left-4" style={{ zIndex: 10000 }}>
          <div style={{
            backgroundColor: 'white',
            padding: '16px',
            borderRadius: '8px',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            maxWidth: '300px'
          }}>
                          <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', marginBottom: '8px', margin: '0 0 8px 0' }}>{itinerary.title}</h2>
              <p style={{ fontSize: '14px', color: '#6B7280', marginBottom: '8px', margin: '0 0 8px 0' }}>
                {new Date(itinerary.startDate).toLocaleDateString('en-US')} - {new Date(itinerary.endDate).toLocaleDateString('en-US')}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', fontSize: '14px', color: '#6B7280' }}>
                <svg style={{ width: '16px', height: '16px', marginRight: '4px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {itinerary.points.length} points of interest
              </div>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      {showSidebar && (
        <ItinerarySidebar
          itinerary={itinerary}
          onClose={() => setShowSidebar(false)}
        />
      )}
    </div>
  );
}
