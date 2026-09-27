-- ============================================================
-- LensPro: Désactiver la confirmation email lors du signup
-- ============================================================
-- INSTRUCTIONS:
-- 1. Ouvrir le SQL Editor dans Supabase Dashboard
--    https://supabase.com/dashboard/project/jjwzlgvpgrnyhufgbjah/sql/editor
-- 2. Se connecter avec votre compte (deogracekalala508@gmail.com / RuRu2005)
-- 3. Copier et exécuter ce script
-- 4. Vous pourrez ensuite vous connecter immédiatement après inscription
-- ============================================================

-- Méthode 1: Via les paramètres Auth (recommandé)
-- Cette méthode modifie le comportement par défaut de Supabase Auth
-- Pour l'appliquer, il faut le faire manuellement dans le dashboard:
--    Auth > Settings > Email > "Enable email signup confirmation" = OFF

-- Méthode 2: Via une fonction SQL (approche programmatique)
-- Cette fonction permet de confirmer automatiquement les utilisateurs
-- lorsqu'ils se connectent pour la première fois après inscription

CREATE OR REPLACE FUNCTION public.auto_confirm_user()
RETURNS TRIGGER AS $$
BEGIN
    -- Si l'utilisateur vient de s'inscrire (confirmed_at est NULL)
    -- et qu'il essaie de se connecter, on le confirme automatiquement
    IF NEW.confirmed_at IS NULL AND OLD.confirmed_at IS DISTINCT FROM NEW.confirmed_at THEN
        RAISE NOTICE 'Utilisateur non confirmé détecté';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Alternative: Fonction pour confirmer manuellement un utilisateur spécifique
-- Usage: SELECT public.confirm_user_manually('lenspro-test-20260925@demo-test.com');

CREATE OR REPLACE FUNCTION public.confirm_user_manually(target_email TEXT)
RETURNS BOOLEAN AS $$
DECLARE
    user_id UUID;
BEGIN
    -- Trouver l'utilisateur par email
    SELECT id INTO user_id FROM auth.users WHERE email = target_email;
    
    IF user_id IS NULL THEN
        RAISE EXCEPTION 'Utilisateur non trouvé: %', target_email;
        RETURN FALSE;
    END IF;
    
    -- Confirmer l'utilisateur
    UPDATE auth.users SET confirmed_at = NOW() WHERE id = user_id;
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Utilisation:
-- SELECT public.confirm_user_manually('lenspro-test-20260925@demo-test.com');

-- Note: Les fonctions ci-dessus nécessitent des droits EXECUTE sur auth.users
-- Si vous avez le rôle service_role, vous pouvez les utiliser.
-- Sinon, la Méthode 1 (dashboard) est la plus simple.
