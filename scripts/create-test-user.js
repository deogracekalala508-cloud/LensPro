const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

// Lire les credentials depuis .env.local
const content = fs.readFileSync('.env.local', 'utf8');
const urlMatch = content.match(/NEXT_PUBLIC_SUPABASE_URL="([^"]+)"/);
const keyMatch = content.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY="([^"]+)"/);

const supabaseUrl = urlMatch ? urlMatch[1] : 'https://jjwzlgvpgrnyhufgbjah.supabase.co';
// La clé est tronquée - on utilise celle de l'API Supabase avec la clé service role
// On va utiliser l'API REST directement avec fetch pour créer l'utilisateur

console.log('=== Création compte test via Supabase API ===');

// Utiliser l'API Supabase avec la clé anon pour créer l'utilisateur
// Si la clé est invalide, on va essayer avec l'API management

const https = require('https');

const anonKey = keyMatch ? keyMatch[1] : null;
const testEmail = 'test_bypass_' + Date.now() + '@lenspro.test';
const testPassword = 'TestLensPro2026!';

// Approche: utiliser l'API REST Supabase pour créer l'utilisateur
// Cela nécessite Auth activé, mais on va essayer

const data = JSON.stringify({
    email: testEmail,
    password: testPassword,
    options: {
        data: {
            full_name: 'Photographe Test Bypass',
            username: 'test_bypass',
            city: 'Kinshasa',
            specialty: 'Mariage'
        }
    }
});

const options = {
    hostname: 'jjwzlgvpgrnyhufgbjah.supabase.co',
    path: '/auth/v1/signup',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'apikey': anonKey || '',
        'Authorization': 'Bearer ' + (anonKey || '')
    }
};

console.log('URL:', supabaseUrl);
console.log('Clé anon (tronquée):', anonKey ? anonKey.substring(0, 30) + '...' : 'aucune');
console.log('Email test:', testEmail);

const req = https.request(options, (res) => {
    let body = '';
    res.on('data', c => body += c);
    res.on('end', () => {
        console.log('\nStatus:', res.statusCode);
        console.log('Réponse:', body.substring(0, 300));
        
        if (res.statusCode === 200 || res.statusCode === 201) {
            console.log('\n✓ SUCCÈS: Compte créé via API');
            try {
                const json = JSON.parse(body);
                console.log('User ID:', json.user?.id);
                console.log('Email:', json.user?.email);
            } catch(e) {}
        } else if (res.statusCode === 401) {
            console.log('\n✗ ERREUR 401: Invalid API key - la clé est invalide');
            console.log('Solution: utiliser la clé service_role ou activer Auth');
            process.exit(1);
        } else if (res.statusCode === 403) {
            console.log('\n✗ ERREUR 403: Auth désactivé ou clé invalide');
            console.log('Solution: activer Auth dans le dashboard Supabase');
            process.exit(1);
        } else {
            console.log('\n✗ Autre erreur');
            process.exit(1);
        }
    });
});

req.on('error', (e) => {
    console.log('Erreur de connexion:', e.message);
    process.exit(1);
});

req.write(data);
req.end();
