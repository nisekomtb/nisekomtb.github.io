# Website Overhaul Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform namba.ngo from a Twin Peaks-focused site into a regional MTB destination and nonprofit authority site.

**Architecture:** Jekyll + GitHub Pages site. All pages are static HTML with Liquid templating. Every page requires EN + JA versions. Redirects use `canonical` + `redirect: true` front matter (meta refresh). Content follows existing `t3-section-wrap` / `section` / `module-title-wrap` markup patterns.

**Tech Stack:** Jekyll, HTML, CSS, Vanilla JS, Ecwid (shop only), BudouX (JA tokenisation)

**Spec:** `_docs/superpowers/specs/2026-04-21-website-overhaul-design.md`

---

## Conventions (reference for all tasks)

### Creating a redirect stub

Replace the old page content with minimal front matter. Both EN and JA versions needed:

```yaml
---
title: [Original title]
canonical: [target-path-without-leading-slash]
redirect: true
noindex: true
---
```

The `base.html` layout (lines 36-40) reads `canonical` and `redirect` to emit `<link rel="canonical">` and `<meta http-equiv="refresh">`.

### Creating a new bilingual page

1. Create EN version at `[path]/index.html` with front matter (`title`, `description`, optional `masthead`, `og`)
2. Create JA version at `ja/[path]/index.html` with JA `title` and `description`
3. JA body text: run through BudouX (`budoux --lang ja --html "text"`) then strip outer `<span>` tag
4. JA front matter visible fields: tokenise with `<wbr>` tags
5. Use `{% if page.lang == "en" %}...{% else %}...{% endif %}` in includes for bilingual text

### Standard page markup skeleton

```html
---
title: Page Title
description: Meta description under 160 chars with target keyword
permalink: /url-slug/
---
<div class="t3-section-wrap">
  <div class="section">
    <div class="module-title-wrap" style="max-width:900px;">
      <h3 class="module-title ja-animate" data-animation="move-from-bottom" data-delay="200">
        Section Heading
      </h3>
      <div class="features-desc ja-animate" data-animation="move-from-bottom" data-delay="400">
        <div style="font-size:130%;">
          <span>Content paragraph</span>
        </div>
      </div>
    </div>
  </div>
</div>
```

### Testing

```bash
bundle exec jekyll serve --baseurl="" --open-url
```

Check: page loads, no build errors, bilingual toggle works (EN ↔ JA), redirects fire, links work.

### Committing

Each task = one commit. Stage only the files for that task.

---

## Pre-Phase: SEO Baseline

### Task P1: Download Google Search Console baseline data

**Files:**
- None (data export from external tool)

- [x] **Step 1: Export GSC data**

Done — CSVs are in `_docs/seo-baseline-2026-04/`.

- [ ] **Step 2: Review data for redirect decisions**

Read the CSVs in `_docs/seo-baseline-2026-04/`. Check if any pages planned for deletion have significant search traffic. If so, flag before proceeding with Phase 1.

Key pages to validate: `/proposal/`, `/auction/`, `/raffle/`, `/get-involved/crowdfund/`. If any show meaningful impressions/clicks, reconsider deletion vs redirect.

---

## Pre-Phase: Image Audit

### Task P2: Audit image sizes and create optimisation plan

**Files:**
- None initially (audit only)

- [ ] **Step 1: Audit image file sizes**

```bash
find assets/images -type f \( -name "*.jpg" -o -name "*.png" -o -name "*.jpeg" \) -exec ls -lh {} \; | sort -k5 -h -r | head -30
```

Flag images over 500KB as candidates for optimisation.

- [ ] **Step 2: Create `_includes/image.html` partial**

Create a reusable include for the `<picture>` element pattern:

```html
{% comment %}
  Usage: {% include image.html src="/assets/images/path/image.jpg" alt="Description" %}
  If a .webp version exists at the same path, it will be served to supporting browsers.
{% endcomment %}
{% assign webp_src = include.src | replace: ".jpg", ".webp" | replace: ".png", ".webp" | replace: ".jpeg", ".webp" %}
<picture>
  <source srcset="{{ webp_src }}" type="image/webp">
  <img src="{{ include.src }}" alt="{{ include.alt }}"{% if include.class %} class="{{ include.class }}"{% endif %}{% if include.style %} style="{{ include.style }}"{% endif %} />
</picture>
```

- [ ] **Step 3: Commit the include**

```bash
git add _includes/image.html
git commit -m "Add image.html include — picture element with WebP fallback"
```

Note: WebP conversion of existing images and migration of existing `<img>` tags to use this include happens incrementally as pages are touched. New pages should use `{% include image.html %}` from the start.

---

## Phase 0: Branch Setup

### Task 0: Create feature branch

**Files:**
- None (git operation only)

- [ ] **Step 1: Create and switch to feature branch**

```bash
git checkout -b overhaul/website-restructure
```

- [ ] **Step 2: Verify clean state**

```bash
git status
```

Expected: clean working tree on new branch

---

## Phase 1 — Quick Moves

### Task 1: Move `/get-involved/join/` → `/join/`

**Files:**
- Create: `join/index.html` (copy from `get-involved/join/index.html`)
- Create: `ja/join/index.html` (copy from `ja/get-involved/join/index.html`)
- Modify: `get-involved/join/index.html` → redirect stub
- Modify: `ja/get-involved/join/index.html` → redirect stub

- [ ] **Step 1: Create `/join/` EN page**

Copy `get-involved/join/index.html` to `join/index.html`. Add explicit permalink and update the Ecwid post-purchase redirect URL:

In the new `join/index.html`, add to front matter:
```yaml
permalink: /join/
```

And update the Ecwid redirect from:
```js
window.ec.config.custom_redirect_after_purchase = 'https://www.namba.ngo/get-involved/thanks';
```
to:
```js
window.ec.config.custom_redirect_after_purchase = 'https://www.namba.ngo/thanks';
```

- [ ] **Step 2: Create `/ja/join/` JA page**

Copy `ja/get-involved/join/index.html` to `ja/join/index.html`. Add permalink and update Ecwid redirect:

```yaml
permalink: /ja/join/
```

Update redirect from `'/ja/get-involved/thanks'` to `'/ja/thanks'`.

- [ ] **Step 3: Convert old EN page to redirect stub**

Replace the entire content of `get-involved/join/index.html` with:

```html
---
title: Become a member
canonical: join/
redirect: true
noindex: true
---
```

- [ ] **Step 4: Convert old JA page to redirect stub**

Replace the entire content of `ja/get-involved/join/index.html` with:

```html
---
title: 仲間になろう
canonical: ja/join/
redirect: true
noindex: true
---
```

- [ ] **Step 5: Build and verify**

```bash
bundle exec jekyll build
```

Open `_site/get-involved/join/index.html` — confirm it contains `<meta http-equiv="refresh"` pointing to `/join/`.
Open `_site/join/index.html` — confirm it renders the membership page.

- [ ] **Step 6: Commit**

