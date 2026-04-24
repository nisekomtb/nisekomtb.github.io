# NAMBA Website Overhaul — Design Spec

**Date:** 2026-04-21
**Scope:** Structural reorganisation + Tier 1 content + Where to Ride section
**Branch:** TBD (create before implementation)
**Reference:** `_docs/marketing-strategy.md`

---

## 1. Goal

Transform namba.ngo from a Twin Peaks-focused bike park site into a regional MTB destination and nonprofit authority site. The marketing strategy identifies three major gaps: no "Niseko MTB ecosystem" story, no discovery/conversion layer, and impact data buried in PDFs. This overhaul addresses all three.

## 2. Decisions Made

| Decision | Choice | Rationale |
|----------|--------|-----------|
| `/get-involved/` grouping | Retired — `/partner/`, `/join/`, `/donate/` become top-level | Each serves a distinct audience and conversion goal |
| `/about/` sub-pages | Top-level: `/projects/`, `/team/`, `/story/`, `/impact/` | Flat structure gives each section more weight |
| Blog URL | `/stories/` | Warmer than `/blog/`, fits NAMBA's narrative voice |
| Blog infrastructure | Same `_posts/` folder, `stories` category | Simple, uses existing Jekyll infrastructure |
| Shop URL | `/shop/` (unchanged) | Handles merch, memberships, donations, tickets — `/shop/` is the most universally understood term |
| Where to Ride map | Merged into `/where-to-ride/` hub page | Avoids a thin separate page; map is a section of the hub |
| Yotei 360 | `/projects/yotei-360/` only — no `/where-to-ride/` page until rideable | Can't ride there yet |
| Skills parks | Single listing page at `/where-to-ride/skills-parks/` | Multiple small facilities don't warrant individual pages |
| Alpine trails | Vision section on `/projects/` hub page | Not a concrete project yet |
| Redirects | `canonical` + `redirect: true` front matter pattern (meta refresh) | GitHub Pages doesn't support 301 redirects; existing pattern works |

## 3. Proposed Site Architecture

### Ride

| URL | Type | Description |
|-----|------|-------------|
| `/twin-peaks/` | Unchanged | Bike park main page (+ 6 existing sub-pages) |
| `/where-to-ride/` | **New** | Hub page: overview of ALL riding in Niseko, includes area map (Trailforks embed + static overview), season info, quick stats bar. Features Twin Peaks prominently with card linking to `/twin-peaks/`. |
| `/where-to-ride/grand-hirafu/` | **New** | Strong overview of Hirafu bike park: what's available, NAMBA's consulting role, trail count, difficulty range, lift access, link to resort site for operational detail |
| `/where-to-ride/hanazono/` | **New** | Hanazono trails overview: 4,500m lift-access flow trail (opening July 2026), skills park, link trail to Twin Peaks. Pre-opening: construction updates + timeline. Post-opening: full riding guide |
| `/where-to-ride/gravel/` | **New** | Gravel riding in Niseko area: key routes, Niseko Gravel event series, bike/equipment recommendations, Hokkaido cycling context |
| `/where-to-ride/skills-parks/` | **New** | Single listing page for all skills parks and pump tracks in the area. Each facility gets a section with location, photo, features, map pin |
| `/plan-your-trip/` | **New** | Visitor guide: bike rentals, accommodation (link sponsor partners), transport from Sapporo/CTS, when to visit, what to pack, ability guide, "beyond the bike" section (onsen, food, Niseko lifestyle). Primary landing page for Google Ads |

### About NAMBA

