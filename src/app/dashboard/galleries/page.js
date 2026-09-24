'use client';
import { useLanguage } from '@/context/LanguageContext';
import styles from './galleries.module.css';
import Link from 'next/link';
import { mockGalleries } from '@/lib/mockData';

export default function Galleries() {
  const { t } = useLanguage();

  return (
    <div className={styles.galleriesContainer}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>{t('nav.galleries', 'Mes Galeries')}</h1>
          <p className={styles.subtitle}>Gérez vos galeries privées pour vos clients</p>
        </div>
        <Link href="/dashboard/galleries/new" className={styles.newGalleryBtn}>
          + Nouvelle Galerie
        </Link>
      </header>

      <div className={styles.controls}>
        <input 
          type="text" 
          placeholder="Rechercher une galerie..." 
          className={styles.searchInput}
        />
        <select className={styles.filterSelect}>
          <option>Toutes les galeries</option>
          <option>Actives</option>
          <option>Expirées</option>
        </select>
      </div>

      <div className={styles.grid}>
        {mockGalleries.map((gallery) => (
          <div key={gallery.id} className={styles.card}>
            <div className={styles.cover} style={{ backgroundImage: `url(${gallery.cover})` }}>
              <span className={`${styles.statusBadge} ${styles[gallery.status]}`}>
                {gallery.status === 'active' ? 'Active' : 'Expirée'}
              </span>
            </div>
            
            <div className={styles.content}>
              <h3 className={styles.cardTitle}>{gallery.title}</h3>
              <div className={styles.meta}>
                <span>{gallery.date}</span>
                <span>•</span>
                <span>{gallery.photoCount} photos</span>
              </div>
              
              <div className={styles.stats}>
                <span>👁️ {gallery.views} vues</span>
              </div>

              <div className={styles.actions}>
                <button className={styles.actionBtn} title="Copier le lien">🔗</button>
                <button className={styles.actionBtn} title="QR Code">📱</button>
                <button className={styles.actionBtn} title="Modifier">✏️</button>
                <button className={`${styles.actionBtn} ${styles.deleteBtn}`} title="Supprimer">🗑️</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
