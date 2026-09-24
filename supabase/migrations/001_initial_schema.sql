-- LensPro Main Database Schema
-- Migration: 001_initial_schema
-- Date: 2026-09-24

BEGIN;

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TYPES ET ENUMS
CREATE TYPE user_role AS ENUM ('photographer', 'admin');
CREATE TYPE subscription_status AS ENUM ('trial', 'active', 'expired');
CREATE TYPE photo_category AS ENUM (
    'mariage', 'portrait', 'evenement', 'mode',
    'nature', 'sport', 'architecture', 'gastronomie', 'autre'
);

-- 3. TABLE PROFILES
-- Liens vers auth.users - nécessite Supabase Auth configuré
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    username TEXT NOT NULL UNIQUE,
    avatar_url TEXT,
    cover_url TEXT,
    bio TEXT,
    city TEXT,
    specialty TEXT,
    phone TEXT,
    role user_role DEFAULT 'photographer',
    subscription_status subscription_status DEFAULT 'trial',
    trial_ends_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '14 days'),
    storage_used_mb NUMERIC(10, 2) DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. TABLE PHOTOS
CREATE TABLE IF NOT EXISTS public.photos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    category photo_category DEFAULT 'autre',
    storage_path TEXT NOT NULL,
    thumbnail_url TEXT,
    before_image_url TEXT,
    is_public BOOLEAN DEFAULT true,
    likes_count INT DEFAULT 0,
    views_count INT DEFAULT 0,
    width INT,
    height INT,
    file_size_kb INT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. TABLE GALLERIES
CREATE TABLE IF NOT EXISTS public.galleries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    share_code TEXT NOT NULL UNIQUE,
    pin_code TEXT,
    is_active BOOLEAN DEFAULT true,
    expires_at TIMESTAMPTZ,
    download_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. TABLE GALLERY_PHOTOS (jointure)
CREATE TABLE IF NOT EXISTS public.gallery_photos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    gallery_id UUID NOT NULL REFERENCES public.galleries(id) ON DELETE CASCADE,
    photo_id UUID NOT NULL REFERENCES public.photos(id) ON DELETE CASCADE,
    is_favorite BOOLEAN DEFAULT false,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(gallery_id, photo_id)
);

-- 7. TABLE LIKES
CREATE TABLE IF NOT EXISTS public.likes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    photo_id UUID NOT NULL REFERENCES public.photos(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, photo_id)
);

COMMIT;

-- Activation RLS et Policies (exécuté séparément pour éviter les erreurs de dépendance)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.galleries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;

-- Policies Profiles
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles
    FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- Policies Photos
CREATE POLICY "Public photos are viewable by everyone" ON public.photos
    FOR SELECT USING (is_public = true OR auth.uid() = user_id);

CREATE POLICY "Photographers can insert photos" ON public.photos
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Photographers can update own photos" ON public.photos
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Photographers can delete own photos" ON public.photos
    FOR DELETE USING (auth.uid() = user_id);

-- Policies Galleries
CREATE POLICY "Photographers can manage their own galleries" ON public.galleries
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Clients can view active galleries via share code" ON public.galleries
    FOR SELECT USING (is_active = true);

-- Storage Buckets
INSERT INTO storage.buckets (id, name, public) VALUES ('portfolio-photos', 'portfolio-photos', true) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('client-galleries', 'client-galleries', false) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true) ON CONFLICT DO NOTHING;
