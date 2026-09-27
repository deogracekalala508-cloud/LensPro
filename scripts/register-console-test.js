const { chromium } = require('playwright');

const EMAIL = 'test_log_' + Date.now() + '@lenspro.test';
const PASSWORD = 'TestLensPro2026!';

async function run() {
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();

    const logs = [];
    page.on('console', msg => {
        logs.push({ type: msg.type(), text: msg.text() });
        if (msg.type() === 'error' || msg.type() === 'warning') {
            console.log('CONSOLE [' + msg.type() + ']:', msg.text());
        }
    });

    try {
        console.log('=== TEST AVEC LOGS CONSOLE ===');

        await page.goto('https://lenspro.vercel.app/auth/register', { waitUntil: 'networkidle' });
        console.log('Page chargée');

        // Remplir avec type()
        await page.locator('input[name="fullName"]').click();
        await page.locator('input[name="fullName"]').type('Photographe Log', { delay: 5 });
        await page.locator('input[name="email"]').click();
        await page.locator('input[name="email"]').type(EMAIL, { delay: 5 });
        await page.locator('input[name="password"]').click();
        await page.locator('input[name="password"]').type(PASSWORD, { delay: 5 });
        await page.locator('input[name="confirmPassword"]').click();
        await page.locator('input[name="confirmPassword"]').type(PASSWORD, { delay: 5 });

        await page.click('button:has-text("Suivant")');
        await page.waitForTimeout(2000);

        await page.locator('input[name="username"]').click();
        await page.locator('input[name="username"]').type('test_log', { delay: 5 });
        await page.locator('select[name="specialty"]').selectOption('Mariage');
        await page.locator('input[name="city"]').click();
        await page.locator('input[name="city"]').type('Kinshasa', { delay: 5 });

        await page.click('button:has-text("Suivant")');
        await page.waitForTimeout(2000);

        const checkbox = page.locator('input[type="checkbox"]');
        if (!(await checkbox.isChecked())) {
            await checkbox.click();
        }

        console.log('Submit...');
        await page.click('button:has-text("Créer mon compte")');

        await page.waitForTimeout(10000);

        console.log('\n=== RÉSULTAT ===');
        console.log('URL:', page.url());

        // Vérifier le state React via l'objet window si disponible
        const reactState = await page.evaluate(() => {
            // Chercher les objets React dans la page
            const results = [];
            const all = document.querySelectorAll('*');
            for (const el of all) {
                if (el.__reactInternalInstance$ || el.__reactFiber$) {
                    results.push({ tag: el.tagName, hasReact: true });
                }
            }
            return results;
        });
        console.log('Éléments React trouvés:', reactState.length);

        // Lire le contenu
        const content = await page.textContent('body');
        console.log('Contenu:', content.substring(0, 400));

        // Vérifier si un message d'erreur est affiché
        const errorDiv = await page.evaluate(() => {
            const Errors = document.querySelectorAll('[role="alert"], .error-message, .error-text, [class*="error"]');
            return Array.from(Errors).map(e => e.textContent?.trim()).filter(Boolean);
        });
        console.log('Messages erreur:', errorDiv);

    } catch(e) {
        console.log('ERREUR:', e.message);
    } finally {
        await browser.close();
    }
}

run();
