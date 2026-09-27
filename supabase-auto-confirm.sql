-- LensPro: Auto-confirmation des utilisateurs lors du signup
-- À exécuter dans le SQL Editor de Supabase Dashboard
-- Cela permet aux utilisateurs de se connecter immédiatement après inscription

-- Solution 1: Désactiver la confirmation email dans les paramètres Auth
-- (Recommandé pour le test) - À faire manuellement dans le dashboard:
-- Auth > Settings > Email > Désactiver "Enable email signup confirmation"

-- Solution 2: Si vous voulez forcer la confirmation automatique via SQL,
-- exécutez ceci (attention: nécessite des droits service_role) :

-- Créer une fonction de trigger pour auto-confirmer
CREATE OR REPLACE FUNCTION public.after_signup_confirm()
RETURNS event_trigger AS $$
DECLARE
  new_row record;
BEGIN
  -- Cette fonction est appelée après chaque création d'utilisateur
  -- Elle set confirmed_at = NOW() pour marquer l'utilisateur comme confirmé
  FOR new_row IN SELECT * FROM auth.users WHERE created_at > NOW() - INTERVAL '1 minute'
  LOOP
    UPDATE auth.users SET confirmed_at = NOW() WHERE id = new_row.id;
  END LOOP;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Activer le trigger (nécessite des droits élevés)
-- GRANT EXECUTE ON FUNCTION public.after_signup_confirm() TO service_role;
-- ALTER EVENT TRIGGER sur auth.users...

-- Note: La solution 1 (dashboard) est préférable et plus simple pour les tests
