# NAMBA Website — Claude Instructions

**Repo:** https://github.com/nisekomtb/nisekomtb.github.io  
**Live site:** https://namba.ngo  
**Stack:** Jekyll + GitHub Pages · HTML · CSS · Vanilla JS · Ecwid (shop)  
**Local dev:** `bundle exec jekyll serve --baseurl="" --open-url`

NAMBA is the Niseko Area Mountain Bike Association — a nonprofit building trails and
community in Hokkaido, Japan, with the goal of making Niseko Asia's premier MTB destination.

---

## Rules (loaded automatically)

@.claude/rules/jekyll.md
@.claude/rules/bilingual.md
@.claude/rules/images.md
@.claude/rules/posts.md

---

## Key constraints

- No npm, webpack, or build pipelines — this is a pure Jekyll/GitHub Pages site
- No JS frameworks (React, Vue, etc.) — vanilla JS only
- Do not replace or work around Ecwid for shop functionality
- `strict_front_matter: true` is set — invalid front matter will break the build
- Default permalink pattern: `/:categories/:title-:year/`

## What to do when starting a task

1. Check which page(s) are affected and whether a `/ja/` mirror is also needed
2. Confirm the correct `_layout` and any relevant `_includes` before writing markup
3. Always produce bilingual output — EN first, then JA — unless explicitly told otherwise
4. Reference `_docs/marketing-strategy.md` when creating or structuring new content pages
