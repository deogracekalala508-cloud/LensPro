const { chromium } = require('playwright');

async function checkVercelBrowser() {
  console.log('Checking Vercel browser session...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    await page.goto('https://vercel.com/dashboard', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);
    const url = page.url();
    console.log('Vercel Dashboard URL:', url);
    const title = await page.title();
    console.log('Page Title:', title);
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await browser.close();
  }
}

checkVercelBrowser();
