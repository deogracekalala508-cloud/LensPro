const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const envPath = path.join(__dirname, '..', '.env.local');
let token = '';

if (fs.existsSync(envPath)) {
  const lines = fs.readFileSync(envPath, 'utf8').split('\n');
  for (const line of lines) {
    if (line.startsWith('VERCEL_OIDC_TOKEN=')) {
      token = line.split('=')[1].trim().replace(/^["']|["']$/g, '');
    }
  }
}

console.log('Testing VERCEL_OIDC_TOKEN env var integration...');

const env = {
  ...process.env,
  VERCEL_OIDC_TOKEN: token,
  VERCEL_TOKEN: token,
  VERCEL_AUTH_TOKEN: token
};

try {
  console.log('Running npx vercel --prod --yes...');
  const out = execSync('npx vercel --prod --yes', { encoding: 'utf8', cwd: path.join(__dirname, '..'), env });
  console.log('Vercel Output:\n', out);
} catch (err) {
  console.error('Error message:', err.message);
  if (err.stdout) console.log('stdout:', err.stdout);
  if (err.stderr) console.log('stderr:', err.stderr);
}
