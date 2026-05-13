# Twin Peaks Summer Kick Off: Event Page + `_docs/events.md` Upgrades

**Date drafted:** 2026-05-13
**Event date:** Saturday 30 May 2026
**Author:** Tom Mortiboy (briefed) / Claude (drafted)
**Status:** Spec, awaiting implementation plan

## Goal

Two related deliverables:

1. Ship the bilingual event page for **Twin Peaks Summer Kick Off** (EN + JA) ahead of the 2026 summer season opening.
2. Fold the workflow surfaced by this exercise back into `_docs/events.md` so the next event creation is faster and more consistent.

The event is the official opening of all Twin Peaks trails for the 2026 summer season. Intentionally simpler than the 2024 Season Opener: community-led, fewer formal activities, more time on the bike.

## Scope

**In scope:**

- New EN post at `_posts/2026-05-30-twin-peaks-summer-kick-off.md`
- New JA mirror at `ja/_posts/2026-05-30-twin-peaks-summer-kick-off.md`
- Header + thumbnail images placed under `assets/images/events/2026/twin-peaks-summer-kick-off/`
- Two new sections appended to `_docs/events.md`: "Creation workflow" and "Twin Peaks event defaults"

**Out of scope:**

- New `.claude/rules/events.md` rule file (decided against during brainstorm)
- New invokable skill (decided against during brainstorm)
- Rework of existing `copy.md`, `bilingual.md`, `images.md`, or `posts.md` rules
- Anything beyond Twin Peaks defaults in events.md (no generic event-creation marketing guidance; that lives in `copy.md`)

**Explicitly excluded from content:**

- Any mention of a soft opening before 30 May. The page treats this as the season's official opening, full stop.

## Event details (locked)

| Field | Value |
|---|---|
| Title | Twin Peaks Summer Kick Off |
| Date | Saturday 30 May 2026 |
| Day length | 1 day, 9:00am – 3:00pm |
| Location | Twin Peaks Bike Park, Niseko |
| Address | 150, 2 Aza-150-1 Yamada, Kutchan, Abuta District, Hokkaido 044-0081 |
| Price | Free |
| Parking flag | `true` |
| About section flag | `false` |
| Trail count | 17km+ of trail open |
| Trails open | Skills park, flow trails, tech lines, Launch Control jump line |

### Schedule

| Time | Activity | Location |
|---|---|---|
| 9:00am | Dirty Dames pre-ride coffee | Rhythm |
| 9:00am – 3:00pm | NAMBA tent open (map, merch, team) | Twin Peaks trail base |
| 10:00am – 11:00am | Dirty Dames women's skills clinic (signup required) | Twin Peaks Trailhead |
| 10:00am – 11:00am | Orientation ride | Twin Peaks Trailhead |
| Mid-morning to end of lunch (times TBC) | Food truck (The Nuthatch) | Twin Peaks trail base |
| 1:30pm – 2:30pm | Kids scavenger hunt (sticker prizes) | NAMBA tent, trail base |
| 3:00pm | Event ends | |

### Partners

- **The Dirty Dames**: partner running the women's clinic. Logo image TBC.
- **The Nuthatch** (ザ・ナットハッチ): food truck partner, URL https://www.instagram.com/thenuthatchkuromatsunai/. Logo image TBC (user to source from their Instagram profile; do not scrape).

**Not a partner:** Rhythm. Coffee meetup is for Dirty Dames participants only. However, Rhythm is offering **30% off rentals for everyone** all day. Mention in body copy.

### Open dependencies (must resolve before publish)

- [ ] Dirty Dames clinic signup form URL
- [ ] Food truck serving start/end times (currently "mid-morning to end of lunch")
- [ ] The Nuthatch partner logo (transparent PNG + greyscale `.g.png`)
- [ ] Dirty Dames partner logo (transparent PNG + greyscale `.g.png`)
- [ ] Dirty Dames URL (if any)

## Files and image plan

### Files to create

- `_posts/2026-05-30-twin-peaks-summer-kick-off.md`
- `ja/_posts/2026-05-30-twin-peaks-summer-kick-off.md`

### Image folder

`assets/images/events/2026/twin-peaks-summer-kick-off/`

| File | Size | Source |
|---|---|---|
| `header.jpg` | 2000px wide | Resized from `assets/images/_triage/TP-20250920-0728.jpg` |
| `thumb.jpg` | 504 × 672px | Cropped from centre of header |

After resizing and placing, remove the source from `_triage/`.

### Partner images (blocked)

Placed in `assets/images/company/`:

- `nuthatch.png` and `nuthatch.g.png`
- `dirty-dames.png` and `dirty-dames.g.png`

Both follow the existing convention: transparent PNG, large-icon quality, with a greyscale `.g` variant for the hover state (per `.claude/rules/images.md`).

### OG image

Same path as the masthead.

## Front matter

### EN

