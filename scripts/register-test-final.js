const { chromium } = require('playwright');

const EMAIL_BASE = 'test_reg_' + Date.now();
const PASSWORD = 'TestLensPro2026!';

async function run() {
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();

    const errors = [];
    page.on('console', msg => {
        if (msg.type() === 'error') errors.push(msg.text());
    });

    try {
        // 1. Navigation vers /auth/register
        console.log('1. Navigation vers /auth/register');
        await page.goto('https://lenspro.vercel.app/auth/register', { waitUntil: 'networkidle' });

        // 2. Remplir étape 1
        const email = EMAIL_BASE + '@lenspro.test';
        console.log('2. Remplir étape 1 - email:', email);

        await page.fill('[name="fullName"]', 'Photographe Test Reg');
        await page.fill('[name="email"]', email);
        await page.fill('[name="password"]', PASSWORD);
        await page.fill('[name="confirmPassword"]', PASSWORD);

        // 3. Cliquer Suivant
        console.log('3. Cliquer Suivant');
        await page.click('button:has-text("Suivant")');
        await page.waitForTimeout(1500);

        // 4. Remplir étape 2
        console.log('4. Remplir étape 2');
        await page.fill('[name="username"]', 'photographe_test_reg');
        await page.selectOption('select[name="specialty"]', 'Mariage');
        await page.fill('[name="city"]', 'Kinshasa');

        // 5. Cliquer Suivant
        console.log('5. Cliquer Suivant');
        await page.click('button:has-text("Suivant")');
        await page.waitForTimeout(1500);

        // 6. Cocher conditions + Cliquer Créer mon compte
        console.log('6. Cocher conditions + submit');
        await page.check('input[type="checkbox"]');
        await page.click('button:has-text("Créer mon compte")');

        // 7. Attendre redirection
        console.log('7. Attendre redirection vers /dashboard');
        await page.waitForURL('**/dashboard**', { timeout: 10000 }).catch(() => {});

        const url = page.url();
        const title = await page.title();

        console.log('\n=== RÉSULTAT ===');
        console.log('URL:', url);
        console.log('Titre:', title);

        if (url.includes('/dashboard')) {
            console.log('SUCCÈS: Inscription réussie, redirection vers dashboard');
            // Vérifier que l'utilisateur est connecté
            const dashboardContent = await page.textContent('body');
            console.log('Contenu Dashboard (extrait):', dashboardContent.substring(0, 500));
        } else {
            console.log('ÉCHEC: Pas de redirection vers dashboard');
            // Vérifier les erreurs
            if (errors.length > 0) {
                console.log('Erreurs console:', errors);
            }
            const pageContent = await page.textContent('body');
            console.log('Contenu page:', pageContent.substring(0, 1000));
        }

        // Nettoyer le compte test
        console.log('\nNettoyage: tentative de suppression du compte test');
        try {
            const { execSync } = require('child_process');
            execSync(`curl -s -X DELETE "https://jjwzlgvpgrnyhufgbjah.supabase.co/auth/v1/users" -H "apikey: VOTRE_KEY" -H "Content-Type: application/json" -d '{"id":""}'`, { timeout: 5000 }).toString();
        } catch(e) {
            // Ignore - on n'a pas la clé
        }

    } catch(e) {
        console.log('Erreur:', e.message);
    } finally {
        await browser.close();
    }
}

run();
