const { chromium } = require('playwright');

(async () => {
    console.log('=== Connexion Supabase Dashboard ===');
    
    const browser = await chromium.launch({ headless: false, slowMo: 500 });
    const context = await browser.newContext();
    const page = await context.newPage();

    const logs = [];
    page.on('console', msg => logs.push(msg.type() + ': ' + msg.text()));

    try {
        // 1. Naviguer vers le dashboard
        console.log('1. Navigation vers dashboard...');
        await page.goto('https://supabase.com/dashboard', { waitUntil: 'domcontentloaded' });
        await page.waitForTimeout(3000);
        
        const url1 = page.url();
        console.log('URL après navigation:', url1);

        if (url1.includes('sign-in') || url1.includes('login')) {
            // 2. Cliquer sur GitHub
            console.log('2. Recherche bouton GitHub...');
            
            // Attendre que le contenu soit chargé
            await page.waitForTimeout(5000);
            
            // Chercher le bouton GitHub
            const githubBtn = page.locator('text=GitHub').first();
            const isVisible = await githubBtn.isVisible().catch(() => false);
            console.log('Bouton GitHub visible:', isVisible);
            
            if (isVisible) {
                console.log('3. Clic sur GitHub...');
                await githubBtn.click();
                await page.waitForTimeout(8000);
                
                const urlAfter = page.url();
                console.log('URL après clic GitHub:', urlAfter);
                
                if (urlAfter.includes('github.com')) {
                    console.log('\n=== ⏳ PAGE GITHUB OUVERTE ===');
                    console.log('URL:', urlAfter);
                    console.log('\nL\'utilisateur a déjà autorisé. Attente de la redirection...');
                    await page.waitForTimeout(15000);
                    
                    const finalUrl = page.url();
                    console.log('URL après redirection:', finalUrl);
                }
            } else {
                console.log('Bouton GitHub non visible');
                console.log('Contenu actuel:', await page.content().substring(0, 500));
            }
        } else {
            console.log('Déjà connecté au dashboard');
        }

        console.log('\n=== LOGS CONSOLE ===');
        logs.forEach(l => console.log(l));

    } catch(e) {
        console.log('ERREUR:', e.message);
        console.log('\n=== LOGS CONSOLE ===');
        logs.forEach(l => console.log(l));
    } finally {
        await browser.close();
        console.log('\n=== Navigateur fermé ===');
    }
})().catch(e => console.log('FATAL:', e.message));
