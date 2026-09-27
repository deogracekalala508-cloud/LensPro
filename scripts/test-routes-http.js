const http = require('http');

const routes = [
  '/',
  '/auth/login',
  '/auth/register',
  '/dashboard',
  '/dashboard/galleries',
  '/dashboard/galleries/new',
  '/dashboard/upload',
  '/dashboard/settings',
  '/dashboard/events',
  '/dashboard/events/create',
  '/events',
  '/explore',
  '/portfolio',
  '/admin',
  '/photographer/hermestestphotog',
  '/gallery/SM2026',
  '/event/GALA2026',
  '/event/GALA2026/giant',
  '/api/test-supabase'
];

async function testRoutes() {
  console.log('=== ROUTE HEALTH CHECK (HTTP GET) ===\n');
  let passed = 0;
  let failed = 0;

  for (const route of routes) {
    const url = `http://localhost:3000${route}`;
    try {
      const res = await new Promise((resolve, reject) => {
        const req = http.get(url, (res) => {
          let body = '';
          res.on('data', chunk => body += chunk);
          res.on('end', () => resolve({ status: res.statusCode, body }));
        });
        req.on('error', reject);
        req.setTimeout(5000, () => req.destroy(new Error('Timeout')));
      });

      const isOk = res.status === 200;
      const hasContent = res.body.length > 500;
      if (isOk && hasContent) {
        console.log(`✅ ${route.padEnd(32)} -> HTTP ${res.status} (${(res.body.length / 1024).toFixed(1)} KB)`);
        passed++;
      } else {
        console.log(`❌ ${route.padEnd(32)} -> HTTP ${res.status} (Length: ${res.body.length})`);
        failed++;
      }
    } catch (err) {
      console.log(`❌ ${route.padEnd(32)} -> ERROR: ${err.message}`);
      failed++;
    }
  }

  console.log(`\nResults: ${passed}/${routes.length} passed, ${failed} failed.`);
}

testRoutes();
