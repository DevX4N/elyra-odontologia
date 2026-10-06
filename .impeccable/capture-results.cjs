// Captura focada na seção Resultados: 3 casos × desktop / tablet / mobile, com a alça em 15% (plano quase todo visível).
const { chromium } = require('C:/Estudo/Claude/brasa-47/node_modules/playwright');
const path = require('path');
const out = path.join(__dirname, 'review');
(async () => {
  const browser = await chromium.launch();
  const sizes = [
    { name: 'desktop', viewport: { width: 1440, height: 900 } },
    { name: 'tablet', viewport: { width: 820, height: 1180 } },
    { name: 'mobile', viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 }
  ];
  for (const s of sizes) {
    const page = await browser.newPage({ viewport: s.viewport, isMobile: s.isMobile, hasTouch: s.hasTouch, deviceScaleFactor: s.deviceScaleFactor || 1, reducedMotion: 'reduce' });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.goto('http://localhost:4630/#resultados', { waitUntil: 'networkidle' });
    await page.evaluate(() => { document.querySelector('.skip').style.display = 'none'; document.querySelector('[data-header]').style.position = 'absolute'; });
    const sec = await page.$('#resultados');
    for (let i = 0; i < 3; i++) {
      if (i) { await page.click(`[data-case="${i}"]`); }
      await page.waitForTimeout(900);
      await page.evaluate(() => { const c = document.querySelector('[data-compare]'); c.style.setProperty('--pos', '12%'); });
      await page.waitForTimeout(200);
      await sec.screenshot({ path: path.join(out, `res-${s.name}-${i + 1}.png`) });
    }
    await page.evaluate(() => document.querySelector('[data-compare]').style.setProperty('--pos', '50%'));
    await page.click('[data-case="0"]'); await page.waitForTimeout(900);
    await (await page.$('[data-compare]')).screenshot({ path: path.join(out, `res-${s.name}-half.png`) });
    console.log(s.name, JSON.stringify(errors));
    await page.close();
  }
  await browser.close();
})();
