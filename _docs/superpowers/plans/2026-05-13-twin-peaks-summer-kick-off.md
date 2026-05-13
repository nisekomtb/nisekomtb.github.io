# Twin Peaks Summer Kick Off Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship the bilingual event page for Twin Peaks Summer Kick Off (Saturday 30 May 2026) and fold the event-creation workflow into `_docs/events.md`.

**Architecture:** Two new Jekyll posts (EN + JA mirror) using the existing `event` layout. Header and thumbnail images derived from a source file in `assets/images/_triage/` via `sips`. JA body text tokenised via BudouX zero-width spaces; JA front matter tokenised with `<wbr>` per project rules. Two new sections appended to the existing `_docs/events.md` reference doc.

**Tech Stack:** Jekyll, GitHub Pages, vanilla HTML/CSS, BudouX CLI 0.8.1, macOS `sips` for image processing.

**Source spec:** `_docs/superpowers/specs/2026-05-13-twin-peaks-summer-kick-off-design.md`

---

## File Structure

**Files to create:**

- `_posts/2026-05-30-twin-peaks-summer-kick-off.md`: EN event post (front matter + body)
- `ja/_posts/2026-05-30-twin-peaks-summer-kick-off.md`: JA mirror
- `assets/images/events/2026/twin-peaks-summer-kick-off/header.jpg`: 2000px wide masthead
- `assets/images/events/2026/twin-peaks-summer-kick-off/thumb.jpg`: 504×672 gallery card

**Files to modify:**

- `_docs/events.md`: append two new H2 sections

**Files to delete:**

- `assets/images/_triage/TP-20250920-0728.jpg`: source moves out of triage once derived files exist

**Out of scope for this plan (post-launch follow-ups):**

- Partner logo PNGs for The Dirty Dames and The Nuthatch (user provides separately)
- Dirty Dames clinic signup URL (insert inline when received)
- Food truck serving times (add itinerary row when received)
- Rhythm map URL for the 9:00am pre-ride coffee row

---

## Task 1: Prepare event images

**Files:**
- Create: `assets/images/events/2026/twin-peaks-summer-kick-off/header.jpg`
- Create: `assets/images/events/2026/twin-peaks-summer-kick-off/thumb.jpg`
- Delete: `assets/images/_triage/TP-20250920-0728.jpg`

**Source:** `assets/images/_triage/TP-20250920-0728.jpg` is a 3000×2000 JPEG (NAMBA tent at trail base, community gathered).

- [ ] **Step 1: Create the event image folder**

```bash
mkdir -p assets/images/events/2026/twin-peaks-summer-kick-off
```

- [ ] **Step 2: Generate the header image (2000px wide, preserves aspect ratio)**

```bash
sips -Z 2000 assets/images/_triage/TP-20250920-0728.jpg \
  --out assets/images/events/2026/twin-peaks-summer-kick-off/header.jpg
```

Expected output: `2000x1333` JPEG (aspect ratio preserved from 3:2 source).

- [ ] **Step 3: Verify the header file**

```bash
file assets/images/events/2026/twin-peaks-summer-kick-off/header.jpg
```

Expected: `JPEG image data ... 2000x1333`

- [ ] **Step 4: Generate the thumbnail (504×672, centre crop)**

Two-step process: scale source so height fits 672, then centre-crop width to 504.

```bash
sips --resampleHeight 672 assets/images/_triage/TP-20250920-0728.jpg \
  --out /tmp/thumb-tmp.jpg
sips -c 672 504 /tmp/thumb-tmp.jpg \
  --out assets/images/events/2026/twin-peaks-summer-kick-off/thumb.jpg
rm /tmp/thumb-tmp.jpg
```

- [ ] **Step 5: Verify the thumbnail**

```bash
file assets/images/events/2026/twin-peaks-summer-kick-off/thumb.jpg
```

Expected: `JPEG image data ... 504x672`

- [ ] **Step 6: Remove the source from triage**

```bash
rm assets/images/_triage/TP-20250920-0728.jpg
```

- [ ] **Step 7: Verify triage is now empty**

```bash
ls assets/images/_triage/
```

Expected: empty output (no files).

---

## Task 2: Create the EN event post

