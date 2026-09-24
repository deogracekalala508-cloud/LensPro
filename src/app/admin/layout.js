'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from '../dashboard/layout.module.css';

export default function AdminLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { href: '/admin', label: 'Vue d\'ensemble', icon: '📊' },
    { href: '/admin/photographers', label: 'Photographes', icon: '👥' },
    { href: '/admin/subscriptions', label: 'Abonnements', icon: '💳' },
    { href: '/admin/settings', label: 'Paramètres', icon: '⚙️' },
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
          <div style={{ marginTop: '0.5rem', display: 'inline-block', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold' }}>
            ADMINISTRATION
          </div>
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
                style={isActive ? { background: 'linear-gradient(135deg, rgba(248, 113, 113, 0.2), rgba(251, 146, 60, 0.2))', borderColor: 'rgba(248, 113, 113, 0.3)' } : {}}
              >
                <span className={styles.navIcon}>{link.icon}</span>
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className={styles.sidebarFooter}>
          <div className={styles.userProfile}>
            <div className={styles.avatar} style={{ background: 'linear-gradient(135deg, #f87171, #fb923c)' }}>A</div>
            <div className={styles.userInfo}>
              <span className={styles.userName}>Super Admin</span>
              <span className={styles.userRole}>System</span>
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
