# CSS Audit — Clusters & Promotion Proposal

Generated 2026-05-30 from `_docs/css-audit-inventory.txt`.

**Source counts:**

- 835 inline `style="..."` attributes across HTML
- 52 inline `<style>` blocks across HTML
- Of 132 distinct inline style values, **98 repeat** (≥2 uses) and 34 are one-offs
- The brand stylesheet is `assets/css/template.css` (8,050 lines)

The proposal column for each cluster is one of:

- **Promote (utility)** — single-purpose shared class (e.g. `.wrap-narrow`)
- **Promote (component)** — multi-property component class (e.g. `.donation-tier-price`)
- **Fix default** — the existing class is already there; change its default to remove the inline override
- **Leave inline** — one-off, justified, not worth a class

---

## Cluster 1 — `.module-title-wrap` width overrides

**Hits:** 195 inline `max-width:900px;` + 8 inline `max-width:1100px;` + 2 inline `max-width:1000px;`

`.module-title-wrap` exists at `assets/css/template.css:2370` with `max-width: 650px`. The default is rarely used as-is — 203 of 266 occurrences override it inline.

| Override            | Count | Used for                                               |
| ------------------- | ----- | ------------------------------------------------------ |
| `max-width:900px`   | 193   | almost every page intro / lede block                   |
| `max-width:1100px`  | 8     | a few wider intro blocks (partner, where-to-ride hub)  |
| `max-width:1000px`  | 2     | edge cases                                             |
| `margin-bottom:0;`  | 2     | one-offs                                               |
| (default 650px)     | ~63   | sparing — mostly section-title cards (no body lede)    |

**Proposal: Fix default + add modifier classes.**

- Change `.module-title-wrap` default from `650px` to `900px` (matches the dominant pattern).
- Add `.module-title-wrap.is-narrow { max-width: 650px; }` for the cases that want the old default.
- Add `.module-title-wrap.is-wide { max-width: 1100px; }` for the 8 wide cases.
- Drop the 1000px outliers — round down to 900px or up to 1100px (judgment per page).

**Net change after refactor:** removes ~203 inline overrides; adds ~63 `.is-narrow` modifiers; ~8 `.is-wide` modifiers. Big win.

---

## Cluster 2 — Lede paragraph (`font-size:130%`)

**Hits:** 145 instances of `style="font-size:130%;"` on `<div>` blocks immediately inside `.module-title-wrap`.

Pattern: `<div style="font-size:130%;"><span>…lede copy…</span></div>` — the section's intro paragraph, always one short sentence (or two).

**Proposal: Promote (utility).** New class:

```css
.section-lede {
  font-size: 130%;
}
@media (max-width: 767px) {
  .section-lede { font-size: 115%; }  /* Optional: tone down on mobile */
}
```

Mobile breakpoint is optional and dependent on visual review — flag for C.5 to validate. Without it, parity with current behaviour.

---

## Cluster 3 — Rounded image, full-width block

**Hits:**

- 30 × `style="width:100%; height:auto; border-radius:3px; display:block;"`
- 30 × `style="max-width:900px; margin:20px auto;"` (the wrapping `<div>` for those images)
- 8 × `style="width:100%; height:auto; border-radius:3px; display:block; margin:18px 0 36px;"` (variant with explicit vertical margin)

These come in pairs: a centred narrow wrap + a rounded `<img>` inside it. The image patterns are mostly emitted by `{% include image.html %}` whose `style` param falls through to the `<img>`.

**Proposal: Promote (utility) — two classes.**

```css
.media-narrow {
  max-width: 900px;
  margin: 20px auto;
}

.img-fluid-rounded {
  width: 100%;
  height: auto;
  border-radius: 3px;
  display: block;
}

.img-fluid-rounded--spaced {  /* the +18px/36px variant */
  margin: 18px 0 36px;
}
```

