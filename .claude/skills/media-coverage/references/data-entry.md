# Data entry contract: `_data/media-coverage.yml`

PREPEND new items (newest first). One entry, both languages.

```yaml
- slug: <source>-<kebab-title>          # e.g. pinkbike-cruise-control-niseko
  date: <YYYY-MM-DD>                     # publish date; drives sort + "recent"
  type: article                          # article | video | podcast | print | tv
  source: <lowercase-key>                # -> sources/<source>.png
  sourceName: <Publication display name> # e.g. Pinkbike
  thumb: /assets/images/media-coverage/<year>/<slug>/thumb.jpg
  title:
    en: "<Headline, verbatim from source>"
    ja: "<Translated headline with <wbr> tokens>"
  quote:
    en: "<Pull-quote or one-line summary>"
    ja: "<Translated quote with <wbr> tokens>"
  url:
    en: <EN source URL, or omit if none>
    ja: <JA source URL, or omit if none>
```

## Rules

- `thumb` is the `.jpg` path; the card derives the `.webp` sibling automatically.
- `title` / `quote`: EN plain; JA tokenised with `<wbr>` at word boundaries
  (between katakana phrases, between katakana and kanji; never inside one word).
  These render as visible card text, so they follow the JA front-matter
  tokenisation rule. The card strips `<wbr>` from the tooltip `title` attribute
  automatically, so tokenised JA titles are safe.
- `url`: at least one of `en` / `ja` is required. The card links the page-
  language URL, falling back to the other. The EN/JA language badge is derived
  from which keys are present.
- No em dashes. No `title` / `quote` value left blank.

## BudouX for JA title + quote

`<wbr>` tags (not zero-width spaces) for these short display strings:

- `今月のトレイル：<wbr>ニセコの<wbr>クルーズコントロール`

Place `<wbr>` between katakana phrases and between katakana and kanji. Do not
break within a single katakana word, inside numbers, dates, or URLs.
