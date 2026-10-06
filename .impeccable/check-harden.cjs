// harden: axe (WCAG A/AA), teclado, pausa dos depoimentos, abas, formulário extremo, menu e fail-safe sem JS.
const { chromium } = require('C:/Estudo/Claude/brasa-47/node_modules/playwright');
const axePath = 'C:/Estudo/Claude/thwash-landing/node_modules/axe-core/axe.min.js';
const path = require('path');
const out = path.join(__dirname, 'review');
(async () => {
  const browser = await chromium.launch();
  const log = (...a) => console.log(...a);
  for (const vp of [{ width: 1440, height: 900 }, { width: 390, height: 844, m: 1 }]) {
    const page = await browser.newPage({ viewport: vp, isMobile: !!vp.m, hasTouch: !!vp.m, reducedMotion: 'reduce' });
    const errors = []; page.on('pageerror', e => errors.push(e.message));
    await page.goto('http://localhost:4630/', { waitUntil: 'networkidle' });
    await page.addScriptTag({ path: axePath });
    const r = await page.evaluate(async () => (await axe.run(document, { runOnly: ['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'] })).violations.map(v => `${v.id} (${v.impact}) ×${v.nodes.length}: ${v.nodes.slice(0, 3).map(n => n.target.join(' ')).join(' | ')}`));
    log(`AXE ${vp.width}:`, r.length ? '\n  ' + r.join('\n  ') : 'nenhuma violação', errors.length ? errors : '');
    await page.close();
  }
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('http://localhost:4630/', { waitUntil: 'networkidle' });
  // testimonials pause
  await page.evaluate(() => document.querySelector('#depoimentos').scrollIntoView({ behavior: 'instant' }));
  await page.waitForTimeout(800);
  await page.click('[data-voice-toggle]');
  const t1 = await page.evaluate(() => [document.querySelector('[data-voice-toggle]').getAttribute('aria-pressed'), document.querySelector('[data-voice-i]').textContent, document.querySelector('[data-voice-count]').getAttribute('aria-live')]);
  await page.waitForTimeout(7600);
  const t2 = await page.evaluate(() => document.querySelector('[data-voice-i]').textContent);
  log('Depoimentos: pausado =', t1[0], '| slide', t1[1], '→ após 7,6 s', t2, '| aria-live', t1[2]);
  // case tabs via keyboard
  await page.focus('#case-0'); await page.keyboard.press('ArrowRight'); await page.waitForTimeout(600);
  log('Casos (seta →):', await page.evaluate(() => [document.activeElement.id, document.querySelector('#compare-panel').getAttribute('aria-labelledby'), document.querySelector('#case-1').tabIndex]));
  await page.focus('#tab-scan'); await page.keyboard.press('ArrowRight'); await page.waitForTimeout(300);
  log('Tecnologia (seta →):', await page.evaluate(() => [document.activeElement.id, document.querySelector('#viewer-panel').getAttribute('aria-labelledby')]));
  // focus ring colour on paper vs dark
  log('Anel de foco:', await page.evaluate(() => { const a = document.querySelector('.hero .btn'); a.focus(); const c1 = getComputedStyle(a, null).outlineColor; const b = document.querySelector('.cta .btn'); return [c1, getComputedStyle(b).outlineColor]; }));
  // extreme form input
  await page.fill('#f-nome', 'Maria Eduarda de Albuquerque Cavalcanti Figueiredo 😊 Ñandú-Øster');
  await page.fill('#f-whats', '81912345678');
  await page.selectOption('#f-trat', 'Ainda não sei');
  await page.click('[data-booking] button[type=submit]'); await page.click('[data-booking] button[type=submit]').catch(() => {});
  await page.waitForTimeout(1500);
  log('Sucesso:', await page.evaluate(() => document.querySelector('[data-booking-echo]').textContent), '| nome guardado com', await page.evaluate(() => document.querySelector('#f-nome').value.length), 'caracteres');
  // invalid
  await page.click('[data-booking-reset]');
  await page.fill('#f-nome', '   '); await page.fill('#f-whats', '123');
  await page.click('[data-booking] button[type=submit]'); await page.waitForTimeout(200);
  log('Erros:', await page.evaluate(() => [...document.querySelectorAll('.field__err')].map(e => e.textContent).filter(Boolean)), '| foco em', await page.evaluate(() => document.activeElement.id));
  await page.close();
  // mobile menu inert
  const m = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  await m.goto('http://localhost:4630/', { waitUntil: 'networkidle' });
  await m.click('[data-menu-toggle]'); await m.waitForTimeout(500);
  log('Menu aberto: main inert =', await m.evaluate(() => document.querySelector('main').inert), '| foco em', await m.evaluate(() => document.activeElement.textContent.trim()));
  await m.keyboard.press('Escape'); await m.waitForTimeout(200);
  log('Esc: main inert =', await m.evaluate(() => document.querySelector('main').inert), '| foco em', await m.evaluate(() => document.activeElement.className));
  await m.close();
  // scripts blocked
  const n = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await n.route('**/*.js', r => r.abort());
  await n.goto('http://localhost:4630/', { waitUntil: 'load' });
  await n.waitForTimeout(4500);
  log('Sem JS: classe js =', await n.evaluate(() => document.documentElement.classList.contains('js')), '| opacidade do título da filosofia =', await n.evaluate(() => getComputedStyle(document.querySelector('#philo-title')).opacity));
  await n.evaluate(() => document.querySelector('#clinica').scrollIntoView());
  await n.waitForTimeout(800);
  await n.screenshot({ path: path.join(out, 'hd-nojs.png') });
  await browser.close();
})();
