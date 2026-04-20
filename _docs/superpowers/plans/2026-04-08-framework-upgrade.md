# Frontend Framework Upgrade Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade the namba.ngo Jekyll site from Bootstrap 3 + jQuery to Bootstrap 5 with vanilla JS, replace Owl Carousel with Splide, and migrate Ionicons to Font Awesome.

**Architecture:** Five-phase migration. Phase 1 swaps Bootstrap 3 for 5 (keeping jQuery temporarily). Phase 2 replaces Ionicons with Font Awesome. Phase 3 replaces Owl Carousel with Splide. Phase 4 rewrites all custom JS in vanilla JS and removes jQuery. Phase 5 cleans up dead files.

**Tech Stack:** Bootstrap 5.3.x, Splide 4.x, Font Awesome Kit (CDN, already in use), vanilla JS (ES6+), Jekyll/GitHub Pages.

**Key context:** The site has TWO independent full-HTML layouts: `_layouts/base.html` (most pages) and `_layouts/article.html` (article pages). Both have their own `<head>` with all CSS/JS references. Both must be updated in every phase.

---

## Phase 1: Bootstrap 3 to Bootstrap 5

### Task 1.1: Download Bootstrap 5 assets and update CSS/JS references

**Files:**
- Create: `assets/css/bootstrap.min.css` (Bootstrap 5.3.x)
- Create: `assets/js/bootstrap.bundle.min.js` (Bootstrap 5.3.x — includes Popper)
- Remove: `assets/css/bootstrap.css` (Bootstrap 3.4.1)
- Remove: `assets/js/bootstrap.js` (Bootstrap 3.4.1)
- Modify: `_layouts/base.html:46,64`
- Modify: `_layouts/article.html:35,51`

- [ ] **Step 1: Download Bootstrap 5.3.3 files**

```bash
cd /Users/tom/Code/nisekomtb.github.io
curl -L "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" -o assets/css/bootstrap.min.css
curl -L "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" -o assets/js/bootstrap.bundle.min.js
```

- [ ] **Step 2: Update CSS reference in `_layouts/base.html`**

Change line 46 from:
```html
<link href="/assets/css/bootstrap.css?d={{ build }}" rel="stylesheet" type="text/css"/>
```
To:
```html
<link href="/assets/css/bootstrap.min.css?d={{ build }}" rel="stylesheet" type="text/css"/>
```

- [ ] **Step 3: Update JS reference in `_layouts/base.html`**

Change line 64 from:
```html
<script src="/assets/js/bootstrap.js?d={{ build }}" type="text/javascript"></script>
```
To:
```html
<script src="/assets/js/bootstrap.bundle.min.js?d={{ build }}" type="text/javascript"></script>
```

- [ ] **Step 4: Update CSS reference in `_layouts/article.html`**

Change line 35 from:
```html
<link href="/assets/css/bootstrap.css?d={{ build }}" rel="stylesheet" type="text/css"/>
```
To:
```html
<link href="/assets/css/bootstrap.min.css?d={{ build }}" rel="stylesheet" type="text/css"/>
```

- [ ] **Step 5: Update JS reference in `_layouts/article.html`**

Change line 51 from:
```html
<script src="/assets/js/bootstrap.js?d={{ build }}" type="text/javascript"></script>
```
To:
```html
<script src="/assets/js/bootstrap.bundle.min.js?d={{ build }}" type="text/javascript"></script>
```

- [ ] **Step 6: Remove old Bootstrap 3 files**

```bash
rm assets/css/bootstrap.css
rm assets/js/bootstrap.js
```

- [ ] **Step 7: Verify site builds**

```bash
bundle exec jekyll build 2>&1 | head -20
```

- [ ] **Step 8: Commit**

```bash
git add assets/css/bootstrap.min.css assets/js/bootstrap.bundle.min.js _layouts/base.html _layouts/article.html
git add -u assets/css/bootstrap.css assets/js/bootstrap.js
git commit -m "chore: swap Bootstrap 3 CSS/JS for Bootstrap 5.3.3"
```

---

### Task 1.2: Remove IE polyfills and legacy viewport hacks

**Files:**
- Modify: `_layouts/base.html:82-110,141-142`
- Modify: `_layouts/article.html:69-97,128-129`
- Remove: `assets/js/respond.min.js`

- [ ] **Step 1: Remove IE conditional comments from `_layouts/base.html`**

Remove line 142 (the IE8 conditional comment with html5shiv and respond.js):
```html
<!--[if lt IE 9]> <script src="//cdnjs.cloudflare.com/ajax/libs/html5shiv/3.7.3/html5shiv.min.js"></script> <script type="text/javascript" src="/assets/js/respond.min.js"></script> <![endif]-->
```

- [ ] **Step 2: Remove IE conditional comments from `_layouts/article.html`**

Remove line 129 (same IE8 conditional comment).

- [ ] **Step 3: Remove IEMobile viewport hack from both layouts**

In `_layouts/base.html`, remove lines 82-110 (the `<style type="text/stylesheet">` block with vendor viewport prefixes AND the IEMobile navigator check script).

In `_layouts/article.html`, remove lines 69-97 (same blocks).

- [ ] **Step 4: Remove respond.min.js**

```bash
rm assets/js/respond.min.js
```

- [ ] **Step 5: Verify build**

```bash
bundle exec jekyll build 2>&1 | head -5
```

- [ ] **Step 6: Commit**

```bash
git add -u
git commit -m "chore: remove IE8 polyfills and legacy viewport hacks"
```

---

### Task 1.3: Update grid classes across all files

Bootstrap 5 renamed `col-xs-*` to `col-*`. All other breakpoints (`sm`, `md`, `lg`) remain the same.

**Files to update (search for `col-xs-`):**
- `_layouts/default.html:16`
- `_layouts/article.html:186`
- `_layouts/twin-peaks.html:135,147`
- `_includes/nav.html:77`
- `_includes/sponsors.html:12`
- `index.html`
- `raffle/index.html` + `ja/raffle/index.html`

**Class mapping:**

| Bootstrap 3 | Bootstrap 5 |
|---|---|
| `col-xs-12` | `col-12` |
| `col-xs-6` | `col-6` |
| `col-xs-4` | `col-4` |

- [ ] **Step 1: Find all `col-xs-` references**

```bash
cd /Users/tom/Code/nisekomtb.github.io
grep -rn "col-xs-" --include="*.html" --include="*.css" | grep -v "_site/"
```

- [ ] **Step 2: Replace `col-xs-` with `col-` in all HTML files**

Use find-and-replace across all `.html` files: `col-xs-` → `col-`. This is a safe global replacement because `col-xs-` is exclusively a Bootstrap 3 class prefix.

- [ ] **Step 3: Verify build and spot-check pages**

```bash
bundle exec jekyll serve --baseurl="" --open-url
```

Check: homepage, `/twin-peaks/`, `/events/`, `/get-involved/donate/`. Verify grid layouts render correctly at mobile and desktop widths.

- [ ] **Step 4: Commit**

```bash
git add -u
git commit -m "chore: rename col-xs-* to col-* for Bootstrap 5"
```

---

### Task 1.4: Update visibility and utility classes

**Class mapping:**

| Bootstrap 3 | Bootstrap 5 |
|---|---|
| `hidden-xs` | `d-none d-sm-block` |
| `hidden-sm` | `d-sm-none d-md-block` |
| `hidden-md` | `d-md-none d-lg-block` |
| `hidden-lg` | `d-lg-none` |
| `visible-xs` | `d-block d-sm-none` |
| `visible-sm` | `d-none d-sm-block d-md-none` |
| `visible-md` | `d-none d-md-block d-lg-none` |
| `visible-lg` | `d-none d-lg-block` |
| `img-responsive` | `img-fluid` |
| `pull-left` | `float-start` |
| `pull-right` | `float-end` |
| `center-block` | `mx-auto d-block` |
| `sr-only` | `visually-hidden` |

