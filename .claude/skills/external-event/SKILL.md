---
name: external-event
description: Use when adding a partner / external MTB event to namba.ngo's events index — events NAMBA does not host but always adds to the calendar each year. Triggers on phrases like "add a partner event," "add an external event," "add Niseko Gravel autumn ride," "add Downhill Series," "we always add this event to our calendar," or when the user pastes a non-namba.ngo MTB event URL with no other context. Does NOT apply to NAMBA-hosted events (use the workflow in _docs/events.md instead).
---

# External Event Skill

For partner / external MTB events that link out to the partner's site. NAMBA is not the host. The viewer clicks through to the partner for full details; our post is a short, well-indexed pointer with bilingual coverage.

**Design spec:** `_docs/superpowers/specs/2026-06-01-external-event-skill-design.md`

## Workflow

Rigid workflow. Run the steps in order. Create one TodoWrite item per step so progress is visible to the user.

### 1. Confirm scope

Fetch the source URL with WebFetch. Extract:
- Event dates (with timezone +0900)
- Venue and full postal address
- Course / category / format breakdown
- Price tiers
- Registration / details link

Print the extracted facts back to the user as a short summary. Ask for explicit confirmation, especially when the event is one round of a multi-round series. **Wait for the user to say "go" before continuing.**

### 2. Source the hero image

Scrape the source page for `<img>` and `<meta property="og:image">` URLs.

For each candidate, download to `assets/images/_triage/` and check dimensions with `sips -g pixelWidth -g pixelHeight`.

Quality gate (all must pass):
- Width >= 1600px
- Aspect ratio between 1.3 and 2.5
- Filename does NOT contain `logo`, `title_`, or `phonto-`

If at least one candidate passes:
- Show the user the URL + dimensions
- Ask: "Use this image? Optionally provide a credit name + URL."
- If user accepts, capture credit (if given) for `masthead.credit` in frontmatter

If no candidate passes:
- Delete failed candidates from `_triage/`
- Ask the user to drop a single image into `assets/images/_triage/` and provide credit info (name + URL, both optional)
- Tip the user: past hero shots live in `assets/images/events/`. If reusing one, the user should copy it into `_triage/` first.
- **Wait for the user to confirm** the file is in place before continuing

### 3. Image pipeline

Slug + year come from the post filename (which derives from `startDate`).

Load `references/image-pipeline.md` and run the commands. Outputs:
- `assets/images/events/<year>/<slug>/header.jpg` (2000px wide, JPG)
- `assets/images/events/<year>/<slug>/header-mobile.webp` (400w)
- `assets/images/events/<year>/<slug>/header.webp` (800w)
- `assets/images/events/<year>/<slug>/header-medium.webp` (1200w)
- `assets/images/events/<year>/<slug>/header-large.webp` (1600w)
- `assets/images/events/<year>/<slug>/header-mobile.avif`, `header.avif`, `header-medium.avif`, `header-large.avif` (AVIF mirror of each WebP tier; the masthead partial serves these first and renders blank if missing)
- `assets/images/events/<year>/<slug>/thumb.jpg` (600×600 centre-cropped)
- `assets/images/events/<year>/<slug>/thumb.webp` (WebP sibling; the event card serves this first)

Delete the source file from `_triage/` after the pipeline finishes.

### 4. Draft EN copy

Body shape (target 150-250 words):

```
{NAMBA-perspective intro paragraph: why this event matters for the Niseko MTB
community. Welcoming, community-focused, grounded in place. ~50-80 words.}

## What you need to know

- **Date:** {date range}
- **Venue:** {location}, {short geographic anchor}
- **Format:** {one-line summary}
- **Who it's for:** {one-line audience cue}

{Optional closing paragraph: NAMBA's connection to the event. The link out is
auto-rendered by the layout from the `link.url` frontmatter, so no in-body CTA needed.}
```

`description` (frontmatter): one sentence under 160 chars summarising the event for meta tags.

Do NOT use em dashes anywhere. Use commas, colons, or rewrite. (Project memory rule.)

### 5. Humanize EN

Run the `humanizer` skill on the EN body + description (load `references/copy-pipeline.md` for the exact pattern). Apply its suggestions.

Hard rule, applied after humanizer:

```bash
grep -c "—" _posts/<filename>.md
# Expected: 0
```

If grep returns >0, rewrite offending lines. Do not commit a file containing em dashes.

### 6. SEO check EN

Run `claude-seo:seo-content` via the Skill tool on the EN body. Apply only lightweight fixes (heading hierarchy, sentence length, target keyword presence in title / H1 / first paragraph / description). Do NOT pad copy to chase length targets. Do NOT run ai-seo on external-event posts.

### 7. Translate JA

Load `references/ja-tokenisation.md` for which fields get `<wbr>` tokens and which stay plain.

Translate:
- Body paragraphs (preserve voice: welcoming, community)
- `title` (plain JA)
- `description` (plain JA, under 160 chars)
- `location` (with `<wbr>` tokens at word boundaries)
- `address` to a proper Japanese-script postal address (format: `〒<postcode> <prefecture><city><suburb><street>`)
- Price tier `name` values (translate, then `<wbr>` token)
- `link.text` → `イベント詳細`

### 8. BudouX JA body

For each JA body paragraph (NOT frontmatter), run:

```bash
budoux --lang ja -s $'​' -d "" "<paragraph>"
```

Replace the original paragraph with the BudouX output. Headings with JA prose get the same treatment.

### 9. Write both files

Load `references/frontmatter-template.md` for the exact shape.

Files:
- `_posts/<YYYY-MM-DD>-<slug>.md` (EN)
- `ja/_posts/<YYYY-MM-DD>-<slug>.md` (JA)

`<YYYY-MM-DD>` from `startDate`. `<slug>` is kebab-case from the EN title (strip year and round identifiers, the year in the URL keeps slugs unique).

### 10. Verify

Run, in order:

```bash
bundle exec jekyll build 2>&1 | grep -iE "(error|warning)" | head -20
# Expected: nothing mentioning the new posts

grep -c "—" _posts/<filename>.md ja/_posts/<filename>.md
# Expected: 0 on both lines

ls _site/events/<slug>-<year>/index.html _site/ja/events/<slug>-<year>/index.html
# Expected: both files exist

grep -l 'application/ld+json' _site/events/<slug>-<year>/index.html
# Expected: match (the Event JSON-LD block)

ls assets/images/events/<year>/<slug>/
# Expected: header.jpg
#           header-mobile.webp  header.webp  header-medium.webp  header-large.webp
#           header-mobile.avif  header.avif  header-medium.avif  header-large.avif
#           thumb.jpg  thumb.webp

grep -o '<slug>/header[^" ]*\.avif' _site/events/<slug>-<year>/index.html | sort -u \
  | while read f; do test -f "_site/assets/images/events/<year>/$f" || echo "MISSING: $f"; done
# Expected: no MISSING lines (every AVIF the masthead references exists, else the hero renders blank)
```

### 11. Stop before commit

Print:
- List of changed/added files (EN post, JA post, image folder contents)
- A one-line commit message draft the user can adapt

Do NOT run `git add`, `git commit`, or `git push`. The user reviews and commits.

## When this skill does NOT apply

- NAMBA-hosted events → use `_docs/events.md` workflow instead
- Competitions, jobs, blog posts → use their respective workflows
- Updating an existing event post → just edit it directly