The `image.html` include's `style` param can keep working for outliers, but every body-image call site that uses the standard pattern collapses to `class="img-fluid-rounded"`. Open question: should we add a `rounded` param to `image.html` to emit the class automatically? Decide in C.4.

---

## Cluster 4 — Donation / membership price block

**Hits:** 18 × `style="font-size: 24px; padding-bottom:8px;"` — the big-number ¥ amount inside donation tier cards (`/donate/` × 6 + `/ja/donate/` × 6 + `/join/` × 4 × 2 lang ≈ 16, plus the custom-amount block × 2).

Plus 12 × `style="margin-top:10px; font-size:90%;"` for the descriptor line below the amount. And 8 × `style="margin-top:10px; font-size:90%; color:#aaa;"` for membership tier subtext.

**Proposal: Promote (component) — donation/membership card.**

```css
.tier-price {
  font-size: 24px;
  padding-bottom: 8px;
}

.tier-meta {
  margin-top: 10px;
  font-size: 90%;
}

.tier-meta--muted {  /* the variant with color:#aaa */
  color: #aaa;
}
```

Plus the custom-amount input on `/donate/` (`<input id="custom-donation" style="font-size:24px; width:120px; ...">`) gets a `.tier-price-input` class with the same baseline.

---

## Cluster 5 — Unstyled feature list inside benefit/programme cards

**Hits:**

