import { supabase } from '@/lib/supabase';
import { mockEvents } from '@/lib/mockData';

// Données mock temporaires pour les événements
// Créer un événement mock avec le code TEST123 pour les tests
const testEvent = {
  id: 999,
  title: 'Événement de Test',
  description: 'Cet événement est créé pour les tests de la fonctionnalité Social Wall.',
  shareCode: 'TEST123',
  eventType: 'test',
  date: new Date().toISOString().split('T')[0],
  startTime: '12:00',
  endTime: '14:00',
  location: 'En ligne',
  coverImage: 'https://picsum.photos/seed/test123/1200/600',
  status: 'active',
  posts: [
    { id: 1, userId: 1, username: 'jplumba', avatar: 'https://i.pravatar.cc/300?img=11', text: 'Bienvenue sur le Social Wall ! 🎉', createdAt: new Date().toISOString() },
    { id: 2, userId: 2, username: 'mariem', avatar: 'https://i.pravatar.cc/300?img=5', text: 'Super fonctionnalité !', createdAt: new Date(Date.now() - 3600000).toISOString() },
  ]
};

const mockEventByShareCode = testEvent;

export async function GET(request, { params }) {
  try {
    const { shareCode } = params;
    
    // Vérifier que Supabase est configuré
    if (!supabase) {
      // Fallback vers données mock si Supabase non configuré
      if (shareCode === 'TEST123' && mockEventByShareCode) {
        return Response.json({ 
          event: mockEventByShareCode, 
          posts: mockEventByShareCode.posts || [],
          source: 'mock'
        });
      }
      return Response.json({ error: 'Service not configured' }, { status: 503 });
    }
    
    // Connexion Supabase (peut échouer si les credentials sont incorrects)
    try {
      const { data: event, error: eventError } = await supabase
        .from('events')
        .select('*')
        .eq('share_code', shareCode)
        .single();
      
      if (eventError) {
        console.error('Supabase event error:', eventError);
        // Fallback vers mock si Supabase échoue
        if (shareCode === 'TEST123' && mockEventByShareCode) {
          return Response.json({ 
            event: mockEventByShareCode, 
            posts: mockEventByShareCode.posts || [],
            source: 'mock',
            supabaseError: eventError.message
          });
        }
        return Response.json({ error: 'Event not found' }, { status: 404 });
      }
      
      if (!event) {
        return Response.json({ error: 'Event not found' }, { status: 404 });
      }
      
      // Récupérer les posts
      const { data: posts, error: postsError } = await supabase
        .from('event_posts')
        .select('*')
        .eq('event_id', event.id)
        .order('created_at', { ascending: false });
      
      if (postsError) {
        console.error('Supabase posts error:', postsError);
        return Response.json({ event, posts: [], source: 'partial', postsError: postsError.message });
      }
      
      return Response.json({ event, posts, source: 'supabase' });
    } catch (supabaseError) {
      console.error('Supabase connection error:', supabaseError);
      // Fallback vers mock
      if (shareCode === 'TEST123' && mockEventByShareCode) {
        return Response.json({ 
          event: mockEventByShareCode, 
          posts: mockEventByShareCode.posts || [],
          source: 'mock',
          error: supabaseError.message
        });
      }
      return Response.json({ error: supabaseError.message }, { status: 500 });
    }
  } catch (e) {
    console.error('API error:', e);
    return Response.json({ error: e.message }, { status: 500 });
  }
}
