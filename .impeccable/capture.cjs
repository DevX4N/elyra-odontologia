// Captura de revisão: desktop + mobile, página inteira e recortes por seção.
// Full-page e recortes usam prefers-reduced-motion: reduce (revelações desligadas, todas as imagens visíveis);
// o visualizador 3D é capturado à parte com movimento normal.
const { chromium } = require('C:/Estudo/Claude/brasa-47/node_modules/playwright');
const path = require('path');
const out = path.join(__dirname, 'review');
const url = process.argv[2] || 'http://localhost:4630/';

const loadAll = async (page, vh) => {
  const h = await page.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y < h; y += Math.round(vh * 0.6)) {
    await page.evaluate(y => window.scrollTo({ top: y, behavior: 'instant' }), y);
    await page.waitForTimeout(120);
  }
  await page.waitForFunction(() => [...document.images].every(i => !i.getAttribute('src') || !i.getClientRects().length || (i.complete && i.naturalWidth > 0)), null, { timeout: 30000 });
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await page.waitForTimeout(500);
  return h;
};

(async () => {
  const browser = await chromium.launch();
  const shots = [
    { name: 'desktop', viewport: { width: 1440, height: 900 } },
    { name: 'mobile', viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 }
  ];
  for (const s of shots) {
    const opts = { viewport: s.viewport, isMobile: s.isMobile, hasTouch: s.hasTouch, deviceScaleFactor: s.deviceScaleFactor || 1 };
    const errors = [];

    // 1) first viewport with real motion
    let page = await browser.newPage(opts);
    page.on('pageerror', e => errors.push(e.message));
    await page.goto(url, { waitUntil: 'networkidle' });
    await page.waitForTimeout(3400);
    await page.screenshot({ path: path.join(out, `${s.name}-viewport.png`) });
    // viewer with motion, each mode
    const v = await page.$('[data-viewer]');
    await v.scrollIntoViewIfNeeded();
    await page.waitForTimeout(2600);
    await v.screenshot({ path: path.join(out, `${s.name}-viewer-scan.png`) });
    if (s.name === 'desktop') {
      for (const m of ['plan', 'xray', 'print']) {
        await page.click(`[data-mode=${m}]`);
        await page.waitForTimeout(m === 'print' ? 2600 : 1800);
        await v.screenshot({ path: path.join(out, `viewer-${m}.png`) });
      }
    }
    await page.close();

    // 2) full page + section crops, reduced motion
    page = await browser.newPage({ ...opts, reducedMotion: 'reduce' });
    page.on('pageerror', e => errors.push(e.message));
    await page.goto(url, { waitUntil: 'networkidle' });
    const h = await loadAll(page, s.viewport.height);
    await page.screenshot({ path: path.join(out, `${s.name}.png`), fullPage: true });
    await page.evaluate(() => { document.querySelector('.skip').style.display = 'none'; document.querySelector('[data-header]').style.position = 'absolute'; });
    const ids = ['a-elyra:filosofia', 'tratamentos', 'tecnologia', 'resultados', 'especialistas', 'clinica', 'processo', 'agendar:cta', 'contato'];
    for (const pair of ids) {
      const [id, label] = pair.split(':');
      const el = await page.$('#' + id);
      await el.scrollIntoViewIfNeeded();
      await page.waitForTimeout(250);
      await el.screenshot({ path: path.join(out, `${s.name}-${label || id}.png`) });
    }
    // form success state
    await page.fill('#f-nome', 'Ana Souza');
    await page.fill('#f-whats', '11987654321');
    await page.selectOption('#f-trat', 'Clareamento Dental');
    await page.click('[data-booking] button[type=submit]');
    await page.waitForTimeout(1500);
    const cta = await page.$('#agendar');
    await cta.screenshot({ path: path.join(out, `${s.name}-cta-success.png`) });
    console.log(s.name, 'height', h, 'errors', JSON.stringify(errors));
    await page.close();
  }
  await browser.close();
})();
