# Frontmatter template — external events

Use these exact shapes. EN and JA differ only in the localised fields.

## EN

```yaml
---
layout: event
categories: events
title: <Event name in English, plain text>
description: <One sentence under 160 chars>
startDate: <YYYY-MM-DD HH:MM:SS +0900>
days: <integer>
location: <Venue name>
address: <Full postal address in English>
price:
  - name: <Tier 1 name>
    adult: ¥<amount>
  - name: <Tier 2 name>
    adult: ¥<amount>
host:
  name: <Partner organisation name>
  img: /<partner-logo-filename>.png
  url: <Partner home URL>
masthead:
  img: /assets/images/events/<year>/<slug>/header.jpg
thumbnail: /assets/images/events/<year>/<slug>/thumb.jpg
og:
  image: /assets/images/events/<year>/<slug>/header.jpg
link:
  url: <Source URL — the partner's event details page>
  text: Event details
  isSignup: false
parking: false
about: false
---
```

Add `masthead.credit` only if the image came with attribution:

```yaml
masthead:
  img: /assets/images/events/<year>/<slug>/header.jpg
  credit:
    name: <Photographer name>
    url: <Photographer URL>
```

## JA

```yaml
---
layout: event
categories: events
title: <Event name in Japanese, plain text>
description: <One sentence in Japanese, under 160 chars — PLAIN text, feeds meta/OG/Schema>
descriptionHtml: <Same sentence tokenised with <wbr> — the masthead renders this for phrase-aware wrapping; falls back to `description` if omitted>
startDate: <Same as EN>
days: <Same as EN>
location: <Venue name in Japanese with <wbr> tokens at word boundaries>
address: <Japanese-script postal address, plain text, format: 〒<postcode> <prefecture><city><suburb><street>>
price:
  - name: <Tier 1 name in JA with <wbr> tokens>
    adult: <Same as EN>
  - name: <Tier 2 name in JA with <wbr> tokens>
    adult: <Same as EN>
host:
  name: <Same as EN, usually the partner's English brand name>
  img: <Same as EN>
  url: <Same as EN>
masthead:
  img: <Same as EN>
thumbnail: <Same as EN>
og:
  image: <Same as EN>
link:
  url: <Same as EN>
  text: イベント詳細
  isSignup: false
parking: false
about: false
---
```

## Fields explicitly NOT used on external events

Drop these, they are for NAMBA-hosted events:

- `itinerary`
- `partners` (use `host` for the single partner instead)
- `signup` (the event-level signup CTA — `link.url` covers this here)
- `form`
- `storeProductId`
- `moreInfo`
- `time` (we are not running the event; do not presume hours)
- `cancelled` (set to true only if the partner cancels, manually)

## Slug + filename

Slug: kebab-case from the EN title. Strip year, round numbers, and round identifiers (e.g. "R5"). The year in the URL (`/events/<slug>-<year>/`) keeps slugs unique year-on-year.

- `Niseko Gravel Autumn Ride` → `niseko-gravel-autumn-ride`
- `Downhill Series R5 Niseko Annupuri` → `downhill-series`

Filename: `YYYY-MM-DD-<slug>.md`, dates from `startDate`.
