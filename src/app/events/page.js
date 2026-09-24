'use client';
import React, { useState, useEffect } from 'react';
import BrowseEvents from '@/components/BrowseEvents/BrowseEvents';
import { getTranslations } from '@/lib/i18n';

export const dynamic = 'force-dynamic';

export default function EventsPage() {
  const t = typeof window !== 'undefined' ? getTranslations('fr') : { events: { browse: 'Événements', loading: 'Chargement...' } };
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Données mock directes (évite les dépendances Supabase)
    const mockEventsData = [
      {
        id: 1,
        title: 'Gala de Fin d\'Année 2026',
        description: 'Un Gala exceptionnel pour célébrer les réalisations de la communauté photographique.',
        shareCode: 'GALA2026',
        eventType: 'gala',
        date: '2026-12-31',
        startTime: '19:00',
        endTime: '23:00',
        location: 'Hôtel des Arts, Kinshasa',
        coverImage: 'https://picsum.photos/seed/gala2026/1200/600',
        status: 'active',
        posts: [
          { id: 1, userId: 1, username: 'jplumba', avatar: 'https://i.pravatar.cc/300?img=11', text: 'Prêt pour le Gala de ce soir ! 🎉', createdAt: new Date(Date.now() - 3600000).toISOString() },
          { id: 2, userId: 2, username: 'mariem', avatar: 'https://i.pravatar.cc/300?img=5', text: 'J\'arrive bientôt !', createdAt: new Date(Date.now() - 1800000).toISOString() },
        ]
      },
      {
        id: 2,
        title: 'Atelier Photo Urbaine',
        description: 'Atelier pratique pour améliorer vos compétences en photographie urbaine à Kinshasa.',
        shareCode: 'URBAN26',
        eventType: 'workshop',
        date: '2026-11-15',
        startTime: '08:00',
        endTime: '17:00',
        location: 'Marché Central, Kinshasa',
        coverImage: 'https://picsum.photos/seed/urban26/1200/600',
        status: 'active',
        posts: [
          { id: 1, userId: 3, username: 'alainn', avatar: 'https://i.pravatar.cc/300?img=33', text: 'Super initiative ! Je suis motivé.', createdAt: new Date(Date.now() - 86400000).toISOString() },
        ]
      }
    ];
    setEvents(mockEventsData);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div style={{
        maxWidth: '1000px',
        margin: '0 auto',
        padding: '2rem',
        minHeight: 'calc(100vh - 60px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <p style={{ color: '#a0a0a0' }}>{t.events.loading || 'Chargement...'}</p>
      </div>
    );
  }

  return (
    <div style={{
      maxWidth: '1000px',
      margin: '0 auto',
      padding: '2rem',
      minHeight: 'calc(100vh - 60px)'
    }}>
      <h1 style={{
        fontSize: '2rem',
        fontWeight: 700,
        color: '#f0f0f5',
        marginBottom: '2rem',
        textAlign: 'center'
      }}>
        {t.events.browse || 'Événements'}
      </h1>

      <BrowseEvents
        events={events}
        userId={null}
        isPhotographer={false}
        t={t}
      />
    </div>
  );
}