| URL | Type | Description |
|-----|------|-------------|
| `/about/` | **New** | NAMBA's full story: founding (6 friends in 2021), mission, Allegra partnership, growth timeline, year-by-year trail growth maps. Key reference for media and sponsors. Links to `/team/`, `/projects/`, `/impact/` |
| `/projects/` | **New** | Hub page: overview of ALL NAMBA projects, regional role, interconnected vision. Includes "The Vision" section covering alpine trails and future concepts. Links to individual project pages |
| `/projects/twin-peaks/` | **New** (replaces old redirect stub) | The flagship project story: build phases, satellite trail growth maps, funding history, 2022-present timeline, sponsor visibility. The existing page at this URL is just a redirect to `/twin-peaks/` — it gets replaced with entirely new content |
| `/projects/hanazono/` | **New** | Construction story, NAMBA's design role, opening timeline, signage system |
| `/projects/grand-hirafu/` | **New** | Consulting role, signage system, trail building |
| `/projects/yotei-360/` | **New** | Vision/planning stage: concept, route, future ambition. Newsletter signup for updates |
| `/team/` | **New** | Full 24-person board directory with photos, titles, affiliations. Extracted from homepage |
| `/story/` | **Deferred** | Tier 2 — interactive timeline / deeper narrative. Not in this branch |
| `/impact/` | **New** | Key stats from pitch deck: 11,500+ visitors, 100% trail funding, 20,000+ volunteer hours, 93% privately funded, 69% local business funded, 92% to trail building. Year-by-year growth data. Updated annually |
| `/press/` | **New** | Media resources: downloadable high-res photos, key facts, 2-3 story angles, media contact. Must be live before Pinkbike article |

### Content

| URL | Type | Description |
|-----|------|-------------|
| `/stories/` | **New** | Blog index page. Lists posts with `stories` category. Infrastructure setup only in this branch — first posts written separately |

### Get Involved

| URL | Type | Description |
|-----|------|-------------|
| `/partner/` | **Modified** | Enhanced partnership page. Moved from `/get-involved/partner/`. New content: impact data section, sponsor testimonial (Santa Cruz), updated tier table (Community Partners: Tanuki/Shika/Higuma/Trail), current trail sponsorship opportunities (Green Flow ¥8.45M, Lower Green Climb ¥13M), exposure proof (signage photos, media screenshots), proper inquiry form replacing mailto, downloadable pitch deck PDF |
| `/join/` | **Modified** | Membership page. Moved from `/get-involved/join/`. Content updates: sharpen impact messaging, show member count, frame around nintei NPO goal |
| `/donate/` | **Modified** | "Fund the Dig" redesign. Moved from `/get-involved/donate/`. Playful tangible cost tiers (¥500 "Fuel the Saw" through ¥100,000+ "Go Big"), running total, custom amount option, recurring donation option |
| `/thanks/` | **Modified** | Thank-you page. Moved from `/get-involved/thanks/`. Minimal changes |

### Community

| URL | Type | Description |
|-----|------|-------------|
| `/events/` | Unchanged | Event listing page |
| `/events/waiver/` | **Modified** | Event participation terms. Moved from `/soil-searching/waver/`. Note: fix typo "waver" → "waiver" |
| `/jobs/` | Unchanged | Job listing page |
| `/artist-series/` | **Modified** | Enhanced: more prominence, better connection to shop, feature Artist Series designs + Yotei Brewing collab |
| `/shop/` | Unchanged | Ecwid store |

### Utility (Unchanged)

`/code-conduct/`, `/privacy/`, `/terms/`, `/typography/`

## 4. Pages to Delete

Pages are either fully removed (no inbound link risk) or replaced with a thin redirect stub (for pages that may have inbound links or search indexing).

| URL | Reason | Action |
|-----|--------|--------|
| `/auction/` | Past event (noindex) | Fully remove (EN + JA) — no inbound link risk |
| `/raffle/` | Past event | Fully remove (EN + JA) — no inbound link risk |
| `/proposal/` | Replaced by `/partner/` | Replace with redirect stub → `/partner/` |
| `/get-involved/crowdfund/` | Past campaign (noindex) | Replace with redirect stub → `/donate/` |
| `/projects/twin-peaks/masterplan/` | Obsolete PDF viewer | Replace with redirect stub → `/projects/twin-peaks/` |

## 5. Redirects

All redirects use the existing `canonical` + `redirect: true` front matter pattern (meta refresh + canonical link). The old page file is kept as a thin redirect stub.

