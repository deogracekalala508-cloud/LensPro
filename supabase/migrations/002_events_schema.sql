-- LensPro Events Database Schema
-- Migration: 002_events_schema
-- Date: 2026-09-24
-- Dépendances: 001_initial_schema (profiles, auth.users)

BEGIN;

-- EXTENSION (déjà créée par 001, mais idempotence)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table EVENTS
-- user_id référence auth.users (nécessite Supabase Auth)
CREATE TABLE IF NOT EXISTS public.events (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT DEFAULT '',
    share_code TEXT UNIQUE NOT NULL,
    pin_code TEXT,
    cover_image_url TEXT,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'expired', 'closed')),
    participant_count INTEGER DEFAULT 0,
    post_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ,
    moderation_mode TEXT DEFAULT 'auto' CHECK (moderation_mode IN ('auto', 'manual'))
);

-- Index sur events
CREATE INDEX IF NOT EXISTS idx_events_share_code ON public.events(share_code);
CREATE INDEX IF NOT EXISTS idx_events_user_id ON public.events(user_id);
CREATE INDEX IF NOT EXISTS idx_events_status ON public.events(status);
CREATE INDEX IF NOT EXISTS idx_events_expires_at ON public.events(expires_at);

-- Table EVENT_POSTS
-- Permet aux invités anonymes (user_name/user_email) ET aux utilisateurs authentifiés (user_id nullable)
CREATE TABLE IF NOT EXISTS public.event_posts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    content_type TEXT NOT NULL CHECK (content_type IN ('text', 'image', 'video', 'audio')),
    content_url TEXT,
    text_content TEXT DEFAULT '',
    audio_url TEXT,
    user_name TEXT NOT NULL DEFAULT 'Invité',
    user_email TEXT,
    moderation_status TEXT DEFAULT 'pending' CHECK (moderation_status IN ('pending', 'approved', 'rejected')),
    is_hidden BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index sur event_posts
CREATE INDEX IF NOT EXISTS idx_posts_event_id ON public.event_posts(event_id);
CREATE INDEX IF NOT EXISTS idx_posts_moderation_status ON public.event_posts(moderation_status);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON public.event_posts(created_at DESC);

-- Table EVENT_SUBSCRIPTIONS
CREATE TABLE IF NOT EXISTS public.event_subscriptions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    subscribed BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(event_id, user_id)
);

-- Table EVENT_MODERATION_LOGS
CREATE TABLE IF NOT EXISTS public.event_moderation_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
    post_id UUID REFERENCES public.event_posts(id) ON DELETE CASCADE,
    moderator_id UUID REFERENCES auth.users(id),
    action TEXT NOT NULL,
    reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Fonction d'expiration des événements
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

-- Fonction de mise à jour automatique de updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour events.updated_at
DROP TRIGGER IF EXISTS update_events_updated_at ON public.events;
CREATE TRIGGER update_events_updated_at
    BEFORE UPDATE ON public.events
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at();

-- Fonction de mise à jour du compteur de posts
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

-- Trigger pour event_posts
DROP TRIGGER IF EXISTS trigger_update_post_count ON public.event_posts;
CREATE TRIGGER trigger_update_post_count
    AFTER INSERT OR DELETE ON public.event_posts
    FOR EACH ROW
    EXECUTE FUNCTION public.update_event_post_count();

-- Activation RLS
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_moderation_logs ENABLE ROW LEVEL SECURITY;

-- Policies : EVENTS
CREATE POLICY "Events are viewable by everyone" ON public.events
    FOR SELECT USING (status = 'active' OR status = 'expired');

CREATE POLICY "Authenticated users can create events" ON public.events
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own events" ON public.events
    FOR UPDATE USING (auth.uid() = user_id);

-- Policies : EVENT_POSTS
CREATE POLICY "Approved posts are viewable by everyone" ON public.event_posts
    FOR SELECT USING (moderation_status = 'approved' AND is_hidden = false);

CREATE POLICY "Event creators can view all posts" ON public.event_posts
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.events
            WHERE public.events.id = event_id
            AND public.events.user_id = auth.uid()
        )
    );

CREATE POLICY "Authenticated users can create posts" ON public.event_posts
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Event creators can moderate posts" ON public.event_posts
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.events
            WHERE public.events.id = event_id
            AND public.events.user_id = auth.uid()
        )
    );

CREATE POLICY "Event creators can delete posts" ON public.event_posts
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.events
            WHERE public.events.id = event_id
            AND public.events.user_id = auth.uid()
        )
    );

-- Policies : EVENT_SUBSCRIPTIONS
CREATE POLICY "Anyone can view subscriptions" ON public.event_subscriptions
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can subscribe" ON public.event_subscriptions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage their subscriptions" ON public.event_subscriptions
    FOR UPDATE USING (auth.uid() = user_id);

-- Storage Bucket pour les uploads d'événements
INSERT INTO storage.buckets (id, name, public)
VALUES ('event-uploads', 'event-uploads', true)
ON CONFLICT (id) DO NOTHING;

-- Policies Storage : event-uploads
CREATE POLICY "Anyone can view event uploads" ON storage.objects
    FOR SELECT USING (bucket_id = 'event-uploads');

CREATE POLICY "Authenticated users can upload event files" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'event-uploads' AND auth.role() = 'authenticated');

CREATE POLICY "Event creators can delete uploads" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'event-uploads'
        AND EXISTS (
            SELECT 1 FROM public.events
            WHERE public.events.id::text = (storage.foldername(name))[1]
            AND public.events.user_id = auth.uid()
        )
    );

COMMIT;