**Files:**
- Create: `_posts/2026-05-30-twin-peaks-summer-kick-off.md`

- [ ] **Step 1: Create the file with full front matter and body**

Write the complete file at `_posts/2026-05-30-twin-peaks-summer-kick-off.md`:

```markdown
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

The trail crew have been hard at it since the snow melted, and Twin Peaks is back. Every line is open: skills park, flow trails, tech lines, and the popular Launch Control jump line. All 17km, ready to ride.

This year we're keeping things simple. No big schedule, no main stage. Come for a lap, stay for the community, find us at the tent.

### The Dirty Dames women's skills clinic

Start with coffee at [Rhythm](https://rhythmjapan.com) from 9:00am for a pre-ride catch up and bike check. The clinic itself runs 10:00am to 11:00am at the [Twin Peaks](/twin-peaks/) trailhead, run by The Dirty Dames in partnership with NAMBA. All levels welcome, from first-timers to seasoned riders.

Spaces are limited and signup is required. The signup link will be added here closer to the day.

### Orientation ride

Also at 10:00am, our crew will lead an orientation ride for anyone new to Twin Peaks, or anyone who has only ridden the park a couple of times. One hour, easy pace, focused on showing you the layout so you can explore on your own afterwards. Just turn up at the trailhead.

### The NAMBA tent and the new trail map

We will be at the trail base all day from 9:00am to 3:00pm. Come and see the updated trail head map showing the full 17km of trail, pick up some new merch, and chat with the team about what is in the pipeline for Twin Peaks and how you can [get involved](/get-involved/).

### Food truck

The Nuthatch will be on site with food and drinks. Quick fuel for a pit stop between laps.

### Kids scavenger hunt

From 1:30pm at the NAMBA tent, a scavenger hunt for the kids around the trail base. Sticker prizes for everyone who finishes.

### 30% off Rhythm rentals all day

Showing up without a bike? Rhythm is offering 30% off rentals to everyone on the day, all day. Head there first to grab a rig before rolling up to the trailhead.

See you at the trail head.
```

- [ ] **Step 2: Build Jekyll locally and verify the page renders**

```bash
bundle exec jekyll build 2>&1 | tail -20
```

Expected: `done in <N> seconds` with no `error` or `warning` lines mentioning the new post.

- [ ] **Step 3: Verify the rendered HTML exists**

```bash
ls _site/events/twin-peaks-summer-kick-off-2026/index.html
```

Expected: file exists.

- [ ] **Step 4: Check the page renders the expected sections**

```bash
grep -c "Dirty Dames women" _site/events/twin-peaks-summer-kick-off-2026/index.html
grep -c "17km" _site/events/twin-peaks-summer-kick-off-2026/index.html
grep -c "Launch Control" _site/events/twin-peaks-summer-kick-off-2026/index.html
```

Expected: each grep returns at least `1`.

- [ ] **Step 5: Verify Schema.org JSON-LD generated**

```bash
grep -A 1 'application/ld+json' _site/events/twin-peaks-summer-kick-off-2026/index.html | head -3
```

Expected: a `<script type="application/ld+json">` block exists.

---

## Task 3: Translate the EN body to JA (rough first pass)

**Files:** None yet. This task produces translated paragraphs as plain text, used in Task 4.

The EN body has 9 paragraphs (2 opening + 6 section bodies + 1 closing). For each, produce a Japanese translation that preserves meaning and tone. No tokenisation yet, that comes in Task 4.

- [ ] **Step 1: Translate the opening paragraphs**

EN:
> The trail crew have been hard at it since the snow melted, and Twin Peaks is back. Every line is open: skills park, flow trails, tech lines, and the popular Launch Control jump line. All 17km, ready to ride.
>
> This year we're keeping things simple. No big schedule, no main stage. Come for a lap, stay for the community, find us at the tent.

JA target:
> 雪解けからずっと、トレイルクルーが整備を続けてきました。ツインピークスが帰ってきます。スキルズパーク、フロートレイル、テックライン、そして人気のローンチコントロール・ジャンプラインまで、全てのラインがオープン。17km全てのトレイルが、走り出すあなたを待っています。
>
> 今年はシンプルに。大きなスケジュールも、メインステージもありません。1本走って、コミュニティに溶け込み、テントで僕たちに会いに来てください。

