
import React from 'react';
import { useLocation } from 'react-router-dom';

const CanonicalLink = () => {
  const location = useLocation();
  const canonicalUrl = `https://osos-react-v4.vercel.app${location.pathname}`;

  return (
    <link rel="canonical" href={canonicalUrl} />
  );
};

export default CanonicalLink;