**Files:**
- `_layouts/base.html:234` — `hidden-xs hidden-sm` → `d-none d-md-block`
- `_layouts/article.html:316` — `hidden-xs hidden-sm` → `d-none d-md-block`
- `_includes/nav.html:193,204` — `hidden-lg hidden-md` → `d-lg-none`
- `_includes/hero-slides.html:306,314` — `sr-only` → `visually-hidden`
- `_includes/sponsors.html:18,22` — `img-responsive` → `img-fluid`
- `_layouts/event.html:340` — `pull-left` → `float-start`
- `_layouts/competition.html:372` — `pull-left` → `float-start`
- `_layouts/job.html:27` — `pull-left` → `float-start`
- `_layouts/article.html:193` — `pull-left` → `float-start`

Also update `legacy-grid.css` visibility classes:
- `visible-phone`, `visible-tablet`, `visible-desktop`, `hidden-phone`, `hidden-tablet`, `hidden-desktop`

- [ ] **Step 1: Find all Bootstrap 3 visibility/utility class usages**

```bash
grep -rn "hidden-xs\|hidden-sm\|hidden-md\|hidden-lg\|visible-xs\|visible-sm\|visible-md\|visible-lg\|img-responsive\|pull-left\|pull-right\|center-block\|sr-only" --include="*.html" | grep -v "_site/" | grep -v ".css"
```

- [ ] **Step 2: Replace each class using the mapping table above**

Apply substitutions file by file. Process layouts first, then includes, then pages.

Key changes:

`_layouts/base.html` line 234 — back-to-top button:
```html
<!-- Before -->
<div id="back-to-top" data-spy="affix" data-offset-top="200" class="back-to-top hidden-xs hidden-sm affix-top">
<!-- After -->
<div id="back-to-top" class="back-to-top d-none d-md-block">
```
Note: also remove `data-spy="affix"` and `data-offset-top="200"` and `affix-top` — the Affix plugin was removed in Bootstrap 4. We'll handle sticky behavior via CSS `position: sticky` or scroll JS in Phase 4.

`_layouts/article.html` line 316 — same back-to-top pattern.

`_includes/nav.html` line 193 — off-canvas toggle:
```html
<!-- Before -->
class="btn btn-primary off-canvas-toggle  hidden-lg hidden-md"
<!-- After -->
class="btn btn-primary off-canvas-toggle d-lg-none"
```

`_includes/nav.html` line 204 — off-canvas sidebar:
```html
<!-- Before -->
class="t3-off-canvas  hidden-lg hidden-md"
<!-- After -->
class="t3-off-canvas d-lg-none"
```

`_includes/sponsors.html` — replace `img-responsive` with `img-fluid`.

All `pull-left` → `float-start` in layouts.

`_includes/hero-slides.html` — replace `sr-only` with `visually-hidden`.

- [ ] **Step 3: Verify build and check responsive behavior**

```bash
bundle exec jekyll serve --baseurl="" --open-url
```

Check: hamburger menu appears on mobile widths, back-to-top button visible on desktop.

- [ ] **Step 4: Commit**

```bash
git add -u
git commit -m "chore: update Bootstrap 3 utility classes to Bootstrap 5 equivalents"
```

---

### Task 1.5: Update Bootstrap carousel (hero-slides)

The hero carousel in `_includes/hero-slides.html` uses Bootstrap's carousel component. Bootstrap 5 changed class names and data attributes.

**Files:**
- Modify: `_includes/hero-slides.html`

**Changes needed:**

| Bootstrap 3 | Bootstrap 5 |
|---|---|
| `.item` (slide class) | `.carousel-item` |
| `.item.active` | `.carousel-item.active` |
| `data-ride="carousel"` | `data-bs-ride="carousel"` |
| `data-slide-to="N"` | `data-bs-slide-to="N"` |
| `data-target="#hero"` | `data-bs-target="#hero"` |
| `data-slide="prev"` | `data-bs-slide="prev"` |
| `data-slide="next"` | `data-bs-slide="next"` |
| `data-interval="3000"` | `data-bs-interval="3000"` |
| `a.carousel-control.left` | `button.carousel-control-prev` |
| `a.carousel-control.right` | `button.carousel-control-next` |
| `<span class="fa-solid fa-chevron-left">` | `<span class="carousel-control-prev-icon">` or keep FA icon |

Note: Line 160 already has both `data-ride` and `data-bs-ride` — remove the old `data-ride`.

- [ ] **Step 1: Update the carousel container attributes**

Line 157-161, change from:
```html
<div
  id="hero"
  class="carousel slide carousel-fade"
  data-ride="carousel"
  data-bs-ride="carousel"
  data-interval="3000">
```
To:
```html
<div
  id="hero"
  class="carousel slide carousel-fade"
  data-bs-ride="carousel"
  data-bs-interval="3000">
```

- [ ] **Step 2: Update carousel indicators**

Replace all `data-target` with `data-bs-target` and `data-slide-to` with `data-bs-slide-to`:

```html
<!-- Before -->
<li data-target="#hero" data-slide-to="0" class="active"></li>
<!-- After -->
<li data-bs-target="#hero" data-bs-slide-to="0" class="active"></li>
```

Apply to all indicator `<li>` elements in the file.

- [ ] **Step 3: Update slide class names**

Replace all `class="item ` and `class="item"` with `class="carousel-item ` and `class="carousel-item"`:

Line 188: `class="item active"` → `class="carousel-item active"`
Line 235: `class="item {% if ...` → `class="carousel-item {% if ...`
Line 258: `class="item {% if ...` → `class="carousel-item {% if ...`

- [ ] **Step 4: Update carousel controls**

Lines 300-315, change from:
```html
<a class="left carousel-control" href="#hero" role="button" data-slide="prev">
  <span class="fa-solid fa-chevron-left" aria-hidden="true"></span>
  <span class="sr-only">Previous</span>
</a>
<a class="right carousel-control" href="#hero" role="button" data-slide="next">
  <span class="fa-solid fa-chevron-right" aria-hidden="true"></span>
  <span class="sr-only">Next</span>
</a>
```
To:
```html
<button class="carousel-control-prev" type="button" data-bs-target="#hero" data-bs-slide="prev">
  <span class="fa-solid fa-chevron-left" aria-hidden="true"></span>
  <span class="visually-hidden">Previous</span>
</button>
<button class="carousel-control-next" type="button" data-bs-target="#hero" data-bs-slide="next">
  <span class="fa-solid fa-chevron-right" aria-hidden="true"></span>
  <span class="visually-hidden">Next</span>
</button>
```

- [ ] **Step 5: Update inline CSS for `.item` references**

In the `<style>` block at the top of hero-slides.html, replace `.item` with `.carousel-item` and `.carousel-inner .item` with `.carousel-inner .carousel-item`:

```css
/* Before */
.carousel-inner .item { height: 100%; }
.item { background-size: cover; ... }
.carousel-inner .item:before { ... }
.item h1 { ... }
/* etc. */

/* After */
.carousel-inner .carousel-item { height: 100%; }
.carousel-item { background-size: cover; ... }
.carousel-inner .carousel-item:before { ... }
.carousel-item h1 { ... }
/* etc. */
```

Replace ALL `.item` references in the `<style>` block with `.carousel-item`.

- [ ] **Step 6: Verify carousel works**

```bash
bundle exec jekyll serve --baseurl="" --open-url
```

Check: homepage carousel auto-plays, prev/next buttons work, indicators work, caption text displays correctly.

- [ ] **Step 7: Commit**

```bash
git add _includes/hero-slides.html
git commit -m "chore: update hero carousel to Bootstrap 5 API"
```

---

### Task 1.6: Update Bootstrap data attributes across remaining files

Bootstrap 5 renamed all `data-*` attributes to `data-bs-*`.

**Files to check:**
- `_includes/nav.html` — `data-toggle="dropdown"`, `data-target`, `data-dismiss="modal"`
- `_layouts/base.html` — `data-spy="affix"` (removed in BS5)
- `_layouts/article.html` — `data-spy="affix"` (removed in BS5)

