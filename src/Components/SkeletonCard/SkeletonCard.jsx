import React from 'react';
import './SkeletonCard.css';

const SkeletonCard = () => {
  return (
    <div className="skeleton-card">
      <div className="skeleton-image-wrapper">
        <div className="skeleton-shimmer"></div>
      </div>
      <div className="skeleton-details">
        <div className="skeleton-title">
          <div className="skeleton-shimmer"></div>
        </div>
        <div className="skeleton-location">
          <div className="skeleton-shimmer"></div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonCard;
