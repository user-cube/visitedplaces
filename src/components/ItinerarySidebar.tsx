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
        left: 0,
        top: 0,
        height: '100%',
        width: '400px',
        backgroundColor: 'white',
        boxShadow: '4px 0 20px rgba(0,0,0,0.15)',
        zIndex: 9999,
        overflow: 'hidden'
      }}
    >
      <div 
        style={{ 
          padding: '32px',
          height: '100%',
          overflowY: 'auto',
          overflowX: 'hidden',
          scrollbarWidth: 'thin',
          scrollbarColor: '#CBD5E1 #F1F5F9'
        }}
        className="custom-scrollbar"
      >
        {/* Header with Destination Image */}
        <div style={{ 
          marginBottom: '24px',
          position: 'relative',
          borderRadius: '16px',
          overflow: 'hidden',
          height: '140px',
          background: 'url("https://images.unsplash.com/photo-1551867633-194f125695d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80")',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}>
          {/* Overlay for better text readability */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(135deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.2) 100%)'
          }} />
          <div style={{
            position: 'relative',
            zIndex: 1,
            padding: '20px',
            color: 'white',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end'
          }}>
            <h1 style={{ 
              fontSize: '24px', 
              fontWeight: 'bold', 
              margin: '0 0 4px 0',
              textShadow: '0 2px 4px rgba(0,0,0,0.5)'
            }}>
              Trip to {itinerary.title}
            </h1>
            <p style={{ 
              fontSize: '14px', 
              margin: 0,
              opacity: 0.95,
              textShadow: '0 1px 2px rgba(0,0,0,0.5)'
            }}>
              {new Date(itinerary.startDate).toLocaleDateString('en-US', { day: '2-digit', month: '2-digit' })} - {new Date(itinerary.endDate).toLocaleDateString('en-US', { day: '2-digit', month: '2-digit' })}
            </p>
          </div>
        </div>

        {/* Quick Stats */}
        <div style={{ 
          marginBottom: '24px',
          display: 'flex',
          gap: '12px'
        }}>
          <div style={{
            flex: 1,
            padding: '16px',
            backgroundColor: '#F8FAFC',
            borderRadius: '12px',
            textAlign: 'center',
            border: '1px solid #E2E8F0'
          }}>
            <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#0F172A', marginBottom: '4px' }}>
              {itinerary.points.length}
            </div>
            <div style={{ fontSize: '12px', color: '#64748B' }}>
              Points
            </div>
          </div>
          <div style={{
            flex: 1,
            padding: '16px',
            backgroundColor: '#F8FAFC',
            borderRadius: '12px',
            textAlign: 'center',
            border: '1px solid #E2E8F0'
          }}>
            <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#0F172A', marginBottom: '4px' }}>
              {dates.length}
            </div>
            <div style={{ fontSize: '12px', color: '#64748B' }}>
              Days
            </div>
          </div>
          <div style={{
            flex: 1,
            padding: '16px',
            backgroundColor: '#F8FAFC',
            borderRadius: '12px',
            textAlign: 'center',
            border: '1px solid #E2E8F0'
          }}>
            <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#0F172A', marginBottom: '4px' }}>
              {new Set(itinerary.points.map(p => p.category)).size}
            </div>
            <div style={{ fontSize: '12px', color: '#64748B' }}>
              Categories
            </div>
          </div>
        </div>

        {itinerary.description && (
          <div style={{ 
            marginBottom: '24px', 
            padding: '16px', 
            backgroundColor: '#F0F9FF', 
            borderRadius: '12px',
            border: '1px solid #E0F2FE'
          }}>
            <p style={{ color: '#0369A1', fontSize: '14px', margin: 0, lineHeight: '1.5' }}>{itinerary.description}</p>
          </div>
        )}

        {/* Date Navigation */}
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ 
            fontSize: '16px', 
            fontWeight: '600', 
            color: '#0F172A', 
            margin: '0 0 12px 0' 
          }}>
            Timeline
          </h3>
          <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '8px' }}>
            {dates.map((date) => (
              <button
                key={date}
                onClick={() => setSelectedDate(selectedDate === date ? null : date)}
                style={{
                  padding: '8px 12px',
                  fontSize: '13px',
                  fontWeight: '500',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  backgroundColor: selectedDate === date ? '#3B82F6' : '#F1F5F9',
                  color: selectedDate === date ? 'white' : '#64748B',
                  transition: 'all 0.2s ease',
                  minWidth: '60px'
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
                      backgroundColor: '#FFFFFF', 
                      borderRadius: '16px', 
                      padding: '20px',
                      marginBottom: '16px',
                      border: '1px solid #F1F5F9',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.04)';
                    }}
                    >
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                        <div style={{ 
                          flexShrink: 0, 
                          width: '36px', 
                          height: '36px', 
                          backgroundColor: '#3B82F6', 
                          color: 'white', 
                          borderRadius: '50%', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center', 
                          fontSize: '14px', 
                          fontWeight: 'bold',
                          boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
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
                              backgroundColor: '#E0F2FE', 
                              color: '#0369A1', 
                              fontSize: '12px', 
                              padding: '4px 10px', 
                              borderRadius: '12px', 
                              fontWeight: '600',
                              marginBottom: '8px',
                              border: '1px solid #BAE6FD'
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


      </div>
    </div>
  );
}

