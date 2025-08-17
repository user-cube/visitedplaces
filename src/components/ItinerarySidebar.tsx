import { useState } from 'react';
import { Itinerary, ItineraryPoint } from '../types';

interface ItinerarySidebarProps {
  itinerary: Itinerary;
  onClose: () => void;
}

export default function ItinerarySidebar({ itinerary, onClose }: ItinerarySidebarProps) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Group points by date
  const pointsByDate = itinerary.points.reduce((acc, point) => {
    const date = point.date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(point);
    return acc;
  }, {} as Record<string, ItineraryPoint[]>);

  const dates = Object.keys(pointsByDate).sort();

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      'Museum': '🏛️',
      'Church': '⛪',
      'Castle': '🏰',
      'Palace': '🏛️',
      'Square': '🏛️',
      'Bridge': '🌉',
      'Synagogue': '🕍',
      'Library': '📚',
      'Opera': '🎭',
      'Cafe': '☕',
      'Nightlife': '🍺',
      'Thermal Bath': '🛁',
      'Market': '🛒',
      'Tour': '🚢',
      'Memorial': '🕯️',
      'Fortress': '🏰',
      'Statue': '🗿',
      'Hill': '⛰️',
      'Street': '🛣️',
      'Government': '🏛️',
      'Attraction': '🎯'
    };
    return icons[category] || '📍';
  };

  return (
    <div 
      style={{
        position: 'fixed',
        right: 0,
        top: 0,
        height: '100%',
        width: '384px',
        backgroundColor: 'white',
        boxShadow: '-2px 0 10px rgba(0,0,0,0.1)',
        zIndex: 9999,
        overflowY: 'auto'
      }}
    >
      <div style={{ padding: '24px' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827', margin: 0 }}>{itinerary.title}</h1>
            <p style={{ color: '#6B7280', fontSize: '14px', margin: '4px 0 0 0' }}>
              {formatDate(itinerary.startDate)} - {formatDate(itinerary.endDate)}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{ padding: '8px', color: '#9CA3AF', cursor: 'pointer', border: 'none', background: 'none' }}
          >
            <svg style={{ width: '24px', height: '24px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {itinerary.description && (
          <div style={{ marginBottom: '24px', padding: '16px', backgroundColor: '#EFF6FF', borderRadius: '8px' }}>
            <p style={{ color: '#1E40AF', fontSize: '14px', margin: 0 }}>{itinerary.description}</p>
          </div>
        )}

        {/* Date Navigation */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px' }}>
            {dates.map((date) => (
              <button
                key={date}
                onClick={() => setSelectedDate(selectedDate === date ? null : date)}
                style={{
                  padding: '8px 12px',
                  fontSize: '14px',
                  fontWeight: '500',
                  borderRadius: '6px',
                  border: 'none',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  backgroundColor: selectedDate === date ? '#2563EB' : '#F3F4F6',
                  color: selectedDate === date ? 'white' : '#374151'
                }}
              >
                {new Date(date).toLocaleDateString('en-US', { day: '2-digit', month: '2-digit' })}
              </button>
            ))}
          </div>
        </div>

        {/* Points List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {dates.map((date) => {
            const points = pointsByDate[date];
            const isSelected = selectedDate === null || selectedDate === date;
            
            if (!isSelected) return null;

            return (
              <div key={date} style={{ borderBottom: '1px solid #E5E7EB', paddingBottom: '16px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', marginBottom: '12px', margin: '0 0 12px 0' }}>
                  {formatDate(date)}
                </h3>
                
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {points.map((point, index) => (
                    <div key={index} style={{ 
                      backgroundColor: '#F9FAFB', 
                      borderRadius: '8px', 
                      padding: '16px',
                      marginBottom: '12px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                        <div style={{ 
                          flexShrink: 0, 
                          width: '32px', 
                          height: '32px', 
                          backgroundColor: '#2563EB', 
                          color: 'white', 
                          borderRadius: '50%', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center', 
                          fontSize: '14px', 
                          fontWeight: 'bold' 
                        }}>
                          {index + 1}
                        </div>
                        
                                                <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                            <span style={{ fontSize: '18px' }}>{getCategoryIcon(point.category || '')}</span>
                            <h4 style={{ fontSize: '14px', fontWeight: '500', color: '#111827', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {point.name}
                            </h4>
                          </div>
                          
                          <p style={{ fontSize: '12px', color: '#6B7280', marginBottom: '8px', margin: '0 0 8px 0' }}>{point.address}</p>
                          
                          {point.category && (
                            <span style={{ 
                              display: 'inline-block', 
                              backgroundColor: '#DBEAFE', 
                              color: '#1E40AF', 
                              fontSize: '12px', 
                              padding: '2px 8px', 
                              borderRadius: '12px', 
                              fontWeight: '500',
                              marginBottom: '8px'
                            }}>
                              {point.category}
                            </span>
                          )}
                          
                          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '12px', color: '#6B7280' }}>
                            {point.phone && (
                              <div style={{ display: 'flex', alignItems: 'center' }}>
                                <svg style={{ width: '12px', height: '12px', marginRight: '4px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                {point.phone}
                              </div>
                            )}
                            
                            {point.website && (
                              <a
                                href={point.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ display: 'flex', alignItems: 'center', color: '#2563EB', textDecoration: 'none' }}
                              >
                                <svg style={{ width: '12px', height: '12px', marginRight: '4px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                                Website
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary */}
        <div style={{ marginTop: '24px', padding: '16px', backgroundColor: '#F9FAFB', borderRadius: '8px' }}>
          <h4 style={{ fontWeight: '600', color: '#111827', marginBottom: '8px', margin: '0 0 8px 0' }}>Itinerary Summary</h4>
          <div style={{ fontSize: '14px', color: '#6B7280' }}>
            <p style={{ margin: '4px 0' }}>• {itinerary.points.length} points of interest</p>
            <p style={{ margin: '4px 0' }}>• {dates.length} travel days</p>
            <p style={{ margin: '4px 0' }}>• {new Set(itinerary.points.map(p => p.category)).size} different categories</p>
          </div>
        </div>
      </div>
    </div>
  );
}
