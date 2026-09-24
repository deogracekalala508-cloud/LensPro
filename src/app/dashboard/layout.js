'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import styles from './layout.module.css';

export default function DashboardLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();
  const { t } = useLanguage();

  const navLinks = [
    { href: '/dashboard', label: t('nav.overview', 'Vue d\'ensemble'), icon: '📊' },
    { href: '/dashboard/galleries', label: t('nav.galleries', 'Mes Galeries'), icon: '🖼️' },
    { href: '/dashboard/upload', label: t('nav.upload', 'Upload'), icon: '⬆️' },
    { href: '/dashboard/analytics', label: t('nav.analytics', 'Analytiques'), icon: '📈' },
    { href: '/dashboard/settings', label: t('nav.settings', 'Paramètres'), icon: '⚙️' },
  ];

  return (
    <div className={styles.dashboardContainer}>
      <button 
        className={styles.mobileToggle} 
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? '✕' : '☰'}
      </button>

      <aside className={`${styles.sidebar} ${isSidebarOpen ? styles.open : ''}`}>
        <div className={styles.sidebarHeader}>
          <Link href="/" className={styles.logo}>
            Lens<span>Pro</span>
          </Link>
        </div>

        <nav className={styles.sidebarNav}>
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link 
                key={link.href} 
                href={link.href} 
                className={`${styles.navLink} ${isActive ? styles.active : ''}`}
                onClick={() => setIsSidebarOpen(false)}
              >
                <span className={styles.navIcon}>{link.icon}</span>
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className={styles.sidebarFooter}>
          <div className={styles.subscriptionBadge}>
            Trial (12 days left)
          </div>
          <div className={styles.userProfile}>
            <div className={styles.avatar}>D</div>
            <div className={styles.userInfo}>
              <span className={styles.userName}>Deogratias</span>
              <span className={styles.userRole}>Pro Photographer</span>
            </div>
          </div>
        </div>
      </aside>

      <main className={styles.mainContent}>
        {children}
      </main>
    </div>
  );
}
