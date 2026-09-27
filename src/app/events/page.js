'use client';
import React, { useState, useEffect } from 'react';
import BrowseEvents from '@/components/BrowseEvents/BrowseEvents';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';

export const dynamic = 'force-dynamic';

export default function EventsPage() {
  const { user, loading: authLoading } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!authLoading && !user) {
      // En mode non connecté, afficher les événements publics (demo/MOCK pour l'exploration)
      loadMockEvents();
      return;
    }
    if (user) {
      loadUserEvents(user.id);
    } else {
      loadMockEvents();
    }
  }, [user, authLoading]);

  const loadUserEvents = async (userId) => {
    if (!supabase) {
      loadMockEvents();
      return;
    }
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(20);
      if (error) throw error;
      setEvents(data || []);
    } catch (err) {
      console.error('Events load error:', err);
      loadMockEvents();
    } finally {
      setLoading(false);
    }
  };

  const loadMockEvents = () => {
    const mock = [
      {
        id: 1,
        title: "Gala de Fin d'Année 2026",
        description: 'Un Gala exceptionnel pour célébrer les réalisations de la communauté photographique.',
        share_code: 'GALA2026',
        eventType: 'gala',
        date: '2026-12-31',
        startTime: '19:00',
        endTime: '23:00',
        location: 'Hôtel des Arts, Kinshasa',
        coverImage: 'https://picsum.photos/seed/gala2026/1200/600',
        status: 'active',
        participant_count: 2,
        post_count: 2,
      },
      {
        id: 2,
        title: 'Atelier Photo Urbaine',
        description: 'Atelier pratique pour améliorer vos compétences en photographie urbaine à Kinshasa.',
        share_code: 'URBAN26',
        eventType: 'workshop',
        date: '2026-11-15',
        startTime: '08:00',
        endTime: '17:00',
        location: 'Marché Central, Kinshasa',
        coverImage: 'https://picsum.photos/seed/urban26/1200/600',
        status: 'active',
        participant_count: 1,
        post_count: 1,
      },
    ];
    setEvents(mock);
    setLoading(false);
  };

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
        <p style={{ color: '#a0a0a0' }}>Chargement des événements...</p>
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
        Événements
      </h1>
      <BrowseEvents
        events={events}
        userId={user?.id || null}
        isPhotographer={!!user}
        t={{}}
      />
    </div>
  );
}
