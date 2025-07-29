import { useState } from 'react';

interface PhotoGalleryProps {
    photos: string[];
    cityName: string;
    onClose: () => void;
}

export function PhotoGallery({ photos, cityName, onClose }: PhotoGalleryProps) {
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

    const nextPhoto = () => {
        setCurrentPhotoIndex((prev) => (prev + 1) % photos.length);
    };

    const prevPhoto = () => {
        setCurrentPhotoIndex((prev) => (prev - 1 + photos.length) % photos.length);
    };

    if (photos.length === 0) {
        return null;
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="relative max-w-4xl max-h-[90vh] bg-white rounded-lg overflow-hidden">
                {/* Header */}
                <div className="flex justify-between items-center p-4 bg-gray-100">
                    <h2 className="text-xl font-bold">{cityName}</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-600 hover:text-gray-800 text-2xl"
                    >
                        ×
                    </button>
                </div>

                {/* Photo */}
                <div className="relative">
                    <img
                        src={photos[currentPhotoIndex]}
                        alt={`${cityName} - Photo ${currentPhotoIndex + 1}`}
                        className="w-full h-auto max-h-[70vh] object-cover"
                    />
                    
                    {/* Navigation arrows */}
                    {photos.length > 1 && (
                        <>
                            <button
                                onClick={prevPhoto}
                                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75"
                            >
                                ‹
                            </button>
                            <button
                                onClick={nextPhoto}
                                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75"
                            >
                                ›
                            </button>
                        </>
                    )}
                </div>

                {/* Photo counter */}
                {photos.length > 1 && (
                    <div className="p-4 text-center text-gray-600">
                        {currentPhotoIndex + 1} / {photos.length}
                    </div>
                )}

                {/* Thumbnails */}
                {photos.length > 1 && (
                    <div className="p-4 bg-gray-50 flex gap-2 overflow-x-auto">
                        {photos.map((photo, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentPhotoIndex(index)}
                                className={`flex-shrink-0 w-16 h-16 rounded overflow-hidden ${
                                    index === currentPhotoIndex ? 'ring-2 ring-blue-500' : ''
                                }`}
                            >
                                <img
                                    src={photo}
                                    alt={`Thumbnail ${index + 1}`}
                                    className="w-full h-full object-cover"
                                />
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
} 