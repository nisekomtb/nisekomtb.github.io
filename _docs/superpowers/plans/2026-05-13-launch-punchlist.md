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
- [ ] Local serve (`bundle exec jekyll serve --baseurl="" --open-url`) and visually verify: nav, footer, header, Home, plus one sub-page. *(Tom to verify in browser.)*
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
- [ ] Verify in served site (`/twin-peaks/`, `/partner/`). *(Tom to verify.)*
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
- [ ] Visual check at desktop + mobile widths. *(Tom to verify.)*
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
- [ ] Verify on served site: Stories no longer appears in top nav (EN + JA); `/stories/` direct URL still works. *(Tom to verify.)*
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
- [ ] Visual check on desktop + mobile. *(Tom to verify.)*
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
- [ ] Visual check. *(Tom to verify in browser — pages return 200, build clean, no residual carousel references.)*
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
- [ ] Visual check.
- [x] Pattern P-COMMIT — rename portion shipped (81b9cee titles + alt; ac1fb83 brand-correct names + JA spelling; f2f09e7 stats card short form). Subsequent embed + trails + gallery work shipped in b280d27.

Notes:
Rename scope: Bucket A (headings + alt + page titles + canonical data names). Body copy, resort-entity references, park listicles, and internal docs left as-is. Twin Peaks `<h4>` on `/projects/` also gained "Bike Park" for consistency with the other two cards. JA-only spelling fix: グランヒラフ → グラン・ヒラフ (with middle dot) applied to UI headings + canonical name only; body copy still uses グランヒラフ.
Embed + trails + section padding + gallery all addressed via the unified where-to-ride layout work (b280d27) on 2026-05-15. Only Tom's visual check remains.
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
- [x] Mirror EN → JA (Pattern P-EN-JA) — done for the rename portion and the trail data (data file is shared, JA names included). Body copy in `where-to-ride/hanazono/index.html` + JA twin still describes the originally-made-up trail set (4,500m flow + skills park + 1,500m link to Twin Peaks) and needs rewriting to match the actual Trailforks data — flagged for next session.
- [ ] Visual check.
- [x] Pattern P-COMMIT — rename portion shipped (81b9cee, ac1fb83, f2f09e7); trails + region update + gallery shipped (c04743a; layout share in b280d27). Body-copy rewrite is the remaining outstanding sub-task (see Notes / Decide).

Notes:
Rename scope: same Bucket A approach as A.3. Trails + region update done 2026-05-14 from Trailforks CSV export. Remaining gap: page body copy (EN + JA) still references the made-up trails — rewrite + body-copy ↔ data alignment is the next sub-task. Bike direction (one-way) and multi-use (true) on Forest Loop Course are assumptions awaiting confirmation; Downhill Course (down-only, bikes-only) is standard for lift-served downhill.
Decide: rewrite body copy to match real trails (Downhill Course + Forest Loop Course only) vs keep aspirational mention of skills park + Twin Peaks link as "coming"

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
- [ ] Source a new lead/gallery photo for `/where-to-ride/annupuri/`. The current `01.jpg` (aerial panorama of the Annupuri peak with ski runs) is now also being used as the body panorama on `/projects/`, so the Annupuri page should get a distinct hero shot to avoid duplication.

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
- Possibly modify: card hover CSS (locate file at work time)

Steps:
- [ ] Add images (Pattern P-IMG).
- [ ] Check text.
- [ ] Discuss with Tom: card hover style. Current is full fill on hover; proposed is outline only on hover.
- [ ] If outline chosen: locate the card hover CSS rule, change from fill to outline. Confirm hover states still read accessibly.
- [ ] Mirror EN → JA (Pattern P-EN-JA).
- [ ] Visual check.
- [ ] Pattern P-COMMIT.

Notes:
Decide: card hover outline vs fill

---

### Task A.10: `/team/`

**Files:**
- Modify: `team/index.html`, `ja/team/index.html`
- Possibly modify: a data file if team members are listed in YAML

Steps:
- [ ] Read both files.
- [ ] Discuss with Tom: add sub-committee volunteers (Hiromi, Elle, Hugo)?
- [ ] If yes: add to the relevant list/data file with bio, role, photo placeholder. Mirror in JA.
- [ ] Final text pass on existing entries.
- [ ] Mirror EN → JA (Pattern P-EN-JA).
- [ ] Visual check.
- [ ] Pattern P-COMMIT.

