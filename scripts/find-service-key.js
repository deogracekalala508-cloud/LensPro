const https = require('https');
const fs = require('fs');

// Vérifier si on a un service_role key dans les credentials Supabase
// Généralement disponible dans .env.local sous SUPABASE_SERVICE_KEY ou similaire

const content = fs.readFileSync('.env.local', 'utf8');

// Chercher tous les patterns de clé Supabase
const patterns = [
    /SUPABASE_(SERVICE_ROLE_KEY|SERVICE_KEY|SERVICE_ROLE)="([^"]+)"/,
    /service_role.*".*"/i,
    /service.*key.*"([^"]+)"/i
];

console.log('=== Recherche service_role key ===');
let found = false;

patterns.forEach(p => {
    const m = content.match(p);
    if (m) {
        console.log('Trouvé:', m[0]);
        found = true;
    }
});

if (!found) {
    console.log('Aucun service_role key trouvé dans .env.local');
    console.log('Contenu de .env.local (masqué):');
    // Afficher les lignes sans les valeurs sensibles
    const lines = content.split('\n');
    lines.forEach(line => {
        if (line.includes('supabase') || line.includes('SUPABASE')) {
            const key = line.split('=')[0];
            console.log('  ' + key + ' = <REDACTED>');
        }
    });
}

console.log('\n=== Approche alternative: supabase CLI ===');
// Si supabase CLI est installé, on peut l'utiliser
const { execSync } = require('child_process');
try {
    execSync('supabase --version', { timeout: 5000 });
    console.log('Supabase CLI disponible');
} catch(e) {
    console.log('Supabase CLI non disponible');
}
