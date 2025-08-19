import { useRouter } from 'next/router';
import { useEffect, useState, useMemo, useRef } from 'react';
import { useItineraries } from '../../hooks/useItineraries';
import { Itinerary } from '../../types';
import styles from './Itineraries.module.css';

export default function ItinerariesList() {
  const router = useRouter();
  const { itineraries, loading, error } = useItineraries();
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedTerm, setDebouncedTerm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [isSmall, setIsSmall] = useState(false);
  const [showMoreYears, setShowMoreYears] = useState(false);
  const [showMoreCountries, setShowMoreCountries] = useState(false);

  // Load last query from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('itineraries:lastQuery');
      if (saved) setSearchTerm(saved);
    } catch {}
    const onResize = () => setIsSmall(window.innerWidth <= 640);
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Debounce search term and persist
  useEffect(() => {
    const id = setTimeout(() => {
      setDebouncedTerm(searchTerm.trim());
      try {
        localStorage.setItem('itineraries:lastQuery', searchTerm.trim());
      } catch {}
    }, 200);
    return () => clearTimeout(id);
  }, [searchTerm]);

  // Keyboard shortcuts: '/' to focus, Esc to clear
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === '/' && !e.metaKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault();
        searchInputRef.current?.focus();
      } else if (e.key === 'Escape') {
        setSearchTerm('');
        searchInputRef.current?.blur();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Add class to body to enable scrolling
  useEffect(() => {
    document.body.classList.add('itinerary-page');
    return () => {
      document.body.classList.remove('itinerary-page');
    };
  }, []);

  const handleItinerarySelect = (itinerary: Itinerary) => {
    router.push(`/itineraries/${itinerary.id}`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  // Helper functions to get metadata from itinerary
  const getCountryFlags = (itinerary: Itinerary) => {
    return itinerary.metadata?.flags || '🌍';
  };

  const getTravelEmoji = (itinerary: Itinerary) => {
    return itinerary.metadata?.emoji || '✈️';
  };

  // Get unique countries and years for filters
  const uniqueCountries = useMemo(() => {
    const countries = new Set<string>();
    itineraries.forEach(itinerary => {
      if (itinerary.metadata?.countries) {
        itinerary.metadata.countries.forEach(country => countries.add(country));
      }
    });
    return Array.from(countries).sort();
  }, [itineraries]);

  const uniqueYears = useMemo(() => {
    const years = new Set<string>();
    itineraries.forEach(itinerary => {
      const year = new Date(itinerary.startDate).getFullYear().toString();
      years.add(year);
    });
    return Array.from(years).sort((a, b) => b.localeCompare(a)); // Sort descending
  }, [itineraries]);

  // Filter itineraries based on search term and filters
  const filteredItineraries = useMemo(() => {
    function normalize(str: string): string {
      return (str || '')
        .toLowerCase()
        .normalize('NFD')
        .replace(/\p{Diacritic}/gu, '');
    }

    function levenshtein(a: string, b: string): number {
      const m = a.length;
      const n = b.length;
      if (m === 0) return n;
      if (n === 0) return m;
      const dp = new Array(n + 1);
      for (let j = 0; j <= n; j++) dp[j] = j;
      for (let i = 1; i <= m; i++) {
        let prev = i - 1;
        dp[0] = i;
        for (let j = 1; j <= n; j++) {
          const temp = dp[j];
          const cost = a[i - 1] === b[j - 1] ? 0 : 1;
          dp[j] = Math.min(dp[j] + 1, dp[j - 1] + 1, prev + cost);
          prev = temp;
        }
      }
      return dp[n];
    }

    function fuzzyContains(text: string, query: string): boolean {
      const t = normalize(text);
      const q = normalize(query);
      if (!q) return true;
      if (t.includes(q)) return true;
      const qTokens = q.split(/\s+/).filter(Boolean);
      const tTokens = t.split(/[^a-z0-9]+/).filter(Boolean);
      // Every query token should approximately match some token in text
      return qTokens.every(qt => {
        const threshold = Math.max(1, Math.floor(qt.length * 0.34));
        return tTokens.some(tt => {
          if (tt.includes(qt)) return true;
          const d = levenshtein(tt, qt);
          return d <= threshold;
        });
      });
    }

    return itineraries.filter(itinerary => {
      // Search term filter
      const query = debouncedTerm.toLowerCase();
      const matchesSearch =
        query === '' ||
        fuzzyContains(itinerary.title, query) ||
        fuzzyContains(itinerary.description || '', query) ||
        itinerary.metadata?.countries?.some(country =>
          fuzzyContains(country, query)
        );

      // Country filter
      const matchesCountry =
        selectedCountry === '' ||
        itinerary.metadata?.countries?.includes(selectedCountry);

      // Year filter
      const matchesYear =
        selectedYear === '' ||
        new Date(itinerary.startDate).getFullYear().toString() === selectedYear;

      return matchesSearch && matchesCountry && matchesYear;
    });
  }, [itineraries, debouncedTerm, selectedCountry, selectedYear]);

  // Visible lists (mobile collapsible)
  const visibleYears = useMemo(() => {
    const list = uniqueYears;
    if (!isSmall || showMoreYears) return list;
    const max = 6;
    if (!selectedYear || list.includes(selectedYear)) {
      return list.slice(0, max);
    }
    // Ensure selected appears if outside window
    return [selectedYear, ...list.filter(y => y !== selectedYear)].slice(
      0,
      max
    );
  }, [uniqueYears, isSmall, showMoreYears, selectedYear]);

  const visibleCountries = useMemo(() => {
    const list = uniqueCountries;
    if (!isSmall || showMoreCountries) return list;
    const max = 8;
    if (!selectedCountry || list.includes(selectedCountry)) {
      return list.slice(0, max);
    }
    return [selectedCountry, ...list.filter(c => c !== selectedCountry)].slice(
      0,
      max
    );
  }, [uniqueCountries, isSmall, showMoreCountries, selectedCountry]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading itineraries...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">❌</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Error loading itineraries
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none">
        <div
          className={`${styles.floating} absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-[#667eea]/10 to-[#764ba2]/10 rounded-full blur-3xl`}
        ></div>
        <div
          className={`${styles.floating} absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-[#667eea]/8 to-[#764ba2]/8 rounded-full blur-3xl`}
          style={{ animationDelay: '3s' }}
        ></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 lg:py-12 pb-8">
        {/* Fixed Back to Map Button */}
        <div className="fixed top-4 left-4 z-50 sm:top-4 sm:left-4">
          <button
            onClick={() => router.push('/')}
            className="group inline-flex items-center px-3 py-2 sm:px-4 sm:py-3 lg:px-5 lg:py-3 border-2 border-gray-200 shadow-lg text-xs sm:text-sm lg:text-base font-semibold rounded-lg sm:rounded-xl text-gray-700 bg-white/95 backdrop-blur-sm hover:bg-white hover:border-[#667eea] hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#667eea] transition-all duration-200 transform hover:scale-105"
          >
            <svg
              className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 mr-1 sm:mr-2 lg:mr-3 group-hover:-translate-x-1 transition-transform duration-200"
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
            <span>Back to map</span>
          </button>
        </div>

        {/* Header Section */}
        <div
          className={`${styles.headerContainer} text-center mb-8 sm:mb-12 md:mb-16 pt-16 sm:pt-8`}
        >
          <div className="inline-flex items-center justify-center p-3 sm:p-4 md:p-6 bg-white/95 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg mb-4 sm:mb-6">
            <span className="text-3xl sm:text-5xl md:text-6xl mr-2 sm:mr-4 md:mr-6 animate-bounce">
              🗺️
            </span>
            <h1
              className={`${styles.gradientText} text-3xl sm:text-5xl md:text-6xl font-bold`}
            >
              Travel Itineraries
            </h1>
            <span className="text-3xl sm:text-5xl md:text-6xl ml-2 sm:ml-4 md:ml-6 animate-pulse">
              ✈️
            </span>
          </div>
          <p className="text-lg sm:text-xl text-gray-700 max-w-2xl mx-auto leading-relaxed px-4">
            Explore your travel itineraries and discover new destinations around
            the world
          </p>
          <div className="mt-4 sm:mt-6 flex items-center justify-center space-x-2 text-xs sm:text-sm text-gray-500">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
              <span>
                {filteredItineraries.length} of {itineraries.length} itineraries
              </span>
            </div>
            <span className="hidden sm:inline">•</span>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
              <span>Ready to explore</span>
            </div>
          </div>
        </div>

        {/* Search and Filters Section */}
        <div className="mb-8 sm:mb-12 bg-white/95 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8">
          <div className="flex flex-col gap-4 sm:gap-6">
            {/* Search Input */}
            <div>
              <label
                htmlFor="search"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Search itineraries
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  id="search"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  placeholder="Search by title, description, or country..."
                  ref={searchInputRef}
                  className="block w-full pl-10 pr-10 py-2 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-[#667eea] focus:border-[#667eea] transition-colors duration-150"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    aria-label="Clear search"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                )}
              </div>
              <p className="mt-2 text-xs text-gray-500">
                Press &apos;/&apos; to focus, Esc to clear
              </p>
            </div>

            {/* Year Filter (chips directly under search) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Year
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedYear('')}
                  className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                    selectedYear === ''
                      ? 'bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white border-transparent'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-[#667eea]'
                  }`}
                  aria-pressed={selectedYear === ''}
                >
                  All years
                </button>
                {visibleYears.map(year => (
                  <button
                    key={year}
                    type="button"
                    onClick={() => setSelectedYear(year)}
                    className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                      selectedYear === year
                        ? 'bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white border-transparent'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-[#667eea]'
                    }`}
                    aria-pressed={selectedYear === year}
                  >
                    {year}
                  </button>
                ))}
              </div>
              {isSmall && uniqueYears.length > visibleYears.length && (
                <button
                  type="button"
                  onClick={() => setShowMoreYears(true)}
                  className="mt-2 text-xs text-[#667eea] underline"
                >
                  Show more years
                </button>
              )}
            </div>

            {/* Country Filter (chips stacked under year) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Country
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedCountry('')}
                  className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                    selectedCountry === ''
                      ? 'bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white border-transparent'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-[#667eea]'
                  }`}
                  aria-pressed={selectedCountry === ''}
                >
                  All countries
                </button>
                {visibleCountries.map(country => (
                  <button
                    key={country}
                    type="button"
                    onClick={() => setSelectedCountry(country)}
                    className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                      selectedCountry === country
                        ? 'bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white border-transparent'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-[#667eea]'
                    }`}
                    aria-pressed={selectedCountry === country}
                  >
                    {country}
                  </button>
                ))}
              </div>
              {isSmall && uniqueCountries.length > visibleCountries.length && (
                <button
                  type="button"
                  onClick={() => setShowMoreCountries(true)}
                  className="mt-2 text-xs text-[#667eea] underline"
                >
                  Show more countries
                </button>
              )}
            </div>
          </div>

          {/* Clear Filters Button */}
          {(searchTerm || selectedCountry || selectedYear) && (
            <div className="mt-4 sm:mt-6 flex justify-center">
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCountry('');
                  setSelectedYear('');
                }}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#667eea] transition-colors duration-150"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                Clear filters
              </button>
            </div>
          )}
        </div>

        {/* Results Section */}
        {filteredItineraries.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No itineraries found
            </h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search terms or filters to find what
              you&apos;re looking for.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCountry('');
                setSelectedYear('');
              }}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white rounded-xl hover:from-[#5a67d8] hover:to-[#6b46c1] transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 lg:gap-12 pb-20">
            {filteredItineraries.map((itinerary, index) => (
              <div
                key={itinerary.id}
                className={`${styles.itineraryCard} group relative bg-white/95 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-500 cursor-pointer transform hover:-translate-y-4 hover:scale-[1.02] border border-white/20 hover:border-[#667eea]/30 overflow-hidden`}
                onClick={() => handleItinerarySelect(itinerary)}
                style={{
                  animationDelay: `${index * 100}ms`,
                  animation: 'fadeInUp 0.8s ease-out forwards',
                }}
              >
                {/* Cover Image Section */}
                <div className="relative h-48 sm:h-56 lg:h-64 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#667eea]/20 to-[#764ba2]/20 group-hover:opacity-0 transition-opacity duration-500"></div>

                  {itinerary.image ? (
                    <img
                      src={itinerary.image}
                      alt={`${itinerary.title} destination`}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#667eea]/10 to-[#764ba2]/10 flex items-center justify-center">
                      <span className="text-6xl sm:text-7xl lg:text-8xl opacity-50">
                        {getTravelEmoji(itinerary)}
                      </span>
                    </div>
                  )}

                  {/* Overlay with info */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  {/* Top right badge */}
                  <div className="absolute top-4 right-4">
                    <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold bg-white/90 backdrop-blur-sm text-gray-800 shadow-lg border border-white/20">
                      📍{' '}
                      {itinerary.metadata?.pointsCount ||
                        itinerary.points.length}{' '}
                      places
                    </span>
                  </div>

                  {/* Bottom left info */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="inline-flex items-center px-2 py-1 rounded-lg text-xs font-semibold bg-white/90 backdrop-blur-sm text-gray-800">
                        📅 {new Date(itinerary.startDate).getFullYear()}
                      </span>
                      {itinerary.metadata?.countries && (
                        <span className="inline-flex items-center px-2 py-1 rounded-lg text-xs font-semibold bg-white/90 backdrop-blur-sm text-gray-800">
                          🌍 {itinerary.metadata.countries[0]}
                          {itinerary.metadata.countries.length > 1
                            ? ' +' + (itinerary.metadata.countries.length - 1)
                            : ''}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Content Section */}
                <div className="relative p-6 sm:p-8">
                  {/* Title and metadata */}
                  <div className="mb-4">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 group-hover:text-[#667eea] transition-colors duration-300 leading-tight mb-2">
                      {itinerary.title}
                    </h2>

                    {/* Country flags */}
                    <div className="flex items-center space-x-2 mb-3">
                      <span className="text-lg sm:text-xl md:text-2xl">
                        {getCountryFlags(itinerary)}
                      </span>
                      <span className="text-sm text-gray-500 font-medium">
                        {itinerary.metadata?.countries?.join(' & ')}
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  {itinerary.description && (
                    <p className="text-gray-600 mb-6 text-sm sm:text-base leading-relaxed line-clamp-3">
                      {itinerary.description}
                    </p>
                  )}

                  {/* Travel dates */}
                  <div className="flex items-center text-sm text-gray-600 mb-6 bg-gradient-to-r from-[#667eea]/5 to-[#764ba2]/5 rounded-xl p-4 border border-[#667eea]/20">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-[#667eea] to-[#764ba2] rounded-lg flex items-center justify-center">
                        <svg
                          className="w-4 h-4 sm:w-5 sm:h-5 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-3">
                      <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                        Travel Dates
                      </p>
                      <p className="text-xs sm:text-sm font-semibold text-gray-900">
                        {formatDate(itinerary.startDate)} -{' '}
                        {formatDate(itinerary.endDate)}
                      </p>
                    </div>
                  </div>

                  {/* Action button */}
                  <button className="group/btn w-full inline-flex items-center justify-center px-6 py-3 border-2 border-transparent text-sm sm:text-base font-semibold rounded-xl text-white bg-gradient-to-br from-[#667eea] to-[#764ba2] hover:from-[#5a67d8] hover:to-[#6b46c1] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#667eea] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
                    <span className="hidden sm:inline">View itinerary</span>
                    <span className="sm:hidden">View</span>
                    <svg
                      className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </div>

                {/* Decorative elements */}
                <div className="absolute top-6 right-6 w-2 h-2 bg-[#667eea]/30 rounded-full group-hover:bg-[#667eea] transition-colors duration-500"></div>
                <div className="absolute bottom-6 left-6 w-1 h-1 bg-[#764ba2]/30 rounded-full group-hover:bg-[#764ba2] transition-colors duration-500"></div>

                {/* Shine effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
