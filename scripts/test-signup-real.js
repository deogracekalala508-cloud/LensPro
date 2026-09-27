const https = require('https');
const fs = require('fs');

// Lire les vraies credentials depuis .env.local
const content = fs.readFileSync('.env.local', 'utf8');
const urlMatch = content.match(/NEXT_PUBLIC_SUPABASE_URL="([^"]+)"/);
const keyMatch = content.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY="([^"]+)"/);

const supabaseUrl = urlMatch ? urlMatch[1] : 'https://jjwzlgvpgrnyhufgbjah.supabase.co';
const anonKey = keyMatch ? keyMatch[1] : null;

console.log('URL:', supabaseUrl);
console.log('Key length:', anonKey ? anonKey.length : 0);

if (!anonKey) {
    console.log('ERREUR: Pas de clé API trouvée');
    process.exit(1);
}

// Test de l'API Supabase direct
const data = JSON.stringify({
    email: 'test_api_' + Date.now() + '@lenspro.test',
    password: 'TestLensPro2026!',
    options: {
        data: {
            full_name: 'Photographe Test API',
            username: 'test_api',
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

console.log('\n=== TEST SIGNUP DIRECT ===');

const req = https.request(options, (res) => {
    let body = '';
    res.on('data', c => body += c);
    res.on('end', () => {
        console.log('Status:', res.statusCode);
        console.log('Response:', body.substring(0, 500));
        
        if (res.statusCode === 200 || res.statusCode === 201) {
            console.log('\nSUCCÈS: Compte créé');
            try {
                const json = JSON.parse(body);
                console.log('User ID:', json.user?.id);
                console.log('Session:', json.session ? 'Oui' : 'Non (confirmation requise)');
            } catch(e) {}
        } else if (res.statusCode === 401) {
            console.log('\nERREUR 401: Invalid API key');
            console.log('La clé a été trouvée mais n\'est pas valide pour l\'API Auth');
        } else if (res.statusCode === 403) {
            console.log('\nERREUR 403: Auth désactivé ou clé invalide');
        } else {
            console.log('\nAutre erreur');
        }
    });
});

req.on('error', (e) => {
    console.log('Erreur de connexion:', e.message);
});

req.write(data);
req.end();
