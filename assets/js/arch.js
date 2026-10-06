/* Elyra — Estúdio digital: arcada superior procedural em nuvem de pontos.
   Modos: scan (escaneamento), plan (planejamento), xray (radiografia), print (impressão 3D). */
(() => {
  const canvas = document.querySelector('[data-arch]');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hud = {
    mode: document.querySelector('[data-hud="mode"]'),
    points: document.querySelector('[data-hud="points"]'),
    progress: document.querySelector('[data-hud="progress"]'),
    bar: document.querySelector('[data-hud="bar"]')
  };
  const tabs = [...document.querySelectorAll('[data-mode]')];
  const MODES = { scan: 'Escaneamento 3D', plan: 'Planejamento do sorriso', xray: 'Radiografia digital', print: 'Impressão 3D' };

  /* ---- Seeded random for a stable model ---- */
  let seed = 7;
  const rnd = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
  const gauss = () => { let u = 0, v = 0; while (!u) u = rnd(); while (!v) v = rnd(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); };

  /* ---- Arch curve (mm), right half from midline ---- */
  const ctrl = [[0, 0], [9, 2.2], [16, 7.2], [20.4, 14], [23.2, 22], [25.6, 32], [27, 44]];
  const dense = [];
  for (let i = 0; i < ctrl.length - 1; i++) {
    const [a, b] = [ctrl[i], ctrl[i + 1]];
    const p0 = ctrl[Math.max(0, i - 1)], p3 = ctrl[Math.min(ctrl.length - 1, i + 2)];
    for (let t = 0; t < 1; t += 0.02) {
      const t2 = t * t, t3 = t2 * t;
      const f = (k) => 0.5 * ((2 * a[k]) + (-p0[k] + b[k]) * t + (2 * p0[k] - 5 * a[k] + 4 * b[k] - p3[k]) * t2 + (-p0[k] + 3 * a[k] - 3 * b[k] + p3[k]) * t3);
      dense.push([f(0), f(1)]);
    }
  }
  dense.push(ctrl[ctrl.length - 1]);
  const cum = [0];
  for (let i = 1; i < dense.length; i++) cum.push(cum[i - 1] + Math.hypot(dense[i][0] - dense[i - 1][0], dense[i][1] - dense[i - 1][1]));
  const at = s => {
    let i = cum.findIndex(c => c >= s); if (i <= 0) i = 1; if (i < 0) i = dense.length - 1;
    const k = (s - cum[i - 1]) / (cum[i] - cum[i - 1] || 1);
    const x = dense[i - 1][0] + (dense[i][0] - dense[i - 1][0]) * k;
    const z = dense[i - 1][1] + (dense[i][1] - dense[i - 1][1]) * k;
    let tx = dense[i][0] - dense[i - 1][0], tz = dense[i][1] - dense[i - 1][1];
    const l = Math.hypot(tx, tz) || 1; tx /= l; tz /= l;
    return { x, z, tx, tz, nx: tz, nz: -tx };
  };

  /* ---- Teeth spec: width (mesio-distal), depth (bucco-lingual), crown height, root length ---- */
  const spec = [
    { w: 8.6, d: 7.0, h: 10.6, r: 13, t: 'inc' },
    { w: 6.6, d: 6.2, h: 9.0, r: 13, t: 'inc' },
    { w: 7.6, d: 8.0, h: 10.0, r: 17, t: 'can' },
    { w: 7.0, d: 9.0, h: 8.4, r: 14, t: 'pm' },
    { w: 6.6, d: 9.0, h: 7.8, r: 14, t: 'pm' },
    { w: 10.2, d: 11.0, h: 7.4, r: 12, t: 'mol' },
    { w: 9.2, d: 10.4, h: 7.0, r: 12, t: 'mol' }
  ];
  const pts = []; // [x, y, z, kind(0 crown,1 root,2 gum), tooth]
  const markers = [];
  let s = 0.4;
  spec.forEach((sp, ti) => {
    const c = at(s + sp.w / 2);
    if (ti === 0) markers.push({ s0: at(0.4), s1: at(s + sp.w) , w: sp.w });
    s += sp.w + 0.35;
    for (const side of [1, -1]) {
      const crownN = Math.round(560 * (sp.w * sp.d) / 70);
      for (let i = 0; i < crownN; i++) {
        let gx = gauss(), gy = gauss(), gz = gauss();
        const l = Math.hypot(gx, gy, gz); gx /= l; gy /= l; gz /= l;
        const sh = v => Math.sign(v) * Math.pow(Math.abs(v), 0.62);
        let a = sh(gx) * sp.w / 2;       // along tangent
        let b = sh(gz) * sp.d / 2;       // along normal
        let v = (sh(gy) * 0.5 + 0.5);    // 0 = incisal/occlusal, 1 = cervical
        if (sp.t === 'inc') b *= 0.28 + 0.72 * Math.pow(v, 0.7);
        if (sp.t === 'can') { b *= 0.45 + 0.55 * v; a *= 0.6 + 0.4 * Math.pow(v, 0.5); }
        if (sp.t === 'pm' || sp.t === 'mol') { if (v < 0.12) v += 0.05 * Math.cos(a * 1.4) * Math.cos(b * 1.3); }
        a *= 0.82 + 0.18 * Math.sin(v * Math.PI);
        const y = -(sp.h) + v * sp.h;   // teeth hang down: occlusal at -h, cervical at 0
        const x = c.x + c.tx * a + c.nx * b;
        const z = c.z + c.tz * a + c.nz * b;
        pts.push([x * side, y, z, 0, ti]);
      }
      const rootN = Math.round(sp.r * 16);
      for (let i = 0; i < rootN; i++) {
        const v = rnd();
        const ang = rnd() * Math.PI * 2;
        const rad = (1 - v * 0.85);
        const a = Math.cos(ang) * sp.w * 0.32 * rad;
        const b = Math.sin(ang) * sp.d * 0.3 * rad;
        const y = v * sp.r;
        const x = c.x + c.tx * a + c.nx * b;
        const z = c.z + c.tz * a + c.nz * b;
        pts.push([x * side, y, z, 1, ti]);
      }
    }
  });
  // gingiva band
  const total = s;
  for (let i = 0; i < 3600; i++) {
    const ss = rnd() * total;
    const c = at(ss);
    const side = rnd() < 0.5 ? 1 : -1;
    const outer = rnd() < 0.62 ? 1 : -1;
    const off = outer * (4.6 + rnd() * 1.6) + gauss() * 0.4;
    const y = -1.6 + rnd() * 6;
    pts.push([(c.x + c.nx * off) * side, y + Math.abs(off) * 0.12, c.z + c.nz * off, 2, -1]);
  }

  // bounds
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity, minZ = Infinity, maxZ = -Infinity;
  pts.forEach(p => { minX = Math.min(minX, p[0]); maxX = Math.max(maxX, p[0]); minY = Math.min(minY, p[1]); maxY = Math.max(maxY, p[1]); minZ = Math.min(minZ, p[2]); maxZ = Math.max(maxZ, p[2]); });
  const cx = 0, cy = -3, cz = (minZ + maxZ) / 2;
  const crownMinY = -11, crownMaxY = 6;
  pts.forEach(p => {
    p.push((p[0] - minX) / (maxX - minX));          // [5] x-norm (scan sweep)
    p.push(1 - (p[1] - crownMinY) / (crownMaxY - crownMinY)); // [6] build order for print (cervical first? no: top to bottom)
  });
  const crownCount = pts.filter(p => p[3] !== 1).length;

  /* ---- Sizing ---- */
  let W = 0, H = 0, dpr = 1;
  const resize = () => {
    const r = canvas.getBoundingClientRect();
    dpr = Math.min(2, devicePixelRatio || 1);
    W = r.width; H = r.height;
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    draw(performance.now(), true);
    draw(performance.now(), true); // second pass uses the measured centring
  };

  /* ---- State ---- */
  let mode = 'scan';
  let fitX = 0, fitY = 0, fitS = 1;
  // Frame the arch inside the area the HUD leaves free (top readouts, bottom progress bar)
  const SAFE = { top: 70, bottom: 76, side: 28 };
  let modeT0 = performance.now();
  let yaw = -0.5, yawVel = 0, dragging = false, lastX = 0, userTouched = false;
  const pitch = 1.02;

  const project = (x, y, z, cy_, sy_, cp, sp_) => {
    x -= cx; y -= cy; z -= cz;
    // yaw around Y
    const x1 = x * cy_ + z * sy_;
    const z1 = -x * sy_ + z * cy_;
    // pitch around X
    const y2 = y * cp - z1 * sp_;
    const z2 = y * sp_ + z1 * cp;
    const f = 190;
    const k = f / (f + z2);
    return [x1 * k, y2 * k, z2];
  };

  const COL = {
    paper: [237, 230, 218],
    gold: [214, 184, 140],
    xr: [226, 236, 232]
  };

  const buckets = [];
  const reset = () => { for (let i = 0; i < 12; i++) buckets[i] = []; };

  function draw(now, force) {
    if (!W) return;
    const el = (now - modeT0) / 1000;
    if (!dragging && !reduce) { yaw += yawVel; yawVel *= 0.94; if (Math.abs(yawVel) < 0.0004) yaw += 0.0018; }
    const sc = Math.min(W, H * 1.5) / (W < 520 ? 80 : 88) * fitS;
    const ox = W / 2 + fitX, oy = H * 0.5 + fitY;
    let bx0 = Infinity, bx1 = -Infinity, by0 = Infinity, by1 = -Infinity;
    const cyw = Math.cos(yaw), syw = Math.sin(yaw), cp = Math.cos(pitch), spt = Math.sin(pitch);

    ctx.clearRect(0, 0, W, H);
    reset();

    let progress = 1;
    if (mode === 'scan') progress = reduce ? 1 : Math.min(1, el / 4.2);
    if (mode === 'print') progress = reduce ? 1 : Math.min(1, el / 5.2);
    if (mode === 'plan' || mode === 'xray') progress = reduce ? 1 : Math.min(1, el / 1.2);
    const sweep = progress * 1.12 - 0.06;
    let shown = 0;

    for (let i = 0; i < pts.length; i++) {
      const p = pts[i];
      const kind = p[3];
      let colorIdx = 0, alpha = 1;
      if (mode === 'scan') {
        if (kind === 1) continue;
        if (p[5] > sweep) continue;
        const front = sweep - p[5];
        colorIdx = front < 0.035 ? 1 : 0;
        alpha = kind === 2 ? 0.42 : 1;
      } else if (mode === 'plan') {
        if (kind === 1) continue;
        alpha = kind === 2 ? 0.22 : 0.62;
        if (kind === 0 && (p[4] === 0)) { colorIdx = 1; alpha = 0.9; }
      } else if (mode === 'xray') {
        if (kind === 2) continue;
        colorIdx = 2; alpha = kind === 1 ? 0.5 : 0.85;
        alpha *= progress;
      } else if (mode === 'print') {
        if (kind === 1) continue;
        if (p[6] > progress * 1.02) continue;
        colorIdx = (progress * 1.02 - p[6]) < 0.025 && progress < 1 ? 1 : 0;
        alpha = kind === 2 ? 0.42 : 1;
      }
      const q = project(p[0], p[1], p[2], cyw, syw, cp, spt);
      const depth = Math.max(0, Math.min(1, (q[2] + 40) / 80));
      const lvl = Math.min(3, Math.floor((1 - depth) * 3.999 * alpha));
      const sx = ox + q[0] * sc, sy = oy + q[1] * sc;
      buckets[colorIdx * 4 + lvl].push(sx, sy);
      shown++;
    }

    const alphas = [0.16, 0.34, 0.58, 0.9];
    const cols = [COL.paper, COL.gold, COL.xr];
    if (mode === 'xray') ctx.globalCompositeOperation = 'lighter';
    const sz = W < 520 ? 1.15 : 1.35;
    for (let c = 0; c < 3; c++) for (let l = 0; l < 4; l++) {
      const arr = buckets[c * 4 + l];
      if (!arr.length) continue;
      const a = mode === 'xray' ? alphas[l] * 0.55 : alphas[l];
      ctx.fillStyle = `rgba(${cols[c][0]},${cols[c][1]},${cols[c][2]},${a})`;
      for (let j = 0; j < arr.length; j += 2) ctx.fillRect(arr[j], arr[j + 1], sz, sz);
    }
    ctx.globalCompositeOperation = 'source-over';
    // keep the arch centred in the frame whatever the yaw (eased, measured on the crown + gum cloud)
    for (let i = 0; i < pts.length; i += 7) {
      const p = pts[i]; if (p[3] !== 0) continue; // crowns only: stray gum points would shrink the fit
      const q = project(p[0], p[1], p[2], cyw, syw, cp, spt);
      const sx = ox + q[0] * sc, sy = oy + q[1] * sc;
      if (sx < bx0) bx0 = sx; if (sx > bx1) bx1 = sx; if (sy < by0) by0 = sy; if (sy > by1) by1 = sy;
    }
    {
      const e = reduce || force ? 1 : 0.08;
      const midY = (SAFE.top + H - SAFE.bottom) / 2;
      fitX += (W / 2 - (bx0 + bx1) / 2) * e; fitY += (midY - (by0 + by1) / 2) * e;
      // shrink quickly when the cloud would reach the HUD, grow back slowly, never past the base scale
      const room = Math.min((W - SAFE.side * 2) / ((bx1 - bx0) * 1.12), (H - SAFE.top - SAFE.bottom) / ((by1 - by0) * 1.18));
      const target = Math.min(1, fitS * room);
      fitS += (target - fitS) * (reduce || force ? 1 : target < fitS ? 0.12 : 0.02);
    }

    // overlays
    const P = (x, y, z) => { const q = project(x, y, z, cyw, syw, cp, spt); return [ox + q[0] * sc, oy + q[1] * sc]; };
    ctx.lineWidth = 1;
    if (mode === 'scan' && progress < 1) {
      const xw = minX + (maxX - minX) * Math.max(0, Math.min(1, sweep));
      const a = P(xw, -14, minZ - 4), b = P(xw, 8, minZ - 4), c2 = P(xw, 8, maxZ + 2), d = P(xw, -14, maxZ + 2);
      ctx.strokeStyle = 'rgba(214,184,140,.35)';
      ctx.fillStyle = 'rgba(214,184,140,.035)';
      ctx.beginPath(); ctx.moveTo(...a); ctx.lineTo(...b); ctx.lineTo(...c2); ctx.lineTo(...d); ctx.closePath(); ctx.fill(); ctx.stroke();
    }
    if (mode === 'plan') {
      const k = progress;
      ctx.strokeStyle = `rgba(214,184,140,${0.9 * k})`;
      ctx.fillStyle = `rgba(237,230,218,${0.9 * k})`;
      ctx.font = '600 10.5px Manrope, sans-serif';
      // midline
      const m0 = P(0, -16, -3), m1 = P(0, 7, -3);
      ctx.setLineDash([4, 4]); ctx.beginPath(); ctx.moveTo(...m0); ctx.lineTo(...m1); ctx.stroke(); ctx.setLineDash([]);
      // occlusal arch curve
      ctx.beginPath();
      for (let i = dense.length - 1; i >= 0; i--) { const q = P(-dense[i][0], -9.6, dense[i][1]); i === dense.length - 1 ? ctx.moveTo(...q) : ctx.lineTo(...q); }
      for (let i = 0; i < dense.length; i++) { const q = P(dense[i][0], -9.6, dense[i][1]); ctx.lineTo(...q); }
      ctx.globalAlpha = 0.6; ctx.stroke(); ctx.globalAlpha = 1;
      // central incisor width dimension
      const a0 = at(0.4), a1 = at(0.4 + 8.6);
      const d0 = P(a0.x, -12.5, a0.z - 3), d1 = P(a1.x, -12.5, a1.z - 3);
      ctx.beginPath(); ctx.moveTo(...d0); ctx.lineTo(...d1); ctx.stroke();
      [d0, d1].forEach(q => { ctx.beginPath(); ctx.moveTo(q[0], q[1] - 5); ctx.lineTo(q[0], q[1] + 5); ctx.stroke(); });
      ctx.fillText('8,6 mm', Math.min(d0[0], d1[0]) - 4, Math.min(d0[1], d1[1]) - 22);
      // intercanine
      const c0 = at(0.4 + 8.6 + 0.35 + 6.6 + 0.35 + 3.8);
      const e0 = P(-c0.x, -13, c0.z), e1 = P(c0.x, -13, c0.z);
      ctx.globalAlpha = 0.75;
      ctx.beginPath(); ctx.moveTo(...e0); ctx.lineTo(...e1); ctx.stroke();
      [e0, e1].forEach(q => { ctx.beginPath(); ctx.arc(q[0], q[1], 2.5, 0, Math.PI * 2); ctx.stroke(); });
      ctx.globalAlpha = 1;
      const er = e0[0] > e1[0] ? e0 : e1;
      const lab = 'Distância intercanina', lw = ctx.measureText(lab).width;
      if (er[0] + 30 + lw < W - 14) {
        ctx.beginPath(); ctx.moveTo(er[0] + 4, er[1]); ctx.lineTo(er[0] + 26, er[1] - 18); ctx.stroke();
        ctx.fillText(lab, er[0] + 30, er[1] - 22);
      } else {
        // narrow frames: the open space inside the arch, centred over the measured span
        ctx.fillText(lab, (e0[0] + e1[0]) / 2 - lw / 2, (e0[1] + e1[1]) / 2 - 12);
      }
      ctx.fillText('Linha média', m1[0] + 8, m1[1] - 4);
    }
    if (mode === 'print' && progress < 1) {
      const yl = crownMinY + (1 - progress * 1.02) * (crownMaxY - crownMinY);
      // the nozzle's current layer, traced along the arch
      ctx.strokeStyle = 'rgba(214,184,140,.7)';
      for (const off of [-5.6, 5.6]) {
        ctx.beginPath();
        for (let i = dense.length - 1; i >= 0; i--) { const c = at(cum[i]); const q = P(-(c.x + c.nx * off), yl, c.z + c.nz * off); i === dense.length - 1 ? ctx.moveTo(...q) : ctx.lineTo(...q); }
        for (let i = 0; i < dense.length; i++) { const c = at(cum[i]); const q = P(c.x + c.nx * off, yl, c.z + c.nz * off); ctx.lineTo(...q); }
        ctx.stroke();
      }
    }

    // HUD
    const pct = Math.round(progress * 100);
    if (hud.progress) hud.progress.textContent = pct + '%';
    if (hud.bar) hud.bar.style.width = pct + '%';
    if (hud.points) hud.points.textContent = (mode === 'scan' || mode === 'print' ? Math.round(shown * 14.2) : Math.round(crownCount * 14.2)).toLocaleString('pt-BR');
    const tab = tabs.find(t => t.dataset.mode === mode);
    if (tab) tab.style.setProperty('--p', autoCycle ? Math.min(1, (now - modeT0) / CYCLE) : 1);
  }

  /* ---- Mode switching ---- */
  const CYCLE = 8000;
  let autoCycle = !reduce;
  const setMode = (m, user) => {
    mode = m; modeT0 = performance.now();
    if (user) autoCycle = false;
    tabs.forEach(t => { const on = t.dataset.mode === m; t.classList.toggle('is-active', on); t.setAttribute('aria-selected', on); t.tabIndex = on ? 0 : -1; });
    if (hud.mode) hud.mode.textContent = MODES[m];
    // Phones hide the per-tab descriptions; the active one is echoed under the tabs
    const desc = document.querySelector('[data-mode-desc]'), on = tabs.find(t => t.dataset.mode === m);
    if (desc && on) desc.textContent = on.querySelector('.mode__desc').textContent;
    const panel = document.getElementById('viewer-panel');
    if (panel && on) panel.setAttribute('aria-labelledby', on.id);
    if (reduce) { draw(performance.now(), true); draw(performance.now(), true); }
  };
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => setMode(t.dataset.mode, true));
    t.addEventListener('keydown', e => {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      const n = tabs[(i + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length];
      n.focus(); setMode(n.dataset.mode, true);
    });
  });

  /* ---- Drag to rotate ---- */
  canvas.addEventListener('pointerdown', e => { dragging = true; lastX = e.clientX; userTouched = true; canvas.setPointerCapture(e.pointerId); });
  canvas.addEventListener('pointermove', e => {
    if (!dragging) return;
    const dx = e.clientX - lastX; lastX = e.clientX;
    yaw += dx * 0.008; yawVel = dx * 0.0016;
    if (reduce) draw(performance.now(), true);
  });
  const end = () => { dragging = false; };
  canvas.addEventListener('pointerup', end);
  canvas.addEventListener('pointercancel', end);

  /* ---- Loop only while visible ---- */
  let running = false, raf = 0;
  const order = ['scan', 'plan', 'xray', 'print'];
  const loop = now => {
    if (autoCycle && now - modeT0 > CYCLE) setMode(order[(order.indexOf(mode) + 1) % order.length], false);
    draw(now);
    raf = running ? requestAnimationFrame(loop) : 0;
  };
  new IntersectionObserver(es => {
    const vis = es[0].isIntersecting;
    if (vis && !running && !reduce) { running = true; modeT0 = performance.now(); raf = requestAnimationFrame(loop); }
    if (!vis) { running = false; cancelAnimationFrame(raf); }
  }, { threshold: 0.15 }).observe(canvas);

  new ResizeObserver(resize).observe(canvas);
  setMode('scan', false);
})();
