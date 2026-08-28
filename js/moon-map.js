/* ============================================================
   Luna — moon-map.js
   Starfield · Quadrangle hover glow · Modal · Responsive map
   Terry (Web Assistant) under Lila's direction
   ============================================================ */

'use strict';

/* ----------------------------------------------------------
   1. STARFIELD
   Animated twinkling star canvas fixed in the background.
   ---------------------------------------------------------- */
(function initStarfield() {
  const canvas = document.getElementById('starfield');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let stars = [];
  let animId;

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function buildStars(count) {
    stars = [];
    for (let i = 0; i < count; i++) {
      stars.push({
        x:       Math.random() * canvas.width,
        y:       Math.random() * canvas.height,
        r:       Math.random() * 1.1 + 0.2,
        opacity: Math.random() * 0.65 + 0.2,
        phase:   Math.random() * Math.PI * 2,
        speed:   Math.random() * 0.018 + 0.004,
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const s of stars) {
      s.phase += s.speed;
      const alpha = s.opacity * (0.55 + 0.45 * Math.sin(s.phase));
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${alpha.toFixed(3)})`;
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
   2. RESPONSIVE IMAGE MAP
   Rescales the <area> coords whenever the image size changes,
   so clickable regions stay accurate at any viewport width.
   ---------------------------------------------------------- */
(function initResponsiveMap() {
  const img   = document.getElementById('moon-map');
  const areas = Array.from(document.querySelectorAll('map[name="image-map"] area'));
  if (!img || areas.length === 0) return;

  // Store original coords once (keyed to natural image dimensions)
  areas.forEach(area => {
    area.dataset.originalCoords = area.getAttribute('coords');
  });

  function rescale() {
    if (!img.naturalWidth) return;
    const sx = img.offsetWidth  / img.naturalWidth;
    const sy = img.offsetHeight / img.naturalHeight;
    areas.forEach(area => {
      const nums = area.dataset.originalCoords.split(',').map(Number);
      const scaled = nums.map((n, i) => Math.round(n * (i % 2 === 0 ? sx : sy)));
      area.setAttribute('coords', scaled.join(','));
    });
  }

  img.addEventListener('load', rescale);
  if (img.complete && img.naturalWidth) rescale();
  window.addEventListener('resize', rescale);
})();


/* ----------------------------------------------------------
   3. HOVER GLOW OVERLAY
   Draws a glowing polygon highlight on a canvas positioned
   exactly over the moon image when user hovers an area.
   ---------------------------------------------------------- */
(function initHoverOverlay() {
  const img     = document.getElementById('moon-map');
  const overlay = document.getElementById('map-overlay');
  const label   = document.getElementById('quad-label');
  const areas   = Array.from(document.querySelectorAll('map[name="image-map"] area'));
  if (!img || !overlay || !label || areas.length === 0) return;

  const ctx = overlay.getContext('2d');

  function syncSize() {
    overlay.width  = img.offsetWidth;
    overlay.height = img.offsetHeight;
  }

  function getScale() {
    if (!img.naturalWidth) return { x: 1, y: 1 };
    return {
      x: img.offsetWidth  / img.naturalWidth,
      y: img.offsetHeight / img.naturalHeight,
    };
  }

  function parseOriginalCoords(area) {
    const src = area.dataset.originalCoords || area.getAttribute('coords');
    const nums = src.split(',').map(Number);
    const pts  = [];
    for (let i = 0; i < nums.length; i += 2) {
      pts.push({ x: nums[i], y: nums[i + 1] });
    }
    return pts;
  }

  function drawGlow(points) {
    const { x: sx, y: sy } = getScale();
    ctx.clearRect(0, 0, overlay.width, overlay.height);

    ctx.beginPath();
    ctx.moveTo(points[0].x * sx, points[0].y * sy);
    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i].x * sx, points[i].y * sy);
    }
    ctx.closePath();

    ctx.fillStyle   = 'rgba(74, 158, 255, 0.15)';
    ctx.fill();

    ctx.strokeStyle = 'rgba(0, 212, 255, 0.75)';
    ctx.lineWidth   = 1.5;
    ctx.shadowColor = 'rgba(0, 212, 255, 0.7)';
    ctx.shadowBlur  = 14;
    ctx.stroke();

    // Reset shadow so it doesn't bleed into future draws
    ctx.shadowBlur  = 0;
    ctx.shadowColor = 'transparent';
  }

  function clearGlow() {
    ctx.clearRect(0, 0, overlay.width, overlay.height);
    label.textContent = '';
  }

  function onEnter(area) {
    drawGlow(parseOriginalCoords(area));
    label.textContent = area.dataset.name || area.getAttribute('title') || '';
  }

  areas.forEach(area => {
    area.addEventListener('mouseover', () => onEnter(area));
    area.addEventListener('mouseout',  clearGlow);
    area.addEventListener('focus',     () => onEnter(area));
    area.addEventListener('blur',      clearGlow);
  });

  img.addEventListener('load', syncSize);
  if (img.complete) syncSize();
  window.addEventListener('resize', syncSize);
})();


/* ----------------------------------------------------------
   4. MODAL — quadrangle detail viewer
   Intercepts area clicks and opens the geological map in a
   styled modal instead of navigating to a raw JPG.
   ---------------------------------------------------------- */
(function initModal() {
  const modal      = document.getElementById('quad-modal');
  const titleEl    = document.getElementById('modal-title');
  const imgEl      = document.getElementById('modal-img');
  const linkEl     = document.getElementById('modal-img-link');
  const closeBtn   = modal && modal.querySelector('.modal-close');
  const backdrop   = modal && modal.querySelector('.modal-backdrop');
  const areas      = Array.from(document.querySelectorAll('map[name="image-map"] area'));
  if (!modal || !titleEl || !imgEl || areas.length === 0) return;

  let previousFocus = null;

  function openModal(name, src) {
    previousFocus         = document.activeElement;
    titleEl.textContent   = name;
    imgEl.src             = src;
    imgEl.alt             = name + ' — USGS geological map quadrangle';
    if (linkEl) linkEl.href = src;
    modal.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  }

  function closeModal() {
    modal.setAttribute('hidden', '');
    imgEl.src                    = '';
    if (linkEl) linkEl.removeAttribute('href');
    document.body.style.overflow = '';
    if (previousFocus) previousFocus.focus();
  }

  areas.forEach(area => {
    area.addEventListener('click', e => {
      e.preventDefault();
      openModal(
        area.dataset.name || area.getAttribute('title') || 'Quadrangle',
        area.getAttribute('href')
      );
    });
  });

  closeBtn.addEventListener('click',   closeModal);
  backdrop.addEventListener('click',   closeModal);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !modal.hasAttribute('hidden')) closeModal();
  });

  // Trap focus inside modal while open
  modal.addEventListener('keydown', e => {
    if (e.key !== 'Tab') return;
    const focusable = Array.from(
      modal.querySelectorAll('button, [href], input, [tabindex]:not([tabindex="-1"])')
    ).filter(el => !el.closest('[hidden]'));
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last  = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  });
})();