- [ ] **Step 1: Update nav.html data attributes**

Line 65-66: dropdown toggle:
```html
<!-- Before -->
data-target="#"
data-toggle="dropdown"
<!-- After -->
data-bs-target="#"
data-bs-toggle="dropdown"
```

Line 211: close button:
```html
<!-- Before -->
data-dismiss="modal"
<!-- After -->
data-bs-dismiss="modal"
```

- [ ] **Step 2: Remove Affix data attributes from back-to-top buttons**

The Bootstrap Affix plugin was removed in Bootstrap 4+. Remove `data-spy="affix"`, `data-offset-top="200"`, and `affix-top` class. The back-to-top button visibility will be handled by scroll JS (already exists in the inline script).

In `_layouts/base.html` line 234 and `_layouts/article.html` line 316, the back-to-top `<div>` should already be updated from Task 1.4. Verify `data-spy` and `data-offset-top` are gone.

- [ ] **Step 3: Search for any remaining BS3 data attributes**

```bash
grep -rn 'data-toggle=\|data-target=\|data-dismiss=\|data-spy=\|data-ride=\|data-slide=' --include="*.html" | grep -v "_site/" | grep -v "data-bs-"
```

Fix any remaining occurrences using the pattern `data-X` → `data-bs-X`.

Exceptions: do NOT rename `data-animation`, `data-delay`, `data-duration`, `data-responsive`, `data-pos`, `data-nav`, `data-effect` — these are custom attributes used by the site's own JS, not Bootstrap.

- [ ] **Step 4: Verify build**

```bash
bundle exec jekyll serve --baseurl="" --open-url
```

Check: desktop dropdown menus work on hover, off-canvas close button works.

- [ ] **Step 5: Commit**

```bash
git add -u
git commit -m "chore: update data-* attributes to data-bs-* for Bootstrap 5"
```

---

### Task 1.7: Update navbar classes in nav.html

Bootstrap 5 removed `navbar-default` and changed navbar structure.

**Files:**
- Modify: `_includes/nav.html:24-25`

- [ ] **Step 1: Update navbar classes**

Line 24:
```html
<!-- Before -->
<nav id="t3-mainnav" class="wrap navbar navbar-default t3-mainnav">
<!-- After -->
<nav id="t3-mainnav" class="wrap navbar t3-mainnav">
```

Note: `navbar-default` doesn't exist in Bootstrap 5 (it uses `navbar-light`/`navbar-dark` with `bg-*`). Since the site has fully custom navbar styling via `template.css` and `megamenu.css`, simply removing `navbar-default` is sufficient — the visual appearance is entirely CSS-driven.

Line 25:
```html
<!-- Before -->
<div class="t3-navbar navbar-collapse collapse">
<!-- After -->
<div class="t3-navbar navbar-collapse collapse" id="t3-navbar-collapse">
```

(Add an `id` for Bootstrap 5 collapse targeting if needed.)

- [ ] **Step 2: Update `.caret` usage**

Bootstrap 5 removed the `.caret` class. Replace `<em class="caret"></em>` in nav.html (line 71) with a CSS-only caret or Font Awesome icon:

```html
<!-- Before -->
<em class="caret"></em>
<!-- After -->
<span class="fa-solid fa-caret-down" style="font-size:10px; margin-left:4px;"></span>
```

- [ ] **Step 3: Verify navigation works**

```bash
bundle exec jekyll serve --baseurl="" --open-url
```

Check: main nav renders, dropdowns appear on hover, mobile hamburger triggers off-canvas.

- [ ] **Step 4: Commit**

```bash
git add _includes/nav.html
git commit -m "chore: update navbar classes for Bootstrap 5"
```

---

### Task 1.8: Remove legacy-grid.css

The `legacy-grid.css` file provides Bootstrap 2-era `.span*`, `.offset*`, `.visible-phone`, `.hidden-desktop` etc. None of these classes are used in any HTML file (they were already migrated to Bootstrap 3 grid).

**Files:**
- Remove: `assets/css/legacy-grid.css`
- Modify: `_layouts/base.html:47`
- Modify: `_layouts/article.html:36`

- [ ] **Step 1: Verify no HTML files use legacy-grid classes**

```bash
grep -rn "class=.*span[0-9]\|visible-phone\|hidden-phone\|visible-tablet\|hidden-tablet\|visible-desktop\|hidden-desktop\|row-fluid" --include="*.html" | grep -v "_site/" | grep -v ".css"
```

If any are found, update them to Bootstrap 5 equivalents before proceeding.

- [ ] **Step 2: Remove the CSS link from both layouts**

In `_layouts/base.html`, remove line 47:
```html
<link href="/assets/css/legacy-grid.css?d={{ build }}" rel="stylesheet" type="text/css"/>
```

In `_layouts/article.html`, remove line 36:
```html
<link href="/assets/css/legacy-grid.css?d={{ build }}" rel="stylesheet" type="text/css"/>
```

- [ ] **Step 3: Delete the file**

```bash
rm assets/css/legacy-grid.css
```

- [ ] **Step 4: Commit**

```bash
git add -u
git commit -m "chore: remove legacy-grid.css (Bootstrap 2 remnant)"
```

---

### Task 1.9: Update legacy-navigation.css for Bootstrap 5

The `legacy-navigation.css` provides `.dropdown-submenu` styles for nested dropdowns. Bootstrap 5 still uses `.dropdown-menu` but the submenu pattern needs updating.

**Files:**
- Modify: `assets/css/legacy-navigation.css`

- [ ] **Step 1: Update the CSS**

The existing CSS is still valid for the submenu pattern. The key change is that `.dropdown-submenu.open` may not be triggered the same way. Update the file to:

```css
.dropdown-submenu {
  position: relative;
}
.dropdown-submenu > .dropdown-menu {
  top: 0;
  left: 100%;
  margin-top: -5px;
  margin-left: -1px;
}
.dropdown-submenu.open > .dropdown-menu,
.dropdown-submenu.show > .dropdown-menu {
  display: block;
}
.dropdown-submenu > .dropdown-menu {
  border-radius: 1px;
}
.dropdown-submenu > a:after {
  display: block;
  content: " ";
  float: right;
  width: 0;
  height: 0;
  border-color: transparent;
  border-style: solid;
  border-width: 5px 0 5px 5px;
  border-left-color: #000000;
  margin-top: 5px;
  margin-right: -5px;
}
.dropdown-submenu.open > a:after,
.dropdown-submenu.show > a:after {
  border-left-color: #fd7d57;
}
```

The only change is adding `.show` selectors alongside `.open` — Bootstrap 5 uses `.show` instead of `.open` for dropdown state.

- [ ] **Step 2: Commit**

```bash
git add assets/css/legacy-navigation.css
git commit -m "chore: add Bootstrap 5 .show selectors to dropdown-submenu CSS"
```

---

### Task 1.10: Visual verification of Phase 1

- [ ] **Step 1: Start dev server**

```bash
bundle exec jekyll serve --baseurl="" --open-url
```

- [ ] **Step 2: Check every major page**

Test each page at desktop (1200px+), tablet (768px), and mobile (375px) widths:

1. Homepage (`/`) — hero carousel, sponsor logos, grid layout
2. Twin Peaks (`/twin-peaks/`) — sidebar + content layout, nav pills
3. Events listing (`/events/`) — card grid
4. Single event (`/events/[any-event]/`) — sidebar, list groups, buttons
5. Get Involved pages (`/get-involved/donate/`, `/get-involved/join/`, `/get-involved/partner/`)
6. Jobs listing (`/jobs/`)
7. Navigation — desktop dropdowns, mobile off-canvas

- [ ] **Step 3: Fix any visual regressions**

