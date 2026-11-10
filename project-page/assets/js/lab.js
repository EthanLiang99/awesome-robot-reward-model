/* Reward Lab: one real RRM-Bench-1K execution at a time, its video synced with
   the human task-state label and nine evaluators' saved outputs.
   Needs main.js (window.RRM) and assets/data/cases.js (window.RRM_CASES). */
(() => {
  'use strict';
  const D = window.RRM_CASES, U = window.RRM, root = document.getElementById('lab-root');
  if (!D || !U || !root) return;
  const { $, $$, h, svgEl, svgText, fmt, clamp, interp, linePath, areaPath, icon, tip, tipRow, reduced, watch, onResize } = U;

  const SUITES = {
    A: { name: 'Action–Effect', slogan: 'Motion ≠ effect', desc: 'Task-like motion, but the required effect never happens.', def: 'sweep_trash_not_swept' },
    B: { name: 'Semantic / Ordered', slogan: 'Manipulation ≠ constraint', desc: 'Grasp, carry and release succeed with the wrong object, destination or order.', def: 'sandwich_order_skipped' },
    C: { name: 'Persistence / Reversal', slogan: 'Attained ≠ still holds', desc: 'An achieved condition is later lost, so credit should fall.', def: 'books_shelf_swept' },
    D: { name: 'Visibility', slogan: 'Unknown ≠ failure', desc: 'The wrist camera misses the decisive state; switch to the fixed camera to compare.', def: 'plates_wrist_view' },
  };
  const ORDER = ['A', 'B', 'C', 'D'];
  const MODELS = D.models, byKey = new Map(MODELS.map((m) => [m.key, m]));
  const byId = new Map(D.cases.map((c) => [c.id, c]));
  const RATES = [1, 2, 0.5];
  // chart marker icons, drawn around (0, 0)
  const MK = { success: 'M-3,0.3l2,2l4,-4.3', failure: 'M-2.4,-2.4l4.8,4.8M2.4,-2.4l-4.8,4.8', neutral: 'M0,0h0.01' };

  const el = {
    tabs: $('#lab-tabs'), slogan: $('#lab-slogan'), cases: $('#lab-cases'), video: $('#lab-video'),
    cam: $('#lab-cam'), event: $('#lab-event'), play: $('#lab-play'), scrub: $('#lab-scrub'),
    time: $('#lab-time'), speed: $('#lab-speed'), camT: $('#lab-camtoggle'), inst: $('#lab-inst'),
    desc: $('#lab-desc'), readout: $('#lab-readout'), chart: $('#lab-chart'), events: $('#lab-events'),
    legendModel: $('#lab-legend-model'), others: $('#lab-others'), models: $('#lab-models'),
  };
  const video = el.video;
  const st = { suite: 'C', id: 'books_shelf_swept', view: null, model: 'vlaccut', others: true, rate: 1 };
  let C = null, V = null, G = null, R = null;
  let raf = 0, lastT = 0, userPaused = false, wantPlay = false, pendingSeek = null, evTimer = 0;

  const dur = () => (C ? C.duration : 0);
  const curT = () => (video.ended ? dur() : clamp(video.currentTime || 0, 0, dur()));

  function viewOf(c, key) {
    if (c.views) return Object.assign({ key }, c.views[key]);
    const wrist = c.camera === 'wrist';
    return { key: null, label: wrist ? 'Wrist camera' : 'Fixed camera', video: c.video, poster: c.poster, models: c.models };
  }

  /* ------------------------------------------------------------ selection */
  function renderTabs() {
    el.tabs.replaceChildren(...ORDER.map((s, i) => {
      const b = h('button', { type: 'button', role: 'tab', class: 'lab-tab', 'aria-selected': String(s === st.suite), tabindex: s === st.suite ? '0' : '-1' },
        h('b', { text: s }), SUITES[s].name);
      b.addEventListener('click', () => selectSuite(s, null, !reduced()));
      b.addEventListener('keydown', (e) => {
        const j = e.key === 'ArrowRight' ? (i + 1) % 4 : e.key === 'ArrowLeft' ? (i + 3) % 4 : -1;
        if (j < 0) return;
        e.preventDefault();
        selectSuite(ORDER[j], null, false);
        el.tabs.children[j].focus();
      });
      return b;
    }));
    el.slogan.replaceChildren(h('b', { text: SUITES[st.suite].slogan }), SUITES[st.suite].desc);
  }

  function renderCases() {
    el.cases.replaceChildren(...D.cases.filter((c) => c.suite === st.suite).map((c) => {
      const b = h('button', { type: 'button', class: 'case-chip', 'aria-pressed': String(c.id === st.id) },
        h('img', { src: c.views ? c.views.P.poster : c.poster, alt: '', loading: 'lazy', width: '52', height: '39' }),
        h('span', null, c.title, h('small', { text: `${c.task} · ${Math.round(c.duration)} s` })));
      b.addEventListener('click', () => { if (c.id !== st.id) selectCase(c.id, !reduced()); });
      return b;
    }));
  }

  function selectSuite(s, id, play) {
    st.suite = s;
    const c = id && byId.get(id);
    st.id = c && c.suite === s ? id : SUITES[s].def;
    renderTabs();
    renderCases();
    loadCase(play);
  }
  function selectCase(id, play) {
    st.id = id;
    renderCases();
    loadCase(play);
  }
  function loadCase(play) {
    C = byId.get(st.id);
    st.view = C.views ? 'P' : null;
    V = viewOf(C, st.view);
    el.inst.textContent = '“' + C.instruction + '”';
    el.desc.textContent = C.desc;
    el.camT.hidden = !C.views;
    renderCam();
    renderEvents();
    renderModels();
    setVideo(0, play);
    buildChart();
    lastT = 0;
    update(0);
  }
  function selectView(key) {
    if (!C || !C.views || key === st.view) return;
    const t = curT(), playing = !video.paused && !video.ended;
    st.view = key;
    V = viewOf(C, key);
    renderCam();
    renderModels();
    setVideo(t, playing);
    buildChart();
    update(t);
  }
  function renderCam() {
    $$('button', el.camT).forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.view === st.view)));
  }

  function renderModels() {
    const flatGt = C.gt.every((p) => p[1] === C.gt[0][1]);
    el.models.replaceChildren(...MODELS.map((M) => {
      const m = V.models.find((x) => x.key === M.key);
      const rNote = m && m.r == null ? (flatGt ? 'Undefined: the label is constant on this clip' : 'Undefined: this output is constant on this clip') : 'Pearson r with the label on this clip';
      const b = h('button', { type: 'button', class: 'mchip', 'aria-pressed': String(M.key === st.model) },
        h('b', { text: M.name }),
        h('span', { class: 'sub', text: M.sub }),
        h('span', { class: 'st' },
          h('span', { title: 'Benchmark VOC (Table III)' }, 'VOC ', h('em', { text: M.voc.toFixed(3) })),
          h('span', { title: rNote }, 'r ', h('em', { text: m && m.r != null ? m.r.toFixed(2) : '—' })),
          h('span', { title: 'Final output on this clip' }, 'end ', h('em', { text: m ? fmt(m.end) : '—' }))));
      b.addEventListener('click', () => {
        if (M.key === st.model) return;
        st.model = M.key;
        renderModels();
        buildChart();
        update(curT());
      });
      return b;
    }));
    el.legendModel.textContent = byKey.get(st.model).name;
  }

  function renderEvents() {
    el.events.replaceChildren(...C.events.map((e) => {
      const b = h('button', { type: 'button', class: 'ev' }, icon(e.kind), e.label, h('time', { text: e.t.toFixed(1) + ' s' }));
      b.addEventListener('click', () => { seek(Math.max(0, e.t - 1.5)); userPaused = false; play(); });
      return h('li', null, b);
    }));
    $$('.ev-tick', el.scrub).forEach((n) => n.remove());
    C.events.forEach((e) => el.scrub.append(h('i', { class: 'ev-tick ' + e.kind, style: `left:${(e.t / C.duration * 100).toFixed(2)}%` })));
  }

  /* ------------------------------------------------------------ video */
  function setVideo(t, play) {
    stopLoop();
    wantPlay = !!play;
    pendingSeek = t > 0.01 ? t : null;
    el.cam.textContent = V.label;
    video.poster = V.poster;
    video.src = V.video;
    video.defaultPlaybackRate = st.rate;
    video.playbackRate = st.rate;
    el.play.classList.remove('playing');
  }
  function play() {
    if (video.ended || curT() >= dur() - 0.06) video.currentTime = 0;
    const p = video.play();
    if (p && p.catch) p.catch(() => {});
  }
  function toggle() {
    if (video.paused || video.ended) { userPaused = false; play(); } else { userPaused = true; video.pause(); }
  }
  function seek(t) {
    t = clamp(t, 0, dur());
    if (video.readyState >= 1) video.currentTime = Math.min(t, (video.duration || dur()) - 0.03);
    else pendingSeek = t;
    update(t);
  }
  function startLoop() {
    cancelAnimationFrame(raf);
    const step = () => { update(curT()); raf = requestAnimationFrame(step); };
    raf = requestAnimationFrame(step);
  }
  function stopLoop() { cancelAnimationFrame(raf); raf = 0; }

  video.addEventListener('loadedmetadata', () => {
    video.playbackRate = st.rate;
    if (pendingSeek != null) { video.currentTime = Math.min(pendingSeek, video.duration - 0.05); pendingSeek = null; }
    if (wantPlay) { wantPlay = false; play(); }
  });
  video.addEventListener('play', () => { el.play.classList.add('playing'); el.play.setAttribute('aria-label', 'Pause'); startLoop(); });
  video.addEventListener('pause', () => { el.play.classList.remove('playing'); el.play.setAttribute('aria-label', 'Play'); stopLoop(); update(curT()); });
  video.addEventListener('ended', () => update(dur()));
  video.addEventListener('seeked', () => { if (video.paused) update(curT()); });
  video.addEventListener('click', toggle);
  el.play.addEventListener('click', toggle);
  el.speed.addEventListener('click', () => {
    st.rate = RATES[(RATES.indexOf(st.rate) + 1) % RATES.length];
    video.defaultPlaybackRate = st.rate;
    video.playbackRate = st.rate;
    el.speed.textContent = st.rate + '×';
  });
  $$('button', el.camT).forEach((b) => b.addEventListener('click', () => selectView(b.dataset.view)));
  el.others.addEventListener('change', () => { st.others = el.others.checked; buildChart(); update(curT()); });

  // scrub bar
  let dragging = false;
  const tAt = (e) => { const r = el.scrub.getBoundingClientRect(); return clamp((e.clientX - r.left) / r.width, 0, 1) * dur(); };
  el.scrub.addEventListener('pointerdown', (e) => { dragging = true; el.scrub.setPointerCapture(e.pointerId); seek(tAt(e)); });
  el.scrub.addEventListener('pointermove', (e) => { if (dragging) seek(tAt(e)); });
  el.scrub.addEventListener('pointerup', () => { dragging = false; });
  el.scrub.addEventListener('pointercancel', () => { dragging = false; });
  const keySeek = (e) => {
    const k = e.key;
    if (k === ' ' || k === 'Enter') { e.preventDefault(); toggle(); return; }
    const t = k === 'ArrowRight' ? curT() + 1 : k === 'ArrowLeft' ? curT() - 1 : k === 'Home' ? 0 : k === 'End' ? dur() : null;
    if (t == null) return;
    e.preventDefault();
    seek(t);
  };
  el.scrub.addEventListener('keydown', keySeek);
  el.chart.addEventListener('keydown', keySeek);

  /* ------------------------------------------------------------ chart */
  function buildChart() {
    const box = el.chart, W = box.clientWidth, H = box.clientHeight;
    if (!C || !W || !H) return;
    const T = dur(), P = { l: 32, r: 10, t: 24, b: 24 };
    // one y-scale for every view of the case, so switching cameras keeps it
    const sets = [C.gt];
    (C.views ? Object.values(C.views) : [C]).forEach((v) => v.models.forEach((m) => sets.push(m.pts)));
    let lo = 0, hi = 1;
    sets.forEach((pts) => pts.forEach((p) => { if (p[1] < lo) lo = p[1]; if (p[1] > hi) hi = p[1]; }));
    lo = Math.floor(lo * 10 - 1e-9) / 10;
    hi = Math.ceil(hi * 10 - 1e-9) / 10;
    const x = (t) => P.l + (t / T) * (W - P.l - P.r);
    const y = (v) => P.t + ((hi - v) / (hi - lo)) * (H - P.t - P.b);

    const svg = svgEl('svg', { viewBox: `0 0 ${W} ${H}`, width: W, height: H, 'aria-hidden': 'true' });
    const mask = svgEl('mask', { id: 'lab-mask', maskUnits: 'userSpaceOnUse', x: 0, y: 0, width: W, height: H }, svgEl('defs', null, svg));
    const past = svgEl('rect', { x: 0, y: 0, width: 0, height: H, fill: '#fff' }, mask);
    const fut = svgEl('rect', { x: 0, y: 0, width: W, height: H, fill: '#fff', 'fill-opacity': 0.3 }, mask);

    const grid = svgEl('g', { class: 'grid' }, svg);
    for (let v = Math.ceil(lo * 4 - 1e-9) / 4; v <= hi + 1e-9; v += 0.25) {
      svgEl('line', { x1: P.l, x2: W - P.r, y1: y(v), y2: y(v), class: Math.abs(v) < 1e-9 ? 'base-line' : null }, grid);
      if (Math.abs(v * 2 - Math.round(v * 2)) < 1e-9) svgText(grid, { x: P.l - 7, y: y(v) + 3.5, 'text-anchor': 'end', class: 'tk' }, v === 0 ? '0' : v === 1 ? '1' : v.toFixed(1).replace(/^(-?)0\./, '$1.'));
    }
    const step = T > 30 ? 10 : T > 12 ? 5 : 2;
    for (let s = 0; s <= T + 1e-9; s += step) svgText(grid, { x: x(s), y: H - 6, 'text-anchor': s === 0 ? 'start' : 'middle', class: 'tk' }, s + (s + step > T ? ' s' : ''));

    C.reversals.forEach(([a, b]) => svgEl('rect', { x: x(a), y: P.t, width: Math.max(2, x(b) - x(a)), height: H - P.t - P.b, class: 'rev' }, svg));
    const evs = C.events.map((e) => {
      svgEl('line', { x1: x(e.t), x2: x(e.t), y1: P.t, y2: H - P.b, class: 'ev-line' }, svg);
      const g = svgEl('g', { class: 'ev-mk ' + e.kind, transform: `translate(${x(e.t).toFixed(1)},${P.t - 11})` }, svg);
      svgEl('circle', { r: 6.5 }, g);
      svgEl('path', { d: MK[e.kind] || MK.neutral }, g);
      return g;
    });

    const plot = svgEl('g', { mask: 'url(#lab-mask)' }, svg);
    svgEl('path', { d: areaPath(C.gt, x, y, y(Math.max(lo, 0))), class: 'gt-area' }, plot);
    if (st.others) V.models.forEach((m) => { if (m.key !== st.model) svgEl('path', { d: linePath(m.pts, x, y), class: 'ctx-line' }, plot); });
    svgEl('path', { d: linePath(C.gt, x, y), class: 'gt-line' }, plot);
    const sel = V.models.find((m) => m.key === st.model) || null;
    if (sel) svgEl('path', { d: linePath(sel.pts, x, y), class: 'm-line' }, plot);

    const hv = svgEl('g', { class: 'hv', opacity: 0 }, svg);
    const hvL = svgEl('line', { y1: P.t, y2: H - P.b }, hv);
    const ph = svgEl('g', { class: 'ph' }, svg);
    const phL = svgEl('line', { y1: P.t - 3, y2: H - P.b }, ph);
    const dG = svgEl('circle', { r: 4.5, class: 'dot dot-gt' }, ph);
    const dM = svgEl('circle', { r: 4.5, class: 'dot dot-m' }, ph);
    box.replaceChildren(svg);

    const name = byKey.get(st.model).name;
    box.setAttribute('aria-label', `Task-state label and evaluator outputs over ${Math.round(T)} seconds of “${C.task}”. ` +
      `${name} ends at ${sel ? fmt(sel.end) : 'no value'}; the label ends at ${fmt(C.gtEnd)}. Arrow keys seek, space plays.`);
    G = { x, y, P, W, H, T, past, fut, hv, hvL, phL, dG, dM, sel, evs };
    buildReadout(name);
  }

  function buildReadout(name) {
    const t = h('span'), g = h('span'), m = h('span');
    el.readout.replaceChildren(
      h('span', null, 't ', t),
      h('span', null, h('i', { class: 'key' }), 'Task state ', g),
      h('span', null, h('i', { class: 'key key-model' }), name + ' ', m));
    R = { t, g, m };
  }

  function update(t) {
    if (!G) return;
    t = clamp(t, 0, G.T);
    const xp = G.x(t);
    G.past.setAttribute('width', xp);
    G.fut.setAttribute('x', xp);
    G.fut.setAttribute('width', Math.max(0, G.W - xp));
    G.phL.setAttribute('x1', xp);
    G.phL.setAttribute('x2', xp);
    const gv = interp(C.gt, t), mv = G.sel ? interp(G.sel.pts, t) : null;
    G.dG.setAttribute('cx', xp);
    G.dG.setAttribute('cy', G.y(gv));
    G.dM.setAttribute('opacity', mv == null ? 0 : 1);
    if (mv != null) { G.dM.setAttribute('cx', xp); G.dM.setAttribute('cy', G.y(mv)); }
    if (R) { R.t.textContent = t.toFixed(1) + ' s'; R.g.textContent = fmt(gv); R.m.textContent = fmt(mv); }

    const pct = G.T ? (t / G.T) * 100 : 0;
    el.scrub.firstElementChild.style.width = pct + '%';
    el.scrub.children[1].style.left = pct + '%';
    el.scrub.setAttribute('aria-valuenow', String(Math.round(pct)));
    el.scrub.setAttribute('aria-valuetext', t.toFixed(1) + ' seconds');
    el.time.textContent = t.toFixed(1) + ' s';

    const chips = el.events.querySelectorAll('.ev');
    // an event stamped at the clip's last frame can sit a few ms past the video's end
    const evT = (e) => Math.min(e.t, G.T);
    C.events.forEach((e, i) => {
      const on = t >= evT(e) - 0.05;
      if (chips[i]) chips[i].classList.toggle('past', on);
      if (G.evs[i]) G.evs[i].classList.toggle('past', on);
    });
    // announce an event the playhead just crossed while playing
    if (!video.paused && t > lastT && t - lastT < 0.8) {
      let hit = null;
      for (const e of C.events) if (evT(e) > lastT && evT(e) <= t) hit = e;
      if (hit) flashEvent(hit);
    }
    lastT = t;
  }

  function flashEvent(e) {
    el.event.replaceChildren(icon(e.kind), e.label);
    el.event.classList.add('show');
    clearTimeout(evTimer);
    evTimer = setTimeout(() => el.event.classList.remove('show'), 1900);
  }

  // hover: crosshair + values; click or tap seeks
  const tAtChart = (e) => {
    const r = el.chart.getBoundingClientRect();
    return clamp(((e.clientX - r.left - G.P.l) / (G.W - G.P.l - G.P.r)) * G.T, 0, G.T);
  };
  function hover(e) {
    if (!G) return;
    const t = tAtChart(e), xx = G.x(t);
    G.hvL.setAttribute('x1', xx);
    G.hvL.setAttribute('x2', xx);
    G.hv.setAttribute('opacity', 1);
    const near = C.events.find((ev) => Math.abs(ev.t - t) <= Math.max(0.3, G.T * 0.015));
    tip.show([
      h('b', { text: t.toFixed(1) + ' s' }),
      near ? h('span', { class: 'sm', text: near.label }) : null,
      tipRow('Task state', fmt(interp(C.gt, t)), h('i', { class: 'key' })),
      tipRow(byKey.get(st.model).name, fmt(G.sel ? interp(G.sel.pts, t) : null), h('i', { class: 'key key-model' })),
    ], e.clientX, e.clientY);
  }
  el.chart.addEventListener('pointermove', hover);
  el.chart.addEventListener('pointerleave', () => { if (G) G.hv.setAttribute('opacity', 0); tip.hide(); });
  el.chart.addEventListener('click', (e) => { if (G) { seek(tAtChart(e)); if (e.pointerType && e.pointerType !== 'mouse') hover(e); } });

  /* ------------------------------------------------------------ boot */
  window.RRMLab = {
    // model (optional): select this evaluator's trace, as the hero link does for its own curve
    open(suite, id, model) {
      if (!SUITES[suite]) return;
      userPaused = false;
      const pick = !!model && byKey.has(model) && model !== st.model;
      if (pick) st.model = model;
      if (suite === st.suite && (!id || id === st.id)) {
        if (pick) { renderModels(); buildChart(); update(curT()); }
        if (!reduced()) play();
        return;
      }
      selectSuite(suite, id, !reduced());
    },
  };
  selectSuite(st.suite, st.id, false);
  onResize(el.chart, () => { buildChart(); update(curT()); });
  // play while the lab is on screen, unless the visitor paused it
  watch(root, (on) => {
    if (on) { if (!userPaused && !reduced() && video.paused && !video.ended) play(); }
    else if (!video.paused) video.pause();
  }, { rootMargin: '-30% 0px -30% 0px', threshold: 0 });
  document.addEventListener('visibilitychange', () => { if (document.hidden && !video.paused) video.pause(); });
})();