```bash
git add join/ ja/join/ get-involved/join/index.html ja/get-involved/join/index.html
git commit -m "Move /get-involved/join/ to /join/ with redirect stub"
```

---

### Task 2: Move `/get-involved/thanks/` → `/thanks/`

**Files:**
- Create: `thanks/index.html`
- Create: `ja/thanks/index.html`
- Modify: `get-involved/thanks/index.html` → redirect stub
- Modify: `ja/get-involved/thanks/index.html` → redirect stub

- [ ] **Step 1: Create `/thanks/` EN page**

Copy `get-involved/thanks/index.html` to `thanks/index.html`. Add permalink:

```yaml
permalink: /thanks/
```

- [ ] **Step 2: Create `/ja/thanks/` JA page**

Copy `ja/get-involved/thanks/index.html` to `ja/thanks/index.html`. Add permalink:

```yaml
permalink: /ja/thanks/
```

- [ ] **Step 3: Convert old EN page to redirect stub**

```html
---
title: Thanks legend
canonical: thanks/
redirect: true
noindex: true
---
```

- [ ] **Step 4: Convert old JA page to redirect stub**

```html
---
title: ありがとうございます
canonical: ja/thanks/
redirect: true
noindex: true
---
```

- [ ] **Step 5: Build and verify**

```bash
bundle exec jekyll build
```

Confirm redirect in `_site/get-involved/thanks/index.html` and page renders at `_site/thanks/index.html`.

- [ ] **Step 6: Commit**

```bash
git add thanks/ ja/thanks/ get-involved/thanks/index.html ja/get-involved/thanks/index.html
git commit -m "Move /get-involved/thanks/ to /thanks/ with redirect stub"
```

---

### Task 3: Move `/soil-searching/waver/` → `/events/waiver/`

**Files:**
- Create: `events/waiver/index.html`
- Create: `ja/events/waiver/index.html`
- Modify: `soil-searching/waver/index.html` → redirect stub
- Modify: `ja/soil-searching/waver/index.html` → redirect stub (if JA version exists)

- [ ] **Step 1: Create `/events/waiver/` EN page**

Copy `soil-searching/waver/index.html` to `events/waiver/index.html`. Update front matter:

```yaml
---
title: Event Participation Terms
description: Please read these terms carefully before signing up to participate in a NAMBA event.
permalink: /events/waiver/
---
```

Also fix the `<h2>Waver</h2>` heading to `<h2>Waiver</h2>` (typo).

- [ ] **Step 2: Create `/ja/events/waiver/` JA page**

Check if `ja/soil-searching/waver/index.html` exists. If yes, copy it to `ja/events/waiver/index.html` and add `permalink: /ja/events/waiver/`. If no JA version exists, create one with translated front matter and the same English content body (waiver terms can stay in English for legal clarity).

- [ ] **Step 3: Convert old page(s) to redirect stub(s)**

`soil-searching/waver/index.html`:
```html
---
title: Event Participation Terms
canonical: events/waiver/
redirect: true
noindex: true
---
```

Same pattern for JA version if it exists.

- [ ] **Step 4: Build and verify**

```bash
bundle exec jekyll build
```

- [ ] **Step 5: Commit**

```bash
git add events/waiver/ ja/events/waiver/ soil-searching/ ja/soil-searching/
git commit -m "Move /soil-searching/waver/ to /events/waiver/ (fix typo)"
```

---

### Task 4: Delete obsolete pages

**Files:**
- Delete: `auction/index.html`, `ja/auction/index.html`
- Delete: `raffle/index.html`, `ja/raffle/index.html`
- Delete: `projects/twin-peaks/masterplan/index.html`, `ja/projects/twin-peaks/masterplan/index.html` (if exists — replace with redirect stub if it might have inbound links)

- [ ] **Step 1: Convert auction to redirect stub**

SEO data shows 12 clicks, 748 impressions — redirect rather than delete.

Replace `auction/index.html` with:
```html
---
title: Turbo Levo SL LTD Blind Auction
canonical: shop/
redirect: true
noindex: true
---
```
Same for `ja/auction/index.html` (→ `ja/shop/`).

- [ ] **Step 2: Convert raffle to redirect stub**

SEO data shows 27 clicks, 1,504 impressions — redirect rather than delete.

Replace `raffle/index.html` with:
```html
---
title: Summer Raffle 2025
canonical: events/
redirect: true
noindex: true
---
```
Same for `ja/raffle/index.html` (→ `ja/events/`).

- [ ] **Step 3: Convert masterplan to redirect stub**

Replace `projects/twin-peaks/masterplan/index.html` with:

```html
---
title: Twin Peaks Masterplan
canonical: projects/twin-peaks/
redirect: true
noindex: true
---
```

Same for JA version if it exists.

- [ ] **Step 4: Build and verify**

```bash
bundle exec jekyll build
```

Confirm no broken builds. Spot-check that deleted pages no longer exist in `_site/`.

- [ ] **Step 5: Commit**

```bash
git add -A auction/ ja/auction/ raffle/ ja/raffle/ projects/twin-peaks/masterplan/ ja/projects/twin-peaks/masterplan/
git commit -m "Delete obsolete pages: auction, raffle; redirect masterplan"
```

---

### Task 5: Convert `/get-involved/crowdfund/` and `/proposal/` to redirect stubs

**Files:**
- Modify: `get-involved/crowdfund/index.html` → redirect to `/donate/`
- Modify: `ja/get-involved/crowdfund/index.html` → redirect to `/ja/donate/`
- Modify: `proposal/index.html` → redirect to `/partner/`
- Modify: `ja/proposal/index.html` → redirect to `/ja/partner/`

- [ ] **Step 1: Convert crowdfund EN to redirect stub**

Replace `get-involved/crowdfund/index.html` with:

```html
---
title: Twin Peaks Crowdfunding
canonical: donate/
redirect: true
noindex: true
---
```

- [ ] **Step 2: Convert crowdfund JA to redirect stub**

Replace `ja/get-involved/crowdfund/index.html` with:

```html
---
title: ツインピークス クラウドファンディング
canonical: ja/donate/
redirect: true
noindex: true
---
```

- [ ] **Step 3: Convert proposal EN to redirect stub**

Replace `proposal/index.html` with:

```html
---
title: Our Proposal
canonical: partner/
redirect: true
noindex: true
---
```

- [ ] **Step 4: Convert proposal JA to redirect stub**

Replace `ja/proposal/index.html` with:

```html
---
title: 私たちの理念
canonical: ja/partner/
redirect: true
noindex: true
---
```

- [ ] **Step 5: Build and verify**

```bash
bundle exec jekyll build
```

- [ ] **Step 6: Commit**

```bash
git add get-involved/crowdfund/ ja/get-involved/crowdfund/ proposal/ ja/proposal/
git commit -m "Convert crowdfund and proposal pages to redirect stubs"
```

---

## Phase 2 — Simple New Pages

### Task 6: Create `/team/`

**Files:**
- Create: `team/index.html`
- Create: `ja/team/index.html`

