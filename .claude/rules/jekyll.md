# Jekyll Rules

## Structure

```
_layouts/      — page templates (default.html is the base)
_includes/     — reusable partials (header, footer, nav, etc.)
_data/         — YAML data files
_posts/        — English blog/news/events/competitions/jobs (dated filenames: YYYY-MM-DD-title.md)
assets/        — images, CSS, JS, Fonts, PDFs (all static files)
ja/            — Japanese mirror of all content pages
ja/_posts.     - Japanese mirror of _posts
```

## Front matter

- `strict_front_matter: true` is enabled — malformed front matter breaks the build
- Every page needs at minimum: `layout`, `title`
- Lang is set via `_config.yml` defaults — `en` for root, `ja` for `ja/` path — do not
  manually set `lang` in front matter unless overriding the default
- OG image defaults to `/assets/images/og/hero.jpg` — override per-page when page has a main image
- Available custom front matter keys: `masthead.img`, `masthead.credit.url`,
  `masthead.credit.name`, `og.image`

## Permalink

Default pattern is `/:categories/:title-:year/`. For pages (not posts) that don't use
categories, this falls back to the file path. Use explicit `permalink:` in front matter
when you need a clean URL that doesn't follow the default pattern.

## Layouts & includes

- Always check `_layouts/` and `_includes/` before writing new markup — prefer reusing
  existing partials over duplicating structure
- Do not modify `default.html` layout for page-specific changes — use page-level front
  matter or a new layout that extends default

## Do not

- Do not add Jekyll plugins not already in `Gemfile` — GitHub Pages only supports a
  specific allowlist
- Do not use Liquid `{% raw %}` blocks unless strictly necessary
- Do not leave `incremental: true` uncommented in `_config.yml` — it's intentionally
  disabled
