import React from 'react';
import CircularGallery from './Components/CircularGallery/CircularGallery';
import './Gallery.css';

const PhotoAlbums = ({ currentLanguage }) => {
  const generateRandomPhotos = (count) => {
    const photos = [];
    for (let i = 0; i < count; i++) {
      photos.push({
        image: `https://picsum.photos/seed/${Math.floor(Math.random() * 1000)}/800/600`,
        text: `Photo ${i + 1}`,
      });
    }
    return photos;
  };

  const randomPhotos = generateRandomPhotos(30);

  return (
    <section className="photo-albums page-section">
      <div className="team-category-section">
        <div className="container">
          <h2 className="section-title" data-en="Our Company in Photos" data-ar="شركتنا في صور">
            {currentLanguage === 'en' ? 'Our Company in Photos' : 'شركتنا في صور'}
          </h2>
          <div className="circular-gallery-container">
            <CircularGallery items={randomPhotos} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default PhotoAlbums;