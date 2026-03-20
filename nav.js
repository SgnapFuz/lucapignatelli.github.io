/*!
 * nav.js — Shared navigation, sidebar & theming
 * Luca Pignatelli Academic Portfolio
 * ─────────────────────────────────────────────
 * • Injects sidebar & mobile header into every sub-page
 * • Handles dark / light mode (defaults to system preference)
 * • Handles mobile hamburger & click-outside
 *
 * PHOTO: Put your photo at  assets/photo.jpg
 * FILES: Put downloadable files in  files/
 */

(function () {
  'use strict';

  /* ────────────────────────────────────────────────────────────
     PDF PREVIEW — open in new tab (works on all devices)
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
     PDF PREVIEW MODAL (removed — kept as tombstone, delete safely)
  ──────────────────────────────────────────────────────────── */
  function buildModal() {
    var overlay = document.createElement('div');
    overlay.className = 'pdf-overlay';
    overlay.id = 'pdfOverlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'PDF preview');
    overlay.innerHTML =
      '<div class="pdf-modal" id="pdfModal">' +
        '<div class="pdf-modal-bar">' +
          '<span class="pdf-modal-title" id="pdfModalTitle"></span>' +
          '<a class="pdf-modal-download" id="pdfModalDownload" download>' +
            '<svg viewBox="0 0 24 24"><path d="M12 16l-4-4h3V4h2v8h3l-4 4zm-7 2h14v2H5v-2z"/></svg>' +
            'Download' +
          '</a>' +
          '<button class="pdf-modal-close" id="pdfModalClose" aria-label="Close preview">✕</button>' +
        '</div>' +
        '<div class="pdf-modal-body" id="pdfModalBody">' +
          '<iframe id="pdfModalFrame" title="PDF preview"></iframe>' +
          '<div class="pdf-modal-fallback">' +
            '<p>This file cannot be previewed directly in the browser<br>(the server may not allow embedding).</p>' +
            '<a class="pdf-modal-download" id="pdfFallbackDownload" download>' +
              '<svg viewBox="0 0 24 24"><path d="M12 16l-4-4h3V4h2v8h3l-4 4zm-7 2h14v2H5v-2z"/></svg>' +
              'Download PDF' +
            '</a>' +
          '</div>' +
        '</div>' +
      '</div>';
    document.body.appendChild(overlay);

    var frame    = document.getElementById('pdfModalFrame');
    var body     = document.getElementById('pdfModalBody');
    var download = document.getElementById('pdfModalDownload');
    var fallback = document.getElementById('pdfFallbackDownload');

    /* Detect when iframe fails to load (CORS / X-Frame-Options block) */
    frame.addEventListener('load', function () {
      try {
        /* If the frame loaded a cross-origin error page the contentDocument
           will either throw or have no meaningful content */
        var doc = frame.contentDocument || frame.contentWindow.document;
        if (!doc || doc.title === '' && doc.body && doc.body.innerHTML === '') {
          body.classList.add('blocked');
        } else {
          body.classList.remove('blocked');
        }
      } catch (e) {
        /* Cross-origin → can't inspect → assume blocked */
        body.classList.add('blocked');
      }
    });

    frame.addEventListener('error', function () {
      body.classList.add('blocked');
    });

    return overlay;
  }

  function isMobile() {
    return window.matchMedia('(max-width: 768px)').matches ||
           /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  }

  function openPdfPreview(url, title) {
    /* On mobile, iframes can't embed PDFs — open directly in a new tab instead */
    if (isMobile()) {
      window.open(url, '_blank', 'noopener');
      return;
    }

    var overlay  = document.getElementById('pdfOverlay') || buildModal();
    var frame    = document.getElementById('pdfModalFrame');
    var titleEl  = document.getElementById('pdfModalTitle');
    var dl       = document.getElementById('pdfModalDownload');
    var dlFb     = document.getElementById('pdfFallbackDownload');
    var body     = document.getElementById('pdfModalBody');

    titleEl.textContent = title || 'Document preview';
    dl.href    = url;
    dlFb.href  = url;
    body.classList.remove('blocked');
    frame.src  = url;

    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';

    /* Focus trap */
    var closeBtn = document.getElementById('pdfModalClose');
    if (closeBtn) closeBtn.focus();
  }

  function closePdfPreview() {
    var overlay = document.getElementById('pdfOverlay');
    var frame   = document.getElementById('pdfModalFrame');
    if (overlay) overlay.classList.remove('open');
    if (frame)   frame.src = '';            /* stop loading / free memory */
    document.body.style.overflow = '';
  }

  function initPdfModal() {
    /* Build modal DOM once */
    if (!document.getElementById('pdfOverlay')) buildModal();

    document.addEventListener('click', function (e) {
      /* Close button */
      if (e.target.closest('#pdfModalClose')) { closePdfPreview(); return; }

      /* Click on overlay backdrop (outside modal box) */
      var overlay = document.getElementById('pdfOverlay');
      if (overlay && overlay.classList.contains('open') &&
          e.target === overlay) { closePdfPreview(); return; }

      /* Preview trigger — any element with data-pdf-preview */
      var trigger = e.target.closest('[data-pdf-preview]');
      if (trigger) {
        e.preventDefault();
        openPdfPreview(
          trigger.getAttribute('data-pdf-preview'),
          trigger.getAttribute('data-pdf-title') || ''
        );
      }
    });

    /* ESC key */
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closePdfPreview();
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

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('lp-theme', theme);
    updateThemeIcons(theme === 'dark');
  }

  function toggleTheme() {
    var cur = document.documentElement.getAttribute('data-theme') || 'light';
    applyTheme(cur === 'dark' ? 'light' : 'dark');
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
     BUILD SIDEBAR HTML
  ──────────────────────────────────────────────────────────── */
  function buildSidebar(active) {
    var navHTML = NAV.map(function (item) {
      var cls = 'nav-link' + (item.href === active ? ' active' : '');
      return '<li><a href="' + item.href + '" class="' + cls + '">' + item.label + '</a></li>';
    }).join('');

    return (
      /* Controls row */
      '<div class="sidebar-controls">' +
        '<button class="theme-btn" aria-label="Toggle theme"></button>' +
      '</div>' +

      /* Identity */
      '<div class="sidebar-identity">' +
        '<a href="index.html" class="headshot-link">' +
          '<div class="headshot-wrap">' +
            '<img src="assets/photo.png" alt="Luca Pignatelli" class="headshot"' +
            ' onerror="this.src=\'https://placehold.co/160x160/e8e2d9/0d1b2a?text=LP\'" />' +
          '</div>' +
        '</a>' +
        '<h1 class="sidebar-name"><a href="index.html">Luca Pignatelli</a></h1>' +
        '<p class="sidebar-title">PhD Candidate<br>Calculus of Variations</p>' +
        '<p class="sidebar-affiliation">Radboud University · Nijmegen, NL</p>' +
      '</div>' +

      /* Nav */
      '<nav class="sidebar-nav" aria-label="Main navigation">' +
        '<ul>' + navHTML + '</ul>' +
      '</nav>' +

      /* Contact */
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

      /* LaTeX watermark */
      '<div class="sidebar-watermark" aria-hidden="true">' +
      '\\(\\Gamma\\text{-}\\lim_{\\varepsilon\\to 0}\\mathcal{F}_\\varepsilon\\)' +
      '</div>'
    );
  }

  /* ────────────────────────────────────────────────────────────
     BUILD MOBILE HEADER HTML
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
     INIT (runs after DOM ready)
  ──────────────────────────────────────────────────────────── */
  function init() {
    var active     = getActivePage();
    var sidebarEl  = document.getElementById('sidebar');
    var headerEl   = document.getElementById('mobile-header');

    if (sidebarEl) sidebarEl.innerHTML  = buildSidebar(active);
    if (headerEl)  headerEl.innerHTML   = buildMobileHeader();

    /* Sync theme icons */
    updateThemeIcons(resolveTheme() === 'dark');

    /* Unified click handler */
    document.addEventListener('click', function (e) {
      var sidebar = document.getElementById('sidebar');
      var toggle  = document.getElementById('navToggle');

      /* Theme toggle */
      if (e.target.closest('.theme-btn')) {
        toggleTheme();
        return;
      }

      /* Hamburger open/close */
      if (e.target.closest('#navToggle')) {
        if (sidebar) sidebar.classList.toggle('open');
        if (toggle)  toggle.classList.toggle('open');
        return;
      }

      /* Nav link — close sidebar on mobile */
      if (e.target.closest('.nav-link')) {
        if (sidebar) sidebar.classList.remove('open');
        if (toggle)  toggle.classList.remove('open');
        return;
      }

      /* Click outside sidebar — close */
      if (sidebar && sidebar.classList.contains('open')) {
        if (!e.target.closest('#sidebar')) {
          sidebar.classList.remove('open');
          if (toggle) toggle.classList.remove('open');
        }
      }
    });

    /* PDF preview — open in new tab */
    initPdfPreview();

    /* Re-typeset MathJax for sidebar watermark */
    if (window.MathJax && window.MathJax.typesetPromise && sidebarEl) {
      MathJax.typesetPromise([sidebarEl]).catch(function () {});
    }
  }

  /* Run once DOM is ready */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