This page extracts the team listing from the homepage. It uses `_data/team.yml` (already exists with 22 members) plus the 3 leaders (Paul Wright, Shunichi Kimura, Ross Carty) who are currently hardcoded in `index.html`.

- [ ] **Step 1: Create EN team page**

Create `team/index.html`:

```html
---
title: Our Team
description: Meet the board of NAMBA, the Niseko Area Mountain Bike Association — a diverse group of 24 passionate people building Asia's premier mountain bike destination.
permalink: /team/
masthead:
  img: /assets/images/bg/bg-header-twinpeaks.jpg
---
<div class="t3-section-wrap">

  <div class="section">
    <div class="module-title-wrap" style="max-width:900px;">
      <div class="features-desc ja-animate" data-animation="move-from-bottom" data-delay="200">
        <div style="font-size:130%;">
          <span>Founded in 2021 by six passionate mountain bikers, NAMBA is now led by a diverse board of 24 — men, women, Japanese, Western, MTB and non-MTB backgrounds, united by a shared vision for Niseko.</span>
        </div>
      </div>
    </div>
  </div>

  <div class="section">
    <div class="module-title-wrap" style="max-width:900px;">
      <h3 class="module-title ja-animate" data-animation="move-from-bottom" data-delay="200">Our Leaders</h3>
    </div>

    <div class="leaders">
      <div class="member ja-animate" data-animation="move-from-right" data-delay="400">
        <div class="inner">
          <div class="img"><img src="/assets/images/team/paulw.jpg" /></div>
          <div class="desc">
            <p><span>Paul Wright</span>, NAMBA President</p>
            <p class="title">General Manager at Park Hyatt Niseko Hanazono</p>
            <em>"NAMBA is a truly exciting development for the Niseko area. Resort towns the world over have recognized the potential and success mountain biking can bring to their communities and local businesses as a complimentary summer activity to winter and all season resort destinations. I am inspired by the work which the NAMBA co-founders and team have achieved in such a short period of time and I look forward to seeing the vision of NAMBA become a reality, with Niseko becoming a globally recognized Mountain Bike destination."</em>
          </div>
        </div>
      </div>
      <div class="member ja-animate" data-animation="move-from-right" data-delay="600">
        <div class="inner">
          <div class="img"><img src="/assets/images/team/shunichi.jpg" /></div>
          <div class="desc">
            <p><span>Shunichi Kimura</span>, NAMBA Vice President</p>
            <p class="title">Kimura restaurant Owner &amp; Yotei Niseko Cycling Association Vice President</p>
            <em>"With the advent of e-MTBs, mountain biking is set to become even more accessible and fun for all. The development of Niseko's trail network will expand the winter backcountry culture into Niseko's lush &amp; mild summers. Looking forward to bringing the community &amp; our visitors trails that are close to local towns and ski resorts enabling everyone to enjoy themselves and the natural environment."</em>
          </div>
        </div>
      </div>
      <div class="member ja-animate" data-animation="move-from-right" data-delay="800">
        <div class="inner">
          <div class="img"><img src="/assets/images/team/ross.jpg" /></div>
          <div class="desc">
            <p><span>Ross Carty</span>, Co-founder &amp; NAMBA Vice President</p>
            <p class="title">NOASC Adventures Founder / Owner &amp; Niseko's Foreign Business Pioneer</p>
            <em>"I first came to Niseko 30+ years ago and have personally witnessed Niseko's growth from a sleepy farmtown to one of the world's premier winter destinations. Mountain biking is the area's new frontier; the sport's potential here is truly untapped and has the power to do for summer what snowsports have done for winter."</em>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="section">
    <div class="module-title-wrap" style="max-width:900px;">
      <h3 class="module-title ja-animate" data-animation="move-from-bottom" data-delay="200">Our Board</h3>
    </div>

    <div class="team">
      {% for member in site.data.team %}
        {% if page.lang == "en" %}
          {% assign name = member.name %}
          {% assign title = member.title %}
          {% assign sub_title = member.sub_title %}
        {% else %}
          {% assign name = member.ja.name | default: member.name %}
          {% assign title = member.ja.title | default: member.title %}
          {% assign sub_title = member.ja.sub_title | default: member.sub_title %}
        {% endif %}
        <div class="member ja-animate" data-animation="move-from-right" data-delay="item-{{ forloop.index0 }}">
          <div class="inner">
            <div class="img"><img src="{{ member.image }}" alt="{{ name }}" /></div>
            <div class="desc">
              <p>{{ name }}</p>
              <p>{{ title }}</p>
              {% if sub_title %}<p>{{ sub_title }}</p>{% endif %}
            </div>
          </div>
        </div>
      {% endfor %}
    </div>
  </div>

</div>
```

Note: include the same CSS for `.leaders`, `.team`, `.member` that's currently in `index.html` — add it in a `<style>` block at the top of the page (copy from `index.html` lines 18-163).

- [ ] **Step 2: Create JA team page**

Create `ja/team/index.html` with the same structure but:
- Front matter: `title: チーム`, `description:` in Japanese, `permalink: /ja/team/`
- Leader quotes: translate to Japanese (or keep English quotes with Japanese introductions)
- The `{% for %}` loop already handles JA via the `page.lang` conditional above

- [ ] **Step 3: Build and verify**

```bash
bundle exec jekyll serve --baseurl="" --open-url
```

Check `/team/` loads, team members display, `/ja/team/` loads with JA names/titles. Check language toggle works.

- [ ] **Step 4: Commit**

```bash
git add team/ ja/team/
git commit -m "Add /team/ page — extract team listing from homepage"
```

---

### Task 7: Create `/press/`

**Files:**
- Create: `press/index.html`
- Create: `ja/press/index.html`

- [ ] **Step 1: Create EN press page**

Create `press/index.html`:

