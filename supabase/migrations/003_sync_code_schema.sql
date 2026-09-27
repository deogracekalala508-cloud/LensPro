-- Migration 003 : Synchronisation du schéma code ↔ base de production
-- Exécuter sur la branche production de Supabase

BEGIN;

-- ============================================================
-- 1. AJOUT DES COLONNES MANQUANTES SUR `events`
-- ============================================================

ALTER TABLE public.events 
  ADD COLUMN IF NOT EXISTS participant_count INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS post_count INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS moderation_mode TEXT DEFAULT 'auto' CHECK (moderation_mode IN ('auto', 'manual'));

-- ============================================================
-- 2. TRIGGER update_updated_at (manquant dans migration 002)
-- ============================================================

CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_events_updated_at ON public.events;
CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON public.events
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

-- ============================================================
-- 3. TRIGGER update_event_post_count (manquant)
-- ============================================================

CREATE OR REPLACE FUNCTION public.update_event_post_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.events SET post_count = post_count + 1 WHERE id = NEW.event_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.events SET post_count = post_count - 1 WHERE id = OLD.event_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_post_count ON public.event_posts;
CREATE TRIGGER trigger_update_post_count
  AFTER INSERT OR DELETE ON public.event_posts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_event_post_count();

-- ============================================================
-- 4. RLS POLICIES MANQUANTES SUR `events`
-- ============================================================

DROP POLICY IF EXISTS "Events are viewable by everyone" ON public.events;
CREATE POLICY "Events are viewable by everyone"
  ON public.events FOR SELECT
  USING (status = 'active' OR status = 'expired');

DROP POLICY IF EXISTS "Authenticated users can create events" ON public.events;
CREATE POLICY "Authenticated users can create events"
  ON public.events FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own events" ON public.events;
CREATE POLICY "Users can update their own events"
  ON public.events FOR UPDATE
  USING (auth.uid() = user_id);

-- ============================================================
-- 5. RLS POLICIES MANQUANTES SUR `event_posts`
-- ============================================================

DROP POLICY IF EXISTS "Approved posts are viewable by everyone" ON public.event_posts;
CREATE POLICY "Approved posts are viewable by everyone"
  ON public.event_posts FOR SELECT
  USING (moderation_status = 'approved' AND is_hidden = false);

DROP POLICY IF EXISTS "Event creators can view all posts" ON public.event_posts;
CREATE POLICY "Event creators can view all posts"
  ON public.event_posts FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.events
      WHERE public.events.id = event_id
      AND public.events.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Authenticated users can create posts" ON public.event_posts;
CREATE POLICY "Authenticated users can create posts"
  ON public.event_posts FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Event creators can moderate posts" ON public.event_posts;
CREATE POLICY "Event creators can moderate posts"
  ON public.event_posts FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.events
      WHERE public.events.id = event_id
      AND public.events.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Event creators can delete posts" ON public.event_posts;
CREATE POLICY "Event creators can delete posts"
  ON public.event_posts FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.events
      WHERE public.events.id = event_id
      AND public.events.user_id = auth.uid()
    )
  );

-- ============================================================
-- 6. BUCKET STORAGE event-uploads + POLICIES (manquant)
-- ============================================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('event-uploads', 'event-uploads', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Anyone can view event uploads" ON storage.objects;
CREATE POLICY "Anyone can view event uploads"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'event-uploads');

DROP POLICY IF EXISTS "Authenticated users can upload event files" ON storage.objects;
CREATE POLICY "Authenticated users can upload event files"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'event-uploads' AND auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Event creators can delete uploads" ON storage.objects;
CREATE POLICY "Event creators can delete uploads"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'event-uploads'
    AND EXISTS (
      SELECT 1 FROM public.events
      WHERE public.events.id::text = (storage.foldername(name))[1]
      AND public.events.user_id = auth.uid()
    )
  );

COMMIT;

-- ============================================================
-- 7. Fonction d'expiration (jà présente mais vérifions)
-- ============================================================

CREATE OR REPLACE FUNCTION public.expire_old_events()
RETURNS void AS $$
BEGIN
  UPDATE public.events
  SET status = 'expired'
  WHERE status = 'active'
  AND expires_at IS NOT NULL
  AND expires_at < NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
