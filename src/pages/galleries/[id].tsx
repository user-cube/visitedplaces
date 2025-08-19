import { useRouter } from 'next/router';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Gallery } from '../../types/index';

interface GalleryPageProps {
  gallery?: Gallery;
}

export default function GalleryPage({ gallery }: GalleryPageProps) {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    document.body.classList.add('itinerary-page');
    return () => document.body.classList.remove('itinerary-page');
  }, []);

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

  const photos = gallery.photos || [];
  const next = () => setCurrentIndex(prev => (prev + 1) % photos.length);
  const prev = () =>
    setCurrentIndex(prev => (prev - 1 + photos.length) % photos.length);

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

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12">
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
          <div className="relative bg-white rounded-xl shadow-lg overflow-hidden">
            <Image
              src={photos[currentIndex]}
              alt={`${gallery.title} - ${currentIndex + 1}`}
              width={1200}
              height={800}
              className="w-full h-auto max-h-[70vh] object-contain bg-black"
              unoptimized
            />
            {photos.length > 1 && (
              <>
                <button
                  onClick={prev}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/60 text-white p-2 rounded-full hover:bg-black/80"
                >
                  ‹
                </button>
                <button
                  onClick={next}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/60 text-white p-2 rounded-full hover:bg-black/80"
                >
                  ›
                </button>
              </>
            )}
          </div>
        )}

        {photos.length > 1 && (
          <div className="mt-4 flex gap-2 overflow-x-auto">
            {photos.map((p, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`flex-shrink-0 w-20 h-14 rounded overflow-hidden border ${i === currentIndex ? 'ring-2 ring-[#667eea]' : 'border-gray-200'}`}
              >
                <Image
                  src={p}
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
  } catch (e) {
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
  } catch (e) {
    return { notFound: true };
  }
}
