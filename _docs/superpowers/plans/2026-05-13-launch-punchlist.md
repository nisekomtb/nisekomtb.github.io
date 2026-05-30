# NAMBA Launch Punch-List Implementation Plan

> **Execution mode:** Conversation-driven, one task at a time. When Tom asks "what's next?" or similar, find the next unticked task in order, read the affected file(s), propose the changes + open questions in chat, get answers, implement (EN + JA mirror), tick the task, commit, stop.
>
> Each task lists its files and steps. Tasks where the exact change is known are pre-specified. Tasks where it's "investigate then act" document the investigation path and decision criteria. Either way, no work begins without a quick proposal to Tom.

**Goal:** Bring the `overhaul/website-restructure` branch to launch-ready by completing Phase 0 globals, Phase A per-page polish (Home last), Phase B humanize/SEO/JA sweep, and Phase C site-wide CSS audit.

**Architecture:** Four phases as defined in `_docs/superpowers/specs/2026-05-13-launch-punchlist-design.md`. Each tickable task = one "ask what's next" cycle.

**Tech Stack:** Jekyll, GitHub Pages, vanilla HTML/CSS/JS, Ecwid (shop), BudouX (JA tokenisation).

---

## Reusable Workflow Patterns

These patterns are referenced by tasks below. Do not skip steps unless explicitly noted.

### Pattern P-EN-JA: Bilingual edit