Notes:
Decide: add sub-committee volunteers?

---

### Task A.11: `/projects/` (hub)

**Files:**
- Modify: `projects/index.html`, `ja/projects/index.html`

Steps:
- [ ] Apply the project renames from the overhaul (confirm with Tom what the canonical names are now, e.g., "Yotei Loop" vs "Yotei 360").
- [ ] Replace images (Pattern P-IMG).
- [ ] Discuss with Tom: switch project cards to use resort icons (Hirafu, Hanazono, Annupuri marks) instead of current imagery?
- [ ] If yes: source resort icons; integrate into card design.
- [ ] Discuss with Tom: add a unified-signage section (linking to `/where-to-ride/signage/`)?
- [ ] Implement.
- [ ] Mirror EN → JA (Pattern P-EN-JA).
- [ ] Visual check.
- [ ] Pattern P-COMMIT.

Notes:
Decide: resort icons? Unified signage section?

---

### Task A.12: `/projects/twin-peaks/`

**Files:**
- Modify: `projects/twin-peaks/index.html`, `ja/projects/twin-peaks/index.html`

Steps:
- [ ] Create phase photos: per-phase map graphic (Google Maps screenshot or similar) showing trails completed/in-progress.
- [ ] Make phase photos larger / add a way to view detail (lightbox, larger inline, or expandable). Currently too small to read.
- [ ] Replace other page images (Pattern P-IMG).
- [ ] Check text.
- [ ] Convert timeline to the style used on About and Impact pages. Reference those pages' timeline markup.
- [ ] Mirror EN → JA (Pattern P-EN-JA).
- [ ] Visual check.
- [ ] Pattern P-COMMIT.

Notes:
Decide: phase-photo enlarge mechanism (lightbox vs larger inline vs expandable)

---

### Task A.13: `/projects/grand-hirafu/`

**Files:**
- Modify: `projects/grand-hirafu/index.html`, `ja/projects/grand-hirafu/index.html`

Steps:
- [ ] Read the current state. Diff against `projects/twin-peaks/index.html` to identify missing sections.
- [ ] Unify style with Twin Peaks project page: phase maps, timeline (in About/Impact style), section structure.
- [ ] Check text.
- [ ] Replace images (Pattern P-IMG).
- [ ] Mirror EN → JA (Pattern P-EN-JA).
- [ ] Visual check.
- [ ] Pattern P-COMMIT.

Notes:
Decide: (resolved via A.12 enlarge mechanism, apply same here)

---

### Task A.14: `/projects/hanazono/`

**Files:**
- Modify: `projects/hanazono/index.html`, `ja/projects/hanazono/index.html`

Steps:
- [ ] Same as A.13: diff against Twin Peaks project page, unify style with phase maps + timeline.
- [ ] Check text.
- [ ] Replace images (Pattern P-IMG).
- [ ] Mirror EN → JA (Pattern P-EN-JA).
- [ ] Visual check.
- [ ] Pattern P-COMMIT.

Notes:
Decide: (resolved via A.12)

---

### Task A.15: `/projects/yotei-360/` (Yotei Loop)

**Files:**
- Modify: `projects/yotei-360/index.html`, `ja/projects/yotei-360/index.html`
- Modify: any references to "Yotei 360" if rename confirmed

Steps:
- [ ] Discuss with Tom: confirm rename to "Yotei Loop" everywhere (folder stays `yotei-360` to preserve URL).
- [ ] If rename: `grep -rn "Yotei 360"` and update display strings to "Yotei Loop" everywhere they appear (page titles, nav, body copy, schema).
- [ ] Match style with Twin Peaks/Grand Hirafu/Hanazono project pages but lighter on content (concept stage).
- [ ] Add one or two photos (Pattern P-IMG).
- [ ] Minimal timeline (concept → feasibility → future phases).
- [ ] Mirror EN → JA (Pattern P-EN-JA).
- [ ] Visual check.
- [ ] Pattern P-COMMIT.

Notes:
Decide: confirm "Yotei Loop" rename

---

### Task A.16: `/impact/`

**Files:**
- Modify: `impact/index.html`, `ja/impact/index.html`

