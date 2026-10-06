import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { chromium } = require('C:/Users/FTM-NB/AppData/Roaming/npm/node_modules/openclaw/node_modules/playwright-core');
const browser = await chromium.launch({
  headless: true,
  executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  args: ['--autoplay-policy=no-user-gesture-required', '--disable-gpu']
});
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
page.on('console', message => console.log('browser:', message.text()));
await page.goto('http://127.0.0.1:8788/compress.html');
for (let i = 0; i < 1800; i++) {
  const done = await page.evaluate(() => window.done);
  if (i % 10 === 0) console.log(await page.locator('#status').textContent());
  if (done === true || done === 'error') break;
  await new Promise(resolve => setTimeout(resolve, 1000));
}
console.log(await page.locator('#status').textContent());
await browser.close();