| From | To |
|------|----|
| `/get-involved/partner/` | `/partner/` |
| `/get-involved/join/` | `/join/` |
| `/get-involved/donate/` | `/donate/` |
| `/get-involved/thanks/` | `/thanks/` |
| `/get-involved/crowdfund/` | `/donate/` |
| `/soil-searching/waver/` | `/events/waiver/` |
| `/proposal/` | `/partner/` |
| `/projects/twin-peaks/masterplan/` | `/projects/twin-peaks/` |

Each redirect stub also needs a JA mirror (e.g. `/ja/get-involved/partner/` → `/ja/partner/`).

## 6. Consistent Project Page Layout

Each page under `/projects/` follows this structure:

1. **Hero image** of the site
2. **Status badge** — Open / Under Construction / Planning
3. **Overview** — what it is, NAMBA's role
4. **Timeline/phases** — key milestones, before/after
5. **Trail specs** — what's built, what's planned
6. **Funding/partners** — who made it possible (sponsor visibility)
7. **Gallery** — construction + finished trail photos
8. **CTA** — "Partner with us on future builds" → `/partner/`

## 7. Execution Order

Each task = implement → test locally → commit → get user input → next task. All pages are bilingual (EN + JA) unless noted.

### Phase 1 — Quick Moves (existing pages, new URLs)

| # | Task | Complexity |
|---|------|-----------|
| 1 | Move `/get-involved/join/` → `/join/` + redirect stub | Low |
| 2 | Move `/get-involved/thanks/` → `/thanks/` + redirect stub | Low |
| 3 | Move `/soil-searching/waver/` → `/events/waiver/` + redirect stub | Low |
| 4 | Delete `/auction/`, `/raffle/`, `/projects/twin-peaks/masterplan/` (EN + JA) | Low |
| 5 | Convert `/get-involved/crowdfund/` and `/proposal/` to redirect stubs | Low |

### Phase 2 — Simple New Pages

| # | Task | Complexity |
|---|------|-----------|
| 6 | Create `/team/` — extract team listing from homepage | Low-Medium |
| 7 | Create `/press/` — media resources page | Medium |
| 8 | Create `/impact/` — stats and data from pitch deck | Medium |
| 9 | Create `/stories/` — blog index page (infrastructure only) | Low |

### Phase 3 — Medium Pages

| # | Task | Complexity |
|---|------|-----------|
| 10 | Create `/about/` — NAMBA's story, mission, Allegra partnership | Medium-High |
| 11 | Move + enhance `/get-involved/partner/` → `/partner/` + redirect stub | High |
| 12 | Move + redesign `/get-involved/donate/` → `/donate/` ("Fund the Dig") + redirect stub | Medium-High |
| 13 | Enhance `/artist-series/` | Medium |

### Phase 4 — Big New Sections

| # | Task | Complexity |
|---|------|-----------|
| 14 | Create `/plan-your-trip/` | High |
| 15 | Create `/projects/` hub + `/projects/twin-peaks/` + `/projects/hanazono/` + `/projects/grand-hirafu/` + `/projects/yotei-360/` | High |
| 16 | Create `/where-to-ride/` hub + `/where-to-ride/grand-hirafu/` + `/where-to-ride/hanazono/` + `/where-to-ride/gravel/` + `/where-to-ride/skills-parks/` | High |

### Phase 5 — Homepage + Nav (separate task)

| # | Task | Complexity |
|---|------|-----------|
| 17 | Navigation overhaul | Medium-High |
| 18 | Homepage overhaul | High |

## 8. Bilingual Requirements

Every new or modified page requires both EN and JA versions:
- EN version at root path (e.g. `/partner/`)
- JA version at `/ja/` path (e.g. `/ja/partner/`)
- JA text tokenised with BudouX for `<wbr>` word boundaries
- JA front matter fields (`titleHtml`, `location`, etc.) tokenised with `<wbr>`
- Redirect stubs need JA mirrors too

## 9. Design Considerations

### Bike Niseko Migration