- [ ] **Step 2: Translate each H3 section body in turn**

For each H3 section, produce a JA paragraph using the same structure as the EN.

| Section | EN sentence count | JA target |
|---|---|---|
| Dirty Dames clinic (2 paragraphs) | 4 sentences total | Match sentence-by-sentence |
| Orientation ride | 2 sentences | Match |
| NAMBA tent | 2 sentences | Match |
| Food truck | 2 sentences | Match |
| Kids scavenger hunt | 2 sentences | Match |
| 30% off Rhythm | 2 sentences | Match |
| Closing | 1 sentence | Match |

Use the JA translations from the EN body in the spec as your starting point. Translate each H3 body block independently. Keep translations under the doc's voice guidance (welcoming, community-focused, active).

Save your nine translated blocks to a scratch file or scratch buffer; Task 4 will run each through BudouX.

- [ ] **Step 3: No em dashes check on translated text**

```bash
# Paste your translated paragraphs into a temp file and grep
echo "<your translated text>" > /tmp/ja-draft.txt
grep -c "—" /tmp/ja-draft.txt
```

Expected: `0`. If any em dashes appear, rewrite using commas, colons, or periods.

---

## Task 4: Tokenise JA body paragraphs with BudouX

**Files:** None. Produces tokenised strings used in Task 5.

BudouX inserts U+200B (zero-width space) at Japanese word boundaries. The CLI is at `/Users/tom/.local/bin/budoux` (version 0.8.1).

- [ ] **Step 1: Verify BudouX is on PATH**

```bash
budoux --version
```

Expected: `budoux 0.8.1` (or compatible).

- [ ] **Step 2: Tokenise each paragraph and strip the outer span**

For each of the 9 translated paragraphs from Task 3, run:

```bash
budoux --lang ja --html "<paragraph text>"
```

Output looks like: `<span style="...">日本語...の<wbr>テキスト</span>` for the legacy mode, OR with zero-width spaces for the current default. Confirm output format with:

```bash
budoux --lang ja --html "ツインピークスが帰ってきます。"
```

If output uses `<wbr>` tags, switch to the zero-width mode. BudouX 0.8.x default is zero-width. Strip any outer `<span>...</span>` wrapper before using the inner text.

- [ ] **Step 3: Confirm zero-width spaces are present**

After tokenisation, run on the first paragraph:

```bash
echo "<tokenised paragraph>" | od -c | head -3
```

Expected: presence of `342 200 213` byte sequences (the UTF-8 encoding of U+200B).

- [ ] **Step 4: Collect all tokenised paragraphs**

Keep the 9 tokenised strings together, in order, for use in Task 5.

---

## Task 5: Create the JA event post

**Files:**
- Create: `ja/_posts/2026-05-30-twin-peaks-summer-kick-off.md`

- [ ] **Step 1: Create the JA post with front matter (tokenised with `<wbr>`) and BudouX-tokenised body**

Write the file at `ja/_posts/2026-05-30-twin-peaks-summer-kick-off.md`. Use this template, substituting the tokenised body paragraphs from Task 4:

```markdown
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
          name: ダーティ・<wbr>デイムズの<wbr>事前コーヒー
          location:
            name: Rhythm
        - time: "10:00am - 11:00am"
          name: ダーティ・<wbr>デイムズ<wbr>女性スキルクリニック
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

<TOKENISED OPENING PARAGRAPH 1 FROM TASK 4>

<TOKENISED OPENING PARAGRAPH 2 FROM TASK 4>

### ダーティ・デイムズ女性スキルクリニック

<TOKENISED DIRTY DAMES SECTION FROM TASK 4>

### オリエンテーションライド

<TOKENISED ORIENTATION RIDE PARAGRAPH FROM TASK 4>

### NAMBAテントと新しいトレイルマップ

<TOKENISED NAMBA TENT PARAGRAPH FROM TASK 4>

### フードトラック

<TOKENISED FOOD TRUCK PARAGRAPH FROM TASK 4>

### キッズスカベンジャーハント

<TOKENISED SCAVENGER HUNT PARAGRAPH FROM TASK 4>

### Rhythmのレンタル30%オフ

<TOKENISED 30 PERCENT OFF PARAGRAPH FROM TASK 4>

<TOKENISED CLOSING LINE FROM TASK 4>
```

