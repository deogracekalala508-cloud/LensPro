const https = require('https');
const fs = require('fs');

const content = fs.readFileSync('.env.local', 'utf8');
const vercelTokenMatch = content.match(/VERCEL_OIDC_TOKEN="([^"]+)"/);
const vercelToken = vercelTokenMatch ? vercelTokenMatch[1] : null;

if (!vercelToken) { console.log('NO VERCEL TOKEN'); process.exit(1); }

console.log('=== Récupérer les env vars Vercel pour le projet lenspro ===');

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
            console.log('Erreur:', body.substring(0, 200));
            return;
        }
        try {
            const projects = JSON.parse(body);
            if (!Array.isArray(projects) || projects.length === 0) {
                console.log('Pas de projet lenspro trouvé');
                return;
            }
            const project = projects[0];
            console.log('Project:', project.name, project.id, project.technicalId);
            
            // Récupérer les environment variables
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
                        console.log('\n=== SUPABASE ENV VARS ===');
                        const supabaseVars = envVars.filter(v => v.key.toLowerCase().includes('supabase'));
                        supabaseVars.forEach(v => {
                            const val = v.value || '(vide)';
                            console.log(v.key + ' = ' + val.substring(0, 100));
                        });
                        
                        // Chercher service_role key
                        const serviceKey = envVars.find(v => 
                            v.key.toLowerCase().includes('service_role') || 
                            v.key.toLowerCase().includes('service_key')
                        );
                        if (serviceKey) {
                            console.log('\n=== SERVICE ROLE KEY ===');
                            console.log('Key:', serviceKey.value.substring(0, 50) + '...');
                            activateAuth(serviceKey.value);
                        } else {
                            console.log('\nPas de service_role key trouvée');
                        }
                    } catch(e) { console.log('Parse error:', e.message); }
                });
            });
            envReq.on('error', e => console.log('Env error:', e.message));
            envReq.end();
        } catch(e) { console.log('Parse error:', e.message); }
    });
});
req.on('error', e => console.log('Projects error:', e.message));
req.end();