- 20 × `style="margin:0 0 6px;"` on `<h3>` (zero out h3's default top margin inside list items)
- 20 × `style="margin-bottom: 28px;"` on `<li>` (per-item spacing in feature lists)
- 13 × `style="list-style:none; line-height:2.2; font-size:130%; padding-left:0;"` (about + impact + projects "What's Being Built" lists)
- 4 × `style="list-style:none; padding-left:0; font-size:115%; line-height:1.7;"` (dirty-dames programme list)

These all describe the same shape: an unstyled `<ul>` of `<li>` blocks, each with an h3 title and one paragraph. The two variants differ only in font-size + line-height density.

**Proposal: Promote (utility/component).**

```css
.feature-list {
  list-style: none;
  padding-left: 0;
  line-height: 2.2;
  font-size: 130%;
}

.feature-list--compact {
  font-size: 115%;
  line-height: 1.7;
}

.feature-list > li {
  margin-bottom: 28px;
}

.feature-list > li > h3 {
  margin: 0 0 6px;
}
```

One class on the `<ul>`, no per-item inline styles needed. Replaces 57 inline declarations.

---

## Cluster 6 — FontAwesome icon margin in headings

**Hits:** 29 × `style="margin-right:4px;"` — almost all inside `_includes/park-stats.html` for `<span class="fa-solid fa-...">` inside `<h3>` panel labels. A few on chevron/arrow icons in nav-style buttons elsewhere.

**Proposal: Promote (utility) — one shared rule.**

```css
.park-sidebar-panel h3 > .fa-solid,
.park-sidebar-panel h3 > .fa-regular,
.park-sidebar-panel h3 > .fa-brands {
  margin-right: 4px;
}
```

Scoped to the panel selector so it doesn't accidentally affect FA icons elsewhere. Removes 14 inline declarations in `_includes/park-stats.html` alone.

Open question: do we want a more general `.icon-leading` utility for the handful of cases outside park-stats? Probably overkill — leave those inline. Decide in C.4.

---

## Cluster 7 — Status pill badges (3 colour variants)

**Hits:** 18 total across 3 colour variants of an identical shape:

```
display:inline-block; padding:6px 16px; border-radius:4px;
font-size:12px; font-weight:700; text-transform:uppercase; letter-spacing:1px;
background:<COLOR>; color:#fff; margin-bottom:20px;
```

| Background                 | Count | Meaning                  |
| -------------------------- | ----- | ------------------------ |
| `#46b414` (NAMBA green)    | 8     | "open" / positive status |
| `var(--color-accent)` gold | 6     | "in-progress" / featured |
| `var(--color-text-light)`  | 4     | "future" / placeholder   |

These appear in `/projects/` cards, project status panels, and partner-tier annotations.

**Proposal: Promote (component) — `.status-pill` with modifiers.**

```css
.status-pill {
  display: inline-block;
  padding: 6px 16px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #fff;
  margin-bottom: 20px;
}

.status-pill--open    { background: #46b414; }
.status-pill--current { background: var(--color-accent); }
.status-pill--future  { background: var(--color-text-light); color: #333; }
```

---

## Cluster 8 — Trail difficulty count columns

**Hits:** 9 × `style="font-size:12px; text-align:center; display:inline-flex; flex-direction:column; align-items:center;"` plus 5 × `style="display:inline-flex; gap:10px; justify-content:center; flex-wrap:wrap; margin:8px 0;"`.

All in `_includes/trail-difficulty-counts.html` (the dicon icon + count column used in trail summary stats) and a couple of duplicates in `_layouts/where-to-ride.html`.

**Proposal: Promote (component) — single `.trail-counts` block.**

```css
.trail-counts {
  display: inline-flex;
  gap: 10px;
  justify-content: center;
  flex-wrap: wrap;
  margin: 8px 0;
}

.trail-counts > .trail-count-col {
  font-size: 12px;
  text-align: center;
  display: inline-flex;
  flex-direction: column;
  align-items: center;
}
```

`.trail-counts` already exists as a class on the wrapper at `_includes/trail-difficulty-counts.html:16` — we just need to move the inline styles into the stylesheet. Plus name the column-wrapper `<span>` and consolidate the `font-size:18px` icon-size rule too.

---

## Cluster 9 — `.phase-grid` duplicated across project pages

**Hits:** Inline `<style>` block defining `.phase-grid` (and `.phase-grid-item`, `.phase-grid-label`, related media queries) is **copy-pasted across 8 files**:

- `about/index.html` + `ja/about/index.html`
- `projects/twin-peaks/index.html` + JA
- `projects/grand-hirafu/index.html` + JA
- `projects/hanazono/index.html` + JA
- (Also `projects/yotei-360/index.html` + JA has a smaller variant)

Flagged in the launch punchlist as a Phase C candidate (Task A.12 notes).

**Proposal: Promote (component) — move to `template.css`.**

Define `.phase-grid` once with the full set of rules. Delete the 8 copies of the inline `<style>` block. ~80 lines of CSS removed per file × 8 = ~640 lines collapsed to ~80.

---

## Cluster 10 — `<style>` blocks that are already component-scoped

The remaining inline `<style>` blocks are mostly page-specific component CSS:

| File                                  | Block                       | Used elsewhere?           | Proposal     |
| ------------------------------------- | --------------------------- | ------------------------- | ------------ |
| `impact/index.html`                   | `.stat-card`, glossary cards | No                       | Leave inline |
| `artist-series/index.html`            | `.avatars` sticky nav        | No                       | Leave inline |
| `events/index.html`                   | Responsive media query        | No                       | Leave inline |
| `press/index.html`                    | `.logo-download`, `.partner-photo-nudge` | No            | Leave inline |
| `team/index.html`                     | Team grid                     | No                       | Leave inline |
| `_includes/contact-form.html`         | `.contact-form` form layout   | Yes (single include)     | Leave inline |
| `_includes/hero.html` + `hero-slides.html` | hero typography          | Yes (single includes)    | Leave inline |
| `_includes/partners-wall.html` + `partners-footer.html` | partner grid | Yes (single includes) | Leave inline |
| `_layouts/event.html`, `job.html`, `competition.html` | layout-scoped header CSS | No        | Leave inline |
| `where-to-ride/index.html` + signage/ | ride-card hover + map        | Partly                   | **See Cluster 11** |
| `partner/index.html`                  | sponsor logo grid             | No                       | Leave inline |

For now, these are fine where they are — single-page or single-include component CSS doesn't need to move to the global sheet. We can revisit individually if any of them grow.

---

## Cluster 11 — `.ride-card` styles duplicated across `/where-to-ride/` EN+JA

**Hits:** Inline `<style>` block in `where-to-ride/index.html` + `ja/where-to-ride/index.html` containing `.ride-card`, `.ride-card-image`, stretched-link hover, etc. Flagged in launch punchlist B.1 notes as a Phase C candidate.

**Proposal: Promote (component) — move to `template.css`.**

Single source of truth; both EN and JA pages just `class="ride-card"` and inherit. Same approach as `.phase-grid`.

---

## Cluster 12 — One-off and decorative inline styles (leave inline)

| Pattern                                 | Count | Rationale                                      |
| --------------------------------------- | ----- | ---------------------------------------------- |
| `style="background-image: url(...);"`   | ~12   | Per-instance image URL — must stay inline.     |
| `style="color: #225f06"` / `#fc0` / etc. (trails-table.html difficulty dots) | 4 | Already lives in an include; small + scoped. |
| `style="margin-top: 30px;"` (hero CTAs) | 2     | Single-use in hero include.                    |
| `style="opacity:0.5;"` etc.             | 4–6   | Single-use, no pattern.                        |
| `style="display:none;"` (botcheck hidden input, event-card ended badge) | 2 | JS-toggled; functional, not stylistic. |

These are correctly inline. No action.

---

## Promotion summary

| Cluster                         | Action            | Inline lines removed | New CSS lines | Net |
| ------------------------------- | ----------------- | -------------------- | ------------- | --- |
| 1. `module-title-wrap` width    | Fix default + 2 modifiers | ~203          | ~10           | −193 |
| 2. Lede paragraph               | `.section-lede` utility   | 145           | ~6            | −139 |
| 3. Rounded image + narrow wrap  | 2 utilities      | ~68                  | ~14           | −54  |
| 4. Donation / membership prices | 3 component classes | ~38              | ~12           | −26  |
| 5. Unstyled feature lists       | `.feature-list` + modifier | ~57         | ~22           | −35  |
| 6. Park-stats icon margins      | Scoped selector  | ~14                  | ~5            | −9   |
| 7. Status pill badges           | `.status-pill` + 3 modifiers | 18           | ~14           | −4 |
| 8. Trail difficulty counts      | `.trail-counts` + col      | ~14         | ~14           | 0    |
| 9. `.phase-grid` duplication    | Move to global   | ~640 (8× ~80)        | ~80           | −560 |
| 11. `.ride-card` duplication    | Move to global   | ~120 (2× ~60)        | ~60           | −60  |

**Total estimated inline removals:** ~1,317 inline-style lines / blocks.
**Total new utility CSS added:** ~250 lines (in `template.css`).
**Net codebase reduction:** ~1,000 lines.

---

## Open questions for C.4

1. **`.module-title-wrap` default change** — 650px → 900px flips the rule under any page that relied on the old default. Worth a visual spot-check on a couple of "narrow" pages (e.g. `/contact/`, `/code-conduct/`) before the refactor. Likely fine since 63 sites still want 650px, but let's confirm.
2. **Section lede mobile breakpoint** — should `.section-lede` add a `font-size: 115%` mobile rule, or keep 130% everywhere?
3. **`image.html` include** — add a `rounded` flag that emits `class="img-fluid-rounded"`, or just hand-class each call site?
4. **Refactor batching** — one PR per cluster, or one big PR? Recommendation: one commit per cluster, all on the same branch, so each step is independently revertable if a regression shows up in C.6.
5. **Inventory & clusters docs** — keep `_docs/css-audit-inventory.txt` + `_docs/css-audit-clusters.md` in the repo as a reference, or delete after C.5 ships? Recommendation: keep — useful for future audits.
