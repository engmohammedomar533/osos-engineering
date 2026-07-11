import React from 'react';
import './FloatingIcons.css';

const FloatingIcons = () => {
  const icons = [
    ...Array(20).fill('OSOS'),
    ...Array(20).fill('OS')
  ];

  return (
    <div className="floating-icons-container">
      {icons.map((icon, index) => (
        <span key={index} className={`floating-icon`} style={{
          '--i': index + 1,
          left: `${Math.random() * 90}vw`,
          animationDuration: `${Math.random() * 10 + 10}s`,
          animationDelay: `${Math.random() * 5}s`
        }}>{icon}</span>
      ))}
    </div>
  );
};

export default FloatingIcons;
