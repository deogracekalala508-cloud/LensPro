-- Créer manuellement un utilisateur de test dans auth.users
-- Cela permet de tester le système sans passer par le formulaire d'inscription

-- Vérifier si l'utilisateur existe déjà
SELECT id, email, created_at FROM auth.users WHERE email = 'test_photographer_REAL@lenspro.test';

-- S'il n'existe pas, le créer
-- Note: cette opération nécessite la service_role key
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_user_meta_data)
VALUES (
  gen_random_uuid(),
  'test_photographer_REAL@lenspro.test',
  -- Mot de passe haché avec bcrypt (TestLensPro2026!)
  -- Pour un vrai hachage, il faudrait utiliser l'API Supabase
  -- Mais on peut utiliser l'API management pour créer l'utilisateur
  NULL,
  NOW(),
  NOW(),
  NOW(),
  '{"full_name":"Photographe Test Réel","username":"photographe_test_real","city":"Kinshasa","specialty":"Mariage"}'
)
ON CONFLICT (email) DO NOTHING;
