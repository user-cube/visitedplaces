import { useRouter } from 'next/router';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { Gallery, GalleryPhoto } from '../../types/index';

interface GalleryPageProps {
  gallery?: Gallery;
}

export default function GalleryPage({ gallery }: GalleryPageProps) {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [edgeToEdge, setEdgeToEdge] = useState(false);
  const viewerRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    document.body.classList.add('itinerary-page');
    return () => document.body.classList.remove('itinerary-page');
  }, []);

  // Load persisted preference for edge-to-edge; default to true on wide screens if unset
  useEffect(() => {
    try {
      const saved = localStorage.getItem('galleries:edgeToEdge');
      if (saved === 'true' || saved === 'false') {
        setEdgeToEdge(saved === 'true');
      } else if (typeof window !== 'undefined' && window.innerWidth >= 1440) {
        setEdgeToEdge(true);
      }
    } catch {}
  }, []);

  // Persist preference when toggled
  useEffect(() => {
    try {
      localStorage.setItem('galleries:edgeToEdge', String(edgeToEdge));
    } catch {}
  }, [edgeToEdge]);

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        setCurrentIndex(prev => (prev + 1) % photos.length);
      } else if (e.key === 'ArrowLeft') {
        setCurrentIndex(prev => (prev - 1 + photos.length) % photos.length);
      } else if (e.key.toLowerCase() === 'f') {
        toggleFullscreen();
      } else if (e.key === 'Escape' && isFullscreen) {
        exitFullscreen();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFullscreen]);

  // Reset fade state when the index changes
  useEffect(() => {
    setImageLoaded(false);
  }, [currentIndex]);

  if (!gallery) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Gallery not found
          </h1>
          <button
            onClick={() => router.push('/galleries')}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-pink-600 hover:bg-pink-700"
          >
            Back to galleries
          </button>
        </div>
      </div>
    );
  }

  const photos: GalleryPhoto[] = (gallery.photos || []).map(p =>
    typeof p === 'string' ? { src: p } : (p as GalleryPhoto)
  );
  const next = () => setCurrentIndex(prev => (prev + 1) % photos.length);
  const prev = () =>
    setCurrentIndex(prev => (prev - 1 + photos.length) % photos.length);

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement && viewerRef.current) {
        await viewerRef.current.requestFullscreen();
        setIsFullscreen(true);
      } else if (document.fullscreenElement) {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch {}
  };

  const exitFullscreen = async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      }
      setIsFullscreen(false);
    } catch {}
  };

  const onTouchStart: React.TouchEventHandler = e => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd: React.TouchEventHandler = e => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const threshold = 30;
    if (dx > threshold) prev();
    else if (dx < -threshold) next();
    touchStartX.current = null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="fixed top-4 left-4 z-50">
        <button
          onClick={() => router.push('/galleries')}
          className="group inline-flex items-center px-3 py-2 sm:px-4 sm:py-3 border-2 border-gray-200 shadow-lg text-xs sm:text-sm font-semibold rounded-lg sm:rounded-xl text-gray-700 bg-white/95 backdrop-blur-sm hover:bg-white hover:border-[#667eea] hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#667eea] transition-all duration-200 transform hover:scale-105"
        >
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
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          <span className="hidden sm:inline">Back</span>
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
            {gallery.title}
          </h1>
          {gallery.description && (
            <p className="mt-2 text-gray-600 max-w-2xl mx-auto">
              {gallery.description}
            </p>
          )}
          <div className="mt-2 text-sm text-gray-500">
            {gallery.year && <span>{gallery.year}</span>}
            {gallery.location?.city && (
              <span>
                {' '}
                • {gallery.location.city}
                {gallery.location.country
                  ? `, ${gallery.location.country}`
                  : ''}
              </span>
            )}
          </div>
        </div>

        {photos.length > 0 && (
          <div
            ref={viewerRef}
            className={`relative ${edgeToEdge ? 'lg:rounded-none rounded-none' : 'rounded-2xl lg:rounded-3xl'} w-full bg-black/95 shadow-2xl overflow-hidden ring-1 ring-black/20 border border-white/10 backdrop-blur-sm`}
            style={
              edgeToEdge
                ? {
                    width: '100vw',
                    marginLeft: 'calc(50% - 50vw)',
                    marginRight: 'calc(50% - 50vw)',
                  }
                : undefined
            }
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            {/* Main image area with click-to-navigate */}
            <div
              className="relative w-full"
              onClick={e => {
                const rect = (
                  e.currentTarget as HTMLDivElement
                ).getBoundingClientRect();
                const x = e.clientX - rect.left;
                if (x < rect.width / 2) prev();
                else next();
              }}
            >
              <Image
                src={photos[currentIndex].src}
                alt={`${gallery.title} - ${currentIndex + 1}`}
                width={1600}
                height={1066}
                className={`w-full h-auto max-h-[72vh] transition-opacity duration-300 ${
                  isZoomed ? 'object-cover' : 'object-contain'
                } ${imageLoaded ? 'opacity-100' : 'opacity-0'} select-none`}
                unoptimized
                priority={currentIndex === 0}
                onLoad={() => setImageLoaded(true)}
                onLoadingComplete={() => setImageLoaded(true)}
              />

              {/* Top-left info pill */}
              <div className="absolute top-3 left-3 hidden sm:flex items-center gap-2 px-2.5 py-1.5 rounded-full bg-white/10 text-white text-xs border border-white/20 backdrop-blur">
                {gallery.year && <span>{gallery.year}</span>}
                {gallery.location?.city && (
                  <span className="opacity-90">
                    • {gallery.location.city}
                    {gallery.location?.country
                      ? `, ${gallery.location.country}`
                      : ''}
                  </span>
                )}
              </div>

              {/* Caption + counter overlay */}
              <div className="absolute bottom-0 left-0 right-0 text-white">
                <div className="px-3 sm:px-4 pb-3 sm:pb-4 bg-gradient-to-t from-black/70 via-black/30 to-transparent">
                  <div className="flex items-center justify-between text-[11px] sm:text-sm">
                    <div className="truncate pr-3 opacity-95">
                      {photos[currentIndex].caption || gallery.title}
                    </div>
                    <div className="opacity-90">
                      {currentIndex + 1} / {photos.length}
                    </div>
                  </div>
                </div>
                <div className="h-1 w-full bg-white/10">
                  <div
                    className="h-full bg-gradient-to-r from-[#667eea] to-[#764ba2]"
                    style={{
                      width: `${((currentIndex + 1) / photos.length) * 100}%`,
                    }}
                  />
                </div>
              </div>

              {/* Left/Right hover gradients with chevrons */}
              {photos.length > 1 && (
                <>
                  <button
                    aria-label="Previous photo"
                    onClick={prev}
                    className="absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity flex items-center justify-start pl-3"
                  >
                    <svg
                      className="w-8 h-8 text-white/90"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </button>
                  <button
                    aria-label="Next photo"
                    onClick={next}
                    className="absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity flex items-center justify-end pr-3"
                  >
                    <svg
                      className="w-8 h-8 text-white/90"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </>
              )}

              {/* Top-right controls */}
              <div className="absolute top-3 right-3 flex gap-2">
                <button
                  onClick={() => setIsZoomed(z => !z)}
                  className="px-2.5 py-1.5 rounded-md bg-white/10 hover:bg-white/20 text-white text-xs backdrop-blur border border-white/20"
                  title={isZoomed ? 'Fit' : 'Fill'}
                >
                  {isZoomed ? 'Fit' : 'Fill'}
                </button>
                <button
                  onClick={toggleFullscreen}
                  className="px-2.5 py-1.5 rounded-md bg-white/10 hover:bg-white/20 text-white text-xs backdrop-blur border border-white/20"
                  title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
                >
                  {isFullscreen ? 'Exit' : 'Full'}
                </button>
                <button
                  onClick={() => setEdgeToEdge(v => !v)}
                  className="px-2.5 py-1.5 rounded-md bg-white/10 hover:bg-white/20 text-white text-xs backdrop-blur border border-white/20"
                  title={edgeToEdge ? 'Default width' : 'Edge-to-edge'}
                >
                  ↔︎
                </button>
                <a
                  href={photos[currentIndex].src}
                  download
                  className="px-2.5 py-1.5 rounded-md bg-white/10 hover:bg-white/20 text-white text-xs backdrop-blur border border-white/20"
                  title="Download"
                >
                  ⬇︎
                </a>
              </div>
            </div>
          </div>
        )}

        {photos.length > 1 && (
          <div className="mt-4 flex gap-2 overflow-x-auto p-2 bg-white/70 rounded-xl shadow">
            {photos.map((p, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`flex-shrink-0 w-20 h-14 rounded-lg overflow-hidden border transition-transform hover:scale-[1.02] ${
                  i === currentIndex
                    ? 'ring-2 ring-[#667eea]'
                    : 'border-gray-200'
                }`}
              >
                <Image
                  src={p.src}
                  alt={`Thumb ${i + 1}`}
                  width={160}
                  height={112}
                  className="w-full h-full object-cover"
                  unoptimized
                />
              </button>
            ))}
          </div>
        )}

        {/* Preload next image for smoother nav */}
        {photos.length > 1 && (
          <link
            rel="preload"
            as="image"
            href={photos[(currentIndex + 1) % photos.length].src}
          />
        )}
      </div>
    </div>
  );
}