Common issues to watch for:
- Grid columns stacking incorrectly (check `col-*` classes)
- Dropdown menus not appearing (check `data-bs-toggle` attributes)
- Button styling changes (Bootstrap 5 buttons are slightly different — may need CSS overrides in `template.css`)
- `btn-default` no longer exists — if found, replace with `btn-secondary` or `btn-outline-secondary`

- [ ] **Step 4: Commit any fixes**

```bash
git add -u
git commit -m "fix: resolve Bootstrap 5 visual regressions"
```

---

## Phase 2: Ionicons to Font Awesome

### Task 2.1: Replace all Ionicon class references with Font Awesome

The site already has Font Awesome loaded via CDN Kit (`kit.fontawesome.com`). Replace all `ion-*` classes with FA equivalents.

**Icon mapping:**

| Ionicons 4 | Font Awesome 6 | Usage |
|---|---|---|
| `icon ion-ios-arrow-dropleft-circle` | `fa-solid fa-circle-chevron-left` | Carousel nav |
| `icon ion-ios-arrow-dropright-circle` | `fa-solid fa-circle-chevron-right` | Carousel nav |
| `icon ion-ios-arrow-round-forward` | `fa-solid fa-circle-arrow-right` | Action links |
| `icon ion-ios-arrow-up` | `fa-solid fa-arrow-up` | Back to top |
| `icon ion-logo-yen` | `fa-solid fa-yen-sign` | Donation tiers |
| `icon ion-ios-trophy` | `fa-solid fa-trophy` | Competition prizes |
| `icon ion-ios-beer` | `fa-solid fa-beer-mug-empty` | Adult membership |
| `icon ion-ios-pizza` | `fa-solid fa-pizza-slice` | Youth membership |
| `icon ion-ios-ice-cream` | `fa-solid fa-ice-cream` | Child membership |
| `icon ion-ios-restaurant` | `fa-solid fa-utensils` | Family membership |
| `icon ion-ios-camera` | `fa-solid fa-camera` | Partner benefit |
| `icon ion-ios-bicycle` | `fa-solid fa-bicycle` | Partner benefit |
| `icon ion-ios-leaf` | `fa-solid fa-leaf` | Partner benefit |
| `icon ion-ios-chatbubbles` | `fa-solid fa-comments` | Partner benefit |
| `icon ion-ios-trending-up` | `fa-solid fa-chart-line` | Partner benefit |
| `icon ion-ios-map` | `fa-solid fa-map` | Partner benefit |
| `icon ion-ios-analytics` | `fa-solid fa-chart-column` | Partner benefit |
| `icon ion-md-globe` | `fa-solid fa-globe` | Artist website |
| `icon ion-logo-instagram` | `fa-brands fa-instagram` | Social links |
| `icon ion-logo-facebook` | `fa-brands fa-facebook` | Social links |

**Files affected (EN + JA pairs):**
- `_layouts/base.html` (back-to-top, footer social)
- `_layouts/article.html` (back-to-top)
- `_layouts/competition.html` (trophy)
- `_includes/carousel.html` (nav arrows)
- `get-involved/donate/index.html` + `ja/` (yen, arrows)
- `get-involved/join/index.html` + `ja/` (beer, pizza, ice-cream, restaurant, arrows)
- `get-involved/partner/index.html` + `ja/` (camera, bicycle, leaf, chatbubbles, trending-up, map, analytics)
- `get-involved/crowdfund/index.html` + `ja/` (trophy)
- `jobs/index.html` + `ja/` (arrows)
- `artist-series/index.html` + `ja/` (instagram, globe)
- `raffle/index.html` + `ja/` (trophy)
- `twin-peaks/index.html` + `ja/` (carousel arrows)

- [ ] **Step 1: Replace Ionicon classes in layout files**

In `_layouts/base.html`:
- Line 236: `icon ion-ios-arrow-up` → `fa-solid fa-arrow-up`
- Line 270: `icon ion-logo-instagram` → `fa-brands fa-instagram`
- Line 273: `icon ion-logo-facebook` → `fa-brands fa-facebook`

In `_layouts/article.html`:
- Line 318: `icon ion-ios-arrow-up` → `fa-solid fa-arrow-up`

In `_layouts/competition.html`:
- Line 489: `icon ion-ios-trophy` → `fa-solid fa-trophy`

- [ ] **Step 2: Replace Ionicon classes in include files**

In `_includes/carousel.html` line 53:
```javascript
// Before
navText: [
  "<span class='icon ion-ios-arrow-dropleft-circle'></span>",
  "<span class='icon ion-ios-arrow-dropright-circle'></span>"
],
// After
navText: [
  "<span class='fa-solid fa-circle-chevron-left'></span>",
  "<span class='fa-solid fa-circle-chevron-right'></span>"
],
```

- [ ] **Step 3: Replace Ionicon classes in page files**

Process each page file listed above using the mapping table. For every EN page, also update its `ja/` counterpart.

The replacement pattern is consistent: `<span class="icon ion-*">` → `<span class="fa-solid fa-*">` (or `fa-brands` for brand icons).

- [ ] **Step 4: Update twin-peaks carousel nav icons**

In `twin-peaks/index.html` and `ja/twin-peaks/index.html`, find the owlCarousel navText config and apply the same arrow icon replacement as carousel.html.

- [ ] **Step 5: Verify all icons render**

```bash
bundle exec jekyll serve --baseurl="" --open-url
```

Check every affected page. Font Awesome icons should render with similar sizing to the old Ionicons. If sizing differs, check if the site's `.icon` CSS class applied specific sizing that now needs to target `.fa-solid` instead.

- [ ] **Step 6: Commit**

```bash
git add -u
git commit -m "chore: replace all Ionicons with Font Awesome equivalents"
```

---

### Task 2.2: Remove Ionicons files and CSS reference

**Files:**
- Remove: `assets/fonts/ionicons/` (entire directory)
- Modify: `_layouts/base.html` — remove Ionicons CSS link
- Modify: `_layouts/article.html` — remove Ionicons CSS link

- [ ] **Step 1: Verify no remaining `ion-` class references**

```bash
grep -rn "ion-ios-\|ion-md-\|ion-logo-" --include="*.html" | grep -v "_site/"
```

Must return zero results.

- [ ] **Step 2: Remove CSS links**

In `_layouts/base.html`, remove line 56:
```html
<link href="/assets/fonts/ionicons/css/ionicons.css?d={{ build }}" rel="stylesheet" type="text/css"/>
```

In `_layouts/article.html`, remove line 43:
```html
<link href="/assets/fonts/ionicons/css/ionicons.css?d={{ build }}" rel="stylesheet" type="text/css"/>
```

- [ ] **Step 3: Remove Ionicons directory**

```bash
rm -rf assets/fonts/ionicons/
```

- [ ] **Step 4: Also remove the old local Font Awesome CSS reference**

In `_layouts/base.html`, line 53 loads a local Font Awesome 4 CSS that's redundant with the Kit CDN on line 49. Remove it:
```html
<link href="/assets/fonts/font-awesome/css/font-awesome.min.css?d={{ build }}" rel="stylesheet" type="text/css"/>
```

Also check `_layouts/article.html` line 37 and 41 for the same redundant local FA CSS references and remove them.

- [ ] **Step 5: Commit**

```bash
git add -u
git commit -m "chore: remove Ionicons library and redundant local Font Awesome CSS"
```

---

## Phase 3: Owl Carousel to Splide

### Task 3.1: Add Splide assets

**Files:**
- Create: `assets/js/splide/splide.min.js`
- Create: `assets/js/splide/splide.min.css`
- Modify: `_layouts/base.html` — add Splide CSS/JS, remove Owl references
- Modify: `_layouts/article.html` — same

- [ ] **Step 1: Download Splide 4.x**

```bash
cd /Users/tom/Code/nisekomtb.github.io
mkdir -p assets/js/splide
curl -L "https://cdn.jsdelivr.net/npm/@splidejs/splide@4/dist/css/splide.min.css" -o assets/js/splide/splide.min.css
curl -L "https://cdn.jsdelivr.net/npm/@splidejs/splide@4/dist/js/splide.min.js" -o assets/js/splide/splide.min.js
```

