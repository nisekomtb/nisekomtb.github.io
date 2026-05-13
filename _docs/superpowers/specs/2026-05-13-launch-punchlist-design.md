---
title: Launch Punch-List Design Spec
date: 2026-05-13
branch: overhaul/website-restructure
scope: Polish + final-sweep work to bring the overhaul branch to launch-ready
reference:
  - _docs/superpowers/specs/2026-04-21-website-overhaul-design.md
  - _docs/superpowers/plans/2026-04-21-website-overhaul.md
  - _docs/marketing-strategy.md
  - _docs/seo-baseline-2026-04/
---

# NAMBA Launch Punch-List: Design Spec

## 1. Goal

The April overhaul restructured the site (new IA, new project layout, new Where-to-Ride hub, new bilingual conventions). What remains is the launch-readiness polish: image replacement, style alignment across pages, text passes, decisions on a few open questions, then a final humanize/SEO/JA sweep, then a site-wide CSS audit.

This spec captures the structure, sequencing, and decisions. The matching plan doc at `_docs/superpowers/plans/2026-05-13-launch-punchlist.md` is the tickable checklist we work from.

## 2. Decisions Made (in brainstorm)

| Decision | Choice | Rationale |
|---|---|---|
| Sequencing | Phased: polish all pages, then sweep all | Cleaner mental model; defers humanizer install; SEO reads the final site shape at once |
| Doc structure | Single linear phased plan | Unambiguous "what's next" answer; matches cross-session resume workflow |
| Open "maybes" | Inline `Decide:` notes under each page | Co-located with context; resolved when we get to the page |
| Spec/Plan split | Spec here, plan in `plans/` | Follows existing pattern; spec is the reference, plan is the working doc |
| CSS audit | Phase C, after Phase B | Global pattern detection is fundamentally different from per-page polish |

## 3. Document Architecture

Two documents:

- **Spec** (this file): `_docs/superpowers/specs/2026-05-13-launch-punchlist-design.md`. Written once. Captures phases, sequencing, decisions, out-of-scope items.
- **Plan**: `_docs/superpowers/plans/2026-05-13-launch-punchlist.md`. The tickable checklist. Edited as we work. Each item has `Notes:` and `Decide:` slots.

## 4. Phases

| Phase | Scope | Exit gate |
|---|---|---|
| Phase 0 | Site-wide quick wins + launch-time decisions | Globals fixed; nav decisions locked |
| Phase A | Per-page polish, page-by-page, Home last | All pages structurally and visually ready |
| Phase B | Install humanizer, per-page sweep (humanize EN, SEO, JA re-parity) | Copy launch-ready, SEO optimised, JA in parity |
| Phase C | Site-wide CSS audit and promotion to brand template | No unnecessary inline CSS, brand stylesheet is single source |

## 5. Phase 0: Global Quick Wins

| ID | Task | Notes |
|---|---|---|
| 0.1 | Replace horns emoji image, set as favicon site-wide | One asset choice drives both. Affects header, Home, anywhere else referenced. Needs Tom to provide candidate marks; I can suggest concepts. |
| 0.2 | Fix Specialized sponsor name on `/partner/` | EN + JA. Confirm exact current string and target string at work time. |
| 0.3 | Language switcher nav background colour | CSS fix to match nav background. Global include change. |
| 0.4 | Decide handling for `/stories/` at launch | Options: keep with placeholder, hide from nav, remove route. Shapes nav. |
| 0.5 | Move `/dirty-dames/` above `/press/` in nav | Nav include change. Mirror EN + JA. |

## 6. Phase A: Per-Page Polish

Per-page workflow (one cycle per item):

1. User asks "what's next?"
2. I pull the next unticked item, read the page, propose changes + open questions
3. User answers questions; drops assets in `assets/images/_triage/` if needed
4. I implement (EN + JA in same change)
5. Tick the item, commit, move on

### Ordered page list

The full per-page bullets live in the plan doc. Pages, in working order:

