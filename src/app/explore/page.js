'use client';

import React, { useState } from 'react';
import './explore.css';
import PhotoGrid from '@/components/PhotoGrid/PhotoGrid';
import PhotoModal from '@/components/PhotoModal/PhotoModal';
import { useLanguage } from '@/context/LanguageContext';
import { useDemo } from '@/context/DemoContext';
import { categories } from '@/lib/mockData';

export default function ExplorePage() {
  const { t } = useLanguage();
  const { activePhotos, demoMode } = useDemo();
  const [activeCategory, setActiveCategory] = useState('Tous');
  const [activeTab, setActiveTab] = useState('tendances'); // tendances or recentes
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Filter photos based on category & search term
  const filteredPhotos = activePhotos.filter(photo => {
    const matchCategory = activeCategory === 'Tous' || photo.category === activeCategory;
    const matchSearch = !searchTerm || 
      photo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (photo.photographerName && photo.photographerName.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchCategory && matchSearch;
  });

  const handleNextPhoto = () => {
    const currentIndex = filteredPhotos.findIndex(p => p.id === selectedPhoto.id);
    if (currentIndex < filteredPhotos.length - 1) {
      setSelectedPhoto(filteredPhotos[currentIndex + 1]);
    }
  };

  const handlePrevPhoto = () => {
    const currentIndex = filteredPhotos.findIndex(p => p.id === selectedPhoto.id);
    if (currentIndex > 0) {
      setSelectedPhoto(filteredPhotos[currentIndex - 1]);
    }
  };

  return (
    <div className="explore-page">
      {/* Hero Search Section */}
      <section className="explore-hero">
        <div className="hero-content">
          <h1>Découvrez des moments uniques</h1>
          <p>Les meilleurs photographes professionnels</p>
          
          <div className="search-bar">
            <span className="search-icon">🔍</span>
            <input 
              type="text" 
              placeholder="Rechercher une photo, un photographe, un style..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* Navigation & Filters */}
      <section className="explore-filters">
        <div className="categories-scroll">
          {categories.map(category => (
            <button
              key={category}
              className={`category-pill ${activeCategory === category ? 'active' : ''}`}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="feed-toggle">
          <button 
            className={`toggle-btn ${activeTab === 'tendances' ? 'active' : ''}`}
            onClick={() => setActiveTab('tendances')}
          >
            🔥 Tendances
          </button>
          <button 
            className={`toggle-btn ${activeTab === 'recentes' ? 'active' : ''}`}
            onClick={() => setActiveTab('recentes')}
          >
            ✨ Récentes
          </button>
        </div>
      </section>

      {/* Main Grid */}
      <section className="explore-grid-section">
        {filteredPhotos.length > 0 ? (
          <>
            <PhotoGrid 
              photos={filteredPhotos} 
              onPhotoClick={setSelectedPhoto}
              columns={{ mobile: 2, tablet: 3, desktop: 4 }}
            />
            
            <div className="load-more-container">
              <button className="load-more-btn">
                Charger plus
              </button>
            </div>
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '4rem 1rem', color: '#a0a0b5' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📸</div>
            <h3>Aucune photo trouvée</h3>
            <p style={{ marginTop: '0.5rem' }}>
              {demoMode ? 'Essayez de changer de catégorie ou de filtre.' : 'Soyez le premier photographe abonné à publier vos photos sur la plateforme !'}
            </p>
          </div>
        )}
      </section>

      {/* Photo Modal */}
      {selectedPhoto && (
        <PhotoModal
          photo={selectedPhoto}
          onClose={() => setSelectedPhoto(null)}
          onNext={handleNextPhoto}
          onPrev={handlePrevPhoto}
          t={t}
        />
      )}
    </div>
  );
}
