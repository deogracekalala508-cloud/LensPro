const { chromium } = require('playwright');

const EMAIL = 'test_console_' + Date.now() + '@lenspro.test';
const PASSWORD = 'TestLensPro2026!';

async function run() {
    console.log('=== CAPTURE CONSOLE INSCRIPTION ===');
    console.log('Email:', EMAIL);

    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    
    // Capturer les logs console
    const consoleLogs = [];
    page.on('console', msg => {
        consoleLogs.push({ type: msg.type(), text: msg.text() });
    });
    
    // Capturer les erreurs page
    page.on('pageerror', err => {
        consoleLogs.push({ type: 'PAGE_ERROR', text: err.message });
    });
    
    // Navigation vers l'inscription
    console.log('\n1. Navigation vers /auth/register');
    await page.goto('https://lenspro.vercel.app/auth/register', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    
    // Remplir étape 1
    console.log('2. Remplir étape 1');
    await page.fill('input[name="fullName"]', 'Photographe Test Console');
    await page.fill('input[name="email"]', EMAIL);
    await page.fill('input[name="password"]', PASSWORD);
    await page.fill('input[name="confirmPassword"]', PASSWORD);
    
    // Cliquer Suivant
    console.log('3. Cliquer Suivant 1→2');
    await page.click('button.btn-next');
    await page.waitForTimeout(2000);
    
    // Remplir étape 2
    console.log('4. Remplir étape 2');
    await page.fill('input[name="username"]', 'photographe_console');
    await page.fill('input[name="city"]', 'Kinshasa');
    await page.selectOption('select[name="specialty"]', 'Mariage');
    
    // Cliquer Suivant
    console.log('5. Cliquer Suivant 2→3');
    await page.click('button.btn-next');
    await page.waitForTimeout(2000);
    
    // Vérifier l'état du formulaire avant submit
    const formState = await page.evaluate(() => {
        const inputs = document.querySelectorAll('input');
        const values = {};
        inputs.forEach(i => { if (i.name) values[i.name] = i.value; });
        return {
            inputs: Object.keys(values).length,
            values,
            hasSupabase: typeof window !== 'undefined' ? true : false
        };
    });
    console.log('\nÉtat formulaire avant submit:', JSON.stringify(formState, null, 2));
    
    // Cliquer "Créer mon compte"
    console.log('\n6. Cliquer Créer mon compte');
    await page.click('button.btn-submit');
    
    // Attendre 5 secondes et capturer les erreurs
    await page.waitForTimeout(5000);
    
    console.log('\n=== LOGS CONSOLE ===');
    for (const log of consoleLogs) {
        if (log.type === 'error' || log.type === 'PAGE_ERROR') {
            console.log(`\n[${log.type}] ${log.text}`);
        }
    }
    console.log(`\nTotal logs: ${consoleLogs.length}`);
    
    // Vérifier l'URL finale
    const finalUrl = page.url();
    console.log('\nURL finale:', finalUrl);
    
    // Vérifier localStorage
    const localUser = await page.evaluate(() => localStorage.getItem('lenspro_user'));
    console.log('localStorage user:', localUser ? 'PRESENT' : 'ABSENT');
    
    await browser.close();
    
    return { url: finalUrl, localStoragePresent: !!localUser, errors: consoleLogs.filter(l => l.type === 'error' || l.type === 'PAGE_ERROR') };
}

run().then(result => {
    console.log('\n=== RÉSULTAT FINAL ===');
    console.log('URL:', result.url);
    console.log('localStorage:', result.localStoragePresent ? 'PRESENT' : 'ABSENT');
    console.log('Erreurs:', result.errors.length);
    for (const e of result.errors) {
        console.log('  -', e.text.slice(0, 200));
    }
    process.exit(0);
}).catch(err => {
    console.error('FATAL:', err.message);
    process.exit(1);
});