```yaml
---
layout: event
categories: events
title: Twin Peaks Summer Kick Off
description: All 17km of trails reopen for the 2026 summer. Join the NAMBA community on Saturday 30 May for skills clinics, orientation rides, food truck, kids fun.
startDate: 2026-05-30 09:00:00 +0900
days: 1
time: "9:00am - 3:00pm"
location: Twin Peaks Bike Park, Niseko
address: 150, 2 Aza-150-1 Yamada, Kutchan, Abuta District, Hokkaido 044-0081
price: 0
partners:
  - name: The Dirty Dames
    img: /dirty-dames.png
    url: # TBC
  - name: The Nuthatch
    img: /nuthatch.png
    url: https://www.instagram.com/thenuthatchkuromatsunai/
masthead:
  img: /assets/images/events/2026/twin-peaks-summer-kick-off/header.jpg
thumbnail: /assets/images/events/2026/twin-peaks-summer-kick-off/thumb.jpg
og:
  image: /assets/images/events/2026/twin-peaks-summer-kick-off/header.jpg
itinerary:
  days:
    - hasLocations: true
      events:
        - time: "9:00am"
          name: Dirty Dames pre-ride coffee
          location:
            name: Rhythm
            url: # TBC - Rhythm map link
        - time: "10:00am - 11:00am"
          name: Dirty Dames women's skills clinic
          location:
            name: Twin Peaks Trailhead
            url: https://goo.gl/maps/yKza3NA7yfx5VQRx8
        - time: "10:00am - 11:00am"
          name: Orientation ride
          location:
            name: Twin Peaks Trailhead
            url: https://goo.gl/maps/yKza3NA7yfx5VQRx8
        - time: "1:30pm - 2:30pm"
          name: Kids scavenger hunt
          location:
            name: NAMBA tent, trail base
            url: https://goo.gl/maps/yKza3NA7yfx5VQRx8
        - time: "3:00pm"
          name: Event ends
parking: true
about: false
---
```

### JA (front matter only)

```yaml
---
layout: event
categories: events
title: ツインピークス・サマーキックオフ
titleHtml: ツインピークス・<wbr>サマーキックオフ
description: 2026年シーズン開幕、17kmの全トレイルが再オープン。5月30日土曜日、スキルクリニック、オリエンテーションライド、フードトラック、子供向けのアクティビティで、NAMBAコミュニティと一緒にシーズンの幕開けを祝いましょう。
startDate: 2026-05-30 09:00:00 +0900
days: 1
time: "9:00am - 3:00pm"
location: ツインピークス・<wbr>バイクパーク、<wbr>ニセコ
address: 150, 2 Aza-150-1 Yamada, Kutchan, Abuta District, Hokkaido 044-0081
price: 0
partners:
  - name: ザ・ダーティ・デイムズ
    img: /dirty-dames.png
    url: # TBC
  - name: ザ・ナットハッチ
    img: /nuthatch.png
    url: https://www.instagram.com/thenuthatchkuromatsunai/
masthead:
  img: /assets/images/events/2026/twin-peaks-summer-kick-off/header.jpg
thumbnail: /assets/images/events/2026/twin-peaks-summer-kick-off/thumb.jpg
og:
  image: /assets/images/events/2026/twin-peaks-summer-kick-off/header.jpg
itinerary:
  days:
    - hasLocations: true
      events:
        - time: "9:00am"
          name: ディーティ・<wbr>デイムズの<wbr>事前コーヒー
          location:
            name: Rhythm
            url: # TBC
        - time: "10:00am - 11:00am"
          name: ディーティ・<wbr>デイムズ<wbr>女性スキルクリニック
          location:
            name: ツインピークス・<wbr>トレイルヘッド
            url: https://goo.gl/maps/yKza3NA7yfx5VQRx8
        - time: "10:00am - 11:00am"
          name: オリエンテーションライド
          location:
            name: ツインピークス・<wbr>トレイルヘッド
            url: https://goo.gl/maps/yKza3NA7yfx5VQRx8
        - time: "1:30pm - 2:30pm"
          name: キッズ<wbr>スカベンジャーハント
          location:
            name: NAMBAテント、<wbr>トレイル<wbr>ベース
            url: https://goo.gl/maps/yKza3NA7yfx5VQRx8
        - time: "3:00pm"
          name: イベント終了
parking: true
about: false
---
```

**Tokenisation rules applied:**

- `title`, `description`, `address`: plain text (used in `<title>`, OG, Schema.org)
- `titleHtml`, `location`, itinerary `name` values, itinerary `location.name`: tokenised with `<wbr>` per `.claude/rules/bilingual.md`

**`signup` field is intentionally omitted.** Only the Dirty Dames clinic requires registration. A page-level Sign Up button would mislead drop-in visitors. The clinic signup link will be embedded inline in the Dirty Dames H3 section when it lands.

## EN body copy structure

Story-led opening + six short H3 callouts. Target 350–450 words total.

### Opening (2 short paragraphs)

Paragraph 1: Trail crew payoff. Snow has melted, the crew have been at it for weeks, Twin Peaks is back open. All 17km of trail ready: skills park, flow trails, tech lines, Launch Control jump line.

Paragraph 2: Frame as a community day. No big main stage, no packed schedule. Come for a lap, stay for the community, find us at the tent.

**Approved tone sample:**