- [ ] **Step 2: Update `_layouts/base.html`**

Replace line 57 (Owl CSS):
```html
<!-- Before -->
<link href="/assets/js/owl-carousel/owl.carousel.min.css?d={{ build }}" rel="stylesheet" type="text/css"/>
<!-- After -->
<link href="/assets/js/splide/splide.min.css?d={{ build }}" rel="stylesheet" type="text/css"/>
```

Replace line 69 (Owl JS):
```html
<!-- Before -->
<script src="/assets/js/owl-carousel/owl.carousel.min.js?d={{ build }}" type="text/javascript"></script>
<!-- After -->
<script src="/assets/js/splide/splide.min.js?d={{ build }}" type="text/javascript"></script>
```

- [ ] **Step 3: Update `_layouts/article.html` the same way**

Replace the Owl CSS link (line 44) with Splide CSS.
Replace the Owl JS link (line 56) with Splide JS.

- [ ] **Step 4: Commit**

```bash
git add assets/js/splide/ _layouts/base.html _layouts/article.html
git commit -m "chore: add Splide carousel assets, remove Owl Carousel references"
```

---

### Task 3.2: Rewrite carousel.html include for Splide

**Files:**
- Modify: `_includes/carousel.html`

- [ ] **Step 1: Rewrite the include**

Replace the entire content of `_includes/carousel.html` with:

```html
<div id="carousel-{{ include.id | default: 1 }}" class="latest-project">
  <div class="container">
    <div class="splide" id="splide-{{ include.id | default: 1 }}">
      <div class="splide__track">
        <ul class="splide__list">
          {% for image in include.images %}
          <li class="splide__slide"
            data-animation="move-from-bottom"
            data-delay="item-{{ forloop.index0 }}">
            <div class="intro-image">
              <img src="{{ image }}" alt="" />
            </div>
          </li>
          {% endfor %}
        </ul>
      </div>
    </div>
  </div>
</div>

<script>
  document.addEventListener('DOMContentLoaded', function () {
    new Splide('#splide-{{ include.id | default: 1 }}', {
      type: 'loop',
      perPage: {{ include.items | default: 2 }},
      gap: '36px',
      arrows: {{ include.nav | default: 'true' }},
      pagination: false,
      autoplay: {{ include.autoplay | default: 'true' }},
      interval: 2000,
      pauseOnHover: true,
      breakpoints: {
        1199: { perPage: 1 },
        979: { perPage: 1 },
        768: { perPage: 1 }
      }
    }).mount();
  });
</script>
```

- [ ] **Step 2: Verify carousels on pages that use this include**

Check: `/projects/twin-peaks/` and `/ja/projects/twin-peaks/` for project update carousels.

- [ ] **Step 3: Commit**

```bash
git add _includes/carousel.html
git commit -m "chore: rewrite carousel include for Splide"
```

---

### Task 3.3: Update twin-peaks trail sign carousel

The `twin-peaks/index.html` and `ja/twin-peaks/index.html` pages have a custom Owl Carousel for trail signs with an `onChanged` callback.

**Files:**
- Modify: `twin-peaks/index.html`
- Modify: `ja/twin-peaks/index.html`

- [ ] **Step 1: Find the Owl Carousel init in twin-peaks/index.html**

```bash
grep -n "owlCarousel\|owl-carousel" twin-peaks/index.html
```

- [ ] **Step 2: Replace the Owl markup with Splide markup**

Change the container from `<div class="owl-carousel">` to Splide structure:
```html
<div class="splide" id="trail-signs-carousel">
  <div class="splide__track">
    <ul class="splide__list">
      <!-- slides become <li class="splide__slide"> -->
    </ul>
  </div>
</div>
```

- [ ] **Step 3: Replace the Owl init script with Splide**

The Owl init has a custom `onChanged` callback that updates `.trail-sign` class. Convert to Splide's `moved` event:

```javascript
document.addEventListener('DOMContentLoaded', function () {
  var splide = new Splide('#trail-signs-carousel', {
    type: 'loop',
    perPage: 1,
    arrows: true,
    pagination: false,
    autoplay: false,
    drag: false
  });

  splide.on('moved', function (newIndex) {
    // Update trail sign background position
    var trailSign = document.querySelector('.trail-sign');
    if (trailSign) {
      trailSign.className = trailSign.className.replace(/trail-sign-\d+/g, '');
      trailSign.classList.add('trail-sign-' + newIndex);
    }
  });

  splide.mount();
});
```

Adapt the callback logic to match the existing Owl `onChanged` behavior.

- [ ] **Step 4: Apply same changes to `ja/twin-peaks/index.html`**

- [ ] **Step 5: Verify trail sign carousel works**

Check: slides advance, trail sign background updates on slide change.

- [ ] **Step 6: Commit**

```bash
git add twin-peaks/index.html ja/twin-peaks/index.html
git commit -m "chore: convert twin-peaks trail sign carousel to Splide"
```

---

### Task 3.4: Update any remaining Owl Carousel pages and remove Owl files

**Files:**
- Check: `auction/index.html`, `raffle/index.html`, `ja/raffle/index.html`
- Remove: `assets/js/owl-carousel/` (entire directory)

- [ ] **Step 1: Search for any remaining Owl references**

```bash
grep -rn "owl-carousel\|owlCarousel\|owl\.carousel" --include="*.html" | grep -v "_site/"
```

- [ ] **Step 2: Convert any remaining carousels to Splide**

Follow the same pattern as Task 3.2 — replace Owl markup with Splide, replace jQuery init with vanilla Splide init.

- [ ] **Step 3: Remove Owl Carousel files**

```bash
rm -rf assets/js/owl-carousel/
```

- [ ] **Step 4: Verify build and all carousels**

```bash
bundle exec jekyll serve --baseurl="" --open-url
```

- [ ] **Step 5: Commit**

```bash
git add -u
git commit -m "chore: remove Owl Carousel, all carousels now use Splide"
```

---

## Phase 4: Remove jQuery

### Task 4.1: Rewrite `script.js` in vanilla JS

The file does two things: equal-height columns and inview animations.

**Files:**
- Rewrite: `assets/js/script.js`
- Remove: `assets/js/inview.js` (replaced by IntersectionObserver)

- [ ] **Step 1: Rewrite `assets/js/script.js`**

```javascript
(function () {
  'use strict';

  // Equal-height columns
  function equalHeight() {
    var containers = document.querySelectorAll('.equal-height');
    containers.forEach(function (container) {
      var cols = Array.from(container.children).filter(function (el) {
        return el.classList.contains('col');
      });
      var isChildMode = container.classList.contains('equal-height-child');

      // Reset
      cols.forEach(function (col) {
        var target = isChildMode ? col.firstElementChild : col;
        if (target) target.style.minHeight = '0';
      });

      // Find max
      var maxHeight = 0;
      cols.forEach(function (col) {
        var target = isChildMode ? col.firstElementChild : col;
        if (target) {
          var h = target.getBoundingClientRect().height;
          if (h > maxHeight) maxHeight = h;
        }
      });

      // Apply
      cols.forEach(function (col) {
        var target = isChildMode ? col.firstElementChild : col;
        if (target) target.style.minHeight = (maxHeight + 1) + 'px';
      });
    });
  }

  // Run on load and watch for size changes
  document.addEventListener('DOMContentLoaded', function () {
    equalHeight();

    // Use ResizeObserver if available, fall back to polling
    if (window.ResizeObserver) {
      var ro = new ResizeObserver(equalHeight);
      document.querySelectorAll('.equal-height > .col').forEach(function (col) {
        ro.observe(col);
      });
    } else {
      setInterval(equalHeight, 500);
    }
  });

  // Inview animations (replaces inview.js jQuery plugin)
  document.addEventListener('DOMContentLoaded', function () {
    if (!document.querySelector('.enable-effect')) return;

    var targets = document.querySelectorAll('.t3-section-wrap > div, .t3-hero');
    if (!targets.length) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('ja-inview');
        }
      });
    }, { threshold: 0.1 });

    targets.forEach(function (el) {
      observer.observe(el);
    });
  });
})();
```