| # | Page | Notable items |
|---|---|---|
| A.1 | `/where-to-ride/` (hub) | Stats check; map pins (correct locations + clickable: popup or scroll); ride area descriptions; remove routes from gravel section; fix double trip-planning-guide link at bottom |
| A.2 | `/twin-peaks/` | Align to new style; gallery (check if template already has one); remove "navigating around park" section and link to `/where-to-ride/signage/` instead. `Decide:` change bg image? |
| A.3 | `/where-to-ride/grand-hirafu/` | Rename to Grand Hirafu Bike Park everywhere; update Trailforks embed; update trail list; section padding; gallery images |
| A.4 | `/where-to-ride/hanazono/` | Rename to Hanazono Bike Park everywhere; update Trailforks embed; update trails + specs; gallery images |
| A.5 | `/where-to-ride/gravel/` | Text check; placeholder then gallery images |
| A.6 | `/where-to-ride/skills-parks/` | Text check; add images. `Decide:` add facility links? |
| A.7 | `/where-to-ride/annupuri/` | Not in original Tom list. `Decide:` already polished, or needs same pass as siblings? |
| A.8 | `/plan-your-trip/` | Replace images; text check |
| A.9 | `/about/` | Add images; text check. `Decide:` card hover style outline vs full fill |
| A.10 | `/team/` | Final text pass. `Decide:` add sub-committee volunteers (Hiromi, Elle, Hugo)? |
| A.11 | `/projects/` (hub) | Rename projects (per overhaul); replace images; consider adding unified signage section. `Decide:` switch to resort icons? |
| A.12 | `/projects/twin-peaks/` | Phase photos (Google Maps or similar): make larger so detail is visible; replace images; text check; convert timeline to about/impact-page style |
| A.13 | `/projects/grand-hirafu/` | Audit gap vs Twin Peaks page; unify style (phase maps, timeline); text check; replace images |
| A.14 | `/projects/hanazono/` | Same as A.13 |
| A.15 | `/projects/yotei-360/` (Yotei Loop) | Same template as siblings, lighter on detail (still concept stage): one or two photos, minimal timeline. `Decide:` confirm rename to "Yotei Loop" everywhere (folder stays `yotei-360`) |
| A.16 | `/impact/` | Final text check; check if any data descriptions are missing; pull keyword-search increases from GA if available |
| A.17 | `/dirty-dames/` | Add images; check data |
| A.18 | `/press/` | Formatting check (list bullet issue); fact check; image replacement |
| A.19 | `/events/` (index page) | Polish only. Upcoming/past split is out of scope (separate future task) |
| A.20 | Single event page layout | Check new formatting and style; resolve description duplication between top metadata and first paragraph of body. Applies to all events via shared `event` layout |
| A.21 | `/partner/` | Chris Selig: Santa Cruz to Norco; last text check |
| A.22 | `/join/` | Replace images; text check; check graph data; make memberships subscriptions in Ecwid (external action: flag, do not implement in code) |
| A.23 | `/donate/` | Final text check. `Decide:` too many cards? `Decide:` images instead of icons, or add an image or two |
| A.24 | `/jobs/` | Final text check |
| A.25 | Single job page layout | Same fixes as A.20 (description duplication and new style) |
| A.26 | `/shop/` (incl. artist series) | Final pass with new style. Ecwid: upload donation + membership product images (external action: flag, do not implement in code) |
| A.27 | `/` (Home) | Biggest. Hero image + hero video work is deferred to its own brainstorm/spec. This item is the trigger to start that next conversation, not the work itself. |

## 7. Phase B: Humanize + SEO + JA Re-Parity Sweep

### Prereqs (do once, at Phase B start)

| ID | Task |
|---|---|
| B.0.1 | Install humanizer skill from `https://github.com/blader/humanizer`. Prompt Tom before any humanize work begins. |
| B.0.2 | Gather SEO inputs (see below) |
| B.0.3 | Confirm same page order as Phase A |

### SEO analysis inputs

| Input | Source | Status |
|---|---|---|
| GSC export (queries, pages, devices) | `_docs/seo-baseline-2026-04/` | Have it |
| Keyword targets per page | `_docs/marketing-strategy.md` §2 | Have it |
| GA4 organic keyword data | Google Analytics export | Tom to provide if available |
| Current per-page meta/H1 audit | `claude-seo:seo-audit` | Run at Phase B start |
| AI search citation visibility | `claude-seo:seo-geo` | Run at Phase B start (LLM citations, llms.txt) |
| Live SERP for top targets | DataForSEO MCP (if installed) | Optional. Tom to flag if wanted |