> The trail crew have been hard at it since the snow melted, and Twin Peaks is back. Every line is open: skills park, flow trails, tech lines, and the popular Launch Control jump line. All 17km, ready to ride.
>
> This year we're keeping things simple. No big schedule, no main stage. Come for a lap, stay for the community, find us at the tent.

### H3 sections (in order)

1. **The Dirty Dames women's skills clinic**: 9:00am pre-ride coffee at Rhythm, 10:00am to 11:00am clinic at Twin Peaks. Open to all levels. Signup link [TBC]. Partnership with Dirty Dames.
2. **Orientation ride**: 10:00am to 11:00am, for first-timers or anyone who's only been a couple of times. NAMBA crew shows the layout so riders can explore confidently after.
3. **The NAMBA tent and new trail map**: at the trail base all day, 9:00am to 3:00pm. New trail head map showing the updated 17km layout, fresh merch, and the team on hand to share what's in the pipeline and how to support the next phase.
4. **Food truck**: The Nuthatch on site for mid-ride fuel. Quick pit stop between laps.
5. **Kids scavenger hunt**: 1:30pm at the tent, sticker prizes for the finishers.
6. **30% off Rhythm rentals all day**: short callout. Applies to everyone, useful for anyone showing up without a bike.

### Closing (single line)

> See you at the trail head.

### Copy rules to enforce

- British English
- No em dashes anywhere (use commas, colons, or new sentences)
- No mention of soft opening
- Welcoming, active, community-focused voice per `.claude/rules/copy.md`
- At least 2 internal links (e.g., to `/twin-peaks/`, `/get-involved/`)
- Alt text on every image, in EN

## JA body copy plan

**Translation:** Machine-translated, preserve meaning and tone. Same six H3 structure as EN, same closing.

**Body tokenisation:** Run each paragraph through BudouX (`budoux --lang ja --html "..."`), strip the outer `<span>` wrapper, embed the result with zero-width spaces in the markdown. This is the documented current method per `_docs/bilingual.md`; the `<wbr>`-in-prose pattern seen in the May 2026 Spring Clean post is the legacy approach and should not be carried forward.

**Front matter tokenisation:** Continues to use `<wbr>` tags per `.claude/rules/bilingual.md` (the rule is body-vs-front-matter split, not a wholesale switch).

**Alt text:** Localised JA alt text on any inline images.

## `_docs/events.md` upgrades

Two new sections appended to the existing doc. No edits to existing content.

### Section A. Creation workflow

New H2 placed after the "Notes" section. Captures the operational arc from "user briefs me on a new event" to "EN + JA posts committed":

1. **Confirm scope first.** Date, location, venue, price, partners, audience, whether it's drop-in or registered.
2. **Image triage flow.** Incoming images live in `assets/images/_triage/`. Resize the chosen image to 2000px wide as `header.jpg`, crop the centre to 504 × 672 as `thumb.jpg`, place both under `assets/images/events/{year}/{slug}/`, remove the source from `_triage/`.
3. **Partner images.** Each partner needs a transparent PNG in `assets/images/company/` plus a greyscale `.g.png` variant for the hover state. If the partner's logo is not already in the repo, block on it and flag back to the user. Do not scrape third-party sites (Instagram, etc.) for logos.
4. **EN post first, JA mirror immediately after.** Never leave the JA twin behind (bilingual parity is non-negotiable per `.claude/rules/bilingual.md`).
5. **JA tokenisation.** Body text via BudouX zero-width spaces. Front matter via `<wbr>` tags. Plain text only for `title`, `description`, `address`.
6. **Verify before commit.** Schedule sanity-check, image paths exist, both EN and JA files in place, no em dashes anywhere.

### Section B. Twin Peaks event defaults

New H2 placed after the workflow section. A quick-reference block for the recurring fields when an event is at Twin Peaks specifically:

```yaml
# EN
location: Twin Peaks Bike Park, Niseko
address: 150, 2 Aza-150-1 Yamada, Kutchan, Abuta District, Hokkaido 044-0081
parking: true
about: false

# JA
location: ツインピークス・<wbr>バイクパーク、<wbr>ニセコ
```

Plus a note: the Twin Peaks Trailhead map URL is `https://goo.gl/maps/yKza3NA7yfx5VQRx8` (already used across multiple existing posts).

## Verification before commit

- [ ] EN post renders locally (`bundle exec jekyll serve`) without front-matter errors
- [ ] JA post renders locally without front-matter errors
- [ ] Both pages show in `/events/` and `/ja/events/` index listings
- [ ] Header image displays at correct aspect ratio on desktop and mobile
- [ ] Thumbnail displays correctly in the events gallery
- [ ] Schema.org Event JSON-LD auto-generates correctly (check page source)
- [ ] No em dashes anywhere in either post or in events.md additions
- [ ] hreflang alternates link EN ↔ JA correctly

## Out-of-band follow-ups

Once the page is live, surface these back to the user:

- Dirty Dames signup URL (insert inline in the H3)
- Food truck serving times (add a row to the itinerary)
- Partner logos for Dirty Dames and The Nuthatch
- Rhythm map URL for the 9:00am itinerary row
