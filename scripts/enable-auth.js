const { chromium } = require('playwright');

async function main() {
    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext();
    const page = await context.newPage();

    // Collecter les logs console
    const logs = [];
    page.on('console', msg => logs.push(msg.text()));

    console.log('=== 1. Navigation vers le dashboard Supabase ===');
    await page.goto('https://supabase.com/dashboard/project/jjwzlgvpgrnyhufgbjah/settings', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);

    let url = page.url();
    console.log('URL après navigation:', url);

    if (url.includes('sign-in') || url.includes('login')) {
        console.log('\n=== 2. Connexion via GitHub ===');
        // Cliquer sur "Continue with GitHub"
        const githubBtn = await page.locator('text=GitHub').first();
        if (await githubBtn.isVisible()) {
            await githubBtn.click();
            console.log('Clic sur GitHub');
            await page.waitForTimeout(5000);
            
            // Vérifier où on est
            url = page.url();
            console.log('URL après clic GitHub:', url);
            
            if (url.includes('github.com')) {
                console.log('\n=== 3. Page GitHub OAuth - simulation connexion ===');
                // Sur GitHub, l'utilisateur doit se connecter manuellement
                // On affiche la page pour que l'utilisateur puisse se connecter
                console.log('L\'utilisateur doit se connecter sur GitHub manuellement');
                console.log('URL GitHub:', url);
                
                // Attendre que l'utilisateur se connecte (max 60s)
                console.log('\nAttente de la connexion GitHub (60s)...');
                await page.waitForTimeout(60000);
                
                url = page.url();
                console.log('URL après attente:', url);
            }
        } else {
            console.log('Bouton GitHub non visible');
            console.log(await page.content());
        }
    }

    // Si on est sur le dashboard
    if (!url.includes('sign-in')) {
        console.log('\n=== 4. Activation d\'Auth ===');
        // Chercher le toggle Auth
        const authSection = page.locator('text=Authentication').first();
        if (await authSection.isVisible()) {
            console.log('Section Auth trouvée');
            await authSection.click();
            await page.waitForTimeout(2000);
            
            // Chercher le toggle "Enabled"
            const toggle = page.locator('input[type="checkbox"]').first();
            if (await toggle.isVisible()) {
                const isChecked = await toggle.isChecked();
                console.log('Auth activé:', !isChecked);
                if (!isChecked) {
                    await toggle.click();
                    await page.waitForTimeout(2000);
                    console.log('Auth activée !');
                }
            }
        } else {
            console.log('Section Auth non trouvée');
            console.log(await page.content().substring(0, 1000));
        }
    }

    console.log('\n=== LOGS CONSOLE ===');
    logs.forEach(l => console.log(l));

    await browser.close();
}

main().catch(e => console.log('ERREUR:', e.message));