### Per-page Phase B cycle

For each page in the Phase A order:

- [ ] Humanize EN copy (humanizer skill)
- [ ] SEO pass: meta description, title, H1, heading hierarchy, internal links (2+ per page), schema, alt text
- [ ] JA re-parity: translate any EN deltas to JA; confirm BudouX tokenisation on visible JA strings

JA re-parity is a *targeted diff* against changed EN passages, not a full retranslation.

## 8. Phase C: Site-Wide CSS Audit and Promotion

| ID | Task |
|---|---|
| C.1 | Inventory inlined `<style>` blocks and `style="…"` attributes across all pages (EN + JA mirrors) |
| C.2 | Cluster repeated patterns (card hover, section padding, heading scale, etc.) |
| C.3 | Propose which patterns become shared utility classes vs component classes in brand stylesheet |
| C.4 | Tom approves promotion list |
| C.5 | Refactor pages to use shared classes; remove inlined duplicates |
| C.6 | Visual regression spot-check on representative pages |

Exit gate: zero unnecessary inline styles, brand stylesheet is the single source of truth for repeated patterns.

## 9. Workflow Conventions

- **Bilingual parity throughout Phase A.** Every EN edit gets mirrored to its JA twin in the same change (project rule from `.claude/rules/bilingual.md`). Phase B's JA re-parity step is a recheck against humanize/SEO deltas, not deferred translation.
- **Images workflow.** When a page needs replacements, I list what's needed; Tom drops candidates into `assets/images/_triage/`; I pick, process (WebP + responsive sizes), and place. One page at a time.
- **"Check style" means.** Audit the page against the new style established on About, Impact, Partner, Jobs, Shop. Flag mismatches; decide whether to bring the page up to the new style or update the new style. Resolution recorded in the page's `Notes:` section.
- **Commits.** One commit per ticked item (or per coherent slice if an item is large). No `Co-Authored-By` trailer. No em dashes in copy.
- **Resume protocol.** New session: Tom says "what's next?"; I read the plan doc, propose the next unticked item, ask page-specific clarifications, then work.
- **Decisions.** Inline `Decide:` notes in the plan doc. Resolution recorded in the same item's `Notes:` line before ticking.

## 10. Out of Scope (Deferred)

Captured here so we do not lose them, but explicitly not worked in this branch.

| Item | Why deferred | Where captured |
|---|---|---|
| Split `/events/` into upcoming + past sections | Tom's call: separate task | This section only |
| Home hero image + hero video | Big, needs its own brainstorm and spec | A.27 references it; the work is a future spec |
| Membership to Ecwid subscriptions | Ecwid-side config, not site code | A.22 flag as external action |
| Ecwid product images for memberships + donations | Ecwid-side asset upload | A.26 flag as external action |
| Future stories content | Decision at 0.4 may park the section entirely | This section + 0.4 |

## 11. Open Decisions Log (will be resolved during Phase 0 or in the relevant Phase A page)

- **0.4** `/stories/` handling for launch (placeholder, hidden, removed)
- **A.2** Twin Peaks bg image: change?
- **A.6** Skills parks: add facility links?
- **A.7** `/where-to-ride/annupuri/`: needs same polish as siblings?
- **A.9** About card hover: outline vs full fill
- **A.10** Team: add sub-committee volunteers (Hiromi, Elle, Hugo)?
- **A.11** Projects hub: switch to resort icons?
- **A.15** Yotei Loop rename: confirm
- **A.23** Donate: too many cards? Images instead of icons?

## 12. Success Criteria

The branch is launch-ready when:

- [ ] All Phase 0 globals applied site-wide
- [ ] All Phase A page items ticked (including Home, or Home trigger to next spec)
- [ ] All Phase B items ticked for every page (humanize + SEO + JA parity)
- [ ] Phase C: no unnecessary inline CSS; brand stylesheet is the shared source
- [ ] Every EN page has a JA twin with parity
- [ ] No broken internal links, no orphan pages, sitemap clean
