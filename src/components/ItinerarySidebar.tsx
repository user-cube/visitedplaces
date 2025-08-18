import { useState } from 'react';
import { Itinerary, ItineraryPoint } from '../types';

interface ItinerarySidebarProps {
  itinerary: Itinerary;
  onClose: () => void;
  isMobile?: boolean;
}

export default function ItinerarySidebar({
  itinerary,
  isMobile = false,
}: ItinerarySidebarProps) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<
    'overview' | 'notes' | 'links' | 'timeline'
  >('timeline');

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  // Group points by date
  const pointsByDate = itinerary.points.reduce(
    (acc, point) => {
      const date = point.date;
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(point);
      return acc;
    },
    {} as Record<string, ItineraryPoint[]>
  );

  const dates = Object.keys(pointsByDate).sort();
  const notesCount = Array.isArray(itinerary.notes)
    ? itinerary.notes.length
    : 0;
  const linksCount = Array.isArray(itinerary.links)
    ? itinerary.links.length
    : 0;

  // Random but distinct color per day for the current session
  const dayColorCache: Record<string, string> = {};
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

  function getRandomDistinctColor(used: Set<string>): string {
    const available = candidateColors.filter(c => !used.has(c));
    if (available.length === 0) {
      return candidateColors[
        Math.floor(Math.random() * candidateColors.length)
      ];
    }
    return available[Math.floor(Math.random() * available.length)];
  }

  const getDayColor = (date: string) => {
    if (dayColorCache[date]) return dayColorCache[date];
    // Try to align with map colors if available in localStorage
    try {
      const stored = localStorage.getItem(
        `itinerary-day-colors::${itinerary.id}`
      );
      if (stored) {
        const parsed = JSON.parse(stored) as Record<string, string>;
        if (parsed[date]) {
          dayColorCache[date] = parsed[date];
          return parsed[date];
        }
      }
    } catch {}
    const used = new Set(Object.values(dayColorCache));
    const color = getRandomDistinctColor(used);
    dayColorCache[date] = color;
    return color;
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      Museum: '🏛️',
      Church: '⛪',
      Castle: '🏰',
      Palace: '🏛️',
      Square: '🏛️',
      Bridge: '🌉',
      Synagogue: '🕍',
      Library: '📚',
      Opera: '🎭',
      Cafe: '☕',
      Nightlife: '🍺',
      'Thermal Bath': '🛁',
      Market: '🛒',
      Tour: '🚢',
      Memorial: '🕯️',
      Fortress: '🏰',
      Statue: '🗿',
      Hill: '⛰️',
      Street: '🛣️',
      Government: '🏛️',
      Attraction: '🎯',
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
        width: isMobile ? '100%' : '400px',
        backgroundColor: 'white',
        boxShadow: '4px 0 20px rgba(0,0,0,0.15)',
        zIndex: 1000,
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          padding: isMobile ? '80px 16px 16px 16px' : '32px',
          height: '100%',
          overflowY: 'auto',
          overflowX: 'hidden',
          scrollbarWidth: 'thin',
          scrollbarColor: '#CBD5E1 #F1F5F9',
        }}
        className="custom-scrollbar"
      >
        {/* Header with Destination Image (enhanced) */}
        <div style={{ marginBottom: '24px' }}>
          <div
            style={{
              position: 'relative',
              borderRadius: '16px',
              padding: '2px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              boxShadow: '0 12px 30px rgba(102,126,234,0.25)',
            }}
          >
            <div
              style={{
                position: 'relative',
                borderRadius: '14px',
                overflow: 'hidden',
                height: isMobile ? '160px' : '180px',
                backgroundColor: '#F1F5F9',
              }}
            >
              {!imageLoaded && (
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background:
                      'linear-gradient(90deg, #F1F5F9 25%, #E2E8F0 37%, #F1F5F9 63%)',
                  }}
                />
              )}
              <img
                src={
                  itinerary.image ||
                  'https://images.unsplash.com/photo-1551867633-194f125695d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
                }
                alt={`Cover image for ${itinerary.title}`}
                loading="lazy"
                onLoad={() => setImageLoaded(true)}
                onError={e => {
                  (e.currentTarget as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1551867633-194f125695d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80';
                }}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transform: 'scale(1.02)',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background:
                    'linear-gradient(135deg, rgba(0,0,0,0.35) 0%, rgba(102,126,234,0.25) 60%, rgba(118,75,162,0.35) 100%)',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  bottom: 0,
                  padding: '16px 20px',
                  color: 'white',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                }}
              >
                <h1
                  style={{
                    fontSize: '22px',
                    fontWeight: 'bold',
                    margin: 0,
                    textShadow: '0 2px 6px rgba(0,0,0,0.35)',
                  }}
                >
                  Trip to {itinerary.title}
                </h1>
                <p
                  style={{
                    fontSize: '13px',
                    margin: 0,
                    opacity: 0.95,
                    textShadow: '0 1px 3px rgba(0,0,0,0.35)',
                  }}
                >
                  {new Date(itinerary.startDate).toLocaleDateString('en-US', {
                    day: '2-digit',
                    month: '2-digit',
                  })}{' '}
                  -{' '}
                  {new Date(itinerary.endDate).toLocaleDateString('en-US', {
                    day: '2-digit',
                    month: '2-digit',
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div
          style={{
            display: 'flex',
            gap: '8px',
            marginBottom: '12px',
            borderBottom: '1px solid #E5E7EB',
            paddingBottom: '8px',
            position: 'static',
            overflowX: 'auto',
            whiteSpace: 'nowrap',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {[
            { key: 'overview', label: isMobile ? 'Overview' : 'Overview' },
            {
              key: 'notes',
              label: isMobile
                ? 'Notes'
                : `Notes${notesCount ? ` (${notesCount})` : ''}`,
            },
            {
              key: 'links',
              label: isMobile
                ? 'Links'
                : `Links${linksCount ? ` (${linksCount})` : ''}`,
            },
            {
              key: 'timeline',
              label: isMobile ? 'Timeline' : `Timeline (${dates.length})`,
            },
          ].map(tab => {
            const isActive = activeTab === (tab.key as typeof activeTab);
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as typeof activeTab)}
                style={{
                  padding: isMobile ? '6px 10px' : '8px 12px',
                  fontSize: '13px',
                  fontWeight: 600,
                  borderRadius: '9999px',
                  border: '1px solid',
                  borderColor: isActive ? 'transparent' : '#E5E7EB',
                  background: isActive
                    ? 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)'
                    : '#F9FAFB',
                  color: isActive ? '#FFFFFF' : '#374151',
                  boxShadow: isActive
                    ? '0 6px 16px rgba(102, 126, 234, 0.35)'
                    : 'none',
                  cursor: 'pointer',
                  flexShrink: 0,
                  transition: 'all 0.2s ease',
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Overview */}
        {activeTab === 'overview' && (
          <>
            <div
              style={{
                marginBottom: '24px',
                display: 'flex',
                gap: '12px',
              }}
            >
              <div
                style={{
                  flex: 1,
                  padding: '16px',
                  backgroundColor: '#F8FAFC',
                  borderRadius: '12px',
                  textAlign: 'center',
                  border: '1px solid #E2E8F0',
                }}
              >
                <div
                  style={{
                    fontSize: '20px',
                    fontWeight: 'bold',
                    color: '#0F172A',
                    marginBottom: '4px',
                  }}
                >
                  {itinerary.points.length}
                </div>
                <div style={{ fontSize: '12px', color: '#64748B' }}>Points</div>
              </div>
              <div
                style={{
                  flex: 1,
                  padding: '16px',
                  backgroundColor: '#F8FAFC',
                  borderRadius: '12px',
                  textAlign: 'center',
                  border: '1px solid #E2E8F0',
                }}
              >
                <div
                  style={{
                    fontSize: '20px',
                    fontWeight: 'bold',
                    color: '#0F172A',
                    marginBottom: '4px',
                  }}
                >
                  {dates.length}
                </div>
                <div style={{ fontSize: '12px', color: '#64748B' }}>Days</div>
              </div>
              <div
                style={{
                  flex: 1,
                  padding: '16px',
                  backgroundColor: '#F8FAFC',
                  borderRadius: '12px',
                  textAlign: 'center',
                  border: '1px solid #E2E8F0',
                }}
              >
                <div
                  style={{
                    fontSize: '20px',
                    fontWeight: 'bold',
                    color: '#0F172A',
                    marginBottom: '4px',
                  }}
                >
                  {new Set(itinerary.points.map(p => p.category)).size}
                </div>
                <div style={{ fontSize: '12px', color: '#64748B' }}>
                  Categories
                </div>
              </div>
            </div>

            {itinerary.description && (
              <div
                style={{
                  marginBottom: '24px',
                  padding: '16px',
                  backgroundColor: '#F0F9FF',
                  borderRadius: '12px',
                  border: '1px solid #E0F2FE',
                }}
              >
                <p
                  style={{
                    color: '#0369A1',
                    fontSize: '14px',
                    margin: 0,
                    lineHeight: '1.5',
                  }}
                >
                  {itinerary.description}
                </p>
              </div>
            )}

            {/* Itinerary preview (same as Timeline) */}
            <div style={{ marginBottom: '20px' }}>
              <div
                style={{
                  display: 'flex',
                  gap: '6px',
                  overflowX: 'auto',
                  paddingBottom: '8px',
                }}
              >
                {dates.map(date => (
                  <button
                    key={date}
                    onClick={() =>
                      setSelectedDate(selectedDate === date ? null : date)
                    }
                    style={{
                      padding: '8px 12px',
                      fontSize: '13px',
                      fontWeight: '500',
                      borderRadius: '8px',
                      border: 'none',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      backgroundColor:
                        selectedDate === date ? '#3B82F6' : '#F1F5F9',
                      color: selectedDate === date ? 'white' : '#64748B',
                      transition: 'all 0.2s ease',
                      minWidth: '60px',
                    }}
                  >
                    {new Date(date).toLocaleDateString('en-US', {
                      day: '2-digit',
                      month: '2-digit',
                    })}
                  </button>
                ))}
              </div>
            </div>

            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
            >
              {dates.map(date => {
                const points = pointsByDate[date];
                const isSelected =
                  selectedDate === null || selectedDate === date;

                if (!isSelected) return null;

                return (
                  <div
                    key={date}
                    style={{
                      borderBottom: '1px solid #E5E7EB',
                      paddingBottom: '16px',
                    }}
                  >
                    <h3
                      style={{
                        fontSize: '18px',
                        fontWeight: '600',
                        color: '#111827',
                        marginBottom: '12px',
                        margin: '0 0 12px 0',
                      }}
                    >
                      {formatDate(date)}
                    </h3>

                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px',
                      }}
                    >
                      {points.map((point, index) => (
                        <div
                          key={index}
                          style={{
                            backgroundColor: '#FFFFFF',
                            borderRadius: '16px',
                            padding: '20px',
                            marginBottom: '16px',
                            border: '1px solid #F1F5F9',
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                            transition: 'all 0.2s ease',
                          }}
                          onMouseEnter={e => {
                            e.currentTarget.style.transform =
                              'translateY(-2px)';
                            e.currentTarget.style.boxShadow =
                              '0 8px 25px rgba(0, 0, 0, 0.1)';
                          }}
                          onMouseLeave={e => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow =
                              '0 2px 8px rgba(0, 0, 0, 0.04)';
                          }}
                        >
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'flex-start',
                              gap: '12px',
                            }}
                          >
                            <div
                              style={{
                                flexShrink: 0,
                                width: '36px',
                                height: '36px',
                                backgroundColor: getDayColor(date),
                                color: 'white',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '14px',
                                fontWeight: 'bold',
                                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                              }}
                            >
                              {index + 1}
                            </div>

                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '8px',
                                  marginBottom: '4px',
                                }}
                              >
                                <span style={{ fontSize: '18px' }}>
                                  {getCategoryIcon(point.category || '')}
                                </span>
                                <h4
                                  style={{
                                    fontSize: '14px',
                                    fontWeight: '500',
                                    color: '#111827',
                                    margin: 0,
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                  }}
                                >
                                  {point.name}
                                </h4>
                              </div>

                              <p
                                style={{
                                  fontSize: '12px',
                                  color: '#6B7280',
                                  marginBottom: '8px',
                                  margin: '0 0 8px 0',
                                }}
                              >
                                {point.address}
                              </p>

                              {point.category && (
                                <span
                                  style={{
                                    display: 'inline-block',
                                    backgroundColor: '#E0F2FE',
                                    color: '#0369A1',
                                    fontSize: '12px',
                                    padding: '4px 10px',
                                    borderRadius: '12px',
                                    fontWeight: '600',
                                    marginBottom: '8px',
                                    border: '1px solid #BAE6FD',
                                  }}
                                >
                                  {point.category}
                                </span>
                              )}

                              {point.description && (
                                <p
                                  style={{
                                    fontSize: '12px',
                                    color: '#374151',
                                    margin: '0 0 8px 0',
                                    lineHeight: '1.5',
                                  }}
                                >
                                  {point.description}
                                </p>
                              )}

                              <div
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '16px',
                                  fontSize: '12px',
                                  color: '#6B7280',
                                }}
                              >
                                {point.phone && (
                                  <div
                                    style={{
                                      display: 'flex',
                                      alignItems: 'center',
                                    }}
                                  >
                                    <svg
                                      style={{
                                        width: '12px',
                                        height: '12px',
                                        marginRight: '4px',
                                      }}
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                      />
                                    </svg>
                                    {point.phone}
                                  </div>
                                )}

                                {point.website && (
                                  <a
                                    href={point.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      color: '#2563EB',
                                      textDecoration: 'none',
                                    }}
                                  >
                                    <svg
                                      style={{
                                        width: '12px',
                                        height: '12px',
                                        marginRight: '4px',
                                      }}
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M10 6H6a2 2 0 002 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                      />
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
          </>
        )}

        {activeTab === 'notes' &&
          (Array.isArray(itinerary.notes) && itinerary.notes.length > 0 ? (
            <div
              style={{
                position: 'relative',
                marginBottom: '24px',
                padding: '16px 16px 16px 20px',
                backgroundColor: '#FFFFFF',
                borderRadius: '12px',
                border: '1px solid #E5E7EB',
                boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: '4px',
                  borderTopLeftRadius: '12px',
                  borderBottomLeftRadius: '12px',
                  background:
                    'linear-gradient(180deg, #667eea 0%, #764ba2 100%)',
                }}
              />
              <h3
                style={{
                  fontSize: '15px',
                  fontWeight: 700,
                  color: '#111827',
                  margin: '0 0 10px 0',
                }}
              >
                Notes
              </h3>
              <ul style={{ paddingLeft: '18px', margin: 0, color: '#374151' }}>
                {itinerary.notes.map((note, idx) => (
                  <li
                    key={idx}
                    style={{
                      fontSize: '13px',
                      marginBottom: '10px',
                      lineHeight: 1.6,
                    }}
                  >
                    {note}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div
              style={{
                color: '#6B7280',
                fontSize: '13px',
                marginBottom: '24px',
              }}
            >
              No notes.
            </div>
          ))}

        {activeTab === 'links' &&
          (Array.isArray(itinerary.links) && itinerary.links.length > 0 ? (
            <div
              style={{
                position: 'relative',
                marginBottom: '24px',
                padding: '16px 16px 16px 20px',
                backgroundColor: '#FFFFFF',
                borderRadius: '12px',
                border: '1px solid #E5E7EB',
                boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: '4px',
                  borderTopLeftRadius: '12px',
                  borderBottomLeftRadius: '12px',
                  background:
                    'linear-gradient(180deg, #667eea 0%, #764ba2 100%)',
                }}
              />
              <h3
                style={{
                  fontSize: '15px',
                  fontWeight: 700,
                  color: '#111827',
                  margin: '0 0 10px 0',
                }}
              >
                Links
              </h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {itinerary.links.map((link, idx) => (
                  <li
                    key={idx}
                    style={{
                      fontSize: '13px',
                      padding: '8px 0',
                      borderTop: idx === 0 ? 'none' : '1px solid #F3F4F6',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '8px',
                    }}
                  >
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: '#667EEA',
                        textDecoration: 'none',
                        flex: 1,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                      onMouseEnter={e => {
                        (
                          e.currentTarget as HTMLAnchorElement
                        ).style.textDecoration = 'underline';
                      }}
                      onMouseLeave={e => {
                        (
                          e.currentTarget as HTMLAnchorElement
                        ).style.textDecoration = 'none';
                      }}
                    >
                      <span
                        style={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {link.label}
                      </span>
                    </a>
                    <svg
                      style={{
                        width: '14px',
                        height: '14px',
                        color: '#9CA3AF',
                        flexShrink: 0,
                      }}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div
              style={{
                color: '#6B7280',
                fontSize: '13px',
                marginBottom: '24px',
              }}
            >
              No links.
            </div>
          ))}

        {/* Timeline */}
        {activeTab === 'timeline' && (
          <>
            <div style={{ marginBottom: '20px' }}>
              <h3
                style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#0F172A',
                  margin: '0 0 12px 0',
                }}
              >
                Timeline
              </h3>
              <div
                style={{
                  display: 'flex',
                  gap: '6px',
                  overflowX: 'auto',
                  paddingBottom: '8px',
                }}
              >
                {dates.map(date => (
                  <button
                    key={date}
                    onClick={() =>
                      setSelectedDate(selectedDate === date ? null : date)
                    }
                    style={{
                      padding: '8px 12px',
                      fontSize: '13px',
                      fontWeight: '500',
                      borderRadius: '8px',
                      border: 'none',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      backgroundColor:
                        selectedDate === date ? '#3B82F6' : '#F1F5F9',
                      color: selectedDate === date ? 'white' : '#64748B',
                      transition: 'all 0.2s ease',
                      minWidth: '60px',
                    }}
                  >
                    {new Date(date).toLocaleDateString('en-US', {
                      day: '2-digit',
                      month: '2-digit',
                    })}
                  </button>
                ))}
              </div>
            </div>

            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
            >
              {dates.map(date => {
                const points = pointsByDate[date];
                const isSelected =
                  selectedDate === null || selectedDate === date;

                if (!isSelected) return null;

                return (
                  <div
                    key={date}
                    style={{
                      borderBottom: '1px solid #E5E7EB',
                      paddingBottom: '16px',
                    }}
                  >
                    <h3
                      style={{
                        fontSize: '18px',
                        fontWeight: '600',
                        color: '#111827',
                        marginBottom: '12px',
                        margin: '0 0 12px 0',
                      }}
                    >
                      {formatDate(date)}
                    </h3>

                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px',
                      }}
                    >
                      {points.map((point, index) => (
                        <div
                          key={index}
                          style={{
                            backgroundColor: '#FFFFFF',
                            borderRadius: '16px',
                            padding: '20px',
                            marginBottom: '16px',
                            border: '1px solid #F1F5F9',
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                            transition: 'all 0.2s ease',
                          }}
                          onMouseEnter={e => {
                            e.currentTarget.style.transform =
                              'translateY(-2px)';
                            e.currentTarget.style.boxShadow =
                              '0 8px 25px rgba(0, 0, 0, 0.1)';
                          }}
                          onMouseLeave={e => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow =
                              '0 2px 8px rgba(0, 0, 0, 0.04)';
                          }}
                        >
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'flex-start',
                              gap: '12px',
                            }}
                          >
                            <div
                              style={{
                                flexShrink: 0,
                                width: '36px',
                                height: '36px',
                                backgroundColor: getDayColor(date),
                                color: 'white',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '14px',
                                fontWeight: 'bold',
                                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                              }}
                            >
                              {index + 1}
                            </div>

                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '8px',
                                  marginBottom: '4px',
                                }}
                              >
                                <span style={{ fontSize: '18px' }}>
                                  {getCategoryIcon(point.category || '')}
                                </span>
                                <h4
                                  style={{
                                    fontSize: '14px',
                                    fontWeight: '500',
                                    color: '#111827',
                                    margin: 0,
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                  }}
                                >
                                  {point.name}
                                </h4>
                              </div>

                              <p
                                style={{
                                  fontSize: '12px',
                                  color: '#6B7280',
                                  marginBottom: '8px',
                                  margin: '0 0 8px 0',
                                }}
                              >
                                {point.address}
                              </p>

                              {point.category && (
                                <span
                                  style={{
                                    display: 'inline-block',
                                    backgroundColor: '#E0F2FE',
                                    color: '#0369A1',
                                    fontSize: '12px',
                                    padding: '4px 10px',
                                    borderRadius: '12px',
                                    fontWeight: '600',
                                    marginBottom: '8px',
                                    border: '1px solid #BAE6FD',
                                  }}
                                >
                                  {point.category}
                                </span>
                              )}

                              {point.description && (
                                <p
                                  style={{
                                    fontSize: '12px',
                                    color: '#374151',
                                    margin: '0 0 8px 0',
                                    lineHeight: '1.5',
                                  }}
                                >
                                  {point.description}
                                </p>
                              )}

                              <div
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '16px',
                                  fontSize: '12px',
                                  color: '#6B7280',
                                }}
                              >
                                {point.phone && (
                                  <div
                                    style={{
                                      display: 'flex',
                                      alignItems: 'center',
                                    }}
                                  >
                                    <svg
                                      style={{
                                        width: '12px',
                                        height: '12px',
                                        marginRight: '4px',
                                      }}
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                      />
                                    </svg>
                                    {point.phone}
                                  </div>
                                )}

                                {point.website && (
                                  <a
                                    href={point.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      color: '#2563EB',
                                      textDecoration: 'none',
                                    }}
                                  >
                                    <svg
                                      style={{
                                        width: '12px',
                                        height: '12px',
                                        marginRight: '4px',
                                      }}
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                      />
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
          </>
        )}
      </div>
    </div>
  );
}
