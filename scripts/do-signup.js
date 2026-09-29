const https = require('https');
const fs = require('fs');

// Lire la clé depuis .env.local
const content = fs.readFileSync('.env.local', 'utf8');
const keyMatch = content.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY="([^"]+)"/);
const urlMatch = content.match(/NEXT_PUBLIC_SUPABASE_URL="([^"]+)"/);

const supabaseUrl = urlMatch ? urlMatch[1] : 'https://jjwzlgvpgrnyhufgbjah.supabase.co';
const anonKey = keyMatch ? keyMatch[1] : null;

console.log('URL:', supabaseUrl);
console.log('Clé (longueur):', anonKey ? anonKey.length : 0);

if (!anonKey) {
    console.log('ERREUR: Pas de clé trouvée');
    process.exit(1);
}

const email = 'test_action_' + Date.now() + '@lenspro.test';
const password = 'TestLensPro2026!';

const data = JSON.stringify({
    email,
    password,
    options: {
        data: {
            full_name: 'Photographe Test Action',
            username: 'test_action',
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
        'apikey': anonKey,
        'Authorization': 'Bearer ' + anonKey
    }
};

console.log('\n=== SIGNUP SUPABASE ===');
console.log('Email:', email);

const req = https.request(options, (res) => {
    let body = '';
    res.on('data', c => body += c);
    res.on('end', () => {
        console.log('\n=== RÉSULTAT ===');
        console.log('Status:', res.statusCode);
        console.log('Réponse:', body.substring(0, 500));
        
        if (res.statusCode === 200 || res.statusCode === 201) {
            try {
                const json = JSON.parse(body);
                console.log('SUCCÈS:');
                console.log('  User ID:', json.user?.id);
                console.log('  Email:', json.user?.email);
                console.log('  Session:', json.session ? 'Oui' : 'Non');
            } catch(e) {}
        } else if (res.statusCode === 401) {
            console.log('ERREUR 401: Invalid API key');
        } else if (res.statusCode === 403) {
            console.log('ERREUR 403: Auth désactivé ou clé invalide');
        }
    });
});

req.on('error', (e) => {
    console.log('Erreur:', e.message);
});

req.write(data);
req.end();
