const https = require('https');
const fs = require('fs');

const content = fs.readFileSync('.env.local', 'utf8');
const vercelTokenMatch = content.match(/VERCEL_OIDC_TOKEN="([^"]+)"/);
const vercelToken = vercelTokenMatch ? vercelTokenMatch[1] : null;

if (!vercelToken) { console.log('NO VERCEL TOKEN'); process.exit(1); }

console.log('=== Vercel Environment Variables ===');

// Chercher le projet lenspro
const req = https.request({
    hostname: 'api.vercel.com',
    path: '/v1/projects?name=lenspro',
    method: 'GET',
    headers: { 'Authorization': 'Bearer ' + vercelToken }
}, res => {
    let body = '';
    res.on('data', c => body += c);
    res.on('end', () => {
        try {
            const projects = JSON.parse(body);
            if (projects.length === 0) { console.log('Pas de projet lenspro trouvé'); return; }
            
            const project = projects[0];
            console.log('Project:', project.name, project.id);
            
            // Lire les environment variables
            const envReq = https.request({
                hostname: 'api.vercel.com',
                path: '/v1/projects/' + project.id + '/env variables',
                method: 'GET',
                headers: { 'Authorization': 'Bearer ' + vercelToken }
            }, envRes => {
                let envBody = '';
                envRes.on('data', c => envBody += c);
                envRes.on('end', () => {
                    try {
                        const envVars = JSON.parse(envBody);
                        console.log('\nVars (NEXT_PUBLIC_SUPABASE et SUPABASE):');
                        envVars.forEach(v => {
                            if (v.key.includes('SUPABASE')) {
                                const val = v.value || '';
                                console.log('  ' + v.key + ' = ' + (val.substring(0, 40) + '...').substring(0, 50));
                            }
                        });
                        
                        // Vérifier s'il y a un service_role key
                        const hasServiceKey = envVars.some(v => 
                            v.key.includes('SERVICE_ROLE') || v.key.includes('SERVICE_KEY')
                        );
                        console.log('\nService role key présent:', hasServiceKey);
                        
                        if (hasServiceKey) {
                            console.log('\n=== Activation Auth via API Supabase ===');
                            const serviceKey = envVars.find(v => 
                                v.key.includes('SERVICE_ROLE') || v.key.includes('SERVICE_KEY')
                            ).value;
                            activateAuth(project.id, serviceKey);
                        } else {
                            console.log('\nPas de service_role key - impossible d\'activer Auth via API');
                            console.log('Solution: utiliser le dashboard Supabase manuellement');
                        }
                    } catch(e) { console.log('ERR parsing env:', e.message); }
                });
            });
            envReq.on('error', e => console.log('ERR env request:', e.message));
            envReq.end();
        } catch(e) { console.log('ERR parsing projects:', e.message); }
    });
});
req.on('error', e => console.log('ERR projects request:', e.message));
req.end();
