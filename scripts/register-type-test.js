const { chromium } = require('playwright');

const EMAIL = 'test_type_' + Date.now() + '@lenspro.test';
const PASSWORD = 'TestLensPro2026!';

async function run() {
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();

    const consoleErrors = [];
    page.on('console', msg => {
        if (msg.type() === 'error') consoleErrors.push(msg.text());
    });

    try {
        console.log('=== TEST TYPE (événements clavier) ===');

        await page.goto('https://lenspro.vercel.app/auth/register', { waitUntil: 'networkidle' });
        console.log('1. Page chargée');

        // Utiliser type() au lieu de fill() pour déclencher les événements React
        // clear + type simule une vraie saisie clavier
        const inputs = [
            { selector: 'input[name="fullName"]', value: 'Photographe Test Type' },
            { selector: 'input[name="email"]', value: EMAIL },
            { selector: 'input[name="password"]', value: PASSWORD },
            { selector: 'input[name="confirmPassword"]', value: PASSWORD },
        ];

        for (const input of inputs) {
            await page.locator(input.selector).click();
            await page.locator(input.selector).evaluate(el => el.value = '');
            await page.locator(input.selector).type(input.value, { delay: 10 });
            console.log(`2. ${input.selector} = ${input.value}`);
        }

        // Suivant
        await page.click('button:has-text("Suivant")');
        await page.waitForTimeout(2000);
        console.log('3. Suivant cliqué');

        // Étape 2
        await page.locator('input[name="username"]').click();
        await page.locator('input[name="username"]').evaluate(el => el.value = '');
        await page.locator('input[name="username"]').type('test_type', { delay: 10 });

        await page.locator('select[name="specialty"]').selectOption('Mariage');
        await page.locator('input[name="city"]').click();
        await page.locator('input[name="city"]').evaluate(el => el.value = '');
        await page.locator('input[name="city"]').type('Kinshasa', { delay: 10 });
        console.log('4. Étape 2 remplie avec type()');

        // Suivant
        await page.click('button:has-text("Suivant")');
        await page.waitForTimeout(2000);
        console.log('5. Suivant cliqué');

        // Cocher + submit
        const checkbox = page.locator('input[type="checkbox"]');
        if (!(await checkbox.isChecked())) {
            await checkbox.click();
        }
        console.log('6. Checkbox cochée');

        await page.click('button:has-text("Créer mon compte")');
        console.log('7. Submit cliqué');

        await page.waitForTimeout(8000);

        const finalUrl = page.url();
        console.log('\n=== RÉSULTAT ===');
        console.log('URL finale:', finalUrl);
        console.log('Titre:', await page.title());

        if (finalUrl.includes('/dashboard')) {
            console.log('\n✓ SUCCÈS: Inscription réussie !');
        } else {
            console.log('\n✗ ÉCHEC: Pas de redirection');
            if (consoleErrors.length > 0) {
                console.log('\nErreurs console:', consoleErrors);
            }
            const content = await page.textContent('body');
            console.log('\nContenu page:', content.substring(0, 600));
        }

    } catch(e) {
        console.log('ERREUR:', e.message);
    } finally {
        await browser.close();
    }
}

run();