```html
---
title: Press & Media
description: Media resources for the Niseko Area Mountain Bike Association — high-res photos, key facts, story angles, and media contact.
permalink: /press/
masthead:
  img: /assets/images/bg/bg-header-twinpeaks.jpg
---
<div class="t3-section-wrap">

  <div class="section">
    <div class="module-title-wrap" style="max-width:900px;">
      <h3 class="module-title ja-animate" data-animation="move-from-bottom" data-delay="200">
        Media Resources
      </h3>
      <div class="features-desc ja-animate" data-animation="move-from-bottom" data-delay="400">
        <div style="font-size:130%;">
          <span>NAMBA is building Japan's largest free-access mountain bike trail network in Niseko, Hokkaido. Below you'll find key facts, story angles, and downloadable assets for media coverage.</span>
        </div>
      </div>
    </div>
  </div>

  <div class="section">
    <div class="module-title-wrap" style="max-width:900px;">
      <h3 class="module-title ja-animate" data-animation="move-from-bottom" data-delay="200">Key Facts</h3>
    </div>
    <div class="module-title-wrap" style="max-width:900px;">
      <div class="features-desc ja-animate" data-animation="move-from-bottom" data-delay="400">
        <div style="font-size:130%;">
          <ul style="list-style-image: url('/assets/images/logos/bullet.png'); line-height:2.2;">
            <li><strong>21km+</strong> of free, professionally designed mountain bike trails</li>
            <li><strong>11,500+ visitors</strong> in 2025 (~48% growth year-on-year)</li>
            <li><strong>20,000+ volunteer hours</strong> donated by the community</li>
            <li><strong>100% trail funding success rate</strong> — every trail community-funded</li>
            <li><strong>Swiss-designed trails</strong> in partnership with Allegra Tourismus</li>
            <li><strong>Multi-park network:</strong> Twin Peaks + Grand Hirafu + Hanazono (opening July 2026)</li>
            <li><strong>Pinkbike Trail of the Month</strong> feature confirmed</li>
            <li>Founded in 2021 by 6 mountain bikers — now a 24-person board</li>
          </ul>
        </div>
      </div>
    </div>
  </div>

  <div class="section">
    <div class="module-title-wrap" style="max-width:900px;">
      <h3 class="module-title ja-animate" data-animation="move-from-bottom" data-delay="200">Story Angles</h3>
    </div>
    <div class="module-title-wrap" style="max-width:900px;">
      <div class="features-desc ja-animate" data-animation="move-from-bottom" data-delay="400">
        <div style="font-size:130%;">
          <p><strong>The Grassroots Story:</strong> How six friends with no trails built Japan's largest free-access MTB network in under five years — entirely through community support.</p>
          <p><strong>The Destination Story:</strong> What snowsports did for Niseko's winters, mountain biking is doing for its summers. From one park to an interconnected network spanning three resorts.</p>
          <p><strong>The Japan Story:</strong> The only truly open-access, nonprofit-built trail network in Japan — no membership, no registration, no fees. Just show up and ride.</p>
        </div>
      </div>
    </div>
  </div>

  <div class="section">
    <div class="module-title-wrap" style="max-width:900px;">
      <h3 class="module-title ja-animate" data-animation="move-from-bottom" data-delay="200">Downloads</h3>
    </div>
    <div class="module-title-wrap" style="max-width:900px;">
      <div class="features-desc ja-animate" data-animation="move-from-bottom" data-delay="400">
        <div style="font-size:130%;">
          <p>High-resolution photography is available on request. All images credited to Tanuki Productions unless otherwise stated.</p>
        </div>
      </div>
    </div>
  </div>

  <div class="t3-section">
    <div class="module-title-wrap">
      <div class="sub-heading ja-animate" data-animation="move-from-right" data-delay="600">
        <span>For media enquiries, high-res images, or interview requests:</span>
      </div>
      <div class="t3-section action ja-animate" data-animation="move-from-right" data-delay="800">
        <a class="btn btn-primary" href="mailto:info@namba.ngo">Contact us</a>
      </div>
    </div>
  </div>

</div>
```

- [ ] **Step 2: Create JA press page**

Create `ja/press/index.html` with translated content. Front matter:
```yaml
title: プレス・メディア
description: ニセコエリアマウンテンバイク協会のメディアリソース — 高解像度写真、主な事実、ストーリーの切り口、メディア連絡先。
permalink: /ja/press/
```

Body: translate key facts and story angles to Japanese. Run through BudouX.

- [ ] **Step 3: Build and verify**

```bash
bundle exec jekyll serve --baseurl="" --open-url
```

Check `/press/` and `/ja/press/` render correctly.

- [ ] **Step 4: Commit**

```bash
git add press/ ja/press/
git commit -m "Add /press/ page — media resources and story angles"
```

---

### Task 8: Create `/impact/`

**Files:**
- Create: `impact/index.html`
- Create: `ja/impact/index.html`

- [ ] **Step 1: Create EN impact page**

Create `impact/index.html` with:
- `title: Our Impact`
- `description: NAMBA's impact data: 11,500+ visitors, 21km+ of trail, 100% trail funding success, and growing.`
- `permalink: /impact/`

Content sections:
1. **Headline stats** — Use the `acm-features style-2` card layout (same as membership page) for 4-6 key stats:
   - 21km+ of trail
   - 11,500+ visitors (2025)
   - 100% trail funding success
   - 20,000+ volunteer hours
   - 50+ partners
   - 93% privately funded
2. **Visitor growth** — Table showing 2024 → 2025 monthly data from marketing strategy section 4
3. **Funding transparency** — 93% private, 69% local, 92% to trail building
4. **Trail network growth** — Year-by-year: 2022 (4.7km), 2023 (14.2km), 2024 (21km+), 2025 (expansion), 2026 (Hanazono)
5. **CTA** — "Partner with us" → `/partner/`

Use the `features-item` card pattern from the existing partner and membership pages for stats display.

- [ ] **Step 2: Create JA impact page**

Create `ja/impact/index.html` with translated content. Same data, translated labels and descriptions.

- [ ] **Step 3: Build and verify**

```bash
bundle exec jekyll serve --baseurl="" --open-url
```

- [ ] **Step 4: Commit**

```bash
git add impact/ ja/impact/
git commit -m "Add /impact/ page — key stats and growth data"
```

---

### Task 9: Create `/stories/` blog index

**Files:**
- Create: `stories/index.html`
- Create: `ja/stories/index.html`

- [ ] **Step 1: Create EN stories index page**

Create `stories/index.html`:

```html
---
title: Stories
description: Trail stories, trip guides, event recaps, and news from the Niseko Area Mountain Bike Association.
permalink: /stories/
---
<div class="t3-section-wrap">

  <div class="section">
    <div class="module-title-wrap" style="max-width:900px;">
      <h3 class="module-title ja-animate" data-animation="move-from-bottom" data-delay="200">
        Stories from the trails
      </h3>
      <div class="features-desc ja-animate" data-animation="move-from-bottom" data-delay="400">
        <div style="font-size:130%;">
          <span>Trail guides, trip reports, community news, and behind-the-scenes stories from NAMBA and the Niseko MTB community.</span>
        </div>
      </div>
    </div>
  </div>

  <div class="section">
    {% assign stories = site.posts | where: "categories", "stories" %}
    {% if stories.size > 0 %}
      {% for post in stories %}
        <div class="module-title-wrap" style="max-width:900px; margin-bottom:36px;">
          <div class="ja-animate" data-animation="move-from-bottom" data-delay="item-{{ forloop.index0 }}">
            {% if post.thumbnail %}
              <img src="{{ post.thumbnail }}" alt="{{ post.title }}" style="width:100%; border-radius:3px; margin-bottom:18px;" />
            {% endif %}
            <h3 style="margin-bottom:6px;"><a href="{{ post.url }}">{{ post.title }}</a></h3>
            <p style="color:var(--color-text-light); font-size:90%; margin-bottom:12px;">
              {{ post.date | date: "%B %-d, %Y" }}
            </p>
            {% if post.description %}
              <p style="font-size:110%;">{{ post.description }}</p>
            {% endif %}
          </div>
        </div>
      {% endfor %}
    {% else %}
      <div class="module-title-wrap" style="max-width:900px;">
        <div class="features-desc">
          <div style="font-size:130%;">
            <span>Stories coming soon — check back when the season opens!</span>
          </div>
        </div>
      </div>
    {% endif %}
  </div>

</div>
```

