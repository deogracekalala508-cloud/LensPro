const { chromium } = require('playwright');

const EMAIL = 'test_submit_' + Date.now() + '@lenspro.test';
const PASSWORD = 'TestLensPro2026!';

async function run() {
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();

    const events = [];
    const requests = [];

    // Intercepter les événements de formulaire
    page.on('request', req => {
        if (req.url().includes('/auth') || req.url().includes('/api')) {
            requests.push({ url: req.url(), method: req.method(), headers: req.headers() });
        }
    });

    try {
        console.log('=== TEST SOUMISSION FORMULAIRE ===');

        await page.goto('https://lenspro.vercel.app/auth/register', { waitUntil: 'networkidle' });
        console.log('Page chargée');

        // Remplir avec type() pour déclencher React
        await page.locator('input[name="fullName"]').click();
        await page.locator('input[name="fullName"]').type('Photographe Submit', { delay: 5 });
        
        await page.locator('input[name="email"]').click();
        await page.locator('input[name="email"]').type(EMAIL, { delay: 5 });
        
        await page.locator('input[name="password"]').click();
        await page.locator('input[name="password"]').type(PASSWORD, { delay: 5 });
        
        await page.locator('input[name="confirmPassword"]').click();
        await page.locator('input[name="confirmPassword"]').type(PASSWORD, { delay: 5 });
        console.log('Étape 1 remplie');

        // Vérifier les valeurs DOM après remplissage
        const domValues = await page.evaluate(() => {
            return {
                fullName: document.querySelector('input[name="fullName"]')?.value,
                email: document.querySelector('input[name="email"]')?.value,
                password: document.querySelector('input[name="password"]')?.value,
                confirmPassword: document.querySelector('input[name="confirmPassword"]')?.value
            };
        });
        console.log('Valeurs DOM étape 1:', domValues);

        // Cliquer Suivant
        await page.click('button:has-text("Suivant")');
        await page.waitForTimeout(2000);
        console.log('Suivant 1 cliqué');

        // Remplir étape 2
        await page.locator('input[name="username"]').click();
        await page.locator('input[name="username"]').type('test_submit', { delay: 5 });
        await page.locator('select[name="specialty"]').selectOption('Mariage');
        await page.locator('input[name="city"]').click();
        await page.locator('input[name="city"]').type('Kinshasa', { delay: 5 });
        console.log('Étape 2 remplie');

        const domValues2 = await page.evaluate(() => {
            return {
                username: document.querySelector('input[name="username"]')?.value,
                specialty: document.querySelector('select[name="specialty"]')?.value,
                city: document.querySelector('input[name="city"]')?.value
            };
        });
        console.log('Valeurs DOM étape 2:', domValues2);

        // Cliquer Suivant
        await page.click('button:has-text("Suivant")');
        await page.waitForTimeout(2000);
        console.log('Suivant 2 cliqué');

        // Vérifier l'étape 3
        const step3Content = await page.evaluate(() => {
            const container = document.querySelector('.step-container');
            return container ? container.textContent?.substring(0, 300) : 'pas de step-container';
        });
        console.log('Contenu étape 3:', step3Content.substring(0, 200));

        // Cocher checkbox
        const checkbox = page.locator('input[type="checkbox"]');
        const isCheckedBefore = await checkbox.isChecked();
        console.log('Checkbox cochée avant:', isCheckedBefore);
        if (!isCheckedBefore) {
            await checkbox.click();
        }
        const isCheckedAfter = await checkbox.isChecked();
        console.log('Checkbox cochée après:', isCheckedAfter);

        // Inspector la page pour trouver le formulaire
        const formInfo = await page.evaluate(() => {
            const forms = document.querySelectorAll('form');
            return Array.from(forms).map(f => ({
                action: f.action,
                method: f.method,
                onsubmit: f.onsubmit ? 'has handler' : 'none',
                querySelectorBtn:!!f.querySelector('button[type="submit"]')
            }));
        });
        console.log('Formulaires trouvés:', formInfo);

        // Vérifier les valeurs DOM de l'étape 3
        const domValues3 = await page.evaluate(() => {
            const form = document.querySelector('form');
            if (!form) return { error: 'pas de formulaire' };
            const fd = new FormData(form);
            return {
                fullName: fd.get('fullName'),
                email: fd.get('email'),
                password: fd.get('password'),
                confirmPassword: fd.get('confirmPassword'),
                username: fd.get('username'),
                city: fd.get('city'),
                specialty: fd.get('specialty'),
                acceptedTerms: fd.get('acceptedTerms')
            };
        });
        console.log('Valeurs FormData:', domValues3);

        // Cliquer submit
        console.log('6. Cliquer Créer mon compte');
        await page.click('button:has-text("Créer mon compte")');

        // Attendre et capturer
        await page.waitForTimeout(8000);

        const finalUrl = page.url();
        console.log('\n=== RÉSULTAT FINAL ===');
        console.log('URL:', finalUrl);

        if (finalUrl.includes('/dashboard')) {
            console.log('✓ SUCCÈS');
        } else {
            console.log('✗ ÉCHEC');

            // Vérifier le contenu actuel
            const currentText = await page.textContent('body');
            console.log('Contenu courant (extraits):', currentText.substring(0, 500));

            // Vérifier si un message d'erreur est affiché
            const errorMsg = await page.evaluate(() => {
                const alerts = document.querySelectorAll('[role="alert"], .alert, .error, [class*="error"]');
                return Array.from(alerts).map(a => a.textContent?.trim()).filter(Boolean);
            });
            console.log('Messages d\'erreur:', errorMsg);
            
            // Vérifier les requêtes réseau
            console.log('\nRequêtes réseau capturées:', requests.length);
            requests.forEach(r => console.log('  ', r.method, r.url.substring(0, 120)));
        }

    } catch(e) {
        console.log('ERREUR:', e.message);
    } finally {
        await browser.close();
    }
}

run();
