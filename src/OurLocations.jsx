import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './OurLocations.css';

const branches = [
  {
    id: 'makkah',
    name_en: 'Main Branch in Makkah Al-Mukarramah',
    name_ar: 'الفرع الرئيسي بمكة المكرمة',
    lat: 21.4102649,
    lng: 39.7895678,
    hours_en: [
      'Saturday to Thursday: from 8 am to 9 pm',
      'Friday: Off'
    ],
    hours_ar: [
      'السبت إلي الخميس: من الساعة 8 صباحاً إلي الساعة 9 مساءً',
      'الجمعة: إجازة'
    ],
    directions: 'https://maps.google.com/?q=21.4102649,39.7895678'
  },
  {
    id: 'ahsa',
    name_en: 'Al-Ahsa Branch',
    name_ar: 'فرع الأحساء',
    lat: 25.3499028,
    lng: 49.6080028,
    hours_en: [
      'Saturday to Thursday: 8:30 am to 12:30 pm and 4:30 pm to 8:30 pm',
      'Friday: Off'
    ],
    hours_ar: [
      'السبت إلي الخميس: من الساعة 8:30 صباحاً إلي الساعة 12:30 ظهراً ومن الساعة 4:30 مساءً إلي الساعة 8:30 مساءً',
      'الجمعة: إجازة'
    ],
    directions: 'https://maps.google.com/?q=25.3499028,49.6080028'
  },
  {
    id: 'cairo',
    name_en: 'Cairo Branch',
    name_ar: 'فرع القاهرة',
    lat: 29.964878,
    lng: 31.257644,
    hours_en: [
      'Saturday to Wednesday: from 9 am to 5 pm',
      'Thursday: from 9 am to 2 pm',
      'Friday: Off'
    ],
    hours_ar: [
      'السبت إلي الأربعاء: من الساعة 9 صباحاً إلي الساعة 5 مساءً',
      'الخميس: من الساعة 9 صباحاً إلي الساعة 2 ظهراً',
      'الجمعة: إجازة'
    ],
    directions: 'https://maps.google.com/?q=29.964878,31.257644'
  }
];

import useSEO from './hooks/useSEO';

