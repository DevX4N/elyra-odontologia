// adapt: alvos de toque < 44px no celular + capturas de tecnologia, equipe, mapa e posição do botão do WhatsApp.
const { chromium } = require('C:/Estudo/Claude/brasa-47/node_modules/playwright');
const path = require('path');
const out = path.join(__dirname, 'review');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
  const errors = []; page.on('pageerror', e => errors.push(e.message));
  await page.goto('http://localhost:4630/', { waitUntil: 'networkidle' });
  const small = await page.evaluate(() => [...document.querySelectorAll('a, button, input:not([type=hidden]), select, .choice label')].filter(el => {
    const r = el.getBoundingClientRect(); if (!r.width || getComputedStyle(el).visibility === 'hidden') return false;
    if (el.closest('.menu-mobile') || el.type === 'radio' || el.classList.contains('skip') || el.classList.contains('compare__range')) return false;
    return r.height < 44 || r.width < 44;
  }).map(el => `${el.tagName.toLowerCase()}.${[...el.classList].join('.')} "${(el.textContent || el.getAttribute('aria-label') || '').trim().slice(0, 28)}" ${Math.round(el.getBoundingClientRect().width)}x${Math.round(el.getBoundingClientRect().height)}`));
  console.log('ALVOS < 44px:\n ' + small.join('\n '));
  const at = async (sel, name, block = 'center') => {
    await page.evaluate(([s, b]) => document.querySelector(s).scrollIntoView({ block: b, behavior: 'instant' }), [sel, block]);
    await page.waitForTimeout(1400);
    await page.screenshot({ path: path.join(out, `ad-${name}.png`) });
  };
  await at('.tech__modes', 'tech');
  await page.evaluate(() => document.querySelector('[data-team]').scrollTo({ left: 400, behavior: 'instant' }));
  await at('.team__pager', 'team', 'end');
  await at('[data-compare]', 'compare', 'end');
  await at('[data-booking]', 'form', 'end');
  await at('.map', 'map', 'end');
  await at('.footer__bottom', 'footer', 'end');
  const wa = await page.evaluate(() => document.querySelector('.wa-float').className);
  console.log('wa no rodapé:', wa, 'erros:', JSON.stringify(errors));
  await browser.close();
})();
