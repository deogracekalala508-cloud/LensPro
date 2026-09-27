const { chromium } = require('playwright');

const EMAIL = 'test_debug_' + Date.now() + '@lenspro.test';
const PASSWORD = 'TestLensPro2026!';

async function run() {
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();

    const consoleMsgs = [];
    page.on('console', msg => {
        const t = msg.text();
        consoleMsgs.push(t);
        console.log('CONSOLE:', t);
    })...[truncated]