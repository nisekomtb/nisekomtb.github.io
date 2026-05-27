# Responsive Images

Use the `{% include image.html %}` partial to emit `<picture>` markup with WebP fallback
and optional `srcset` for responsive sizing.

## When to use responsive variants

Add multiple width variants when:

- The image is full-bleed or close to it (heroes, mastheads, full-width sections)
- The image is shown large on desktop (>1200px wide)
- The page is performance-sensitive (homepage, landing pages)

Skip variants when:

- The image renders smaller than ~800px at all viewports (card thumbnails, inline figures)
- The original is already small (logos, icons, partner marks)

## Variant naming convention

Variants live alongside the source image with these suffixes:

```
image.jpg            ← original source (kept for non-WebP fallback)
image.webp           ← base tier (smallest WebP you ship)
image-large.webp     ← middle tier
image-xlarge.webp    ← largest tier
```

Recommended widths by use case:

| Use case | Base | Large | XLarge |
|---|---|---|---|
| Full-bleed hero / parallax | 1600 | 2400 | 3840 |
| Standard content image | 800 | 1600 | 2400 |
| Card thumbnail (no srcset needed) | 800 | — | — |

Match the base width to phone-class displays so mobile downloads stay small.

## Producing variants

Install ImageMagick once: `brew install imagemagick`.

Then from the image's folder:

```bash
magick image.jpg -resize 1600x -quality 82 image.webp
magick image.jpg -resize 2400x -quality 82 image-large.webp
magick image.jpg -resize 3840x -quality 82 image-xlarge.webp
```

The `-resize 1600x` form resizes by width and preserves aspect ratio. Quality 82 is a
good balance for WebP. Bump to 88 for portraits or shots with lots of fine detail.

For bulk conversion across a folder:

```bash
for f in *.jpg; do
  base="${f%.jpg}"
  magick "$f" -resize 1600x -quality 82 "${base}.webp"
  magick "$f" -resize 2400x -quality 82 "${base}-large.webp"
  magick "$f" -resize 3840x -quality 82 "${base}-xlarge.webp"
done
```

### macOS without ImageMagick

If ImageMagick isn't available, `cwebp` (from `brew install webp`) + the built-in `sips`
tool covers the same workflow:

```bash
# Resize source to target width as JPG, then encode to WebP
sips -Z 1600 image.jpg --out image-1600.jpg >/dev/null
cwebp -q 82 image-1600.jpg -o image.webp
rm image-1600.jpg
```

Going the other direction (WebP back to JPG, e.g. to add a JPG fallback for an existing
WebP-only image) uses `dwebp` + `sips`:

```bash
dwebp image.webp -o /tmp/_tmp.png
sips -s format jpeg -s formatOptions 85 /tmp/_tmp.png --out image.jpg
rm /tmp/_tmp.png
```

## Calling the include

Simple (WebP fallback only, no responsive sizing):

```liquid
{% include image.html src="/assets/images/foo/hero.jpg" alt="Description" %}
```

Responsive (3 tiers):

```liquid
{% include image.html
   src="/assets/images/foo/hero.jpg"
   alt="Description"
   widths="1600,2400,3840"
   sizes="100vw" %}
```

The first width maps to the unsuffixed WebP; second to `-large`; third to `-xlarge`.
You can pass 1, 2, or 3 widths.

### Parameters

| Param   | Required | Default | Notes |
|---|---|---|---|
| src     | yes | — | Path to JPG/PNG source. WebP variants must exist alongside. |
| alt     | yes | — | Bilingual: localise on each language version of the page. |
| widths  | no  | — | Comma-separated, 1-3 values. Triggers `srcset` output. |
| sizes   | no  | `100vw` | CSS `sizes` attribute. Only used when `widths` is set. |
| class   | no  | — | Class on `<img>`. |
| style   | no  | — | Inline style on `<img>`. |
| loading | no  | `lazy` | Use `eager` for above-the-fold imagery. |

## The sizes attribute

The browser uses `sizes` to decide which `srcset` entry to download. Match it to how the
image actually renders in CSS.

| Layout | sizes value |
|---|---|
| Full-bleed (no container) | `100vw` |
| Container, full width | `(min-width: 1200px) 1200px, 100vw` |
| Half-width on desktop, full on mobile | `(min-width: 768px) 50vw, 100vw` |
| Quarter-width on desktop, half on tablet, full on mobile | `(min-width: 1200px) 25vw, (min-width: 768px) 50vw, 100vw` |

Wrong `sizes` won't break the image. The browser will just pick a tier that's bigger
than needed (wasted bandwidth) or too small (looks soft). Iterate if you see issues in
DevTools' Network tab.

## JPG fallback

The include emits a single original JPG/PNG as the `<img>` fallback for browsers that
don't support WebP (~3% globally and shrinking). We do not produce responsive variants
of the JPG fallback — the cost of triple-encoding every image outweighs the benefit for
that small a slice of users.
