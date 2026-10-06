// Captura do passo clarify: tratamentos, equipe, CTA com pré-seleção, preferência de especialista e sucesso.
const { chromium } = require('C:/Estudo/Claude/brasa-47/node_modules/playwright');
const path = require('path');
const out = path.join(__dirname, 'review');
(async () => {
  const browser = await chromium.launch();
  const sizes = [
    { name: 'desktop', viewport: { width: 1440, height: 900 } },
    { name: 'mobile', viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 }
  ];
  for (const s of sizes) {
    const page = await browser.newPage({ viewport: s.viewport, isMobile: s.isMobile, hasTouch: s.hasTouch, deviceScaleFactor: s.deviceScaleFactor || 1, reducedMotion: 'reduce' });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.goto('http://localhost:4630/', { waitUntil: 'networkidle' });
    await page.evaluate(() => { document.querySelector('.skip').style.display = 'none'; });
    const shot = async (sel, name) => { const el = await page.$(sel); await el.scrollIntoViewIfNeeded(); await page.waitForTimeout(400); await el.screenshot({ path: path.join(out, `cl-${s.name}-${name}.png`) }); };
    await shot('#tratamentos', 'treat');
    await shot('#especialistas', 'team');
    // treatment link -> form
    await page.click('[data-treatment="Clareamento Dental"]');
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(out, `cl-${s.name}-landing.png`) });
    // specialist link -> form
    await (await page.$('[data-doctor="Dra. Helena Martins"]')).scrollIntoViewIfNeeded();
    await page.click('[data-doctor="Dra. Helena Martins"]');
    await page.waitForTimeout(600);
    await page.evaluate(() => { document.querySelector('[data-header]').style.position = 'absolute'; });
    await shot('#agendar', 'cta');
    await page.fill('#f-nome', 'Ana Souza');
    await page.fill('#f-whats', '11987654321');
    await page.check('input[value="Tarde"]', { force: true });
    await page.click('[data-booking] button[type=submit]');
    await page.waitForTimeout(1500);
    await shot('#agendar', 'success');
    console.log(s.name, JSON.stringify(errors));
    await page.close();
  }
  await browser.close();
})();
