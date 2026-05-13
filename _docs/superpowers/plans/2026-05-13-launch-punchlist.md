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
3. For visible JA text in markup, run through BudouX CLI to insert `<wbr>` at word boundaries (see `_docs/bilingual.md`).
4. For JA front matter that renders as visible text (`titleHtml`, `location`, itinerary `name`, `moreInfo`, price `name`), tokenise with `<wbr>`. Keep `title`, `description`, `address` plain.
5. Confirm EN + JA file lists in the commit are paired.

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
- [ ] Discuss background image change with Tom. Decision: defer to a cross-page masthead sweep after all Phase A pages are walked (see Task A.28).
- [x] Locate the "navigating around park" section. Remove it. Add a clear link to `/where-to-ride/signage/` in a sensible spot. Replaced with compact `.signage-link` paragraph directly under the trails table linking to `/where-to-ride/signage/` (EN) and `/ja/where-to-ride/signage/` (JA). Also stripped ~258 lines of `.trail-sign*` CSS, the `body:after` preloader for the trailsign zoom images, and the Splide init script that only served the removed carousel.
- [x] Check if gallery markup is already in the layout template. If not, add a gallery section near the bottom of the page; source images via Pattern P-IMG. No existing gallery pattern on the site; built one as `.tp-gallery` with `.gallery-grid` (1/2/3 columns at mobile/tablet/desktop), `.gallery-tile` (3:2 aspect-ratio), and `.gallery-placeholder` (fa-image icon + descriptive label). 6 placeholders shipped with category labels (aerial, flow, jumps, beginner, forest singletrack, trailhead signage). Real photos to be dropped into `assets/images/_triage/twin-peaks/` per Pattern P-IMG; placeholders swap to `<img>` tags inside `.gallery-tile`.
- [x] Mirror EN → JA (Pattern P-EN-JA). JA placeholder labels tokenised with `<wbr>`. Signage link text: 「トレイルサインの読み方は、統一トレイルサインガイドをご覧ください。」 with `<wbr>` markup.
- [ ] Visual check. *(Tom to verify in browser — pages return 200, build clean, no residual carousel references.)*
- [ ] Pattern P-COMMIT.

Notes:
Background image deferred to cross-page sweep (Task A.28). Gallery uses placeholders awaiting real images via P-IMG. No JS errors expected: removed Splide init referenced a DOM ID that no longer exists; `.widget-cover` click handler preserved for the Trailforks map.
Decide: (resolved — bg image deferred; gallery added with placeholders)

---

### Task A.3: `/where-to-ride/grand-hirafu/`

**Files:**
- Modify: `where-to-ride/grand-hirafu/index.html`, `ja/where-to-ride/grand-hirafu/index.html`
- Modify: any references elsewhere in the site to "Grand Hirafu" without "Bike Park"

Steps:
- [x] Run `grep -rn "Grand Hirafu" --include="*.html" --include="*.md" --include="*.yml"` and identify which references need "Bike Park" appended.
- [x] Rename "Grand Hirafu" to "Grand Hirafu Bike Park" — applied to card headings and logo alt text on `/where-to-ride/` and `/projects/` (EN + JA). Body copy, listicles, resort-entity references, and internal docs intentionally left as-is per Bucket A scope (see Notes).
- [ ] Update the Trailforks embed: confirm current iframe URL/region; update to the correct Grand Hirafu region ID if changed.
- [ ] Update trail list/specs against current data.
- [ ] Audit section padding; fix where inconsistent with new reference style.
- [ ] Add gallery images (Pattern P-IMG).
- [x] Mirror EN → JA (Pattern P-EN-JA) — done for the rename portion. Other A.3 sub-tasks still pending JA mirror.
- [ ] Visual check.
- [ ] Pattern P-COMMIT — partial commit for rename portion only.

Notes:
Rename scope: Bucket A (headings + alt + page titles + canonical data names). Body copy, resort-entity references, park listicles, and internal docs left as-is. Twin Peaks `<h4>` on `/projects/` also gained "Bike Park" for consistency with the other two cards. JA-only spelling fix: グランヒラフ → グラン・ヒラフ (with middle dot) applied to UI headings + canonical name only; body copy still uses グランヒラフ.
Decide: (none open)

---

### Task A.4: `/where-to-ride/hanazono/`

