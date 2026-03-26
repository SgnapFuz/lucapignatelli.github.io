# Luca Pignatelli — Academic Portfolio

Personal academic website. Built with plain HTML, CSS, and vanilla JavaScript — no frameworks, no build step. Apple-inspired design: white background, SF Pro / New York typography, bento grid homepage, phase-field scroll background.

Live at: **[pignatelliluca.github.io](https://pignatelliluca.github.io)**

---

## Table of Contents

1. [File Structure](#file-structure)
2. [Getting Started](#getting-started)
3. [Adding Your Photo](#adding-your-photo)
4. [Fonts](#fonts)
5. [Page-by-Page Guide](#page-by-page-guide)
   - [Homepage](#homepage-indexhtml)
   - [About](#about-abouthtml)
   - [Publications](#publications-publicationshtml)
   - [Talks](#talks-talkshtml)
   - [Teaching](#teaching-teachinghtml)
   - [Curriculum Vitae](#curriculum-vitae-cvhtml)
   - [Other Mathematics](#other-mathematics-otherhtml)
   - [Miscellany](#miscellany-mischtml)
   - [Games](#games-gameshtml)
   - [Files](#files-fileshtml)
6. [Adding Downloadable Files](#adding-downloadable-files)
7. [Navigation & Shared Components](#navigation--shared-components)
8. [Design System](#design-system)
9. [Phase-Field Background](#phase-field-background)
10. [Math Rendering](#math-rendering)
11. [Deploying to GitHub Pages](#deploying-to-github-pages)
12. [Common Tasks — Quick Reference](#common-tasks--quick-reference)

---

## File Structure

```
your-repo/
│
├── index.html            ← Homepage / bento grid
├── about.html            ← About me & research interests
├── publications.html     ← Papers and preprints
├── talks.html            ← Seminars, conference talks, posters
├── teaching.html         ← TA roles and community service
├── cv.html               ← Full curriculum vitae timeline
├── other.html            ← Theses and master's projects
├── misc.html             ← Books, side projects, thoughts
├── games.html            ← 2048, Snake, Minesweeper, Game of Life
├── files.html            ← Central file repository (PDFs)
│
├── styles.css            ← All styling (Apple design system, white only)
├── nav.js                ← Sidebar, mobile header, phase background, PDF preview
│
├── assets/
│   └── photo.png         ← Profile photo (PNG with transparency supported)
│
├── fonts/
│   ├── *.otf             ← Original Apple font files (not served to browser)
│   └── web/
│       ├── SF-Pro-Display-*.woff2    ← Subsetted, served to browser (~27KB each)
│       ├── SF-Pro-Text-*.woff2
│       ├── NewYork*.woff2
│       └── SF-Mono-*.woff2
│
└── files/
    ├── cv_pignatelli.pdf
    ├── notes_aachen_mar2025.pdf
    ├── plateau_problem.pdf
    ├── poster_como_jun2025.pdf
    ├── poster_wurzburg_apr2024.pdf
    ├── project_CFD_master.pdf
    ├── project_flocking_master.pdf
    ├── project_porousmedia_master.pdf
    ├── slides_*.pdf
    ├── thesis_*.pdf
    └── ...
```

---

## Getting Started

Plain HTML — no install step. To preview locally use a local server (opening `index.html` directly via `file://` blocks font and script loading):

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

Or with Node.js: `npx serve .`

---

## Adding Your Photo

Save your photo as `assets/photo.png`. PNG with a transparent background works well — the sidebar and mobile header will show it against the white background cleanly. Square crop recommended, minimum 400×400px.

The photo appears in three places automatically: the homepage hero (160px circle), the sidebar full-width editorial crop (square with rounded corners), and the mobile header (30px rounded square).

---

## Fonts

The site uses Apple's SF Pro, New York, and SF Mono typefaces, self-hosted as subsetted woff2 files.

### Font roles

| Font | Weights | Used for |
|---|---|---|
| SF Pro Display | 400, 500, 600, 700 | All headings and titles |
| SF Pro Text | 400, 500, 600 | Body text, nav, metadata, UI |
| New York (Small) | 400, 600 | Theorem boxes, sidebar watermark |
| New York (Large) | 400 | Large serif accents |
| SF Mono | 400, 500 | Code snippets |

### Re-generating the subsetted fonts

The `fonts/web/` woff2 files are subsetted to Latin + math Unicode ranges (~27KB each vs ~6MB originals). To regenerate after updating the source `.otf` files:

```bash
pip3 install fonttools brotli

UNICODES="U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0300-036F,U+0391-03C9,U+2000-22FF,U+25A0-25FF"

for f in fonts/*.otf; do
  base=$(basename "${f%.otf}")
  pyftsubset "$f" --output-file="fonts/web/${base}.woff2" \
    --flavor=woff2 --layout-features='*' --unicodes="$UNICODES"
done
```

### On Apple devices

Apple devices already use SF Pro and New York natively via `-apple-system` and `"New York"` in the CSS font stack — the self-hosted files are a fallback for Windows and Linux visitors.

---

## Page-by-Page Guide

### Homepage (`index.html`)

Floating top nav bar + large hero (photo, name, affiliation, social links) + 6-column bento grid of section cards.

**To update name, title, affiliation:** Edit the `.home-hero` block.

**To update social links:** Find the `.home-social` div.

**Bento grid layout:** 4 rows, always filling all 6 columns:
- Row 1: About (span 4) + Publications featured (span 2)
- Row 2: Talks (span 2) + Teaching (span 2) + CV stat (span 2)
- Row 3: Other Mathematics (span 3) + Miscellany (span 3)
- Row 4: Games (span 4) + Files (span 2)

**Directional hover glow:** Cards have a radial gradient that tracks the cursor position via CSS custom properties `--mx` and `--my`, set by `nav.js`.

---

### About (`about.html`)

Bio, central research problem, research interests list, theorem box, affiliations.

**To update bio:** Edit `<div class="about-bio">`. Supports inline LaTeX.

**To update research interests:** Edit `<ul class="interest-list">`.

**To update the theorem box:** Find `<div class="theorem-box">`.

---

### Publications (`publications.html`)

Filterable list (All / Preprint / In Progress).

**To add a paper:** Copy an `<li class="pub-item" data-type="preprint">` block. Fill `.pub-year`, `.pub-badge`, `.pub-title`, `.pub-authors`, `.pub-venue`, `.pub-abstract`, `.pub-links`.

**Badge classes:** `arxiv` (gold), `ongoing` (blue), `review` (green).

---

### Talks (`talks.html`)

Past talks and presentations, then upcoming events.

**To add a talk:** Copy a `.talk-item` block. Add a `.pub-links` block for slides/poster/notes when available.

**To unlock a commented-out file button:** Find `<!-- Uncomment when ... -->` and remove comment markers.

**To add an upcoming event:** Copy an `.upcoming-item` block.

---

### Teaching (`teaching.html`)

Course cards and a service/community list.

**To add a course:** Copy a `.course-card` block. Fill `.course-term`, `.course-level`, `.course-name`, `.course-inst`, `.course-desc`.

---

### Curriculum Vitae (`cv.html`)

Timelines for positions, education, research visits, conferences. Skills and referees at the bottom.

**To add a timeline entry:** Copy a `.tl-item` block inside the right `.timeline-track`.

**To update the CV PDF:** Change the `href` in `.cv-download-wrap`.

---

### Other Mathematics (`other.html`)

Theses and MSc course projects from Politecnico di Torino.

**To add an entry:** Copy a `.pub-item` block. Thesis entries have two button pairs (thesis + slides); project entries have one or two.

---

### Miscellany (`misc.html`)

Three sections: Recently Read, Side Projects, Thoughts.

**To add a book:** Copy `.book-item`. Set `.book-spine` background colour inline.

**To add a project:** Copy `.project-card`.

**To add a thought:** Copy `.thought-item`. Supports inline LaTeX.

---

### Games (`games.html`)

Four browser games in a 2×2 grid (single column on mobile). High scores saved in `localStorage`.

**2048** — Arrow keys (hover card first on desktop) or swipe. High score key: `lp-hs-2048`.

**Snake** — Arrow keys / WASD or swipe. Speed increases with score. High score key: `lp-hs-snake`.

**Minesweeper** — 9×9, 10 mines. First click always safe. Left-click reveals; right-click or toggle button flags. Best time key: `lp-hs-ms`.

**Conway's Game of Life** — 60×60 toroidal grid. Click/drag to draw. ▶/⏸ to run/pause.

**To modify a game:** Edit the relevant IIFE block in `games.html`'s `<script>` section.

---

### Files (`files.html`)

Table-based PDF repository: Papers, Talk Slides, Posters, Notes, Theses, Master's Projects, CV.

**To add a file:**
1. Drop the PDF into `files/`
2. Copy a `<tr>` row in the right section
3. Update the name, context, badge class, date, and file path

**Badge classes:** `badge-paper` (gold), `badge-slides` (blue), `badge-poster` (purple), `badge-notes` (green).

**Gamma Mia notes placeholder:** When `files/notes_nijmegen_oct2024.pdf` is ready, uncomment the placeholder rows in `files.html` (Notes section) and `talks.html` (Gamma Mia entry).

---

## Adding Downloadable Files

All PDFs live in `files/`. Naming convention:

```
files/
├── slides_[venue]_[monthyear].pdf      e.g. slides_tuwien_may2025.pdf
├── poster_[venue]_[monthyear].pdf      e.g. poster_como_jun2025.pdf
├── notes_[venue]_[monthyear].pdf       e.g. notes_aachen_mar2025.pdf
├── thesis_[degree]_[monthyear].pdf     e.g. thesis_master_jul2023.pdf
└── project_[topic]_master.pdf          e.g. project_CFD_master.pdf
```

Standard button pattern:

```html
<button class="btn btn-outline"
  data-pdf-preview="files/your-file.pdf"
  data-pdf-title="Descriptive title">
  Preview
</button>
<a href="files/your-file.pdf" class="btn btn-pdf" download>
  Download
</a>
```

Clicking Preview opens the PDF in a new tab. The `download` attribute triggers a save dialog.

---

## Navigation & Shared Components

All pages share the sidebar and mobile header, both injected by `nav.js`.

**To add a new page:** Edit the `NAV` array in `nav.js`:

```javascript
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
```

**Every sub-page needs** in `<body>`:
```html
<header class="mobile-header" id="mobile-header"></header>
<aside  class="sidebar"       id="sidebar"></aside>
```
And before `</body>`:
```html
<script src="nav.js"></script>
```

**The homepage** is different — it has no sidebar. Instead it has a floating top nav bar injected into `<nav class="home-nav" id="home-nav"></nav>` by `nav.js`.

---

## Design System

The site uses an Apple-inspired design language throughout. No dark mode — white only.

### Colours

| Variable | Value | Used for |
|---|---|---|
| `--bg` | `#ffffff` | Page background |
| `--bg-2` | `#f5f5f7` | Secondary surfaces, inputs |
| `--bg-3` | `#e8e8ed` | Borders and dividers |
| `--ink` | `#1d1d1f` | Primary text |
| `--ink-mid` | `#424245` | Secondary text |
| `--ink-lt` | `#6e6e73` | Tertiary text, metadata |
| `--rule` | `#d2d2d7` | Borders |
| `--rule-lt` | `#e8e8ed` | Light borders |
| `--accent` | `#0071e3` | Links, buttons, active states |
| `--accent-bg` | `rgba(0,113,227,.07)` | Accent tint backgrounds |

To change the accent colour, update `--accent` and `--accent-bg` / `--accent-bgh` in `:root`.

### Typography

- **Body text:** SF Pro Text 400, 17px base
- **Headings:** SF Pro Display 700–800, tight letter-spacing (`-.022em` to `-.038em`)
- **Large display text** (homepage name): `clamp(3.2rem, 9vw, 6rem)` weight 800
- **Page titles:** `clamp(2.4rem, 5vw, 3.8rem)` weight 800
- **Labels/badges:** SF Pro Text 600, `0.06em` letter-spacing, uppercase
- **Theorem boxes:** New York (serif), weight 400
- **Code:** SF Mono

### Cards (bento grid)

Cards use `border-radius: var(--r-xl)` (28px), `background: rgba(255,255,255,.96)`, a thin `1px solid var(--rule-lt)` border, and a subtle `box-shadow`. On hover: `box-shadow: var(--shad-md)`, `transform: translateY(-1px)`, plus a directional radial glow at the cursor position.

### Buttons

Pill-shaped: `border-radius: 22px`. Two styles:
- `.btn-pdf` — solid accent blue, white text
- `.btn-outline` — transparent background, `1.5px` accent border on hover

---

## Phase-Field Background

The site has a subtle phase-separation pattern as a background, with a gentle scroll parallax (4% of scroll offset). It is generated procedurally in `nav.js` using:

1. A seeded deterministic PRNG (xorshift32) to place 28 Voronoi seed points
2. Each pixel assigned to the nearest seed (standard Voronoi)
3. Even-indexed cells coloured warm cream (`rgb(242,239,232)`), odd cells cool blue-white (`rgb(237,239,246)`)
4. The resulting 120×120 canvas is converted to a data URL and applied as a CSS `background-image` on a fixed `#phase-bg` div
5. A `filter: blur(22px)` smooths the Voronoi boundaries, approximating Allen-Cahn equilibrium phase domains
6. Scroll parallax: `translateY(scrollY * 0.04)` via a passive RAF-throttled scroll listener

The pattern is computed once at page load (~1ms), produces no ongoing CPU usage, and is fully deterministic — the same pattern appears on every page.

**To adjust the pattern:** Edit the `initPhaseBg` function in `nav.js`. Key parameters: number of seeds (28), canvas size (120×120), blur amount (22px in CSS), parallax factor (0.04), and the two phase colours.

---

## Math Rendering

LaTeX rendered by [MathJax 3](https://www.mathjax.org) via jsDelivr CDN. Add to any page that needs it:

```html
<script>
  window.MathJax = {
    tex: { inlineMath: [['\\(','\\)']], displayMath: [['\\[','\\]']] },
    options: { skipHtmlTags: ['script','noscript','style','textarea','pre'] }
  };
</script>
<script src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-chtml.js" async></script>
```

Inline: `\( \varepsilon \to 0 \)` — Display: `\[ \mathcal{F}_\varepsilon[u] = \ldots \]`

MathJax is loaded on all pages (required for the sidebar watermark `Γ-lim F_ε`).

---

## Deploying to GitHub Pages

1. Create a repository (e.g. `pignatelliluca.github.io`)
2. Push all files to `main`
3. Repository → **Settings** → **Pages** → Source: `main` / `root` → **Save**
4. Live at `https://yourusername.github.io/` within a minute

---

## Common Tasks — Quick Reference

| Task | File to edit |
|---|---|
| Change name / title / affiliation | `index.html` hero section |
| Update sidebar name/title | `nav.js` → `buildSidebar()` |
| Add a new paper | `publications.html` |
| Add a past talk or poster | `talks.html` |
| Unlock a commented-out file button | Find `<!-- Uncomment when ... -->` in `talks.html` or `files.html` |
| Add an upcoming event | `talks.html` — `.upcoming-item` block |
| Add a new course | `teaching.html` |
| Add a timeline entry (CV) | `cv.html` |
| Add a thesis or MSc project | `other.html` |
| Add a book, project, or thought | `misc.html` |
| Upload a PDF and link it | Drop in `files/`, add row to `files.html`, add buttons on relevant page |
| Add a page to the nav | `nav.js` → `NAV` array |
| Change the accent colour | `styles.css` → `--accent` and `--accent-bg` in `:root` |
| Add a new page | Copy any sub-page HTML, add to `NAV` array in `nav.js` |
| Add LaTeX to a page | Add MathJax `<script>` tags to `<head>` |
| Update profile photo | Replace `assets/photo.png` |
| Modify a game | Edit the relevant IIFE in `games.html` `<script>` |
| Regenerate web fonts | Run `pyftsubset` script (see [Fonts](#fonts) section) |
| Adjust phase background | Edit `initPhaseBg()` in `nav.js` |

---

*Last updated: March 2026*
