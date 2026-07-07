# Image pipeline

All commands run from repo root. `<source>` is the filename of the image dropped into `_triage/`. `<year>` and `<slug>` are derived from the post's `startDate` + EN title.

## 0. Ensure the destination folder exists

```bash
mkdir -p assets/images/events/<year>/<slug>
```

## 1. Resize source to 2000px wide JPG (the masthead base)

`-s format jpeg` forces conversion to JPG (matters if the source is a WebP or PNG):

```bash
sips -s format jpeg -Z 2000 "assets/images/_triage/<source>" \
  --out "assets/images/events/<year>/<slug>/header.jpg"
```

`-Z` resizes the longest dimension to fit within 2000px, preserving aspect ratio.

## 2. Generate the four WebP variants

The masthead include (`_includes/masthead.html`) expects these exact names. Run from repo root (do NOT `cd` into the subdir, working dir persists between tool calls and breaks subsequent steps):

```bash
DIR="assets/images/events/<year>/<slug>"

# 400w mobile
sips -Z 400 "$DIR/header.jpg" --out /tmp/h400.jpg >/dev/null
cwebp -q 82 /tmp/h400.jpg -o "$DIR/header-mobile.webp"
rm /tmp/h400.jpg

# 800w base
sips -Z 800 "$DIR/header.jpg" --out /tmp/h800.jpg >/dev/null
cwebp -q 82 /tmp/h800.jpg -o "$DIR/header.webp"
rm /tmp/h800.jpg

# 1200w medium
sips -Z 1200 "$DIR/header.jpg" --out /tmp/h1200.jpg >/dev/null
cwebp -q 82 /tmp/h1200.jpg -o "$DIR/header-medium.webp"
rm /tmp/h1200.jpg

# 1600w large
sips -Z 1600 "$DIR/header.jpg" --out /tmp/h1600.jpg >/dev/null
cwebp -q 82 /tmp/h1600.jpg -o "$DIR/header-large.webp"
rm /tmp/h1600.jpg
```

## 3. Generate the 600×600 centre-cropped thumbnail (JPG + WebP)

The event-card include (`_includes/event-card.html`) serves the thumbnail as a
`<picture>` with a WebP `<source>` (it swaps `.jpg` -> `.webp`), so BOTH files
must exist or the card shows a broken/empty thumb.

```bash
DIR="assets/images/events/<year>/<slug>"

sips --resampleHeight 600 "$DIR/header.jpg" --out /tmp/thumb-tmp.jpg >/dev/null
sips -c 600 600 /tmp/thumb-tmp.jpg --out "$DIR/thumb.jpg" >/dev/null
rm /tmp/thumb-tmp.jpg

cwebp -q 82 "$DIR/thumb.jpg" -o "$DIR/thumb.webp"
```

For a portrait source (unusual for hero shots), swap `--resampleHeight 600` for `--resampleWidth 600`.

## 4. Generate the masthead AVIF tiers

The masthead partial (`_includes/masthead.html`) emits an AVIF `<source>` FIRST,
mirroring the WebP srcset. Browsers that support AVIF select that source; if the
`.avif` files are missing they 404 and the masthead renders blank (they do NOT
fall back to the WebP source once AVIF is chosen). The generator script keys off
`-medium.webp` siblings and encodes one AVIF per WebP tier from the JPG master:

```bash
python3 _scripts/gen-masthead-avif.py --root assets/images/events/<year>/<slug>
# Expected: "4 created" (idempotent; re-running skips existing)
```

## 5. Delete the source from triage

```bash
rm "assets/images/_triage/<source>"
```

## 6. Verify

```bash
ls assets/images/events/<year>/<slug>/
# Expected: header.jpg
#           header-mobile.webp  header.webp  header-medium.webp  header-large.webp
#           header-mobile.avif  header.avif  header-medium.avif  header-large.avif
#           thumb.jpg  thumb.webp
```
