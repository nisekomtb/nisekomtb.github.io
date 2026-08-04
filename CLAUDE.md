# NAMBA Website — Claude Instructions

**Repo:** https://github.com/nisekomtb/nisekomtb.github.io  
**Live site:** https://namba.ngo  
**Stack:** Jekyll + GitHub Pages · HTML · CSS · Vanilla JS · Ecwid (shop)  
**Local dev:** `bundle exec jekyll serve --baseurl="" --open-url`  
**Deploy:** GitHub Actions (`.github/workflows/deploy.yml`) — builds Jekyll, minifies CSS/JS/HTML, deploys to Pages. See "Deploy pipeline" below.

NAMBA is the Niseko Area Mountain Bike Association — a nonprofit building trails and
community in Hokkaido, Japan, with the goal of making Niseko Asia's premier MTB destination.

---

## Rules (loaded automatically)

@.claude/rules/jekyll.md
@.claude/rules/bilingual.md
@.claude/rules/images.md
@.claude/rules/posts.md
@.claude/rules/copy.md

---

## Key constraints

- No JS frameworks (React, Vue, etc.) — vanilla JS only
- Do not replace or work around Ecwid for shop functionality
- `strict_front_matter: true` is set — invalid front matter will break the build
- Default permalink pattern: `/:categories/:title-:year/`
- The Node deps in `package.json` are **build-time only** (minifiers). Do not bring in runtime JS frameworks or bundlers — source CSS/JS in `assets/` is hand-authored and ships as-is to the browser after minification.

---

## Deploy pipeline

GitHub Pages is configured to deploy from the `Build and deploy` workflow in
`.github/workflows/deploy.yml`. The workflow:

1. Checks out the repo and sets up Ruby + Node (with bundler-cache + npm-cache).
2. Runs `bundle exec jekyll build` with `JEKYLL_ENV=production`.
3. Subsets the self-hosted JA font (`_site/assets/fonts/zen-maru-gothic/zen-maru-gothic-900.woff2`) down to the glyphs that actually render in heading elements via `_scripts/subset-ja-font.py` (~704KB → ~60KB). Build output only; the repo master is untouched. Fail-safe: leaves the full font in place on any error.
4. Minifies every non-vendor CSS file in `_site/` via `lightningcss --minify --error-recovery`.
5. Minifies every non-vendor JS file via `terser -c -m`.
6. Collapses whitespace and strips comments from every `_site/**/*.html` via `html-minifier-terser` (conservative settings — does not touch inline `<script>`/`<style>` content; preserves `<pre>`/`<textarea>`/JSON-LD).
7. Converts built iCal feeds (`_site/**/*.ics`) to CRLF line endings (RFC 5545). Source files stay LF.
8. Uploads `_site/` as the Pages artifact and deploys via `actions/deploy-pages`.

The trigger is `push` to `main` (and manual dispatch). Concurrency is capped at one
deploy in flight; subsequent pushes queue.

Source files in `assets/css/` and `assets/js/` stay readable. Minification only
runs against the build output — never against the working tree. Vendor files
already minified (`*.min.css`, `*.min.js`) are skipped.

**To re-run locally**: `npm install && bundle exec jekyll build && npm run subset:font && npm run minify:css && npm run minify:js && npm run minify:html`.

## What to do when starting a task

1. Check which page(s) are affected and whether a `/ja/` mirror is also needed
2. Confirm the correct `_layout` and any relevant `_includes` before writing markup
3. Always produce bilingual output — EN first, then JA — unless explicitly told otherwise
4. Reference `_docs/marketing-strategy.md` when creating or structuring new content pages

## Shop (Ecwid)

Products are managed in Ecwid, not the repo. When Tom adds new products, run the
audit + alt-text + JA-translation workflow in `_docs/ecwid-product-alts.md`. The
CLI is `_scripts/ecwid-helpers.py` and uses `ECWID_TOKEN` from `.env` (gitignored).
