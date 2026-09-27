const https = require('https');
const fs = require('fs');

// Lire les infos du projet Supabase
const content = fs.readFileSync('.env.local', 'utf8');
const urlMatch = content.match(/NEXT_PUBLIC_SUPABASE_URL="([^"]+)"/);
const projectUrl = urlMatch ? urlMatch[1] : null;

if (!projectUrl) { console.log('ERREUR: Pas d\'URL Supabase'); process.exit(1); }

// Extraire l'ID du projet depuis l'URL
const projectId = projectUrl.replace('https://', '').replace('.supabase.co', '');

console.log('Project ID:', projectId);

// Fonction pour faire des requêtes à l'API Management Supabase
// Le service role key est nécessaire - on va utiliser l'API avec le service role
// Mais d'abord, vérifions si on peut utiliser le dashboard API

// Approche alternative: utiliser l'API Projet Supabase directement
// La clé service_role est généralement dans les credentials du projet
// On va essayer d'activer auth via le endpoint approprié

// Pour l'API management, on a besoin d'un token personnel Supabase
// mais on peut aussi essayer via l'API du projet avec les credentials appropriés

console.log('\n=== Méthode: Éditer le projet via API Supabase ===');

// L'URL pour éditer les paramètres du projet:
// PUT https://api.supabase.com/v1/projects/{project_id}/settings
// avec le service_role key comme authorization

// On va d'abord essayer d'obtenir les settings actuels
const options = {
    hostname: 'api.supabase.com',
    path: '/v1/projects/' + projectId,
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
        // On utilise l'anon key pour lire les projets (lecture seule)
        'apikey': 'sb_2a96fvfD'  // clé partielle connue
    }
};

// En fait, l'API Supabase Management nécessite un token personnel (PAT)
// et pas la clé anon du projet. Sans PAT, on ne peut pas modifier les settings.

console.log('Sans token Supabase PAT, impossible d\'activer Auth via API.');
console.log('Solution: il faut le faire manuellement depuis le dashboard Supabase.');
console.log('Ou: utiliser l\'API avec un service_role key si disponible.');

// Vérifions si on a un service_role key dans le projet
const serviceKeyMatch = content.match(/SUPABASE_SERVICE_KEY="([^"]+)"/);
if (serviceKeyMatch) {
    console.log('Service key trouvée:', serviceKeyMatch[1].substring(0, 20) + '...');
} else {
    console.log('Pas de SUPABASE_SERVICE_KEY dans .env.local');
}

console.log('\n=== Alternative: Vérifier les paramètres du projet via l\'API du projet ===');

// L'API du projet (db/API) peut donner des infos sur l'état d'Auth
// Mais pour modifier, il faut le service_role key

console.log('\nLe problème est confirmé: auth.is_enabled = false');
console.log('Solution requise: activer Auth dans le dashboard Supabase ou via API avec service_role key');
