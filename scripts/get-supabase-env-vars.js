const https = require('https');
const fs = require('fs');

const content = fs.readFileSync('.env.local', 'utf8');
const vercelTokenMatch = content.match(/VERCEL_OIDC_TOKEN="([^"]+)"/);
const vercelToken = vercelTokenMatch ? vercelTokenMatch[1] : null;

if (!vercelToken) { console.log('PAS DE TOKEN'); process.exit(1); }

console.log('=== Récupérer les env vars Supabase depuis Vercel ===');

const req = https.request({
    hostname: 'api.vercel.com',
    path: '/v1/projects?name=lenspro',
    method: 'GET',
    headers: { 'Authorization': 'Bearer ' + vercelToken, 'Content-Type': 'application/json' }
}, res => {
    let body = '';
    res.on('data', c => body += c);
    res.on('end', () => {
        console.log('Status:', res.statusCode);
        if (res.statusCode !== 200) {
            console.log('Erreur:', body.substring(0, 300));
            return;
        }
        try {
            const projects = JSON.parse(body);
            if (!Array.isArray(projects) || projects.length === 0) {
                console.log('Pas de projet lenspro trouvé');
                return;
            }
            const project = projects[0];
            console.log('Project trouvé:', project.name, project.id, project.technicalId);
            
            // Maintenant aller chercher les env vars
            const envReq = https.request({
                hostname: 'api.vercel.com',
                path: '/v1/projects/' + project.id + '/env-vars',
                method: 'GET',
                headers: { 'Authorization': 'Bearer ' + vercelToken, 'Content-Type': 'application/json' }
            }, envRes => {
                let envBody = '';
                envRes.on('data', c => envBody += c);
                envRes.on('end', () => {
                    console.log('Env vars status:', envRes.statusCode);
                    try {
                        const envVars = JSON.parse(envBody);
                        console.log('\n=== SUPERBASE ENV VARS ===');
                        const supabaseVars = envVars.filter(v => v.key.toLowerCase().includes('supabase'));
                        supabaseVars.forEach(v => {
                            console.log(v.key + ' = ' + (v.value || '(vide)').substring(0, 80));
                        });
                        
                        // Chercher la clé service_role
                        const serviceKey = envVars.find(v => 
                            v.key.toLowerCase().includes('service_role') || 
                            v.key.toLowerCase().includes('service_key')
                        );
                        if (serviceKey) {
                            console.log('\n=== SERVICE ROLE KEY TROUVÉE ===');
                            console.log('Key:', serviceKey.value.substring(0, 50) + '...');
                            
                            // Utiliser cette clé pour activer Auth
                            activateAuth(serviceKey.value, project.id);
                        } else {
                            console.log('\nPas de service_role key trouvée');
                            console.log('Les vars disponibles sont:');
                            envVars.forEach(v => console.log('  -', v.key));
                        }
                    } catch(e) {
                        console.log('Erreur parsing env vars:', e.message);
                        console.log('Body:', envBody.substring(0, 300));
                    }
                });
            });
            envReq.on('error', e => console.log('Erreur env request:', e.message));
            envReq.end();
        } catch(e) {
            console.log('Erreur parsing projects:', e.message);
            console.log('Body:', body.substring(0, 300));
        }
    });
});
req.on('error', e => console.log('Erreur projects request:', e.message));
req.end();