- [ ] **Step 2: Create JA stories index page**

Create `ja/stories/index.html` with:
```yaml
title: ストーリー
description: トレイルストーリー、トリップガイド、イベントレポート、ニセコエリアマウンテンバイク協会からのニュース。
permalink: /ja/stories/
```

Same structure but filter for JA posts: `{% assign stories = site.posts | where: "categories", "stories" | where: "lang", "ja" %}`. Note: posts in `ja/_posts/` automatically get `lang: ja` from `_config.yml` defaults.

Actually, the simpler approach matching existing patterns: the JA stories index should filter by checking `post.lang`:

```liquid
{% assign stories = site.posts | where: "categories", "stories" %}
{% assign ja_stories = "" | split: "" %}
{% for post in stories %}
  {% if post.lang == "ja" %}
    {% assign ja_stories = ja_stories | push: post %}
  {% endif %}
{% endfor %}
```

Or simply iterate and check `post.path contains 'ja/'`.

- [ ] **Step 3: Build and verify**

```bash
bundle exec jekyll serve --baseurl="" --open-url
```

Check `/stories/` shows the "coming soon" message (no posts yet with `stories` category). Check `/ja/stories/` works.

- [ ] **Step 4: Commit**

```bash
git add stories/ ja/stories/
git commit -m "Add /stories/ blog index page — infrastructure only"
```

---

## Phase 3 — Medium Pages

### Task 10: Create `/about/`

**Files:**
- Create: `about/index.html`
- Create: `ja/about/index.html`

- [ ] **Step 1: Create EN about page**

Create `about/index.html` with:
- `title: About NAMBA`
- `description: NAMBA is building Japan's largest free-access mountain bike trail network in Niseko, Hokkaido — transforming the region into Asia's premier MTB destination.`
- `permalink: /about/`

Content sections from marketing strategy §13 (Grassroots Narrative):
1. **The NAMBA Story** — founding narrative: "In 2021, six keen mountain bikers in Niseko decided their community needed trails..."
2. **Our Mission** — move from homepage (currently in `index.html` lines 188-196)
3. **Our Vision** — move from homepage (currently in `index.html` lines 203-216)
4. **The Allegra Partnership** — Swiss trail design partnership
5. **Growth Timeline** — 2021 (founded) → 2022 (first trails) → 2023 (Twin Peaks opens) → 2024 (7,500+ visitors) → 2025 (expansion) → 2026 (Hanazono). Use a clean list or timeline-style markup.
6. **Links section** — cards linking to `/team/`, `/projects/`, `/impact/`, `/press/`

- [ ] **Step 2: Create JA about page**

Create `ja/about/index.html` with translated content. Run through BudouX.

- [ ] **Step 3: Build and verify**

```bash
bundle exec jekyll serve --baseurl="" --open-url
```

- [ ] **Step 4: Commit**

```bash
git add about/ ja/about/
git commit -m "Add /about/ page — NAMBA story, mission, vision, timeline"
```

---

### Task 11: Move + enhance `/get-involved/partner/` → `/partner/`

**Files:**
- Create: `partner/index.html`
- Create: `ja/partner/index.html`
- Modify: `get-involved/partner/index.html` → redirect stub
- Modify: `ja/get-involved/partner/index.html` → redirect stub

This is a significant content upgrade, not just a move. The new page follows the structure from marketing strategy §7.

- [ ] **Step 1: Create EN partner page**

Create `partner/index.html` with:
- `title: Partner with NAMBA`
- `description: Invest in Niseko's mountain bike future. Trail sponsorship, brand partnerships, and community partnership opportunities with NAMBA.`
- `permalink: /partner/`

Sections (from spec §7):
1. **Impact data** — lead with proof: 11,500+ visitors, 100% trail funding, 20,000+ volunteer hours (reference the same data as `/impact/` but concise)
2. **The vision** — brief regional network story
3. **Partnership tiers** — updated table from pitch deck:
   - Tanuki: ¥50,000
   - Shika: ¥250,000
   - Higuma: ¥500,000+ (limited to 15)
   - Trail: price per metre
   Use the existing `table.levels` markup pattern from the current partner page
4. **Current trail sponsorship opportunities** — Green Flow Trail (¥8.45M), Lower Green Climb (¥13M)
5. **Exposure proof** — placeholder for signage photos, media screenshots
6. **Inquiry form / CTA** — replace mailto with "Get in touch" linking to `mailto:sponsorship@namba.ngo` (proper form can come later), plus downloadable pitch deck link

Carry over the existing CSS from the current partner page (the `table.levels` styles).

- [ ] **Step 2: Create JA partner page**

Create `ja/partner/index.html` with translated content.

- [ ] **Step 3: Convert old pages to redirect stubs**

`get-involved/partner/index.html`:
```html
---
title: Become a Partner
canonical: partner/
redirect: true
noindex: true
---
```

`ja/get-involved/partner/index.html`:
```html
---
title: 協賛のご案内
canonical: ja/partner/
redirect: true
noindex: true
---
```

- [ ] **Step 4: Build and verify**

```bash
bundle exec jekyll serve --baseurl="" --open-url
```

Check `/partner/` renders with new content. Check `/get-involved/partner/` redirects to `/partner/`. Check `/ja/partner/` and JA redirect.

- [ ] **Step 5: Commit**

```bash
git add partner/ ja/partner/ get-involved/partner/index.html ja/get-involved/partner/index.html
git commit -m "Move and enhance /partner/ — impact data, updated tiers, trail opportunities"
```

---

### Task 12: Move + redesign `/get-involved/donate/` → `/donate/`

**Files:**
- Create: `donate/index.html`
- Create: `ja/donate/index.html`
- Modify: `get-involved/donate/index.html` → redirect stub
- Modify: `ja/get-involved/donate/index.html` → redirect stub

"Fund the Dig" redesign from spec §15.

- [ ] **Step 1: Create EN donate page**

Create `donate/index.html` with:
- `title: Donate`
- `description: Fund the dig — your donation directly builds and maintains Niseko's free mountain bike trails. Choose what your contribution funds.`
- `permalink: /donate/`

Content sections:
1. **Headline** — "Fund the Dig"
2. **Tangible donation tiers** — Use the `features-item` card layout. Each card shows: amount, what it funds, playful label:
   - ¥500 "Fuel the Saw" — a can of fuel for the chainsaw
   - ¥1,000 "Keep It Sharp" — a replacement chain
   - ¥2,500 "Trail TLC" — a day of trail maintenance supplies
   - ¥5,000 "Lay the Foundation" — a load of gravel/drainage material
   - ¥10,000 "Fund the Crew" — a day of professional trail crew wages
   - ¥25,000 "Bridge the Gap" — a new section of boardwalk timber
   - ¥50,000 "Move Mountains" — a day of excavator operation
   - ¥100,000+ "Go Big" — custom contribution
