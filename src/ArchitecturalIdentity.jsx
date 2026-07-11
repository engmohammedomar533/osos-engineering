import React, { useEffect } from 'react';

const ArchitecturalIdentity = ({ currentLanguage }) => {
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'module';
    script.src = 'https://js.arcgis.com/embeddable-components/4.33/arcgis-embeddable-components.esm.js';
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return (
    <section className="page-section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title" data-en="Architectural Identity" data-ar="الهوية المعمارية">
            {currentLanguage === 'en' ? 'Architectural Identity' : 'الهوية المعمارية'}
          </h2>
          <p className="section-subtitle" data-en="Our Projects on the Map" data-ar="مشاريعنا على الخريطة">
            {currentLanguage === 'en' ? 'Our Projects on the Map' : 'مشاريعنا على الخريطة'}
          </p>
        </div>
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}>
          <div style={{ width: '100%', height: '80vh' }}>
            <iframe
              src="https://www.google.com/maps/d/u/0/embed?mid=18A8OaKhqcNFRRId-aDbT_6QHWuOrGxc&ehbc=2E312F"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
          
        </div>
      </div>
    </section>
  );
};

export default ArchitecturalIdentity;
