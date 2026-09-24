'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import './page.css';
import { useLanguage } from '@/context/LanguageContext';
import { useDemo } from '@/context/DemoContext';

export default function LandingPage() {
  const { t } = useLanguage();
  const { approvedTestimonials, addTestimonial, demoMode } = useDemo();

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showTestimonialModal, setShowTestimonialModal] = useState(false);
  
  // Testimonial Form State
  const [testiName, setTestiName] = useState('');
  const [testiRole, setTestiRole] = useState('');
  const [testiText, setTestiText] = useState('');
  const [testiRating, setTestiRating] = useState(5);
  const [testiSubmitted, setTestiSubmitted] = useState(false);

  const handleTestimonialSubmit = (e) => {
    e.preventDefault();
    if (!testiName || !testiText) return;

    addTestimonial({
      name: testiName,
      role: testiRole || 'Visiteur / Photographe',
      text: testiText,
      rating: Number(testiRating),
      status: 'pending' // Admin can approve in /admin
    });

    setTestiSubmitted(true);
    setTimeout(() => {
      setShowTestimonialModal(false);
      setTestiSubmitted(false);
      setTestiName('');
      setTestiRole('');
      setTestiText('');
    }, 2000);
  };

  return (
    <main className="page-wrapper">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-bg">
          <div className="orb-1"></div>
          <div className="orb-2"></div>
        </div>
        <div className="container">
          <div className="hero-content">
            <div className="trial-badge">⚡ 14 jours d'essai gratuit</div>
            <h1 className="hero-title">
              Votre vitrine photo{' '}
              <span className="gradient-text">professionnelle</span>
            </h1>
            <p className="hero-subtitle">
              LensPro offre aux photographes une plateforme d'exception pour exposer leurs œuvres, livrer des galeries privées à leurs clients en qualité originale sans compression, et développer leur activité.
            </p>
            <div className="hero-actions">
              <Link href="/auth/register" className="btn-primary">
                🚀 Commencer gratuitement
              </Link>
              <Link href="/explore" className="btn-outline">
                🔍 Découvrir les photographes
              </Link>
            </div>
            
            <div className="hero-stats">
              <div className="stat-item">
                <span className="stat-value gradient-text">500+</span>
                <span className="stat-label">Photographes</span>
              </div>
              <div className="stat-item">
                <span className="stat-value gradient-text">50K+</span>
                <span className="stat-label">Photos Haute Qualité</span>
              </div>
              <div className="stat-item">
                <span className="stat-value gradient-text">10K+</span>
                <span className="stat-label">Clients Satisfaits</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features" id="features">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Tout ce dont vous avez besoin</h2>
            <p className="section-subtitle">Des outils uniques conçus pour booster l'activité des photographes</p>
          </div>
          
          <div className="features-grid">
            <FeatureCard icon="📸" title="Portfolio Public" desc="Exposez vos plus belles photos au monde entier avec une vitrine élégante." />
            <FeatureCard icon="🔒" title="Galeries Privées Clients" desc="Livrez les photos de vos événements en qualité originale sans aucune compression WhatsApp !" />
            <FeatureCard icon="🌐" title="Réseau Social Photographes" desc="Rejoignez la communauté, échangez des likes et gagnez en visibilité." />
            <FeatureCard icon="✨" title="Slider Avant / Après" desc="Montrez la puissance de votre travail de retouche avec un comparateur interactif." />
            <FeatureCard icon="📱" title="QR Code Événement" desc="Générez un QR code pour vos événements. Les invités scannent et accèdent aux photos." />
            <FeatureCard icon="📊" title="Analytiques Avancés" desc="Suivez en direct vos vues, likes et téléchargements clients." />
            <FeatureCard icon="©️" title="Filigrane Automatique" desc="Protégez vos photos publiques contre le vol avec un filigrane personnalisable." />
            <FeatureCard icon="💎" title="Paiement Mobile Money" desc="Abonnez-vous facilement via Airtel Money et Orange Money avec activation rapide." />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="how-it-works">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Comment ça marche ?</h2>
          </div>
          
          <div className="steps-container">
            <div className="step-item">
              <div className="step-icon-wrapper">1</div>
              <h3 className="step-title">Inscrivez-vous</h3>
              <p className="step-desc">Créez votre profil photographe en 1 minute et profitez automatiquement de 14 jours d'essai gratuit.</p>
            </div>
            
            <div className="step-item">
              <div className="step-icon-wrapper">2</div>
              <h3 className="step-title">Uploadez vos photos</h3>
              <p className="step-desc">Publiez vos photos sur votre vitrine et créez des galeries privées sécurisées par PIN pour vos clients.</p>
            </div>
            
            <div className="step-item">
              <div className="step-icon-wrapper">3</div>
              <h3 className="step-title">Partagez le lien</h3>
              <p className="step-desc">Vos clients visualisent et téléchargent leurs photos directement via leur lien personnalisé.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Photographer Showcase */}
      <section className="showcase" id="showcase">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Nos photographes vedettes</h2>
            <p className="section-subtitle">Découvrez quelques-uns des talents inscrits sur LensPro</p>
          </div>
          
          <div className="carousel-container">
            {[
              { name: 'Jean-Pierre Lumba', city: 'Kinshasa', spec: 'Mariage', avatar: 'https://i.pravatar.cc/150?img=11', seed: 1 },
              { name: 'Marie Mutombo', city: 'Lubumbashi', spec: 'Portrait', avatar: 'https://i.pravatar.cc/150?img=5', seed: 2 },
              { name: 'Alain Nsengiyumva', city: 'Goma', spec: 'Nature', avatar: 'https://i.pravatar.cc/150?img=33', seed: 3 },
              { name: 'Sophie Kameni', city: 'Douala', spec: 'Mode', avatar: 'https://i.pravatar.cc/150?img=47', seed: 4 },
            ].map((p, idx) => (
              <div key={idx} className="photographer-card glass-card">
                <div className="pc-header">
                  <img src={p.avatar} alt={p.name} className="pc-avatar" />
                  <div className="pc-info">
                    <h4>{p.name}</h4>
                    <p>{p.spec} • {p.city}</p>
                  </div>
                </div>
                <div className="pc-grid">
                  <div className="pc-photo" style={{ backgroundImage: `url(https://picsum.photos/seed/pc${p.seed}1/300/200)` }}></div>
                  <div className="pc-photo" style={{ backgroundImage: `url(https://picsum.photos/seed/pc${p.seed}2/300/200)` }}></div>
                  <div className="pc-photo" style={{ backgroundImage: `url(https://picsum.photos/seed/pc${p.seed}3/300/200)` }}></div>
                  <div className="pc-photo" style={{ backgroundImage: `url(https://picsum.photos/seed/pc${p.seed}4/300/200)` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="pricing" id="pricing">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Tarification Simple & Accessible</h2>
            <p className="section-subtitle">Un abonnement clair pour propulser votre entreprise de photographie</p>
          </div>
          
          <div className="pricing-grid">
            {/* Free Trial Plan */}
            <div className="pricing-card glass-card">
              <div className="trial-badge">14 Jours Offerts</div>
              <h3 className="plan-name">Essai Gratuit</h3>
              <div className="plan-price">0$<span style={{ fontSize: '1rem', color: '#a0a0a0' }}> / 14 jours</span></div>
              <ul className="plan-features">
                <li>✅ 14 jours d'accès complet sans engagement</li>
                <li>✅ Portfolio public d'exposition</li>
                <li>✅ 3 Galeries privées clients</li>
                <li>✅ Filigrane LensPro</li>
                <li>✅ Support par email et WhatsApp</li>
              </ul>
              <Link href="/auth/register" className="btn-outline plan-btn">
                🎁 Commencer l'essai gratuit
              </Link>
            </div>
            
            {/* Pro Plan */}
            <div className="pricing-card glass-card pro">
              <div className="popular-badge">Populaire & Recommandé</div>
              <h3 className="plan-name">Professionnel</h3>
              <div className="plan-price">50$<span> / mois</span></div>
              <ul className="plan-features">
                <li>🌟 Stockage & Galeries illimités</li>
                <li>🌟 Qualité photo originale sans perte</li>
                <li>🌟 Slider Avant / Après retouche</li>
                <li>🌟 Codes PIN & QR Codes pour événements</li>
                <li>🌟 Badge Pro Vérifié sur votre profil</li>
                <li>🌟 Support prioritaire 7j/7 via WhatsApp</li>
              </ul>
              <button 
                onClick={() => setShowPaymentModal(true)} 
                className="btn-primary plan-btn"
              >
                📲 S'abonner maintenant (50$/mois)
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Mobile Money Section */}
      <section className="contact" id="contact">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Paiement par Mobile Money</h2>
            <p className="section-subtitle">Abonnez-vous ou renouvelez votre compte directement via vos comptes Airtel Money et Orange Money</p>
          </div>
          
          <div className="contact-grid">
            <div className="contact-card glass-card airtel">
              <div className="contact-icon">📱</div>
              <h4 className="contact-number">099 90 68 332</h4>
              <p className="contact-operator">Airtel Money</p>
              <a 
                href="https://wa.me/24399068332?text=Bonjour,%20je%20souhaite%20activer%20mon%20abonnement%20LensPro%20(50$)" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="wa-btn"
              >
                💬 Contacter sur WhatsApp (Airtel)
              </a>
            </div>
            
            <div className="contact-card glass-card orange">
              <div className="contact-icon">📱</div>
              <h4 className="contact-number">089 20 89 958</h4>
              <p className="contact-operator">Orange Money</p>
              <a 
                href="https://wa.me/24389208958?text=Bonjour,%20je%20souhaite%20activer%20mon%20abonnement%20LensPro%20(50$)" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="wa-btn"
              >
                💬 Contacter sur WhatsApp (Orange)
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials" id="testimonials">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Ce qu'en disent nos utilisateurs</h2>
            <p className="section-subtitle">Témoignages réels de photographes et clients de la plateforme</p>
          </div>
          
          <div className="testi-grid">
            {approvedTestimonials.map((tItem) => (
              <div key={tItem.id} className="testi-card glass-card">
                <div className="testi-stars">{'★'.repeat(tItem.rating || 5)}</div>
                <p className="testi-text">"{tItem.text}"</p>
                <div className="testi-author">
                  <img src={tItem.avatar} alt={tItem.name} className="testi-avatar" />
                  <div className="testi-author-info">
                    <h5>{tItem.name}</h5>
                    <p>{tItem.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <button 
              onClick={() => setShowTestimonialModal(true)} 
              className="btn-outline"
            >
              ✍️ Laisser un témoignage
            </button>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <div className="container" style={{ margin: '4rem auto' }}>
        <div className="cta-banner">
          <div className="cta-content">
            <h2 className="cta-title">Prêt à propulser votre art photo ?</h2>
            <p className="cta-desc">Rejoignez la plateforme numéro 1 pour photographes professionnels.</p>
            <Link href="/auth/register" className="btn-primary cta-btn">
              🚀 Commencer l'essai gratuit de 14 jours
            </Link>
          </div>
        </div>
      </div>

      {/* PAYMENT MODAL */}
      {showPaymentModal && (
        <div className="modal-overlay" onClick={() => setShowPaymentModal(false)}>
          <div className="modal-card glass-card" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowPaymentModal(false)}>✕</button>
            <h3 className="modal-title">📲 Activer votre Abonnement Pro (50$/mois)</h3>
            <p className="modal-desc">
              Pour vous abonner ou prolonger votre compte, effectuez un dépôt de <strong>50$</strong> via Mobile Money puis contactez l'administration sur WhatsApp avec votre preuve de paiement :
            </p>
            
            <div className="modal-payment-options">
              <div className="payment-box">
                <span className="pay-badge airtel-badge">Airtel Money</span>
                <div className="pay-num">099 90 68 332</div>
                <a 
                  href="https://wa.me/24399068332?text=Bonjour,%20je%20viens%20d'effectuer%20le%20paiement%20de%2050$%20via%20Airtel%20Money.%20Voici%20ma%20preuve:" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="btn-primary"
                  style={{ display: 'inline-block', marginTop: '0.75rem', fontSize: '0.9rem' }}
                >
                  Envoyer Preuve sur WhatsApp
                </a>
              </div>

              <div className="payment-box">
                <span className="pay-badge orange-badge">Orange Money</span>
                <div className="pay-num">089 20 89 958</div>
                <a 
                  href="https://wa.me/24389208958?text=Bonjour,%20je%20viens%20d'effectuer%20le%20paiement%20de%2050$%20via%20Orange%20Money.%20Voici%20ma%20preuve:" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="btn-primary"
                  style={{ display: 'inline-block', marginTop: '0.75rem', fontSize: '0.9rem' }}
                >
                  Envoyer Preuve sur WhatsApp
                </a>
              </div>
            </div>

            <p style={{ fontSize: '0.85rem', color: '#a0a0b5', marginTop: '1.5rem', textAlign: 'center' }}>
              Une fois votre paiement vérifié par l'administrateur, votre compte sera activé instantanément pour 30 jours !
            </p>
          </div>
        </div>
      )}

      {/* TESTIMONIAL MODAL */}
      {showTestimonialModal && (
        <div className="modal-overlay" onClick={() => setShowTestimonialModal(false)}>
          <div className="modal-card glass-card" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowTestimonialModal(false)}>✕</button>
            <h3 className="modal-title">✍️ Laisser un témoignage</h3>
            
            {testiSubmitted ? (
              <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎉</div>
                <h4>Merci pour votre témoignage !</h4>
                <p style={{ color: '#a0a0b5', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                  Votre avis a été soumis. Il sera publié sur la plateforme après validation par l'administrateur.
                </p>
              </div>
            ) : (
              <form onSubmit={handleTestimonialSubmit} className="modal-form">
                <div className="form-group">
                  <label>Votre Nom complet *</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="ex: Patrick Mbala" 
                    value={testiName} 
                    onChange={(e) => setTestiName(e.target.value)} 
                  />
                </div>

                <div className="form-group">
                  <label>Votre rôle / activité</label>
                  <input 
                    type="text" 
                    placeholder="ex: Photographe Pro à Kinshasa / Client" 
                    value={testiRole} 
                    onChange={(e) => setTestiRole(e.target.value)} 
                  />
                </div>

                <div className="form-group">
                  <label>Note (Étoiles)</label>
                  <select value={testiRating} onChange={(e) => setTestiRating(e.target.value)}>
                    <option value="5">⭐⭐⭐⭐⭐ (5/5)</option>
                    <option value="4">⭐⭐⭐⭐ (4/5)</option>
                    <option value="3">⭐⭐⭐ (3/5)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Votre témoignage *</label>
                  <textarea 
                    rows="4" 
                    required 
                    placeholder="Racontez votre expérience avec LensPro..." 
                    value={testiText} 
                    onChange={(e) => setTestiText(e.target.value)}
                  ></textarea>
                </div>

                <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                  Soumettre mon témoignage
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </main>
  );
}

function FeatureCard({ icon, title, desc }) {
  return (
    <div className="feature-card glass-card">
      <div className="feature-icon">{icon}</div>
      <h3 className="feature-title">{title}</h3>
      <p className="feature-desc">{desc}</p>
    </div>
  );
}
