'use client'
import { useLanguage } from '@/context/LanguageContext';
import styles from './dashboard.module.css';
import Link from 'next/link';
import { mockGalleries, mockActivity } from '@/lib/mockData';

export const dynamic = 'force-dynamic';

export default function Dashboard() {
  const { t } = useLanguage();

  // Vérifier si localStorage est disponible (client-side only)
  const getStoredUser = () => {
    if (typeof window !== 'undefined' && localStorage) {
      try {
        return JSON.parse(localStorage.getItem('lenspro_user') || '{}');
      } catch {
        return {};
      }
    }
    return {};
  };

  const user = getStoredUser();
  const stats = [
    { label: t('dashboard.totalPhotos', 'Total Photos'), value: '2,405', trend: '+12%', icon: '📸', color: '#6B21A8' },
    { label: t('dashboard.totalViews', 'Total Vues'), value: '45.2k', trend: '+8%', icon: '👁️', color: '#2563EB' },
    { label: t('dashboard.totalLikes', 'Total Likes'), value: '12.8k', trend: '+24%', icon: '❤️', color: '#db2777' },
    { label: t('dashboard.totalDownloads', 'Téléchargements'), value: '3,840', trend: '+5%', icon: '⬇️', color: '#0D9488' },
  ];

  const userName = user.name || user.fullName || 'Deogratias';

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.greeting}>{t('dashboard.welcome', 'Bienvenue')}, {userName} 👋</h1>
          <p className={styles.subtitle}>{t('dashboard.subtitle', 'Voici un aperçu de votre activité aujourd\'hui.')}</p>
        </div>
      </header>

      <section className={styles.statsGrid}>
        {stats.map((stat, i) => (
          <div key={i} className={styles.statCard}>
            <div className={styles.statHeader}>
              <div className={styles.statIcon} style={{ background: `linear-gradient(135deg, ${stat.color}40, transparent)`, color: stat.color }}>
                {stat.icon}
              </div>
              <span className={styles.statTrend}>{stat.trend}</span>
            </div>
            <div className={styles.statValue}>{stat.value}</div>
            <div className={styles.statLabel}>{stat.label}</div>
          </div>
        ))}
      </section>

      <div className={styles.gridLayout}>
        <div className={styles.mainCol}>
          <div className={styles.sectionHeader}>
            <h2>{t('dashboard.recentGalleries', 'Galeries récentes')}</h2>
            <Link href="/dashboard/galleries" className={styles.viewAllBtn}>
              {t('common.viewAll', 'Voir tout')}
            </Link>
          </div>
          
          <div className={styles.galleriesGrid}>
            {mockGalleries.slice(0, 3).map(gallery => (
              <div key={gallery.id} className={styles.galleryCard}>
                <div className={styles.galleryCover} style={{ backgroundImage: `url(${gallery.cover})` }}>
                  <div className={styles.galleryOverlay}>
                    <button className={styles.actionBtn}>🔗</button>
                  </div>
                </div>
                <div className={styles.galleryInfo}>
                  <h3>{gallery.title}</h3>
                  <div className={styles.galleryMeta}>
                    <span>{gallery.photosCount} photos</span>
                    <span>•</span>
                    <span>{gallery.date}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.quickActions}>
            <Link href="/dashboard/upload" className={styles.quickActionCard}>
              <span className={styles.qaIcon}>⬆️</span>
              <h3>Upload Photos</h3>
              <p>Ajouter à votre portfolio</p>
            </Link>
            <Link href="/dashboard/galleries/new" className={styles.quickActionCard}>
              <span className={styles.qaIcon}>➕</span>
              <h3>Nouvelle Galerie</h3>
              <p>Créer pour un client</p>
            </Link>
            <Link href="/portfolio" className={styles.quickActionCard}>
              <span className={styles.qaIcon}>🌐</span>
              <h3>Voir Portfolio</h3>
              <p>Votre site public</p>
            </Link>
          </div>
        </div>

        <div className={styles.sideCol}>
          <div className={styles.subscriptionCard}>
            <h3>Abonnement Essai</h3>
            <p>Votre essai gratuit se termine dans <strong>12 jours</strong>.</p>
            <div className={styles.progressBar}>
              <div className={styles.progressFill} style={{ width: '25%' }}></div>
            </div>
            <button className={styles.upgradeBtn}>Passer en Pro</button>
          </div>

          <div className={styles.activityFeed}>
            <h3>{t('dashboard.recentActivity', 'Activité récente')}</h3>
            <div className={styles.activityList}>
              {mockActivity.map(activity => (
                <div key={activity.id} className={styles.activityItem}>
                  <div className={styles.activityIcon}>{activity.icon}</div>
                  <div className={styles.activityContent}>
                    <p><strong>{activity.user}</strong> {activity.action} <strong>{activity.target}</strong></p>
                    <span className={styles.activityTime}>{activity.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
