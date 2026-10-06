// Rola a página como um visitante (movimento normal) e tira um print por tela, para achar áreas vazias.
const { chromium } = require('C:/Estudo/Claude/brasa-47/node_modules/playwright');
const path = require('path');
const out = path.join(__dirname, 'review', 'scroll');
const w = +(process.argv[2] || 1753), h = +(process.argv[3] || 930);
(async () => {
  require('fs').mkdirSync(out, { recursive: true });
  const browser = await chromium.launch();
  const mob = w < 600; const page = await browser.newPage({ viewport: { width: w, height: h }, isMobile: mob, hasTouch: mob });
  await page.goto('http://localhost:4630/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);
  const total = await page.evaluate(() => document.body.scrollHeight);
  let i = 0;
  for (let y = 0; y < total; y += Math.round(h * 0.8)) {
    await page.mouse.wheel(0, i ? Math.round(h * 0.8) : 0);
    await page.waitForTimeout(1600);
    await page.screenshot({ path: path.join(out, `${w}-${String(i).padStart(2, '0')}.png`) });
    i++;
  }
  console.log('shots', i, 'height', total);
  await browser.close();
})();
