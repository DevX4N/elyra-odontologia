// polish: varredura por largura — erros, 404, overflow horizontal, imagens, texto miúdo, CLS, alvos de toque.
const { chromium } = require('C:/Estudo/Claude/brasa-47/node_modules/playwright');
(async () => {
  const browser = await chromium.launch();
  for (const w of [1920, 1440, 1024, 768, 390, 320]) {
    const mob = w < 600;
    const page = await browser.newPage({ viewport: { width: w, height: mob ? 760 : 900 }, isMobile: mob, hasTouch: mob });
    const errs = [], bad = [];
    page.on('console', m => { if (['error', 'warning'].includes(m.type())) errs.push(m.type() + ': ' + m.text()); });
    page.on('pageerror', e => errs.push('pageerror: ' + e.message));
    page.on('response', r => { if (r.status() >= 400) bad.push(r.status() + ' ' + r.url()); });
    await page.addInitScript(() => { window.__cls = 0; new PerformanceObserver(l => l.getEntries().forEach(e => { if (!e.hadRecentInput) window.__cls += e.value; })).observe({ type: 'layout-shift', buffered: true }); });
    await page.goto('http://localhost:4630/', { waitUntil: 'networkidle' });
    // scroll through the page so lazy images and reveals fire
    const H = await page.evaluate(() => document.body.scrollHeight);
    for (let y = 0; y < H; y += 500) { await page.evaluate(y => window.scrollTo(0, y), y); await page.waitForTimeout(120); }
    await page.waitForTimeout(1200);
    const r = await page.evaluate(() => {
      const vw = document.documentElement.clientWidth, out = {};
      out.scrollW = document.documentElement.scrollWidth - vw;
      out.wide = [...document.querySelectorAll('body *')].filter(e => { const b = e.getBoundingClientRect(); if (!b.width) return false; const s = getComputedStyle(e); if (s.position === 'fixed') return false; let p = e.parentElement; while (p && p !== document.body) { const ps = getComputedStyle(p); if (/(hidden|clip|auto|scroll)/.test(ps.overflowX)) return false; p = p.parentElement; } return b.right > vw + 1 || b.left < -1; }).slice(0, 6).map(e => e.tagName + '.' + [...e.classList].join('.'));
      out.imgs = [...document.images].filter(i => !i.complete || !i.naturalWidth).map(i => i.currentSrc || i.src);
      out.small = [...new Set([...document.querySelectorAll('body *')].filter(e => { if (!e.childNodes.length || ![...e.childNodes].some(n => n.nodeType === 3 && n.textContent.trim())) return false; const s = getComputedStyle(e); const b = e.getBoundingClientRect(); return b.width && s.visibility !== 'hidden' && s.display !== 'none' && parseFloat(s.fontSize) < 11.5 && !e.closest('svg'); }).map(e => e.tagName.toLowerCase() + '.' + ([...e.classList][0] || e.parentElement.classList[0]) + ' ' + getComputedStyle(e).fontSize))].slice(0, 12);
      out.targets = [...document.querySelectorAll('a,button,input,select,[role=tab]')].filter(e => { const b = e.getBoundingClientRect(); const s = getComputedStyle(e); return b.width && s.visibility !== 'hidden' && e.type !== 'hidden' && !e.closest('[hidden],[inert]') && (b.height < 24 || b.width < 24) && e.type !== 'radio' && !e.classList.contains('compare__range'); }).map(e => (e.className || e.tagName) + ' ' + Math.round(e.getBoundingClientRect().width) + '×' + Math.round(e.getBoundingClientRect().height)).slice(0, 8);
      out.fonts = [...document.fonts].filter(f => f.status === 'loaded').map(f => f.family + f.weight + f.style).join(',');
      out.cls = +window.__cls.toFixed(4);
      return out;
    });
    console.log(`\n== ${w}px  H=${H}`, JSON.stringify(r, null, 0));
    if (errs.length) console.log('  console:', errs.slice(0, 8));
    if (bad.length) console.log('  http:', bad);
    await page.close();
  }
  await browser.close();
})();
