const https = require('https');
const fs = require('fs');

const content = fs.readFileSync('.env.local', 'utf8');
const vercelTokenMatch = content.match(/VERCEL_OIDC_TOKEN="([^"]+)"/);
const vercelToken = vercelTokenMatch ? vercelTokenMatch[1] : null;

if (!vercelToken) {
    console.log('Erreur: Pas de VERCEL_OIDC_TOKEN');
    process.exit(1);
}...[truncated]