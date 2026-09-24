'use client';

import React, { useState } from 'react';
import './profile.css';
import PhotoGrid from '@/components/PhotoGrid/PhotoGrid';
import BeforeAfter from '@/components/BeforeAfter/BeforeAfter';
import PhotoModal from '@/components/PhotoModal/PhotoModal';
import { useLanguage } from '@/context/LanguageContext';
import { photographerProfile, categories } from '@/lib/mockData';

export default function PhotographerProfilePage({ params }) {
  const { username } = params;
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('portfolio');
  const [activeCategory, setActiveCategory] = useState('Tous');
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  // Use mock data
  const profile = photographerProfile;

  const filteredPhotos = profile.portfolio.filter(photo => 
    activeCategory === 'Tous' || photo.category === activeCategory
  );

  return (
    <div className="profile-page">
      {/* Cover and Header */}
      <div className="profile-cover" style={{ backgroundImage: `url(${profile.coverUrl})` }}>
        <div className="cover-overlay"></div>
      </div>

      <div className="profile-header-container">
        <div className="profile-header">
          <div className="avatar-container">
            <img src={profile.avatarUrl} alt={profile.name} className="profile-avatar" />
          </div>
          
          <div className="profile-info">
            <div className="profile-title-row">
              <h1>
                {profile.name}
                {profile.verified && <span className="verified-badge" title="Vérifié">✓</span>}
              </h1>
              <div className="profile-actions">
                <button className="btn-contact">{t('contact', 'Contacter')}</button>
                <button className="btn-hire">{t('hire', 'Engager')}</button>
              </div>
            </div>
            
            <p className="profile-specialty">
              {profile.specialty} • 📍 {profile.city}
            </p>
            
            <p className="profile-bio">{profile.bio}</p>
            
            <div className="profile-stats">
              <div className="stat-item">
                <span className="stat-value">{profile.stats.photos}</span>
                <span className="stat-label">Photos</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{profile.stats.likes}</span>
                <span className="stat-label">Likes</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{profile.stats.views}</span>
                <span className="stat-label">Vues</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="profile-tabs-container">
        <div className="profile-tabs">
          <button 
            className={`tab-btn ${activeTab === 'portfolio' ? 'active' : ''}`}
            onClick={() => setActiveTab('portfolio')}
          >
            Portfolio
          </button>
          <button 
            className={`tab-btn ${activeTab === 'before-after' ? 'active' : ''}`}
            onClick={() => setActiveTab('before-after')}
          >
            {t('before_after', 'Avant/Après')}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="profile-content">
        {activeTab === 'portfolio' && (
          <div className="portfolio-section">
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
            
            <PhotoGrid 
              photos={filteredPhotos}
              onPhotoClick={setSelectedPhoto}
            />
          </div>
        )}

        {activeTab === 'before-after' && (
          <div className="before-after-grid">
            {profile.beforeAfterWorks.map((work, idx) => (
              <div key={idx} className="before-after-item">
                <BeforeAfter 
                  beforeImage={work.before}
                  afterImage={work.after}
                  beforeLabel={t('before', 'Avant')}
                  afterLabel={t('after', 'Après')}
                />
                <h3 className="work-title">{work.title}</h3>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {selectedPhoto && (
        <PhotoModal
          photo={selectedPhoto}
          onClose={() => setSelectedPhoto(null)}
          t={t}
        />
      )}
    </div>
  );
}
