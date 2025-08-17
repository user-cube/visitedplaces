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
  // Sidebar is always visible
  const showSidebar = true;

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
          marginLeft: '400px'
        }}
      >
        <ItineraryMap itinerary={itinerary} />
        
        {/* Floating Controls */}
        <div className="absolute top-4 left-4" style={{ zIndex: 10000 }}>
          <button
            onClick={() => router.push('/itineraries')}
            style={{
              backgroundColor: 'white',
              padding: '14px',
              borderRadius: '16px',
              boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 12px 35px rgba(0, 0, 0, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)';
            }}
          >
            <svg style={{ width: '24px', height: '24px', color: '#374151' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
        </div>



        
      </div>

      {/* Sidebar */}
      <ItinerarySidebar
        itinerary={itinerary}
        onClose={() => {}} // No-op since sidebar is always visible
      />
    </div>
  );
}
