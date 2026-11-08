/* RRM project page: shared helpers, hero trace, taxonomy, findings charts,
   leaderboard and toolbox. Data comes from assets/data/site.js and
   assets/data/cases.js (plain globals, so the page also works from file://). */
(() => {
  'use strict';
  document.documentElement.classList.add('js');

  /* ------------------------------------------------------------ helpers */
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));
  const NS = 'http://www.w3.org/2000/svg';
  const mq = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
  const reduced = () => !!(mq && mq.matches);
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const fmt = (v, d = 2) => (v == null || !isFinite(v)) ? '—' : v.toFixed(d);

  function svgEl(tag, attrs, parent) {
    const e = document.createElementNS(NS, tag);
    if (attrs) for (const k in attrs) if (attrs[k] != null) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  }
  function svgText(parent, attrs, text) {
    const t = svgEl('text', attrs, parent);
    t.textContent = text;
    return t;
  }
  function h(tag, attrs, ...kids) {
    const e = document.createElement(tag);
    if (attrs) for (const k in attrs) {
      const v = attrs[k];
      if (v == null || v === false) continue;
      if (k === 'class') e.className = v;
      else if (k === 'text') e.textContent = v;
      else if (k === 'style') e.style.cssText = v;
      else e.setAttribute(k, v === true ? '' : v);
    }
    for (const kid of kids.flat(3)) if (kid != null && kid !== false) e.append(kid.nodeType ? kid : String(kid));
    return e;
  }

  // Piecewise-linear value of [[t, v], ...] at time t; null before the first sample.
  function interp(pts, t) {
    const n = pts.length;
    if (!n || t < pts[0][0] - 1e-6) return null;
    if (t >= pts[n - 1][0]) return pts[n - 1][1];
    let lo = 0, hi = n - 1;
    while (hi - lo > 1) {
      const mid = (lo + hi) >> 1;
      if (pts[mid][0] <= t) lo = mid; else hi = mid;
    }
    const [t0, v0] = pts[lo], [t1, v1] = pts[hi];
    return t1 === t0 ? v1 : v0 + (v1 - v0) * (t - t0) / (t1 - t0);
  }
  function linePath(pts, x, y) {
    let d = '';
    for (let i = 0; i < pts.length; i++) d += (i ? 'L' : 'M') + x(pts[i][0]).toFixed(1) + ',' + y(pts[i][1]).toFixed(1);
    return d;
  }
  function areaPath(pts, x, y, base) {
    if (!pts.length) return '';
    const b = base.toFixed(1);
    return linePath(pts, x, y) + 'L' + x(pts[pts.length - 1][0]).toFixed(1) + ',' + b + 'L' + x(pts[0][0]).toFixed(1) + ',' + b + 'Z';
  }

  // Status icons always travel with a label (events, lab overlay).
  const ICON = { success: 'M3 6.3l2.1 2.1L9 4.3', failure: 'M3.6 3.6l4.8 4.8M8.4 3.6L3.6 8.4', neutral: 'M6 6h.01' };
  function icon(kind) {
    const s = svgEl('svg', { viewBox: '0 0 12 12', 'aria-hidden': 'true' });
    svgEl('path', { d: ICON[kind] || ICON.neutral }, s);
    return h('span', { class: 'ic ' + (ICON[kind] ? kind : 'neutral') }, s);
  }
  function mediaIcon(kind) {
    const s = svgEl('svg', { viewBox: '0 0 16 16', 'aria-hidden': 'true' });
    svgEl('path', { d: kind === 'pause' ? 'M4.5 3h2.4v10H4.5zM9.1 3h2.4v10H9.1z' : 'M4.5 2.8v10.4L13 8z' }, s);
    return s;
  }

  function watch(el, cb, opts) {
    if (!('IntersectionObserver' in window)) { cb(true); return null; }
    const io = new IntersectionObserver((es) => es.forEach((e) => cb(e.isIntersecting, e)), opts || { threshold: 0 });
    io.observe(el);
    return io;
  }
  // Calls fn (once per frame at most) when the element's width changes.
  function onResize(el, fn) {
    let w = el.clientWidth, pending = 0;
    const go = () => {
      const nw = el.clientWidth;
      if (nw === w) return;
      w = nw;
      cancelAnimationFrame(pending);
      pending = requestAnimationFrame(fn);
    };
    if ('ResizeObserver' in window) new ResizeObserver(go).observe(el);
    else window.addEventListener('resize', go);
  }

  /* ------------------------------------------------------------ tooltip + toast */
  const tipEl = $('#tip');
  const tip = {
    on: false,
    show(content, x, y) {
      tipEl.replaceChildren(...content.filter(Boolean));
      tipEl.hidden = false;
      this.on = true;
      this.move(x, y);
    },
    move(x, y) {
      if (!this.on) return;
      const r = tipEl.getBoundingClientRect(), vw = window.innerWidth, vh = window.innerHeight;
      let left = x + 14, top = y + 16;
      if (left + r.width > vw - 8) left = x - r.width - 14;
      if (top + r.height > vh - 8) top = y - r.height - 14;
      tipEl.style.transform = `translate(${Math.round(clamp(left, 8, vw - r.width - 8))}px, ${Math.round(Math.max(8, top))}px)`;
    },
    near(content, el) {
      tipEl.replaceChildren(...content.filter(Boolean));
      tipEl.hidden = false;
      this.on = true;
      const b = el.getBoundingClientRect(), r = tipEl.getBoundingClientRect(), vw = window.innerWidth;
      let top = b.top - r.height - 10;
      if (top < 8) top = b.bottom + 10;
      const left = clamp(b.left + b.width / 2 - r.width / 2, 8, vw - r.width - 8);
      tipEl.style.transform = `translate(${Math.round(left)}px, ${Math.round(top)}px)`;
    },
    hide() { tipEl.hidden = true; this.on = false; },
  };
  const tipRow = (label, value, sw) => h('span', { class: 'row' }, h('span', null, sw || null, label), h('span', { text: value }));
  window.addEventListener('scroll', () => tip.hide(), { passive: true });
  document.addEventListener('pointerdown', (e) => {
    if (!e.target.closest('.dot-b, .chart, .lab-chart')) tip.hide();
  });

  let toastEl = null, toastTimer = 0;
  function toast(msg) {
    if (!toastEl) { toastEl = h('div', { class: 'toast', role: 'status' }); document.body.append(toastEl); }
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('show'), 1900);
  }

  // Shared with lab.js
  window.RRM = { $, $$, h, svgEl, svgText, fmt, clamp, interp, linePath, areaPath, icon, mediaIcon, tip, tipRow, toast, reduced, watch, onResize };

  /* ------------------------------------------------------------ nav */
  function nav() {
    const bar = $('#nav');
    if (!bar) return;
    const onScroll = () => bar.classList.toggle('scrolled', window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    const strip = $('nav', bar), links = $$('a', strip);
    const setOn = (id) => {
      let left = 0;
      links.forEach((a) => {
        const on = a.getAttribute('href') === '#' + id;
        a.classList.toggle('on', on);
        if (on) { a.setAttribute('aria-current', 'true'); left = a.offsetLeft - strip.offsetLeft - 28; }
        else a.removeAttribute('aria-current');
      });
      // on narrow screens the link strip scrolls; keep the active link in view (back to the start at the hero)
      if (strip.scrollWidth > strip.clientWidth) strip.scrollTo({ left, behavior: 'smooth' });
    };
    const targets = ['top'].concat(links.map((a) => a.getAttribute('href').slice(1)));
    if (!('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) setOn(e.target.id); }),
      { rootMargin: '-42% 0px -54% 0px' });
    targets.forEach((id) => { const s = document.getElementById(id); if (s) io.observe(s); });
  }

  /* ------------------------------------------------------------ scroll reveal, glyphs, counters */
  function reveals() {
    $$('.families, .suites, .tldr-grid').forEach((g) => Array.from(g.children).forEach((c, i) => {
      if (c.classList.contains('reveal')) c.style.transitionDelay = (i % 5) * 70 + 'ms';
    }));
    const done = (el) => {
      el.classList.add('in');
      el.dispatchEvent(new Event('reveal'));
      // drop the reveal transition afterwards so hover transitions are not delayed
      setTimeout(() => { el.classList.remove('reveal'); el.style.transitionDelay = ''; }, 1300);
    };
    const els = $$('.reveal');
    if (reduced() || !('IntersectionObserver' in window)) { els.forEach(done); return; }
    const io = new IntersectionObserver((es) => es.forEach((e) => {
      if (!e.isIntersecting) return;
      io.unobserve(e.target);
      done(e.target);
    }), { rootMargin: '0px 0px -8% 0px', threshold: 0 });
    els.forEach((el) => io.observe(el));
  }

  function glyphs() {
    $$('.fam, .suite').forEach((card) => {
      const replay = () => {
        if (reduced()) return;
        card.classList.remove('play');
        void card.offsetWidth;
        card.classList.add('play');
      };
      card.addEventListener('reveal', replay);
      card.addEventListener('mouseenter', replay);
      if (card.matches('button')) card.addEventListener('focus', replay);
    });
  }

  function counters() {
    if (reduced() || !('IntersectionObserver' in window)) return;
    const run = (el) => {
      const to = +el.dataset.to, dur = 1200, t0 = performance.now();
      const step = (now) => {
        const p = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(to * e).toLocaleString('en-US');
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };
    const io = new IntersectionObserver((es) => es.forEach((e) => {
      if (!e.isIntersecting) return;
      io.unobserve(e.target);
      run(e.target);
    }), { rootMargin: '0px 0px -8% 0px' });
    $$('.count[data-to]').forEach((el) => io.observe(el));
  }

  /* ------------------------------------------------------------ hero trace */
  // Real data: task-state label vs VLAC-Cut on "put the books back" (paper Fig. 9).
  function heroTrace() {
    const fig = $('#hero-trace'), svg = fig && $('svg', fig), D = window.RRM_CASES;
    if (!svg || !D) return;
    const C = D.cases.find((c) => c.id === 'books_shelf_swept');
    const M = C && C.models.find((m) => m.key === 'vlaccut');
    if (!C || !M) return;
    const T = C.duration;
    const fall = C.events.find((e) => /shelf/i.test(e.label)) || C.events[C.events.length - 1];
    const DRAW = 9000, HOLD = 4200, FADE = 900, CYCLE = DRAW + HOLD + FADE;
    let R = null, elapsed = 0, last = 0, raf = 0, running = false, visible = false;

    function build() {
      const W = svg.clientWidth, H = svg.clientHeight;
      if (!W || !H) return;
      const narrow = W < 560;
      const P = { l: narrow ? 24 : 32, r: narrow ? 72 : 108, t: 30, b: 26 };
      const iw = W - P.l - P.r, ih = H - P.t - P.b;
      const x = (t) => P.l + (t / T) * iw, y = (v) => P.t + (1 - v) * ih;
      svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
      svg.replaceChildren();
      const defs = svgEl('defs', null, svg);
      const clipR = svgEl('rect', { x: 0, y: 0, width: 0, height: H }, svgEl('clipPath', { id: 'ht-clip' }, defs));
      svgEl('feGaussianBlur', { stdDeviation: 5 }, svgEl('filter', { id: 'ht-blur', x: '-5%', y: '-40%', width: '110%', height: '180%' }, defs));

      const grid = svgEl('g', { class: 'grid' }, svg);
      [0, 0.5, 1].forEach((v) => {
        svgEl('line', { x1: P.l, x2: P.l + iw, y1: y(v), y2: y(v), class: v === 0 ? 'base-line' : null }, grid);
        svgText(grid, { x: P.l - 8, y: y(v) + 3.5, 'text-anchor': 'end', class: 'tk' }, v === 0.5 ? '.5' : String(v));
      });
      for (let s = 0; s <= T; s += 5) {
        svgText(grid, { x: x(s), y: H - 6, 'text-anchor': 'middle', class: 'tk' }, s + (s + 5 > T ? ' s' : ''));
      }

      const fadeG = svgEl('g', { class: 'fade-g' }, svg);
      const bands = C.reversals.map(([a, b]) => ({
        t: a,
        el: svgEl('rect', { x: x(a), y: P.t, width: Math.max(3, x(b) - x(a)), height: ih, class: 'rev' }, fadeG),
      }));
      const fg = svgEl('g', { class: 'fall' }, fadeG);
      const fx = x(fall.t), fy = P.t + 12;
      svgEl('circle', { cx: fx, cy: fy, r: 7.5, class: 'fall-ic' }, fg);
      svgEl('path', { d: `M${fx - 2.6},${fy - 2.6}l5.2,5.2M${fx + 2.6},${fy - 2.6}l-5.2,5.2`, class: 'fall-x' }, fg);
      svgText(fg, { x: fx - 14, y: fy + 4, 'text-anchor': 'end' }, `${fall.label} · ${fall.t.toFixed(1)} s`);

      const plot = svgEl('g', { class: 'plot', 'clip-path': 'url(#ht-clip)' }, svg);
      svgEl('path', { d: areaPath(C.gt, x, y, y(0)), class: 'gt-area' }, plot);
      svgEl('path', { d: linePath(C.gt, x, y), class: 'gt-line' }, plot);
      svgEl('path', { d: linePath(M.pts, x, y), class: 'm-glow', filter: 'url(#ht-blur)' }, plot);
      svgEl('path', { d: linePath(M.pts, x, y), class: 'm-line' }, plot);

      const ph = svgEl('g', { class: 'ph' }, svg);
      const phL = svgEl('line', { y1: P.t - 8, y2: P.t + ih }, ph);
      const phT = svgEl('text', { y: P.t - 14, 'text-anchor': 'middle', class: 'tk' }, ph);
      const dG = svgEl('circle', { r: 4.5, class: 'dot dot-gt' }, ph);
      const dM = svgEl('circle', { r: 4.5, class: 'dot dot-m' }, ph);

      const ends = svgEl('g', { class: 'ends' }, fadeG);
      const mEnd = M.pts[M.pts.length - 1][1], gEnd = C.gtEnd, xe = x(T) + 13;
      svgEl('line', { x1: x(T) + 5, x2: x(T) + 5, y1: y(gEnd) - 3, y2: y(mEnd) + 3, class: 'gap' }, ends);
      svgText(ends, { x: xe, y: y(mEnd) - 6, class: 'nm' }, 'VLAC-Cut');
      svgText(ends, { x: xe, y: y(mEnd) + 12, class: 'vl' }, mEnd.toFixed(2));
      svgText(ends, { x: xe, y: y(gEnd) - 22, class: 'nm' }, 'task state');
      svgText(ends, { x: xe, y: y(gEnd) - 4, class: 'vl' }, gEnd.toFixed(2));

      R = { x, y, clipR, bands, fg, ph, phL, phT, dG, dM, ends };
      render();
    }

    function render() {
      if (!R) return;
      const still = reduced();
      const e = elapsed % CYCLE, fading = !still && e >= DRAW + HOLD;
      const t = still ? T : Math.min(1, e / DRAW) * T, xp = R.x(t);
      R.clipR.setAttribute('width', xp + 2);
      R.phL.setAttribute('x1', xp);
      R.phL.setAttribute('x2', xp);
      R.phT.setAttribute('x', xp);
      R.phT.textContent = t.toFixed(1) + ' s';
      R.dG.setAttribute('cx', xp);
      R.dG.setAttribute('cy', R.y(interp(C.gt, t)));
      const m = interp(M.pts, t);
      R.dM.setAttribute('opacity', m == null ? 0 : 1);
      if (m != null) { R.dM.setAttribute('cx', xp); R.dM.setAttribute('cy', R.y(m)); }
      R.bands.forEach((b) => b.el.classList.toggle('on', t >= b.t && !fading));
      R.fg.classList.toggle('on', t >= fall.t && !fading);
      const done = still || e >= DRAW;
      R.ends.classList.toggle('on', done && !fading);
      R.ph.classList.toggle('off', done);
      svg.classList.toggle('fade', fading);
    }

    const tick = (now) => {
      elapsed += Math.min(250, now - last);
      last = now;
      render();
      raf = requestAnimationFrame(tick);
    };
    const start = () => {
      if (running || reduced()) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(tick);
    };
    const stop = () => { running = false; cancelAnimationFrame(raf); };

    build();
    onResize(svg, build);
    if (reduced()) return;
    watch(fig, (on) => { visible = on; if (on && !document.hidden) start(); else stop(); });
    document.addEventListener('visibilitychange', () => { if (document.hidden) stop(); else if (visible) start(); });
  }

  /* ------------------------------------------------------------ taxonomy */
  const FAM_VAR = { 'Outcome': '--fam-o', 'Absolute Progress': '--fam-ap', 'Relative': '--fam-r', 'Temporal Value': '--fam-tv', 'Hybrid': '--fam-h' };

  function dotButton(name, route) {
    const gen = name.includes('*'), proto = name.includes('‡');
    const b = h('button', { type: 'button', class: 'dot-b' + (gen ? ' gen' : '') + (proto ? ' proto' : ''), 'aria-label': `${name}, ${route}` });
    const content = () => [
      h('b', { text: name }),
      h('span', { class: 'sm', text: route }),
      (gen || proto) ? h('span', { class: 'sm', text: [gen && '* evaluates generated behavior', proto && '‡ a protocol or harness'].filter(Boolean).join(' · ') }) : null,
    ];
    b.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse') { b.classList.add('on'); tip.show(content(), e.clientX, e.clientY); } });
    b.addEventListener('pointermove', (e) => { if (e.pointerType === 'mouse') tip.move(e.clientX, e.clientY); });
    b.addEventListener('pointerleave', (e) => { if (e.pointerType === 'mouse') { b.classList.remove('on'); tip.hide(); } });
    b.addEventListener('click', (e) => { if (e.pointerType !== 'mouse') tip.near(content(), b); });
    b.addEventListener('focus', () => { if (b.matches(':focus-visible')) tip.near(content(), b); });
    b.addEventListener('blur', () => tip.hide());
    return b;
  }

  function taxonomy() {
    const S = window.RRM_SITE;
    if (!S) return;
    const fams = new Map(S.families.map((f) => [f.name, f]));
    $$('.fam[data-family]').forEach((card) => {
      const f = fams.get(card.dataset.family), box = $('.dots', card);
      if (!f || !box) return;
      f.routes.forEach((r) => box.append(h('span', { class: 'grp' }, r.methods.map((m) => dotButton(m, r.name)))));
    });
    const list = $('#method-list');
    if (list) S.families.forEach((f) => list.append(h('div', { class: 'ml-fam', style: `--c: var(${FAM_VAR[f.name] || '--ink-3'})` },
      h('h4', null, f.name, h('span', { text: String(f.count) })),
      h('dl', null, f.routes.map((r) => [h('dt', { text: r.name }), h('dd', { text: r.methods.join(', ') })])))));
  }

  /* ------------------------------------------------------------ suites, lab links, video wall */
  function openLab(suite, id) {
    if (window.RRMLab) window.RRMLab.open(suite, id);
    const target = $('#lab-root') || $('#lab');
    if (target) target.scrollIntoView({ behavior: reduced() ? 'auto' : 'smooth', block: 'start' });
  }
  function suites() {
    $$('.suite[data-suite]').forEach((b) => b.addEventListener('click', () => openLab(b.dataset.suite)));
    $$('a[data-lab]').forEach((a) => a.addEventListener('click', (e) => { e.preventDefault(); openLab(a.dataset.lab, 'books_shelf_swept'); }));
  }

  function wall() {
    const frame = $('.wall-frame'), v = frame && $('video', frame);
    if (!v) return;
    let userPaused = reduced();
    const btn = h('button', { type: 'button', class: 'wall-btn' });
    const sync = () => {
      btn.replaceChildren(mediaIcon(v.paused ? 'play' : 'pause'));
      btn.setAttribute('aria-label', v.paused ? 'Play the video wall' : 'Pause the video wall');
    };
    frame.append(btn);
    btn.addEventListener('click', () => {
      if (v.paused) { userPaused = false; v.play().catch(() => {}); } else { userPaused = true; v.pause(); }
    });
    v.addEventListener('play', sync);
    v.addEventListener('pause', sync);
    sync();
    watch(v, (on) => {
      if (on && !userPaused) v.play().catch(() => {});
      else if (!on && !v.paused) v.pause();
    }, { threshold: 0.2 });
  }

  /* ------------------------------------------------------------ findings charts */
  const SHORT = (s) => s.replace(/\s*\(.*?\)/g, '').replace('-Preview', '').replace('GRM-', '');

  // Hover the nearest mark within `radius` px; touch uses the same path on pointerdown.
  function nearestHover(svg, items, radius, contentOf, onHi) {
    let cur = null;
    const pick = (e) => {
      const r = svg.getBoundingClientRect(), px = e.clientX - r.left, py = e.clientY - r.top;
      let best = null, bd = radius;
      for (const it of items) {
        const d = Math.hypot(it.cx - px, it.cy - py);
        if (d < bd) { bd = d; best = it; }
      }
      if (best !== cur) { onHi(cur, false); cur = best; onHi(cur, true); }
      if (best) tip.show(contentOf(best), e.clientX, e.clientY); else tip.hide();
    };
    svg.addEventListener('pointermove', pick);
    svg.addEventListener('pointerdown', pick);
    svg.addEventListener('pointerleave', () => { onHi(cur, false); cur = null; tip.hide(); });
  }

  function mark(parent, kind, cx, cy) {
    if (kind === 'General VLM') return svgEl('rect', { x: cx - 4.5, y: cy - 4.5, width: 9, height: 9, rx: 1.5, class: 'pt' }, parent);
    if (kind === 'Decision') return svgEl('path', { d: `M${cx},${cy - 6}l6,6l-6,6l-6,-6z`, class: 'pt' }, parent);
    return svgEl('circle', { cx, cy, r: 5, class: 'pt' }, parent);
  }

  function vocChart() {
    const box = $('#chart-voc'), S = window.RRM_SITE;
    if (!box || !S) return;
    const rows = S.board.filter((r) => r.voc != null && r.ff1 != null);
    function draw() {
      const W = box.clientWidth;
      if (!W) return;
      const H = Math.round(clamp(W * 0.62, 250, 360));
      const P = { l: 38, r: 14, t: 26, b: 40 };
      const X0 = 0.1, X1 = 1.04, Y0 = -0.025, Y1 = 0.4;
      const x = (v) => P.l + (v - X0) / (X1 - X0) * (W - P.l - P.r);
      const y = (v) => P.t + (Y1 - v) / (Y1 - Y0) * (H - P.t - P.b);
      const svg = svgEl('svg', { width: W, height: H, viewBox: `0 0 ${W} ${H}`, class: 'viz', 'aria-hidden': 'true' });
      const g = svgEl('g', { class: 'grid' }, svg);
      [0, 0.1, 0.2, 0.3, 0.4].forEach((v) => {
        svgEl('line', { x1: P.l, x2: W - P.r, y1: y(v), y2: y(v), class: v === 0 ? 'base-line' : null }, g);
        svgText(g, { x: P.l - 8, y: y(v) + 3.5, 'text-anchor': 'end', class: 'tk' }, v === 0 ? '0' : v.toFixed(1));
      });
      [0.2, 0.4, 0.6, 0.8, 1].forEach((v) => svgText(g, { x: x(v), y: H - P.b + 17, 'text-anchor': 'middle', class: 'tk' }, v.toFixed(1)));
      svgText(svg, { x: P.l, y: 12, class: 'ttl' }, 'Falling F1 ↑');
      svgText(svg, { x: W - P.r, y: H - 5, 'text-anchor': 'end', class: 'ttl' }, 'VOC →');

      const items = rows.map((r) => {
        const cx = x(r.voc), cy = y(r.ff1);
        return { r, cx, cy, el: mark(svg, r.kind, cx, cy) };
      });
      const ck = { cx: x(1), cy: y(0), clock: true };
      ck.el = svgEl('circle', { cx: ck.cx, cy: ck.cy, r: 6.5, class: 'clock' }, svg);
      svgEl('path', { d: `M${ck.cx},${ck.cy - 3.4}V${ck.cy}l2.4,1.7`, class: 'clock-h', fill: 'none' }, svg);
      svgText(svg, { x: ck.cx - 12, y: ck.cy - 11, 'text-anchor': 'end', class: 'lab-t' }, 'Time-only control');
      const rr = items.find((m) => /^RoboReward/.test(m.r.name));
      if (rr) svgText(svg, { x: rr.cx - 10, y: rr.cy + 4, 'text-anchor': 'end', class: 'lab-t dim' }, SHORT(rr.r.name));
      items.push(ck);

      nearestHover(svg, items, 22, (it) => it.clock
        ? [h('b', { text: 'Normalized elapsed time' }), h('span', { class: 'sm', text: 'Reads only the clock, never the video' }),
          tipRow('VOC', '1.000'), tipRow('Falling F1', '0.000'), tipRow('τa', '0.000')]
        : [h('b', { text: it.r.name }), h('span', { class: 'sm', text: [it.r.kind, it.r.size].filter(Boolean).join(' · ') }),
          tipRow('VOC', fmt(it.r.voc, 3)), tipRow('Falling F1', fmt(it.r.ff1, 3))],
      (it, on) => { if (it && !it.clock) it.el.classList.toggle('hl', on); });
      box.replaceChildren(svg);
    }
    draw();
    onResize(box, draw);
  }

  function viewChart() {
    const box = $('#chart-view'), S = window.RRM_SITE;
    if (!box || !S) return;
    const rows = S.board.filter((r) => r.v != null && r.px != null).sort((a, b) => b.v - a.v);
    function draw() {
      const W = box.clientWidth;
      if (!W) return;
      const lw = W < 480 ? 126 : 176, rh = 17;
      const P = { l: lw, r: 14, t: 8, b: 34 };
      const H = P.t + rows.length * rh + P.b;
      const X0 = 0.1, X1 = 0.65;
      const x = (v) => P.l + (v - X0) / (X1 - X0) * (W - P.l - P.r);
      const svg = svgEl('svg', { width: W, height: H, viewBox: `0 0 ${W} ${H}`, class: 'viz', 'aria-hidden': 'true' });
      const g = svgEl('g', { class: 'grid' }, svg);
      [0.2, 0.3, 0.4, 0.5, 0.6].forEach((v) => {
        svgEl('line', { x1: x(v), x2: x(v), y1: P.t, y2: H - P.b + 4 }, g);
        svgText(g, { x: x(v), y: H - P.b + 18, 'text-anchor': 'middle', class: 'tk' }, v.toFixed(1));
      });
      svgText(svg, { x: W - P.r, y: H - 3, 'text-anchor': 'end', class: 'ttl' }, 'Macro-F1 →');
      const items = rows.map((r, i) => {
        const cy = P.t + i * rh + rh / 2;
        const bg = svgEl('rect', { x: 0, y: cy - rh / 2, width: W, height: rh, class: 'row-bg' }, svg);
        const t = svgText(svg, { x: P.l - 10, y: cy + 3.8, 'text-anchor': 'end', class: 'row-t' }, SHORT(r.name));
        svgEl('line', { x1: x(r.v), x2: x(r.px), y1: cy, y2: cy, class: 'conn' }, svg);
        svgEl('circle', { cx: x(r.px), cy, r: 4.5, class: 'dpx' }, svg);
        svgEl('circle', { cx: x(r.v), cy, r: 4.5, class: 'dv' }, svg);
        return { r, bg, t, cy };
      });
      let cur = null;
      const hi = (it, on) => { if (it) { it.bg.classList.toggle('hl', on); it.t.classList.toggle('hl', on); } };
      const pick = (e) => {
        const b = svg.getBoundingClientRect(), i = Math.floor((e.clientY - b.top - P.t) / rh);
        const it = items[i] || null;
        if (it !== cur) { hi(cur, false); cur = it; hi(cur, true); }
        if (!it) { tip.hide(); return; }
        const d = it.r.px - it.r.v;
        tip.show([h('b', { text: it.r.name }),
          tipRow('Sufficient view (V)', fmt(it.r.v, 3), h('i', { class: 'mk mk-v' })),
          tipRow('Reduced view (P/X)', fmt(it.r.px, 3), h('i', { class: 'mk mk-px' })),
          h('span', { class: 'sm', text: (d < 0 ? 'Drops ' : 'Rises ') + Math.abs(d).toFixed(3) + ' when the decisive view is hidden' })], e.clientX, e.clientY);
      };
      svg.addEventListener('pointermove', pick);
      svg.addEventListener('pointerdown', pick);
      svg.addEventListener('pointerleave', () => { hi(cur, false); cur = null; tip.hide(); });
      box.replaceChildren(svg);
    }
    draw();
    onResize(box, draw);
  }

  /* ------------------------------------------------------------ leaderboard */
  function board() {
    const S = window.RRM_SITE, tbl = $('#board-table');
    if (!S || !tbl) return;
    const tbody = $('tbody', tbl), ths = $$('th[data-sort]', tbl), filters = $$('#board-filters button');
    const COLS = ['mf1', 'ff1', 'voc', 'tau', 'v', 'px', 'pair'];
    const max = {};
    COLS.forEach((c) => { max[c] = Math.max(...S.board.map((r) => r[c]).filter((v) => v != null)); });
    let kind = 'all', key = 'mf1', asc = false;

    function render() {
      const rows = S.board.filter((r) => kind === 'all' || r.kind === kind).sort((a, b) => {
        if (key === 'name') return asc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
        const av = a[key], bv = b[key];
        if (av == null || bv == null) return (av == null) - (bv == null);
        return asc ? av - bv : bv - av;
      });
      const best = {};
      COLS.forEach((c) => {
        const vs = rows.map((r) => r[c]).filter((v) => v != null);
        best[c] = vs.length ? Math.max(...vs) : null;
      });
      tbody.replaceChildren(...rows.map((r, i) => h('tr', null,
        h('td', { class: 'c-rank', text: String(i + 1) }),
        h('td', { class: 'c-name' }, r.name + (r.interp ? ' †' : ''), h('span', { class: 'meta', text: [r.kind, r.size].filter(Boolean).join(' · ') })),
        COLS.map((c) => {
          const v = r[c], on = c === key && v != null;
          const td = h('td', { class: 'num' + (v != null && v === best[c] ? ' best' : '') + (on ? ' bar' : ''), text: fmt(v, 3) });
          if (on) td.style.setProperty('--w', Math.max(0, v / max[c] * 100).toFixed(1) + '%');
          return td;
        }))));
      ths.forEach((th) => {
        if (th.dataset.sort === key) th.setAttribute('aria-sort', asc ? 'ascending' : 'descending');
        else th.removeAttribute('aria-sort');
      });
    }
    ths.forEach((th) => {
      th.tabIndex = 0;
      const go = () => {
        const k = th.dataset.sort;
        if (k === key) asc = !asc; else { key = k; asc = k === 'name'; }
        render();
      };
      th.addEventListener('click', go);
      th.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); } });
    });
    filters.forEach((b) => b.addEventListener('click', () => {
      kind = b.dataset.kind;
      filters.forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
      render();
    }));
    render();
  }

  /* ------------------------------------------------------------ toolbox code card */
  function hub() {
    const card = $('.code-card');
    if (!card) return;
    const tabs = $$('[role="tab"]', card), pres = $$('pre.code', card);
    tabs.forEach((t) => t.addEventListener('click', () => {
      tabs.forEach((x) => x.setAttribute('aria-selected', String(x === t)));
      pres.forEach((p) => p.classList.toggle('on', p.dataset.code === t.dataset.code));
    }));
    // one block per line, so the first card can type itself in
    pres.forEach((pre) => {
      const code = $('code', pre);
      code.innerHTML = code.innerHTML.split('\n').map((l) => `<span class="ln">${l || ' '}</span>`).join('');
    });
    const host = card.closest('.reveal');
    if (reduced() || !host) return;
    host.addEventListener('reveal', () => {
      const first = pres[0], lines = $$('.ln', first);
      let delay = 300;
      lines.forEach((ln) => {
        const n = Math.max(1, ln.textContent.length), dur = Math.min(950, 20 * n);
        ln.style.animationDuration = dur + 'ms';
        ln.style.animationTimingFunction = `steps(${n}, end)`;
        ln.style.animationDelay = delay + 'ms';
        delay += dur + 80;
      });
      first.classList.add('typing');
      setTimeout(() => lines[lines.length - 1].append(h('span', { class: 'caret', 'aria-hidden': 'true' })), delay);
    }, { once: true });
  }

  /* ------------------------------------------------------------ citation + placeholder links */
  function cite() {
    const btn = $('#copy-bib'), pre = $('#bibtex');
    if (!btn || !pre) return;
    btn.addEventListener('click', async () => {
      const text = pre.textContent.trim();
      let ok = false;
      try { await navigator.clipboard.writeText(text); ok = true; } catch (err) {
        const r = document.createRange();
        r.selectNodeContents(pre);
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(r);
        try { ok = document.execCommand('copy'); } catch (e2) { ok = false; }
        sel.removeAllRanges();
      }
      btn.textContent = ok ? 'Copied' : 'Select and copy';
      btn.classList.toggle('done', ok);
      setTimeout(() => { btn.textContent = 'Copy'; btn.classList.remove('done'); }, 1800);
    });
  }

  function soonLinks() {
    $$('a[data-soon]').forEach((a) => {
      a.setAttribute('aria-disabled', 'true');
      a.title = 'Coming soon';
      a.addEventListener('click', (e) => { e.preventDefault(); toast(a.textContent.trim() + ': link coming soon'); });
    });
  }

  /* ------------------------------------------------------------ boot */
  const run = (name, fn) => { try { fn(); } catch (err) { console.error('[rrm] ' + name, err); } };
  run('nav', nav);
  run('glyphs', glyphs);
  run('counters', counters);
  run('hero', heroTrace);
  run('taxonomy', taxonomy);
  run('suites', suites);
  run('wall', wall);
  run('voc chart', vocChart);
  run('view chart', viewChart);
  run('leaderboard', board);
  run('hub', hub);
  run('cite', cite);
  run('links', soonLinks);
  run('reveal', reveals);
})();
