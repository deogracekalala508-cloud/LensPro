'use client';

import React, { useState, useEffect } from 'react';
import './gallery.css';
import { useLanguage } from '@/context/LanguageContext';
import { clientGallery } from '@/lib/mockData';

export default function ClientGalleryPage({ params }) {
  const { shareCode } = params;
  const { t } = useLanguage();
  
  const gallery = clientGallery;
  
  const [isAuthenticated, setIsAuthenticated] = useState(!gallery.requiresPin);
  const [pin, setPin] = useState(['', '', '', '']);
  const [selectedPhotos, setSelectedPhotos] = useState(new Set());
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [favorites, setFavorites] = useState(new Set());
  const [lightboxPhoto, setLightboxPhoto] = useState(null);

  useEffect(() => {
    // Load favorites from local storage
    const saved = localStorage.getItem(`gallery_${shareCode}_favs`);
    if (saved) {
      setFavorites(new Set(JSON.parse(saved)));
    }
  }, [shareCode]);

  const saveFavorites = (newFavs) => {
    setFavorites(newFavs);
    localStorage.setItem(`gallery_${shareCode}_favs`, JSON.stringify(Array.from(newFavs)));
  };

  const toggleFavorite = (id, e) => {
    e.stopPropagation();
    const newFavs = new Set(favorites);
    if (newFavs.has(id)) newFavs.delete(id);
    else newFavs.add(id);
    saveFavorites(newFavs);
  };

  const toggleSelection = (id, e) => {
    e.stopPropagation();
    const newSel = new Set(selectedPhotos);
    if (newSel.has(id)) newSel.delete(id);
    else newSel.add(id);
    setSelectedPhotos(newSel);
  };

  const handlePinChange = (index, value) => {
    if (value.length > 1) value = value[value.length - 1];
    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);
    
    // Auto focus next
    if (value && index < 3) {
      document.getElementById(`pin-${index + 1}`).focus();
    }
  };

  const verifyPin = () => {
    if (pin.join('') === gallery.pin) {
      setIsAuthenticated(true);
    } else {
      alert('PIN incorrect');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="pin-screen">
        <div className="pin-card">
          <div className="photographer-brand">
            <img src={gallery.photographerAvatar} alt={gallery.photographerName} className="brand-avatar" />
            <span>{gallery.photographerName}</span>
          </div>
          <h2>{gallery.title}</h2>
          <p>{t('enter_pin', 'Veuillez entrer le code PIN pour accéder à votre galerie')}</p>
          
          <div className="pin-inputs">
            {pin.map((digit, idx) => (
              <input
                key={idx}
                id={`pin-${idx}`}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handlePinChange(idx, e.target.value)}
                className="pin-digit"
              />
            ))}
          </div>
          <button className="btn-access" onClick={verifyPin}>
            {t('access_gallery', 'Accéder à la galerie')}
          </button>
        </div>
      </div>
    );
  }

  const displayedPhotos = showFavoritesOnly 
    ? gallery.photos.filter(p => favorites.has(p.id))
    : gallery.photos;

  return (
    <div className="gallery-page">
      {/* Header */}
      <header className="gallery-header">
        <div className="gallery-meta">
          <h1>{gallery.title}</h1>
          <div className="gallery-info">
            <span className="photographer-name">
              <img src={gallery.photographerAvatar} alt="" className="mini-avatar" />
              {gallery.photographerName}
            </span>
            <span className="dot">•</span>
            <span>{gallery.date}</span>
            <span className="dot">•</span>
            <span>{gallery.photos.length} photos</span>
          </div>
        </div>
      </header>

      {/* Toolbar */}
      <div className="gallery-toolbar-container">
        <div className="gallery-toolbar">
          <div className="toolbar-left">
            <button 
              className={`filter-btn ${showFavoritesOnly ? 'active' : ''}`}
              onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
            >
              ♥ {t('favorites', 'Favoris')} ({favorites.size})
            </button>
          </div>
          
          <div className="toolbar-right">
            {selectedPhotos.size > 0 && (
              <button className="btn-download-selected">
                ↓ {t('download_selection', 'Télécharger la sélection')} ({selectedPhotos.size})
              </button>
            )}
            <button className="btn-download-all">
              ↓ {t('download_all', 'Tout télécharger')}
            </button>
          </div>
        </div>
      </div>

      {/* Grid */}
      <main className="gallery-grid-container">
        <div className="gallery-grid">
          {displayedPhotos.map((photo) => (
            <div 
              key={photo.id} 
              className={`gallery-item ${selectedPhotos.has(photo.id) ? 'selected' : ''}`}
              onClick={() => setLightboxPhoto(photo)}
            >
              <img src={photo.url} alt="" loading="lazy" className="gallery-img" />
              
              <div className="gallery-item-overlay">
                <div className="overlay-top">
                  <div 
                    className="checkbox-wrapper"
                    onClick={(e) => toggleSelection(photo.id, e)}
                  >
                    <div className={`custom-checkbox ${selectedPhotos.has(photo.id) ? 'checked' : ''}`}>
                      {selectedPhotos.has(photo.id) && '✓'}
                    </div>
                  </div>
                  
                  <button 
                    className={`fav-btn ${favorites.has(photo.id) ? 'active' : ''}`}
                    onClick={(e) => toggleFavorite(photo.id, e)}
                  >
                    {favorites.has(photo.id) ? '♥' : '♡'}
                  </button>
                </div>
                
                <div className="overlay-bottom">
                  <button className="single-download-btn" onClick={(e) => { e.stopPropagation(); /* download logic */ }}>
                    ↓
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="gallery-footer">
        <p>Photos par {gallery.photographerName} via <strong>LensPro</strong></p>
      </footer>

      {/* Simple Lightbox */}
      {lightboxPhoto && (
        <div className="lightbox-overlay" onClick={() => setLightboxPhoto(null)}>
          <button className="lightbox-close">✕</button>
          <img src={lightboxPhoto.url} alt="" className="lightbox-img" onClick={e => e.stopPropagation()} />
        </div>
      )}
    </div>
  );
}
