const { chromium } = require('playwright');

const EMAIL = 'test_net_' + Date.now() + '@lenspro.test';
const PASSWORD = 'TestLensPro2026!';

async function run() {
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();

    const consoleErrors = [];
    const networkRequests = [];
    const networkResponses = [];

    page.on('console', msg => {
        if (msg.type() === 'error') consoleErrors.push(msg.text());
    });

    page.on('request', req => {
        if (req.url().includes('/auth') || req.url().includes('/api')) {
            networkRequests.push({ url: req.url(), method: req.method() });
        }
    });

    page.on('response', res => {
        if (res.url().includes('/auth') || res.url().includes('/api')) {
            networkResponses.push({ url: res.url(), status: res.status(), method: res.request().method() });
        }
    });

    try {
        console.log('=== TEST RÉSEAU INSCRIPTION ===');

        // 1. Navigation
        await page.goto('https://lenspro.vercel.app/auth/register', { waitUntil: 'networkidle' });
        console.log('1. Page chargée');

        // 2. Remplir étape 1
        await page.fill('input[name="fullName"]', 'Photographe Test Réseau');
        await page.fill('input[name="email"]', EMAIL);
        await page.fill('input[name="password"]', PASSWORD);
        await page.fill('input[name="confirmPassword"]', PASSWORD);
        console.log('2. Étape 1 remplie');

        // 3. Cliquer Suivant
        await page.click('button:has-text("Suivant")');
        await page.waitForTimeout(2000);
        console.log('3. Suivant cliqué');

        // 4. Remplir étape 2
        await page.fill('input[name="username"]', 'test_reseau');
        await page.selectOption('select[name="specialty"]', 'Mariage');
        await page.fill('input[name="city"]', 'Kinshasa');
        console.log('4. Étape 2 remplie');

        // 5. Cliquer Suivant
        await page.click('button:has-text("Suivant")');
        await page.waitForTimeout(2000);
        console.log('5. Suivant cliqué');

        // 6. Cocher + submit
        const checkbox = page.locator('input[type="checkbox"]');
        if (await checkbox.isChecked() === false) {
            await checkbox.check();
        }
        await page.click('button:has-text("Créer mon compte")');
        console.log('6. Submit cliqué');

        // 7. Attendre
        await page.waitForTimeout(5000);

        const finalUrl = page.url();
        console.log('\n=== RÉSULTAT ===');
        console.log('URL finale:', finalUrl);
        console.log('Titre:', await page.title());

        // 8. Réseau
        console.log('\n=== RÉSEAUX REQUÊTES ===');
        networkRequests.forEach(r => console.log('  REQ:', r.method, r.url.substring(0, 100)));
        
        console.log('\n=== RÉSEAUX RÉPONSES ===');
        networkResponses.forEach(r => console.log('  RES:', r.status, r.method, r.url.substring(0, 100)));

        console.log('\n=== ERREURS CONSOLE ===');
        consoleErrors.forEach(e => console.log('  ERR:', e));

        // 9. Contenu page
        const content = await page.textContent('body');
        console.log('\n=== CONTENU PAGE (extraits) ===');
        console.log(content.substring(0, 800));

    } catch(e) {
        console.log('ERREUR:', e.message);
    } finally {
        await browser.close();
    }
}

run();
