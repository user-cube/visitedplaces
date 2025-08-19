import { useRouter } from 'next/router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useGalleries } from '../../hooks/useGalleries';

export default function GalleriesList() {
  const router = useRouter();
  const { galleries, loading, error } = useGalleries();
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedTerm, setDebouncedTerm] = useState('');
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('galleries:lastQuery');
      if (saved) setSearchTerm(saved);
    } catch {}
  }, []);

  // Add class to body to enable scrolling
  useEffect(() => {
    document.body.classList.add('gallery-page');
    return () => document.body.classList.remove('gallery-page');
  }, []);

  useEffect(() => {
    const id = setTimeout(() => {
      setDebouncedTerm(searchTerm.trim());
      try {
        localStorage.setItem('galleries:lastQuery', searchTerm.trim());
      } catch {}
    }, 200);
    return () => clearTimeout(id);
  }, [searchTerm]);

  const uniqueYears = useMemo(() => {
    const years = new Set<number>();
    galleries.forEach(g => {
      if (g.year) years.add(g.year);
    });
    return Array.from(years)
      .map(String)
      .sort((a, b) => b.localeCompare(a));
  }, [galleries]);

  const uniqueCountries = useMemo(() => {
    const countries = new Set<string>();
    galleries.forEach(g => {
      const c = g.location?.country;
      if (c) countries.add(c);
    });
    return Array.from(countries).sort((a, b) => a.localeCompare(b));
  }, [galleries]);

  const filtered = useMemo(() => {
    const q = debouncedTerm.toLowerCase();
    return galleries.filter(g => {
      const matchesSearch =
        !q ||
        g.title.toLowerCase().includes(q) ||
        (g.description || '').toLowerCase().includes(q) ||
        (g.tags || []).some(t => t.toLowerCase().includes(q)) ||
        (g.location?.city || '').toLowerCase().includes(q) ||
        (g.location?.country || '').toLowerCase().includes(q);
      const matchesYear =
        !selectedYear || String(g.year || '') === selectedYear;
      const matchesCountry =
        !selectedCountry || g.location?.country === selectedCountry;
      return matchesSearch && matchesYear && matchesCountry;
    });
  }, [galleries, debouncedTerm, selectedYear, selectedCountry]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#667eea] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading galleries...</p>
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
            Error loading galleries
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-auto bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 pb-20">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 lg:py-12">
        <div className="fixed top-4 left-4 z-50 sm:top-4 sm:left-4">
          <button
            onClick={() => router.push('/')}
            className="group inline-flex items-center px-3 py-2 sm:px-4 sm:py-3 border-2 border-gray-200 shadow-lg text-xs sm:text-sm lg:text-base font-semibold rounded-lg sm:rounded-xl text-gray-700 bg-white/95 backdrop-blur-sm hover:bg-white hover:border-[#667eea] hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#667eea] transition-all duration-200 transform hover:scale-105"
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

        <div className="text-center mb-8 sm:mb-12 md:mb-16 pt-16 sm:pt-8">
          <div className="inline-flex items-center justify-center p-3 sm:p-4 md:p-6 bg-white/95 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg mb-4 sm:mb-6">
            <span className="text-3xl sm:text-5xl md:text-6xl mr-2 sm:mr-4 md:mr-6">
              📸
            </span>
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">
              Photo Galleries
            </h1>
            <span className="text-3xl sm:text-5xl md:text-6xl ml-2 sm:ml-4 md:ml-6">
              🖼️
            </span>
          </div>
          <p className="text-lg sm:text-xl text-gray-700 max-w-2xl mx-auto leading-relaxed px-4">
            Browse curated photo sets from your trips
          </p>
          <div className="mt-4 sm:mt-6 flex items-center justify-center space-x-2 text-xs sm:text-sm text-gray-500">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
              <span>
                {filtered.length} of {galleries.length} galleries
              </span>
            </div>
          </div>
        </div>

        <div className="mb-8 sm:mb-12 bg-white/95 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8">
          <div className="flex flex-col gap-4 sm:gap-6">
            <div>
              <label
                htmlFor="search"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Search galleries
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
                  placeholder="Search by title, description, or tag..."
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
                {uniqueYears.map(year => (
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
            </div>

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
                {uniqueCountries.map(country => {
                  return (
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
                  );
                })}
              </div>
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

        {filtered.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No galleries found
            </h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search terms or filters.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedYear('');
                setSelectedCountry('');
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 lg:gap-12 pb-40">
            {filtered.map((g, index) => (
              <div
                key={g.id}
                className={`group relative bg-white/95 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-500 cursor-pointer transform hover:-translate-y-4 hover:scale-[1.02] border border-white/20 hover:border-[#667eea]/30 overflow-hidden`}
                onClick={() => router.push(`/galleries/${g.id}`)}
                style={{
                  animationDelay: `${index * 100}ms`,
                  animation: 'fadeInUp 0.8s ease-out forwards',
                }}
              >
                {/* Cover Image Section */}
                <div className="relative h-48 sm:h-56 lg:h-64 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#667eea]/20 to-[#764ba2]/20 group-hover:opacity-0 transition-opacity duration-500"></div>

                  {g.image ? (
                    <img
                      src={g.image}
                      alt={`${g.title} cover`}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#667eea]/10 to-[#764ba2]/10 flex items-center justify-center">
                      <span className="text-6xl sm:text-7xl lg:text-8xl opacity-50">
                        🖼️
                      </span>
                    </div>
                  )}

                  {/* Overlay with info */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  {/* Top right badge */}
                  <div className="absolute top-4 right-4">
                    <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold bg-white/90 backdrop-blur-sm text-gray-800 shadow-lg border border-white/20">
                      📸 {g.photosCount ?? '—'} photos
                    </span>
                  </div>

                  {/* Bottom left info */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center space-x-2 mb-2">
                      {g.year && (
                        <span className="inline-flex items-center px-2 py-1 rounded-lg text-xs font-semibold bg-white/90 backdrop-blur-sm text-gray-800">
                          📅 {g.year}
                        </span>
                      )}
                      {g.location?.country && (
                        <span className="inline-flex items-center px-2 py-1 rounded-lg text-xs font-semibold bg-white/90 backdrop-blur-sm text-gray-800">
                          {g.location.flag || '🌍'} {g.location.country}
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
                      {g.title}
                    </h2>

                    {/* Tags */}
                    {(g.tags || []).length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {(g.tags || []).slice(0, 3).map((tag, tagIndex) => (
                          <span
                            key={tagIndex}
                            className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gradient-to-r from-[#667eea]/10 to-[#764ba2]/10 text-[#4f46e5] border border-[#667eea]/20"
                          >
                            #{tag}
                          </span>
                        ))}
                        {(g.tags || []).length > 3 && (
                          <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium text-gray-500">
                            +{(g.tags || []).length - 3} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  {g.description && (
                    <p className="text-gray-600 mb-6 text-sm sm:text-base leading-relaxed line-clamp-3">
                      {g.description}
                    </p>
                  )}

                  {/* Location badges */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex flex-wrap gap-2">
                      {g.location?.city && (
                        <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-[#667eea]/10 to-[#764ba2]/10 text-[#4f46e5] border border-[#667eea]/20">
                          {g.location.city}
                          {g.location?.country && (
                            <span className="ml-1">
                              {g.location.flag || '🌍'}
                            </span>
                          )}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Action button */}
                  <button className="group/btn w-full inline-flex items-center justify-center px-6 py-3 border-2 border-transparent text-sm sm:text-base font-semibold rounded-xl text-white bg-gradient-to-br from-[#667eea] to-[#764ba2] hover:from-[#5a67d8] hover:to-[#6b46c1] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#667eea] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
                    <span className="hidden sm:inline">View gallery</span>
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
