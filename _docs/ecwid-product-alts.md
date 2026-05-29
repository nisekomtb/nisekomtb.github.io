# Ecwid shop: product alts + SEO workflow

How to add image alt text and SEO fields to new products when Tom adds them to
the Ecwid store. Everything is done via the Ecwid REST API so we don't have to
click through the admin UI for ~100 fields per product.

## When to use this

Tom adds a new product (or images to an existing product) in Ecwid. The new
product/images won't have alt text in EN or JA, and may be missing JA
translations on `description`, `seoTitle`, `seoDescription`. Run this workflow
to fill the gaps.

## Prerequisites

- A `.env` file at the repo root with `ECWID_TOKEN=secret_...` (gitignored).
  The token comes from Ecwid > Apps > Custom Apps; ask Tom to generate one
  with read+write product access if it's missing.
- Python 3.10+ (stdlib only, no pip deps).

## Token hygiene

- Never echo the token into terminal output, commits, or messages.
- After a session, either delete the `ECWID_TOKEN=` line from `.env` or ask
  Tom to revoke the token in Ecwid > Apps > Custom Apps.

## End-to-end workflow

### 1. Confirm the token works and audit current state

```bash
python3 _scripts/ecwid-helpers.py ping
python3 _scripts/ecwid-helpers.py audit
```

`audit` lists every enabled product and what's missing: `desc-JA`,
`seoTitle-JA`, `seoDesc-JA`, and per-image `alt.main / alt.en / alt.ja`
counters. Products with no gaps print `OK`.

If everything is `OK`, you're done. Otherwise continue.

### 2. Back up current state

```bash
python3 _scripts/ecwid-helpers.py dump
```

Writes `/tmp/ecwid-before.json`. Always do this before any write operation so
the previous state is recoverable.

### 3. Fill missing JA translations in the Ecwid admin (if any)

JA versions of `description`, `seoTitle`, `seoDescription` and `subtitle` can
also be set via the API (PUT `/products/{id}` with `descriptionTranslated`,
`seoTitleTranslated`, etc.), but for body copy it's usually nicer to compose
EN+JA together with a translator and paste through the admin UI under
*Catalog > Products > [product] > General > Languages*.

If you'd rather script it, the `descriptionTranslated`, `seoTitleTranslated`,
`seoDescriptionTranslated`, `subtitleTranslated` fields all take a
`{"en": "...", "ja": "..."}` object.

### 4. Download thumbnails so you can actually see the images

```bash
python3 _scripts/ecwid-helpers.py thumbs
```

Downloads 400px JPEGs of every image on every enabled product to
`/tmp/ecwid-thumbs/{product_id}_{index:02d}.jpg`. Idempotent; only fetches
missing files.

### 5. Draft alts per image

For each new image, open the thumbnail with the `Read` tool and write a real
description of what the image shows. **Do not** fall back on "Product Name
photo 3" templates.

Style rules (matches NAMBA's house style):

- **EN**: British English. Describe colour, view (front/back/detail), what's
  shown in the print. Reference the designer's name where known (Joe Scott,
  Aikawa Mitsugu, Luke Sandalls, Frances Treveil, Scott Wentworth, Peter
  Martin). For lifestyle shots, describe what the rider is doing.
- **JA**: Mirror the EN content. Tokenisation isn't required for alt text
  (it's not visible in flow layout).
- **No em dashes** in either language. Use commas, colons, or a fresh
  sentence. (See `~/.claude/.../feedback_no_em_dash.md`.)
- Skip alt text that just repeats the product name. Screen-reader users get
  the product name from the page heading; the alt should add information.
- Keep each alt under ~180 characters.

Stage the alts in a JSON file. Conventional location: `/tmp/ecwid-alts.json`.
Shape:

```json
{
  "785455012": {
    "name": "Twin Peaks Badge T-Shirt",
    "alts": [
      { "en": "Twin Peaks Badge T-Shirt in lavender, front and back views...",
        "ja": "ラベンダーのTwin Peaks Badge Tシャツ。前面と背面..." },
      { "en": "...image[1]...", "ja": "..." }
    ]
  }
}
```

The `alts` array must have **exactly one entry per image, in the same order
as `media.images`** on the product. The script bails with a `WARN` if counts
don't match.

You can include only the products that need updates. Existing products with
correct alts can be left out of the file.

### 6. Apply the alts

```bash
python3 _scripts/ecwid-helpers.py apply-alts /tmp/ecwid-alts.json
```

Per image, this PUTs:

```json
{
  "alt": {
    "main": "<EN copy>",
    "translated": { "en": "<EN copy>", "ja": "<JA copy>" }
  }
}
```

`alt.main` is what populates the *Default* field in Ecwid's admin UI, and is
the string Ecwid uses where no per-language translation is available
(Google Shopping feed, XML sitemap, etc.). `alt.translated.{en,ja}` are the
per-language versions; only `en` and `ja` are valid keys because those are
the two languages enabled on the store.

### 7. Verify

```bash
python3 _scripts/ecwid-helpers.py audit
```

Every product should print `OK`.

Spot-check one in the Ecwid admin (Catalog > Products > [product] > Images >
click an image) to confirm the *Default*, EN, and JA alt text are populated.

### 8. Clean up

- Remove `/tmp/ecwid-alts.json` if you don't need it any more (it's just
  staging).
- Either clear the `ECWID_TOKEN` line in `.env` or have Tom revoke it.

## Notes and gotchas

- **`alt.main` vs `alt.translated.en`**: `main` is a separate field, not a
  pointer to `translated[defaultLanguage]`. If you set only `translated.en`
  and `translated.ja`, the admin UI's *Default* field stays blank, even
  though `defaultLanguage` is `en`. Always set `main` too. The
  `apply-alts` command does this for you.
- **Don't use `translated.default`**: that's not a documented key. The API
  accepts it without error but it does nothing useful. The `apply-alts`
  command overwrites the whole `translated` map on each PUT, so any stray
  `default` entries get cleared.
- **Storefront rendering**: as of writing, Ecwid's storefront only emits a
  real `<img alt>` attribute on the *main* image and uses the product name
  rather than the per-image alt. Gallery images render as CSS
  background-image divs with `aria-label="[Product Name] [index]"`. The alts
  we set are still consumed by Ecwid's Google Shopping feed, XML sitemap
  exports, and the photoswipe lightbox in their newer themes, so they're
  worth setting even though they're not visible in the current storefront
  DOM.
- **Image dimensions**: Ecwid auto-resizes uploads to 160 / 400 / 800 /
  1500px variants. As long as the original is reasonable (under ~2MB), no
  manual resizing is needed before upload.
- **Rate limiting**: the apply script sleeps 300ms between products. Hasn't
  hit any limits with 15 products. If we ever scale to hundreds, switch to
  Ecwid's batch endpoint.

## File reference

- `_scripts/ecwid-helpers.py`: the CLI (read + write).
- `/tmp/ecwid-before.json`: pre-change backup.
- `/tmp/ecwid-thumbs/`: downloaded thumbnails.
- `/tmp/ecwid-alts.json`: staged alts (not committed).
