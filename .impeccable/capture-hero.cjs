// Primeira dobra em vários tamanhos de tela, com movimento normal.
const { chromium } = require('C:/Estudo/Claude/brasa-47/node_modules/playwright');
const path = require('path');
const out = path.join(__dirname, 'review');
const sizes = [[1753, 930], [1366, 768], [1440, 900], [1920, 1080], [2560, 1440], [1024, 768], [390, 844]];
(async () => {
  const browser = await chromium.launch();
  for (const [w, h] of sizes) {
    const mobile = w < 600;
    const page = await browser.newPage({ viewport: { width: w, height: h }, isMobile: mobile, hasTouch: mobile, deviceScaleFactor: mobile ? 2 : 1 });
    const errors = []; page.on('pageerror', e => errors.push(e.message));
    await page.goto('http://localhost:4630/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(3600);
    await page.screenshot({ path: path.join(out, `hero-${w}x${h}.png`), fullPage: mobile });
    const m = await page.evaluate(() => {
      const t = document.querySelector('.hero__title'), c = document.querySelector('.hero__copy');
      const lines = [...t.querySelectorAll('.line > span')].map(s => Math.round(s.getBoundingClientRect().right));
      return { font: getComputedStyle(t).fontSize, copyRight: Math.round(c.getBoundingClientRect().right), lines, heroH: document.querySelector('.hero').offsetHeight, eyebrowTop: Math.round(document.querySelector('.hero .annot').getBoundingClientRect().top) };
    });
    console.log(w, h, JSON.stringify(m), errors.length ? errors : '');
    await page.close();
  }
  await browser.close();
})();
