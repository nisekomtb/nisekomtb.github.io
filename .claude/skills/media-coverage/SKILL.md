---
name: media-coverage
description: Use when adding a new "in the news" / media coverage item to namba.ngo, an external article, video, podcast, print or TV piece that mentions NAMBA, Niseko mountain biking, or Twin Peaks. Triggers on phrases like "add a media coverage item," "add this to in the news," "we got featured in," "add this article/video/interview," or when the user pastes a URL of a press/media piece about NAMBA. Cards link directly to the source; NO NAMBA page is created. Does NOT apply to NAMBA-hosted events (use _docs/events.md) or partner events (use the external-event skill).
---

# Media Coverage Skill

Adds one item to the "In the News" section (`/media-coverage/`). Items live in
`_data/media-coverage.yml`, not as posts, because each card links straight to the
source. One data entry carries BOTH languages so the JA card never drifts.

**Design spec:** `_docs/superpowers/specs/2026-07-09-media-coverage-section-design.md`

## Workflow

Rigid workflow. Run the steps in order. Create one TodoWrite item per step.

### 1. Gather metadata

The user gives one or more source URLs. An item may have an EN source, a JA
source, or both (pass both URLs).

**First check `_data/media-coverage-ignored.yml`.** If a given URL is on that
list, tell the user it was previously seen and deliberately skipped (quote the
`reason`) and stop unless they explicitly want it added anyway. Also check
`_data/media-coverage.yml` for an existing entry covering the same piece via a
different URL (e.g. a wire-service copy of a post already linked from the
publisher's own site). When the user decides a discovered URL should NOT be
added, record it in the ignored file (`url`, `reason`, `date`).

Load `references/metadata-fetch.md` and follow the fetch cascade
(curl-with-UA, then Playwright browser, then manual paste). Extract:
- Headline (verbatim from the source)
- Publish date (YYYY-MM-DD)
- Publication name + a lowercase `source` key (e.g. Pinkbike -> `pinkbike`)
- Content `type` (article | video | podcast | print | tv; online magazine -> article)
- The `og:image` URL (for the thumbnail)
- One strong pull-quote (a real sentence from the piece about NAMBA / Niseko /
  Twin Peaks). If the piece has no quotable line, write a one-sentence neutral
  summary instead.

Ask whether a JA-version URL exists (if the user only gave one URL). Print the
extracted facts back and **wait for the user to say "go".**

### 2. Source the thumbnail

Download the `og:image` to `assets/images/_triage/`. Check dimensions with
`sips -g pixelWidth -g pixelHeight`.

Quality gate (all must pass):
- Width >= 1200px
- Aspect ratio between 1.2 and 2.5
- Filename does NOT contain `logo`, `sprite`, or `placeholder`

If it fails, or the image host blocks download: ask the user to drop a single
image into `assets/images/_triage/` and **wait for confirmation** before
continuing.

### 3. Source the publication logo

If `assets/images/media-coverage/sources/<source>.png` already exists, skip this
step (logos are shared across every article from that outlet).

Otherwise fetch the outlet's icon (try `apple-touch-icon`, then `og:logo`, then
`/favicon.ico`) and save a square transparent PNG at
`assets/images/media-coverage/sources/<source>.png` (see `references/image-pipeline.md`).

### 4. Image pipeline

Load `references/image-pipeline.md` and run the thumbnail commands. Outputs:
- `assets/images/media-coverage/<year>/<slug>/thumb.jpg` (600x600 centre-crop)
- `assets/images/media-coverage/<year>/<slug>/thumb.webp`

`<year>` is the publish year; `<slug>` is kebab-case, prefixed with the source
key for uniqueness (e.g. `pinkbike-cruise-control-niseko`).

Delete the source from `_triage/` when done.

### 5. Translate + tokenise

- Translate the headline and pull-quote to JA (natural, welcoming voice).
- If you AUTHORED the EN pull-quote (a summary, not a verbatim quote), run the
  `humanizer` skill on it. Verbatim quotes are left exactly as published.
- BudouX-tokenise the JA title and JA quote with `<wbr>` (see
  `references/data-entry.md`). Do NOT tokenise the EN text.
- No em dashes anywhere in the copy.

### 6. Add the entry

Load `references/data-entry.md` for the exact field contract. PREPEND the new
entry to the top of the list in `_data/media-coverage.yml` (newest first).

### 7. Verify

```bash
bundle exec jekyll build 2>&1 | grep -iE "error|warn" | head
# Expected: nothing referencing the new item

grep -c "—" _data/media-coverage.yml
# Expected: 0 (no em dashes in the data file copy)

ls assets/images/media-coverage/<year>/<slug>/thumb.jpg assets/images/media-coverage/<year>/<slug>/thumb.webp
# Expected: both exist

ls assets/images/media-coverage/sources/<source>.png
# Expected: exists

grep -c "media-card" _site/media-coverage/index.html
# Expected: increased vs before
```

### 8. Stop before commit

Print the changed/added files and a one-line commit message draft. Do NOT run
`git add`, `git commit`, or `git push`. The user reviews and commits.

## When this skill does NOT apply

- NAMBA-hosted events -> `_docs/events.md`
- Partner / external MTB events -> the `external-event` skill
- Blog posts, competitions, jobs -> their respective workflows
- Editing an existing coverage item -> edit `_data/media-coverage.yml` directly