Replace each `<TOKENISED ... FROM TASK 4>` placeholder with the BudouX-tokenised string (the one containing zero-width U+200B spaces, no outer `<span>`).

Note: H3 headings themselves are written as plain Japanese without tokenisation (they are short and the layout handles wrapping).

- [ ] **Step 2: Confirm zero-width spaces survived save**

```bash
od -c ja/_posts/2026-05-30-twin-peaks-summer-kick-off.md | grep -c "342 200 213"
```

Expected: a count greater than zero (one U+200B sequence per word boundary in the body).

- [ ] **Step 3: No em dashes in the JA file**

```bash
grep -c "—" ja/_posts/2026-05-30-twin-peaks-summer-kick-off.md
```

Expected: `0`.

- [ ] **Step 4: Build Jekyll and verify the JA page renders**

```bash
bundle exec jekyll build 2>&1 | tail -20
```

Expected: clean build, no errors.

- [ ] **Step 5: Verify rendered JA HTML exists**

```bash
ls _site/ja/events/twin-peaks-summer-kick-off-2026/index.html
```

Expected: file exists.

- [ ] **Step 6: Verify hreflang alternates link EN to JA and back**

```bash
grep "hreflang" _site/events/twin-peaks-summer-kick-off-2026/index.html
grep "hreflang" _site/ja/events/twin-peaks-summer-kick-off-2026/index.html
```

Expected: each page has two `hreflang` link tags, pointing at the other language's URL.

---

## Task 6: Visual check the bilingual pages locally

**Files:** None modified. Manual visual verification.

- [ ] **Step 1: Start Jekyll serve**

```bash
bundle exec jekyll serve --baseurl="" --port=4000
```

Leave this running for the rest of this task in a background terminal.

- [ ] **Step 2: Visit the EN event page in the browser**

Open `http://localhost:4000/events/twin-peaks-summer-kick-off-2026/`.

Verify visually:
- Masthead image displays at full width
- Title "Twin Peaks Summer Kick Off" renders correctly
- Date "Saturday 30 May 2026" displays
- Sidebar shows location, time, price (Free), partners, parking
- Body copy renders the opening 2 paragraphs and all 6 H3 sections in order
- Itinerary table shows all 5 schedule rows
- No broken layout, no missing images other than partner logos (acceptable until Task 9 follow-ups)

- [ ] **Step 3: Visit the JA event page**

Open `http://localhost:4000/ja/events/twin-peaks-summer-kick-off-2026/`.

Verify visually:
- Same structural sections as EN
- Japanese text wraps cleanly at word boundaries (BudouX tokenisation is working)
- Title displays in katakana
- Itinerary `name` and `location.name` fields wrap correctly thanks to `<wbr>` tags
- Language switcher in the nav toggles back to the EN page

- [ ] **Step 4: Visit the events index pages**

Open `http://localhost:4000/events/` and `http://localhost:4000/ja/events/`.

Verify visually:
- New event card appears at the top (it is the next upcoming event)
- Thumbnail image displays at the correct aspect ratio
- Card links to the post page on click

- [ ] **Step 5: Stop Jekyll serve**

Ctrl-C in the terminal running `jekyll serve`.

---

## Task 7: Append "Creation workflow" section to `_docs/events.md`

**Files:**
- Modify: `_docs/events.md` (append a new H2 section after the existing "Notes" section)

- [ ] **Step 1: Append the new section**

Open `_docs/events.md`. Find the existing `## Notes` section near the bottom. After the last line of that section, append:

```markdown

---

## Creation workflow

The operational arc from "user briefs me on a new event" to "EN and JA posts committed".

### 1. Confirm scope first

Lock these before drafting any content:

- Date, including timezone (use `+0900` for events held in Japan)
- Location, address, parking flag, about flag
- Price
- Partners and host (logos already in `assets/images/company/`?)
- Drop-in vs registered (does the event-level `signup:` field apply, or is signup only for a sub-activity?)
- Audience (international riders, locals, families, sponsors)

### 2. Image triage flow

Incoming source images live in `assets/images/_triage/` until processed.

```bash
# Header (2000px wide, aspect-preserving)
sips -Z 2000 assets/images/_triage/<source>.jpg \
  --out assets/images/events/<year>/<slug>/header.jpg

