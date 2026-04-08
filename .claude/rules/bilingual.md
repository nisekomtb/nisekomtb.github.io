# Bilingual Rules (EN + JA)

Every page on namba.ngo has an English and Japanese version. This is non-negotiable —
always produce both unless explicitly told a page is English-only.
Use British English for English pages.

## URL structure

| English | Japanese |
|---|---|
| `/` | `/ja/` |
| `/events/` | `/ja/events/` |
| `/get-involved/` | `/ja/get-involved/` |
| `/twin-peaks/` | `/ja/twin-peaks/` |

The `/ja/` prefix is the only difference. File structure mirrors this exactly:

```
events/index.html
ja/events/index.html
```

## Language detection

Language is set automatically via `_config.yml` defaults:
- Root path → `lang: en`
- `ja/` path → `lang: ja`

Do not manually add `lang:` to front matter unless you need to override this.

## Japanese text

- The `.ja` CSS class in layouts applies `word-break: keep-all; overflow-wrap: break-word;`
- **Do NOT manually wrap Japanese text in `<span>` tags** — the layout CSS handles this
- Run JA text through BudouX CLI to insert zero-width spaces at word boundaries
- See `@_docs/bilingual.md` for the full BudouX workflow and data file conventions

## Output format

When producing bilingual page content, always structure output as:

```
### English (en)
[content]

### Japanese (ja)
[content]
```

This makes it easy to copy each block into the correct file.

## Translation quality

- Machine-translated Japanese is acceptable
- Preserve meaning and tone — NAMBA's voice is welcoming, active, community-focused
