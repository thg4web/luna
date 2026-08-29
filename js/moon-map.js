/* ============================================================
   Luna — moon-map.js
   Starfield · orthographic quadrangle projection · overlay
   · display controls · geological-map modal
   The 44 LAC geologic-atlas sheets mapped onto a photographic Moon.
   ============================================================ */
'use strict';

/* ----------------------------------------------------------
   1. STARFIELD  (carried from luna)
   ---------------------------------------------------------- */
(function initStarfield() {
  const canvas = document.getElementById('starfield');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let stars = [], animId;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  function buildStars(count) {
    stars = [];
    for (let i = 0; i < count; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.1 + 0.2,
        opacity: Math.random() * 0.65 + 0.2,
        phase: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.018 + 0.004,
      });
    }
  }
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const s of stars) {
      s.phase += s.speed;
      const a = s.opacity * (0.55 + 0.45 * Math.sin(s.phase));
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${a.toFixed(3)})`;
      ctx.fill();
    }
    animId = requestAnimationFrame(draw);
  }
  function init() {
    resize();
    buildStars(320);
    if (animId) cancelAnimationFrame(animId);
    draw();
  }
  window.addEventListener('resize', init);
  init();
})();


/* ----------------------------------------------------------
   2. QUADRANGLE MAP
   ---------------------------------------------------------- */
(function initMoonMap() {
  const img = document.getElementById('moon-map');
  const overlay = document.getElementById('map-overlay');
  const octx = overlay.getContext('2d');
  const label = document.getElementById('quad-label');
  if (!img || !overlay || !label) return;

  /* --- tuned defaults (natural-pixel space of the NASA moon-base.jpg, 730x730)
         disc measured (365.5, 364.5) r 346; lat0/lon0/pa are Aaron's tuned values.
         dx/dy = rigid screen-space nudge of the whole grid (natural px):
         dx +14 ≈ 2% of the disc diameter, toward image-right (2026-08-28 step 1). --- */
  const DEFAULTS = { lat0: 0.1, lon0: 7.6, pa: -0.3, cx: 365.5, cy: 364.5, r: 346, dx: 14, dy: 0 };
  const P = Object.assign({}, DEFAULTS);

  const opt = { labels: true, fill: false, dim: false, disc: false, opacity: 0.70 };

  let ORTHO_BOX = [];        // [{name, href, lac, box:{latS,latN,lonW,lonE}}]
  let quads = [];            // render set: [{name, href, lac, box, points:[[x,y]...]}]
  let hover = -1, pinned = -1, scale = 1;

  /* --- orthographic projection, sub-earth (lat0, lon0), north-up + PA --- */
  const D2R = Math.PI / 180;
  function project(lat, lon) {
    const la = lat * D2R, lo = (lon - P.lon0) * D2R, la0 = P.lat0 * D2R;
    const cosc = Math.sin(la0) * Math.sin(la) + Math.cos(la0) * Math.cos(la) * Math.cos(lo);
    let x = Math.cos(la) * Math.sin(lo);
    let y = Math.cos(la0) * Math.sin(la) - Math.sin(la0) * Math.cos(la) * Math.cos(lo);
    const pa = P.pa * D2R, c = Math.cos(pa), s = Math.sin(pa);
    const xr = x * c - y * s, yr = x * s + y * c;
    return { x: P.cx + P.r * xr + (P.dx || 0), y: P.cy - P.r * yr + (P.dy || 0), vis: cosc >= -0.02 };
  }
  function quadOutline(b, steps) {
    steps = steps || 12;
    const pts = [];
    const push = (lat, lon) => { const q = project(lat, lon); pts.push([q.x, q.y]); };
    for (let i = 0; i < steps; i++) push(b.latS, b.lonW + (b.lonE - b.lonW) * i / steps); // S  W->E
    for (let i = 0; i < steps; i++) push(b.latS + (b.latN - b.latS) * i / steps, b.lonE); // E  S->N
    for (let i = 0; i < steps; i++) push(b.latN, b.lonE + (b.lonW - b.lonE) * i / steps); // N  E->W
    for (let i = 0; i < steps; i++) push(b.latN + (b.latS - b.latN) * i / steps, b.lonW); // W  N->S
    return pts;
  }
  function centroid(pts) {
    let x = 0, y = 0;
    for (const p of pts) { x += p[0]; y += p[1]; }
    return [x / pts.length, y / pts.length];
  }

  function rebuild() {
    quads = ORTHO_BOX.map(q => {
      const pts = quadOutline(q.box);
      return { name: q.name, href: q.href, lac: q.lac, box: q.box, points: pts, c: centroid(pts) };
    });
    hover = -1; pinned = -1;
    draw();
    updateLabel();
  }

  /* --- drawing --- */
  function resize() {
    scale = img.clientWidth / img.naturalWidth;
    overlay.width = img.clientWidth;
    overlay.height = img.clientHeight;
    draw();
  }
  function draw() {
    octx.clearRect(0, 0, overlay.width, overlay.height);
    octx.globalAlpha = opt.opacity;

    if (opt.disc) {
      octx.beginPath();
      octx.arc(P.cx * scale, P.cy * scale, P.r * scale, 0, Math.PI * 2);
      octx.lineWidth = 2;
      octx.strokeStyle = 'rgba(212,168,67,0.9)';
      octx.setLineDash([7, 7]);
      octx.stroke();
      octx.setLineDash([]);
    }

    quads.forEach((q, idx) => {
      octx.beginPath();
      q.points.forEach((p, i) => {
        const x = p[0] * scale, y = p[1] * scale;
        if (i) octx.lineTo(x, y); else octx.moveTo(x, y);
      });
      octx.closePath();
      const on = idx === hover || idx === pinned;
      if (opt.fill) { octx.fillStyle = on ? 'rgba(0,212,255,0.30)' : 'rgba(0,212,255,0.08)'; octx.fill(); }
      octx.lineWidth = on ? 2.6 : 1.4;
      octx.strokeStyle = on ? 'rgba(255,255,255,0.95)' : 'rgba(0,212,255,0.8)';
      octx.stroke();
    });

    if (opt.labels) {
      octx.font = '12px "Space Grotesk", system-ui, sans-serif';
      octx.textAlign = 'center';
      octx.textBaseline = 'middle';
      quads.forEach((q, idx) => {
        const x = q.c[0] * scale, y = q.c[1] * scale;
        const w = octx.measureText(q.name).width;
        octx.globalAlpha = opt.opacity;
        octx.fillStyle = 'rgba(3,3,15,0.66)';
        octx.fillRect(x - w / 2 - 3, y - 8, w + 6, 16);
        octx.fillStyle = (idx === hover || idx === pinned) ? '#00d4ff' : '#e8eaf0';
        octx.fillText(q.name, x, y + 1);
      });
    }
    octx.globalAlpha = 1;
  }

  /* --- hit testing --- */
  function pip(px, py, poly) {
    let inside = false;
    for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
      const xi = poly[i][0], yi = poly[i][1], xj = poly[j][0], yj = poly[j][1];
      if (((yi > py) !== (yj > py)) && (px < (xj - xi) * (py - yi) / (yj - yi) + xi)) inside = !inside;
    }
    return inside;
  }
  function hitAt(clientX, clientY) {
    const r = img.getBoundingClientRect();
    const px = (clientX - r.left) / scale, py = (clientY - r.top) / scale;
    for (let i = 0; i < quads.length; i++) if (pip(px, py, quads[i].points)) return i;
    return -1;
  }
  function updateLabel() {
    const i = hover >= 0 ? hover : pinned;
    if (i < 0) { label.textContent = ''; return; }
    const q = quads[i];
    let meta = q.lac ? q.lac : '';
    if (q.box) {
      const b = q.box;
      meta += `  ·  lat ${b.latS}°..${b.latN}°   lon ${b.lonW}°..${b.lonE}°`;
    }
    label.innerHTML = q.name + (meta ? `<span class="meta">${meta}</span>` : '');
  }

  img.parentElement.addEventListener('mousemove', e => {
    const h = hitAt(e.clientX, e.clientY);
    if (h !== hover) { hover = h; draw(); updateLabel(); }
  });
  img.parentElement.addEventListener('mouseleave', () => { hover = -1; draw(); updateLabel(); });
  img.parentElement.addEventListener('click', e => {
    const h = hitAt(e.clientX, e.clientY);
    if (h >= 0) { pinned = h; openModal(quads[h].name, quads[h].href); }
    draw(); updateLabel();
  });

  img.addEventListener('load', resize);
  if (img.complete && img.naturalWidth) resize();
  window.addEventListener('resize', resize);

  /* --- display controls --- */
  const bind = (id, fn) => { const el = document.getElementById(id); if (el) el.addEventListener('change', fn); };
  bind('tLabels', e => { opt.labels = e.target.checked; draw(); });
  bind('tFill', e => { opt.fill = e.target.checked; draw(); });
  bind('tDim', e => { opt.dim = e.target.checked; img.classList.toggle('dim', opt.dim); });
  bind('tDisc', e => { opt.disc = e.target.checked; draw(); });

  (function opacitySlider() {
    const el = document.getElementById('tOpacity'), out = document.getElementById('oOpacity');
    if (!el) return;
    el.addEventListener('input', () => {
      const v = parseFloat(el.value);
      out.textContent = v.toFixed(2);
      opt.opacity = v;
      draw();
    });
  })();

  /* --- modal (carried from luna, incl. open-full-size-in-new-tab) --- */
  const modal = document.getElementById('quad-modal');
  const titleEl = document.getElementById('modal-title');
  const mImg = document.getElementById('modal-img');
  const mLink = document.getElementById('modal-img-link');
  const closeBtn = modal && modal.querySelector('.modal-close');
  const backdrop = modal && modal.querySelector('.modal-backdrop');
  let prevFocus = null;

  function openModal(name, src) {
    prevFocus = document.activeElement;
    titleEl.textContent = name;
    mImg.src = src;
    mImg.alt = name + ' — USGS geological map quadrangle';
    if (mLink) mLink.href = src;
    modal.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  }
  function closeModal() {
    modal.setAttribute('hidden', '');
    mImg.src = '';
    if (mLink) mLink.removeAttribute('href');
    document.body.style.overflow = '';
    if (prevFocus) prevFocus.focus();
  }
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (backdrop) backdrop.addEventListener('click', closeModal);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !modal.hasAttribute('hidden')) closeModal();
  });
  if (modal) modal.addEventListener('keydown', e => {
    if (e.key !== 'Tab') return;
    const f = Array.from(modal.querySelectorAll('button, [href], input, [tabindex]:not([tabindex="-1"])'))
      .filter(el => !el.closest('[hidden]'));
    if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });

  /* --- load data (function declarations above are hoisted, so the click
         handler can reference openModal before this resolves) --- */
  fetch('data/quads-ortho.json')
    .then(r => r.json())
    .then(ortho => { ORTHO_BOX = ortho; rebuild(); })
    .catch(err => {
      label.textContent = 'Failed to load quad data — serve this folder over http (not file://).';
      console.error(err);
    });
})();
