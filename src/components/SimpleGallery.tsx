import { useState } from 'react';

interface SimpleGalleryProps {
    photos: string[];
    cityName: string;
    onClose: () => void;
}

export function SimpleGallery({ photos, cityName, onClose }: SimpleGalleryProps) {
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextPhoto = () => {
        setCurrentIndex((prev) => (prev + 1) % photos.length);
    };

    const prevPhoto = () => {
        setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);
    };

    if (!photos || photos.length === 0) {
        return null;
    }

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999
        }}>
            <div style={{
                position: 'relative',
                maxWidth: '90vw',
                maxHeight: '90vh',
                backgroundColor: 'white',
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
            }}>
                {/* Header */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '20px',
                    backgroundColor: '#f8f9fa',
                    borderBottom: '1px solid #e9ecef'
                }}>
                    <h2 style={{ 
                        fontSize: '24px', 
                        fontWeight: 'bold', 
                        margin: 0,
                        color: '#333'
                    }}>
                        📸 {cityName}
                    </h2>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'none',
                            border: 'none',
                            fontSize: '28px',
                            cursor: 'pointer',
                            color: '#666',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            transition: 'background-color 0.2s'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#e9ecef'}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                        ×
                    </button>
                </div>

                {/* Photo Container */}
                <div style={{ position: 'relative', backgroundColor: '#000' }}>
                    <img
                        src={photos[currentIndex]}
                        alt={`${cityName} - Photo ${currentIndex + 1}`}
                        style={{
                            width: '100%',
                            height: 'auto',
                            maxHeight: '70vh',
                            objectFit: 'contain',
                            display: 'block'
                        }}
                        onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.nextElementSibling!.style.display = 'flex';
                        }}
                    />
                    <div style={{
                        display: 'none',
                        width: '100%',
                        height: '400px',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#f8f9fa',
                        color: '#666',
                        fontSize: '18px'
                    }}>
                        🖼️ Imagem não disponível
                    </div>
                    
                    {/* Navigation arrows */}
                    {photos.length > 1 && (
                        <>
                            <button
                                onClick={prevPhoto}
                                style={{
                                    position: 'absolute',
                                    left: '20px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '50%',
                                    width: '50px',
                                    height: '50px',
                                    cursor: 'pointer',
                                    fontSize: '24px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    transition: 'background-color 0.2s'
                                }}
                                onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.9)'}
                                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.7)'}
                            >
                                ‹
                            </button>
                            <button
                                onClick={nextPhoto}
                                style={{
                                    position: 'absolute',
                                    right: '20px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '50%',
                                    width: '50px',
                                    height: '50px',
                                    cursor: 'pointer',
                                    fontSize: '24px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    transition: 'background-color 0.2s'
                                }}
                                onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.9)'}
                                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.7)'}
                            >
                                ›
                            </button>
                        </>
                    )}
                </div>

                {/* Footer with counter and thumbnails */}
                <div style={{
                    padding: '20px',
                    backgroundColor: '#f8f9fa',
                    borderTop: '1px solid #e9ecef'
                }}>
                    {/* Photo counter */}
                    {photos.length > 1 && (
                        <div style={{
                            textAlign: 'center',
                            marginBottom: '15px',
                            color: '#666',
                            fontSize: '16px',
                            fontWeight: '500'
                        }}>
                            📷 {currentIndex + 1} de {photos.length}
                        </div>
                    )}

                    {/* Thumbnails */}
                    {photos.length > 1 && (
                        <div style={{
                            display: 'flex',
                            gap: '10px',
                            overflowX: 'auto',
                            padding: '10px 0',
                            justifyContent: 'center'
                        }}>
                            {photos.map((photo, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentIndex(index)}
                                    style={{
                                        flexShrink: 0,
                                        width: '60px',
                                        height: '60px',
                                        borderRadius: '8px',
                                        overflow: 'hidden',
                                        border: index === currentIndex ? '3px solid #007bff' : '2px solid #dee2e6',
                                        cursor: 'pointer',
                                        transition: 'border-color 0.2s'
                                    }}
                                    onMouseOver={(e) => {
                                        if (index !== currentIndex) {
                                            e.currentTarget.style.borderColor = '#adb5bd';
                                        }
                                    }}
                                    onMouseOut={(e) => {
                                        if (index !== currentIndex) {
                                            e.currentTarget.style.borderColor = '#dee2e6';
                                        }
                                    }}
                                >
                                    <img
                                        src={photo}
                                        alt={`Thumbnail ${index + 1}`}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover'
                                        }}
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