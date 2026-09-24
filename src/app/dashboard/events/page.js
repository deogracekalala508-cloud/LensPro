'use client'
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getPhotographerEvents } from '@/lib/events';
import { supabase } from '@/lib/supabase';
import styles from './events.module.css';
import { getTranslations } from '@/lib/i18n';

export const dynamic = 'force-dynamic';

export default function DashboardEvents() {
  const t = typeof window !== 'undefined' ? getTranslations('fr') : { events: { loading: 'Loading...', myEvents: 'My events', createEvent: 'Create event', noEvents: 'No events', participants: 'participants', memories: 'memories', view: 'View', giantScreen: 'Screen', expires: 'Expires', createLink: 'Create your first event' } };
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const init = async () => {
      if (supabase) {
        const { data: { user } } = await supabase.auth.getUser();
        setUserId(user?.id || null);
        if (user) {
          const userEvents = await getPhotographerEvents(user.id);
          setEvents(userEvents);
        }
      }
      setLoading(false);
    };
    init();
  }, []);

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>{t.events.loading || 'Chargement...'}</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>{t.events.myEvents || 'Mes événements'}</h1>
        <Link href="/dashboard/events/create" className={styles.createBtn}>
          + {t.events.createEvent || 'Créer un événement'}
        </Link>
      </header>

      {events.length === 0 ? (
        <div className={styles.empty}>
          <p>{t.events.noEvents || 'Aucun événement créé'}</p>
          <Link href="/dashboard/events/create" className={styles.createLink}>
            {t.events.createLink || 'Créer votre premier événement'}
          </Link>
        </div>
      ) : (
        <div className={styles.grid}>
          {events.map(event => (
            <div key={event.id} className={styles.card}>
              {event.cover_image_url && (
                <div className={styles.cover} style={{ backgroundImage: `url(${event.cover_image_url})` }}></div>
              )}
              <div className={styles.content}>
                <h3>{event.title}</h3>
                {event.description && <p>{event.description}</p>}
                <div className={styles.meta}>
                  <span>👥 {event.participant_count || 0} {t.events.participants || 'participants'}</span>
                  <span>•</span>
                  <span>📸 {event.post_count || 0} {t.events.memories || 'souvenirs'}</span>
                  <span>•</span>
                  <span>Créé le {formatDate(event.created_at)}</span>
                </div>
                {event.expires_at && (
                  <div className={styles.expires}>
                    Expire le {formatDate(event.expires_at)}
                  </div>
                )}
                <div className={styles.actions}>
                  <Link href={`/event/${event.share_code}`} className={styles.viewBtn}>
                    👁 {t.events.view || 'Voir'}
                  </Link>
                  <Link href={`/event/${event.share_code}/giant`} className={styles.giantBtn}>
                    🖥 {t.events.giantScreen || 'Écran'}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
