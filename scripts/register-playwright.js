const { chromium } = require('playwright');

const EMAIL = 'test_playwright_' + Date.now() + '@lenspro.test';
const PASSWORD = 'TestLensPro2026!';
const USERNAME = 'photographe_playwright';
const FULLNAME = 'Photographe Test Playwright';
const CITY = 'Kinshasa';
const SPECIALTY = 'Mariage';

async function run() {
    console.log('=== PARCOURS INSCRIPTION PLAYWRIGHT ===');
    console.log('Email:', EMAIL);

    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    
    // Navigation vers l'inscription
    console.log('\n1. Navigation vers /auth/register');
    await page.goto('https://lenspro.vercel.app/auth/register', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    
    // Remplir étape 1
    console.log('2. Remplir étape 1 (Informations personnelles)');
    await page.fill('input[name="fullName"]', FULLNAME);
    await page.fill('input[name="email"]', EMAIL);
    await page.fill('input[name="password"]', PASSWORD);
    await page.fill('input[name="confirmPassword"]', PASSWORD);
    
    // Cliquer Suivant
    console.log('3. Cliquer Suivant (étape 1 → 2)');
    await page.click('button.btn-next');
    await page.waitForTimeout(2000);
    
    // Remplir étape 2
    console.log('4. Remplir étape 2 (Détails du profil)');
    await page.fill('input[name="username"]', USERNAME);
    await page.fill('input[name="city"]', CITY);
    await page.selectOption('select[name="specialty"]', SPECIALTY);
    
    // Cliquer Suivant
    console.log('5. Cliquer Suivant (étape 2 → 3)');
    await page.click('button.btn-next');
    await page.waitForTimeout(2000);
    
    // Cocher conditions
    console.log('6. Cocher les conditions');
    await page.check('input[type="checkbox"]');
    
    // Cliquer Créer mon compte
    console.log('7. Cliquer Créer mon compte');
    await page.click('button.btn-submit');
    
    // Attendre la redirection
    console.log('8. Attendre la redirection...');
    await page.waitForURL('**/dashboard**', { timeout: 15000 }).catch(() => {
        console.log('ATTENTION: Pas de redirection vers /dashboard');
    });
    
    const finalUrl = page.url();
    console.log('\n=== RÉSULTAT ===');
    console.log('URL finale:', finalUrl);
    console.log('Titre:', await page.title());
    
    const content = await page.evaluate(() => document.body.innerText.slice(0, 2000));
    console.log('Contenu page:', content.slice(0, 500));
    
    // Vérifier localStorage
    const localUser = await page.evaluate(() => localStorage.getItem('lenspro_user'));
    console.log('localStorage user:', localUser ? 'PRESENT' : 'ABSENT');
    
    await browser.close();
    
    if (finalUrl.includes('/dashboard')) {
        console.log('\n✅ INSCRIPTION RÉUSSIE — Redirection vers dashboard');
        return { success: true, email, userId: localUser ? JSON.parse(localUser).id : null };
    } else {
        console.log('\n❌ INSCRIPTION ÉCHOUÉE — Pas de redirection');
        return { success: false, email, url: finalUrl };
    }
}

run().then(result => {
    console.log('\n=== FIN ===');
    console.log(JSON.stringify(result, null, 2));
    process.exit(result.success ? 0 : 1);
}).catch(err => {
    console.error('FATAL:', err.message);
    process.exit(1);
});
