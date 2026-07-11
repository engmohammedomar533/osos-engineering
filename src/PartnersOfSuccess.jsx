import React, { useState, useEffect } from 'react';
import ChromaGrid from './Components/ChromaGrid/ChromaGrid';
import './PartnersOfSuccess.css';

const PartnersOfSuccess = ({ currentLanguage }) => {
  const [logos, setLogos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLogos = async () => {
      try {
        const response = await fetch('/api/get_partner_logos', { cache: 'no-store' });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const BLOB_STORAGE_BASE_URL = 'https://pc5a0jgn4xie1mys.public.blob.vercel-storage.com';
        const formattedLogos = data.map(logo => {
          const cleanedPath = logo.logo_url.replace(/ /g, '%20');
          const logoUrl = cleanedPath.startsWith('http')
            ? cleanedPath
            : `${BLOB_STORAGE_BASE_URL}${cleanedPath.startsWith('/') ? '' : '/'}${cleanedPath}`;
          return {
            ...logo,
            src: logoUrl,
            alt: logo.name
          };
        });
        setLogos(formattedLogos);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchLogos();
  }, []);

  if (loading) {
    return <section className="partners-of-success page-section"><div className="container"><p>Loading partners...</p></div></section>;
  }

  if (error) {
    return <section className="partners-of-success page-section"><div className="container"><p>Error loading partners: {error.message}</p></div></section>;
  }

  const chromaGridItems = logos.map(logo => ({
    image: logo.src, // Use the newly mapped 'src' property
    title: "", // No title as requested
    gradient: "white", // Set background to white
  }));

  return (
    <section className="partners-of-success page-section">
      <div className="container">
        <h2 className="section-title">
          {currentLanguage === 'en' ? 'Partners of Success' : 'شركاء النجاح'}
        </h2>
        <ChromaGrid items={chromaGridItems} columns={7} rows={3} />
      </div>
    </section>
  );
};

export default PartnersOfSuccess;