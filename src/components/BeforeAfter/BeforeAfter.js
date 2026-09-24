import React, { useState, useRef, useEffect, useCallback } from 'react';
import './BeforeAfter.css';

const BeforeAfter = ({ beforeImage, afterImage, beforeLabel = 'Avant', afterLabel = 'Après' }) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);

  const handleMove = useCallback((clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = Math.max(0, Math.min((x / rect.width) * 100, 100));
    setSliderPosition(percent);
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  }, [isDragging, handleMove]);

  const handleTouchMove = useCallback((e) => {
    if (!isDragging) return;
    handleMove(e.touches[0].clientX);
  }, [isDragging, handleMove]);

  useEffect(() => {
    const handleMouseUp = () => setIsDragging(false);
    
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove, { passive: false });
      window.addEventListener('touchend', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleTouchMove]);

  return (
    <div 
      className="before-after-container" 
      ref={containerRef}
      onMouseDown={(e) => {
        setIsDragging(true);
        handleMove(e.clientX);
      }}
      onTouchStart={(e) => {
        setIsDragging(true);
        handleMove(e.touches[0].clientX);
      }}
    >
      <div className="before-image-wrapper">
        <img src={beforeImage} alt="Before" className="before-after-img" />
        <div className="label before-label">{beforeLabel}</div>
      </div>
      
      <div 
        className="after-image-wrapper" 
        style={{ clipPath: `inset(0 0 0 ${sliderPosition}%)` }}
      >
        <img src={afterImage} alt="After" className="before-after-img" />
        <div className="label after-label">{afterLabel}</div>
      </div>

      <div 
        className="slider-line" 
        style={{ left: `${sliderPosition}%` }}
      >
        <div className="slider-handle">
          <div className="slider-arrows">‹›</div>
        </div>
      </div>
    </div>
  );
};

export default BeforeAfter;
