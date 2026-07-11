import React, { useState, useEffect } from 'react';
import './Carousel.css';

const Carousel = ({ items }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [fullScreenImage, setFullScreenImage] = useState(null);
  const [mediaLoading, setMediaLoading] = useState(true);

  if (!items || items.length === 0) {
    return (
      <div className="carousel-container" style={{ minHeight: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(240, 240, 240, 0.8)', borderRadius: '8px', color: '#555' }}>
        <span>No media available</span>
      </div>
    );
  }

  const minSwipeDistance = 50;

  // Reset loading state when index changes
  useEffect(() => {
    setMediaLoading(true);
  }, [currentIndex]);

  const goToPrevious = () => {
    const isFirstItem = currentIndex === 0;
    const newIndex = isFirstItem ? items.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const goToNext = () => {
    const isLastItem = currentIndex === items.length - 1;
    const newIndex = isLastItem ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  const onTouchStart = (e) => {
    setTouchEnd(0);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe) {
      goToNext();
    }
    if (isRightSwipe) {
      goToPrevious();
    }
  };

  const handleDoubleClick = () => {
    const currentItem = items[currentIndex];
    if (!currentItem.url.endsWith('.mp4')) {
      setFullScreenImage(currentItem.url);
    }
  };

  const closeFullScreenImage = () => {
    setFullScreenImage(null);
  };

  const currentItem = items[currentIndex];
  const isVideo = currentItem.url.endsWith('.mp4');

  return (
    <div
      className="carousel-container"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <button onClick={goToPrevious} className="carousel-button prev-button">‹</button>
      <div className="carousel-item" style={{ position: 'relative', minHeight: '300px' }}>
        {mediaLoading && (
          <div className="skeleton-loader-spinner" style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(240, 240, 240, 0.8)',
            borderRadius: '8px',
            color: '#555',
            fontSize: '1.2rem'
          }}>
            <span>Loading Media...</span>
          </div>
        )}
        {isVideo ? (
          <video 
            src={currentItem.url} 
            controls 
            muted 
            loop 
            onLoadedData={() => setMediaLoading(false)}
            onError={(e) => {
              console.error("Failed to load carousel video:", currentItem.url);
              setMediaLoading(false);
            }}
            style={{ width: '100%', borderRadius: '8px', display: mediaLoading ? 'none' : 'block' }}
          />
        ) : (
          <img 
            src={currentItem.url} 
            alt={currentItem.title} 
            onDoubleClick={handleDoubleClick} 
            loading="eager"
            onLoad={() => setMediaLoading(false)}
            onError={(e) => {
              console.error("Failed to load carousel image:", currentItem.url);
              setMediaLoading(false);
            }}
            style={{ width: '100%', borderRadius: '8px', display: mediaLoading ? 'none' : 'block' }}
          />
        )}
      </div>
      <button onClick={goToNext} className="carousel-button next-button">›</button>

      {fullScreenImage && (
        <div className="fullscreen-overlay" onClick={closeFullScreenImage}>
          <img src={fullScreenImage} alt="Full screen" className="fullscreen-image" />
          <button className="fullscreen-close-button">X</button>
        </div>
      )}
    </div>
  );
};

export default Carousel;