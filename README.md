# Luca Pignatelli — Academic Portfolio

Personal academic website. Built with plain HTML, CSS, and vanilla JavaScript — no frameworks, no build step, no dependencies beyond two CDN-loaded libraries (MathJax and Google Fonts).

Live at: **[your-url-here]**

---

## Table of Contents

1. [File Structure](#file-structure)
2. [Getting Started](#getting-started)
3. [Adding Your Photo](#adding-your-photo)
4. [Page-by-Page Guide](#page-by-page-guide)
   - [Homepage](#homepage-indexhtml)
   - [About](#about-abouthtmll)
   - [Publications](#publications-publicationshtml)
   - [Talks](#talks-talkshtml)
   - [Teaching](#teaching-teachinghtml)
   - [Curriculum Vitae](#curriculum-vitae-cvhtml)
   - [Miscellany](#miscellany-mischtml)
   - [Files](#files-fileshtml)
5. [Adding Downloadable Files](#adding-downloadable-files)
6. [Navigation & Shared Components](#navigation--shared-components)
7. [Dark / Light Mode](#dark--light-mode)
8. [Styling & Theming](#styling--theming)
9. [Math Rendering](#math-rendering)
10. [Deploying to GitHub Pages](#deploying-to-github-pages)
11. [Common Tasks — Quick Reference](#common-tasks--quick-reference)

---

## File Structure

```
your-repo/
│
├── index.html            ← Homepage / landing page
├── about.html            ← About me & research interests
├── publications.html     ← Papers and preprints
├── talks.html            ← Seminars, conference talks, posters
├── teaching.html         ← TA roles and community service
├── cv.html               ← Full curriculum vitae timeline
├── misc.html             ← Books, side projects, thoughts
├── files.html            ← Central file repository (PDFs)
│
├── styles.css            ← All styling, both light & dark themes
├── nav.js                ← Shared sidebar, mobile header, theme toggle
│
├── assets/
│   └── photo.png         ← Your profile photo (you must add this)
│
└── files/
    ├── cv_pignatelli.pdf
    ├── slides_tuwien_may2025.pdf
    ├── slides_aachen_mar2025.pdf
    ├── slides_colloquium_oct2024.pdf
    ├── slides_gammamia_oct2024.pdf
    ├── slides_wurzburg_apr2024.pdf
    ├── poster_como_jun2025.pdf
    └── ...               ← Any future PDFs go here
```

> **Note:** The `assets/` and `files/` folders are not included in this repository by default — you need to create them and add your files. See the sections below for details.

---

## Getting Started

Because this is a plain HTML site, there is no install step. To preview locally, the simplest option is a one-line server from your terminal:

```bash
# Python (comes pre-installed on most systems)
python3 -m http.server 8000
# then open http://localhost:8000 in your browser
```

Alternatively, if you have Node.js:

```bash
npx serve .
```

> **Important:** Don't just double-click `index.html` to open it. Some browsers block local font and script loading when files are opened directly from disk (`file://` protocol). Always use a local server.

---

## Adding Your Photo

1. Create a folder named `assets` in the root of the repository.
2. Save your photo inside it as `photo.png`.
   - Any square crop works best; minimum recommended size is **400 × 400 px**.
   - The file name must be exactly `photo.png` (lowercase).
3. That's it — no code changes needed.

Your photo appears in three places automatically:
- The **homepage hero** (large 200 px circle)
- The **sidebar** on every sub-page (152 px circle)
- The **mobile header** (small 38 px circle, visible on phones alongside your name)

If the file is missing, a grey placeholder with your initials is shown instead.

---

## Page-by-Page Guide

### Homepage (`index.html`)

The landing page. Contains your name, title, affiliation, social links, and a grid of cards linking to every section.

**To update your name, title, or affiliation:**
Open `index.html` and find this block (around line 40):

```html
<h1 class="home-name">Luca Pignatelli</h1>
<p class="home-title">PhD Candidate · Calculus of Variations</p>
<p class="home-affil">Radboud University · Nijmegen, Netherlands</p>
```

Edit directly.

**To update social/contact links** (Email, arXiv, Radboud, Scholar):
Find the `.home-social` div and update the `href` attributes.

**To change the section cards** (descriptions, icons, links):
Each card is an `<a class="home-card">` block. Edit the `.card-desc` text inside each one. The icons are inline SVGs — you can swap them for any icon set you prefer.

---

### About (`about.html`)

Your bio, research description, mathematical statement of the central problem, and a list of research interests.

**To update your bio paragraphs:**
Edit the text inside the `<div class="about-bio">` section. The paragraphs support inline LaTeX via MathJax (see [Math Rendering](#math-rendering)).

**To update research interests:**
Find the `<ul class="interest-list">` and add, remove, or edit `<li>` items.

**To update the theorem / central problem box:**
Find `<div class="theorem-box">` and edit the label and the LaTeX formula inside it.

**To add a new "box" (e.g. a definition, remark, open problem):**
Copy the entire `<div class="theorem-box">` block and paste it below. Change the `.theorem-label` text and the content inside.

---

### Publications (`publications.html`)

List of papers with filter buttons (All / Preprint / In Progress).

**To add a new paper:**
Copy one of the existing `<li class="pub-item">` blocks. The key attributes to set are:

```html
<li class="pub-item" data-type="preprint">   <!-- preprint | ongoing | journal -->
```

Inside the block, fill in:
- `.pub-year` — the year
- `.pub-badge` — the badge class (`arxiv`, `ongoing`, `review`) and label
- `.pub-title` — the paper title
- `.pub-authors` — put your name in `<strong>L. Pignatelli</strong>`
- `.pub-venue` — journal / arXiv identifier
- `.pub-abstract` — a short description (supports LaTeX)
- `.pub-links` — buttons linking to arXiv, PDF download, DOI, etc.

**To add a new filter category** (e.g. "Journal"):
1. Add a filter button in the `.pub-filters` div:
   ```html
   <button class="filter-btn" data-filter="journal">Journal</button>
   ```
2. Mark the relevant papers with `data-type="journal"`.
The JavaScript filter at the bottom of the page will handle the rest automatically.

---

### Talks (`talks.html`)

Past talks followed by upcoming events.

**To add a past talk:**
Copy an existing `.talk-item` block and fill in the date, title, and venue. If you have slides, uncomment the `<div class="pub-links">` block inside it and set the `href` to the correct path under `files/`:

```html
<div class="pub-links">
  <a href="files/slides_yourname_date.pdf" class="btn btn-pdf" download>
    <svg viewBox="0 0 24 24"><path d="M12 16l-4-4h3V4h2v8h3l-4 4zm-7 2h14v2H5v-2z"/></svg>
    Download Slides
  </a>
</div>
```

**To add an upcoming event:**
Copy an existing `.upcoming-item` block (inside the `<div>` after the "Upcoming" heading) and fill in the date and description. Upcoming items are styled with a blue-teal accent to visually distinguish them from past talks.

**To add a poster download button:**
Same as slides — use the same `.btn.btn-pdf` pattern but label it "Download Poster".

---

### Teaching (`teaching.html`)

Course cards and a service/community list.

**To add a new course:**
Copy one of the `.course-card` blocks and update:
- `.course-term` — date range (e.g. `Sep 2026 – Jan 2027`)
- `.course-level` — `Bachelor` or `Master`
- `.course-name` — course title
- `.course-inst` — institution / programme
- `.course-desc` — one-sentence description

**To add course notes or materials:**
Uncomment the `.pub-links` block inside the card (it's already there as a comment), set the `href` to your notes PDF in `files/`, and it will appear as a download button on the card.

**To add a service entry:**
Copy a `.talk-item` block in the service section at the bottom and fill in the date and description.

---

### Curriculum Vitae (`cv.html`)

Timeline of positions, education, research visits, conferences, skills, and referees.

**To add a new timeline entry** (position, education, visit, or conference):
Copy an existing `.tl-item` block within the appropriate `<div class="timeline-track">` and fill in `.tl-year`, `.tl-role`, and `.tl-place`. The vertical line and dot are handled automatically by CSS.

**To update the PDF CV download link:**
Find the `.cv-download-wrap` and update the `href`:
```html
<a href="files/cv_pignatelli.pdf" class="btn btn-pdf btn-cv" download>
```
Make sure the corresponding PDF is in your `files/` folder.

**To update skills or referees:**
Find the relevant `.skill-block` elements and edit the text directly.

---

### Miscellany (`misc.html`)

Three sections: **Recently Read**, **Side Projects**, and **Thoughts**. This page is intentionally freeform — edit it however you like.

**To add a book:**
Copy a `.book-item` block. The coloured `.book-spine` is just a `<div>` with an inline `background` colour — pick any CSS colour you like. Fill in `.book-title`, `.book-author`, and `.book-note`.

**To add a side project:**
Copy a `.project-card` block and fill in the name, description, and `.project-tag` label.

**To add a thought:**
Copy a `.thought-item` block, update `.thought-date`, and write your text in `.thought-text`. Supports inline LaTeX.

**To add an entirely new section** (e.g. "Photography", "Outreach"):
Copy the pattern of any existing `<section class="misc-section">` block — give it a new `<h3 class="subsection-title">` heading and fill the content however you like. Any content that fits the general page layout is fine.

---

### Files (`files.html`)

A clean table-based repository of all downloadable PDFs, organised into categories: Papers, Talk Slides, Posters, Notes, and CV.

**To add a file to the repository:**
1. Drop the PDF into the `files/` folder.
2. Open `files.html` and find the appropriate category table.
3. Copy an existing `<tr>` row and update:
   - `.file-name` — descriptive title
   - `.file-context` — brief context (event, co-authors, etc.)
   - `.file-badge` — choose a badge class: `badge-paper`, `badge-slides`, `badge-poster`, `badge-notes`
   - The date column
   - The `href` in the download button — should match `files/your-file-name.pdf`

**Badge colours at a glance:**

| Class | Colour | Use for |
|---|---|---|
| `badge-paper` | warm gold | preprints, journal papers |
| `badge-slides` | blue | talk slides |
| `badge-poster` | purple | conference posters |
| `badge-notes` | green | lecture notes, reading group summaries |

**To add a new category** (e.g. "Theses"):
Copy one of the `<div class="file-category">` blocks, give it a new `<h3>` heading, and populate with rows.

---

## Adding Downloadable Files

All PDF files (slides, posters, CV, notes) live in the `files/` subfolder. A consistent naming convention makes things easier to manage:

```
files/
├── cv_pignatelli.pdf
├── slides_[venue]_[month][year].pdf      e.g. slides_tuwien_may2025.pdf
├── poster_[venue]_[month][year].pdf      e.g. poster_como_jun2025.pdf
└── notes_[topic]_[year].pdf             e.g. notes_gradient_flows_2024.pdf
```

Link to them in any page with:
```html
<a href="files/your-file.pdf" class="btn btn-pdf" download>
  <svg viewBox="0 0 24 24"><path d="M12 16l-4-4h3V4h2v8h3l-4 4zm-7 2h14v2H5v-2z"/></svg>
  Download Slides
</a>
```

The `download` attribute triggers a file download rather than opening the PDF in the browser. Remove it if you prefer the browser to open it directly.

---

## Navigation & Shared Components

All pages share the same sidebar and mobile header, both of which are injected by **`nav.js`**. You only ever edit this one file to change shared navigation.

**To add a new page to the navigation:**
Open `nav.js` and find the `NAV` array near the top:

```javascript
var NAV = [
  { href: 'index.html',        label: 'Home'         },
  { href: 'about.html',        label: 'About'        },
  // ...
];
```

Add a new entry:
```javascript
{ href: 'newpage.html', label: 'New Page' },
```

Then create `newpage.html` following the same template as any existing sub-page (copy `about.html` as a starting point — it's the simplest).

**To update contact links or social buttons in the sidebar:**
Find the `buildSidebar` function in `nav.js` and edit the `sidebar-contact` HTML string inside it.

**Every sub-page requires these two elements** in its `<body>`:
```html
<header class="mobile-header" id="mobile-header"></header>
<aside  class="sidebar"       id="sidebar"></aside>
```
And this script at the bottom, before `</body>`:
```html
<script src="nav.js"></script>
```

---

## Dark / Light Mode

The site defaults to the system preference (`prefers-color-scheme`). The user's manual choice is stored in `localStorage` under the key `lp-theme` and persists across pages and visits.

The toggle button (moon/sun icon) appears:
- In the sidebar, top-right, on all sub-pages
- In the mobile header on small screens
- Fixed top-right on the homepage

All colours are defined as CSS custom properties in `styles.css`. Light and dark variants are declared in two blocks:

```css
:root, [data-theme="light"] {
  --bg:    #f5f1eb;
  --gold:  #8a6a2a;
  /* ... */
}

[data-theme="dark"] {
  --bg:    #131a22;
  --gold:  #c49a3c;
  /* ... */
}
```

To change a colour for both themes, edit it in both blocks. To change it for one theme only, edit just that block.

---

## Styling & Theming

All styles are in `styles.css`. The file is organised in clearly labelled sections matching the pages:

```
CSS Custom Properties  →  colours & fonts
Reset & Base           →  html, body, links, headings
Theme Toggle Button    →  .theme-btn
Sub-page Layout        →  .sidebar, .main-content
Mobile Header          →  .mobile-header, .hamburger
Page Headers           →  .page-label, .page-title
Homepage               →  .home-hero, .home-cards, ...
About                  →  .about-grid, .theorem-box, ...
Publications           →  .pub-list, .pub-item, .pub-badge, ...
Buttons                →  .btn, .btn-pdf, .btn-outline, ...
Talks                  →  .talk-list, .upcoming-item, ...
Teaching               →  .course-card, ...
CV Timeline            →  .timeline-track, .tl-item, ...
Misc                   →  .book-item, .project-card, .thought-item
Files                  →  .file-table, .file-badge, ...
Footer                 →  .site-footer
Responsive             →  @media breakpoints
Print                  →  @media print
```

**Fonts** are loaded from Google Fonts:
- `Cormorant Garant` — display headings
- `EB Garamond` — body text
- `DM Sans` — UI elements (nav, labels, badges)

To change the accent colour (currently gold `#8a6a2a` / `#c49a3c` for dark mode), update `--gold` and `--gold-h` in both theme blocks at the top of `styles.css`.

---

## Math Rendering

LaTeX is rendered by [MathJax 3](https://www.mathjax.org), loaded from jsDelivr CDN. It is configured on pages that need it:

```html
<script>
  window.MathJax = {
    tex: {
      inlineMath:  [['\\(', '\\)']],
      displayMath: [['\\[', '\\]']]
    }
  };
</script>
<script src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-chtml.js" async></script>
```

**Inline math** (within a sentence):
```html
where \( \varepsilon \to 0 \) is a small parameter
```

**Display math** (centred on its own line):
```html
\[
  \mathcal{F}_\varepsilon[u] = \int_\Omega \left( \varepsilon |\nabla u|^2
  + \frac{W(u)}{\varepsilon} \right) dx
\]
```

MathJax is only loaded on pages that include the config+script snippet (`about.html`, `publications.html`, `talks.html`, `misc.html`). If you add math to `teaching.html` or `cv.html`, add those two `<script>` tags to the `<head>` of those files.

---

## Deploying to GitHub Pages

1. **Create a repository** on GitHub (e.g. `luca-pignatelli.github.io` for a user page, or `website` for a project page).

2. **Push all files** to the repository:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/your-repo.git
   git push -u origin main
   ```

3. **Enable GitHub Pages:**
   - Go to your repository → **Settings** → **Pages**
   - Under *Source*, select **Deploy from a branch**
   - Choose `main` branch, `/ (root)` folder
   - Click **Save**

4. Your site will be live at `https://yourusername.github.io/` (user page) or `https://yourusername.github.io/your-repo/` (project page) within a minute or two.

5. **Update the live URL** in `index.html` at the top of this README.

> **Tip:** If you use a project page (not a user page), all internal links already work correctly because they are relative (`href="about.html"`), not absolute.

---

## Common Tasks — Quick Reference

| Task | File to edit |
|---|---|
| Change your name / title / affiliation | `index.html` and `nav.js` (sidebar) |
| Add a new paper | `publications.html` |
| Add a past talk | `talks.html` |
| Add an upcoming event | `talks.html` — `.upcoming-item` block |
| Add a new course | `teaching.html` |
| Add a timeline entry (CV) | `cv.html` |
| Add a book to the reading list | `misc.html` |
| Add a thought / blog-style note | `misc.html` |
| Add a side project | `misc.html` |
| Upload a PDF and link it | Drop in `files/`, add a row to `files.html`, add a button on the relevant page |
| Add a page to the nav | `nav.js` — `NAV` array |
| Change the accent colour | `styles.css` — `--gold` and `--gold-h` in both theme blocks |
| Change body font | `styles.css` — `font-family` on `body`, and update the Google Fonts import |
| Add LaTeX to a page that doesn't have it yet | Add the MathJax `<script>` tags to that page's `<head>` |
| Update social links in the sidebar | `nav.js` — `buildSidebar()` function |
| Update your profile photo | Replace `assets/photo.png` |

---

*Last updated: March 2026*