3. **Custom amount** — input field (carry over existing custom donation JS pattern from current donate page)
4. **CTA** — links to the donation product in the Ecwid shop (`/shop/`) rather than embedding the full Ecwid store on this page (per Ecwid consolidation spec §10)

The current donate page uses `Ecwid.Cart.addProduct()` to add a donation product (ID: 484307482) with a custom price. For the Ecwid consolidation, we have two options:
- Keep the lightweight `Ecwid.Cart.addProduct()` API call (this is already a lightweight widget, not the full store)
- Link to the shop page

Since the `addProduct` pattern is already lightweight and provides a better UX (no page navigation), keep it but remove the full `xProductBrowser()` embed that's currently on the page.

- [ ] **Step 2: Create JA donate page**

Create `ja/donate/index.html` with translated tier names and descriptions. The playful tone should work in Japanese with more earnest framing (per spec).

- [ ] **Step 3: Convert old pages to redirect stubs**

`get-involved/donate/index.html`:
```html
---
title: Donate
canonical: donate/
redirect: true
noindex: true
---
```

`ja/get-involved/donate/index.html`:
```html
---
title: 寄付のお願い
canonical: ja/donate/
redirect: true
noindex: true
---
```

- [ ] **Step 4: Update Ecwid redirect URLs**

In the new `donate/index.html`, ensure any Ecwid post-purchase redirect points to `/thanks/` (not `/get-involved/thanks/`).

- [ ] **Step 5: Build and verify**

```bash
bundle exec jekyll serve --baseurl="" --open-url
```

Check donation tiers display, custom amount works, Ecwid add-to-cart functions.

- [ ] **Step 6: Commit**

```bash
git add donate/ ja/donate/ get-involved/donate/index.html ja/get-involved/donate/index.html
git commit -m "Move and redesign /donate/ — Fund the Dig with tangible cost tiers"
```

---

### Task 13: Enhance `/artist-series/`

**Files:**
- Modify: `artist-series/index.html`
- Modify: `ja/artist-series/index.html`

- [ ] **Step 1: Read current artist-series pages**

Read `artist-series/index.html` and `ja/artist-series/index.html` to understand current content.

- [ ] **Step 2: Enhance EN page**

Add to the existing page:
- More prominent connection to the shop ("Shop the Artist Series" CTA → `/shop/`)
- Mention of the Yotei Brewing x Twin Peaks collaboration
- "Support the trails" messaging — connecting merch purchases to trail funding
- Cross-link to `/stories/` for future artist feature posts

- [ ] **Step 3: Enhance JA page**

Mirror enhancements in Japanese.

- [ ] **Step 4: Build and verify**

```bash
bundle exec jekyll serve --baseurl="" --open-url
```

- [ ] **Step 5: Commit**

```bash
git add artist-series/index.html ja/artist-series/index.html
git commit -m "Enhance /artist-series/ — shop connection, Yotei Brewing collab"
```

---

## Phase 4 — Big New Sections

### Task 14: Create `/plan-your-trip/`

**Files:**
- Create: `plan-your-trip/index.html`
- Create: `ja/plan-your-trip/index.html`

- [ ] **Step 1: Create EN plan-your-trip page**

Create `plan-your-trip/index.html` with:
- `title: Plan Your Trip`
- `description: Everything you need to plan a mountain biking trip to Niseko, Japan — bike rentals, accommodation, transport from Sapporo, when to visit, and what to pack.`
- `permalink: /plan-your-trip/`

Content sections (from marketing strategy):
1. **Hero intro** — "Your guide to riding Niseko"
2. **When to visit** — Season runs June–October, best months, weather expectations
3. **Getting here** — Flights to New Chitose Airport (CTS), transport to Niseko (~2.5 hours), car rental options
4. **Bike rentals** — Link to sponsor rental partners (EZObase/ezobike, etc.)
5. **Accommodation** — Link to sponsor accommodation partners, area overview
6. **What to pack** — Gear checklist for different ability levels
7. **Ability guide** — What level rider is the network suited for (beginner through expert)
8. **Beyond the bike** — Onsen, food, Niseko lifestyle. "The world's best post-ride recovery"
9. **CTA** — "Explore the trails" → `/where-to-ride/`, "Support the trails" → `/join/`

Build this as a self-contained section (per Bike Niseko migration consideration in spec §9).

- [ ] **Step 2: Create JA plan-your-trip page**

Create `ja/plan-your-trip/index.html` with translated content.

- [ ] **Step 3: Build and verify**

```bash
bundle exec jekyll serve --baseurl="" --open-url
```

- [ ] **Step 4: Commit**

```bash
git add plan-your-trip/ ja/plan-your-trip/
git commit -m "Add /plan-your-trip/ — visitor guide for international riders"
```

---

### Task 15: Create `/projects/` section (hub + 4 sub-pages)

This task creates 5 pages. Each sub-page follows the consistent project layout from spec §6.

**Files:**
- Modify: `projects/twin-peaks/index.html` (replace redirect with real content)
- Modify: `ja/projects/twin-peaks/index.html` (same)
- Create: `projects/index.html` (hub)
- Create: `ja/projects/index.html`
- Create: `projects/hanazono/index.html`
- Create: `ja/projects/hanazono/index.html`
- Create: `projects/grand-hirafu/index.html`
- Create: `ja/projects/grand-hirafu/index.html`
- Create: `projects/yotei-360/index.html`
- Create: `ja/projects/yotei-360/index.html`

- [ ] **Step 1: Create EN projects hub page**

Create `projects/index.html`:
- `title: Our Projects`
- `description: NAMBA is building an interconnected mountain bike network across Niseko — Twin Peaks, Grand Hirafu, Hanazono, and beyond.`
- `permalink: /projects/`

Sections:
1. **Intro** — NAMBA's regional role: "Not just a bike park — an interconnected network"
2. **Project cards** — Visual cards for each project with status badge, key stat, link:
   - Twin Peaks (Open) → `/projects/twin-peaks/`
   - Hanazono (Under Construction — Opening July 2026) → `/projects/hanazono/`
   - Grand Hirafu (Open) → `/projects/grand-hirafu/`
   - Yotei 360 (Planning) → `/projects/yotei-360/`
3. **The Vision** — Alpine trails and future concepts section
4. **CTA** — "Partner with us on future builds" → `/partner/`

- [ ] **Step 2: Create EN Twin Peaks project page**

Replace content of `projects/twin-peaks/index.html` (currently a redirect) with new project page:
- `title: Twin Peaks Bike Park`
- `description: The flagship NAMBA project — Japan's largest free-access mountain bike trail network with 21km+ of Swiss-designed trails.`
- `permalink: /projects/twin-peaks/`
- Remove `canonical` and `redirect` front matter keys

Sections (per project layout spec §6):
1. Hero image
2. Status badge: **Open**
3. Overview — NAMBA's flagship park, 20+ trails, 21km+, free access
4. Timeline — 2022 first trails → 2023 public opening → 2024 expansion → 2025 major growth → 2026 new builds
5. Trail specs — current network summary
6. Funding/partners — community-funded, 100% success rate
7. CTA → `/partner/`

