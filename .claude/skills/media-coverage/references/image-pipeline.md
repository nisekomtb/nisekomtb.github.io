# Image pipeline: media coverage

All commands run from repo root. `<source>` is the file dropped into `_triage/`.
`<year>` is the publish year; `<slug>` is the source-prefixed kebab slug.

## Thumbnail (600x600, JPG + WebP)

The card serves the thumb as `<picture>` with a WebP `<source>` (swapping
`.jpg` -> `.webp`), so BOTH files must exist.

**ALWAYS remove black letterbox bars.** Many `og:image`s are video-style
thumbnails (YouTube/Vimeo/note.com) padded with solid black bars top+bottom (or
sides). Black bars must NEVER survive into a thumb. Before cropping, eyeball the
source; if it has bars, trim them first with `sharp-cli` (trims borders matching
the top-left pixel), then crop the trimmed file:

```bash
npx sharp-cli -i "assets/images/_triage/<source>" -o /tmp/mc-trim.png trim 15
# use /tmp/mc-trim.png as the crop input below
```

```bash
DIR="assets/images/media-coverage/<year>/<slug>"
mkdir -p "$DIR"

# Normalise to JPG, resize the longest side to <=900, then centre-crop 600x600.
sips -s format jpeg "assets/images/_triage/<source>" --out /tmp/mc-src.jpg >/dev/null
sips -Z 900 /tmp/mc-src.jpg --out /tmp/mc-900.jpg >/dev/null
sips -c 600 600 /tmp/mc-900.jpg --out "$DIR/thumb.jpg" >/dev/null
rm -f /tmp/mc-src.jpg /tmp/mc-900.jpg

cwebp -q 82 "$DIR/thumb.jpg" -o "$DIR/thumb.webp"
```

Alternatively, `npx sharp-cli -i <src> -o "$DIR/thumb.jpg" resize 600 600 --fit
cover --position attention` produces a clean square crop in one step (use
`attention` to keep the subject, `centre` for maps/graphics).

**ALWAYS eyeball the finished `thumb.jpg`.** Two things to catch:
- **Black bars** left behind (trim harder, or grab a `noPad`/original variant).
- **Wrong rotation.** Some phone photos carry an EXIF orientation tag that `sips`
  and `sharp` honour differently, yielding an upside-down/sideways thumb. Fix the
  finished file in place with `sips -r 180 "$DIR/thumb.jpg" --out "$DIR/thumb.jpg"`
  (or `-r 90` / `-r 270`), then regenerate the `.webp`.

If the crop lands badly (face or logo cut off), re-crop from a different offset
or ask the user for a better source. Apply the keep-smaller / quality guard from
project memory: faces q80+, scenes q72.

Delete the source when done: `rm "assets/images/_triage/<source>"`

## Publication logo (shared, once per outlet)

```bash
mkdir -p assets/images/media-coverage/sources
```

Download the outlet icon (apple-touch-icon preferred for resolution):

```bash
curl -sL "<logo-or-icon-url>" -o /tmp/mc-logo.png
```

Convert to a square transparent PNG. Prefer `npx sharp-cli` (preserves alpha;
`qlmanage` does not, per project memory):

```bash
npx sharp-cli -i /tmp/mc-logo.png -o assets/images/media-coverage/sources/<source>.png resize 128 128 --fit contain --background "#00000000"
```

If the source icon has no transparency (e.g. a JPG favicon), keep it on a
transparent canvas; do not fake transparency. The card sizes it to 20x20 on a
faint panel background, so a small opaque logo still reads fine.
