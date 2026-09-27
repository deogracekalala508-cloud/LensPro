const { chromium } = require('playwright');

const TEST_EMAIL = 'test_registration_' + Date.now() + '@lenspro.test';
const TEST_PASSWORD = 'TestLensPro2026!';

async function main() {
    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext();
    const page = await context.newPage();

    const logs = [];
    page.on('console', msg => logs.push(msg.type() + ': ' + msg.text()));

    try {
        // ===== PHASE 1: Connexion au dashboard Supabase =====
        console.log('=== PHASE 1: Connexion Supabase Dashboard ===');
        await page.goto('https://supabase.com/dashboard', { waitUntil: 'domcontentloaded' });
        await page.waitForTimeout(3000);

        const url1 = page.url();
        console.log('URL:', url1);

        // Cliquer sur GitHub
        const githubBtn = page.locator('button:has-text("GitHub")').first();
        if (await githubBtn.isVisible()) {
            console.log('Clic bouton GitHub...');
            await githubBtn.click();
            await page.waitForTimeout(5000);
            console.log('Attente GitHub...');
            await page.waitForTimeout(10000);
        }

        const urlAfterGithub = page.url();
        console.log('Après GitHub:', urlAfterGithub);

        // ===== PHASE 2: Aller au projet et activer Auth =====
        if (!urlAfterGithub.includes('sign-in')) {
            console.log('\n=== PHASE 2: Accès au projet LensPro ===');
            // Aller direct au projet
            await page.goto('https://supabase.com/dashboard/project/jjwzlgvpgrnyhufgbjah/auth/settings', { waitUntil: 'domcontentloaded' });
            await page.waitForTimeout(5000);

            const urlProject = page.url();
            console.log('URL projet:', urlProject);

            // Lire le contenu pour voir l'état d'Auth
            const content = await page.content();
            const isAuthEnabled = content.includes('is_enabled') && !content.includes('"is_enabled":false');
            console.log('Auth activé dans le HTML:', isAuthEnabled);

            // Chercher le toggle
            const toggleText = await page.locator('text=Authentication').first().textContent().catch(() => null);
            console.log('Texte toggle Auth:', toggleText);

            // Si on voit le toggle
            const checkbox = page.locator('input[type="checkbox"]').first();
            if (await checkbox.isVisible()) {
                const checked = await checkbox.isChecked();
                console.log('Checkbox cochée:', checked);
                if (!checked) {
                    console.log('Activation d\'Auth...');
                    await checkbox.click();
                    await page.waitForTimeout(3000);
                    console.log('Auth activée (clique effectué)');
                }
            }
        } else {
            console.log('\n=== AUCUN ACCÈS: Déjà connecté à GitHub mais pas au dashboard ===');
            console.log('L\'utilisateur doit manuellement autoriser l\'application depuis GitHub');
        }

        console.log('\n=== LOGS CONSOLE ===');
        logs.forEach(l => console.log(l));

    } catch(e) {
        console.log('ERREUR:', e.message);
        console.log('\n=== LOGS CONSOLE ===');
        logs.forEach(l => console.log(l));
    } finally {
        await browser.close();
    }
}

main();