- [ ] **Step 3: Create EN Hanazono project page**

Create `projects/hanazono/index.html`:
- `title: Hanazono Trails`
- `description: NAMBA is building Hanazono's first mountain bike trails — a 4,500m lift-access flow trail opening July 2026.`
- `permalink: /projects/hanazono/`

Sections: Status badge (Under Construction), overview (4,500m flow trail + skills park + link trail), opening timeline, NAMBA's design role, signage system.

- [ ] **Step 4: Create EN Grand Hirafu project page**

Create `projects/grand-hirafu/index.html`:
- `title: Grand Hirafu`
- `description: NAMBA consults on Grand Hirafu's bike park expansion — trail design, signage systems, and trail building.`
- `permalink: /projects/grand-hirafu/`

Sections: Status badge (Open), overview, consulting role, signage, trail building.

- [ ] **Step 5: Create EN Yotei 360 project page**

Create `projects/yotei-360/index.html`:
- `title: Yotei 360`
- `description: A 50km+ loop circling the base of Mt Yotei — Niseko's future signature ride. Currently in planning.`
- `permalink: /projects/yotei-360/`

Sections: Status badge (Planning), the vision/narrative, concept description, future ambition.

- [ ] **Step 6: Create all JA mirror pages**

Create JA versions for all 5 pages under `ja/projects/`. Translate front matter and content. Run through BudouX.

- [ ] **Step 7: Build and verify**

```bash
bundle exec jekyll serve --baseurl="" --open-url
```

Check all 5 EN pages and their JA mirrors. Verify the old `/projects/twin-peaks/` redirect is gone and shows new content.

- [ ] **Step 8: Commit**

```bash
git add projects/ ja/projects/
git commit -m "Add /projects/ section — hub + Twin Peaks, Hanazono, Grand Hirafu, Yotei 360"
```

---

### Task 16: Create `/where-to-ride/` section (hub + 4 sub-pages)

**Files:**
- Create: `where-to-ride/index.html` (hub with integrated map)
- Create: `ja/where-to-ride/index.html`
- Create: `where-to-ride/grand-hirafu/index.html`
- Create: `ja/where-to-ride/grand-hirafu/index.html`
- Create: `where-to-ride/hanazono/index.html`
- Create: `ja/where-to-ride/hanazono/index.html`
- Create: `where-to-ride/gravel/index.html`
- Create: `ja/where-to-ride/gravel/index.html`
- Create: `where-to-ride/skills-parks/index.html`
- Create: `ja/where-to-ride/skills-parks/index.html`

- [ ] **Step 1: Create EN where-to-ride hub page**

Create `where-to-ride/index.html`:
- `title: Where to Ride`
- `description: Discover mountain biking across Niseko — Twin Peaks, Grand Hirafu, Hanazono, gravel routes, and skills parks. Free trails, lift-access riding, and more.`
- `permalink: /where-to-ride/`

Sections (from spec §16):
1. **Hero** — "Ride Niseko — world-class trails across one of Asia's most beautiful mountain regions"
2. **Quick stats bar** — Total trail km, number of trails, "free to ride"
3. **Riding area cards** — Visual card grid:
   - Twin Peaks (largest card — links to `/twin-peaks/`)
   - Grand Hirafu → `/where-to-ride/grand-hirafu/`
   - Hanazono (with "Opening July 2026" badge) → `/where-to-ride/hanazono/`
   - Gravel → `/where-to-ride/gravel/`
   - Skills Parks → `/where-to-ride/skills-parks/`
4. **Area map** — Trailforks embed for Twin Peaks + static overview map showing all areas. Use an `<iframe>` for Trailforks.
5. **Season info** — Opening dates, best months
6. **CTA** — "Plan your trip" → `/plan-your-trip/`

Use the `acm-features style-2` card layout for riding area cards, similar to how benefits are displayed on the partner page.

- [ ] **Step 2: Create EN Grand Hirafu riding page**

Create `where-to-ride/grand-hirafu/index.html`:
- `title: Grand Hirafu Bike Park`
- `description: Mountain biking at Grand Hirafu — trail overview, lift access, difficulty range, and practical info for riders.`
- `permalink: /where-to-ride/grand-hirafu/`

Rider-facing content: what's available, difficulty range, lift access, how it connects to Twin Peaks, practical info (location, parking, rental, lift pass), link to resort's own site.

- [ ] **Step 3: Create EN Hanazono riding page**

Create `where-to-ride/hanazono/index.html`:
- `title: Hanazono Trails`
- `description: Niseko's first lift-accessed top-to-bottom blue trail — opening July 2026. A 4,500m flow trail, skills park, and link trail to Twin Peaks.`
- `permalink: /where-to-ride/hanazono/`

Pre-opening content: what's being built, July 2026 opening timeline, what to expect, connection to Twin Peaks.

- [ ] **Step 4: Create EN gravel riding page**

Create `where-to-ride/gravel/index.html`:
- `title: Gravel Riding in Niseko`
- `description: Gravel cycling routes in the Niseko area — scenic rural roads through Hokkaido's volcanic landscape, plus the Niseko Gravel event series.`
- `permalink: /where-to-ride/gravel/`

Content: key routes, Niseko Gravel event series, what to expect, bike/equipment, broader Hokkaido cycling context.

- [ ] **Step 5: Create EN skills parks page**

Create `where-to-ride/skills-parks/index.html`:
- `title: Skills Parks & Pump Tracks`
- `description: Skills parks and pump tracks in the Niseko area — perfect for beginners, families, and riders looking to level up.`
- `permalink: /where-to-ride/skills-parks/`

Content: listing of each facility with location, features, suitability. Include the Hanazono skills park (opening 2026).

- [ ] **Step 6: Create all JA mirror pages**

Create JA versions for all 5 pages under `ja/where-to-ride/`. Translate front matter and content. Run through BudouX.

- [ ] **Step 7: Build and verify**

```bash
bundle exec jekyll serve --baseurl="" --open-url
```

Check all EN and JA pages. Verify card links work. Test Trailforks embed loads.

- [ ] **Step 8: Commit**

```bash
git add where-to-ride/ ja/where-to-ride/
git commit -m "Add /where-to-ride/ section — hub, Grand Hirafu, Hanazono, gravel, skills parks"
```

---

## Phase 5 — Navigation + Homepage

### Task 17: Update navigation

**Files:**
- Modify: `_data/nav.yml`

- [ ] **Step 1: Update nav.yml**

Replace `_data/nav.yml` with new navigation structure:

