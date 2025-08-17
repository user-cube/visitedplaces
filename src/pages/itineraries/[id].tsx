import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { loadItineraryById } from '../../utils/itineraryUtils';
import { Itinerary } from '../../types';
import ItinerarySidebar from '../../components/ItinerarySidebar';

const ItineraryMap = dynamic(() => import('../../components/ItineraryMap'), {
  ssr: false,
});

export default function ItineraryPage() {
  const router = useRouter();
  const { id } = router.query;
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [showSidebar, setShowSidebar] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Check if we're on mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth <= 768) {
        setShowSidebar(true); // Start with details on mobile
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    async function loadItinerary() {
      if (id && typeof id === 'string') {
        try {
          const foundItinerary = await loadItineraryById(id);
          setItinerary(foundItinerary);
        } catch (error) {
          console.error('Error loading itinerary:', error);
          setItinerary(null);
        }
      }
    }

    loadItinerary();
  }, [id]);

  if (!itinerary) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Itinerary not found
          </h1>
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
    <div className="h-screen flex itinerary-detail-page">
      {/* Main Map Area */}
      <div
        className={`flex-1 relative ${showSidebar && !isMobile ? 'mr-96' : ''}`}
        style={{
          flex: 1,
          position: 'relative',
          marginLeft: showSidebar && !isMobile ? '400px' : '0',
        }}
      >
        <ItineraryMap itinerary={itinerary} />

        {/* Floating Controls */}
        <div className="absolute top-4 left-4 z-[10000] flex gap-2">
          {/* Back Button - Always visible */}
          <button
            onClick={() => router.push('/itineraries')}
            className="group inline-flex items-center px-3 py-2 sm:px-4 sm:py-3 border-2 border-gray-200 shadow-lg text-xs sm:text-sm font-semibold rounded-lg sm:rounded-xl text-gray-700 bg-white/95 backdrop-blur-sm hover:bg-white hover:border-[#667eea] hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#667eea] transition-all duration-300 transform hover:scale-105"
          >
            <svg
              className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 group-hover:-translate-x-1 transition-transform duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            <span className="hidden sm:inline">Back</span>
          </button>

          {/* Mobile Toggle Button - Only on mobile */}
          {isMobile && (
            <button
              onClick={() => setShowSidebar(!showSidebar)}
              className="group inline-flex items-center px-3 py-2 sm:px-4 sm:py-3 border-2 border-gray-200 shadow-lg text-xs sm:text-sm font-semibold rounded-lg sm:rounded-xl text-gray-700 bg-white/95 backdrop-blur-sm hover:bg-white hover:border-[#667eea] hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#667eea] transition-all duration-300 transform hover:scale-105"
            >
              {showSidebar ? (
                // When sidebar is visible, show Map button
                <>
                  <svg
                    className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m-6 3l6-3"
                    />
                  </svg>
                  <span className="text-xs sm:text-sm">Map</span>
                </>
              ) : (
                // When map is visible, show Menu button
                <>
                  <svg
                    className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                  <span className="text-xs sm:text-sm">Itinerary</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Sidebar */}
      {showSidebar && (
        <ItinerarySidebar
          itinerary={itinerary}
          onClose={() => setShowSidebar(false)}
          isMobile={isMobile}
        />
      )}
    </div>
  );
}
