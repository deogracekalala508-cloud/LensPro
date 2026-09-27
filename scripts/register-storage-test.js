const { chromium } = require('playwright');

const EMAIL = 'test_storage_' + Date.now() + '@lenspro.test';
const PASSWORD = 'TestLensPro2026!';

async function run() {
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();

    try {
        console.log('=== TEST LOCALSTORAGE FALLBACK ===');

        await page.goto('https://lenspro.vercel.app/auth/register', { waitUntil: 'networkidle' });
        console.log('Page chargée');

        // Remplir étape 1 avec type()
        await page.locator('input[name="fullName"]').click();
        await page.locator('input[name="fullName"]').type('Photographe Storage', { delay: 5 });
        await page.locator('input[name="email"]').click();
        await page.locator('input[name="email"]').type(EMAIL, { delay: 5 });
        await page.locator('input[name="password"]').click();
        await page.locator('input[name="password"]').type(PASSWORD, { delay: 5 });
        await page.locator('input[name="confirmPassword"]').click();
        await page.locator('input[name="confirmPassword"]').type(PASSWORD, { delay: 5 });
        console.log('Étape 1 remplie');

        // Suivant 1
        await page.click('button:has-text("Suivant")');
        await page.waitForTimeout(2000);

        // Remplir étape 2
        await page.locator('input[name="username"]').click();
        await page.locator('input[name="username"]').type('test_storage', { delay: 5 });
        await page.locator('select[name="specialty"]').selectOption('Mariage');
        await page.locator('input[name="city"]').click();
        await page.locator('input[name="city"]').type('Kinshasa', { delay: 5 });
        console.log('Étape 2 remplie');

        // Suivant 2
        await page.click('button:has-text("Suivant")');
        await page.waitForTimeout(2000);

        // Cocher + submit
        const checkbox = page.locator('input[type="checkbox"]');
        if (!(await checkbox.isChecked())) {
            await checkbox.click();
        }
        console.log('Submit...');
        await page.click('button:has-text("Créer mon compte")');

        // Attendre
        await page.waitForTimeout(8000);

        // Vérifier l'URL
        const url = page.url();
        console.log('\nURL finale:', url);

        // Vérifier le localStorage
        const storage = await page.evaluate(() => {
            return {
                lenspro_user: localStorage.getItem('lenspro_user'),
                allKeys: Object.keys(localStorage)
            };
        });
        console.log('\nLocalStorage:', JSON.stringify(storage, null, 2));

        // Vérifier le contenu de la page
        const content = await page.textContent('body');
        console.log('\nContenu page (extraits):', content.substring(0, 500));

        if (url.includes('/dashboard')) {
            console.log('\n✓ SUCCÈS: Redirection vers dashboard');
        } else if (storage.lenspro_user) {
            console.log('\n✓ Compte créé en localStorage (mode démo)');
        } else {
            console.log('\n✗ ÉCHEC: ni dashboard ni localStorage');
        }

    } catch(e) {
        console.log('ERREUR:', e.message);
    } finally {
        await browser.close();
    }
}

run();
