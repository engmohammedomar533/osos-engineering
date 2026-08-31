import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './HomeContactMap.css';

const HomeContactMap = ({ currentLanguage }) => {
  const mapContainerRef = useRef(null);
  const [showScrollOverlay, setShowScrollOverlay] = useState(false);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Makkah Headquarters Coordinates
    const lat = 21.4102649;
    const lng = 39.7895678;
    const directionsUrl = "https://www.google.com/maps/place/%D8%A3%D8%B3%D8%B3+%D9%87%D9%86%D8%AF%D8%B3%D8%A9+%D8%A7%D9%84%D8%A8%D9%86%D8%A7%D8%A1+%D9%84%D9%84%D8%A7%D8%B3%D8%AA%D8%B4%D8%A7%D8%B1%D8%A7%D8%AA+%D8%A7%D9%84%D9%87%D9%86%D8%AF%D8%B3%D9%8A%D8%A9%E2%80%AD/@21.410223,39.7893699,21z/data=!4m12!1m5!3m4!2zMjHCsDI0JzM3LjAiTiAzOcKwNDcnMjIuNCJF!8m2!3d21.4102649!4d39.7895678!3m5!1s0x15c21afd0b36aec1:0xbdbe77205d8fbd43!8m2!3d21.4102943!4d39.7894074!16s%2Fg%2F11hb5mf09h?entry=ttu&g_ep=EgoyMDI2MDgyNi4wIKXMDSoASAFQAw%3D%3D";

    const map = L.map(mapContainerRef.current, {
      center: [lat, lng],
      zoom: 15,
      zoomControl: true, 
      scrollWheelZoom: false 
    });

    // Standard bright map tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19
    }).addTo(map);

    // Standard brand marker
    const customIcon = L.divIcon({
      className: 'custom-map-marker',
      html: `
        <div class="marker-pin-wrapper">
          <svg class="marker-pin-svg" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z" fill="var(--color-primary, #0056b3)"/>
          </svg>
          <div class="marker-label">${currentLanguage === 'en' ? 'Makkah HQ' : 'المقر الرئيسي - مكة'}</div>
        </div>
      `,
      iconSize: [120, 60],
      iconAnchor: [60, 40]
    });

    const marker = L.marker([lat, lng], { icon: customIcon }).addTo(map);

    // Make marker interactive for directions
    marker.on('click', () => {
      window.open(directionsUrl, '_blank');
    });

    // Bind a beautiful popup that acts as a directions button
    const popupContent = `
      <div style="text-align: center; font-family: inherit;">
        <strong style="display: block; margin-bottom: 5px;">${currentLanguage === 'en' ? 'OSOS Engineering' : 'أسس البناء للاستشارات الهندسية'}</strong>
        <a href="${directionsUrl}" target="_blank" style="color: var(--color-primary, #0056b3); text-decoration: underline; font-weight: bold;">
          ${currentLanguage === 'en' ? 'Get Directions on Google Maps' : 'احصل على الاتجاهات عبر خرائط جوجل'}
        </a>
      </div>
    `;
    marker.bindPopup(popupContent);

    // Ctrl + Scroll Logic
    const handleWheel = (e) => {
      if (e.ctrlKey) {
        map.scrollWheelZoom.enable();
        setShowScrollOverlay(false);
      } else {
        map.scrollWheelZoom.disable();
        setShowScrollOverlay(true);
        setTimeout(() => setShowScrollOverlay(false), 1500); // Hide after 1.5s
      }
    };

    const container = mapContainerRef.current;
    container.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      container.removeEventListener('wheel', handleWheel);
      map.remove();
    };
  }, [currentLanguage]);

  return (
    <div className="home-map-wrapper">
      <div className="home-map-header" style={currentLanguage === 'en' ? { textAlign: 'left' } : { textAlign: 'right' }}>
         <span>{currentLanguage === 'en' ? '📍 MECCA • Main Headquarters' : '📍 مكة المكرمة • المقر الرئيسي'}</span>
      </div>
      <div className="home-map-relative-container" style={{ position: 'relative', flexGrow: 1 }}>
        <div ref={mapContainerRef} className="home-map-container" style={{ height: '100%', width: '100%' }}></div>
        {showScrollOverlay && (
          <div className="scroll-overlay" style={{
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)', color: 'white',
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            zIndex: 1000, fontSize: '1.2rem', fontWeight: 'bold',
            pointerEvents: 'none', transition: 'opacity 0.3s'
          }}>
            {currentLanguage === 'en' ? 'Use Ctrl + scroll to zoom the map' : 'استخدم Ctrl + التمرير لتكبير الخريطة'}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomeContactMap;
