'use client';

import React, { useState } from 'react';
import styles from './admin.module.css';
import { useDemo } from '@/context/DemoContext';

export default function AdminDashboard() {
  const {
    demoMode,
    toggleDemoMode,
    testimonials,
    updateTestimonialStatus,
    deleteTestimonial,
    photographers,
    togglePhotographerStatus,
    deletePhotographer,
    addPhotographer
  } = useDemo();

  // Admin Auth Gate
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [passError, setPassError] = useState(false);

  // Search & Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('photographers'); // photographers | testimonials | demo | scalability

  // Add Photographer Form Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPName, setNewPName] = useState('');
  const [newPEmail, setNewPEmail] = useState('');
  const [newPCity, setNewPCity] = useState('Kinshasa');
  const [newPSpec, setNewPSpec] = useState('Mariage');

  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (passcode === 'admin123' || passcode === 'admin' || passcode === '1234') {
      setIsAdminAuthenticated(true);
      setPassError(false);
    } else {
      setPassError(true);
    }
  };

  const handleAddPhotographerSubmit = (e) => {
    e.preventDefault();
    if (!newPName || !newPEmail) return;

    addPhotographer({
      name: newPName,
      email: newPEmail,
      city: newPCity,
      specialty: newPSpec,
      avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 50) + 1}`,
    });

    setShowAddModal(false);
    setNewPName('');
    setNewPEmail('');
  };

  const filteredPhotographers = photographers.filter(p =>
    (p.name && p.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (p.email && p.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (p.city && p.city.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const activeCount = photographers.filter(p => p.status === 'Actif').length;
  const trialCount = photographers.filter(p => p.status === 'Essai' || !p.status).length;
  const disabledCount = photographers.filter(p => p.status === 'Désactivé' || p.status === 'Expiré').length;
  const monthlyRevenue = activeCount * 50;

  // PASSCODE LOCK SCREEN
  if (!isAdminAuthenticated) {
    return (
      <div className={styles.loginOverlay}>
        <div className={styles.loginCard}>
          <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🔐</div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>Accès Administration</h2>
          <p style={{ color: '#a0a0b5', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            Veuillez entrer le mot de passe administrateur pour accéder à la gestion de LensPro.
          </p>
          <form onSubmit={handleAdminLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <input
              type="password"
              placeholder="Code administrateur (ex: admin123)"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              className={styles.searchInput}
              style={{ width: '100%', textAlign: 'center', fontSize: '1.1rem', letterSpacing: '2px' }}
              autoFocus
            />
            {passError && (
              <p style={{ color: '#ef4444', fontSize: '0.85rem' }}>❌ Code incorrect. Essayez "admin123".</p>
            )}
            <button type="submit" className={styles.btnPrimary} style={{ width: '100%' }}>
              Déverrouiller le Panneau Admin
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.adminContainer}>
      {/* Header */}
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>⚡ Panneau d'Administration LensPro</h1>
          <p className={styles.subtitle}>Supervision globale, gestion des abonnements, mode démo et témoignages</p>
        </div>

        <div className={styles.headerActions}>
          <button onClick={() => setIsAdminAuthenticated(false)} className={styles.btnOutline}>
            🔒 Déconnexion Admin
          </button>
        </div>
      </header>

      {/* Overview Stats */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Total Photographes</div>
          <div className={styles.statValue}>{photographers.length}</div>
        </div>
        <div className={styles.statCard} style={{ borderColor: 'rgba(16, 185, 129, 0.3)' }}>
          <div className={styles.statLabel}>Abonnements Actifs ($50/m)</div>
          <div className={styles.statValue} style={{ color: '#10b981' }}>{activeCount}</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>En Période d'Essai (14j)</div>
          <div className={styles.statValue} style={{ color: '#f59e0b' }}>{trialCount}</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Comptes Désactivés</div>
          <div className={styles.statValue} style={{ color: '#ef4444' }}>{disabledCount}</div>
        </div>
        <div className={`${styles.statCard} ${styles.revenueCard}`}>
          <div className={styles.statLabel}>Revenu Mensuel Estimé</div>
          <div className={styles.statValue}>{monthlyRevenue} $</div>
        </div>
      </div>

      {/* Tabs */}
      <div className={styles.tabNav}>
        <button
          className={`${styles.tabBtn} ${activeTab === 'photographers' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('photographers')}
        >
          👥 Photographes Abonnés ({photographers.length})
        </button>
        <button
          className={`${styles.tabBtn} ${activeTab === 'demo' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('demo')}
        >
          🖼️ Mode Démo ({demoMode ? 'Activé' : 'Désactivé'})
        </button>
        <button
          className={`${styles.tabBtn} ${activeTab === 'testimonials' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('testimonials')}
        >
          💬 Témoignages Client ({testimonials.length})
        </button>
        <button
          className={`${styles.tabBtn} ${activeTab === 'scalability' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('scalability')}
        >
          🚀 Guide 1000+ Photographes
        </button>
      </div>

      {/* TAB 1: PHOTOGRAPHERS MANAGEMENT */}
      {activeTab === 'photographers' && (
        <div className={styles.tableSection}>
          <div className={styles.tableHeader}>
            <div>
              <h2>Gestion des Photographes & Abonnements</h2>
              <p style={{ color: '#a0a0b5', fontSize: '0.85rem', margin: '4px 0 0 0' }}>
                Activez ou désactivez les accès selon le paiement Mobile Money (Airtel / Orange).
              </p>
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <input
                type="text"
                placeholder="Rechercher par nom, email, ville..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={styles.searchInput}
              />
              <button onClick={() => setShowAddModal(true)} className={styles.btnPrimary}>
                + Ajouter un Photographe
              </button>
            </div>
          </div>

          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Photographe</th>
                  <th>Spécialité & Ville</th>
                  <th>Statut Abonnement</th>
                  <th>Inscrit le</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPhotographers.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <div className={styles.photographerInfo}>
                        <img src={p.avatar || 'https://i.pravatar.cc/150?img=1'} alt={p.name} className={styles.avatarImg} />
                        <div>
                          <div className={styles.name}>{p.name}</div>
                          <div className={styles.email}>{p.email || `${p.username || 'user'}@lenspro.com`}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className={styles.specialty}>{p.specialty || 'Général'}</div>
                      <div className={styles.city}>{p.city || 'Kinshasa'}</div>
                    </td>
                    <td>
                      <span className={`${styles.badge} ${p.status === 'Actif' ? styles.badgeActif : p.status === 'Désactivé' ? styles.badgeExpiré : styles.badgeEssai}`}>
                        {p.status || 'Essai (14j)'}
                      </span>
                    </td>
                    <td>{p.joinDate || '2026-09-17'}</td>
                    <td>
                      <div className={styles.actions}>
                        <button
                          onClick={() => togglePhotographerStatus(p.id)}
                          className={`${styles.actionBtn} ${p.status === 'Actif' ? styles.deactivateBtn : styles.activateBtn}`}
                          title={p.status === 'Actif' ? 'Désactiver le compte' : 'Activer le compte (Payé 50$)'}
                        >
                          {p.status === 'Actif' ? '🚫 Désactiver' : '✅ Valider 50$'}
                        </button>

                        <button
                          onClick={() => deletePhotographer(p.id)}
                          className={`${styles.actionBtn} ${styles.deleteBtn}`}
                          title="Supprimer ce compte"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: DEMO MODE SETTINGS */}
      {activeTab === 'demo' && (
        <div className={styles.tableSection} style={{ padding: '2rem' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            🖼️ Mode Démo & Photos de Démonstration
          </h2>
          <p style={{ color: '#a0a0b5', fontSize: '0.95rem', marginBottom: '2rem', maxWidth: '700px' }}>
            Par défaut, le mode démo affiche des photos et profils fictifs d'exemple pour montrer le potentiel de LensPro aux nouveaux visiteurs. 
            Une fois vos vrais photographes abonnés, vous pouvez désactiver le mode démo pour que **seules leurs vraies photos** apparaissent !
          </p>

          <div className={styles.demoBox}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#fff', marginBottom: '4px' }}>
                  Statut du Mode Démo : {demoMode ? '🟢 ACTIVÉ (Photos d\'exemples affichées)' : '🔴 DÉSACTIVÉ (Uniquement vrais abonnés)'}
                </h4>
                <p style={{ color: '#a0a0b5', fontSize: '0.85rem' }}>
                  {demoMode 
                    ? 'Le site affiche les photos et portfolios de démonstration.'
                    : 'Le site masque toutes les photos fictives et affiche uniquement les photos réelles importées par vos photographes.'}
                </p>
              </div>

              <button
                onClick={() => toggleDemoMode()}
                className={demoMode ? styles.btnOutline : styles.btnPrimary}
                style={{ padding: '12px 24px', fontSize: '1rem', fontWeight: 600 }}
              >
                {demoMode ? 'Retirer les photos démo (Désactiver)' : 'Activer les photos démo'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: DYNAMIC TESTIMONIALS MANAGEMENT */}
      {activeTab === 'testimonials' && (
        <div className={styles.tableSection}>
          <div className={styles.tableHeader}>
            <div>
              <h2>Gestion des Témoignages</h2>
              <p style={{ color: '#a0a0b5', fontSize: '0.85rem', margin: '4px 0 0 0' }}>
                Validez ou modérez les témoignages soumis par les vrais visiteurs et photographes.
              </p>
            </div>
          </div>

          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Auteur</th>
                  <th>Témoignage</th>
                  <th>Note</th>
                  <th>Statut</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {testimonials.map((t) => (
                  <tr key={t.id}>
                    <td>
                      <div className={styles.photographerInfo}>
                        <img src={t.avatar || 'https://i.pravatar.cc/150?img=1'} alt={t.name} className={styles.avatarImg} />
                        <div>
                          <div className={styles.name}>{t.name}</div>
                          <div className={styles.email}>{t.role}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ maxWidth: '350px', fontSize: '0.9rem', fontStyle: 'italic', color: '#e2e8f0' }}>
                      "{t.text}"
                    </td>
                    <td>{'★'.repeat(t.rating || 5)}</td>
                    <td>
                      <span className={`${styles.badge} ${t.status === 'approved' ? styles.badgeActif : styles.badgeEssai}`}>
                        {t.status === 'approved' ? 'Approuvé (Publié)' : 'En attente'}
                      </span>
                    </td>
                    <td>{t.date}</td>
                    <td>
                      <div className={styles.actions}>
                        {t.status !== 'approved' && (
                          <button
                            onClick={() => updateTestimonialStatus(t.id, 'approved')}
                            className={`${styles.actionBtn} ${styles.activateBtn}`}
                            title="Publier sur la landing page"
                          >
                            ✅ Publier
                          </button>
                        )}
                        <button
                          onClick={() => deleteTestimonial(t.id)}
                          className={`${styles.actionBtn} ${styles.deleteBtn}`}
                          title="Supprimer"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: SCALABILITY GUIDE FOR 1000+ PHOTOGRAPHERS */}
      {activeTab === 'scalability' && (
        <div className={styles.tableSection} style={{ padding: '2rem' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            🚀 Guide pour Gérer 1000+ Photographes & Financer l'Hébergement
          </h2>
          <p style={{ color: '#a0a0b5', fontSize: '0.95rem', marginBottom: '2rem' }}>
            Voici le plan financier et technique pour passer de vos premiers abonnés à plus de 1000 photographes en toute sérénité.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            <div className={styles.statCard} style={{ background: 'rgba(37, 99, 235, 0.1)', borderColor: 'rgba(37, 99, 235, 0.3)' }}>
              <h4 style={{ color: '#60a5fa', fontSize: '1.1rem', marginBottom: '8px' }}>💰 Simulation de Revenus</h4>
              <p style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff' }}>50 000 $ / mois</p>
              <p style={{ color: '#a0a0b5', fontSize: '0.85rem', marginTop: '8px' }}>
                1 000 photographes × 50$/mois = 50 000 $ bruts par mois (600 000 $ / an !).
              </p>
            </div>

            <div className={styles.statCard} style={{ background: 'rgba(16, 185, 129, 0.1)', borderColor: 'rgba(16, 185, 129, 0.3)' }}>
              <h4 style={{ color: '#34d399', fontSize: '1.1rem', marginBottom: '8px' }}>☁️ Coûts d'Hébergement (Cloud)</h4>
              <p style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff' }}>~ 100 $ - 300 $ / mois</p>
              <p style={{ color: '#a0a0b5', fontSize: '0.85rem', marginTop: '8px' }}>
                Le coût d'hébergement Supabase Pro (25$/mois) + Vercel Pro (20$/mois) + Stockage Cloudflare R2 est extrêmement bas !
              </p>
            </div>

            <div className={styles.statCard} style={{ background: 'rgba(245, 158, 11, 0.1)', borderColor: 'rgba(245, 158, 11, 0.3)' }}>
              <h4 style={{ color: '#fbbf24', fontSize: '1.1rem', marginBottom: '8px' }}>📈 Marge Bénéficiaire Nette</h4>
              <p style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff' }}>+ 99 % de Marge</p>
              <p style={{ color: '#a0a0b5', fontSize: '0.85rem', marginTop: '8px' }}>
                Votre plateforme SaaS conserve quasiment l'intégralité de ses revenus sous forme de bénéfice net !
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ADD PHOTOGRAPHER MODAL */}
      {showAddModal && (
        <div className={styles.modalOverlay} onClick={() => setShowAddModal(false)}>
          <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
            <button className={styles.modalClose} onClick={() => setShowAddModal(false)}>✕</button>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '1rem' }}>+ Ajouter un Photographe Abonné</h3>
            
            <form onSubmit={handleAddPhotographerSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: '#a0a0b5', marginBottom: '4px' }}>Nom complet *</label>
                <input
                  type="text"
                  required
                  placeholder="ex: Christian Mbaye"
                  value={newPName}
                  onChange={(e) => setNewPName(e.target.value)}
                  className={styles.searchInput}
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: '#a0a0b5', marginBottom: '4px' }}>Email *</label>
                <input
                  type="email"
                  required
                  placeholder="ex: christian@gmail.com"
                  value={newPEmail}
                  onChange={(e) => setNewPEmail(e.target.value)}
                  className={styles.searchInput}
                  style={{ width: '100%' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: '#a0a0b5', marginBottom: '4px' }}>Ville</label>
                  <input
                    type="text"
                    value={newPCity}
                    onChange={(e) => setNewPCity(e.target.value)}
                    className={styles.searchInput}
                    style={{ width: '100%' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: '#a0a0b5', marginBottom: '4px' }}>Spécialité</label>
                  <select
                    value={newPSpec}
                    onChange={(e) => setNewPSpec(e.target.value)}
                    className={styles.searchInput}
                    style={{ width: '100%', background: '#12121a' }}
                  >
                    <option value="Mariage">Mariage</option>
                    <option value="Portrait">Portrait</option>
                    <option value="Événement">Événement</option>
                    <option value="Mode">Mode</option>
                    <option value="Gastronomie">Gastronomie</option>
                  </select>
                </div>
              </div>

              <button type="submit" className={styles.btnPrimary} style={{ marginTop: '1rem' }}>
                Valider et Créer le compte Abonné
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
