import React, { useEffect, useState } from 'react';
import './Credentials.css';
import useSEO from './hooks/useSEO';

const Credentials = ({ currentLanguage }) => {
  useSEO({
    title: currentLanguage === 'en' ? 'Credentials & Certificates' : 'اعتماداتنا وشهاداتنا',
    description: currentLanguage === 'en'
      ? 'Verify OSOS Engineering professional certifications, municipality licenses, commercial registrations, and official government credentials.'
      : 'تحقق من اعتمادات أسس البناء للاستشارات الهندسية المهنية، رخص البلديات، السجلات التجارية، والشهادات الحكومية الرسمية.',
    keywords: 'OSOS credentials, engineering licenses Saudi Arabia, commercial registration Makkah, municipal license, شهادات اعتمادات'
  });

  const [credentials, setCredentials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lightboxIndex, setLightboxIndex] = useState(null); // track active image index in lightbox

  const BLOB_STORAGE_BASE_URL = 'https://pc5a0jgn4xie1mys.public.blob.vercel-storage.com';

  useEffect(() => {
    const fetchCredentials = async () => {
      try {
        const response = await fetch('/api/get_credentials', { cache: 'no-store' });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setCredentials(data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchCredentials();
  }, []);

  // Keyboard navigation for Lightbox
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (lightboxIndex === null) return;
      if (e.key === 'Escape') {
        closeLightbox();
      } else if (e.key === 'ArrowRight') {
        navigateNext();
      } else if (e.key === 'ArrowLeft') {
        navigatePrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, credentials]);

  const openLightbox = (index) => {
    setLightboxIndex(index);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
    document.body.style.overflow = 'auto';
  };

  const navigateNext = () => {
    setLightboxIndex((prev) => (prev === credentials.length - 1 ? 0 : prev + 1));
  };

  const navigatePrev = () => {
    setLightboxIndex((prev) => (prev === 0 ? credentials.length - 1 : prev - 1));
  };

  const content = {
    en: {
      title: 'Osos Credentials',
      subtitle: 'Verified ISO certifications and engineering accreditations',
      viewCert: 'View Certificate',
    },
    ar: {
      title: 'شهادات اعتماد أسس',
      subtitle: 'شهادات الأيزو والاعتمادات الهندسية المعتمدة',
      viewCert: 'عرض الشهادة',
    },
  };

  const currentContent = content[currentLanguage];

  if (loading) {
    return (
      <section className="credentials-page page-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">{currentContent.title}</h2>
            <p className="section-subtitle">{currentContent.subtitle}</p>
          </div>
          <div className="credentials-loading">Loading credentials...</div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="credentials-page page-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">{currentContent.title}</h2>
            <p className="section-subtitle">{currentContent.subtitle}</p>
          </div>
          <div className="credentials-error">Error: {error.message}</div>
        </div>
      </section>
    );
  }

  // Format image URLs
  const formattedCredentials = credentials.map((cred) => {
    const cleanedPath = cred.image_url.replace(/ /g, '%20');
    const imageUrl = cleanedPath.startsWith('http')
      ? cleanedPath
      : `${BLOB_STORAGE_BASE_URL}${cleanedPath.startsWith('/') ? '' : '/'}${cleanedPath}`;
    return { ...cred, url: imageUrl };
  });

  return (
    <section className="credentials-page page-section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">{currentContent.title}</h2>
          <p className="section-subtitle">{currentContent.subtitle}</p>
        </div>

        {/* Credentials Grid Gallery */}
        {formattedCredentials.length > 0 ? (
          <div className="credentials-grid">
            {formattedCredentials.map((cred, index) => (
              <div 
                key={cred.id} 
                className="credential-card"
                onClick={() => openLightbox(index)}
              >
                <div className="credential-image-wrapper">
                  <img src={cred.url} alt={`Credential Certificate ${cred.id}`} loading="lazy" />
                  <div className="credential-card-hover-overlay">
                    <span className="view-cert-badge">🔍 {currentContent.viewCert}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-credentials">No credentials available.</div>
        )}
      </div>

      {/* Immersive Glassmorphic Lightbox Overlay */}
      {lightboxIndex !== null && formattedCredentials[lightboxIndex] && (
        <div className="lightbox-overlay" onClick={closeLightbox}>
          <button className="lightbox-close-btn" onClick={closeLightbox}>&times;</button>
          
          <button 
            className="lightbox-nav-btn prev-btn" 
            onClick={(e) => { e.stopPropagation(); navigatePrev(); }}
          >
            &#8249;
          </button>
          
          <div className="lightbox-image-container" onClick={(e) => e.stopPropagation()}>
            <img 
              src={formattedCredentials[lightboxIndex].url} 
              alt={`Certificate Detail ${formattedCredentials[lightboxIndex].id}`} 
            />
          </div>

          <button 
            className="lightbox-nav-btn next-btn" 
            onClick={(e) => { e.stopPropagation(); navigateNext(); }}
          >
            &#8250;
          </button>
        </div>
      )}
    </section>
  );
};

export default Credentials;