**Files:**
- Modify: `where-to-ride/hanazono/index.html`, `ja/where-to-ride/hanazono/index.html`
- Modify: any references elsewhere to "Hanazono" needing "Bike Park"

Steps:
- [x] Run `grep -rn "Hanazono" --include="*.html" --include="*.md" --include="*.yml"`.
- [x] Rename "Hanazono" → "Niseko Hanazono Bike Park" (per Tom's brand correction). Applied to card headings, logo alt text, page titles, and canonical `_data/trails.yml` names on `/where-to-ride/` and `/projects/` (EN + JA). JA brand spelling is `ニセコHANAZONOバイクパーク` (Latin "HANAZONO" preserved). Body copy and "Park Hyatt Niseko Hanazono" hotel reference left as-is per Bucket A scope.
- [ ] Update Trailforks embed for Hanazono.
- [ ] Update trails + specs against current data.
- [ ] Add gallery images (Pattern P-IMG).
- [x] Mirror EN → JA (Pattern P-EN-JA) — done for the rename portion. Other A.4 sub-tasks still pending JA mirror.
- [ ] Visual check.
- [ ] Pattern P-COMMIT — partial commit for rename portion only.

Notes:
Rename scope: same Bucket A approach as A.3.
Decide: (none open)

---

### Task A.5: `/where-to-ride/gravel/`

**Files:**
- Modify: `where-to-ride/gravel/index.html`, `ja/where-to-ride/gravel/index.html`

Steps:
- [ ] Read both files end to end.
- [ ] Check text for accuracy and tone (current state vs. NAMBA voice).
- [ ] Add placeholder gallery images (Pattern P-IMG) ahead of real photos; mark placeholders clearly so they can be swapped later.
- [ ] If real gravel images become available, replace placeholders.
- [ ] Mirror EN → JA (Pattern P-EN-JA).
- [ ] Visual check.
- [ ] Pattern P-COMMIT.

Notes:
Decide: (none open)

---

### Task A.6: `/where-to-ride/skills-parks/` (pumptracks)

**Files:**
- Modify: `where-to-ride/skills-parks/index.html`, `ja/where-to-ride/skills-parks/index.html`

Steps:
- [ ] Read both files.
- [ ] Check text accuracy for each listed facility.
- [ ] Add images per facility (Pattern P-IMG).
- [ ] Discuss with Tom: add per-facility external links (resort site, location pin)?
- [ ] Implement decision.
- [ ] Mirror EN → JA (Pattern P-EN-JA).
- [ ] Visual check.
- [ ] Pattern P-COMMIT.

Notes:
Decide: add facility links?

---

### Task A.7: `/where-to-ride/annupuri/`

**Files:**
- Modify: `where-to-ride/annupuri/index.html`, `ja/where-to-ride/annupuri/index.html`

Steps:
- [x] Rename pass: page title, ride card heading + alt, map POI, and canonical `_data/trails.yml` name updated to "Niseko Annupuri Bike Park" / "ニセコアンヌプリバイクパーク" (EN + JA) alongside A.3/A.4 in the same commit. Old EN page title "Niseko Annupuri Downhill" replaced; JA title was "ニセコアンヌプリ ダウンヒル".
- [ ] Discuss with Tom: does this page need the same polish pass as siblings, or is it already done? (It was not in the original list.)
- [ ] If yes: apply Pattern P-STYLE, check text, gallery images via Pattern P-IMG.
- [ ] If no: tick and skip.
- [ ] Mirror EN → JA (Pattern P-EN-JA) if changes made.
- [ ] Pattern P-COMMIT (or note "no changes" in commit-less skip).

Notes:
Rename applied. Polish/skip decision still open.
Decide: polish or skip

---

### Task A.8: `/plan-your-trip/`

**Files:**
- Modify: `plan-your-trip/index.html`, `ja/plan-your-trip/index.html`

Steps:
- [ ] Replace images (Pattern P-IMG).
- [ ] Check text accuracy + tone.
- [ ] Mirror EN → JA (Pattern P-EN-JA).
- [ ] Visual check.
- [ ] Pattern P-COMMIT.

Notes:
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
- [ ] Final text check, looking for any data points that need descriptive context (a number on its own with no framing).
- [ ] Ask Tom for keyword search increases from Google Analytics (organic search growth metric) if available. If provided, add to the data narrative.
- [ ] Mirror any EN edits to JA (Pattern P-EN-JA).
- [ ] Visual check.
- [ ] Pattern P-COMMIT.

Notes:
Decide: GA keyword data availability

---

### Task A.17: `/dirty-dames/`

**Files:**
- Modify: `dirty-dames/index.html`, `ja/dirty-dames/index.html`

Steps:
- [ ] Add images (Pattern P-IMG).
- [ ] Check data: participant numbers, dates, recent event details. Update from source if stale.
- [ ] Mirror EN → JA (Pattern P-EN-JA).
- [ ] Visual check.
- [ ] Pattern P-COMMIT.

Notes:
Decide: (none open)

---

### Task A.18: `/press/`

**Files:**
- Modify: `press/index.html`, `ja/press/index.html`

Steps:
- [ ] Formatting check: find the list bullet issue Tom flagged. Inspect raw markup and rendered output. Fix the bullet/list rendering.
- [ ] Fact-check each press mention (publication, date, link, summary).
- [ ] Replace images (Pattern P-IMG).
- [ ] Mirror EN → JA (Pattern P-EN-JA).
- [ ] Visual check.
- [ ] Pattern P-COMMIT.

Notes:
Decide: (none open)

---

### Task A.19: `/events/` (index page)

**Files:**
- Modify: `events/index.html`, `ja/events/index.html`

Steps:
- [ ] Light polish only. Per spec, splitting upcoming vs past events is out of scope and deferred to a separate future task.
- [ ] Verify the listing renders correctly with current and past events both present.
- [ ] Tone/text pass if needed.
- [ ] Mirror EN → JA (Pattern P-EN-JA).
- [ ] Pattern P-COMMIT.

Notes:
Decide: (none open. Upcoming/past split is OOS: see spec §10.)

---

### Task A.20: Single event page layout fix

**Files:**
- Modify: `_layouts/event.html`
- Inspect: every event post in `_posts/` and `ja/_posts/` for description duplication patterns

Steps:
- [ ] Pattern P-STYLE audit on `_layouts/event.html` against the new reference style.
- [ ] Inspect 3-4 recent event posts. Identify the duplication pattern: description appears at top (metadata block) AND in the first paragraph of the body.
- [ ] Decide with Tom: either (a) remove description from front matter `description` for display in body but keep for meta, OR (b) edit each post to remove the body duplicate.
- [ ] Implement chosen path. If (b), this becomes an editorial sweep across event posts (might warrant a follow-up task per cluster).
- [ ] Mirror in JA event posts.
- [ ] Verify on a representative event post.
- [ ] Pattern P-COMMIT.

Notes:
Decide: layout fix vs editorial sweep

---

### Task A.21: `/partner/` (Chris Selig + final text check)

**Files:**
- Modify: `partner/index.html`, `ja/partner/index.html`

Steps:
- [ ] Run `grep -n "Selig" partner/index.html ja/partner/index.html` to locate the Santa Cruz reference.
- [ ] Update Chris Selig's affiliation: Santa Cruz → Norco. Mirror in JA.
- [ ] Final text pass on the rest of the page.
- [ ] Visual check.
- [ ] Pattern P-COMMIT.

Notes:
Decide: (none open)

---

### Task A.22: `/join/`

**Files:**
- Modify: `get-involved/join/index.html`, `ja/get-involved/join/index.html` (verify path; may have moved to `/join/` per overhaul)
- External: Ecwid admin (no code change)

Steps:
- [ ] Confirm current URL/path for the Join page. The overhaul moved `/get-involved/join/` → `/join/`. Use whichever is current.
- [ ] Replace images (Pattern P-IMG).
- [ ] Check text.
- [ ] Check graph data: any chart on the page (membership growth, etc.). Verify data accuracy. Update if stale.
- [ ] Mirror EN → JA (Pattern P-EN-JA).
- [ ] Flag external action to Tom: membership products in Ecwid need to be converted to subscription products. This is an Ecwid admin task, not code. Track in Notes.
- [ ] Visual check.
- [ ] Pattern P-COMMIT.

Notes:
External action: Ecwid membership → subscription conversion (Tom does in Ecwid admin)
Decide: (none open)

---

### Task A.23: `/donate/`

**Files:**
- Modify: `donate/index.html`, `ja/donate/index.html` (verify path; may be `/get-involved/donate/`)

Steps:
- [ ] Confirm current path for the Donate page.
- [ ] Discuss with Tom: are there too many cards? Reduce if so.
- [ ] Discuss with Tom: images instead of icons (or add an image or two alongside icons)?
- [ ] Implement decisions; source any new images via Pattern P-IMG.
- [ ] Final text check.
- [ ] Mirror EN → JA (Pattern P-EN-JA).
- [ ] Visual check.
- [ ] Pattern P-COMMIT.

Notes:
Decide: card count? images vs icons?

---

### Task A.24: `/jobs/`

**Files:**
- Modify: `jobs/index.html`, `ja/jobs/index.html`

Steps:
- [ ] Final text pass.
- [ ] Verify listings reflect current open positions.
- [ ] Mirror EN → JA (Pattern P-EN-JA).
- [ ] Visual check.
- [ ] Pattern P-COMMIT.

Notes:
Decide: (none open)

---

### Task A.25: Single job page layout fix

**Files:**
- Modify: `_layouts/job.html`
- Inspect: recent job posts in `_posts/` and `ja/_posts/`

Steps:
- [ ] Same approach as A.20 but for jobs.
- [ ] Pattern P-STYLE audit on `_layouts/job.html`.
- [ ] Identify the description duplication (top metadata vs first body paragraph). Apply the same fix approach chosen in A.20 for consistency.
- [ ] Mirror in JA job posts where editorial changes are made.
- [ ] Visual check on a recent job post.
- [ ] Pattern P-COMMIT.

Notes:
Decide: (carry from A.20)

---

### Task A.26: `/shop/`

**Files:**
- Modify: `shop/index.html`, `ja/shop/index.html`
- Modify: `artist-series/index.html`, `ja/artist-series/index.html` (or wherever artist series lives)
- External: Ecwid admin (no code change)

Steps:
- [ ] Final pass on shop page with new reference style (Pattern P-STYLE).
- [ ] Final pass on artist series page with new reference style.
- [ ] Mirror EN → JA (Pattern P-EN-JA).
- [ ] Flag external action to Tom: upload product images for donations and memberships in Ecwid admin.
- [ ] Visual check on both pages.
- [ ] Pattern P-COMMIT.

Notes:
External action: Ecwid donation + membership product images (Tom uploads in Ecwid admin)
Decide: (none open)

---

### Task A.28: Cross-page masthead background image sweep

**Files:**
- Modify front matter on per-page basis: `where-to-ride/index.html`, `twin-peaks/index.html`, `where-to-ride/grand-hirafu/index.html`, `where-to-ride/hanazono/index.html`, `where-to-ride/gravel/index.html`, `where-to-ride/skills-parks/index.html`, `where-to-ride/annupuri/index.html`, `plan-your-trip/index.html`, `about/index.html`, `team/index.html`, `projects/index.html`, `projects/*/index.html`, `impact/index.html`, `dirty-dames/index.html`, `press/index.html`, `events/index.html`, `partner/index.html`, etc. plus all JA twins.
- Source assets via Pattern P-IMG into `assets/images/_triage/mastheads/` then process and place per page.

Steps:
- [ ] Inventory current masthead state per page: which pages set `masthead.img` in front matter vs fall back to `/assets/images/bg/bg-header.jpg`.
- [ ] Discuss with Tom: one image per page, or share-and-vary across related pages?
- [ ] Tom drops candidate landscape photos into `assets/images/_triage/mastheads/` grouped by page slug.
- [ ] Pick + process to masthead-suitable size (likely 1920 wide). Place under `assets/images/mastheads/` or per-page folders (decide convention at sweep time).
- [ ] Update each page's `masthead.img` (and `masthead.credit` where photographer attribution applies) in EN front matter.
- [ ] Mirror to JA front matter.
- [ ] Visual check across all updated pages.
- [ ] Pattern P-COMMIT (likely per-cluster of related pages).

Notes:
This task was created to capture the deferred bg-image decisions from A.2 onward. Defer until the rest of Phase A is walked so we know the full set of pages, can see them side-by-side, and apply a consistent visual treatment.

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
