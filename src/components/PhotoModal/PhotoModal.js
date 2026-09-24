import React, { useEffect, useCallback, useState } from 'react';
import './PhotoModal.css';

const PhotoModal = ({ photo, onClose, onPrev, onNext, t }) => {
  const [isLiked, setIsLiked] = useState(false);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') onClose();
    if (e.key === 'ArrowLeft' && onPrev) onPrev();
    if (e.key === 'ArrowRight' && onNext) onNext();
  }, [onClose, onPrev, onNext]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [handleKeyDown]);

  if (!photo) return null;

  return (
    <div className="photo-modal-overlay" onClick={onClose}>
      <div className="photo-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="photo-modal-close" onClick={onClose} aria-label={t('close', 'Fermer')}>✕</button>
        
        {onPrev && (
          <button className="photo-modal-nav prev" onClick={onPrev} aria-label={t('prev', 'Précédent')}>
            ‹
          </button>
        )}

        <div className="photo-modal-image-container">
          <img src={photo.url || photo.image} alt={photo.title || 'Photo'} className="photo-modal-image" />
        </div>

        {onNext && (
          <button className="photo-modal-nav next" onClick={onNext} aria-label={t('next', 'Suivant')}>
            ›
          </button>
        )}

        <div className="photo-modal-info">
          <div className="photo-modal-header">
            <h3>{photo.title || 'Sans titre'}</h3>
            <div className="photo-modal-actions">
              <button 
                className={`action-btn like-btn ${isLiked ? 'liked' : ''}`}
                onClick={() => setIsLiked(!isLiked)}
              >
                {isLiked ? '♥' : '♡'} <span>{photo.likes || 0}</span>
              </button>
              <button className="action-btn download-btn">
                ↓ {t('download', 'Télécharger')}
              </button>
            </div>
          </div>
          <div className="photo-modal-details">
            {photo.photographer && (
              <div className="photographer-info">
                {photo.photographerAvatar && (
                  <img src={photo.photographerAvatar} alt={photo.photographer} className="photographer-avatar" />
                )}
                <span>{photo.photographer}</span>
              </div>
            )}
            <div className="photo-stats">
              <span>👁 {photo.views || 0} {t('views', 'vues')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhotoModal;
