/*!
 * nav.js — Navigation, phase background, PDF preview
 * Apple-inspired redesign. No dark mode. Pure white.
 */

(function () {
  'use strict';

  /* ──────────────────────────────────────────────────────────
     PHASE SEPARATION BACKGROUND
     Pre-baked Voronoi pattern approximating Allen-Cahn equilibrium.
     Static; subtle scroll parallax via CSS transform.
  ────────────────────────────────────────────────────────── */
  (function initPhaseBg() {
    var S = 120;
    var canvas = document.createElement('canvas');
    canvas.width = canvas.height = S;
    var ctx = canvas.getContext('2d');
    var img = ctx.createImageData(S, S);

    /* Seeded deterministic RNG (xorshift32) */
    var st = 0x9E3779B9;
    function rng() { st ^= st << 13; st ^= st >> 17; st ^= st << 5; return (st >>> 0) / 4294967295; }

    /* 28 Voronoi seeds */
    var seeds = [];
    for (var k = 0; k < 28; k++) seeds.push([rng() * S, rng() * S]);

    /* Render Voronoi cells with two very-close-to-white phases */
    for (var y = 0; y < S; y++) {
      for (var x = 0; x < S; x++) {
        var d1 = 1e9, si = 0;
        for (var k = 0; k < seeds.length; k++) {
          var dx = x - seeds[k][0], dy = y - seeds[k][1];
          var d = dx * dx + dy * dy;
          if (d < d1) { d1 = d; si = k; }
        }
        /* Phase +1: warm cream   Phase -1: cool blue-white */
        var warm = si % 2 === 0;
        var i = (y * S + x) * 4;
        img.data[i]     = warm ? 242 : 237;  /* R */
        img.data[i + 1] = warm ? 239 : 239;  /* G */
        img.data[i + 2] = warm ? 232 : 246;  /* B */
        img.data[i + 3] = 255;
      }
    }
    ctx.putImageData(img, 0, 0);

    /* Background div with CSS blur to smooth Voronoi edges */
    var bg = document.createElement('div');
    bg.id = 'phase-bg';
    bg.style.backgroundImage = 'url(' + canvas.toDataURL() + ')';
    document.body.insertBefore(bg, document.body.firstChild);

    /* Scroll parallax — RAF-throttled */
    var ticking = false;
    window.addEventListener('scroll', function () {
      if (!ticking) {
        requestAnimationFrame(function () {
          bg.style.transform = 'translateY(' + window.scrollY * 0.04 + 'px)';
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  })();

  /* ──────────────────────────────────────────────────────────
     PDF PREVIEW — new tab (all devices)
  ────────────────────────────────────────────────────────── */
  function initPdfPreview() {
    document.addEventListener('click', function (e) {
      var trigger = e.target.closest('[data-pdf-preview]');
      if (trigger) {
        e.preventDefault();
        window.open(trigger.getAttribute('data-pdf-preview'), '_blank', 'noopener');
      }
    });
  }

  /* ──────────────────────────────────────────────────────────
     DIRECTIONAL HOVER GLOW (bento cards)
  ────────────────────────────────────────────────────────── */
  function initDirectionalHover() {
    document.addEventListener('mousemove', function (e) {
      var card = e.target.closest('.home-card');
      if (!card) return;
      var r = card.getBoundingClientRect();
      card.style.setProperty('--mx', ((e.clientX - r.left) / r.width  * 100) + '%');
      card.style.setProperty('--my', ((e.clientY - r.top)  / r.height * 100) + '%');
    });
    document.addEventListener('mouseleave', function (e) {
      var card = e.target.closest ? e.target.closest('.home-card') : null;
      if (card) { card.style.setProperty('--mx','50%'); card.style.setProperty('--my','50%'); }
    }, true);
  }

  /* ──────────────────────────────────────────────────────────
     NAV ITEMS
  ────────────────────────────────────────────────────────── */
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

  /* ──────────────────────────────────────────────────────────
     SIDEBAR — Apple documentation style
  ────────────────────────────────────────────────────────── */
  function buildSidebar(active) {
    var navHTML = NAV.map(function (item) {
      var cls = 'nav-link' + (item.href === active ? ' active' : '');
      return '<li><a href="' + item.href + '" class="' + cls + '">' + item.label + '</a></li>';
    }).join('');

    return (
      '<a href="index.html" class="sidebar-photo-link">' +
        '<div class="sidebar-photo-wrap">' +
          '<img src="assets/photo.png" alt="Luca Pignatelli"' +
          ' onerror="this.src=\'https://placehold.co/240x240/f5f5f7/1d1d1f?text=LP\'" />' +
        '</div>' +
      '</a>' +

      '<div class="sidebar-identity">' +
        '<div class="sidebar-name"><a href="index.html">Luca Pignatelli</a></div>' +
        '<div class="sidebar-title">PhD Candidate · Calculus of Variations</div>' +
        '<div class="sidebar-affiliation">Radboud University · Nijmegen, NL</div>' +
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

  /* ──────────────────────────────────────────────────────────
     MOBILE HEADER
  ────────────────────────────────────────────────────────── */
  function buildMobileHeader() {
    return (
      '<button class="hamburger" id="navToggle" aria-label="Open navigation">' +
        '<span></span><span></span><span></span>' +
      '</button>' +
      '<a href="index.html" class="mob-identity">' +
        '<img src="assets/photo.png" alt="Luca Pignatelli" class="mob-photo"' +
        ' onerror="this.src=\'https://placehold.co/40x40/f5f5f7/1d1d1f?text=LP\'" />' +
        '<div class="mob-id-text">' +
          '<span class="mob-name">Luca Pignatelli</span>' +
          '<span class="mob-pos">PhD Candidate · Calc. of Variations</span>' +
        '</div>' +
      '</a>'
    );
  }

  /* ──────────────────────────────────────────────────────────
     HOME TOP NAV (homepage only)
  ────────────────────────────────────────────────────────── */
  function buildHomeNav() {
    var navEl = document.getElementById('home-nav');
    if (!navEl) return;

    var linksHTML = ['About','Publications','Talks','CV','Files'].map(function(label) {
      var href = ({ About:'about.html', Publications:'publications.html',
                    Talks:'talks.html', CV:'cv.html', Files:'files.html' })[label];
      return '<a href="' + href + '" class="home-nav-link">' + label + '</a>';
    }).join('');

    navEl.innerHTML =
      '<a href="index.html" class="home-nav-id">' +
        '<img src="assets/photo.png" alt="" class="home-nav-photo"' +
        ' onerror="this.src=\'https://placehold.co/28x28/f5f5f7/1d1d1f?text=LP\'" />' +
        'Luca Pignatelli' +
      '</a>' +
      '<div class="home-nav-links">' + linksHTML + '</div>';
  }

  /* ──────────────────────────────────────────────────────────
     INIT
  ────────────────────────────────────────────────────────── */
  function init() {
    var active    = getActivePage();
    var sidebarEl = document.getElementById('sidebar');
    var headerEl  = document.getElementById('mobile-header');

    if (sidebarEl) sidebarEl.innerHTML = buildSidebar(active);
    if (headerEl)  headerEl.innerHTML  = buildMobileHeader();
    buildHomeNav();

    /* Unified click handler */
    document.addEventListener('click', function (e) {
      var sidebar = document.getElementById('sidebar');
      var toggle  = document.getElementById('navToggle');

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

    initPdfPreview();
    initDirectionalHover();

    /* MathJax retypeset for sidebar watermark */
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
