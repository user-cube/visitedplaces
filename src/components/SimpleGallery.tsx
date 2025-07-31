import { useState } from 'react';
import Image from 'next/image';

interface SimpleGalleryProps {
  photos: string[];
  cityName: string;
  onClose: () => void;
}

export function SimpleGallery({
  photos,
  cityName,
  onClose,
}: SimpleGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextPhoto = () => {
    setCurrentIndex(prev => (prev + 1) % photos.length);
  };

  const prevPhoto = () => {
    setCurrentIndex(prev => (prev - 1 + photos.length) % photos.length);
  };

  if (!photos || photos.length === 0) {
    return null;
  }

  return (
    <div className="simple-gallery-overlay">
      <div className="simple-gallery-container">
        {/* Header */}
        <div className="simple-gallery-header">
          <h2 className="simple-gallery-title">
            📸 {cityName}
          </h2>
          <button
            onClick={onClose}
            className="simple-gallery-close-button"
          >
            ×
          </button>
        </div>

        {/* Photo Container */}
        <div className="simple-gallery-photo-container">
          <Image
            src={photos[currentIndex]}
            alt={`${cityName} - Photo ${currentIndex + 1}`}
            width={800}
            height={600}
            className="simple-gallery-photo"
            unoptimized
            onError={e => {
              e.currentTarget.style.display = 'none';
              const nextSibling = e.currentTarget
                .nextElementSibling as HTMLElement;
              if (nextSibling) {
                nextSibling.style.display = 'flex';
              }
            }}
          />
          <div className="simple-gallery-photo-error">
            🖼️ Imagem não disponível
          </div>

          {/* Navigation arrows */}
          {photos.length > 1 && (
            <>
              <button
                onClick={prevPhoto}
                className="simple-gallery-nav-button prev"
              >
                ‹
              </button>
              <button
                onClick={nextPhoto}
                className="simple-gallery-nav-button next"
              >
                ›
              </button>
            </>
          )}
        </div>

        {/* Footer with counter and thumbnails */}
        <div className="simple-gallery-footer">
          {/* Photo counter */}
          {photos.length > 1 && (
            <div className="simple-gallery-counter">
              📷 {currentIndex + 1} de {photos.length}
            </div>
          )}

          {/* Thumbnails */}
          {photos.length > 1 && (
            <div className="simple-gallery-thumbnails">
              {photos.map((photo, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`simple-gallery-thumbnail ${
                    index === currentIndex ? 'selected' : ''
                  }`}
                >
                  <Image
                    src={photo}
                    alt={`Thumbnail ${index + 1}`}
                    width={60}
                    height={60}
                    className="simple-gallery-thumbnail-image"
                    unoptimized
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