export async function getStaticPaths() {
  try {
    const fs = await import('fs');
    const path = await import('path');
    const base = path.default.join(process.cwd(), 'public/data/galleries');
    const indexFile = path.default.join(base, 'index.json');
    if (!fs.default.existsSync(indexFile)) {
      return { paths: [], fallback: false };
    }
    const indexData = JSON.parse(fs.default.readFileSync(indexFile, 'utf8'));
    const paths = indexData.galleries.map((g: { id: string }) => ({
      params: { id: g.id },
    }));
    return { paths, fallback: false };
  } catch {
    return { paths: [], fallback: false };
  }
}

export async function getStaticProps({ params }: { params: { id: string } }) {
  try {
    const fs = await import('fs');
    const path = await import('path');
    const base = path.default.join(process.cwd(), 'public/data/galleries');
    const indexFile = path.default.join(base, 'index.json');
    if (!fs.default.existsSync(indexFile)) {
      return { notFound: true };
    }
    const indexData = JSON.parse(fs.default.readFileSync(indexFile, 'utf8'));
    const match = indexData.galleries.find(
      (g: { id: string }) => g.id === params.id
    );
    if (!match) return { notFound: true };
    const filePath = path.default.join(base, match.file);
    if (!fs.default.existsSync(filePath)) return { notFound: true };
    const gallery = JSON.parse(fs.default.readFileSync(filePath, 'utf8'));
    return { props: { gallery } };
  } catch {
    return { notFound: true };
  }
}