- [ ] **Step 2: Remove `assets/js/inview.js`**

```bash
rm assets/js/inview.js
```

- [ ] **Step 3: Remove inview.js reference from both layouts**

In `_layouts/base.html`, remove the inview.js `<script>` tag (line 70).
In `_layouts/article.html`, remove the inview.js `<script>` tag (line 57).

- [ ] **Step 4: Verify equal-height and animation work**

```bash
bundle exec jekyll serve --baseurl="" --open-url
```

Check: competition prizes grid has equal-height columns, homepage sections animate on scroll.

- [ ] **Step 5: Commit**

```bash
git add -u
git commit -m "chore: rewrite script.js in vanilla JS, remove inview.js"
```

---

### Task 4.2: Rewrite `caption.js` in vanilla JS

**Files:**
- Rewrite: `assets/js/caption.js`
- Modify: `_layouts/base.html:73-76` (inline init)
- Modify: `_layouts/article.html:60-63` (inline init)

- [ ] **Step 1: Rewrite caption.js**

```javascript
var JCaption = function (selector) {
  document.querySelectorAll(selector).forEach(function (img) {
    var title = img.getAttribute('title');
    var width = img.getAttribute('width') || img.width;
    var align = img.getAttribute('align') || getComputedStyle(img).float || 'none';
    var className = selector.replace('.', '_');

    var wrapper = document.createElement('div');
    wrapper.className = className + ' ' + align;
    wrapper.style.cssFloat = align;
    wrapper.style.width = width + 'px';

    img.parentNode.insertBefore(wrapper, img);
    wrapper.appendChild(img);

    if (title) {
      var caption = document.createElement('p');
      caption.className = className;
      caption.textContent = title;
      wrapper.appendChild(caption);
    }
  });
};
```

- [ ] **Step 2: Update inline init in both layouts**

In `_layouts/base.html`, change lines 73-77 from:
```html
<script type="text/javascript">
  jQuery(window).on('load', function () {
    new JCaption('img.caption');
  });
</script>
```
To:
```html
<script type="text/javascript">
  window.addEventListener('load', function () {
    new JCaption('img.caption');
  });
</script>
```

Same change in `_layouts/article.html` lines 60-64.

- [ ] **Step 3: Commit**

```bash
git add assets/js/caption.js _layouts/base.html _layouts/article.html
git commit -m "chore: rewrite caption.js in vanilla JS"
```

---

### Task 4.3: Rewrite `acm/script.js` using CSS

The grayscale hover effect can be done purely in CSS, which is simpler and more performant.

**Files:**
- Rewrite: `assets/js/acm/script.js`
- Modify: `_includes/sponsors.html:39-45` (remove inline jQuery)

- [ ] **Step 1: Rewrite `assets/js/acm/script.js`**

```javascript
(function () {
  'use strict';

  window.addEventListener('load', function () {
    document.querySelectorAll('.img-grayscale img').forEach(function (img) {
      // Create colour overlay clone
      var clone = img.cloneNode(true);
      clone.classList.add('gotcolors');
      clone.style.position = 'absolute';
      clone.style.opacity = '0';
      clone.style.zIndex = '10';
      img.parentNode.insertBefore(clone, img);

      // Swap to greyscale source
      img.src = img.src.replace('.png', '.g.png');
    });
  });

  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.img-grayscale .client-item').forEach(function (item) {
      var colorImg = item.querySelector('.gotcolors');
      if (!colorImg) return;

      item.addEventListener('mouseenter', function () {
        colorImg.style.transition = 'opacity 0.2s';
        colorImg.style.opacity = '1';
      });

      item.addEventListener('mouseleave', function () {
        colorImg.style.transition = 'opacity 0.5s';
        colorImg.style.opacity = '0';
      });
    });
  });
})();
```

- [ ] **Step 2: Remove inline jQuery from `_includes/sponsors.html`**

Remove lines 39-45:
```html
<script>
  (function($) {
    $(document).ready(function() {
      $('#acm-cliens-104 .client-img img.img-responsive').css({'filter': 'alpha(opacity=30)', 'zoom': '1', 'opacity': '0.3'});
    });
  })(jQuery);
</script>
```

Replace with:
```html
<style>
  #acm-cliens-104 .client-img img.img-fluid { opacity: 0.3; }
</style>
```

Note: also update `img-responsive` to `img-fluid` in this file if not already done in Phase 1.

- [ ] **Step 3: Commit**

```bash
git add assets/js/acm/script.js _includes/sponsors.html
git commit -m "chore: rewrite sponsor grayscale effect in vanilla JS"
```

---

### Task 4.4: Rewrite `off-canvas.js` in vanilla JS

This is the most complex rewrite. The off-canvas navigation handles scroll locking, fixed element repositioning, and multiple animation effects.

**Files:**
- Rewrite: `assets/js/off-canvas.js`

- [ ] **Step 1: Rewrite `assets/js/off-canvas.js`**

```javascript
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    var wrapper = document.body;
    var inner = document.querySelector('.t3-wrapper');
    var toggles = document.querySelectorAll('.off-canvas-toggle');
    var offcanvas = document.querySelectorAll('.t3-off-canvas');
    var closeButtons = document.querySelectorAll('.t3-off-canvas .close');
    var isLoading = false;
    var currentBtn = null;
    var currentNav = null;
    var direction = 'left';
    var savedScrollTop = 0;

    if (!wrapper || !inner) return;

    // Setup: move nav elements and add effect classes
    toggles.forEach(function (toggle) {
      var nav = document.querySelector(toggle.dataset.nav);
      if (!nav) return;
      var effect = toggle.dataset.effect;
      var dir = document.documentElement.dir;
      var pos = toggle.dataset.pos;
      var navDirection = (dir === 'rtl' && pos !== 'right') || (dir !== 'rtl' && pos === 'right') ? 'right' : 'left';

      nav.classList.add(effect, 'off-canvas-' + navDirection);

      var insideEffects = ['off-canvas-effect-3', 'off-canvas-effect-16', 'off-canvas-effect-7', 'off-canvas-effect-8', 'off-canvas-effect-14'];
      if (insideEffects.indexOf(effect) === -1) {
        inner.parentNode.insertBefore(nav, inner);
      } else {
        inner.insertBefore(nav, inner.firstChild);
      }
    });

    function show() {
      if (isLoading) return;
      isLoading = true;
      wrapper.classList.add('off-canvas-open');
      inner.addEventListener('click', hide);
      closeButtons.forEach(function (btn) { btn.addEventListener('click', hide); });
      setTimeout(function () { isLoading = false; }, 200);
    }

    function hide() {
      if (isLoading) return;
      isLoading = true;
      inner.removeEventListener('click', hide);
      closeButtons.forEach(function (btn) { btn.removeEventListener('click', hide); });

      setTimeout(function () {
        wrapper.classList.remove('off-canvas-open');
      }, 100);

      setTimeout(function () {
        if (currentBtn) {
          wrapper.classList.remove(currentBtn.dataset.effect);
        }
        wrapper.classList.remove('off-canvas-' + direction);
        document.documentElement.classList.remove('noscroll');
        document.documentElement.style.top = '';
        window.scrollTo(0, savedScrollTop);
        if (currentNav) {
          currentNav.classList.remove('off-canvas-current');
        }
        isLoading = false;
      }, 700);
    }

    toggles.forEach(function (toggle) {
      toggle.addEventListener('click', function (e) {
        e.stopPropagation();
        e.preventDefault();

        if (wrapper.classList.contains('off-canvas-open')) {
          hide();
          return;
        }

        currentBtn = toggle;
        currentNav = document.querySelector(toggle.dataset.nav);
        if (!currentNav) return;

        currentNav.classList.add('off-canvas-current');

        var dir = document.documentElement.dir;
        var pos = toggle.dataset.pos;
        direction = (dir === 'rtl' && pos !== 'right') || (dir !== 'rtl' && pos === 'right') ? 'right' : 'left';

        offcanvas.forEach(function (oc) {
          oc.style.height = window.innerHeight + 'px';
        });

        // Lock scroll
        savedScrollTop = window.pageYOffset || document.documentElement.scrollTop;
        document.documentElement.classList.add('noscroll');
        document.documentElement.style.top = -savedScrollTop + 'px';

        // Apply effect classes
        wrapper.className = wrapper.className.replace(/\s*off-canvas-effect-\d+\s*/g, ' ').trim() +
          ' ' + toggle.dataset.effect + ' off-canvas-' + direction;

        setTimeout(show, 50);
      });
    });
  });
})();
```

