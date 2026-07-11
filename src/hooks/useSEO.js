import { useEffect } from 'react';

export const useSEO = ({ title, description, keywords }) => {
  useEffect(() => {
    // 1. Set Title
    document.title = title ? `${title} | OSOS Engineering` : 'OSOS Engineering | Consulting & Surveying';
    
    // 2. Helper to set meta tags
    const updateMetaTag = (name, property, content) => {
      let el = name 
        ? document.querySelector(`meta[name="${name}"]`) 
        : document.querySelector(`meta[property="${property}"]`);
        
      if (!el) {
        el = document.createElement('meta');
        if (name) el.setAttribute('name', name);
        if (property) el.setAttribute('property', property);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content || '');
    };

    // 3. Update generic search meta tags
    updateMetaTag('description', null, description || 'OSOS Engineering & Consulting provides expert surveying, architectural, engineering and GIS consulting services.');
    updateMetaTag('keywords', null, keywords || 'OSOS, OSOS Engineering, surveying, GIS, architectural consulting, Makkah, Saudi Arabia, Egypt');

    // 4. Update OpenGraph (OG) sharing previews
    updateMetaTag(null, 'og:title', title ? `${title} | OSOS Engineering` : 'OSOS Engineering | Consulting & Surveying');
    updateMetaTag(null, 'og:description', description || 'OSOS Engineering & Consulting provides expert surveying, architectural, engineering and GIS consulting.');

    // 5. Update Twitter previews
    updateMetaTag(null, 'twitter:title', title ? `${title} | OSOS Engineering` : 'OSOS Engineering | Consulting & Surveying');
    updateMetaTag(null, 'twitter:description', description || 'OSOS Engineering & Consulting provides expert surveying, architectural, engineering and GIS consulting.');
    
  }, [title, description, keywords]);
};

export default useSEO;
