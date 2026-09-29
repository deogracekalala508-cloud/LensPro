const https = require('https');
const fs = require('fs');

const content = fs.readFileSync('.env.local', 'utf8');

// Clé de service_role
const srMatch = content.match(/SUPABASE_SERVICE_ROLE_KEY="([^"]+)"/);
const anonMatch = content.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY="([^"]+)"/);

const serviceKey = srMatch ? srMatch[1] : null;
const anonKey = anonMatch ? anonMatch[1] : null;

console.log('Service Role Key:', serviceKey ? serviceKey.substring(0, 30) + '...' : 'NON TROUVÉE');
console.log('Anon Key:', anonKey ? anonKey.substring(0, 30) + '...' : 'NON TROUVÉE');

// Utiliser l'API d'administration Supabase pour créer l'utilisateur
// Endpoint: POST /auth/v1/admin/users
const email = 'test_admin_' + Date.now() + '@lenspro.test';
const password = 'TestLensPro2026!';

const data = JSON.stringify({
    email,
    password,
    user_metadata: {
        full_name: 'Photographe Test Admin',
        username: 'test_admin',
        city: 'Kinshasa',
        specialty: 'Mariage'
    }
});

const options = {
    hostname: 'jjwzlgvpgrnyhufgbjah.supabase.co',
    path: '/auth/v1/admin/users',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'apikey': serviceKey || anonKey,
        'Authorization': 'Bearer ' + (serviceKey || anonKey)
    }
};

console.log('\n=== CRÉATION UTILISATEUR (ADMIN) ===');
console.log('Email:', email);
console.log('Endpoint:', options.hostname + options.path);

const req = https.request(options, (res) => {
    let body = '';
    res.on('data', c => body += c);
    res.on('end', () => {
        console.log('\n=== RÉSULTAT ===');
        console.log('Status:', res.statusCode);
        console.log('Réponse:', body.substring(0, 800));
        
        if (res.statusCode === 200 || res.statusCode === 201) {
            try {
                const json = JSON.parse(body);
                console.log('\nSUCCÈS:');
                console.log('  User ID:', json.id);
                console.log('  Email:', json.email);
            } catch(e) {}
        } else if (res.statusCode === 401) {
            console.log('ERREUR 401: Invalid API key');
        } else if (res.statusCode === 403) {
            console.log('ERREUR 403:', body.substring(0, 200));
        }
    });
});

req.on('error', (e) => {
    console.log('Erreur:', e.message);
});

req.write(data);
req.end();
