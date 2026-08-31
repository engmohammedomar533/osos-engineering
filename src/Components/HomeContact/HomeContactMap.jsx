import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './HomeContactMap.css';

const HomeContactMap = ({ currentLanguage }) => {
  const mapContainerRef = useRef(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Makkah Headquarters Coordinates
    const lat = 21.4102649;
    const lng = 39.7895678;

    const map = L.map(mapContainerRef.current, {
      center: [lat, lng],
      zoom: 15,
      zoomControl: false, 
      scrollWheelZoom: false 
    });

    // Dark theme map tiles 
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap &copy; CARTO',
      subdomains: 'abcd',
      maxZoom: 20
    }).addTo(map);

    // Custom yellow marker
    const customIcon = L.divIcon({
      className: 'custom-map-marker',
      html: `
        <div class="marker-pin-wrapper">
          <svg class="marker-pin-svg" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z" fill="#FCA311"/>
          </svg>
          <div class="marker-label">${currentLanguage === 'en' ? 'Makkah HQ' : 'المقر الرئيسي - مكة'}</div>
        </div>
      `,
      iconSize: [120, 60],
      iconAnchor: [60, 40]
    });

    L.marker([lat, lng], { icon: customIcon }).addTo(map);

    return () => {
      map.remove();
    };
  }, [currentLanguage]);

  return (
    <div className="home-map-wrapper">
      <div className="home-map-header">
         <span>{currentLanguage === 'en' ? '📍 MECCA • Main Headquarters' : '📍 مكة المكرمة • المقر الرئيسي'}</span>
      </div>
      <div ref={mapContainerRef} className="home-map-container"></div>
    </div>
  );
};

export default HomeContactMap;
