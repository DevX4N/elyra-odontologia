/* Elyra Odontologia — interações */
(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  window.__elyra = true; // tells the inline fail-safe the scripts ran

  /* ---------- Load entrance ---------- */
  const hero = $('.hero');
  const start = () => requestAnimationFrame(() => hero && hero.classList.add('is-loaded'));
  const heroImg = $('.hero__frame img');
  if (heroImg && !heroImg.complete) {
    heroImg.addEventListener('load', start, { once: true });
    setTimeout(start, 1200);
  } else start();

  /* ---------- Header ---------- */
  const header = $('[data-header]');
  const wa = $('.wa-float');
  let lastY = 0;
  const onScroll = () => {
    const y = scrollY;
    header.classList.toggle('is-scrolled', y > 24);
    if (wa) wa.classList.toggle('is-shown', y > innerHeight * 0.6);
    lastY = y;
  };
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Active nav ---------- */
  const navLinks = $$('.nav a');
  const navIO = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      navLinks.forEach(a => a.removeAttribute('aria-current'));
      const a = navLinks.find(l => l.getAttribute('href') === '#' + e.target.id);
      if (a) a.setAttribute('aria-current', 'true');
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  $$('main > section[id]').forEach(s => navIO.observe(s));

  /* WhatsApp button flips to paper over dark fields */
  if (wa) {
    const dark = new Set();
    const darkIO = new IntersectionObserver(es => {
      es.forEach(e => e.isIntersecting ? dark.add(e.target) : dark.delete(e.target));
      wa.classList.toggle('on-dark', dark.size > 0);
    }, { rootMargin: '-92% 0px 0px 0px', threshold: 0 }); // only the bottom strip, where the button sits
    $$('.tech, .cta, .footer').forEach(el => darkIO.observe(el));

    // Step aside where it would cover a contact area or the comparator: those already offer the action
    const over = new Set();
    const tuckIO = new IntersectionObserver(es => {
      es.forEach(e => e.isIntersecting ? over.add(e.target) : over.delete(e.target));
      wa.classList.toggle('is-tucked', over.size > 0);
    }, { rootMargin: '-72% 0px 0px 0px', threshold: 0 }); // the bottom band the button floats over
    $$('[data-compare], #agendar, #contato, .footer').forEach(el => tuckIO.observe(el));
  }

  /* ---------- Mobile menu ---------- */
  const toggle = $('[data-menu-toggle]');
  const menu = $('[data-menu]');
  const setMenu = open => {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.querySelector('.menu-toggle__label').textContent = open ? 'Fechar' : 'Menu';
    document.body.classList.toggle('menu-open', open);
    // Keep keyboard and screen-reader focus inside the open menu
    ['main', '.footer', '.wa-float'].forEach(sel => { const el = $(sel); if (el) el.inert = open; });
    if (open) {
      menu.hidden = false;
      requestAnimationFrame(() => { menu.classList.add('is-open'); const first = $('a', menu); if (first) first.focus({ preventScroll: true }); });
      header.classList.add('is-scrolled');
    } else {
      menu.classList.remove('is-open');
      setTimeout(() => { if (!menu.classList.contains('is-open')) menu.hidden = true; }, 700);
      onScroll();
    }
  };
  toggle.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
  menu.addEventListener('click', e => { if (e.target.closest('a')) setMenu(false); });
  addEventListener('keydown', e => { if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') { setMenu(false); toggle.focus(); } });
  matchMedia('(min-width: 1181px)').addEventListener('change', e => { if (e.matches) setMenu(false); });

  /* ---------- Reveal ---------- */
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
    });
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.08 });
  $$('.reveal, [data-reveal-img]:not(.hero__frame), .sheet, .ruler, .steps').forEach(el => io.observe(el));

  /* ---------- Counters ---------- */
  const fmt = (n, dot) => dot ? Math.round(n).toLocaleString('pt-BR') : String(Math.round(n));
  const countIO = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      countIO.unobserve(e.target);
      const el = e.target, to = +el.dataset.count, dot = el.dataset.format === 'dot';
      if (reduce) { el.textContent = fmt(to, dot); return; }
      const dur = 1600, t0 = performance.now();
      const tick = t => {
        const p = Math.min(1, (t - t0) / dur), k = 1 - Math.pow(1 - p, 4);
        el.textContent = fmt(to * k, dot);
        if (p < 1) requestAnimationFrame(tick);
      };
      el.textContent = fmt(0, dot);
      requestAnimationFrame(tick);
    });
  }, { threshold: 0.6 });
  $$('[data-count]').forEach(el => countIO.observe(el));

  /* ---------- Parallax ---------- */
  const px = $$('[data-parallax]');
  if (!reduce && px.length) {
    let ticking = false;
    const update = () => {
      const vh = innerHeight;
      px.forEach(img => {
        const r = img.parentElement.getBoundingClientRect();
        if (r.bottom < -100 || r.top > vh + 100) return;
        const c = (r.top + r.height / 2 - vh / 2) / vh;
        img.style.transform = `translate3d(0, ${(-c * (+img.dataset.parallax) * 100).toFixed(2)}%, 0)`;
      });
      ticking = false;
    };
    addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    addEventListener('resize', update);
    update();
  }

  // Responsive candidates for images swapped at runtime (same naming as .impeccable/build-images.py)
  const srcsetFor = (src, small, full) => `${src.replace('.webp', `-${small}.webp`)} ${small}w, ${src} ${full}w`;

  /* ---------- Treatments hover preview ---------- */
  const list = $('[data-treat-list]');
  const preview = $('[data-treat-preview]');
  if (list && preview) {
    const imgs = $$('img', preview);
    const cap = $('[data-treat-cap]', preview), fig = $('[data-treat-fig]', preview), dim = $('[data-treat-dim]', preview);
    let cur = 0, front = 0;
    const items = $$('.treat', list);
    const show = i => {
      if (i === cur) return;
      cur = i;
      items.forEach((it, k) => it.classList.toggle('is-active', k === i));
      const it = items[i];
      const back = 1 - front;
      imgs[back].srcset = srcsetFor(it.dataset.img, 480, 900);
      imgs[back].src = it.dataset.img;
      imgs[back].alt = '';
      const swap = () => {
        imgs[front].classList.remove('is-on');
        imgs[back].classList.add('is-on');
        front = back;
      };
      imgs[back].decode ? imgs[back].decode().then(swap, swap) : swap();
      cap.textContent = $('.treat__name', it).textContent;
      fig.textContent = 'Fig. 02.' + (i + 1);
      dim.textContent = 'T.0' + (i + 1);
    };
    items.forEach((it, i) => {
      it.addEventListener('mouseenter', () => show(i));
      it.addEventListener('focusin', () => show(i));
    });
    // Warm the other previews only when the list is close, at the size this screen will pick
    const warm = new IntersectionObserver(es => {
      if (!es[0].isIntersecting) return;
      warm.disconnect();
      items.forEach(it => { const im = new Image(); im.sizes = imgs[0].sizes; im.srcset = srcsetFor(it.dataset.img, 480, 900); });
    }, { rootMargin: '600px 0px' });
    if (matchMedia('(min-width: 961px)').matches) warm.observe(list);
  }

  /* Links that land on the form carry their context: a treatment or a specialist */
  const sel = $('#f-trat');
  const tratHint = $('[data-trat-hint]');
  const pref = $('[data-booking-pref]'), docInput = $('[data-doctor-input]');
  const flag = el => { el.classList.remove('is-flagged'); void el.offsetWidth; el.classList.add('is-flagged'); };
  const setTreatment = v => {
    if (!sel) return;
    sel.value = v;
    tratHint.textContent = v === 'Ainda não sei'
      ? 'Sem problema: a avaliação serve justamente para definir o tratamento.'
      : `Já selecionamos ${v}. Você pode trocar se quiser.`;
    flag(sel.closest('.field'));
  };
  $$('[data-treatment]').forEach(a => a.addEventListener('click', () => setTreatment(a.dataset.treatment)));
  sel && sel.addEventListener('change', () => { tratHint.textContent = ''; });
  const setDoctor = name => {
    docInput.value = name;
    pref.innerHTML = '';
    const txt = document.createElement('span');
    txt.textContent = `Preferência de especialista: ${name}`;
    const clear = document.createElement('button');
    clear.type = 'button';
    clear.className = 'booking__pref-clear';
    clear.textContent = 'Remover';
    clear.setAttribute('aria-label', `Remover preferência por ${name}`);
    clear.addEventListener('click', () => { setDoctor(''); $('#f-nome').focus(); });
    pref.append(txt, clear);
    pref.hidden = !name;
    if (name) flag(pref);
  };
  $$('[data-doctor]').forEach(a => a.addEventListener('click', () => setDoctor(a.dataset.doctor)));

  /* ---------- Before / After ---------- */
  const cmp = $('[data-compare]');
  if (cmp) {
    const range = $('.compare__range', cmp);
    const setPos = v => { cmp.style.setProperty('--pos', v + '%'); range.value = v; };
    range.addEventListener('input', () => setPos(+range.value));
    let dragging = false;
    const fromEvent = e => {
      const r = cmp.getBoundingClientRect();
      return Math.max(0, Math.min(100, ((e.clientX - r.left) / r.width) * 100));
    };
    cmp.addEventListener('pointerdown', e => { dragging = true; setPos(fromEvent(e)); });
    addEventListener('pointermove', e => { if (dragging) setPos(fromEvent(e)); });
    addEventListener('pointerup', () => { dragging = false; });

    const cases = [
      { src: 'assets/img/ba-1.webp', h: 1017, trat: 'Lentes de Contato Dental', alt: 'Sorriso atual (imagem ilustrativa), com o planejamento das lentes desenhado em dourado',
        plan: 'Seis lentes em proporção 1 : 0,7 : 0,6, com as bordas acompanhando a curva do lábio inferior.' },
      { src: 'assets/img/ba-2.webp', h: 1024, trat: 'Clareamento Dental', alt: 'Sorriso atual (imagem ilustrativa), com a escala de cor do clareamento desenhada em dourado',
        plan: 'Cor planejada de A3 para B1 na escala, sem alterar a forma nem o contorno dos dentes.' },
      { src: 'assets/img/ba-3.webp', h: 1020, trat: 'Reabilitação Oral', alt: 'Sorriso atual (imagem ilustrativa), com plano oclusal, contorno gengival e linha média desenhados em dourado',
        plan: 'Plano oclusal, contorno gengival e linha média definidos em conjunto antes de qualquer procedimento.' }
    ];
    const tabs = $$('[data-case]');
    const photo = $('[data-photo]', cmp), svg = $('[data-plan-svg]', cmp);
    const groups = $$('[data-plan]', cmp), caption = $('[data-case-caption]'), caseCta = $('[data-case-cta]');
    tabs.forEach((t, k) => t.addEventListener('keydown', e => {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft' && e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
      e.preventDefault();
      const n = tabs[(k + (e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : tabs.length - 1)) % tabs.length];
      n.focus(); n.click();
    }));
    tabs.forEach(t => t.addEventListener('click', () => {
      const i = +t.dataset.case;
      if (i === +cmp.dataset.caseActive) return;
      tabs.forEach(x => { const on = x === t; x.classList.toggle('is-active', on); x.setAttribute('aria-selected', on); x.tabIndex = on ? 0 : -1; });
      cmp.setAttribute('aria-labelledby', t.id);
      // "Quero avaliar o meu caso" pre-selects the treatment of the case on screen
      if (caseCta) caseCta.dataset.treatment = cases[i].trat;
      cmp.classList.add('is-swapping');
      setTimeout(() => {
        photo.srcset = srcsetFor(cases[i].src, 700, 1400);
        photo.src = cases[i].src;
        photo.height = cases[i].h;
        photo.alt = cases[i].alt;
        svg.setAttribute('viewBox', `0 0 1400 ${cases[i].h}`);
        cmp.dataset.caseActive = i;
        // Reset the draw so the new plan traces in from its first stroke
        const live = cmp.classList.contains('is-live');
        cmp.classList.remove('is-live');
        groups.forEach(g => g.classList.toggle('is-on', +g.dataset.plan === i));
        svg.getBoundingClientRect();
        caption.innerHTML = `<span>Planejamento</span> ${cases[i].plan}`;
        const done = () => { cmp.classList.remove('is-swapping'); if (live) cmp.classList.add('is-live'); if (!reduce) sweep(); };
        photo.decode ? photo.decode().then(done, done) : done();
      }, 260);
    }));
    // Intro sweep so visitors discover the slider
    const sweep = () => {
      const t0 = performance.now(), dur = 1400;
      const step = t => {
        const p = Math.min(1, (t - t0) / dur);
        const v = 50 + Math.sin(p * Math.PI * 2) * 18 * (1 - p);
        setPos(v);
        if (p < 1 && !dragging) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };
    // The plan draws itself the first time the frame is in view, then the handle sweeps
    const sIO = new IntersectionObserver(es => {
      if (!es[0].isIntersecting) return;
      sIO.disconnect();
      cmp.classList.add('is-live');
      if (!reduce) setTimeout(sweep, 900);
    }, { threshold: 0.45 });
    sIO.observe(cmp);
  }

  /* ---------- Team carousel position (phones and tablets) ---------- */
  const team = $('[data-team]');
  if (team) {
    const ti = $('[data-team-i]'), tbar = $('[data-team-bar]'), docs = $$('.doc', team);
    const upd = () => {
      const max = team.scrollWidth - team.clientWidth;
      if (max <= 0) return;
      const p = team.scrollLeft / max;
      tbar.style.setProperty('--p', (1 + p * (docs.length - 1)) / docs.length);
      ti.textContent = String(Math.round(p * (docs.length - 1)) + 1).padStart(2, '0');
    };
    team.addEventListener('scroll', upd, { passive: true });
  }

  /* ---------- Testimonials ---------- */
  const stage = $('[data-voices]');
  if (stage) {
    const voices = $$('.voice', stage);
    const iEl = $('[data-voice-i]'), nEl = $('[data-voice-n]'), bar = $('[data-voice-bar]');
    const pad = n => String(n).padStart(2, '0');
    nEl.textContent = pad(voices.length);
    let idx = 0, timer = null, t0 = 0, paused = false, visible = false, stopped = reduce;
    const toggle = $('[data-voice-toggle]'), count = $('[data-voice-count]');
    // Auto-advance can be stopped (WCAG 2.2.2); reduced motion starts stopped
    const setStopped = v => {
      stopped = v;
      toggle.setAttribute('aria-label', v ? 'Retomar a troca automática de depoimentos' : 'Pausar a troca automática de depoimentos');
      toggle.setAttribute('aria-pressed', String(v));
      $('use', toggle).setAttribute('href', v ? '#i-play' : '#i-pause');
      count.setAttribute('aria-live', v ? 'polite' : 'off'); // announce only when the visitor drives it
      if (!v) t0 = performance.now() - (parseFloat((bar.style.transform.match(/[\d.]+/) || [0])[0]) * DUR);
    };
    toggle.addEventListener('click', () => setStopped(!stopped));
    const DUR = 7000;
    const go = i => {
      idx = (i + voices.length) % voices.length;
      voices.forEach((v, k) => { v.classList.toggle('is-active', k === idx); v.setAttribute('aria-hidden', k !== idx); });
      iEl.textContent = pad(idx + 1);
      t0 = performance.now();
    };
    const loop = t => {
      if (!paused && !stopped && visible) {
        const p = (t - t0) / DUR;
        bar.style.transform = `scaleX(${Math.min(1, p)})`;
        if (p >= 1) go(idx + 1);
      } else t0 = t - (parseFloat((bar.style.transform.match(/[\d.]+/) || [0])[0]) * DUR);
      timer = requestAnimationFrame(loop);
    };
    // Manual navigation hands control to the visitor
    $('[data-voice-prev]').addEventListener('click', () => { setStopped(true); go(idx - 1); bar.style.transform = 'scaleX(0)'; });
    $('[data-voice-next]').addEventListener('click', () => { setStopped(true); go(idx + 1); bar.style.transform = 'scaleX(0)'; });
    stage.addEventListener('mouseenter', () => paused = true);
    stage.addEventListener('mouseleave', () => paused = false);
    stage.addEventListener('focusin', () => paused = true);
    stage.addEventListener('focusout', () => paused = false);
    // swipe
    let sx = null;
    stage.addEventListener('touchstart', e => { sx = e.touches[0].clientX; }, { passive: true });
    stage.addEventListener('touchend', e => {
      if (sx === null) return;
      const dx = e.changedTouches[0].clientX - sx;
      if (Math.abs(dx) > 40) { setStopped(true); go(idx + (dx < 0 ? 1 : -1)); bar.style.transform = 'scaleX(0)'; }
      sx = null;
    });
    new IntersectionObserver(es => { visible = es[0].isIntersecting; }).observe(stage);
    go(0);
    setStopped(stopped);
    timer = requestAnimationFrame(loop);
  }

  /* ---------- Process steps light up ---------- */
  const steps = $('[data-steps]');
  if (steps) {
    const sIO = new IntersectionObserver(es => {
      if (!es[0].isIntersecting) return;
      sIO.disconnect();
      $$('.step', steps).forEach((s, i) => setTimeout(() => s.classList.add('is-on'), reduce ? 0 : 350 * i + 300));
    }, { threshold: 0.4 });
    sIO.observe(steps);
  }

  /* ---------- Booking form ---------- */
  const form = $('[data-booking]');
  if (form) {
    const done = $('[data-booking-done]'), echo = $('[data-booking-echo]');
    const phone = $('#f-whats');
    phone.addEventListener('input', () => {
      const d = phone.value.replace(/\D/g, '').slice(0, 11);
      let out = d;
      if (d.length > 2) out = `(${d.slice(0, 2)}) ${d.slice(2)}`;
      if (d.length > 7) out = `(${d.slice(0, 2)}) ${d.slice(2, d.length === 11 ? 7 : 6)}-${d.slice(d.length === 11 ? 7 : 6)}`;
      phone.value = out;
    });
    const rules = {
      nome: v => v.trim().length >= 2 || 'Informe seu nome.',
      whatsapp: v => { const n = v.replace(/\D/g, '').length; return (n === 10 || n === 11) || 'Informe um WhatsApp válido, com DDD.'; },
      tratamento: v => !!v || 'Escolha um tratamento — ou “Ainda não sei”.'
    };
    const errId = { nome: 'e-nome', whatsapp: 'e-whats', tratamento: 'e-trat' };
    const check = name => {
      const el = form.elements[name];
      const res = rules[name](el.value);
      const field = el.closest('.field');
      const err = document.getElementById(errId[name]);
      const ok = res === true;
      field.classList.toggle('is-invalid', !ok);
      el.setAttribute('aria-invalid', String(!ok));
      if (ok) el.removeAttribute('aria-describedby'); else el.setAttribute('aria-describedby', errId[name]);
      err.textContent = ok ? '' : res;
      return ok;
    };
    Object.keys(rules).forEach(n => {
      const el = form.elements[n];
      el.addEventListener('blur', () => { if (el.value) check(n); });
      el.addEventListener('input', () => { if (el.closest('.field').classList.contains('is-invalid')) check(n); });
      el.addEventListener('change', () => { if (el.closest('.field').classList.contains('is-invalid')) check(n); });
    });
    form.addEventListener('submit', e => {
      e.preventDefault();
      const results = Object.keys(rules).map(check);
      if (results.includes(false)) {
        const first = Object.keys(rules)[results.indexOf(false)];
        form.elements[first].focus();
        return;
      }
      const btn = $('button[type="submit"]', form);
      if (btn.classList.contains('is-loading')) return;
      btn.classList.add('is-loading');
      btn.setAttribute('aria-busy', 'true');
      setTimeout(() => {
        btn.classList.remove('is-loading');
        btn.removeAttribute('aria-busy');
        // Keep the card the same height so the section does not jump
        const box = form.closest('.booking');
        box.style.minHeight = box.offsetHeight + 'px';
        const periodo = (form.elements.periodo.value || '').toLowerCase();
        const quando = { 'manhã': 'pela manhã', 'tarde': 'à tarde', 'fim do dia': 'no fim do dia' }[periodo] || '';
        const trat = form.elements.tratamento.value;
        const sobre = trat === 'Ainda não sei' ? 'para entender o que você procura' : `sobre ${trat}`;
        const doc = docInput.value;
        const com = doc ? `, com ${doc.startsWith('Dra.') ? 'a' : 'o'} ${doc}` : '';
        const tel = phone.value.replace(/ /g, ' ').replace('-', '‑');
        echo.textContent = `Vamos chamar no WhatsApp ${tel} ${quando}, ${sobre}${com}.`;
        form.hidden = true;
        done.hidden = false;
        done.focus();
      }, 1100);
    });
    $('[data-booking-reset]').addEventListener('click', () => {
      form.reset();
      tratHint.textContent = '';
      setDoctor('');
      done.hidden = true;
      form.hidden = false;
      form.closest('.booking').style.minHeight = '';
      form.elements.nome.focus();
    });
  }
})();
