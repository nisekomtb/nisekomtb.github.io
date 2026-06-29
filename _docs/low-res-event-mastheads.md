# Low-resolution event mastheads (to re-source later)

These six **event header** images have source JPGs smaller than the masthead's
`-medium` (1200w) and/or `-large` (1600w) tiers, so those WebP/AVIF tiers are
**upscaled** from a smaller original. It is only visible on large/desktop screens,
behind the masthead scrim. Pre-existing (predates the AVIF work); nothing is broken.

| Source JPG | Master width | Upscaled tiers |
|---|---|---|
| `assets/images/events/2023/closing-weekend/header.jpg` | 1500w | `-large` (1600) |
| `assets/images/events/2024/downhill-series/header.jpg` | 1080w | `-medium` (1200), `-large` (1600) |
| `assets/images/events/2024/hirafu-bike-park-opens/header.jpg` | 800w | `-medium`, `-large` |
| `assets/images/events/2024/rusutsu-dig-ride/header.jpg` | 1100w | `-medium`, `-large` |
| `assets/images/events/2025/niseko-mtb-weekend/header.jpg` | 1334w | `-large` |
| `assets/images/events/2025/niseko-twin-trail-ride/header.jpg` | 1198w | `-medium`, `-large` |

## How to fix (when a higher-res original is available)

For each one, replace `header.jpg` with a ≥1600w original, then regenerate both formats:

1. Regenerate the WebP tiers per `_docs/responsive-images.md` (masthead scheme:
   `-mobile` 400w, base 800w, `-medium` 1200w, `-large` 1600w).
2. Delete the stale AVIF siblings for that header (so they re-encode from the new
   master), then run `python3 _scripts/gen-masthead-avif.py`.
3. Rebuild and confirm the new tiers are sharp and still smaller as AVIF than WebP.

No code changes needed, only better source images.
