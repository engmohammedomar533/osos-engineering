import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ServicesPage.css'; // Import the CSS
import useSEO from './hooks/useSEO';
import SkeletonCard from './Components/SkeletonCard/SkeletonCard';

const BLOB_STORAGE_BASE_URL = 'https://pc5a0jgn4xie1mys.public.blob.vercel-storage.com';

const ServicesPage = ({ currentLanguage }) => {
  useSEO({
    title: currentLanguage === 'en' ? 'Our Services' : 'خدماتنا',
    description: currentLanguage === 'en'
      ? 'Discover OSOS Engineering consulting divisions: GIS solutions, spatial analysis, land surveying, architectural design, and engineering consultancy.'
      : 'اكتشف تخصصات أسس البناء للاستشارات الهندسية: حلول نظم المعلومات الجغرافية، التحليل المكاني، الرفع المساحي، التصاميم المعمارية والاستشارات الهندسية.',
    keywords: 'OSOS services, GIS solutions, surveying consultants, architectural design Makkah, structural planning, خدمات هندسية'
  });

  const [selectedService, setSelectedService] = useState(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get('/api/get_services');
        setServices(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching services:', error);
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const openPopup = (service) => {
    setSelectedService(service);
    document.body.style.overflow = 'hidden'; // Lock background scroll
  };

  const closePopup = () => {
    setSelectedService(null);
    document.body.style.overflow = 'auto'; // Restore scroll
  };

  const isImagePath = (path) => {
    return typeof path === 'string' && (
      path.endsWith('.png') || 
      path.endsWith('.jpg') || 
      path.endsWith('.jpeg') || 
      path.endsWith('.gif') || 
      path.endsWith('.svg')
    );
  };

  const getBrochureImage = (service) => {
    if (!service || !service.image_url || !isImagePath(service.image_url)) return null;
    const cleanedImage = service.image_url
      .replace(/^\//, '')
      .replace(/ /g, '%20');
    return `${BLOB_STORAGE_BASE_URL}/${cleanedImage}`;
  };

  if (loading) {
    return (
      <div className="services-page page-section">
        <div className="container">
          <div className="services-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2.5rem' }}>
            {Array.from({ length: 3 }).map((_, index) => (
              <SkeletonCard key={index} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="services-page page-section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title" data-en="Our Services" data-ar="خدماتنا">
            {currentLanguage === 'en' ? 'Our Services' : 'خدماتنا'}
          </h2>
          <p className="section-subtitle" data-en="Comprehensive engineering solutions for every need" data-ar="حلول هندسية شاملة لكل الاحتياجات">
            {currentLanguage === 'en' ? 'Comprehensive engineering solutions for every need' : 'حلول هندسية شاملة لكل الاحتياجات'}
          </p>
        </div>

        {/* Services Cards Grid */}
        <div className="services-grid">
          {services.map(service => {
            const cleanedIcon = service.icon_url
              ? service.icon_url.replace(/^\//, '').replace(/ /g, '%20')
              : '';
            const iconUrl = cleanedIcon
              ? `${BLOB_STORAGE_BASE_URL}/${cleanedIcon}?t=${new Date().getTime()}`
              : '/Images/service-default.png';

            return (
              <div 
                className="service-card" 
                key={service.id} 
                onClick={() => openPopup(service)}
              >
                <div className="service-icon-badge">
                  <img src={iconUrl} alt={service.title_en} className="service-icon" />
                </div>
                <h3 className="service-title">
                  {currentLanguage === 'en' ? service.title_en : service.title_ar}
                </h3>
              </div>
            );
          })}
        </div>

        {/* Split Brochure Detail Modal */}
        {selectedService && (
          <div className="popup-overlay" onClick={closePopup}>
            <div className="popup-content split-brochure" onClick={(e) => e.stopPropagation()}>
              <button className="close-button" onClick={closePopup}>&times;</button>
              
              {(() => {
                const brochureImageUrl = getBrochureImage(selectedService);
                
                if (brochureImageUrl) {
                  return (
                    <div className="brochure-full-image-layout">
                      <h3 className="brochure-title">
                        {currentLanguage === 'en' ? selectedService.title_en : selectedService.title_ar}
                      </h3>
                      <hr className="brochure-divider" />
                      <div className="brochure-full-image-container">
                        <img src={brochureImageUrl} alt="Service Description" className="brochure-full-image" />
                      </div>
                    </div>
                  );
                } else {
                  return (
                    <div className="brochure-body-layout">
                      {/* Left Column: Media */}
                      <div className="brochure-media-column">
                        <div className="brochure-placeholder">
                          <span className="brand-mark-logo">OSOS</span>
                        </div>
                      </div>

                      {/* Right Column: Descriptions */}
                      <div className="brochure-info-column">
                        <h3 className="brochure-title">
                          {currentLanguage === 'en' ? selectedService.title_en : selectedService.title_ar}
                        </h3>
                        
                        <hr className="brochure-divider" />
                        
                        <ul className="brochure-description-list">
                          {(currentLanguage === 'en' ? selectedService.description_en : selectedService.description_ar)
                            .split(/[.!?\r\n]+/)
                            .map((item, index) => (
                              item.trim() && <li key={index}>{item.trim()}.</li>
                            ))
                          }
                        </ul>
                      </div>
                    </div>
                  );
                }
              })()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServicesPage;