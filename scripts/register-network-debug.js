const { chromium } = require('playwright');

const EMAIL_BASE = 'test_net_' + Date.now();
const PASSWORD = 'TestLensPro2026!';

async function run() {
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();

    // Écouter les requêtes réseau
    const netRequests = [];
    page.on('request', req => {
        if (req.url().includes('/auth') || req.url().includes('/api')) {
            netRequests.push({ url: req.url(), method: req.method(), resourceType: req.resourceType() })...[truncated]