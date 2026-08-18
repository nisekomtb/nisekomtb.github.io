# Image Rules

## Source & storage

- Source images come from Google Photos albums
- Images are downloaded locally and stored in the `/assets/images/` folder in the repo
- **Never hotlink Google Photos URLs** — they expire and break
- Always reference images via local `images/` paths

## Folder conventions

```
assets/
  images/
    og/          — Open Graph images (1200×630px)
    [page-slug]/ — Page-specific images grouped by section or page
```

Follow the existing folder pattern when adding images for a new page. For example,
images for a `trails/` page would go in `assets/images/trails/`.

## In markup

Always include meaningful `alt` text. For bilingual pages, provide alt text in both
languages — either use the same attribute value if it's descriptive enough in context,
or note that the JA page needs a localised alt attribute.

```html
<!-- English page -->
<img src="/assets/images/trails/header.jpg" alt="Riders descending the Twin Peaks trail">

<!-- Japanese page -->
<img src="/assets/images/trails/header.jpg" alt="ツインピークストレイルを下るライダー">
```

## Responsive sizes

For new imagery, prefer `{% include image.html %}` over raw `<img>`. It emits WebP
fallback automatically and accepts a `widths="..."` param to produce a responsive
`srcset` across `base / -large / -xlarge` WebP variants.

See `@_docs/responsive-images.md` for the full workflow (when to use variants, naming
convention, ImageMagick resize commands, `sizes` attribute guide).

## OG images

- Default OG image is `/assets/images/og/hero-2026-08.jpg` (set in `_layouts/base.html`). Rename with a fresh year suffix (e.g. `hero-2027.jpg`) when refreshing so the file URL changes and external scrapers (LinkedIn, Slack, etc.) re-fetch.
- Override per page using `og.image` in front matter, using the main image of the page as the open
  graph image:

```yaml
og:
  image: /assets/images/og/trails.jpg
```

- OG images should be 1200×630px
- Optimise all images before committing — avoid large uncompressed files in the repo

## Partner images

- Partner images require transparency, and should we good enough quality to be viewed as large icons.
- Each partner icon requires a grey scale version, suffixed with `.g` which is displayed initially,
  with colour version displayed on hover.
