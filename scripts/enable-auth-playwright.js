const { chromium } = require('playwright');

async function main() {
    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext();
    const page = await context.newPage();

    console.log('=== Activation Auth Supabase ===');

    // Aller à la page des providers Auth
    console.log('1. Navigation vers Auth Providers');
    await page.goto('https://supabase.com/dashboard/project/jjwzlgvpgrnyhufgbjah/auth/providers', { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);

    let url = page.url();
    console.log('URL initiale:', url);

    // Si session expirée, reconnecter avec GitHub
    if (url.includes('sign-in')) {
        console.log('2. Session expirée - connexion GitHub...');
        await page.goto('https://supabase.com/dashboard', { waitUntil: 'domcontentloaded' });
        await page.waitForTimeout(2000);

        // Cliquer sur Continue with GitHub
        const githubBtn = page.locator('button:has-text("GitHub")').first();
        if (await githubBtn.isVisible()) {
            console.log('Clic sur GitHub...');
            await githubBtn.click();
            await page.waitForTimeout(5000);
            console.log('Attente redirection GitHub...');
            await page.waitForTimeout(10000);
        }

        url = page.url();
        console.log('Après GitHub:', url);

        // Vérifier si on est toujours sur login
        if (url.includes('github.com/login')) {
            console.log('Page GitHub OAuth détectée - connexion réussie');
            // Attendre la redirection vers le dashboard
            await page.waitForTimeout(10000);
            url = page.url();
            console.log('Après attente:', url);
        }
    }

    // Vérifier si on a accès au dashboard
    if (url.includes('sign-in') || url.includes('login')) {
        console.log('ERREUR: Pas encore connecté au dashboard');
        await browser.close();
        return;
    }

    // Attendre le chargement du contenu React
    console.log('2. Attente chargement contenu...');
    try {
        await page.waitForSelector('text=User Signups', { timeout: 15000 });
        console.log('Contenu User Signups trouvé');
    } catch(e) {
        console.log('Contenu pas encore chargé, on attend plus...');
        await page.waitForTimeout(5000);
    }

    // Lire la page pour trouver le toggle
    console.log('3. Recherche du toggle...');

    // Attendre que le contenu React soit chargé
    await page.waitForSelector('text=User Signups', { timeout: 15000 }).catch(() => {
        console.log('Timeout waiting for User Signups text');
    });

    // Lire l'état complet avec évaluation JS
    const authState = await page.evaluate(() => {
        // Chercher tous les éléments avec "User Signups"
        const allElements = document.querySelectorAll('*');
        const results = [];
        
        for (const el of allElements) {
            const text = (el.textContent || '').trim();
            if (text.toLowerCase().includes('user signups')) {
                const rect = el.getBoundingClientRect();
                // Chercher les éléments autour (parent, following sibling)
                const parent = el.parentElement;
                const parentText = parent?.textContent?.trim().substring(0, 200) || '';
                
                results.push({
                    text: text.substring(0, 100),
                    tag: el.tagName,
                    id: el.id,
                    className: (typeof el.className === 'object') ? Array.from(el.classList).join(' ') : (el.className || '').toString().substring(0, 100),
                    rect: { x: Math.round(rect.x), y: Math.round(rect.y), width: Math.round(rect.width), height: Math.round(rect.height) },
                    parentTag: parent?.tagName,
                    parentText: parentText.substring(0, 150)
                });
                
                // Si on a trouvé, on s'arrête
                break;
            }
        }
        
        return results;
    });

    console.log('Résultats User Signups:', authState.length);
    if (authState.length > 0) {
        console.log('Premier match:', JSON.stringify(authState[0], null, 2));
    }

    // Plan B: Chercher tout élément avec "signups" ou "enabled"
    const allAuthText = await page.evaluate(() => {
        const allElements = document.querySelectorAll('*');
        const results = [];
        
        for (const el of allElements) {
            const text = (el.textContent || '').trim();
            if (text.toLowerCase().includes('signups') || text.toLowerCase().includes('enabled') || text.toLowerCase().includes('disabled')) {
                const rect = el.getBoundingClientRect();
                results.push({
                    text: text.substring(0, 100),
                    tag: el.tagName,
                    className: (typeof el.className === 'object') ? Array.from(el.classList).join(' ') : (el.className || '').toString().substring(0, 100),
                    rect: { x: Math.round(rect.x), y: Math.round(rect.y), width: Math.round(rect.width), height: Math.round(rect.height) }
                });
            }
        }
        
        return results.slice(0, 20);
    });

    console.log('\nTous les éléments signups/enabled/disabled:', allAuthText.length);
    allAuthText.forEach(r => console.log('  -', r.tag, r.text.substring(0, 60), 'at', r.rect.x, r.rect.y));

    // Plan C: Cliquer sur le premier élément trouvé pour ouvrir le panel
    if (authState.length > 0) {
        const target = authState[0];
        console.log('\nClic sur User Signups text...');
        await page.click('body', { position: { x: target.rect.x + 10, y: target.rect.y + 10 } });
        await page.waitForTimeout(3000);
    }

    // Plan C: Approche alternative - aller sur la page generale Auth settings
    console.log('\n=== Plan C: Page générale Auth ===');
    await page.goto('https://supabase.com/dashboard/project/jjwzlgvpgrnyhufgbjah/auth/settings', { waitUntil: 'networkidle' });
    await page.waitForTimeout(5000);

    const settingsContent = await page.evaluate(() => {
        const elements = document.querySelectorAll('*');
        const results = [];
        
        for (const el of elements) {
            const text = (el.textContent || '').trim();
            if (text.toLowerCase().includes('signups') || text.toLowerCase().includes('enabled') || text.toLowerCase().includes('disabled')) {
                const rect = el.getBoundingClientRect();
                results.push({
                    text: text.substring(0, 100),
                    tag: el.tagName,
                    className: el.className?.toString().substring(0, 100),
                    rect: { x: rect.x, y: rect.y, width: rect.width, height: rect.height }
                });
            }
        }
        
        return results;
    });

    console.log('Résultats settings:', settingsContent.length);
    settingsContent.forEach(r => console.log('  -', r));

    await browser.close();
    console.log('\n=== COMPLET ===');
}

main().catch(e => console.log('ERREUR:', e.message));
