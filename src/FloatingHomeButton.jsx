import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './FloatingHomeButton.css';

const FloatingHomeButton = ({ currentLanguage }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Do not render on the Home page ('/')
  if (location.pathname === '/') {
    return null;
  }

  return (
    <div className="floating-home">
      <button 
        onClick={() => navigate('/')} 
        className="floating-home-button"
        title={currentLanguage === 'en' ? 'Go to Home' : 'الرئيسية'}
        aria-label="Go to Home page"
      >
        <svg 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2.5" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          className="home-svg"
          aria-hidden="true"
        >
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      </button>
    </div>
  );
};

export default FloatingHomeButton;
