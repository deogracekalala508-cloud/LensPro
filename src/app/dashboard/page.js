'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import styles from './dashboard.module.css';

export const dynamic = 'force-dynamic';

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const [photosCount, setPhotosCount] = useState(0);
  const [galleriesCount, setGalleriesCount] = useState(0);
  const [eventsCount, setEventsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [photos, setPhotos] = useState([]);
  const [galleries, setGalleries] = useState([]);
  const [events, setEvents] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authLoading && !user) {
      window.location.href = '/auth/login';
    }
  }, [user, authLoading]);

  useEffect(() => {
    if (user && supabase) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    if (!supabase || !user) return;
    setLoading(true);
    setError('');
    try {
      const [photosRes, galleriesRes, eventsRes] = await Promise.all([
        supabase.from('photos').select('id').eq('user_id', user.id).eq('is_public', true),
        supabase.from('galleries').select('id').eq('user_id', user.id).eq('is_active', true),
        supabase.from('events').select('id').eq('user_id', user.id).eq('status', 'active'),
      ]);

      const pErr = photosRes.error, gErr = galleriesRes.error, eErr = eventsRes.error;
      if (pErr) throw pErr;
      if (gErr) throw gErr;
      if (eErr) throw eErr;

      setPhotos(photosRes.data || []);
      setGalleries(galleriesRes.data || []);
      setEvents(eventsRes.data || []);
      setPhotosCount((photosRes.data || []).length);
      setGalleriesCount((galleriesRes.data || []).length);
      setEventsCount((eventsRes.data || []).length);
    } catch (e) {
      console.error('Dashboard load error:', e);
      setError('Impossible de charger vos données.');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return <div className={styles.loading}>Chargement...</div>;
  }

  if (!user) {
    return null;
  }

  const userName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Photographe';

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.greeting}>
            Bienvenue, {userName}
          </h1>
          <p className={styles.subtitle}>
            Voici un aperçu de votre activité sur LensPro.
          </p>
        </div>
        <Link href="/portfolio" className={styles.portfolioLink}>Voir mon portfolio</Link>
      </header>

      {error && <div className={styles.errorBar}>{error}</div>}

      <section className={styles.statsGrid}>
        <StatCard
          icon="📷"
          label="Photos publiées"
          value={photosCount}
          color="#6B21A8"
          link="/dashboard/upload"
        />
        <StatCard
          icon="🖼️"
          label="Galeries clientes"
          value={galleriesCount}
          color="#139986"
          link="/dashboard/galleries"
        />
        <StatCard
          icon="📅"
          label="Événements actifs"
          value={eventsCount}
          color="#2563EB"
          link="/dashboard/events"
        />
        <StatCard
          icon="👥"
          label="Invités connectés"
          value={0}
          color="#db2777"
          isDemo={eventsCount === 0}
        />
      </section>

      <div className={styles.gridLayout}>
        <div className={styles.mainCol}>
          <div className={styles.sectionHeader}>
            <h2>Vos galeries récentes</h2>
            <Link href="/dashboard/galleries" className={styles.viewAllBtn}>
              Voir toutes les galeries
            </Link>
          </div>

          {loading ? (
            <div className={styles.loadingGrid}>
              {[1, 2, 3].map(i => <div key={i} className={styles.skeleton} />)}
            </div>
          ) : galleries.length === 0 ? (
            <div className={styles.emptySection}>
              <p className={styles.emptyText}>
                Vous n'avez pas encore créé de galerie.
                <Link href="/dashboard/galleries/new" className={styles.emptyLink}> Créer une galerie</Link>
              </p>
            </div>
          ) : (
            <div className={styles.galleriesGrid}>
              {galleries.slice(0, 3).map(gallery => (
                <Link key={gallery.id} href={`/dashboard/galleries/${gallery.id}`} className={styles.galleryCard}>
                  <div className={styles.placeholderCover}>
                    <span className={styles.placeholderIcon}>🖼</span>
                  </div>
                  <div className={styles.galleryInfo}>
                    <h3># {gallery.id.slice(0, 8)}</h3>
                    <div className={styles.galleryMeta}>
                      <span> Galerie</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div className={styles.quickActions}>
            <Link href="/dashboard/upload" className={styles.quickActionCard}>
              <span className={styles.qaIcon}>↑</span>
              <h3>Uploader des photos</h3>
              <p>Ajouter à votre portfolio</p>
            </Link>
            <Link href="/dashboard/galleries/new" className={styles.quickActionCard}>
              <span className={styles.qaIcon}>+</span>
              <h3>Nouvelle galerie</h3>
              <p>Créer pour un client</p>
            </Link>
            <Link href="/portfolio" className={styles.quickActionCard}>
              <span className={styles.qaIcon}>🌐</span>
              <h3>Voir mon portfolio</h3>
              <p>Votre site public</p>
            </Link>
          </div>
        </div>

        <div className={styles.sideCol}>
          <div className={styles.subscriptionCard}>
            <h3>Essai gratuit</h3>
            <p>Votre essai de 14 jours est actif.</p>
            <div className={styles.progressBar}>
              <div className={styles.progressFill} style={{ width: '0%' }}></div>
            </div>
            <button className={styles.upgradeBtn}>Passer en Pro</button>
          </div>

          <div className={styles.activityFeed}>
            <h3>Vos événements</h3>
            {loading ? (
              <p style={{color:'#a0a0a0', fontSize:'0.9rem'}}>Chargement...</p>
            ) : events.length === 0 ? (
              <p style={{color:'#6b7280', fontSize:'0.9rem'}}>
                Aucun événement.{' '}
                <Link href="/dashboard/events/create" style={{color:'#6B21A8'}}>Créer un événement</Link>
              </p>
            ) : (
              <div className={styles.eventList}>
                {events.map(ev => (
                  <Link key={ev.id} href={`/event/${ev.share_code}`} className={styles.eventItem}>
                    <span className={styles.eventTitle}>{ev.title}</span>
                    <span className={styles.eventCode}>{ev.share_code}</span>
                  </Link>
                ))}
              </div>
            )}
            <div style={{marginTop:'1rem', paddingTop:'1rem', borderTop:'1px solid rgba(255,255,255,0.05)'}}>
              <Link href="/events" className={styles.eventItem} style={{fontSize:'0.85rem', color:'#6b7280'}}>
                Voir tous les événements →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color, link, isDemo }) {
  return (
    <div className={styles.statCard}>
      <div className={styles.statHeader}>
        <div className={styles.statIcon} style={{ background: `${color}20`, color }}>
          {icon}
        </div>
        {isDemo && <span className={styles.demoBadge}>démo</span>}
      </div>
      <div className={styles.statValue}>{value}</div>
      <div className={styles.statLabel}>{label}</div>
      {link && value > 0 && (
        <a href={link} className={styles.statLink}>Gérer</a>
      )}
    </div>
  );
}
