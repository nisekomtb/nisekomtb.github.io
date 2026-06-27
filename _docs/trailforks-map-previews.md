# Trailforks map preview images

The park pages (`_layouts/where-to-ride.html`) show the interactive Trailforks map
behind a click-to-load facade (see `_docs/superpowers/specs/2026-06-26-trailforks-map-facade-design.md`).
The facade displays a lightweight static **preview** of the map so visitors see the
real trail network before loading the ~3MB interactive widget.

These previews are snapshots, so they go stale if the trail map changes
substantially. Regenerate them with the procedure below (no live third-party
dependency, no API key — the previews are plain WebP files in the repo).

## Where they live

Wired via `map_preview:` in `_data/trails.yml` per park:

| Park key | rid | Preview file |
|---|---|---|
| twinpeaks | 58775 | `assets/images/twinpeaks/map-preview.webp` |
| grand-hirafu | 58866 | `assets/images/trails/grand-hirafu/map-preview.webp` |
| annupuri | 66231 | `assets/images/trails/annupuri/map-preview.webp` |
| hanazono | 74136 | `assets/images/trails/hanazono/map-preview.webp` |

A park with no `map_preview` simply shows the plain loader overlay (no image) — the
facade still works.

## Regenerate (per park)

Requires a local Jekyll server and a browser you can drive (the Playwright MCP
browser used during development works well). `cwebp` (Homebrew `webp`) for encoding.

1. Serve the site locally:
   ```bash
   bundle exec jekyll serve --baseurl="" --port 4000
   ```
2. In the browser at a desktop viewport (e.g. 1280×900), open the park root page:
   `/twin-peaks/`, `/where-to-ride/annupuri/`, `/where-to-ride/grand-hirafu/`,
   `/where-to-ride/hanazono/`.
3. Click the **Load interactive map** button and wait ~6s for the Mapbox tiles to
   finish rendering.
4. Screenshot just the map element (`.TrailforksWidgetMap`) to a PNG. With the
   Playwright MCP browser this is an element screenshot targeting that selector;
   it captures the cross-origin iframe's rendered pixels. Captures are ~915×608.
5. Encode to WebP and drop it in the table's path:
   ```bash
   cwebp -q 80 map-<park>-raw.png -o assets/images/<...>/map-preview.webp
   rm map-<park>-raw.png
   ```
6. Rebuild and visually confirm the facade shows the new preview, then commit the
   `.webp` files.

## Notes

- EN and JA park pages share the same preview (maps are language-agnostic).
- The preview `<img>` uses `alt=""` (decorative — the loader button carries the
  accessible label) and explicit `width`/`height` to avoid layout shift.
- Keep `-q 80`; it lands each preview around 55-80KB, which is the whole point
  versus the 3MB live widget.