- [ ] **Step 2: Verify mobile off-canvas navigation**

```bash
bundle exec jekyll serve --baseurl="" --open-url
```

Test at mobile width: hamburger opens drawer, close button works, clicking outside closes, scroll is locked while open.

- [ ] **Step 3: Commit**

```bash
git add assets/js/off-canvas.js
git commit -m "chore: rewrite off-canvas.js in vanilla JS"
```

---

### Task 4.5: Rewrite `menu.js` in vanilla JS

The mega-menu system handles hover/click, positioning, animation timing, and tab behavior.

**Files:**
- Rewrite: `assets/js/menu.js`

- [ ] **Step 1: Rewrite `assets/js/menu.js`**

```javascript
(function () {
  'use strict';

  function T3Menu(elm, options) {
    this.menu = elm;
    if (!this.menu) return;

    this.options = Object.assign({}, T3Menu.defaults, options);
    this.childOpen = [];
    this.loaded = false;
    this.timer = null;
    this.start();
  }

  T3Menu.defaults = {
    duration: 400,
    timeout: 100,
    hidedelay: 200,
    hover: true,
    sb_width: 20
  };

  T3Menu.prototype.start = function () {
    if (this.loaded) return;
    this.loaded = true;

    var self = this;
    var items = this.menu.querySelectorAll('li');

    items.forEach(function (li) {
      var child = li.querySelector(':scope > .dropdown-menu');
      var link = li.querySelector(':scope > a');

      var item = {
        el: li,
        hasChild: !!child,
        hasLink: !!link,
        clickable: !(link && child),
        mega: li.classList.contains('mega'),
        status: 'close',
        timer: null,
        atimer: null,
        astimer: null,
        ftimer: null,
        ctimer: null
      };

      li._t3item = item;

      // Click
      if (child && !self.options.hover) {
        li.addEventListener('click', function (e) {
          e.stopPropagation();
          if (li.classList.contains('group')) return;
          if (item.status === 'close') {
            e.preventDefault();
            self.show(item);
          }
        });
      } else {
        li.addEventListener('click', function (e) {
          var target = e.target.closest('[data-bs-toggle]') || e.target.closest('[data-toggle]');
          if (target) return;
          e.stopPropagation();
        });
      }

      // Hover
      if (self.options.hover) {
        li.addEventListener('mouseenter', function () {
          if (li.classList.contains('group')) return;
          self.show(item);
        });

        li.addEventListener('mouseleave', function () {
          if (li.classList.contains('group')) return;
          self.hide(item);
        });

        if (link && child) {
          link.addEventListener('click', function (e) {
            if (item.clickable) {
              e.stopPropagation();
            }
            return item.clickable;
          });
        }
      }
    });

    // Click outside closes all menus
    document.body.addEventListener('click', function () {
      clearTimeout(self.timer);
      self.timer = setTimeout(function () { self.hideAlls(); }, 500);
    });
  };

  T3Menu.prototype.show = function (item) {
    var self = this;
    if (this.childOpen.indexOf(item) < this.childOpen.length - 1) {
      this.hideOthers(item);
    }

    clearTimeout(this.timer);
    clearTimeout(item.timer);
    clearTimeout(item.ftimer);
    clearTimeout(item.ctimer);

    if (item.status !== 'open' || !item.el.classList.contains('open') || !this.childOpen.length) {
      if (item.mega) {
        clearTimeout(item.astimer);
        clearTimeout(item.atimer);
        this.position(item.el);
        item.astimer = setTimeout(function () { item.el.classList.add('animating'); }, 10);
        item.atimer = setTimeout(function () { item.el.classList.remove('animating'); }, this.options.duration + 50);
        item.timer = setTimeout(function () { item.el.classList.add('open'); }, 100);
      } else {
        item.el.classList.add('open');
      }

      item.status = 'open';
      if (item.hasChild && this.childOpen.indexOf(item) === -1) {
        this.childOpen.push(item);
      }
    }

    item.ctimer = setTimeout(function () { item.clickable = true; }, 300);
  };

  T3Menu.prototype.hide = function (item) {
    clearTimeout(this.timer);
    clearTimeout(item.timer);
    clearTimeout(item.astimer);
    clearTimeout(item.atimer);
    clearTimeout(item.ftimer);

    var self = this;

    if (item.mega) {
      item.el.classList.add('animating');
      item.atimer = setTimeout(function () { item.el.classList.remove('animating'); }, this.options.duration);
      item.timer = setTimeout(function () { item.el.classList.remove('open'); }, 100);
    } else {
      item.timer = setTimeout(function () { item.el.classList.remove('open'); }, 100);
    }

    item.status = 'close';
    var idx = this.childOpen.indexOf(item);
    if (idx > -1) this.childOpen.splice(idx, 1);

    item.ftimer = setTimeout(function () {
      if (item.status === 'close') item.clickable = false;
    }, this.options.duration);

    this.timer = setTimeout(function () { self.hideAlls(); }, this.options.hidedelay);
  };

  T3Menu.prototype.hideOthers = function (item) {
    var self = this;
    this.childOpen.slice().forEach(function (open) {
      if (!item || (open !== item && !item.el.contains(open.el))) {
        self.hide(open);
      }
    });
  };

  T3Menu.prototype.hideAlls = function () {
    var self = this;
    this.childOpen.slice().forEach(function (item) {
      if (item) self.hide(item);
    });
  };

  T3Menu.prototype.position = function (el) {
    var sub = el.querySelector(':scope > .mega-dropdown-menu');
    if (!sub) return;

    var wasHidden = !sub.offsetParent;
    if (wasHidden) sub.style.display = 'block';

    var offset = el.getBoundingClientRect();
    var width = el.offsetWidth;
    var screenWidth = window.innerWidth - this.options.sb_width;
    var subWidth = sub.offsetWidth;
    var level = parseInt(el.dataset.level) || 0;

    if (wasHidden) sub.style.display = '';
    sub.style.left = '';
    sub.style.right = '';

    if (level === 1) {
      var alignOffset = offset.left;
      if (alignOffset + subWidth > screenWidth) {
        sub.style.left = (screenWidth - alignOffset - subWidth) + 'px';
      }
      if (alignOffset + parseInt(sub.style.left || 0) < 0) {
        sub.style.left = -alignOffset + 'px';
      }
    }
  };

  // Init
  document.addEventListener('DOMContentLoaded', function () {
    var megamenu = document.querySelector('.t3-megamenu');
    var duration = megamenu ? parseInt(megamenu.dataset.duration) || 0 : 0;
    var isHover = document.documentElement.classList.contains('mm-hover');

    if (duration) {
      var style = document.createElement('style');
      style.textContent =
        '.t3-megamenu.animate .animating > .mega-dropdown-menu,' +
        '.t3-megamenu.animate.slide .animating > .mega-dropdown-menu > div {' +
        'transition-duration: ' + duration + 'ms !important;' +
        '}';
      document.head.appendChild(style);
    }

    var timeout = duration ? 100 + duration : 500;

    document.querySelectorAll('ul.nav').forEach(function (nav) {
      if (nav.querySelector('.dropdown-menu') && !nav.closest('#t3-off-canvas')) {
        new T3Menu(nav, {
          duration: duration,
          timeout: timeout,
          hover: isHover
        });
      }
    });
  });
})();
```

