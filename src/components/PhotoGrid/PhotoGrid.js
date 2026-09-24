import React from 'react';
import './PhotoGrid.css';

const PhotoGrid = ({ photos, onPhotoClick, showOverlay = true, columns = { mobile: 1, tablet: 2, desktop: 3 } }) => {
  if (!photos || photos.length === 0) {
    return <div className="photo-grid-empty">Aucune photo trouvée</div>;
  }

  return (
    <div 
      className="photo-grid-container" 
      style={{
        '--columns-mobile': columns.mobile,
        '--columns-tablet': columns.tablet,
        '--columns-desktop': columns.desktop
      }}
    >
      {photos.map((photo, index) => (
        <div 
          key={photo.id || index} 
          className="photo-grid-item"
          style={{ animationDelay: `${index * 0.05}s` }}
          onClick={() => onPhotoClick && onPhotoClick(photo)}
        >
          <img 
            src={photo.url || photo.image} 
            alt={photo.title || 'Photo'} 
            loading="lazy" 
            className="photo-grid-img"
          />
          {showOverlay && (
            <div className="photo-grid-overlay">
              <div className="photo-grid-top">
                {photo.photographer && (
                  <div className="photo-grid-photographer">
                    {photo.photographerAvatar && (
                      <img src={photo.photographerAvatar} alt={photo.photographer} className="photo-avatar" />
                    )}
                    <span>{photo.photographer}</span>
                  </div>
                )}
                <div className="photo-grid-likes">
                  ♥ {photo.likes || 0}
                </div>
              </div>
              <div className="photo-grid-bottom">
                <h4>{photo.title || 'Sans titre'}</h4>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default PhotoGrid;
