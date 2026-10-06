// Mede peso transferido (carga inicial e após rolar a página inteira), LCP e CLS. Uso: node measure.cjs [rótulo]
const { chromium } = require('C:/Estudo/Claude/brasa-47/node_modules/playwright');
const label = process.argv[2] || '';
(async () => {
  const browser = await chromium.launch();
  for (const s of [{ n: 'desktop', vp: { width: 1440, height: 900 } }, { n: 'mobile', vp: { width: 390, height: 844 }, m: true }]) {
    const ctx = await browser.newContext({ viewport: s.vp, isMobile: !!s.m, hasTouch: !!s.m, deviceScaleFactor: s.m ? 3 : 1 });
    const page = await ctx.newPage();
    const cdp = await ctx.newCDPSession(page);
    await cdp.send('Network.enable');
    await cdp.send('Network.setCacheDisabled', { cacheDisabled: true });
    const bytes = {}; const types = {};
    cdp.on('Network.loadingFinished', e => { bytes[e.requestId] = e.encodedDataLength; });
    cdp.on('Network.responseReceived', e => { types[e.requestId] = { url: e.response.url, type: e.type }; });
    await page.addInitScript(() => {
      window.__lcp = 0; window.__cls = 0;
      new PerformanceObserver(l => { for (const e of l.getEntries()) window.__lcp = e.startTime; }).observe({ type: 'largest-contentful-paint', buffered: true });
      new PerformanceObserver(l => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__cls += e.value; }).observe({ type: 'layout-shift', buffered: true });
    });
    await page.goto('http://localhost:4630/', { waitUntil: 'load' });
    await page.waitForTimeout(2500);
    const sum = f => Object.entries(bytes).filter(([id]) => f(types[id] || {})).reduce((a, [, b]) => a + b, 0);
    const kb = n => Math.round(n / 1024) + ' KB';
    const initial = { total: sum(() => true), img: sum(t => t.type === 'Image') };
    const initialImgs = Object.keys(bytes).filter(id => (types[id] || {}).type === 'Image').length;
    const lcp = await page.evaluate(() => Math.round(window.__lcp));
    const h = await page.evaluate(() => document.body.scrollHeight);
    for (let y = 0; y < h; y += 500) { await page.evaluate(y => scrollTo(0, y), y); await page.waitForTimeout(150); }
    await page.waitForTimeout(1500);
    const full = { total: sum(() => true), img: sum(t => t.type === 'Image') };
    const cls = await page.evaluate(() => window.__cls.toFixed(3));
    const imgs = Object.entries(bytes).filter(([id]) => (types[id] || {}).type === 'Image').map(([id, b]) => [types[id].url.split('/').pop(), b]).sort((a, b) => b[1] - a[1]);
    console.log(`${label} ${s.n}: inicial ${kb(initial.total)} (imagens ${kb(initial.img)}, ${initialImgs} arquivos) | página toda ${kb(full.total)} (imagens ${kb(full.img)}, ${imgs.length} arquivos) | LCP ${lcp} ms | CLS ${cls}`);
    console.log('   maiores:', imgs.slice(0, 6).map(([u, b]) => `${u} ${Math.round(b / 1024)}K`).join(', '));
    await ctx.close();
  }
  await browser.close();
})();