The marketing strategy describes a future "Bike Niseko" consumer brand. The `/where-to-ride/` and `/plan-your-trip/` sections should be built as self-contained sections (own navigation feel, not deeply integrated into NAMBA organisational pages) so they can be lifted out cleanly in future.

### SEO

Each new page targets distinct keyword clusters (detailed in marketing strategy §2). Key targets:
- `/where-to-ride/` → "mountain biking Niseko", "Niseko cycling"
- `/plan-your-trip/` → "Niseko summer activities", "mountain biking Japan"
- `/about/` + `/impact/` → brand queries, media research
- `/stories/` → long-tail content keywords
- `/partner/` → "Niseko sponsorship", "outdoor brand sponsorship Japan"

### Partner Page Restructuring

The homepage currently shows tiered sponsor logos (Higuma, Shika, Tanuki headings). The strategy recommends:
- **Homepage:** Single continuous logo strip, no tier dividers (all partners, ordered by tier level)
- **`/partner/` page:** Full tiered breakdown with headings for prospective partners evaluating tiers

## 10. Ecwid Shop Consolidation

Currently multiple pages embed the full Ecwid shop plugin (events, competitions, etc.). This overhaul consolidates Ecwid usage:

- **`/shop/`** becomes the only page with the full Ecwid storefront
- **Other pages** (events, competitions, membership, donations) either:
  - Link directly to the relevant product in `/shop/`, or
  - Use a lightweight Ecwid product widget for add-to-cart inline (no full store embed)
- Audit all layouts and pages for Ecwid embed usage and migrate each instance

This reduces page weight, simplifies maintenance, and creates a single source of truth for the store.

## 11. Image Optimisation

### Size audit
Audit all images in `/assets/images/` for oversized files and undersized display. Flag images that are significantly larger than their rendered dimensions and images that are too small for their containers (causing blur on retina displays).

### WebP conversion
Convert images to WebP for performance, using `<picture>` elements with original format fallback to protect already-indexed image URLs:

```html
<picture>
  <source srcset="/assets/images/trails/header.webp" type="image/webp">
  <img src="/assets/images/trails/header.jpg" alt="...">
</picture>
```

This serves WebP to modern browsers (99%+) while keeping original JPG/PNG URLs alive for Google Images indexing. Over time, Google re-indexes the WebP versions naturally.

Consider creating a reusable `_includes/image.html` partial to standardise this pattern across the site.

### When to do this
Image optimisation is a cross-cutting concern — run the audit early (Phase 1-2) and apply fixes incrementally as pages are touched during the overhaul. New pages should use the `<picture>` pattern from the start.

## 12. SEO Baseline from Google Search Console

Before making changes, download Google Search Console data (clicks, impressions, CTR, average position) for all current pages. This provides:

- **A baseline** to measure the overhaul's SEO impact
- **Data for redirect decisions** — pages with significant search traffic need careful redirects
- **Keyword insights** — what queries already drive traffic, informing content for new pages
- **Low-hanging SEO wins** — pages ranking on page 2 that could be boosted with content improvements

**When:** Run this as an early step before Phase 1 begins. Review the data to validate or adjust the execution order (e.g., if a page we planned to delete actually gets significant traffic, reconsider).

## 13. Out of Scope (Deferred)

| Item | Deferred to |
|------|-------------|
| `/story/` (interactive timeline) | Tier 2 — future branch |
| `/gallery/` (photo/video showcase) | Tier 2 — future branch |
| Enhanced Twin Peaks individual trail pages | Tier 2 — future branch |
| `/newsletter/` archive | Tier 3 — future branch |
| `/about/partners/` (partner showcase/directory) | Tier 3 — future branch |
| Email signup integration (Mailchimp) | Separate task — requires account setup |
| Additional language support (Chinese, Korean) | Tier 2-3 |
| Custom interactive map (Mapbox/Leaflet) | 2027 — Bike Niseko |
| Navigation overhaul detail design | Phase 5 — designed once all pages exist |
| Homepage overhaul detail design | Phase 5 — separate brainstorming session |