Steps:
- [x] Final text check: light humanizer trims on the 4 glossary descriptions (Local Partnerships, Community Fund, Trail Construction, Admin & Other). Removed "an estimated" from visitor line.
- [ ] Ask Tom for keyword search increases from Google Analytics (organic search growth metric) if available. If provided, add to the data narrative.
- [x] Mirror any EN edits to JA (Pattern P-EN-JA). JA timeline fully rewritten 2021-2026 for parity with EN (BudouX tokenized).
- [x] Visual check.
- [x] New masthead `bg-header-impact.jpg` (group on flowy berms, 2000×1333, 692KB).
- [x] Pattern P-COMMIT.

Notes:
Decide: GA keyword data availability

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
- [ ] Visual check. *(Tom to verify.)*
- [ ] Pattern P-COMMIT.

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
- [ ] Flag external action to Tom: membership products in Ecwid need to be converted to subscription products. This is an Ecwid admin task, not code. Track in Notes.
- [ ] Visual check. *(Tom to verify.)*
- [x] Pattern P-COMMIT.

Notes:
External action: Ecwid membership → subscription conversion (Tom does in Ecwid admin)
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
- [ ] Visual check on served site. *(Tom to verify.)*
- [ ] Pattern P-COMMIT.

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
- [x] Masthead replaced with `bg-header-jobs.jpg` (3-person working crew shot, mid dig day, 2000×1333 q82, 702KB). EN + JA front matter updated. Old `join-our-team.jpg` (credit Jinya Nishiwaki) decommissioned; new photo's photographer credit pending Tom's confirmation (filename suggests "AJP").
- [ ] Visual check on served site. *(Tom to verify.)*
- [ ] Pattern P-COMMIT.

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
- [ ] Visual check on a representative job post. *(Tom to verify — open posts: Project & Trail Application Assistant + Subcommittee Volunteer.)*
- [ ] Pattern P-COMMIT.

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
- [ ] Visual check on both shop + artist-series pages. *(Tom to verify.)*
- [ ] Pattern P-COMMIT.

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
- [ ] `/about/`
- [ ] `/team/`
- [ ] `/impact/`
- [ ] `/twin-peaks/` (deferred per A.2 — sweep when polish lands)
- [ ] `/projects/` (hub)
- [ ] `/projects/twin-peaks/`
- [ ] `/projects/grand-hirafu/`
- [ ] `/projects/hanazono/`
- [ ] `/projects/yotei-360/`
- [x] `/events/` — `bg-header-events.jpg` (commit cc0ed30)
- [ ] `/dirty-dames/`
- [x] `/partner/`
- [x] `/join/`
- [x] `/donate/` — `bg-header-donate.jpg` (top-down trail crew hands-on stone work, 2000×1333 q82)
- [x] `/jobs/` — `bg-header-jobs.jpg` (3-person working crew, 2000×1333 q82)
- [ ] `/contact/`
- [ ] `/press/`
- [ ] `/stories/`
- [ ] `/artist-series/`

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
- [ ] Stop. Trigger a fresh brainstorm/spec for the Home page (hero image + hero video + section restructure). The Home page is large enough to warrant its own design conversation.
- [ ] Do NOT begin Home work as part of this plan. Write a new spec at `_docs/superpowers/specs/<date>-home-redesign-design.md` first.
- [ ] Tick this task once the Home spec is written and Home implementation begins under that spec's own plan.

Notes:
Decide: (handled in separate Home spec)

---

## Phase B: Humanize + SEO + JA Re-Parity Sweep

### Task B.0.1: Install humanizer skill

**Prereq for all Phase B per-page work.**

Steps:
- [ ] Confirm with Tom: ready to start Phase B?
- [ ] Walk Tom through installing the humanizer skill from `https://github.com/blader/humanizer`. Likely involves cloning into the local plugins/skills location and reloading.
- [ ] Verify installation: list the skill in available skills, do a dry-run on a sample paragraph.
- [ ] Pattern P-COMMIT only if any project files changed (likely none; this is a tool install).

Notes:
Decide: (none open. Confirm Phase A done before starting.)

---

### Task B.0.2: Gather SEO inputs

Steps:
- [ ] Confirm `_docs/seo-baseline-2026-04/` GSC export is current. If stale (>3 months), pull a fresh export.
- [ ] Run `claude-seo:seo-audit` against the served local site. Save output for reference.
- [ ] Run `claude-seo:seo-geo` for AI-search visibility baseline. Save output.
- [ ] Ask Tom: GA4 organic keyword data, can he export? If yes, save to `_docs/` and reference in B.<page> work.
- [ ] Ask Tom: DataForSEO MCP, install for live SERP, or skip? If install, follow extension's setup.
- [ ] Confirm marketing-strategy.md §2 keyword list is current.
- [ ] Pattern P-COMMIT (only if any input artifacts are saved into the repo).