# Thumbnail (504x672 centre crop, via height-scale then crop)
sips --resampleHeight 672 assets/images/_triage/<source>.jpg --out /tmp/thumb-tmp.jpg
sips -c 672 504 /tmp/thumb-tmp.jpg --out assets/images/events/<year>/<slug>/thumb.jpg
rm /tmp/thumb-tmp.jpg

# Clear the source from triage
rm assets/images/_triage/<source>.jpg
```

### 3. Partner images

Each partner needs:

- Transparent PNG in `assets/images/company/<slug>.png`
- Greyscale `.g` variant at `assets/images/company/<slug>.g.png` (rendered initially; colour version shows on hover)
- High enough resolution to render as a large icon

If a partner's logo is not already in the repo:

1. Block the post on the missing image
2. Flag back to the briefer with what is needed
3. Do not scrape third-party sites (Instagram, Facebook, etc.) for logos. Logos are partner-provided assets.

### 4. EN first, JA mirror immediately after

Bilingual parity is non-negotiable. Never commit the EN file without the JA twin in the same change. See `.claude/rules/bilingual.md`.

### 5. JA tokenisation

Body text and front matter follow different tokenisation rules:

| Where | Method | Tool |
|---|---|---|
| Body paragraphs | Zero-width U+200B spaces | `budoux --lang ja --html "..."` then strip outer `<span>` |
| Front matter `titleHtml`, `location`, itinerary `name`, itinerary `location.name`, `moreInfo` items, price `name` values | `<wbr>` tags | Manual or scripted |
| Front matter `title`, `description`, `address` | Plain text only | None (used for SEO/Schema/OG) |

See `.claude/rules/bilingual.md` for the full set of rules.

### 6. Verify before commit

- `bundle exec jekyll build` runs clean (no errors mentioning the new posts)
- EN and JA pages render at `/events/<slug>-<year>/` and `/ja/events/<slug>-<year>/`
- Event card appears in both `/events/` and `/ja/events/` index pages
- hreflang alternates link the two language versions
- No em dashes anywhere in either file (`grep -c "—" <file>` returns `0`)
- Schema.org JSON-LD block exists in rendered HTML (`grep 'application/ld+json' _site/...`)
```

- [ ] **Step 2: Verify the section appended cleanly**

```bash
grep -A 2 "^## Creation workflow" _docs/events.md
```

Expected: section heading appears followed by descriptive paragraph.

---

## Task 8: Append "Twin Peaks event defaults" section to `_docs/events.md`

**Files:**
- Modify: `_docs/events.md`

- [ ] **Step 1: Append the section after "Creation workflow"**

Open `_docs/events.md`. At the very end of the file (after the Creation workflow section added in Task 7), append:

````markdown

---

## Twin Peaks event defaults

Quick-reference block for the recurring fields when an event is held at Twin Peaks Bike Park specifically. Saves looking it up each time.

### EN front matter

```yaml
location: Twin Peaks Bike Park, Niseko
address: 150, 2 Aza-150-1 Yamada, Kutchan, Abuta District, Hokkaido 044-0081
parking: true
about: false
```

### JA front matter

```yaml
location: ツインピークス・<wbr>バイクパーク、<wbr>ニセコ
address: 150, 2 Aza-150-1 Yamada, Kutchan, Abuta District, Hokkaido 044-0081
```

### Twin Peaks Trailhead map URL

`https://goo.gl/maps/yKza3NA7yfx5VQRx8`

Used in itinerary `location.url` for any event activity at the trailhead. Already referenced across multiple existing event posts.
````

- [ ] **Step 2: Verify the section appended cleanly**

```bash
grep -A 2 "^## Twin Peaks event defaults" _docs/events.md
```

Expected: section heading appears followed by descriptive paragraph.

- [ ] **Step 3: Verify no em dashes in the doc additions**

```bash
grep -c "—" _docs/events.md
```

Expected: `0` (or matches whatever count was in the file before, which should also be `0` for an already-clean doc). If non-zero, find and rewrite.

---

## Task 9: Final verification across all changes