1. Make the EN change.
2. Mirror to the JA twin in the same change (machine translation acceptable; preserve meaning + tone).
3. **MANDATORY: Run BudouX on the JA twin before commit.** Insert U+200B (zero-width space) at word boundaries on every visible JA string. Without this, Japanese text wraps at random characters mid-word and reads broken. See `_docs/bilingual.md` for the CLI workflow. **Skip files that already contain U+200B** (the existing tokenisation is idempotent but re-running through BudouX's HTML reformatter can decode `&nbsp;` and break self-closing tags — see _includes/trails-table.html incident).
4. For JA front matter that renders as visible text (`titleHtml`, `location`, itinerary `name`, `moreInfo`, price `name`), tokenise with U+200B too. **Keep `title`, `description`, `address` plain** — these feed meta/OG/Schema and must stay untouched.
5. **MANDATORY: Confirm the masthead image is appropriate for the page.** If the page still uses the generic `/assets/images/bg/bg-header.jpg` fallback or a stale masthead from a prior incarnation of the page, source a new image via Pattern P-IMG and update `masthead.img` in both EN and JA front matter. Tick the corresponding row in Task A.28.
6. Confirm EN + JA file lists in the commit are paired. Both language twins go in the same commit, never split.

**If you find yourself about to call `Pattern P-COMMIT` without ticking steps 3 and 5 above, STOP.** These are the two most-skipped items in this workflow — protect them.

### Pattern P-IMG: Image replacement

1. List what's needed (count, aspect ratio, subject, page section) and ask Tom to drop candidates in `assets/images/_triage/`.
2. Pick from triage; process to WebP + responsive sizes; place in `assets/images/<page-slug>/`.
3. Provide bilingual `alt` text on every image.
4. If image becomes the page's primary, update `og.image` in front matter.
5. Remove old images from the page-specific images folder if fully replaced.

### Pattern P-COMMIT: Commit

1. `git add` only the files relevant to this task.
2. Commit message: short imperative summary; no `Co-Authored-By` trailer; no em dashes in the message.

### Pattern P-STYLE: Style-alignment audit

1. Compare the page to the new reference style established on About, Impact, Partner, Jobs, Shop.
2. Identify mismatches in spacing, typography, card patterns, section structure, hover states.
3. Propose: bring page up to new style, OR update the new style to absorb this page's variant.
4. Record decision in this plan's `Notes:` line for the task.
5. Implement; visual spot-check.

---

## Phase 0: Global Quick Wins

### Task 0.1: Replace horns emoji + set favicon

**Files:**
- Modify: `_includes/hero.html`, `_includes/hero-slides.html` (current horns image references)
- Modify: `_includes/head.html` (favicon link tags); verify it exists, or wherever favicon is declared
- Modify: `_includes/footer.html`, `_includes/nav.html`, `_layouts/default.html` if horns is in chrome
- Add: `assets/images/ico/*` favicon set (16, 32, 96, 180, 192, 512, ICO)
- Add: chosen replacement mark asset

Steps:
- [x] Run `grep -rn "horns\|🤘\|🤟" --include="*.html" --include="*.md" --include="*.scss" --include="*.css"` to inventory references.
- [x] Open each file and identify the visible horns usage (vs. a code comment).
- [x] Discuss with Tom: replacement mark concepts (single icon? Niseko-specific motif? typographic mark?). Tom provides asset to `assets/images/_triage/` once decided.
- [x] Generate favicon set: 16x16, 32x32, 96x96, 180x180 (apple-touch-icon), 192x192, 512x512, multi-size .ico. Place in `assets/images/ico/`.
- [x] Update favicon `<link>` tags in `_layouts/base.html` head section.
- [x] Replace inline horns image references site-wide (`_includes/hero.html`, `_includes/hero-slides.html`). EN + JA share these includes.
- [x] Local serve and visually verify: nav, footer, header, Home, plus one sub-page. (Tom confirmed.)
- [x] Pattern P-COMMIT (commit 6786862).

Notes: Resolved to torii. Asset is the Shinto Shrine emoji from Noto Emoji (Google, Apache 2.0). Attribution captured at `_docs/attributions.md`. Favicon set includes SVG primary + PNG fallbacks (16/32/96/192/512) + apple-touch-icon (180) + legacy multi-size .ico.
Decide: (resolved) torii via Noto Emoji

---

### Task 0.2: Fix Specialized sponsor name

**Files:**
- Modify: `_data/sponsors.yml` (canonical source for sponsor names)
- Modify: `_data/guides.yml`, `_data/hero.yml` (if Specialized appears there)
- Modify: `partner/index.html`, `ja/partner/index.html` (if hardcoded)

Steps:
- [x] Run `grep -rn "Specialized" --include="*.yml" --include="*.html" --include="*.md"` to find every reference.
- [x] Ask Tom what the corrected name should be.
- [x] Update canonical source: `_data/sponsors.yml` label "Trail building team partner" → "Trail crew sponsor"; JA label トレイルビルドチーム スポンサー → トレイルクルー スポンサー.
- [x] Update hardcoded copy: `_layouts/twin-peaks.html` sponsor strip title attribute. Commented future entry in `_data/guides.yml` also synced for consistency.
- [x] Verify in served site (`/twin-peaks/`, `/partner/`). (Tom confirmed.)
- [x] Pattern P-COMMIT (commit c9605d0).

Notes: Resolved: it was the **label** that needed updating, not the brand name itself. The Specialized brand mentions in body copy and event posts are unchanged.
Decide: (resolved) label rename

---

### Task 0.3: Language switcher nav background colour

**Files:**
- Modify: `_includes/nav.html` (likely location)
- Modify: relevant CSS file (locate via grep)

Steps:
- [x] Locate the language switcher: `<div class="languageswitcherload">` in `_includes/nav.html:144`.
- [x] Identify the CSS rule: `.languageswitcherload` at `assets/css/template.css:4860`, `background-color: rgba(0, 0, 0, 0.7)`.
- [x] Identify the target nav value: `rgba(0, 0, 0, 0.9)` (set on `.navbar-nav` and `.dropdown-menu` in commit cf7d8ae on 2026-04-27).
- [x] Update the switcher background to `rgba(0, 0, 0, 0.9)`. Hover/focus unaffected (no separate rule).
- [x] Visual check at desktop + mobile widths. (Tom confirmed.)
- [x] Pattern P-COMMIT (commit cdbcde7).

Notes: The nav darkening commit (cf7d8ae, 2026-04-27) updated `.navbar-nav` and `.dropdown-menu` from 0.7 → 0.9 opacity but missed `.languageswitcherload`. One-line fix.
Decide: (none open)

---

### Task 0.4: Decide handling for `/stories/` at launch

**Files:**
- Modify (depending on decision): `_includes/nav.html`, `stories/index.html`, possibly delete `stories/` and `ja/stories/`

Steps:
- [x] Discuss with Tom: keep with placeholder, hide from nav, or remove route entirely.
- [x] Record decision in this task's `Notes:` line.
- [x] Implement: comment out Stories entry in `_data/nav.yml`. Page stays live at `/stories/` and `/ja/stories/` for direct access. No footer nav references existed.
- [x] Verify on served site: Stories no longer appears in top nav (EN + JA); `/stories/` direct URL still works. (Tom confirmed.)
- [x] Pattern P-COMMIT (commit 2eb2085).

Notes: Decided to hide from nav. First story expected 1-2 weeks post-launch. Comment includes a hint to restore the entry when content lands.
Decide: (resolved) hide from nav

---

### Task 0.5: Move `/dirty-dames/` above `/press/` in nav

**Files:**
- Modify: `_includes/nav.html` (and any footer/mobile nav variants)

Steps:
- [x] Open nav source: `_data/nav.yml` (bilingual entries in one file).
- [x] Reorder so Dirty Dames sits above Press.
- [x] JA shares the same data file; structural reorder applies to both languages automatically.
- [x] Visual check on desktop + mobile. (Tom confirmed.)
- [x] Pattern P-COMMIT (commit 7e6cf65).

Notes: Nav is driven by `_data/nav.yml`, not split per-language. One reorder edits both languages.
Decide: (none open)

---

## Phase A: Per-Page Polish

Each page below is one or more tasks. Bilingual parity throughout (Pattern P-EN-JA).

### Per-Page Defaults (apply before commit on every remaining task)

These two checks must happen on every Phase A task that isn't already ticked. They are **not** listed inside each task's Steps to avoid duplication — treat them as required additions to whatever step list each task already has, and run them before `Pattern P-COMMIT`:

1. **Run BudouX on the JA twin.** Insert U+200B (zero-width space) at word boundaries on every visible JA string in the page body and any tokenisable JA front matter fields (`titleHtml`, `location`, itinerary `name`, `moreInfo`, price `name`). Skip `title`, `description`, `address`. See `_docs/bilingual.md` for the CLI workflow. Skip files that already contain U+200B (re-running on tokenised text is a no-op but waste).
2. **Update masthead image.** Confirm the page has a masthead photo worth keeping; if not, request a candidate via Pattern P-IMG, process to 2000px wide JPG at quality 82, place under `/assets/images/bg/bg-header-<page-slug>.jpg`, and update `masthead.img` in both EN and JA front matter. Tick the corresponding row in Task A.28's per-page checklist.

Apply to every remaining task from A.2 (twin-peaks remaining bullets) through A.26, except A.27 (Home — its own spec) and tasks that explicitly skip JA/masthead work in their notes.

### Task A.1: `/where-to-ride/` (hub)

**Files:**
- Modify: `where-to-ride/index.html`, `ja/where-to-ride/index.html`
- Possibly modify: any embedded data partials or related includes

Steps:
- [x] Read both files end to end.
- [x] Check stats block: 21km+ → 30km+ (regional total per `_data/impact.yml`). 20+ Trails → 24 Trails (TP 20 + GH 3 + Annupuri 1; Hanazono deferred per R.2). "4 Riding Areas" and "All Abilities" left as-is.
- [x] Map section: applied corrected GPS for all 9 POIs (per Tom). Pins now open an InfoWindow with photo (parks) or no photo (skills facilities), title, blurb, and a "View details ↓" button that scrolls to the matching ride card on the page and closes the popup.
- [x] Ride-area description scan: flagged below in Notes. Did not rewrite copy in this pass; can revisit during Phase B humanize sweep.
- [x] Removed the "3 routes" count from the gravel card; kept the 1,200km+ distance figure.
- [x] Removed the duplicate inline "trip planning guide" sentence from Season Info; kept the prominent CTA button at the bottom of the page.
- [x] Mirrored EN → JA, plus caught up missing JA translations on hero copy, stats cards 1–3, Season Info heading + paragraph, and CTA button (link also fixed from `/plan-your-trip/` → `/ja/plan-your-trip/`).
- [x] Visual check on served site (Tom signed off after iterative polish).
- [x] Pattern P-COMMIT.

Notes:
Done after several iterative polish passes beyond the original scope:
- Map popup redesigned to mirror the `.ride-card` pattern: photo background with gradient fade, centred logo (parks) or icon (skills), title, difficulty-count stats injected via Liquid `{% capture %}`+`jsonify` (stays in sync with `_data/trails.yml`), and a `.action`-style link that scrolls to the matching card.
- Map pins switched from logo glyphs to PinElement teardrops with a FontAwesome glyph: `fa-person-biking` for parks (scale 1.4, rust orange), `fa-diamond-turn-right` for skills (scale 1.0, forest green). Fixed pre-existing bug: `gmpClickable: true` required.
- Real photos sourced for 5/5 skills POIs: Twin Peaks Skills Centre, Grand Hirafu Skill-up Area, Tomo Playpark, Rusutsu Pump Track, Rhythm Japan Skills Park (`assets/images/skills/`).
- Hub stats updated: 21km+ → 30km+, 20+ Trails → 24 Trails (Hanazono excluded — see R.2). "4 Riding Areas" sub-text uses brand-correct short forms: Twin Peaks, Grand Hirafu, Niseko Hanazono, Niseko Annupuri (JA: ツインピークス、グラン・ヒラフ、ニセコHANAZONO、ニセコアンヌプリ).
- Copy polish across hero, all ride cards, and Riding Season. Annupuri data corrected to 3,200m / 556m (matches `_data/trails.yml`). JA hero heading translated to ニセコを走ろう.
- CSS fixes: icon-card emblem overlap matched to logo cards (bottom -30, 96px font); gravel/skills stat-icon padding for vertical parity with `dicon` glyphs; ride-card `.action` restored to strong white with arrow margin-shift animation on hover.

Brand-rename portion of A.3/A.4/A.7 happened in the same session: card headings, alt text, page titles, project sub-page titles, map POI titles, and canonical `_data/trails.yml` names updated. JA brand spellings: グランヒラフ → グラン・ヒラフ (middle dot); 花園 → ニセコHANAZONO (Latin); アンヌプリ → ニセコアンヌプリ. See A.3, A.4, A.7 Notes for scope detail.

---

### Task A.2: `/twin-peaks/`

**Files:**
- Modify: `twin-peaks/index.html`, `ja/twin-peaks/index.html`
- Possibly add: gallery section markup
- Modify: front matter if `og.image` changes

Steps:
- [x] Pattern P-STYLE audit against the new reference style. Sidebar layout retained (functional sub-nav + partners + park stats); no full restructure warranted. Spacing/spot-check passed.
- [x] Discuss background image change with Tom. Decision: defer to a cross-page masthead sweep after all Phase A pages are walked (see Task A.28).
- [x] Locate the "navigating around park" section. Remove it. Add a clear link to `/where-to-ride/signage/` in a sensible spot. Replaced with compact `.signage-link` paragraph directly under the trails table linking to `/where-to-ride/signage/` (EN) and `/ja/where-to-ride/signage/` (JA). Also stripped ~258 lines of `.trail-sign*` CSS, the `body:after` preloader for the trailsign zoom images, and the Splide init script that only served the removed carousel.
- [x] Check if gallery markup is already in the layout template. If not, add a gallery section near the bottom of the page; source images via Pattern P-IMG. No existing gallery pattern on the site; built one as `.tp-gallery` with `.gallery-grid` (1/2/3 columns at mobile/tablet/desktop), `.gallery-tile` (3:2 aspect-ratio), and `.gallery-placeholder` (fa-image icon + descriptive label). 6 placeholders shipped with category labels (aerial, flow, jumps, beginner, forest singletrack, trailhead signage). Real photos to be dropped into `assets/images/_triage/twin-peaks/` per Pattern P-IMG; placeholders swap to `<img>` tags inside `.gallery-tile`. **Placement:** gallery markup + CSS lives in `_layouts/twin-peaks.html` (not in the page) so it spans the full container width below the content + sidebar row. Gated with `{% unless path1 %}` so only the main `/twin-peaks/` page renders it, not the sub-pages (Access, Rules, Wet Trails, etc.). Bilingual labels via the layout's existing `{% if page.lang == "ja" %}` pattern.
- [x] Mirror EN → JA (Pattern P-EN-JA). JA placeholder labels tokenised with `<wbr>`. Signage link text: 「トレイルサインの読み方は、統一トレイルサインガイドをご覧ください。」 with `<wbr>` markup.
- [x] Visual check. (Tom confirmed.)
- [x] Pattern P-COMMIT — iterative commits across multiple sessions (888cba9 carousel-drop + signage link + gallery placeholders, 8c6f081 gallery to layout, 5e7281a single-panel sidebar + duplicate-H1 sweep, 74214dc/1cb6657/b0e1fc5 sidebar polish, 679ee9b sub-nav to tabs, eb4aa3b logo in panel, b1faa04 drop masthead subtitles, ebde5bd intro copy expansion, 03cc167 hide Getting-here on access).

Notes:
Background image deferred to cross-page sweep (Task A.28). Gallery uses placeholders awaiting real images via P-IMG. No JS errors expected: removed Splide init referenced a DOM ID that no longer exists; `.widget-cover` click handler preserved for the Trailforks map.

Second polish pass after Tom flagged style issues:
- **Duplicate H1 sweep**: Twin Peaks main + all 6 sub-pages (Access, Guides, Rules, Wet Trails, Commercial Pass, Emergency) had a redundant `<h1 class="article-title">` in the page body alongside the masthead `<h1 class="ja-masthead-title">`. Removed across all 14 files (7 EN + 7 JA). Pages now have exactly one h1 each, matching the rest of the site.
- **Heading colour unification**: three white in-content h3s now use `class="module-title"` (gold via `var(--color-accent)`, 18px Metropolis uppercase) to match the About/Impact/Partner/Jobs pattern: "A free community bike park" (intro), "Trails" (shared `_includes/trails-table.html` — also affects Grand Hirafu, Hanazono, Annupuri, Gravel, Skills Parks), "Gallery" (in layout).
- **Sidebar restructure**: collapsed the old two-module sidebar (separate Partners + Key Stats blocks) into one unified `.park-sidebar-panel` matching the Jobs/Events single-panel style. Logo + sub-nav pills stay above the panel. Inside the panel: "Key stats" module-title at top, then detail-item rows for Cost / Uplift type / Location / Trail stats / Bike Park status / Opening / Managed by, with the bike park partners as the last detail-item containing the logo grid. Each `.detail-item h4` is now a small gold uppercase mini-label (11px Metropolis, 0.5px tracking). Refactored `_includes/park-stats.html` to emit only `.detail-item` divs (no outer panel wrapper), with the panel + h3 owned by the layouts. Also applied the same panel wrapper to `_layouts/where-to-ride.html` so Grand Hirafu, Hanazono, Annupuri, etc. inherit the same sidebar style. New `.park-sidebar-panel` CSS lives in `assets/css/template.css` next to `.module-title` so both layouts share it.

---

### Task A.3: `/where-to-ride/grand-hirafu/`

**Files:**
- Modify: `where-to-ride/grand-hirafu/index.html`, `ja/where-to-ride/grand-hirafu/index.html`
- Modify: any references elsewhere in the site to "Grand Hirafu" without "Bike Park"

Steps:
- [x] Run `grep -rn "Grand Hirafu" --include="*.html" --include="*.md" --include="*.yml"` and identify which references need "Bike Park" appended.
- [x] Rename "Grand Hirafu" to "Grand Hirafu Bike Park" — applied to card headings and logo alt text on `/where-to-ride/` and `/projects/` (EN + JA). Body copy, listicles, resort-entity references, and internal docs intentionally left as-is per Bucket A scope (see Notes).
- [x] Update the Trailforks embed: confirmed `trailforks_rid: 58866` in `_data/trails.yml`; iframe swapped to the shared JS widget via `_layouts/where-to-ride.html` (commit b280d27).
- [x] Update trail list/specs against current data. Real trails in `_data/trails.yml`: Kamiwaza (blue, 1,800m, 280m descent, down-only), Hirafu Flow (blue, 2,200m, 250m descent, down-only), Hirafu Skills Area (green, 400m, two-way multi-use).
- [x] Audit section padding; fix where inconsistent with new reference style. Absorbed by the unified where-to-ride layout (b280d27) — all park pages now share spacing.
- [x] Add gallery images (Pattern P-IMG). 6 webp tiles in `assets/images/trails/grand-hirafu/gallery/` wired via `_data/trails.yml` (b280d27).
- [x] Mirror EN → JA (Pattern P-EN-JA) — done for the rename portion. JA gallery alts + trail JA names are in the shared data file; pages render from the same layout.
- [x] Visual check. EN + JA verified at desktop (1440) + mobile (375) via Playwright on 2026-05-30. Hero, masthead, Trailforks map embed, intro, trail table (3 trails: Kamiwaza blue, Hirafu Flow blue, Hirafu Skills Area green), signage guide card, 9-tile gallery (3×3 desktop, single-column mobile), sidebar park-stats panel with bike-park partners — all render correctly. JA twin structurally matches EN. Pre-existing trailforks 404s for individual trail status dots (trailid=0 fallback because per-trail Trailforks IDs aren't wired in `_data/trails.yml`) — same situation noted on A.4 Hanazono, out of A.3 scope.
- [x] Pattern P-COMMIT — rename portion shipped (81b9cee titles + alt; ac1fb83 brand-correct names + JA spelling; f2f09e7 stats card short form). Subsequent embed + trails + gallery work shipped in b280d27.

Notes:
Rename scope: Bucket A (headings + alt + page titles + canonical data names). Body copy, resort-entity references, park listicles, and internal docs left as-is. Twin Peaks `<h4>` on `/projects/` also gained "Bike Park" for consistency with the other two cards. JA-only spelling fix: グランヒラフ → グラン・ヒラフ (with middle dot) applied to UI headings + canonical name only; body copy still uses グランヒラフ.
Embed + trails + section padding + gallery all addressed via the unified where-to-ride layout work (b280d27) on 2026-05-15. Visual sign-off 2026-05-30 closes the task.
Decide: (none open)

---

### Task A.4: `/where-to-ride/hanazono/`

**Files:**
- Modify: `where-to-ride/hanazono/index.html`, `ja/where-to-ride/hanazono/index.html`
- Modify: any references elsewhere to "Hanazono" needing "Bike Park"

Steps:
- [x] Run `grep -rn "Hanazono" --include="*.html" --include="*.md" --include="*.yml"`.
- [x] Rename "Hanazono" → "Niseko Hanazono Bike Park" (per Tom's brand correction). Applied to card headings, logo alt text, page titles, and canonical `_data/trails.yml` names on `/where-to-ride/` and `/projects/` (EN + JA). JA brand spelling is `ニセコHANAZONOバイクパーク` (Latin "HANAZONO" preserved). Body copy and "Park Hyatt Niseko Hanazono" hotel reference left as-is per Bucket A scope.
- [x] Update Trailforks embed for Hanazono. Region ID `74136` set on both `trailforks_rid` (intro status badge) and `trailforks_map_rid` (region map iframe) in `_data/trails.yml`. Previous placeholder `58775` (Twin Peaks) removed.
- [x] Update trails + specs against current data. Replaced 3 placeholder trails with the 2 real Trailforks trails: Forest Loop Course (green, 1,360m, 39m climb / 36m descent, one-way, multi-use) and Downhill Course (blue, 4,212m, 0m climb / 347m descent, down-only, bikes only). Order is green-then-blue per difficulty convention. JA names transliterated to katakana (フォレストループコース / ダウンヒルコース) pending official JA names if signage exists. Per-trail status dots not wired yet (need individual trail IDs).
- [x] Add gallery images (Pattern P-IMG). 6 webp tiles in `assets/images/trails/hanazono/gallery/` with `-large.webp` lightbox variants, wired via `_data/trails.yml` and the PhotoSwipe lightbox in `_layouts/where-to-ride.html` (c04743a + b280d27).
- [x] Mirror EN → JA (Pattern P-EN-JA) — rename portion and data file shared. Body copy rewrite shipped in commit 9381d8d (Hanazono rewrite): EN + JA pages now describe only the two real Trailforks trails (4,200m Downhill Course blue + 1,360m Forest Loop green) per Tom's option (a). No aspirational skills park or TP link mentions.
- [x] Visual check (page renders, intro copy aligns with real trail data + summer 2026 opening framing).
- [x] Pattern P-COMMIT — rename portion shipped (81b9cee, ac1fb83, f2f09e7); trails + region update + gallery shipped (c04743a; layout share in b280d27); body-copy rewrite shipped (9381d8d).

Notes:
Rename scope: same Bucket A approach as A.3. Trails + region update done 2026-05-14 from Trailforks CSV export. Body-copy rewrite resolved 2026-05-25: Tom confirmed option (a) — `/where-to-ride/` sections should describe only what's currently rideable. Forward-looking aspirational content (skills park, TP link, expansion) lives on `/projects/hanazono/` instead.
Decide: (resolved) option (a) — describe only currently-rideable trails.

---

### Task A.5: `/where-to-ride/gravel/`

**Files:**
- Modify: `where-to-ride/gravel/index.html`, `ja/where-to-ride/gravel/index.html`

Steps:
- [x] Read both files end to end.
- [x] Check text for accuracy and tone (current state vs. NAMBA voice).
- [x] Add placeholder gallery images (Pattern P-IMG) ahead of real photos; mark placeholders clearly so they can be swapped later.
- [x] If real gravel images become available, replace placeholders.
- [x] Mirror EN → JA (Pattern P-EN-JA).
- [x] Visual check.
- [x] Pattern P-COMMIT.

Notes:
Page fully rewritten: dropped route-specific Area Highlights in favour of a 1,200km regional gravel showcase. Three interspersed in-body images (sunset-road-mountains, rider-rice-paddies, autumn-tunnel) instead of a gallery grid. Niseko Gravel event attribution corrected (it's hosted at nisekogravel.com, not by NAMBA). Masthead uses the 2025 Niseko Gravel autumn ride header.
Decide: (none open)

---

### Task A.6: `/where-to-ride/skills-parks/` (pumptracks)

**Files:**
- Modify: `where-to-ride/skills-parks/index.html`, `ja/where-to-ride/skills-parks/index.html`

Steps:
- [x] Read both files.
- [x] Check text accuracy for each listed facility.
- [x] Add images per facility (Pattern P-IMG).
- [x] Discuss with Tom: add per-facility external links (resort site, location pin)?
- [x] Implement decision.
- [x] Mirror EN → JA (Pattern P-EN-JA).
- [x] Visual check.
- [x] Pattern P-COMMIT.

Notes:
Page restructured into two groups: bike-park skills areas (Twin Peaks Skills Centre, Grand Hirafu Skill-up Area, Niseko Hanazono Skills Park) and standalone pump tracks (Tomo Playpark, Rhythm Japan, Rusutsu). Inline image after each location paragraph (`/assets/images/skills-parks/*.webp`). External links added where useful: grand-hirafu.jp, playpark.akaigawa-tomo.com, Trailforks for Rusutsu. Tomo Playpark framed as weekend trip with camping mention. Masthead uses Akaigawa pump track event header.
Decide: (resolved) per-facility external links added where they add value

---

### Task A.7: `/where-to-ride/annupuri/`

**Files:**
- Modify: `where-to-ride/annupuri/index.html`, `ja/where-to-ride/annupuri/index.html`

Steps:
- [x] Rename pass: page title, ride card heading + alt, map POI, and canonical `_data/trails.yml` name updated to "Niseko Annupuri Bike Park" / "ニセコアンヌプリバイクパーク" (EN + JA) alongside A.3/A.4 in the same commit. Old EN page title "Niseko Annupuri Downhill" replaced; JA title was "ニセコアンヌプリ ダウンヒル".
- [x] Discuss with Tom: does this page need the same polish pass as siblings, or is it already done? (It was not in the original list.)
- [x] If yes: apply Pattern P-STYLE, check text, gallery images via Pattern P-IMG.
- [x] Mirror EN → JA (Pattern P-EN-JA) if changes made.
- [x] Pattern P-COMMIT.

Notes:
Decision: polish. Page lean-rewritten with focus on gondola access, Shimizu-supervised course design (past tense — he doesn't have ongoing involvement), Downhill Series Niseko round annual host, raw natural-line trail not for beginners, and the non-NAMBA status (no unified signage). Gallery added (6 images: 5 race day + 1 cropped resort site sunset shot). `signage_card="false"` opt-out passed to the trails-table include so the NAMBA signage card doesn't appear on this non-NAMBA park page.
Decide: (resolved) polish

Follow-up:
- [x] Source a new lead/gallery photo for `/where-to-ride/annupuri/`. **Handled in a separate session** — `assets/images/trails/annupuri/01.jpg` already swapped (918k → 733k working tree diff). Not tracked here further.

---

### Task A.7a: `/where-to-ride/signage/`

**Files:**
- Modify: `where-to-ride/signage/index.html`, `ja/where-to-ride/signage/index.html`

Steps:
- [x] Read both files end to end. Initial state: 4-section page (intro, photo placeholder, reading a trail sign, difficulty ratings, "Across the Niseko network", CTA). Difficulty ratings rendered as a flat list. Copy carried AI tells ("creating a cohesive destination experience", duplicate intro/closer).
- [x] Humanize EN copy across all sections. Dropped the "Across the Niseko network" section since it restated the intro. Tightened the trail-sign reading list (e.g. "Difficulty rating" now points to the cards below; "Direction" replaces "Trail direction"). Intro re-cast as a direct "same signage everywhere we manage" statement.
- [x] Replace the flat difficulty list with 4 grid cards. Each card: big dicon, colour name, IMBA difficulty label (gold uppercase), short description. Green/Blue use the default panel border; Black gets a 2px white border; Double Black gets a 2px `#be0014` border (the red used on the maps). Responsive grid: 4 columns desktop, 2 columns tablet, 1 column mobile.
- [x] Mirror EN → JA. Ran BudouX on all visible JA strings (intro paragraph, list items, card descriptions, headings). Manually corrected three bad splits the model produced: 統一ト | レイルサイン → 統一 | トレイルサイン, and 方 | 向 collapsed to 方向 everywhere it appeared.
- [x] Masthead already on a trail-sign-focused image (`/assets/images/twinpeaks/trailsign.jpg`) — kept. Ticked off the A.28 entry below.
- [x] Side-by-side "Reading a trail sign" layout shipped: tall trail-sign photo (Tom's Rise 'n' Ryder shot, cropped 1000×2000) on the left, ordered spec list on the right matching the sign top-to-bottom (name → difficulty → sponsor → location → direction → users → QR → riding area). Anchor links in the list jump to the matching detailed sections below.
- [x] "Your location" callout: recreated the on-sign location box (white tile, red `fa-location-dot` pin, "C30" code) plus the easy-ryder-locations.jpg map showing codes along a real trail.
- [x] Trail direction (4 cards) and Trail users (3 cards) built using the existing trail-key PNGs. No-bikes icon supplied by Tom and wired in.
- [x] Full-page copy review. Humanised throughout, added IMBA anchor in Difficulty, dropped "explained" from the heading, parallelised Trail direction descriptions, clarified "NAMBA-managed trail" + "marked sections" in Your location, updated QR copy to Trailforks terminology. JA mirrored with BudouX.
- [x] Closing section decision: leaving the CTA as the closer. The intro now covers the "same signs everywhere" framing the old "Across the Niseko network" section repeated.
- [x] Visual check on served site (Tom signed off).
- [x] Pattern P-COMMIT.

Notes:
Page was missing from the original A.1-A.26 listing. Slotted here as A.7a since it's still a `/where-to-ride/` sub-page. Linked from `/twin-peaks/` and from every park page's trail-table via the unified signage card.

---

### Task A.8: `/plan-your-trip/`

**Files:**
- Modify: `plan-your-trip/index.html`, `ja/plan-your-trip/index.html`

Steps:
- [x] Replace images (Pattern P-IMG).
- [x] Check text accuracy + tone.
- [x] Mirror EN → JA (Pattern P-EN-JA).
- [x] Visual check.
- [x] Pattern P-COMMIT (commits 78484a1 humanizer + JA body translation, 6b1bc72 copy fixes + real images + directions map + new masthead).

Notes:
First commit (78484a1): humanizer + factual pass stripped "world-class", "spectacular", "unlike anywhere else" etc, and the JA body got a full translation from English.
Second commit (6b1bc72) covered: copy fixes (drop Hanazono-opens, mandatory-helmet, Yotei Brewing parentheticals; soften "Biggest events month"; October references first snow on Mt Yotei peak; EZObase → Rhythm Japan and NAC; unlink community partners; walk-in onsen note; expanded activities); real WebP images replacing 4 placeholder boxes (hero-yotei, bike-rental, accommodation, onsen); 4-image seasonal PhotoSwipe gallery (`.seasons-gallery` CSS in template.css); new masthead `bg-header-plan-your-trip.jpg`; dark Google Maps directions widget CTS → Hirafu Welcome Centre with clickable pins opening external Google Maps directions.
Decide: (none open)

---

### Task A.9: `/about/`

**Files:**
- Modify: `about/index.html`, `ja/about/index.html`
- Modify: `assets/css/template.css` (shared `.features-item` rule — affects every page using this card pattern)

Steps:
- [x] Add images (Pattern P-IMG). New masthead `bg-header-about.jpg` (aerial trail-network shot); group dig-day photo + trail-crew with mini-excavator photo replacing the two body placeholders. Outstanding: 4 satellite-view placeholders still need source files.
- [x] Check text. Humanizer pass dropped six AI tells across EN + JA (untapped potential, grassroots dream, and beyond, the driving force behind, most ambitious, instantly becomes).
- [x] Card hover style decision: outline (gold border on hover) was already chosen. Additional refinement on top: whole card now clickable via stretched-link pseudo on `.action`. Hovering anywhere on the card triggers the existing arrow-nudge animation; the link text + arrow look identical.
- [x] CSS change: added `.action { position: static }` override + `.action::after { inset: 0; z-index: 2 }` pseudo, gated by `:has(a)` so cards without a link (e.g. dirty-dames "Why it matters" stats trio) are untouched. Affects every `.features-item` site-wide.
- [x] Mirror EN → JA (Pattern P-EN-JA). Body copy + masthead front matter mirrored to `ja/about/index.html`. CSS change applies to JA automatically.
- [x] Visual check (Tom confirmed via debug-overlay test that pseudo is painting).
- [x] Pattern P-COMMIT — content + masthead + body images shipped in commit 6629dfe. CSS stretched-link refinement is uncommitted (current working tree).

Notes:
Decide: (resolved) outline hover + stretched-link on the whole card.

---

### Task A.10: `/team/`

**Files:**
- Modify: `team/index.html`, `ja/team/index.html`
- Possibly modify: a data file if team members are listed in YAML

Steps:
- [x] Read both files.
- [x] Discuss with Tom: add sub-committee volunteers (Hiromi, Elle, Hugo)? **Deferred** — Tom confirmed defer (post-launch addition once bios + photos exist).
- [x] Final text pass on existing entries. Light humanizer pass on intro + leader quotes (Paul Wright, Shunichi Kimura, Ross Carty) — dropped "passionate", "united by a shared vision", "truly exciting", "the advent of e-MTBs", "personally witnessed", "truly untapped", "globally recognized". Trail Crew description deduped.
- [x] Mirror EN → JA (Pattern P-EN-JA). Mirrored in same commit.
- [x] Visual check. (Implicit — shipped commit.)
- [x] Pattern P-COMMIT (commit 775b584 — masthead, humanizer, jobs CTA).

Notes:
Decide: (deferred) add sub-committee volunteers post-launch.

---

### Task A.11: `/projects/` (hub)

**Files:**
- Modify: `projects/index.html`, `ja/projects/index.html`

Steps:
- [x] Apply project renames: "Yotei 360" stays (no rename). "Hanazono" → "Niseko Hanazono Bike Park" for card headings + canonical data only (per A.4). Twin Peaks + Grand Hirafu Bike Park labels confirmed.
- [x] Replace images (Pattern P-IMG). New masthead `bg-header-projects.jpg` (two crew with map + Mt Yotei in background). Body panorama uses Annupuri aerial.
- [x] Switch project cards to resort marks: Twin Peaks SVG, Grand Hirafu PNG, Hanazono PNG. Yotei 360 keeps FA route icon.
- [x] Add unified-signage section linking to `/where-to-ride/signage/`, sitting between Current Projects and Alpine Trails.
- [x] Mirror EN → JA (Pattern P-EN-JA).
- [x] Visual check. (Implicit — shipped.)
- [x] Pattern P-COMMIT (commit d30c38f — masthead, resort logos, signage section, humanizer).

Notes:
Decide: (resolved) resort icons + signage section both added.

---

### Task A.12: `/projects/twin-peaks/`

**Files:**
- Modify: `projects/twin-peaks/index.html`, `ja/projects/twin-peaks/index.html`

Steps:
- [x] Create phase photos: per-phase satellite/map graphics showing trails by year. **Complete** — 5 real WebP satellites in `assets/images/projects/twin-peaks/` (2022, 2023, 2024, 2025, 2026) with `-large` variants for PhotoSwipe lightbox.
- [x] Make phase photos larger / add a way to view detail. Decision: **lightbox via PhotoSwipe**. Placeholders enlarged to 2-up grid (1-col mobile) with map-pin icon + year + label. PhotoSwipe wiring to be added when real images exist.
- [x] Replace other page images (Pattern P-IMG): signage placeholder replaced with the `/assets/images/partner/trail-map-board.webp` shot (reused from /partner/). Masthead kept (Larnach shot).
- [x] Check text: positioning fixed ("free-access" → "free-to-ride", "MTB Network" → "MTB Park"), timeline figures synced with `_data/impact.yml`, Pinkbike line dropped from 2025, added detail (Soil Searching, Taki Tech, Dirty Dames 30+, Loic Bruni). Funding stats rebuilt from canonical data: 92% private/community, 74% local businesses, 82% direct trail construction.
- [x] Convert timeline to the style used on About and Impact pages: `.journey-timeline` with alternating L/R cards, gold accent year, head + desc, animated NOW indicator on 2026.
- [x] Mirror EN → JA (Pattern P-EN-JA).
- [x] Visual check.
- [x] Pattern P-COMMIT.

**Cross-page sync (folded into this commit):** TP-specific 21km+ → 17km+ on `/twin-peaks/`, `/ja/twin-peaks/`, `/projects/` index, `/ja/projects/`, `/where-to-ride/`, `/ja/where-to-ride/`, `/press/`, `/ja/press/`. `/projects/` TP card "free-access" → "free-to-ride". /impact/ description + stat-number stay at 21km+ (NAMBA-total, matches `_data/impact.yml trails[2025].namba_km`).

**Cross-page extension:**
- Same 4 satellites (2022-2025) added to `/about/` and `/ja/about/` as a 4-up phase-grid gallery replacing the placeholder boxes. Inline CSS + PhotoSwipe wiring on each page. Uses TP-specific km figures from `_data/impact.yml`. **Phase C candidate:** the inline phase-grid CSS now lives on two pages (TP project page + about page); consolidate into shared stylesheet during CSS audit.

**Deferred follow-up:**
- `/twin-peaks/` landing copy still mentions "14.2km of trail" at 2023 opening (impact data says 10.4km network at end of 2023) and uses "free-access" wording — flag for a separate sweep.

Notes:
Decide: (resolved)

---

### Task A.13: `/projects/grand-hirafu/`

**Files:**
- Modify: `projects/grand-hirafu/index.html`, `ja/projects/grand-hirafu/index.html`

Steps:
- [x] Read the current state. Diff against `projects/twin-peaks/index.html` to identify missing sections.
- [x] Unify style with Twin Peaks project page: phase grid + 4-year Growth Timeline (Tokyu 2023 → Ace Gondola 2026), "Working with Tokyu" section, NAMBA's Role list. Phase grid 3-tile (vs TP's 5-tile).
- [x] Check text. Humanizer pass across all sections.
- [x] Replace images (Pattern P-IMG). Concept imagery + phase grid tiles.
- [x] Add Unified Signage section (matches Hanazono), sitting between NAMBA's Role and CTA.
- [x] Mirror EN → JA (Pattern P-EN-JA).
- [x] Visual check (implicit — shipped commits).
- [x] Pattern P-COMMIT — main overhaul in commit 3d9cee2; signage section added in f5d9cf4.

Notes:
Decide: (resolved) — full overhaul shipped, signage section parity with Hanazono.

**Timeline content (Tom-supplied, km figures from trail-length stats screenshot):**
- 2023 — Tokyu builds 5.3km top-to-bottom flow at Grand Hirafu (Kamiwaza 2.1km, Kuro Obi 1.8km, Kaikan 1.4km) — non-NAMBA. After seeing the success of Twin Peaks opening, Tokyu approaches NAMBA to take over building at Grand Hirafu.
- 2024 — NAMBA reworks the lower trail (Kaikan Rebuild 2.1km) to make it easier for beginners, and starts work on connector trails (Kings High 0.7km, Key Path 0.8km) heading over toward Twin Peaks. NAMBA-built at GH: 3.6km.
- 2025 — NAMBA pitches a project with Loic Bruni and Nico Vink, who are invited over for planning. NAMBA starts to prepare for Grand Hirafu's switch to the newly installed Ace Gondola.
- 2026 — Linking the trails top and bottom to the new Ace Gondola. Old trails (Kaikan, Kings High, Key Path) are decommissioned; new Lower Blue (2.0km) is built to fit the gondola layout. NAMBA-built at GH (post-rebuild): 2.0km.

---

### Task A.14: `/projects/hanazono/`

**Files:**
- Modify: `projects/hanazono/index.html`, `ja/projects/hanazono/index.html`

Steps:
- [x] Diff against Twin Peaks project page, unify style with phase maps + timeline. 3-year Growth Timeline (2024 pitch → 2026 Phase 1) + 3-tile phase grid with Future tile.
- [x] Check text. Heading reframed to "lift-served blue top-to-bottom" for accuracy. Aspirational content (skills park, 2027 expansion) lives here on the projects page, not on /where-to-ride/ (per A.4 resolution).
- [x] Replace images (Pattern P-IMG).
- [x] NAMBA's Role + What's Being Built sections added (green forest loop, 2027 expansion noted).
- [x] Mirror EN → JA (Pattern P-EN-JA).
- [x] Visual check.
- [x] Pattern P-COMMIT (commit 3d9cee2).

Notes:
Decide: (resolved)

**Timeline content (Tom-supplied, km figures from trail-length stats screenshot):**
- End of 2024 — NAMBA pitches Hanazono that now is the time to invest in mountain biking, and shares the masterplan for Niseko.
- 2025 — Because Hanazono has many landowners and varied forest, initial permitting begins. First 1km of Lower Symphony Blue built.
- 2026 — Symphony Blue (4.2km) and Forest Loop / forest adventure course (1.4km) complete. Park opens to the public with 5.6km of new NAMBA-built trail. Aggressive build continues with half of the next blue trail, additional progression lines in the forest loop (turning it into a skill centre), and a green loop trail at the top of the Hana1 lift.

---

### Task A.15: `/projects/yotei-360/`

**Files:**
- Modify: `projects/yotei-360/index.html`, `ja/projects/yotei-360/index.html`

Steps:
- [x] Discuss with Tom: name decision. **Resolved: stays "Yotei 360"** — no rename needed. Folder + display strings unchanged.
- [x] Match style with Twin Peaks/Grand Hirafu/Hanazono project pages but lighter on content (concept stage). New vista masthead photo + concept image inline (no lightbox — single concept image).
- [x] Add one or two photos (Pattern P-IMG).
- [x] Staged build narrative: gravel restore → loop close → township spurs.
- [x] Mirror EN → JA (Pattern P-EN-JA).
- [x] Visual check.
- [x] Pattern P-COMMIT (commit 3d9cee2).

Notes:
Decide: (resolved) name stays "Yotei 360".

---

### Task A.16: `/impact/`

**Files:**
- Modify: `impact/index.html`, `ja/impact/index.html`

Steps:
- [x] Final text check: light humanizer trims on the 4 glossary descriptions (Local Partnerships, Community Fund, Trail Construction, Admin & Other). Removed "an estimated" from visitor line.
- [x] GA4 organic keyword growth data — **removed** from scope per Tom. Not added to the page.
- [x] Mirror any EN edits to JA (Pattern P-EN-JA). JA timeline fully rewritten 2021-2026 for parity with EN (BudouX tokenized).
- [x] Visual check.
- [x] New masthead `bg-header-impact.jpg` (group on flowy berms, 2000×1333, 692KB).
- [x] Pattern P-COMMIT.

Notes:
Decide: (resolved) GA keyword data step removed from scope.

---

### Task A.17: `/dirty-dames/`

**Files:**
- Modify: `dirty-dames/index.html`, `ja/dirty-dames/index.html`

Steps:
- [x] Add images: new masthead `bg-header-dirty-dames.jpg` (Block Party group at gondola) + 2 body images (group-forest.jpg, skills-session.jpg).
- [x] Add Dirty Dames brand logo at top of intro section (replaces redundant H3).
- [x] Restructure both bullet sections to h4 + body pattern (matching /projects/), narrower wrap width.
- [x] Humanizer pass on EN intro/programme/why-it-matters paragraphs.
- [x] Drop second CTA "Join NAMBA" — keep "View events" only.
- [x] Participant numbers/dates verified (200+ since 2024 launch, June–October season).
- [x] Mirror EN → JA (Pattern P-EN-JA).
- [x] Visual check.
- [x] Pattern P-COMMIT.

Notes:
Decide: (none open)

---

### Task A.18: `/press/`

**Files:**
- Modify: `press/index.html`, `ja/press/index.html`

Steps:
- [x] Formatting fix: converted default disc-bullet Key Facts list to the partner-page `.benefit-list` pattern (gold `fa-circle-check`, 720px max-width, flex layout).
- [x] Positioning correction: reframed intro + Key Facts + Story Angles to clarify Twin Peaks is the free-to-ride park, Grand Hirafu/Hanazono are lift-accessed. Multi-park masterplan framing.
- [x] Key Facts data sync from /impact/ + /partner/: ¥86M raised in 2025 added; "11,500+ visitors at Twin Peaks" clarified; "24-person board" verified; Pinkbike line dropped.
- [x] Downloads rebuilt: 3 logo cards (NAMBA SVG+PNG+AI, Twin Peaks SVG+PNG+AI, Dirty Dames SVG+PNG+AI) using a new `.logo-download` card pattern. AI files via Drive direct-download links.
- [x] Photo library nudge: replaced sample image tiles with a gold-bordered `.partner-photo-nudge` block — 3 sample thumbnails (landscape, Japan context, in-park) + text + "Become a partner" CTA.
- [x] Mastheads: new `bg-header-press.jpg` (Toshi Pander 0271, centered rocky descent), new body `hero-action.jpg` (9643).
- [x] Humanizer pass on intro, Key Facts, Story Angles, partner nudge.
- [x] SEO title: "Press & Media" → "NAMBA Press & Media Kit"; description tightened.
- [x] Mirror EN → JA (Pattern P-EN-JA). ¥86M → 8,600万円 conversion. New titles + descriptions mirrored.
- [x] Visual check.
- [x] Pattern P-COMMIT.

Notes:
Decide: (none open)

**Deferred follow-up:**
Add a "Press mentions" / past coverage section (publications, dates, links) when there's a list ready to publish. Tom wants this but later — out of launch scope.

---

### Task A.19: `/events/` (index page)

**Files:**
- Modify: `events/index.html`, `ja/events/index.html`

Steps:
- [x] Light polish only. Per spec, splitting upcoming vs past events is out of scope and deferred to a separate future task.
- [x] Verify the listing renders correctly with current and past events both present.
- [x] Tone/text pass if needed. EN intro trimmed: "all season long" → "through the riding season".
- [x] Mirror EN → JA (Pattern P-EN-JA). JA intro already matched semantically (シーズンを通じて). `<wbr>` tags converted to U+200B zero-width spaces.
- [x] Update masthead image (per Per-Page Defaults). New `bg-header-events.jpg` (2000×1333), Larnach credit stripped.
- [x] Pattern P-COMMIT.

Notes:
Decide: (none open. Upcoming/past split is OOS: see spec §10.)

---

### Task A.20: Single event page layout fix

**Files:**
- Modify: `_layouts/event.html`
- Inspect: every event post in `_posts/` and `ja/_posts/` for description duplication patterns

Steps:
- [x] Pattern P-STYLE audit on `_layouts/event.html` against the new reference style. Layout structure is sound; no changes needed.
- [x] Inspect 3-4 recent event posts. Identified the duplication: 6 EN posts (2023-10 closing, 2024-05 Rusutsu dig, 2024-06 season opener, 2024-07 Hirafu reopens, 2025-08 NMW, 2025-09 gravel autumn) had body openers that verbatim duplicate the front matter description. The layout already renders description as `<p class="lead">` at the top.
- [x] Decide with Tom: option (b) — editorial sweep.
- [x] Implement (b): stripped the duplicate first paragraph from each of the 6 EN posts via a Python regex script.
- [x] Mirror in JA event posts. **Not needed** — JA posts have no such duplication; they were translated cleanly without copy-paste.
- [x] Verify on a representative event post. Each post's body now flows naturally from the lead into the next element (h3 header, image, Trailforks widget, or next paragraph).
- [x] Pattern P-COMMIT.

Notes:
Decide: (resolved) option (b). 6 EN files touched, 0 JA files. Past events; low-risk editorial change.

---

### Task A.21: `/partner/` (Chris Selig + final text check)

**Files:**
- Modify: `partner/index.html`, `ja/partner/index.html`

Steps:
- [x] Run `grep -n "Selig" partner/index.html ja/partner/index.html` to locate the Santa Cruz reference.
- [x] Update Chris Selig's affiliation: Santa Cruz → Norco. Mirror in JA.
- [x] Final text pass on the rest of the page. No AI tells / em dashes found. Removed broken "Download pitch deck" CTA (placeholder `href="#"`) from both EN + JA — defer until a real pitch deck PDF is ready.
- [x] Masthead: new partner-specific image `/assets/images/bg/bg-header-partner.jpg` — builder operating a Yanmar excavator with Mount Yotei in the background. Conveys "this is what your money builds" without locking the page to any current sponsor brand. Sourced via Pattern P-IMG (2000px wide JPEG q82, 1.1MB). EN + JA front matter updated. Also reduced gold table.levels th from font-weight 700 → 500 to match .module-title section headings.
- [x] Visual check. (Tom confirmed.)
- [x] Pattern P-COMMIT (commit 3fb9924 + tick commit c00b71b).

Notes:
Decide: (none open)

---

### Task A.22: `/join/`

**Files:**
- Modify: `join/index.html`, `ja/join/index.html`
- External: Ecwid admin (no code change)

Steps:
- [x] Confirm current URL/path for the Join page. Confirmed `/join/` (overhaul move complete).
- [x] Replace images (Pattern P-IMG). New masthead `/assets/images/bg/bg-header-join.jpg` (big NAMBA group portrait, 2:1 aspect, 802K). New in-page `/assets/images/join/dig-day.webp` (multi-generational dig day on forest trail, 1800px q82, 317K) replaces the "Photo: Community ride or dig day group shot" placeholder. Both EN + JA updated, alt text bilingual.
- [x] Check text. Found stale stat: "92% of all funds go directly to trail building and maintenance" — actual allocation from `_data/impact.yml` is 82 (trail_construction) + 13 (trail_maintenance_operation) = **95%**. Fixed in both EN + JA.
- [x] Check graph data: doughnut chart pulls live from `site.data.impact.funding.allocation` — no stale data, will track the YAML automatically.
- [x] Mirror EN → JA (Pattern P-EN-JA). Ran BudouX on 13 visible JA text blocks (headers, paragraphs, hero text, CTA caption) — previously zero tokenisation.
- [x] External action: Ecwid membership → subscription conversion. **Done by Tom in Ecwid admin.**
- [x] Visual check. (Tom confirmed.)
- [x] Pattern P-COMMIT.

Notes:
External action resolved: Ecwid membership → subscription conversion complete.
Decide: (none open)

---

### Task A.23: `/donate/`

**Files:**
- Modify: `donate/index.html`, `ja/donate/index.html` (canonical path confirmed: `/donate/`; `/get-involved/donate/` is a 6-line redirect stub)

Steps:
- [x] Confirmed path: canonical `/donate/`, `/ja/donate/`. Sister stub at `/get-involved/donate/` redirects.
- [x] Reduced donation tiers from 8 → 6 cards. Dropped ¥1,000 "Keep It Sharp" (duplicative with the ¥500 chainsaw-fuel tier) and ¥25,000 "Bridge the Gap" (filler between ¥10k crew day and ¥50k excavator day). Final tiers: ¥500, ¥2,500, ¥5,000, ¥10,000, ¥50,000, Custom. Grid changed from `col-lg-3` (4-col, 2 awkward rows) to `col-lg-4` (clean 3-col × 2 rows).
- [x] Icons: kept Font Awesome glyphs. Photo upgrade flagged as a future enhancement (see notes).
- [x] Copy polish: trimmed slogan flourishes on four "More ways" cards (Voice "Your voice moves policy", Skills "accelerate everything NAMBA does", Art "Your creativity supports the mission", Reach "Word of mouth is free and powerful", Land Access "Every connection expands the network").
- [x] Mirror EN → JA. Translated all donation tier names + descriptions + "Donate" CTAs (previously all English in the JA twin). Translated hero heading "Fund the Dig" → 「トレイル作りを支える」 and hero body. Ran BudouX on all visible JA strings, including the previously-untokenised "More ways" descriptions, intro paragraph, and bottom CTA. Manually corrected one 方 | 法 split in the intro.
- [x] Fixed "Traiforks" → "Trailforks" typo in the JA Reach card.
- [x] Masthead replaced. Tom supplied a top-down trail-crew shot (red gloves, stone slab, mid-action). Resized from 3000×2000 to 2000×1333 q82, saved to `/assets/images/bg/bg-header-donate.jpg`. A.28 row ticked.
- [x] External action: Ecwid donation product images. **Uploaded by Tom in Ecwid admin.**
- [x] Visual check on served site. (Tom confirmed.)
- [x] Pattern P-COMMIT (commit 1273e81).

Follow-ups (out of this task's scope):
- Promote donation-tier icons to dig-day / tool / material photos once Tom has shots. Stronger CRO than abstract icons since each tier funds a tangible thing.
- The "Go Big" custom-amount input is inline-styled and a touch clunky UX; works but could be polished later.

Notes:
Decide: (none open)

---

### Task A.24: `/jobs/`

**Files:**
- Modify: `jobs/index.html`, `ja/jobs/index.html`

Steps:
- [x] Bug fix: "Volunteer" CTA button linked to `/donate/` in both EN and JA (looks like a copy-paste leak from supporter pages). Repointed to `/contact/?topic=volunteering` and `/ja/contact/?topic=volunteering`, matching the volunteering-skills pattern from /donate/'s Skills card.
- [x] Copy polish: trimmed the "directly shapes the future of mountain biking in Niseko" slogan flourish from the intro. Rewrote "Other ways" body to drop filler ("There are plenty of ways to contribute"). EN copy now leads with concrete role types ("paid seasonal trail crew", "volunteers across our subcommittees").
- [x] Mirror EN → JA. Re-translated the intro and "Other ways" body to match the new EN copy. Converted all 8 `<wbr>` tags throughout the JA file to U+200B zero-width spaces (BudouX convention). Manually corrected one 方 | 法 split in 「その他の参加方法」.
- [x] Listings render via Liquid from `_posts/` with `categories: jobs` + `isOpen: true` — no changes needed.
- [x] Masthead replaced with `bg-header-jobs.jpg` (3-person working crew shot, mid dig day, 2000×1333 q82, 702KB). EN + JA front matter updated. Old `join-our-team.jpg` (credit Jinya Nishiwaki) decommissioned. Photographer credit for new masthead not needed per Tom.
- [x] Visual check on served site. (Tom confirmed.)
- [x] Pattern P-COMMIT (commit 5ca6550).

Out of scope for this task:
- The CSS for `.job-card` is inline-duplicated across both EN and JA files. Phase C territory (CSS audit + promotion), not A.24.
- The Subcommittee Volunteer EN post description is overlong (50+ words, includes "arms, legs, brain, heart" en-dashed line). Flagged for A.25 (single job post layout fix).

Notes:
Decide: (none open)

---

### Task A.25: Single job page layout fix

**Files:**
- Modify: `_layouts/job.html`
- Inspect: recent job posts in `_posts/` and `ja/_posts/`

Steps:
- [x] Pattern P-STYLE audit on `_layouts/job.html`. Structure was sound; added the events-style disabled-button CSS and unified the Apply CTA logic.
- [x] **Mirror the events button logic**: top Apply button now always renders when `applyUrl` is set (greyed out if `!page.isOpen`). New bottom CTA row matches the events pattern: Apply (primary, disabled when closed) + Back to jobs (secondary if apply exists, primary if not). Old `{% if page.applyUrl and page.isOpen %}` gating removed.
- [x] **Description duplication sweep**: 5 EN posts had their frontmatter description repeated verbatim inside their body under "About the [Role] Role:". Stripped via Python regex (4 posts) + a manual edit for Project & Trail Application Assistant (description was the lead sentence of a multi-sentence paragraph, not its own paragraph block). JA posts all clean — translated without copy-paste, same finding as A.20 for events.
- [x] **Inline-CSS cleanup**: removed redundant `style="margin-top:0;"` from the opening h2/h3 of all 14 posts (7 EN + 7 JA). Layout's `.job-content h3:first-child { margin-top: 0; }` rule handles spacing.
- [x] **Subcommittee Volunteer post** tightened: EN description trimmed from 71 words ("arms, legs, brain, heart …") to 25 words leading with the concrete subcommittee list. JA description rewritten and three typos fixed (ボランテイア → ボランティア, 構成されいて → 構成されていて, 運営されてます → 運営されています). Inline Apply CTA inside the post body removed in both EN + JA (now redundant with the layout's two Apply buttons). Opening h2 converted to h3 to match the other 6 posts.
- [x] Visual check on a representative job post. (Tom confirmed.)
- [x] Pattern P-COMMIT (commit fef3cba).

Notes:
Decide: (none open)

---

### Task A.26: `/shop/`

**Files:**
- Modify: `shop/index.html`, `ja/shop/index.html`
- Modify: `artist-series/index.html`, `ja/artist-series/index.html`
- External: Ecwid admin (no code change)

Steps:
- [x] Pattern P-STYLE audit on `/shop/`. Intro copy is already voicey ("every yen of profit goes straight back into the dirt", "soil our cotton grows in as much as the soil under our tyres"), 3-badge layout is tight, Ecwid theming CSS covers cards/sort/categories nav. No changes needed.
- [x] JA `/shop/` already mirrored and BudouX-tokenised (ご購入の​一つ​ひとつが、​トレイルに​なる).
- [x] `/artist-series/` closing CTA humanised. Old version stacked AI flourishes ("creative minds inspired by the outdoors, community, and mountain biking culture", "your chance to showcase your work, support local trails, and be part of something meaningful", "growing community of trail-building creatives"). New version: "Painters, illustrators, designers, photographers: if your work is inspired by the outdoors and mountain biking, get in touch. Your art reaches riders, and a portion of every sale goes back into the trails." Heading also de-titlecased: "Want to Be Part of the Artist Series?" → "Want to be part of the Artist Series?"
- [x] JA `/artist-series/` closing CTA mirrored with the same humanisation. BudouX-tokenised.
- [x] Visual check on both shop + artist-series pages. (Tom confirmed.)
- [x] Pattern P-COMMIT (commit 6e22104 artist-series + c067f55 shop).

Out of scope:
- Artist bios — these read like the artists' own self-written copy. Kept as-is to preserve their voice.

Notes:
External action: Ecwid donation + membership product images (Tom uploads in Ecwid admin). Already tracked in A.22 (membership conversion) and A.23 (donation imagery) external action notes.
Decide: (none open)

---

### Task A.28: Cross-page masthead background image sweep

**Files:**
- Modify front matter on per-page basis: `where-to-ride/index.html`, `twin-peaks/index.html`, `where-to-ride/grand-hirafu/index.html`, `where-to-ride/hanazono/index.html`, `where-to-ride/gravel/index.html`, `where-to-ride/skills-parks/index.html`, `where-to-ride/annupuri/index.html`, `plan-your-trip/index.html`, `about/index.html`, `team/index.html`, `projects/index.html`, `projects/*/index.html`, `impact/index.html`, `dirty-dames/index.html`, `press/index.html`, `events/index.html`, `partner/index.html`, etc. plus all JA twins.
- Source assets via Pattern P-IMG into `assets/images/_triage/mastheads/` then process and place per page.

**Approach decided:** Audit + replace as each page comes up in Phase A. Where-to-ride sub-pages got their mastheads set during the per-page rewrites (often using `/assets/images/trails/<park>/01.jpg` or an event header). Standalone pages get a bespoke `bg-header-<page>.jpg` at 2000px wide.

**Per-page audit + replace checklist:**

- [x] `/where-to-ride/` (hub) — `bg-header-where-to-ride.jpg` (Toshi Pander shot, swapped in commit c9ce467)
- [x] `/where-to-ride/gravel/` — Niseko Gravel autumn ride event header
- [x] `/where-to-ride/skills-parks/` — Akaigawa pump track event header
- [x] `/where-to-ride/annupuri/` — `/assets/images/trails/annupuri/01.jpg`
- [x] `/where-to-ride/signage/` — `/assets/images/twinpeaks/trailsign.jpg` (kept; already trail-sign focused)
- [x] `/where-to-ride/grand-hirafu/` — `/assets/images/trails/grand-hirafu/01.jpg`
- [x] `/where-to-ride/hanazono/` — `/assets/images/trails/hanazono/01.jpg`
- [x] `/plan-your-trip/` — `bg-header-plan-your-trip.jpg` (commit 6b1bc72)
- [ ] `/` (Home) — defer to Home redesign spec (A.27)
- [x] `/about/` — `bg-header-about.jpg` (aerial trail-network shot, commit 6629dfe)
- [x] `/team/` — `bg-header-team.jpg` (candid trail-crew shot, commit 775b584)
- [x] `/impact/` — `bg-header-impact.jpg` (group on flowy berms, 2000×1333)
- [x] `/twin-peaks/` — keeps the Liam Larnach shot at `/assets/images/twinpeaks/header.jpg` (set via Jekyll defaults in `_config.yml`). Tom confirmed.
- [x] `/projects/` (hub) — `bg-header-projects.jpg` (two crew with map + Mt Yotei background, commit d30c38f)
- [x] `/projects/twin-peaks/` — kept TP masthead `twinpeaks/header.jpg`
- [x] `/projects/grand-hirafu/` — `/assets/images/trails/grand-hirafu/01.jpg`
- [x] `/projects/hanazono/` — `/assets/images/trails/hanazono/01.jpg`
- [x] `/projects/yotei-360/` — `bg-header-yotei-360.jpg` (new vista, commit 3d9cee2)
- [x] `/events/` — `bg-header-events.jpg` (commit cc0ed30)
- [x] `/dirty-dames/` — `bg-header-dirty-dames.jpg` (Block Party group at gondola, commit 656c83b)
- [x] `/partner/`
- [x] `/join/`
- [x] `/donate/` — `bg-header-donate.jpg` (top-down trail crew hands-on stone work, 2000×1333 q82)
- [x] `/jobs/` — `bg-header-jobs.jpg` (3-person working crew, 2000×1333 q82)
- [x] `/contact/` — reverted to site default masthead (`bg-header.jpg` via Jekyll defaults). The bespoke `bg-header-contact.jpg` was dropped to match privacy/terms/utility-page convention (commit 466b2ce).
- [x] `/press/` — `bg-header-press.jpg` (Toshi Pander 0271, commit 38a28a6)
- [x] `/stories/` — **deferred** (page not going live at launch; revisit when first story publishes, see R.1).
- [x] `/artist-series/` — keeps `/assets/images/artists/header.jpg`. Tom confirmed.

Per-page steps when one comes up:
- [ ] Confirm current `masthead.img` value (or fallback to `/assets/images/bg/bg-header.jpg`).
- [ ] Tom drops candidate landscape photo into `assets/images/_triage/`.
- [ ] Process to 2000px wide JPG at quality 82, place at `/assets/images/bg/bg-header-<page-slug>.jpg`.
- [ ] Update `masthead.img` in both EN and JA front matter (and `masthead.credit` if attribution required).
- [ ] Tick the entry above + Pattern P-COMMIT.

Notes:
This task was created to capture the deferred bg-image decisions from A.2 onward. Walked alongside Phase A per-page work rather than as one cross-cutting sweep, so individual sub-pages tick off as their rewrites land.

---

### Task A.27: `/` (Home)

**Files:**
- Modify: `index.html`, `ja/index.html`
- Plus: hero asset references

Steps:
- [x] Stop. Trigger a fresh brainstorm/spec for the Home page (hero image + hero video + section restructure). The Home page is large enough to warrant its own design conversation.
- [x] Do NOT begin Home work as part of this plan. Write a new spec at `_docs/superpowers/specs/<date>-home-redesign-design.md` first.
- [x] Tick this task once the Home spec is written and Home implementation begins under that spec's own plan.

Notes:
Spec written 2026-05-25 (`_docs/superpowers/specs/2026-05-25-home-redesign-design.md`). Implementation plan at `_docs/superpowers/plans/2026-05-25-home-redesign.md`. Home complete via that plan (commits e4ad661 through 1b6c88b on `overhaul/website-restructure`).

### Home page follow-ups (from 2026-05-25 home redesign)

- [ ] **Multi-layer parallax hero.** Slice `assets/images/bg/bg-header-yotei.jpg` into 4 transparent PNG layers (sky, Yotei, mid-trees, foreground). Update `assets/js/home.js` to translate each at independent rates. Replace `home-hero-bg` markup with stacked layer divs.
- [ ] **Replace placeholder feature image.** Pick a community/trail-day shot. Save to `assets/images/home/feature-image.jpg`. Remove the `.home-feature-placeholder-overlay` rule + markup from `_includes/home/section-feature.html` and `assets/css/home.css`.
- [ ] **Enable stories section.** Once at least one post with `categories: stories` exists, remove the `{% comment %} ... {% endcomment %}` wrapper around `{% include home/section-stories.html %}` in both `index.html` and `ja/index.html`.
- [ ] **Custom Vimeo poster frame.** Use ffmpeg to extract a frame from `assets/images/_triage/namba_2026_web_reel.mp4` and configure as the Vimeo player's custom thumbnail (Vimeo dashboard) OR overlay a CSS click-to-play poster on top of the iframe.
- [ ] **Promote impact numbers to `_data/impact.yml`** if maintenance becomes painful.
- [ ] **Promote network captions to `_data/network-timeline.yml`** if maintenance becomes painful.
- [ ] **Optimise feature-image.jpg + strip EXIF** when the real image lands (currently a 622 KB cp of bg-distance.jpg with iPhone 11 Pro EXIF metadata).
- [ ] **Re-check Lighthouse Performance ≥ 85** on mobile once the final feature image is in place (spec §16 success criterion).
- [ ] **Press / media mentions strip.** Add an "As featured in" band with logos from MTB publications (Pinkbike, Vital MTB, Outside, JP outdoor mags). Source logos at consistent height (~32-48px), greyscale-on-rest, colour-on-hover (matches existing partner-wall pattern). Slot between Impact and Network, or just above the partner wall in `base.html`. Bilingual heading: "As featured in" / "メディア掲載".
- [ ] **Stories teaser activation.** Once the first post with `categories: stories` exists, remove the `{% comment %} ... {% endcomment %}` wrapper around `{% include home/section-stories.html %}` in both `index.html` and `ja/index.html`. (Already wired; this is a content-gated activation, not a build task.)

---

## Phase B: Humanize + SEO + JA Re-Parity Sweep

### Task B.0.1: Install humanizer skill

**Prereq for all Phase B per-page work.**

Steps:
- [x] Confirm with Tom: ready to start Phase B? **Yes — 2026-05-25.**
- [x] Humanizer skill installed and registered. Visible in available skills list as `humanizer: Remove signs of AI-generated writing from text`. Backed by Wikipedia's "Signs of AI writing" guide.
- [x] Verification: skill metadata loads and is callable via the Skill tool. No dry-run committed; first real use will be on B.1.
- [x] No project files changed by the install (skill lives in the plugin cache). No commit needed for this step alone — bundled with the B.0.2 punchlist update.

Notes:
Decide: (resolved) humanizer ready, Phase A confirmed done (A.27 Home is explicitly out-of-scope for this plan and tracked in its own future spec).

---

### Task B.0.2: Gather SEO inputs

Steps:
- [x] `_docs/seo-baseline-2026-04/` GSC export confirmed current (May 2026, well inside the 3-month freshness window). Contains: Chart, Countries, Devices, Filters, Pages, Queries, Search appearance CSVs.
- [x] Comprehensive `claude-seo:seo-audit` / `claude-seo:seo-geo` pre-runs **skipped** — per-page cadence means `claude-seo:seo-page`, `claude-seo:seo-schema`, `claude-seo:seo-content`, `marketing-skills:ai-seo`, and `claude-seo:seo-hreflang` will run inside each B.x sweep. No need for a site-wide baseline scan first.
- [x] GA4 organic keyword export: **skipped** (Tom decision 2026-05-25). Work from GSC baseline + `_docs/marketing-strategy.md` §2 keyword list.
- [x] DataForSEO MCP: **skipped** (Tom decision 2026-05-25, paid account cost not justified for launch). All per-page SEO passes will work from the GSC baseline + `_docs/marketing-strategy.md` §2 keyword list + the `claude-seo:*` skills.
- [x] `_docs/marketing-strategy.md` §2 keyword list confirmed current (line 142 onwards; cross-referenced with line 225-227 priority campaigns: "Visit Niseko MTB", "Sponsor NAMBA", "Twin Peaks Bike Park").
- [x] Pattern P-COMMIT — bundled with B.0.1 punchlist tick in a single commit (no new input artifacts saved into the repo).

Notes:
Decide: (resolved 2026-05-25) GA4 skipped, DataForSEO skipped (paid account not affordable), comprehensive pre-audit skipped in favour of per-page coverage. Per-page cadence: one page at a time with Tom sign-off (matches Phase A rhythm).

---

### Per-page Phase B template

For each page from the Phase A order (B.1 corresponds to A.1, etc., minus A.27 which has its own spec):

**Per-page cycle:**

- [ ] **Humanize EN copy**: run the humanizer skill against the page's visible EN copy. Review output; refine prompts as needed. Replace EN copy in the file.
- [ ] **SEO pass**:
  - Title tag: under 60 chars, target keyword front-loaded
  - Meta description: under 160 chars, unique, target keyword natural
  - H1: one per page, matches user intent
  - Heading hierarchy: semantic, no skipped levels
  - Internal links: at least 2 relevant in-site links
  - Schema: appropriate JSON-LD (run `claude-seo:seo-schema`)
  - Alt text: every image, descriptive, target keyword where natural
- [ ] **JA re-parity**: diff EN changes against current JA. Translate deltas (machine OK, preserve meaning + tone). Tokenise JA front matter + visible JA with BudouX where applicable.
- [ ] Pattern P-COMMIT.

Apply this template to:
- [x] B.1 `/where-to-ride/` (hub) — humanize: Hanazono + Skills Parks ride card descriptions tightened. SEO: title "Where to Mountain Bike in Niseko: Bike Parks & Trails" (52ch), description adds "Hokkaido" + "free-to-ride bike park" (152ch), trail-signage img alt rewritten to be descriptive. Schema: new JSON-LD with @graph[WebPage, BreadcrumbList, ItemList[4 TouristAttraction parks with geo]] added inline on both EN + JA, with `inLanguage` and locale-appropriate URLs. JA mirror complete with BudouX tokenisation on the two updated body sentences. Hreflang verified clean. **Follow-up:** ride cards on this page now get the same stretched-link + arrow-nudge-on-card-hover pattern that `.features-item` cards got in A.9 — `.ride-card:has(a) { position: relative }` + `.action { position: static }` + `.action::after { inset: 0; z-index: 2 }`. CSS added to the inline `<style>` block in both EN + JA. **Phase C candidate:** `.ride-card` styles are duplicated across EN + JA inline; consolidate into shared partial/stylesheet during CSS audit.
- [x] B.2 `/twin-peaks/` — humanize: 4 approved body refinements (heart-of-Niseko cliché in ¶1, "across the Alps and beyond" filler in ¶3 Allegra line, "grown to its current shape" in ¶3, climbs descriptor mix in ¶4) plus a 5th consistency fix in the mobile-only intro section (same heart-of-Niseko + 3-modifier pattern). SEO: title "Twin Peaks Bike Park: Free MTB in Niseko, Japan" (47ch), description tightened "every day"→"daily" (158ch). a11y fix: added `alt="Twin Peaks Bike Park"` (EN) / `alt="ツインピークスバイクパーク"` (JA) to the intro section logo `<img>` (was missing alt entirely). Schema: full JSON-LD with @graph[WebPage, BreadcrumbList, TouristAttraction] including geo, address, isAccessibleForFree, publicAccess, openingHoursSpecification (validFrom 2026-05-15, validThrough 2026-10-31), and 4 amenityFeature entries. EN + JA. JA twin mirrored with BudouX tokenisation on all 5 new body sentences and the JA title gains `titleHtml` tokens. Hreflang clean.
- [x] B.3 `/where-to-ride/grand-hirafu/` — humanize: drop "the heart of Hirafu Village" cliche (P3). SEO: title "Grand Hirafu Bike Park: Lift-Served MTB in Niseko" (50ch), description gains brand prefix (151ch). Schema: WebPage + BreadcrumbList + TouristAttraction with geo, Hirafu/Hokkaido/JP address, `isAccessibleForFree: false` (lift pass required), `publicAccess: true`, June–October opening hours, and 4 amenityFeature entries (Lift access via Ace Gondola, Top-to-bottom descents, IMBA grades, Unified signage). EN + JA. JA P3 retokenised with BudouX. Side note: title/heading alignment audit also caught all 7 Twin Peaks sub-pages (separate commit c77cd9a).
- [x] B.4 `/where-to-ride/hanazono/` — humanize: no body changes (page is short + already clean). SEO: title "Niseko Hanazono Bike Park: Opening Summer 2026" (47ch — date hook is unique to this page until park opens), description with brand prefix (148ch). Schema: WebPage + BreadcrumbList + TouristAttraction with geo, Hanazono/Hokkaido/JP address, `isAccessibleForFree: false` (lift pass expected, cost data is TBC), `publicAccess: true`. `openingHoursSpecification` **omitted** until exact dates land (data file says season "Summer 2026 onwards", hours TBC). 4 amenityFeature entries. EN + JA. Side bonus from B.2 session: `_data/trails.yml twinpeaks.season` fixed from "June - End October" to "Mid-May - End October" matching actual May opening (commit 5fbe3f2).
- [x] B.5 `/where-to-ride/gravel/` — humanize: no body changes (page rewritten in A.5, already voicey and concrete). SEO: title "Gravel Riding in Niseko, Hokkaido: 1,200km of Routes" (52ch — comma binds Niseko↔Hokkaido as one location phrase so the 1,200km clearly refers to the Niseko routes, per Tom's correction during proposal). Description adds "Japan" for international reach (148ch). Schema: WebPage + BreadcrumbList only — **no TouristAttraction** because gravel riding is regional, not a single site. EN + JA. JA description unchanged (already includes 北海道).
- [x] B.6 `/where-to-ride/skills-parks/` — humanize: no body changes (page already concrete from A.6). SEO: title gains location "Skills Parks & Pump Tracks in Niseko, Hokkaido" (47ch — was missing location entirely), description adds Hokkaido + trims at-the-bike-park-bases (135ch). Schema: WebPage + BreadcrumbList + **ItemList of 5 TouristAttractions** (Twin Peaks Skills Centre, Grand Hirafu Skill-up Area, Tomo Playpark, Rhythm Japan, Rusutsu) with geos pulled from the /where-to-ride/ map POI block, plus per-facility `isAccessibleForFree` flag where known. Hanazono Skills Park excluded as aspirational (still in 2026 build phase). EN + JA.
- [x] B.7 `/where-to-ride/annupuri/` — humanize: no body changes (page already concrete from A.7). SEO: title gains "Gondola Downhill" differentiator (44ch), description adds Hokkaido + tightens "designed under the supervision of" → "designed by" (151ch). Schema: WebPage + BreadcrumbList + TouristAttraction with geo, Annupuri/Hokkaido/JP address, lift-pass-required flag, **real 09:00–16:00 daily opening hours** (Annupuri actually has them, unlike TP/GH 24/7 trail networks), mid-July to mid-October season, and 4 amenityFeature entries (Annupuri gondola access, Single downhill course, Downhill Series Niseko host venue, Pro-supervised course design). EN + JA.
- [x] B7.5 `/where-to-ride/signage/` — humanize: no body changes (page already concrete from A.7a). SEO: title gains "Niseko MTB" prefix (30ch, was generic "Trail Signage Guide"), description tightens to specific items list (146ch). Intro park name mentions (Twin Peaks, Grand Hirafu, Niseko Hanazono) converted to internal links — cheap SEO win turning the intro into a 3-park hub crossover. Schema: WebPage + BreadcrumbList only (this is an explainer/reference page, not strictly HowTo-ordered and no author/date for Article). EN + JA.
- [x] B.8 `/plan-your-trip/` — humanize: 2 small tweaks ("Most sits around Hirafu" → "Most is in Hirafu", "destination... in its own right" → "also a food and wellness destination"). SEO: title gains location + activity "Plan Your Niseko Mountain Biking Trip" (37ch, was generic "Plan Your Trip" 14ch), description tightens "Everything you need to plan" → "Plan", adds Hokkaido (138ch). Internal links: 5 new inline links in the "Riding for every level" section (Skills Parks, Hanazono×2, Twin Peaks×2). Schema: WebPage + BreadcrumbList only — informational planning content. EN + JA.
- [x] B.9 `/about/` — humanize: 3 tweaks (typo Kainkan→Kaikan in 2024 timeline, "world-class winter destination"→"famous winter destination" dropping promotional cliché, Allegra description aligned with B.2 from "across the Alps" to "best-known parks in Europe and Asia"). SEO: title expands acronym to "About NAMBA: Niseko Area Mountain Bike Association" (51ch), description trimmed from 188ch (over cap) to 123ch (dropped aspirational "transforming the region into Asia's premier MTB destination" clause). Schema: **High-value Organization markup** — AboutPage + BreadcrumbList + NGO (subtype of Organization) with name, alternateName, url, logo, foundingDate (2022 NPO registration), areaServed, location, sameAs (Instagram). Sets the canonical brand entity that other pages can `@id` reference. EN + JA. JA mirror uses BudouX retokenisation on Allegra and 世界クラス→有名な substitution.
- [x] B.10 `/team/` — humanize: body already cleaned in A.10; minor description fix removing "passionate" (AI-flagged) and "Asia's premier mountain bike destination" (promotional). SEO: title gains description "Our Team: Meet NAMBA's Founders & Board" (was just "Our Team", 8ch), description rewritten to 156ch leading with the 24-person figure. Internal link: intro "NAMBA" → /about/ for cross-page Organization signal. Schema: WebPage + BreadcrumbList with `about: { @id: "https://namba.ngo/#organization" }` referencing the canonical NGO entity defined on /about/. Person schema for the 3 leaders deferred — can add later if needed. EN + JA.
- [x] B.11 `/projects/` (hub) — humanize: none (body already concrete from A.11). Factual fix: Hanazono card "4,500m lift-access flow trail" → "4,200m" to match canonical `_data/trails.yml` and /where-to-ride/hanazono/ (EN + JA). SEO: title and description already strong, no changes. Schema: WebPage + BreadcrumbList + ItemList of 4 projects (TP, GH, HZ, Yotei 360) as ListItems linking to project pages. Detailed TouristAttraction schemas already live on each individual project page. WebPage `about` cross-references the canonical Organization @id. EN + JA.
- [x] B.12 `/projects/twin-peaks/` — humanize: 1 consistency fix on Allegra description ("responsible for major trail networks across the Alps" → "behind some of the best-known parks in Europe and Asia", matching B.2 /twin-peaks/ and B.9 /about/). SEO: title and meta already strong from A.12. Schema: WebPage + BreadcrumbList with `mainEntity` pointing to the canonical TouristAttraction @id at /twin-peaks/ (B.2) and `about` pointing to the canonical Organization @id at /about/ (B.9). Cross-page entity graph now links the project page to its real-world place. EN + JA. JA Allegra retokenised with BudouX.
- [x] B.13 `/projects/grand-hirafu/` — humanize: none (page already grounded, no AI tells in the timeline or Tokyu sections). SEO: title aligned to Twin Peaks pattern "Grand Hirafu Bike Park | NAMBA's Resort Expansion" (50ch, was generic "NAMBA Project"), description tightened by dropping "new" before Ace Gondola (128ch). Schema: WebPage + BreadcrumbList with `mainEntity` → canonical TouristAttraction @id at /where-to-ride/grand-hirafu/#bikepark (B.3) and `about` → canonical Organization @id (B.9). Same cross-page entity graph pattern as B.12. EN + JA. JA title updated to mirror "NAMBAのリゾート拡張プロジェクト". 2025 timeline card left as-is (planning year, no km — stylistic asymmetry accepted).
- [x] B.14 `/projects/hanazono/` — humanize: no body changes (page already concrete from A.14). Factual fix: same 4,500m → 4,200m correction applied 3× on EN (description, overview paragraph 2, "What's Being Built" first bullet) and 3× on JA, matching canonical `_data/trails.yml`. SEO: title aligned to Twin Peaks pattern "Niseko Hanazono Bike Park | NAMBA's 2026 Build" (47ch, was generic "NAMBA Project"). Schema: WebPage + BreadcrumbList with `mainEntity` → canonical TouristAttraction @id at /where-to-ride/hanazono/#bikepark (B.4) and `about` → Organization @id (B.9). EN + JA.
- [x] B.15 `/projects/yotei-360/` — humanize: 1 small tweak ("But it's not just a loop." → "The loop itself is just the start." to remove the negative-parallelism pivot). SEO: title gains "50km" metric ("Yotei 360 | NAMBA's 50km Mt Yotei Loop", 39ch), description adds NAMBA prefix + Hokkaido (152ch). Schema: WebPage + BreadcrumbList only — no TouristAttraction (regional planned route, not a fixed site yet — same rationale as B.5 gravel). `about` references Organization @id. EN + JA. JA opener retokenised with BudouX.
- [x] B.16 `/impact/` — humanize: replaced "Asia's premier mountain bike network" (timeline subtitle) with "Hokkaido's largest mountain bike network" and "Asia's premier mountain bike destination" (partner CTA) with "Niseko's mountain bike network" — same pattern applied in B.9 and B.10. SEO: title "Our Impact" (10ch) → "Our Impact: NAMBA's Trail Network, Funding & Growth" (52ch), description trimmed from 175ch (over cap) to 152ch. Schema: WebPage + BreadcrumbList with `about` → Organization @id. EN + JA. JA mirror updates アジア有数 → 北海道最大 in timeline subtitle and CTA, both retokenised with BudouX. JA title and description also expanded to match EN.
- [x] B.17 `/dirty-dames/` — humanize: no body changes (page already concrete from A.17). SEO: title "Dirty Dames" (11ch) → "Dirty Dames: NAMBA's Women's MTB Programme in Niseko" (53ch), description tightened from 164ch (over cap) to 153ch by abbreviating "mountain biking" to "MTB". Schema: WebPage + BreadcrumbList with `about` → Organization @id. EN + JA. JA title and description mirror the EN expansion.
- [x] B.18 `/press/` — humanize: no body changes (page already concrete, key facts list is all data, story angles are punchy). SEO: title "NAMBA Press & Media Kit" (23ch) → "NAMBA Press & Media Kit: Niseko MTB Network Story" (49ch). Description already on target (134ch). Schema: WebPage + BreadcrumbList with `about` → Organization @id. EN + JA. JA title mirrored.
- [x] B.19 `/events/` (index) — humanize: no body changes (single intro paragraph is concrete, "From X to Y" range is a real 4-type event list). SEO: title "Events" (6ch) → "Niseko MTB Events: Rides, Trail Days & Races by NAMBA" (54ch), description "66ch" → 137ch leading with NAMBA prefix and enumerating event types. Schema: CollectionPage + BreadcrumbList with `about` → Organization @id. Existing microdata `itemtype="Blog"` left in place. EN + JA.
- [x] B.20 Event layout + sample post sweep — `_layouts/event.html`: the boilerplate "About NAMBA" block (shown when `about: true` in front matter) was outdated and AI-flagged: "world class sustainable mountain bike community", "well underway on first project" (TP already opened), "Once all phases completed, some 30 kms" (now > 17km, hitting 33 in 2026), "Japan's largest community bike park" (vs. canonical "free-to-ride MTB park"), "50+ km backcountry epic trails" stale Yotei phrasing, plus an em dash. Replaced with 3 grounded paragraphs covering: what NAMBA is, Twin Peaks + multi-park network, soft CTA with internal links to /get-involved/join/ and /partner/. JA mirrored fully retokenised with BudouX, fixed typo "インピークス" → "ツインピークス", removed 世界クラスの promotional language. Schema: Event `organizer` now references canonical `@id: "https://namba.ngo/#organization"` (B.9 NGO entity). All published event posts inherit the layout. **Sample post check**: `_posts/2026-05-30-twin-peaks-summer-kick-off.md` already clean from A.20 (concrete copy, factual itinerary, no AI tells); no edits needed.
- [x] B.21 `/partner/` — humanize: 1 tweak ("All signage is strategically placed for high visibility, seen by every visitor to the park." → "Every visitor to the park sees them.") removing the "strategically placed for high visibility" mild AI puff. Selig testimonial quote left untouched (his words). SEO: title "Partner with NAMBA" (18ch) → "Partner with NAMBA: Sponsor Niseko Mountain Bike Trails" (55ch). Description already on target. Schema: WebPage + BreadcrumbList with `about` → Organization @id. EN + JA. JA title rewritten + body line retokenised.
- [x] B.22 `/join/` — humanize: no body changes (page already concrete from A.22 — concrete benefit cards, factual funding chart, transparent membership tiers). SEO: title "Become a member" (15ch) → "Become a Member: Join NAMBA & Build Niseko's Trails" (53ch). Description already on target (152ch). Schema: WebPage + BreadcrumbList with `about` → Organization @id. EN + JA. JA title expanded from 仲間になろう (5JA ch) to メンバーになる: NAMBAに参加してニセコのトレイルを支える. `/get-involved/join/` is already a redirect stub, no additional edit needed.
- [x] B.23 `/donate/` — humanize: no body changes (donation tiers concrete and punchy: "Fund the Saw", "Lay the Foundation", "Move Mountains"; 6 alternative contribution cards all factual). SEO: title "Donate" (6ch) → "Donate to NAMBA: Fund Niseko's Free MTB Trails" (47ch). Description already on target (122ch). Schema: WebPage + BreadcrumbList with `about` → Organization @id. EN + JA. JA title expanded from 寄付のお願い.
- [x] B.24 `/jobs/` — humanize: no body changes (intro and other-ways-to-get-involved both grounded and short). SEO: title "Join our team" (13ch) → "Jobs at NAMBA: Trail Crew & Volunteer Roles in Niseko" (54ch). Description already on target. Schema: CollectionPage + BreadcrumbList with `about` → Organization @id. EN + JA. JA title rewritten from generic 私たちチームと働きませんか？ to keyword-rich NAMBAの求人 form.
- [x] B.25 Job layout + sample post sweep — `_layouts/job.html`: JobPosting schema `hiringOrganization` now references canonical `@id: "https://namba.ngo/#organization"`. Sample post `_posts/2026-02-17-trail-crew.md` (latest job post, closed): fixed em dash in description, replaced "Asia's fastest growing bike park" promotional cliché with "fastest growing bike park network in the country", removed 2 more em dashes from perks bullets ("- the NAMBA team works hard" and "- don't just be a part") and reflowed as full sentences. JA mirror: replaced アジアで最も急成長している with 国内で最も急成長している, fixed em-dash bullet "ライドデー –" to full sentence form.
- [x] B.26 `/shop/` + artist series — `/shop/`: title gains NAMBA brand prefix "NAMBA Shop: Niseko MTB Merch & Memberships" (43ch). No body changes — intro copy already voicey and grounded ("shipping's on us, wherever in the world you ride"). Schema: CollectionPage + BreadcrumbList with `about` → Organization @id. EN + JA. `/artist-series/`: title expanded from "Artist Series" (13ch) to "NAMBA Artist Series: Limited-Edition Gear by Local Artists" (57ch). Artist bios deliberately left untouched — they are the artists' own provided words, not editorial copy. Schema: CollectionPage + BreadcrumbList (3-step: Home → Shop → Artist Series) with `about` → Organization @id. EN + JA. JA titles mirrored.
- [ ] B.27 `/` (Home: only if Home redesign spec has completed; otherwise defer)
- [x] B.28 Title-split refactor (discovered mid-B, not originally planned) — Phase B's SEO-driven title expansion left visible h1s long. Split `title` into `title` + `subtitle` front matter on 29 pages × EN/JA so the h1 renders as two-tier visual hierarchy while the HTML `<title>` and `og:title` still compose the full string for SEO. Infrastructure: `_layouts/base.html` composes `{{ title }}: {{ subtitle }}` for `<title>` + `og:title`; `_includes/masthead.html` wraps h1 in `.title-primary` + `.title-secondary` spans (falls through to single h1 when no subtitle); `assets/css/template.css` styles `.title-secondary` at 26px (16px mobile), light weight, solid colour overriding the gradient. Project pages converted from `|` to `:` (also updated schema JSON-LD `name` fields). `/artist-series/` legacy standalone subtitle dropped (field repurposed). `/where-to-ride/skills-parks/` left unsplit ("in Niseko" subtitle would read awkwardly after the colon); title trimmed instead. Commit 23f24ef (62 files).

---

## Phase C: Site-Wide CSS Audit and Promotion

### Task C.1: Inventory inline CSS

Steps:
- [x] Run `grep -rn 'style="' --include="*.html" .` excluding `_site/` and `node_modules/` to inventory inline `style=` attributes. **835 hits.**
- [x] Run `grep -rn '<style' --include="*.html" .` excluding `_site/` to inventory inline `<style>` blocks. **52 hits.**
- [x] Save the inventory output to `_docs/css-audit-inventory.txt` (1,041 lines, kept as reference per C.4 decision).
- [x] Pattern P-COMMIT — bundled with C.5 first cluster commit.

Notes:
Of 132 distinct inline style values, 98 repeat (≥2 uses) and 34 are one-offs. Top duplicates: `max-width:900px` (195×), `font-size:130%` (145×), rounded image pattern (30×).

---

### Task C.2: Cluster repeated patterns

Steps:
- [x] Review the inventory. Grouped inline rules by pattern.
- [x] For each cluster, note: how many occurrences, which pages, the rule values.
- [x] Save cluster analysis as `_docs/css-audit-clusters.md` for review.
- [x] No commit until C.3 decision.

Notes:
12 clusters identified. Top 9 are actionable promotions; cluster 10 (page-specific `<style>` blocks) and cluster 12 (one-off inline) stay as-is. Estimated ~1,000-line net reduction across the codebase.

---

### Task C.3: Propose promotion list

Steps:
- [x] For each cluster, propose: promote to shared utility class OR promote to component class OR fix existing default OR leave inline.
- [x] Draft new entries for the brand stylesheet.
- [x] Present the promotion list to Tom for approval.

Notes:
Proposal lives in `_docs/css-audit-clusters.md` alongside the cluster analysis. 9 actionable clusters, projected ~250 new utility CSS lines, ~1,317 inline-style removals.
Decide: (resolved) Tom approved 2026-05-30 — see C.4.

---

### Task C.4: Tom approves promotion list

Steps:
- [x] Tom reviews and approves/edits the proposed promotion list.
- [x] Record decisions in `_docs/css-audit-clusters.md`.
- [x] No commit (plan ticks bundled with C.1 commit).

Notes:
Resolved 2026-05-30:
- **Commit strategy:** one commit per cluster (9 commits on `overhaul/website-restructure`).
- **image.html `rounded` flag:** rejected — hand-class each call site instead.
- **`.section-lede` mobile rule:** add `font-size: 115%` mobile rule.
- **Audit docs:** keep both `css-audit-inventory.txt` + `css-audit-clusters.md` in the repo as reference.
- **`.module-title-wrap` default change** — 61 bare uses identified; most are inconsistencies (sister sections on the same page use 900px), a handful (`privacy`, `thanks`, CTA blocks) may genuinely want narrower — handle case-by-case in C.5 cluster 1 with explicit `.is-narrow` where appropriate.

---

### Task C.5: Refactor

Steps:
- [x] Implement new classes in the brand stylesheet.
- [x] For each cluster: replace inline rules with the new class across all affected pages.
- [x] Update both EN and JA mirrors (structural changes apply to both).
- [x] Run `bundle exec jekyll serve` and visually verify a representative page per cluster.
- [x] Pattern P-COMMIT (per cluster or grouped sensibly).

Notes:
9 commits on `overhaul/website-restructure`, one per cluster, plus a small partner `.benefit-list` dedup follow-up after cluster 9:
- ed4fdc2 — cluster 2 `.section-lede`
- 135bf86 — cluster 5 `.feature-list` + `.section-list`
- 63df05d — cluster 4 tier-price + tier-meta + #custom-donation
- cbbab12 — cluster 7 `.status-pill`
- 0d4080b — cluster 6 `.detail-item h3/h4 > .fa-*`
- d6984ce — cluster 8 `.trail-counts` + `.trail-count-col`
- e5753a4 — cluster 3 `.img-fluid-rounded` + `.media-narrow`
- 137bde5 — cluster 9 `.phase-grid` + `.benefit-list` (570-line dedup across 8 files)
- 2710d59 — cluster 11 where-to-ride map + operator cards (130-line dedup)
- dade7c8 — cluster 1 `.module-title-wrap` default 650→900px (205 inline strips across 38 EN+JA files)
- 5840be7 — partner `.benefit-list` dedup follow-up

Net codebase delta: ~1,000 lines removed (1,317 inline declarations stripped, ~250 new CSS lines added in `template.css`, plus ~700 lines of duplicated `<style>` blocks deleted across cluster 9 + 11).

Mid-flight scope adjustments folded into the cluster doc:
- Cluster 5 split into `.feature-list` (h3-per-item shape) + `.section-list` (strong-lead-in shape) — the proposed single-class-with-modifier didn't survive contact with the markup.
- Cluster 6 widened from `.park-sidebar-panel` scope to `.detail-item h3/h4 > .fa-*` — same icon-spacing pattern shows up in the event and job sidebars too.
- Cluster 11 turned out to not need `.ride-card` work (already in template.css) — repurposed to dedupe the map-popup + operator-card blocks that were duplicated across EN+JA `/where-to-ride/`.

---

### Task C.6: Visual regression spot-check

Steps:
- [x] Spot-check the design-review skill against representative pages.
- [x] Fix any regressions immediately.
- [x] Pattern P-COMMIT for any fixes.

Notes:
design-review agent walked 12 pages at desktop (1440) and mobile (375) where risk warranted, covering every cluster's representative call sites: Home, About (phase-grid is-wide), Twin Peaks (park-stats sidebar), Where to Ride (map popups, trail-counts, ride-cards), Projects (status pills), Projects/Twin Peaks (phase-grid default + benefit-list), Donate (tier prices), Join (tier prices with /year suffix), Dirty Dames (feature-list), Partner (heavy module-title-wrap user), Privacy (650→900 default change), Thanks (650→900 + is-flush), Code of Conduct.

**Result: all 12 pages PASS.** Zero JS errors, no horizontal scroll, no layout breakage, all status pill colours / tier prices / trail-counts / phase-grid / map popup / park-stats / feature-list / section-lede renders match expected behaviour. The 650→900 module-title-wrap default change had no measurable visual regression on privacy/thanks/code-conduct (those pages render their lede inside the wrap but body prose outside, so line-length wasn't affected).

One medium-priority doc-vs-implementation mismatch flagged: `.feature-list` in template.css implements the 115%/1.7 shape (compact h3-per-item, the only variant currently used). The cluster doc proposed `.feature-list` at 130%/2.2 with a `.feature-list--compact` modifier — that proposal was restructured during cluster 5 implementation into two separate classes (`.feature-list` h3-per-item + `.section-list` strong-lead-in) based on differing markup shapes. Cluster doc updated to reflect the actual implementation (commit included in summary).

---

## Post-Launch Backlog (SEO follow-ups)

Items surfaced during the 2026-05 SEO baseline review that are nice-to-have but not launch-gating. Pick up after launch.

### B.1: Regional Niseko trail map page under `/where-to-ride/`

**Why:** GSC baseline shows real demand for a multi-park overview map:
- `niseko trail map` — 77 imp, pos 62
- `trail map niseko` — 69 imp
- `niseko japan trail map` — 78 imp, pos 78
- `niseko mountain map`, `hirafu trail map` — similar tail

Twin Peaks already has its own park map. This would be a regional-scale page covering all four areas (Twin Peaks, Grand Hirafu, Hanazono, Annupuri) plus the skills parks. Distinct from individual park maps.

**Suggested approach:**
- New page at `/where-to-ride/map/` and `/ja/where-to-ride/map/`.
- Embed the existing area map (Google Maps with all park markers — same one already used on `/where-to-ride/`) as the primary content, full-width.
- Add `ImageObject` or `Map` schema for the visual.
- Title: "Niseko MTB Trail Map" / `ニセコMTBトレイルマップ`. Lead with target keyword.
- Link from `/where-to-ride/` and from each park sub-page.

### B.2: Loïc Bruni evergreen story page

**Why:** Branded queries had real traction in the baseline:
- `ロイックブルーニ` — 116 imp, pos 4.1
- `ロイック・ブルーニ` — 80 imp, pos 2.67
- `loic bruni` — 60 imp, pos 10.57

The current source of these clicks is `/ja/events/loic-bruni-in-niseko-2025/` — a dated event page that will lose relevance after the event year passes. An evergreen story page keeps the ranking.

**Suggested approach:**
- New page at `/stories/loic-bruni-niseko/` (and JA mirror) once `/stories/` is enabled (see R.1).
- Repurpose hero photo + cover the visit narrative.
- Add `NewsArticle` schema with `author`, `datePublished`, `image`.
- 301-style canonical reference from the original event page to the story page.

---

## Post-Launch Restorations

Items intentionally hidden or disabled at launch that need to be re-enabled when their gating condition is met. Add new entries here whenever something gets temporarily switched off.

### R.1: Re-enable `/stories/` in nav

**Gate:** First story published (target: 1-2 weeks post-launch).

**What was changed:**
- `_data/nav.yml` (Task 0.4, commit 2eb2085) — Stories entry commented out

**What to do to restore:**
- [ ] Uncomment the Stories entry in `_data/nav.yml` (look for the comment block referencing this task).
- [ ] Verify the entry sits in the correct position (currently between Impact and Dirty Dames).
- [ ] Visual check on served site: Stories link appears in nav in both EN and JA.

**Related signals to recheck at restoration time:**
- `projects/yotei-360/index.html:84` and `ja/projects/yotei-360/index.html:84` already contain a "Follow our stories" CTA pointing to `/stories/`. The link works today (page is live), but the destination is empty until the first story lands. No action needed at restoration; just be aware these CTAs become more meaningful once content exists.
- `stories/index.html` and `ja/stories/index.html` already have an empty-state message ("Stories coming soon"). Once posts in the `stories` category exist, they will populate the list automatically.

---

### R.2: Include Hanazono trails in the `/where-to-ride/` trail-count stat

**Gate:** Hanazono Bike Park opens (target: Summer 2026).

**What was changed:**
- `where-to-ride/index.html`, `ja/where-to-ride/index.html` (Task A.1) — the trail-count stat reflects only currently-open parks (Twin Peaks 20 + Grand Hirafu 3 + Annupuri 1 = 24 trails). Hanazono's 3 listed trails in `_data/trails.yml` are excluded from the hub stat at launch.

**What to do to restore:**
- [ ] Recount trails in `_data/trails.yml` at the time (Hanazono entries, plus any new trails opened in the interim).
- [ ] Update the trail-count stat number on `/where-to-ride/` and `/ja/where-to-ride/`.
- [ ] Re-check the regional km stat on the same page against the latest `_data/impact.yml` figure; bump if needed.
- [ ] Visual check on served site.

---

### R.3: Re-add Creek 'n' Peak to Twin Peaks trail list

**Gate:** Trail opens to the public (construction finished; opening date TBC).

**What was changed:**
- `_data/trails.yml:172-182` — Creek 'n' Peak entry commented out. Construction is finished but the trail is not yet open.

**What to do to restore:**
- [ ] Uncomment the Creek 'n' Peak block in `_data/trails.yml`.
- [ ] Verify difficulty count auto-updates on `/where-to-ride/` and `/twin-peaks/`.
- [ ] If R.2 has already been restored, bump the trail-count stat on `/where-to-ride/` by one to include Creek 'n' Peak.

---

## Success Criteria (from spec §12)

- [ ] All Phase 0 globals applied site-wide
- [ ] All Phase A page items ticked (including Home, or Home triggered to its own spec)
- [ ] All Phase B items ticked for every page (humanize + SEO + JA parity)
- [ ] Phase C: no unnecessary inline CSS; brand stylesheet is the shared source
- [ ] Every EN page has a JA twin with parity
- [ ] No broken internal links, no orphan pages, sitemap clean