Notes:
Decide: GA4 data? DataForSEO?

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
- [ ] B.1 `/where-to-ride/` (hub)
- [ ] B.2 `/twin-peaks/`
- [ ] B.3 `/where-to-ride/grand-hirafu/`
- [ ] B.4 `/where-to-ride/hanazono/`
- [ ] B.5 `/where-to-ride/gravel/`
- [ ] B.6 `/where-to-ride/skills-parks/`
- [ ] B.7 `/where-to-ride/annupuri/` (skip if A.7 was skipped)
- [ ] B.8 `/plan-your-trip/`
- [ ] B.9 `/about/`
- [ ] B.10 `/team/`
- [ ] B.11 `/projects/` (hub)
- [ ] B.12 `/projects/twin-peaks/`
- [ ] B.13 `/projects/grand-hirafu/`
- [ ] B.14 `/projects/hanazono/`
- [ ] B.15 `/projects/yotei-360/`
- [ ] B.16 `/impact/`
- [ ] B.17 `/dirty-dames/`
- [ ] B.18 `/press/`
- [ ] B.19 `/events/` (index)
- [ ] B.20 Event layout + sample post sweep (apply Phase B template to `_layouts/event.html` shared copy and a representative post)
- [ ] B.21 `/partner/`
- [ ] B.22 `/join/`
- [ ] B.23 `/donate/`
- [ ] B.24 `/jobs/`
- [ ] B.25 Job layout + sample post sweep
- [ ] B.26 `/shop/` + artist series
- [ ] B.27 `/` (Home: only if Home redesign spec has completed; otherwise defer)

---

## Phase C: Site-Wide CSS Audit and Promotion

### Task C.1: Inventory inline CSS

Steps:
- [ ] Run `grep -rn 'style="' --include="*.html" .` excluding `_site/` and `node_modules/` to inventory inline `style=` attributes.
- [ ] Run `grep -rn '<style' --include="*.html" .` excluding `_site/` to inventory inline `<style>` blocks.
- [ ] Save the inventory output to `_docs/css-audit-inventory.txt` (gitignored or temporary; do not commit unless useful as reference).
- [ ] Pattern P-COMMIT only if inventory file is committed.

Notes:

---

### Task C.2: Cluster repeated patterns

Steps:
- [ ] Review the inventory. Group inline rules by pattern: card hover, section padding, heading scale, button variants, image frames, etc.
- [ ] For each cluster, note: how many occurrences, which pages, the rule values.
- [ ] Save cluster analysis as `_docs/css-audit-clusters.md` for review.
- [ ] No commit until C.3 decision.

Notes:

---

### Task C.3: Propose promotion list

Steps:
- [ ] For each cluster, propose: promote to shared utility class (e.g., `.namba-card-hover`) OR promote to component class (e.g., `.partner-card`) OR leave inline (one-off, justified).
- [ ] Draft new entries for the brand stylesheet.
- [ ] Present the promotion list to Tom for approval.

Notes:
Decide: promotion list approval

---

### Task C.4: Tom approves promotion list

Steps:
- [ ] Tom reviews and approves/edits the proposed promotion list.
- [ ] Record decisions in `_docs/css-audit-clusters.md`.
- [ ] No commit.

Notes:

---

### Task C.5: Refactor

Steps:
- [ ] Implement new classes in the brand stylesheet.
- [ ] For each cluster: replace inline rules with the new class across all affected pages.
- [ ] Update both EN and JA mirrors (structural changes apply to both).
- [ ] Run `bundle exec jekyll serve` and visually verify a representative page per cluster.
- [ ] Pattern P-COMMIT (per cluster or grouped sensibly).

Notes:

---

### Task C.6: Visual regression spot-check

Steps:
- [ ] Spot-check the design-review or design-quick-check skill against 5-6 representative pages (Home, About, Impact, a project page, a Where-to-Ride sub-page, a post).
- [ ] Fix any regressions immediately.
- [ ] Pattern P-COMMIT for any fixes.

Notes:

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
