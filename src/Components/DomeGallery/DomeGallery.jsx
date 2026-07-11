import React, { useRef, useState, useEffect } from 'react';
import { useSpring, animated } from '@react-spring/web';
import { useGesture } from '@use-gesture/react';
import './DomeGallery.css';

const DomeGallery = ({
  images,
}) => {
  const domTarget = useRef(null);
  const [responsiveDomeRadius, setResponsiveDomeRadius] = useState(350);
  const [responsiveImageSize, setResponsiveImageSize] = useState(120);
  const [responsiveMaxVerticalRotationDeg, setResponsiveMaxVerticalRotationDeg] = useState(60);
  const [responsiveDragSensitivity, setResponsiveDragSensitivity] = useState(0.5);

  const [{ rotateY, rotateX }, api] = useSpring(() => ({ rotateY: 0, rotateX: 0 }));
  const [openedImage, setOpenedImage] = useState(null);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 768) { // Mobile screens
        setResponsiveDomeRadius(200);
        setResponsiveImageSize(80);
        setResponsiveMaxVerticalRotationDeg(90);
        setResponsiveDragSensitivity(0.8);
      } else if (width < 1200) { // Tablet screens
        setResponsiveDomeRadius(300);
        setResponsiveImageSize(100);
        setResponsiveMaxVerticalRotationDeg(75);
        setResponsiveDragSensitivity(0.6);
      } else { // Desktop screens
        setResponsiveDomeRadius(350);
        setResponsiveImageSize(120);
        setResponsiveMaxVerticalRotationDeg(60);
        setResponsiveDragSensitivity(0.5);
      }
    };

    handleResize(); // Set initial values
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useGesture(
    {
      onDrag: ({ offset: [ox, oy], velocity: [vx, vy], direction: [dx, dy], down }) => {
        api.start({
          rotateY: ox * responsiveDragSensitivity,
          rotateX: Math.max(-responsiveMaxVerticalRotationDeg, Math.min(responsiveMaxVerticalRotationDeg, oy * responsiveDragSensitivity)),
          immediate: down,
          config: { friction: 10, tension: 120 },
        });
      },
      onDragEnd: ({ velocity: [vx, vy], direction: [dx, dy] }) => {
        // Add some inertia after drag ends
        api.start({
          rotateY: rotateY.get() + vx * 100 * responsiveDragSensitivity,
          rotateX: rotateX.get() + vy * 100 * responsiveDragSensitivity,
          config: { friction: 20, tension: 200 },
        });
      },
    },
    { target: domTarget, eventOptions: { passive: false }, drag: { threshold: 10 } } // Added threshold
  );

  const handleImageClick = (index) => {
    setOpenedImage(openedImage === index ? null : index);
  };

  return (
    <div className="dome-gallery-container" ref={domTarget}>
      <animated.div
        className="dome-gallery"
        style={{
          transform: rotateY.to((y) => `perspective(1000px) rotateX(${-rotateX.get()}deg) rotateY(${y}deg)`),
        }}
      >
        {images.map((image, i) => {
          const phi = Math.acos(2 * i / images.length - 1); // Latitude
          const theta = Math.sqrt(images.length * Math.PI) * phi; // Longitude

          const x = responsiveDomeRadius * Math.sin(phi) * Math.cos(theta);
          const y = responsiveDomeRadius * Math.sin(phi) * Math.sin(theta);
          const z = responsiveDomeRadius * Math.cos(phi);

          const isOpened = openedImage === i;

          return (
            <animated.img
              key={i}
              src={image}
              alt={`Gallery Image ${i + 1}`}
              className="dome-gallery-image"
              onClick={() => handleImageClick(i)}
              style={{
                width: responsiveImageSize,
                height: responsiveImageSize,
                transform: `translate3d(${x}px, ${y}px, ${z}px)`,
                zIndex: isOpened ? 100 : 1,
                transition: isOpened ? 'transform 0.3s ease-out, width 0.3s ease-out, height 0.3s ease-out, border-radius 0.3s ease-out' : 'none',
              }}
            />
          );
        })}
      </animated.div>

      {openedImage !== null && (
        <div className="dome-gallery-overlay" onClick={() => setOpenedImage(null)}>
          <img src={images[openedImage]} alt="Opened Image" className="dome-gallery-opened-image" />
          <button className="dome-gallery-close-button" onClick={() => setOpenedImage(null)}>X</button>
        </div>
      )}
    </div>
  );
};

export default DomeGallery;