const OurLocations = ({ currentLanguage }) => {
  useSEO({
    title: currentLanguage === 'en' ? 'Our Locations' : 'فروعنا',
    description: currentLanguage === 'en'
      ? 'Contact OSOS Engineering offices in Makkah, Al-Ahsa (Saudi Arabia), and Cairo (Egypt). Get maps, hours, and direction details.'
      : 'اتصل بمكاتب أسس البناء للاستشارات الهندسية في مكة المكرمة، الأحساء (السعودية)، والقاهرة (مصر). احصل على الخرائط، مواعيد العمل، والتوجيهات.',
    keywords: 'OSOS offices, Makkah engineering office, Al-Ahsa surveying branch, Cairo GIS branch, contact engineering consultants, فروع أسس البناء'
  });

  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRefs = useRef({});
  const [activeBranchId, setActiveBranchId] = useState('makkah');
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 900);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 900);
      if (mapRef.current) {
        mapRef.current.invalidateSize();
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const content = {
    en: {
      title: "Our Locations and Working Hours",
      workingHoursHeader: "Working Hours",
      directionsBtn: "Get Directions",
      selectPrompt: "Select an office location below:"
    },
    ar: {
      title: "مواقعنا وساعات العمل",
      workingHoursHeader: "ساعات العمل",
      directionsBtn: "احصل على الاتجاهات",
      selectPrompt: "اختر موقع المكتب أدناه:"
    },
  };

  const currentContent = content[currentLanguage];

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Initialize Leaflet map centered at a Middle East hub coordinate
    const mapInstance = L.map(mapContainerRef.current, {
      center: [25.0, 42.0],
      zoom: 5,
      zoomControl: false
    });

    // Add standard OpenStreetMap tile layer (light street map)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19
    }).addTo(mapInstance);

    // Zoom controls at bottom right
    L.control.zoom({ position: 'bottomright' }).addTo(mapInstance);

    const markers = {};

    branches.forEach(branch => {
      // Custom pulsing divIcon marker to avoid vite asset resolution bugs
      const markerIcon = L.divIcon({
        className: 'custom-map-marker',
        html: `
          <div class="marker-pin"></div>
          <div class="marker-pulse"></div>
        `,
        iconSize: [30, 30],
        iconAnchor: [15, 30]
      });

      const popupContent = `
        <div class="map-popup-content">
          <h4>${currentLanguage === 'en' ? branch.name_en : branch.name_ar}</h4>
          <p class="popup-working-hours-title">${currentContent.workingHoursHeader}</p>
          <ul class="popup-working-hours-list">
            ${(currentLanguage === 'en' ? branch.hours_en : branch.hours_ar).map(h => `<li>${h}</li>`).join('')}
          </ul>
          <a href="${branch.directions}" target="_blank" rel="noopener noreferrer" class="popup-directions-btn">
            ${currentContent.directionsBtn} ➔
          </a>
        </div>
      `;

      const marker = L.marker([branch.lat, branch.lng], { icon: markerIcon })
        .addTo(mapInstance)
        .bindPopup(popupContent, { closeButton: false, offset: [0, -20] });

      marker.on('click', () => {
        setActiveBranchId(branch.id);
        mapInstance.flyTo([branch.lat, branch.lng], 15, { animate: true, duration: 1.2 });
      });

      markers[branch.id] = marker;
    });

    mapRef.current = mapInstance;
    markerRefs.current = markers;

    // Automatically trigger flight to initial active branch after minor timeout
    const initialBranch = branches.find(b => b.id === 'makkah');
    if (initialBranch) {
      setTimeout(() => {
        if (mapRef.current) {
          mapRef.current.invalidateSize(); // Force leaflet to recalculate container size
        }
        mapInstance.flyTo([initialBranch.lat, initialBranch.lng], 15, { animate: true, duration: 1.0 });
        markers[initialBranch.id].openPopup();
      }, 500);
    }

    return () => {
      mapInstance.remove();
      mapRef.current = null;
      markerRefs.current = {};
    };
  }, [currentLanguage]);

  const handleBranchSelect = (branch) => {
    setActiveBranchId(branch.id);
    if (mapRef.current) {
      mapRef.current.invalidateSize(); // Force container size sync
      mapRef.current.flyTo([branch.lat, branch.lng], 15, {
        animate: true,
        duration: 1.2
      });
      if (markerRefs.current[branch.id]) {
        markerRefs.current[branch.id].openPopup();
      }
    }
  };

  return (
    <div className="locations-page page-section">
      <div style={{ height: '50px' }}></div>
      <div className="container">
        <div className="section-header">
          <h2 className="section-title" data-en="Our Locations and Working Hours" data-ar="مواقعنا وساعات العمل">
            {currentContent.title}
          </h2>
        </div>

        <div 
          className="osos-locations-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
            gap: isMobile ? '1.5rem' : '2rem',
            width: '100%',
            marginTop: '2rem',
            marginBottom: '4rem',
            alignItems: 'stretch'
          }}
        >
          {/* Left/Right Side: Sidebar Branch list */}
          <div className="osos-locations-sidebar" style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
            <p className="sidebar-prompt-text">{currentContent.selectPrompt}</p>
            <div className="branch-selector-list">
              {branches.map(branch => {
                const isActive = activeBranchId === branch.id;
                const hours = currentLanguage === 'en' ? branch.hours_en : branch.hours_ar;
                return (
                  <div 
                    key={branch.id} 
                    className={`branch-card-tab ${isActive ? 'active' : ''}`}
                    onClick={() => handleBranchSelect(branch)}
                  >
                    <div className="branch-card-header-row">
                      <span className="tab-marker-dot"></span>
                      <h3>{currentLanguage === 'en' ? branch.name_en : branch.name_ar}</h3>
                    </div>
                    <div className="branch-card-body-details">
                      <p className="sidebar-hours-header">{currentContent.workingHoursHeader}:</p>
                      <ul className="sidebar-hours-list">
                        {hours.map((line, i) => (
                          <li key={i}>{line}</li>
                        ))}
                      </ul>
                      {isActive && (
                        <a 
                          href={branch.directions} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="sidebar-directions-btn"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {currentContent.directionsBtn} ➔
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right/Left Side: Map Container */}
          <div 
            className="osos-map-wrapper"
            style={{
              width: '100%',
              borderRadius: '16px',
              overflow: 'hidden',
              border: '1px solid rgba(0, 0, 0, 0.08)',
              boxShadow: '0 8px 30px rgba(0, 0, 0, 0.05)',
              position: 'relative',
              minHeight: isMobile ? '400px' : '500px',
              height: isMobile ? '400px' : 'auto',
              background: '#0f1115'
            }}
          >
            <div 
              ref={mapContainerRef} 
              className="interactive-leaflet-map"
              style={{
                width: '100%',
                height: '100%',
                minHeight: isMobile ? '400px' : '500px',
                zIndex: 1
              }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OurLocations;
