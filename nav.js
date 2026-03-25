/*!
 * nav.js — Shared navigation, sidebar, theming & Allen-Cahn phase field
 * Luca Pignatelli Academic Portfolio
 */

(function () {
  'use strict';

  /* ────────────────────────────────────────────────────────────
     ALLEN-CAHN PHASE FIELD SIMULATION
     100×100 grid, eps²=0.028, dt=0.38
     Convergence detection → automatic time-reversal (no jumps)
     Theme toggle inverts u → -u (interfaces stable, colours flip)
  ──────────────────────────────────────────────────────────── */
  var AC = (function () {
    var N = 100, eps2 = 0.028, dt = 0.38;
    var grid = new Float32Array(N * N);
    var next = new Float32Array(N * N);
    var direction = 1;
    var stepsSinceFlip = 0;
    var changeLog = [];
    var LOG = 30;
    var canvas, ctx, imgData;
    var animHandle;

    function init() {
      for (var i = 0; i < N * N; i++) grid[i] = (Math.random() - 0.5) * 2.0;
      for (var k = 0; k < 12; k++) doStep(1); /* smooth initial state */
    }

    function doStep(dir) {
      var totalChange = 0;
      for (var r = 0; r < N; r++) {
        for (var c = 0; c < N; c++) {
          var i = r * N + c;
          var u = grid[i];
          var up = grid[((r - 1 + N) % N) * N + c];
          var dn = grid[((r + 1) % N) * N + c];
          var lt = grid[r * N + ((c - 1 + N) % N)];
          var rt = grid[r * N + ((c + 1) % N)];
          var lap = up + dn + lt + rt - 4 * u;
          var dW  = u * u * u - u;            /* W'(u) for W=(u²-1)²/4 */
          var nv  = u + dir * dt * (eps2 * lap - dW);
          if (nv < -1.1) nv = -1.1;
          if (nv >  1.1) nv =  1.1;
          next[i] = nv;
          totalChange += nv > u ? nv - u : u - nv;
        }
      }
      var tmp = grid; grid = next; next = tmp;
      return totalChange / (N * N);
    }

    function step() {
      var change = doStep(direction);
      changeLog.push(change);
      if (changeLog.length > LOG) changeLog.shift();
      stepsSinceFlip++;

      if (changeLog.length >= LOG && stepsSinceFlip > 80) {
        var avg = 0;
        for (var k = 0; k < changeLog.length; k++) avg += changeLog[k];
        avg /= changeLog.length;

        if (direction === 1 && avg < 0.00022) {
          /* Converging forward: flip to backward */
          direction = -1; stepsSinceFlip = 0; changeLog = [];
        } else if (direction === -1 && avg > 0.005 && stepsSinceFlip > 60) {
          /* Diverging backward enough: flip forward again */
          direction = 1; stepsSinceFlip = 0; changeLog = [];
        }
      }
    }

    function getColors() {
      var dark = document.documentElement.getAttribute('data-theme') === 'dark';
      if (dark) {
        /* Dark: +1 = deep blue-navy, -1 = near-black */
        return { hiR:18, hiG:26, hiB:42,  loR:4,  loG:4,  loB:8  };
      } else {
        /* Light: +1 = warm cream, -1 = cool blue-white */
        return { hiR:245, hiG:240, hiB:230, loR:232, loG:238, loB:248 };
      }
    }

    function draw() {
      if (!canvas || !ctx || !imgData) return;
      var w = canvas.width, h = canvas.height;
      var data = imgData.data;
      var C = getColors();
      var cw = w / N, ch = h / N;
      for (var r = 0; r < N; r++) {
        for (var c = 0; c < N; c++) {
          var u = grid[r * N + c];
          if (u < -1) u = -1; if (u > 1) u = 1;
          var t = (u + 1) * 0.5;
          var R = (C.loR + t * (C.hiR - C.loR)) | 0;
          var G = (C.loG + t * (C.hiG - C.loG)) | 0;
          var B = (C.loB + t * (C.hiB - C.loB)) | 0;
          var px = (c * cw) | 0, py = (r * ch) | 0;
          var pw = (((c + 1) * cw) | 0) - px + 1;
          var ph = (((r + 1) * ch) | 0) - py + 1;
          for (var dy = 0; dy < ph && py + dy < h; dy++) {
            for (var dx = 0; dx < pw && px + dx < w; dx++) {
              var idx = ((py + dy) * w + (px + dx)) * 4;
              data[idx]     = R;
              data[idx + 1] = G;
              data[idx + 2] = B;
              data[idx + 3] = 255;
            }
          }
        }
      }
      ctx.putImageData(imgData, 0, 0);
    }

    function resize() {
      if (!canvas) return;
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
      imgData = ctx.createImageData(canvas.width, canvas.height);
    }

    var lastDraw = 0;
    function loop(t) {
      step(); step();
      if (t - lastDraw > 90) { draw(); lastDraw = t; }
      animHandle = setTimeout(function () { requestAnimationFrame(loop); }, 30);
    }

    function invert() {
      /* u → -u: interfaces stay, phases swap. Used on theme toggle. */
      for (var i = 0; i < N * N; i++) grid[i] = -grid[i];
      draw();
    }

    function start() {
      canvas = document.createElement('canvas');
      canvas.id = 'phase-canvas';
      document.body.insertBefore(canvas, document.body.firstChild);
      ctx = canvas.getContext('2d');
      resize();
      init();
      requestAnimationFrame(loop);
      window.addEventListener('resize', resize);
    }

    return { start: start, invert: invert };
  })();

  /* ────────────────────────────────────────────────────────────
     PDF PREVIEW — open in new tab (all devices)
  ──────────────────────────────────────────────────────────── */
  function initPdfPreview() {
    document.addEventListener('click', function (e) {
      var trigger = e.target.closest('[data-pdf-preview]');
      if (trigger) {
        e.preventDefault();
        window.open(trigger.getAttribute('data-pdf-preview'), '_blank', 'noopener');
      }
    });
  }

  /* ────────────────────────────────────────────────────────────
     THEME
  ──────────────────────────────────────────────────────────── */
  function resolveTheme() {
    var stored = localStorage.getItem('lp-theme');
    if (stored) return stored;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function applyTheme(theme, invertCanvas) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('lp-theme', theme);
    updateThemeIcons(theme === 'dark');
    if (invertCanvas) AC.invert();
  }

  function toggleTheme() {
    var cur = document.documentElement.getAttribute('data-theme') || 'light';
    applyTheme(cur === 'dark' ? 'light' : 'dark', true);
  }

  var MOON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
  var SUN  = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>';

  function updateThemeIcons(isDark) {
    document.querySelectorAll('.theme-btn').forEach(function (btn) {
      btn.innerHTML = isDark ? SUN : MOON;
      btn.title = isDark ? 'Switch to light mode' : 'Switch to dark mode';
    });
  }

  /* ────────────────────────────────────────────────────────────
     DIRECTIONAL HOVER (bento cards + any .home-card)
  ──────────────────────────────────────────────────────────── */
  function initDirectionalHover() {
    document.addEventListener('mousemove', function (e) {
      var card = e.target.closest('.home-card');
      if (!card) return;
      var r = card.getBoundingClientRect();
      card.style.setProperty('--card-mx', ((e.clientX - r.left) / r.width * 100) + '%');
      card.style.setProperty('--card-my', ((e.clientY - r.top)  / r.height * 100) + '%');
    });
    document.addEventListener('mouseleave', function (e) {
      var card = e.target.closest ? e.target.closest('.home-card') : null;
      if (card) {
        card.style.setProperty('--card-mx', '50%');
        card.style.setProperty('--card-my', '50%');
      }
    }, true);
  }

  /* ────────────────────────────────────────────────────────────
     NAV ITEMS
  ──────────────────────────────────────────────────────────── */
  var NAV = [
    { href: 'index.html',        label: 'Home'             },
    { href: 'about.html',        label: 'About'            },
    { href: 'publications.html', label: 'Publications'     },
    { href: 'talks.html',        label: 'Talks'            },
    { href: 'teaching.html',     label: 'Teaching'         },
    { href: 'cv.html',           label: 'Curriculum Vitae'  },
    { href: 'other.html',        label: 'Other Mathematics' },
    { href: 'misc.html',         label: 'Miscellany'        },
    { href: 'games.html',        label: 'Games'             },
    { href: 'files.html',        label: 'Files'             },
  ];

  function getActivePage() {
    var file = window.location.pathname.split('/').pop();
    return file || 'index.html';
  }

  /* ────────────────────────────────────────────────────────────
     BUILD SIDEBAR
  ──────────────────────────────────────────────────────────── */
  function buildSidebar(active) {
    var navHTML = NAV.map(function (item) {
      var cls = 'nav-link' + (item.href === active ? ' active' : '');
      return '<li><a href="' + item.href + '" class="' + cls + '">' + item.label + '</a></li>';
    }).join('');

    return (
      '<div class="sidebar-controls">' +
        '<button class="theme-btn" aria-label="Toggle theme"></button>' +
      '</div>' +

      '<div class="sidebar-identity">' +
        '<a href="index.html" class="headshot-link">' +
          '<div class="headshot-wrap">' +
            '<img src="assets/photo.png" alt="Luca Pignatelli" class="headshot"' +
            ' onerror="this.src=\'https://placehold.co/300x300/e8e2d9/0d1b2a?text=LP\'" />' +
          '</div>' +
        '</a>' +
        '<h1 class="sidebar-name"><a href="index.html">Luca Pignatelli</a></h1>' +
        '<p class="sidebar-title">PhD Candidate · Calculus of Variations</p>' +
        '<p class="sidebar-affiliation">Radboud University · Nijmegen, NL</p>' +
      '</div>' +

      '<nav class="sidebar-nav" aria-label="Main navigation">' +
        '<ul>' + navHTML + '</ul>' +
      '</nav>' +

      '<div class="sidebar-contact">' +
        '<a href="mailto:luca.pignatelli@ru.nl" class="contact-link">luca.pignatelli@ru.nl</a>' +
        '<div class="social-links">' +
          '<a href="https://arxiv.org/search/?searchtype=author&query=Pignatelli%2C+Luca"' +
          ' target="_blank" rel="noopener" class="social-btn">arXiv</a>' +
          '<a href="https://www.ru.nl/en/people/pignatelli-l"' +
          ' target="_blank" rel="noopener" class="social-btn">Radboud</a>' +
          '<a href="https://scholar.google.com"' +
          ' target="_blank" rel="noopener" class="social-btn">Scholar</a>' +
        '</div>' +
      '</div>' +

      '<div class="sidebar-watermark" aria-hidden="true">' +
      '\\(\\Gamma\\text{-}\\lim_{\\varepsilon\\to 0}\\mathcal{F}_\\varepsilon\\)' +
      '</div>'
    );
  }

  /* ────────────────────────────────────────────────────────────
     BUILD MOBILE HEADER
  ──────────────────────────────────────────────────────────── */
  function buildMobileHeader() {
    return (
      '<button class="hamburger" id="navToggle" aria-label="Open navigation">' +
        '<span></span><span></span><span></span>' +
      '</button>' +
      '<a href="index.html" class="mob-identity">' +
        '<img src="assets/photo.png" alt="Luca Pignatelli" class="mob-photo"' +
        ' onerror="this.src=\'https://placehold.co/40x40/e8e2d9/0d1b2a?text=LP\'" />' +
        '<div class="mob-id-text">' +
          '<span class="mob-name">Luca Pignatelli</span>' +
          '<span class="mob-pos">PhD Candidate · Calc. of Variations</span>' +
        '</div>' +
      '</a>' +
      '<button class="theme-btn mob-theme" aria-label="Toggle theme"></button>'
    );
  }

  /* ────────────────────────────────────────────────────────────
     INIT
  ──────────────────────────────────────────────────────────── */
  function init() {
    /* 1. Phase field canvas (all pages) */
    AC.start();

    var active    = getActivePage();
    var sidebarEl = document.getElementById('sidebar');
    var headerEl  = document.getElementById('mobile-header');

    if (sidebarEl) sidebarEl.innerHTML = buildSidebar(active);
    if (headerEl)  headerEl.innerHTML  = buildMobileHeader();

    /* 2. Sync theme icons */
    updateThemeIcons(resolveTheme() === 'dark');

    /* 3. Unified click handler */
    document.addEventListener('click', function (e) {
      var sidebar = document.getElementById('sidebar');
      var toggle  = document.getElementById('navToggle');

      if (e.target.closest('.theme-btn')) {
        toggleTheme();
        return;
      }
      if (e.target.closest('#navToggle')) {
        if (sidebar) sidebar.classList.toggle('open');
        if (toggle)  toggle.classList.toggle('open');
        return;
      }
      if (e.target.closest('.nav-link')) {
        if (sidebar) sidebar.classList.remove('open');
        if (toggle)  toggle.classList.remove('open');
        return;
      }
      if (sidebar && sidebar.classList.contains('open')) {
        if (!e.target.closest('#sidebar')) {
          sidebar.classList.remove('open');
          if (toggle) toggle.classList.remove('open');
        }
      }
    });

    /* 4. PDF preview (new tab) */
    initPdfPreview();

    /* 5. Directional hover */
    initDirectionalHover();

    /* 6. MathJax retypeset for sidebar watermark */
    if (window.MathJax && window.MathJax.typesetPromise && sidebarEl) {
      MathJax.typesetPromise([sidebarEl]).catch(function () {});
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
