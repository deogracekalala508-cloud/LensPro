'use client';
import { useLanguage } from '@/context/LanguageContext';
import styles from './settings.module.css';
import { useState } from 'react';

export default function Settings() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('profil');

  return (
    <div className={styles.settingsContainer}>
      <header className={styles.header}>
        <h1 className={styles.title}>{t('nav.settings', 'Paramètres')}</h1>
        <p className={styles.subtitle}>Gérez votre compte et vos préférences</p>
      </header>

      <div className={styles.tabsContainer}>
        <div className={styles.tabsList}>
          <button 
            className={`${styles.tabBtn} ${activeTab === 'profil' ? styles.active : ''}`}
            onClick={() => setActiveTab('profil')}
          >
            Profil
          </button>
          <button 
            className={`${styles.tabBtn} ${activeTab === 'abonnement' ? styles.active : ''}`}
            onClick={() => setActiveTab('abonnement')}
          >
            Abonnement
          </button>
          <button 
            className={`${styles.tabBtn} ${activeTab === 'notifications' ? styles.active : ''}`}
            onClick={() => setActiveTab('notifications')}
          >
            Notifications
          </button>
          <button 
            className={`${styles.tabBtn} ${activeTab === 'apparence' ? styles.active : ''}`}
            onClick={() => setActiveTab('apparence')}
          >
            Apparence
          </button>
        </div>

        <div className={styles.tabContent}>
          {activeTab === 'profil' && (
            <div className={styles.formGroup}>
              <div className={styles.avatarSection}>
                <div className={styles.avatarLarge}>D</div>
                <button className={styles.uploadBtn}>Changer la photo</button>
              </div>
              <div className={styles.inputGrid}>
                <div className={styles.inputField}>
                  <label>Nom complet</label>
                  <input type="text" defaultValue="Deogratias" className={styles.input} />
                </div>
                <div className={styles.inputField}>
                  <label>Nom d'utilisateur</label>
                  <input type="text" defaultValue="deophoto" className={styles.input} />
                </div>
                <div className={styles.inputField}>
                  <label>Email</label>
                  <input type="email" defaultValue="deo@example.com" className={styles.input} />
                </div>
                <div className={styles.inputField}>
                  <label>Téléphone</label>
                  <input type="tel" defaultValue="+243 00 000 000" className={styles.input} />
                </div>
                <div className={styles.inputField}>
                  <label>Ville</label>
                  <input type="text" defaultValue="Kinshasa" className={styles.input} />
                </div>
                <div className={styles.inputField}>
                  <label>Spécialité</label>
                  <select className={styles.input} defaultValue="mariage">
                    <option value="mariage">Mariage</option>
                    <option value="portrait">Portrait</option>
                    <option value="event">Événementiel</option>
                  </select>
                </div>
              </div>
              <div className={styles.inputField}>
                <label>Bio</label>
                <textarea className={styles.textarea} rows={4} defaultValue="Photographe passionné basé à Kinshasa..."></textarea>
              </div>
              <button className={styles.saveBtn}>Enregistrer les modifications</button>
            </div>
          )}

          {activeTab === 'abonnement' && (
            <div className={styles.subPlanContainer}>
              <div className={styles.currentPlan}>
                <div className={styles.planHeader}>
                  <h3>Plan Actuel : <span>Essai Gratuit</span></h3>
                  <span className={styles.statusBadge}>Expire dans 12 jours</span>
                </div>
                
                <div className={styles.usageStats}>
                  <h4>Stockage Utilisé</h4>
                  <div className={styles.progressBar}>
                    <div className={styles.progressFill} style={{ width: '15%' }}></div>
                  </div>
                  <p>1.5 GB sur 10 GB (15%)</p>
                </div>
              </div>

              <div className={styles.upgradeSection}>
                <h3>Passer au Plan Pro - 50$/mois</h3>
                <p>Stockage illimité, galeries illimitées, nom de domaine personnalisé.</p>
                <div className={styles.paymentMethods}>
                  <h4>Payer via Mobile Money (RDC)</h4>
                  <p>Contactez-nous sur WhatsApp pour activer votre abonnement après paiement :</p>
                  <div className={styles.contactLinks}>
                    <a href="https://wa.me/243999068332" target="_blank" rel="noreferrer" className={styles.contactBtn}>
                      📱 Airtel Money: 099 90 68 332
                    </a>
                    <a href="https://wa.me/243892089958" target="_blank" rel="noreferrer" className={`${styles.contactBtn} ${styles.orangeBtn}`}>
                      📱 Orange Money: 089 20 89 958
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
