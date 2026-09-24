
-- Events schema for LensPro
-- Run this in Supabase SQL Editor

-- Enable uuid-ossp extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Events table
CREATE TABLE IF NOT EXISTS events (
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

CREATE INDEX IF NOT EXISTS idx_events_share_code ON events(share_code);
CREATE INDEX IF NOT EXISTS idx_events_user_id ON events(user_id);
CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);
CREATE INDEX IF NOT EXISTS idx_events_expires_at ON events(expires_at);

-- Event posts (social wall content)
-- Permet aux invités anonymes (user_name/user_email) ET aux utilisateurs authentifiés (user_id)
CREATE TABLE IF NOT EXISTS event_posts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
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

CREATE INDEX IF NOT EXISTS idx_posts_event_id ON event_posts(event_id);
CREATE INDEX IF NOT EXISTS idx_posts_moderation_status ON event_posts(moderation_status);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON event_posts(created_at DESC);

-- Event subscriptions (who is subscribed to notifications)
CREATE TABLE IF NOT EXISTS event_subscriptions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    subscribed BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(event_id, user_id)
);

-- Event moderation logs
CREATE TABLE IF NOT EXISTS event_moderation_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    post_id UUID REFERENCES event_posts(id) ON DELETE CASCADE,
    moderator_id UUID REFERENCES auth.users(id),
    action TEXT NOT NULL,
    reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-expire events
CREATE OR REPLACE FUNCTION expire_old_events()
RETURNS void AS $$
BEGIN
    UPDATE events 
    SET status = 'expired'
    WHERE status = 'active' 
    AND expires_at IS NOT NULL 
    AND expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- Trigger to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers
CREATE TRIGGER update_events_updated_at
    BEFORE UPDATE ON events
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

-- Auto-update post counts
CREATE OR REPLACE FUNCTION update_event_post_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE events SET post_count = post_count + 1 WHERE id = NEW.event_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE events SET post_count = post_count - 1 WHERE id = OLD.event_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_post_count
    AFTER INSERT OR DELETE ON event_posts
    FOR EACH ROW
    EXECUTE FUNCTION update_event_post_count();

-- Row Level Security
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_moderation_logs ENABLE ROW LEVEL SECURITY;

-- Events policies
CREATE POLICY "Events are viewable by everyone with valid share code"
    ON events FOR SELECT
    USING (status = 'active' OR status = 'expired');

CREATE POLICY "Authenticated users can create events"
    ON events FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own events"
    ON events FOR UPDATE
    USING (auth.uid() = user_id);

-- Event posts policies
CREATE POLICY "Approved posts are viewable by everyone"
    ON event_posts FOR SELECT
    USING (moderation_status = 'approved' AND is_hidden = false);

CREATE POLICY "Event creators can view all posts"
    ON event_posts FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM events 
            WHERE events.id = event_id 
            AND events.user_id = auth.uid()
        )
    );

CREATE POLICY "Authenticated users can create posts"
    ON event_posts FOR INSERT
    WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Event creators can moderate posts"
    ON event_posts FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM events 
            WHERE events.id = event_id 
            AND events.user_id = auth.uid()
        )
    );

CREATE POLICY "Event creators can delete posts"
    ON event_posts FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM events 
            WHERE events.id = event_id 
            AND events.user_id = auth.uid()
        )
    );

-- Subscriptions policies
CREATE POLICY "Anyone can view subscriptions"
    ON event_subscriptions FOR SELECT
    USING (true);

CREATE POLICY "Authenticated users can subscribe"
    ON event_subscriptions FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage their subscriptions"
    ON event_subscriptions FOR UPDATE
    USING (auth.uid() = user_id);

-- Storage bucket for event uploads
INSERT INTO storage.buckets (id, name, public)
VALUES ('event-uploads', 'event-uploads', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Anyone can view event uploads"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'event-uploads');

CREATE POLICY "Authenticated users can upload event files"
    ON storage.objects FOR INSERT
    WITH CHECK (bucket_id = 'event-uploads' AND auth.role() = 'authenticated');

CREATE POLICY "Event creators can delete uploads"
    ON storage.objects FOR DELETE
    USING (bucket_id = 'event-uploads' AND 
        EXISTS (
            SELECT 1 FROM events 
            WHERE events.id::text = (storage.foldername(name))[1]
            AND events.user_id = auth.uid()
        )
    );