**Files:** No new modifications. Holistic sweep before committing.

- [ ] **Step 1: Confirm all expected files exist**

```bash
ls _posts/2026-05-30-twin-peaks-summer-kick-off.md \
   ja/_posts/2026-05-30-twin-peaks-summer-kick-off.md \
   assets/images/events/2026/twin-peaks-summer-kick-off/header.jpg \
   assets/images/events/2026/twin-peaks-summer-kick-off/thumb.jpg
```

Expected: all four paths exist.

- [ ] **Step 2: Confirm triage is empty**

```bash
ls assets/images/_triage/
```

Expected: no files (empty directory).

- [ ] **Step 3: No em dashes across new and modified files**

```bash
grep -l "—" _posts/2026-05-30-twin-peaks-summer-kick-off.md \
            ja/_posts/2026-05-30-twin-peaks-summer-kick-off.md \
            _docs/events.md
```

Expected: empty output (no files contain em dashes).

- [ ] **Step 4: Final Jekyll build**

```bash
bundle exec jekyll build 2>&1 | tail -5
```

Expected: `done in <N> seconds`, no errors or warnings.

- [ ] **Step 5: Check both built pages exist**

```bash
test -f _site/events/twin-peaks-summer-kick-off-2026/index.html && echo "EN OK"
test -f _site/ja/events/twin-peaks-summer-kick-off-2026/index.html && echo "JA OK"
```

Expected: `EN OK` and `JA OK`.

---

## Task 10: Commit

**Files:** All previously created and modified files.

- [ ] **Step 1: Review the diff**

```bash
git status
git diff --stat
```

Confirm exactly these files are changed:

- `_posts/2026-05-30-twin-peaks-summer-kick-off.md` (new)
- `ja/_posts/2026-05-30-twin-peaks-summer-kick-off.md` (new)
- `assets/images/events/2026/twin-peaks-summer-kick-off/header.jpg` (new)
- `assets/images/events/2026/twin-peaks-summer-kick-off/thumb.jpg` (new)
- `assets/images/_triage/TP-20250920-0728.jpg` (deleted)
- `_docs/events.md` (modified, appended)

- [ ] **Step 2: Stage exactly those files**

```bash
git add _posts/2026-05-30-twin-peaks-summer-kick-off.md \
        ja/_posts/2026-05-30-twin-peaks-summer-kick-off.md \
        assets/images/events/2026/twin-peaks-summer-kick-off/ \
        _docs/events.md
git add -u assets/images/_triage/TP-20250920-0728.jpg
```

- [ ] **Step 3: Verify staged set matches expectations**

```bash
git diff --cached --stat
```

Expected: six entries matching the list in Step 1.

- [ ] **Step 4: Commit with no Co-Authored-By trailer**

```bash
git commit -m "$(cat <<'EOF'
Add Twin Peaks Summer Kick Off event page (EN + JA) for 30 May 2026

The official opening of all Twin Peaks trails for the 2026 summer season.
Community-focused day with the Dirty Dames clinic, an orientation ride for
newcomers, the NAMBA tent with new trail map and merch, a Nuthatch food
truck, a kids scavenger hunt, and 30% off Rhythm rentals for everyone.

Also appends two new sections to _docs/events.md: a creation workflow
covering image triage, partner logos, JA tokenisation, and verification;
and a Twin Peaks defaults block for the recurring venue fields.
EOF
)"
```

- [ ] **Step 5: Confirm clean working tree**

```bash
git status
```

Expected: `nothing to commit, working tree clean`.

---

## Post-launch follow-ups (not part of this plan)

These items are documented in the spec's "Open dependencies" section and require user input. Track them as separate small commits when each lands:

- Insert Dirty Dames clinic signup URL inline in the H3 section of both EN and JA posts
- Add a food truck row to the itinerary with confirmed serving start and end times
- Add `assets/images/company/dirty-dames.png` + `dirty-dames.g.png` (transparent + greyscale)
- Add `assets/images/company/nuthatch.png` + `nuthatch.g.png` (transparent + greyscale)
- Add Rhythm map URL to the 9:00am `Dirty Dames pre-ride coffee` itinerary row in both EN and JA
- Add a Dirty Dames URL to the `partners` block if they have a website