- [ ] **Step 2: Verify desktop navigation**

```bash
bundle exec jekyll serve --baseurl="" --open-url
```

Check: hover opens dropdowns, click on links works, menu positions correctly, mega-menu animates.

- [ ] **Step 3: Commit**

```bash
git add assets/js/menu.js
git commit -m "chore: rewrite menu.js in vanilla JS"
```

---

### Task 4.6: Replace `t3.js` with minimal vanilla equivalent

Most of `t3.js` is legacy code: IE detection, MooTools conflict resolution, jQuery.browser polyfill, Joomla tooltip defaults. The only things still needed are touch detection and transform detection.

**Files:**
- Rewrite: `assets/js/t3.js`

- [ ] **Step 1: Rewrite t3.js**

```javascript
(function () {
  'use strict';

  // Touch detection
  document.documentElement.classList.add('ontouchstart' in window ? 'touch' : 'no-touch');

  // CSS transform support (used by menu positioning)
  var support = {};
  (function () {
    var style = document.createElement('div').style;
    var vendors = ['t', 'webkitT', 'MozT', 'msT', 'OT'];
    for (var i = 0; i < vendors.length; i++) {
      var transform = vendors[i] + 'ransform';
      if (transform in style) {
        support.t3transform = transform;
        break;
      }
    }
    if (!support.t3transform) support.t3transform = false;
  })();

  // Expose for menu.js
  window.T3Support = support;
})();
```

- [ ] **Step 2: Commit**

```bash
git add assets/js/t3.js
git commit -m "chore: reduce t3.js to minimal vanilla JS (touch + transform detection)"
```

---

### Task 4.7: Convert inline jQuery in HTML layouts

**Files:**
- Modify: `_layouts/base.html:239-257` (back-to-top + smooth scroll)
- Modify: `_layouts/article.html:321-330` (back-to-top)
- Modify: `_includes/hero.html` (smooth scroll to next section)

- [ ] **Step 1: Update back-to-top in `_layouts/base.html`**

Replace lines 239-258:
```html
<script type="text/javascript">
  (function () {
    // Back to top
    var backToTop = document.getElementById('back-to-top');
    if (backToTop) {
      // Show/hide based on scroll (replaces Bootstrap Affix)
      window.addEventListener('scroll', function () {
        if (window.pageYOffset > 200) {
          backToTop.style.display = '';
        } else {
          backToTop.style.display = 'none';
        }
      });
      backToTop.style.display = 'none';

      backToTop.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return false;
      });
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener('click', function (e) {
        var href = link.getAttribute('href');
        if (href.startsWith('#!')) return;
        var target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  })();
</script>
```

- [ ] **Step 2: Update back-to-top in `_layouts/article.html`**

Same pattern — replace the jQuery block with vanilla JS.

- [ ] **Step 3: Update hero.html smooth scroll**

If `_includes/hero.html` has a jQuery scroll handler, convert it to vanilla JS using `scrollIntoView`.

- [ ] **Step 4: Commit**

```bash
git add _layouts/base.html _layouts/article.html _includes/hero.html
git commit -m "chore: convert inline jQuery to vanilla JS in layouts"
```

---

### Task 4.8: Remove jQuery and related files

**Files:**
- Remove: `assets/js/jquery.min.js`
- Remove: `assets/js/jquery-noconflict.min.js`
- Remove: `assets/js/jquery-migrate.min.js`
- Remove: `assets/js/jquery.tap.min.js`
- Modify: `_layouts/base.html` — remove jQuery script tags
- Modify: `_layouts/article.html` — remove jQuery script tags

- [ ] **Step 1: Verify no remaining jQuery usage**

```bash
grep -rn "jQuery\|\\\$(" --include="*.html" --include="*.js" | grep -v "_site/" | grep -v "jquery" | grep -v ".min.js" | grep -v "node_modules"
```

Must return zero results (or only false positives like CSS selectors or Ecwid code).

- [ ] **Step 2: Remove jQuery script tags from `_layouts/base.html`**

Remove lines 60-62:
```html
<script src="/assets/js/jquery.min.js?d={{ build }}" type="text/javascript"></script>
<script src="/assets/js/jquery-noconflict.min.js?d={{ build }}" type="text/javascript"></script>
<script src="/assets/js/jquery-migrate.min.js?d={{ build }}" type="text/javascript"></script>
```

Remove line 65:
```html
<script src="/assets/js/jquery.tap.min.js?d={{ build }}" type="text/javascript"></script>
```

- [ ] **Step 3: Remove jQuery script tags from `_layouts/article.html`**

Same removals (lines 47-49 and 52).

- [ ] **Step 4: Delete jQuery files**

```bash
rm assets/js/jquery.min.js
rm assets/js/jquery-noconflict.min.js
rm assets/js/jquery-migrate.min.js
rm assets/js/jquery.tap.min.js
```

- [ ] **Step 5: Full site test**

```bash
bundle exec jekyll serve --baseurl="" --open-url
```

Open browser console. Verify zero JS errors. Test every major page and interaction.

- [ ] **Step 6: Commit**

```bash
git add -u
git commit -m "chore: remove jQuery and all jQuery plugins"
```

---

## Phase 5: Cleanup

### Task 5.1: Remove dead files and duplicate code

**Files:**
- Remove: `assets/js/decor_.js` (duplicate of `decor.js`)
- Remove: `assets/css/font-awesome.min.css` (old local FA, redundant with Kit CDN)
- Remove: `assets/fonts/font-awesome/` if only old FA4 files (CDN Kit handles everything)
- Audit: `assets/js/` and `assets/css/` for other dead files

- [ ] **Step 1: Remove known dead files**

```bash
rm assets/js/decor_.js
rm -f assets/css/font-awesome.min.css
```

- [ ] **Step 2: Check if local font-awesome directory is still referenced**

```bash
grep -rn "font-awesome" --include="*.html" --include="*.css" | grep -v "_site/" | grep -v "kit.fontawesome"
```

If no references remain, remove:
```bash
rm -rf assets/fonts/font-awesome/
```

- [ ] **Step 3: Remove the `legacy-navigation.css` link and file if no longer needed**

Check if `.dropdown-submenu` is still used:
```bash
grep -rn "dropdown-submenu" --include="*.html" | grep -v "_site/"
```

If still used, keep the file. If not, remove it and its `<link>` from both layouts.

- [ ] **Step 4: Check for unused CSS files**

```bash
for f in assets/css/*.css; do
  base=$(basename "$f" .css)
  count=$(grep -rl "$base" --include="*.html" | grep -v "_site/" | wc -l)
  echo "$f: referenced in $count files"
done
```

- [ ] **Step 5: Commit**

```bash
git add -u
git commit -m "chore: remove dead files and duplicate code"
```

---

### Task 5.2: Final verification

- [ ] **Step 1: Build site**

```bash
bundle exec jekyll build 2>&1
```

Zero errors expected.

- [ ] **Step 2: Full site walkthrough**

```bash
bundle exec jekyll serve --baseurl="" --open-url
```

Test every page type at 3 viewport widths (375px, 768px, 1400px):
- Homepage: hero carousel, sponsor grid, animations
- Twin Peaks: sidebar layout, nav pills, carousel
- Events listing: card grid
- Single event: sidebar, list groups, buttons, CTA
- Competition: prizes grid, equal-height
- Job: sidebar details
- Get Involved: donate, join, partner pages (icons, CTAs)
- Navigation: desktop hover dropdowns, mobile off-canvas
- Footer: social icons, copyright

- [ ] **Step 3: Check browser console for errors**

Open DevTools console. Navigate through all pages. Zero JS errors expected.

- [ ] **Step 4: Commit any final fixes**

```bash
git add -u
git commit -m "fix: final adjustments after framework upgrade"
```
