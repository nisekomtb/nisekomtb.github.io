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

## Camera photos: apply EXIF orientation first

Phone and camera JPEGs carry an EXIF Orientation tag, and the pixels are stored
unrotated. Preview, Finder and browsers apply it; PIL's `Image.open()` does not.
Processing straight from `open()` therefore ships a sideways image that looked
fine everywhere you checked it.

Always transpose before anything else:

```python
from PIL import Image, ImageOps
im = ImageOps.exif_transpose(Image.open(src)).convert('RGB')
```

Check before you crop, too: a photo that reads as portrait may be landscape once
the tag is applied, which changes the crop entirely. `sips -g orientation` often
reports `<nil>` on these files, so read the tag itself:
`python3 -c "from PIL import Image; print(Image.open('f.jpg').getexif().get(274))"`
Anything other than `1` or `None` needs transposing.

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

- Partner images require transparency, and should be good enough quality to be viewed as
  large icons.
- **Greyscale is done in CSS, not with a second file.** `_includes/partners-wall.html`
  carries a scoped `<style>` block that rests every logo at `filter: grayscale(100%)` and
  `opacity: 0.35`, then returns it to `grayscale(0%)` and full opacity on
  `.partners-wall .partner:hover`. Supply one colour file per partner and nothing else.
- Do **not** add `.g`-suffixed greyscale variants. That convention was retired on
  2026-08-24 and the 24 remaining `.g` files were removed: an audit of the built site
  found none of them referenced, because the CSS filter had already replaced them.