```yaml
- path: where-to-ride
  en: Where to Ride
  ja: ライドスポット
  sub:
    - path: twin-peaks
      en: Twin Peaks
      ja: ツイン・ピークス
    - path: where-to-ride/grand-hirafu
      en: Grand Hirafu
      ja: グランヒラフ
    - path: where-to-ride/hanazono
      en: Hanazono
      ja: 花園
    - path: where-to-ride/gravel
      en: Gravel
      ja: グラベル
    - path: where-to-ride/skills-parks
      en: Skills Parks
      ja: スキルパーク
    - path: plan-your-trip
      en: Plan Your Trip
      ja: 旅行の計画

- path: about
  en: About
  ja: NAMBAについて
  sub:
    - path: about
      en: About NAMBA
      ja: NAMBAについて
    - path: projects
      en: Our Projects
      ja: プロジェクト
    - path: team
      en: Our Team
      ja: チーム
    - path: impact
      en: Our Impact
      ja: 実績
    - path: press
      en: Press & Media
      ja: プレス・メディア
    - path: stories
      en: Stories
      ja: ストーリー

- path: events
  en: Events
  ja: イベント

- path: partner
  en: Partner
  ja: 協賛
  sub:
    - path: partner
      en: Partner with Us
      ja: 協賛のご案内
    - path: join
      en: Join NAMBA
      ja: 仲間になろう
    - path: donate
      en: Donate
      ja: 寄付のお願い
    - path: jobs
      en: Jobs
      ja: 求人

- path: ""
  en: Shop
  ja: ショップ
  sub:
    - path: artist-series
      en: Artist Series
      ja: アーティストシリーズ
    - path: shop
      en: Shop
      ja: オンラインショップ
```

Note: the exact nav structure may need adjustment based on how `_includes/nav.html` reads the data. Review `nav.html` to ensure paths resolve correctly (some use `path` as a direct URL segment, some may need full paths).

- [ ] **Step 2: Build and verify navigation**

```bash
bundle exec jekyll serve --baseurl="" --open-url
```

Check every nav link works on both EN and JA. Check dropdown menus open. Check mobile menu works.

- [ ] **Step 3: Commit**

```bash
git add _data/nav.yml
git commit -m "Update navigation — new site structure with Where to Ride, About, Partner sections"
```

---

### Task 18: Homepage overhaul

**Note:** Per the spec, the homepage is a separate task to be brainstormed independently. This task is a placeholder — the homepage redesign should go through its own brainstorming → spec → plan cycle.

**Files:**
- Modify: `index.html`
- Modify: `ja/index.html`

- [ ] **Step 1: Run separate brainstorming session for homepage**

The homepage overhaul is complex enough to warrant its own design spec. Key changes from the marketing strategy §17:
- Replace "Who we are" / Mission / Vision / Goals with concise routing sections
- Move team listing to `/team/` (already done in Task 6)
- Add hero video section
- Add impact stats bar
- Add "Where to ride" cards
- Add "Current news" section
- Simplify sponsor bar (remove tier headings)
- Add "Get involved" CTA cards

Do NOT implement without a separate approved spec.

---

## Cross-Cutting: Ecwid Consolidation

### Task 19: Audit and consolidate Ecwid usage

**Files to audit:**
- `_layouts/event.html` — contains Ecwid redirect config (line 585)
- `_layouts/competition.html` — contains Ecwid redirect config (line 537)
- `join/index.html` — full Ecwid store embed (`xProductBrowser`)
- `donate/index.html` — Ecwid `addProduct` API + full store embed
- `shop/index.html` — full Ecwid store (this one stays)

- [ ] **Step 1: Audit all Ecwid embeds**

Read each file listed above. Document which use the full `xProductBrowser()` embed vs. lightweight `Ecwid.Cart.addProduct()` API calls.

- [ ] **Step 2: Update event/competition layouts**

In `_layouts/event.html` and `_layouts/competition.html`, update the Ecwid redirect URL from `/get-involved/thanks` to `/thanks`.

- [ ] **Step 3: Simplify join page Ecwid usage**

In `join/index.html` (already moved to `/join/` in Task 1): the page currently embeds a full Ecwid store category. Options:
- Keep the membership product links as direct links to `/shop/#!/p/[product-id]`
- Or keep the lightweight product embed — decide based on user preference

At minimum, remove the `xProductBrowser()` full store embed and keep only the direct product links (`#!/p/439543752` etc.) that already exist in the tier cards.

- [ ] **Step 4: Simplify donate page Ecwid usage**

In `donate/index.html` (already moved to `/donate/` in Task 12): keep the lightweight `Ecwid.Cart.addProduct()` calls for the donation tiers but remove the full `xProductBrowser()` embed.

- [ ] **Step 5: Build and verify**

```bash
bundle exec jekyll serve --baseurl="" --open-url
```

Check: membership "Join now" links work, donation "Donate now" buttons add to cart, event ticket purchases redirect to `/thanks/`.

- [ ] **Step 6: Commit**

```bash
git add _layouts/event.html _layouts/competition.html join/index.html ja/join/index.html donate/index.html ja/donate/index.html
git commit -m "Consolidate Ecwid — remove full store embeds from join and donate pages"
```

---

## Cross-Cutting: Config Updates

### Task 20: Update `_config.yml` defaults

**Files:**
- Modify: `_config.yml`

- [ ] **Step 1: Add defaults for new paths**

Add scope defaults for new sections that need custom OG images or masthead images:

```yaml
- scope:
    path: where-to-ride
  values:
    masthead:
      img: /assets/images/bg/bg-header-twinpeaks.jpg
- scope:
    path: ja/where-to-ride
  values:
    masthead:
      img: /assets/images/bg/bg-header-twinpeaks.jpg
- scope:
    path: projects
  values:
    masthead:
      img: /assets/images/bg/bg-header-twinpeaks.jpg
- scope:
    path: ja/projects
  values:
    masthead:
      img: /assets/images/bg/bg-header-twinpeaks.jpg
```

Note: use the Twin Peaks header as a placeholder — replace with section-specific images when available.

- [ ] **Step 2: Add `.superpowers/` to exclude list**

```yaml
exclude:
  - CLAUDE.md
  - .claude
  - chrome
  - .superpowers
```

- [ ] **Step 3: Build and verify**

```bash
bundle exec jekyll build
```

- [ ] **Step 4: Commit**

```bash
git add _config.yml
git commit -m "Update config — defaults for new sections, exclude .superpowers"
```

---

## Cross-Cutting: Sitemap Updates

### Task 21: Update sitemap

**Files:**
- Modify: `sitemap.html`

- [ ] **Step 1: Read current sitemap**

Read `sitemap.html` to understand the structure and add entries for all new pages with correct `hreflang` alternates.

- [ ] **Step 2: Add new pages to sitemap**

Add entries for: `/about/`, `/team/`, `/projects/` + sub-pages, `/impact/`, `/press/`, `/stories/`, `/partner/`, `/join/`, `/donate/`, `/thanks/`, `/plan-your-trip/`, `/where-to-ride/` + sub-pages, `/events/waiver/`.

Remove entries for deleted/redirected pages.

- [ ] **Step 3: Build and verify**

```bash
bundle exec jekyll build
```

Check `_site/sitemap.xml` contains correct URLs and hreflang alternates.

- [ ] **Step 4: Commit**

```bash
git add sitemap.html
git commit -m "Update sitemap — add new pages, remove deleted pages"
```
