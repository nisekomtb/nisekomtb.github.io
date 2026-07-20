# JA tokenisation

Two different rules apply: BudouX zero-width spaces for body paragraphs, `<wbr>` tags for select frontmatter fields.

## Frontmatter fields

| Field | Treatment |
|---|---|
| `title` | Plain JA text (used in `<title>` tag, OG tags, Schema.org `name`) |
| `description` | Plain JA text (meta description, OG, Schema.org `description`) |
| `descriptionHtml` | Same sentence tokenised with `<wbr>` — the masthead renders this for phrase-aware wrapping; keep `description` plain alongside it. Generate with `budoux --lang ja -s '<wbr>' -d "" "<sentence>"` |
| `address` | Plain JA text in Japanese postal format (used for Schema.org / postal data) |
| `location` | JA text with `<wbr>` tags at word boundaries |
| `price[].name` | JA text with `<wbr>` tags at word boundaries |
| `host.name` | Plain text, usually the partner's English brand name; do not localise |
| `link.text` | `イベント詳細` |

### Where to place `<wbr>` tags

Place `<wbr>` between words / between particles and content words. The browser uses these as soft break opportunities.

- `ニセコ<wbr>セントラル<wbr>ウェアハウス<wbr>グループ`
- `ヒグマ<wbr>コース`
- `ニセコ<wbr>アンヌプリ<wbr>国際スキー場`

When in doubt, prefer breaks between katakana phrases and between katakana and kanji. Don't break within a single katakana word.

## Body paragraphs

After translating each JA body paragraph, run it through BudouX to insert zero-width spaces (`U+200B`) at word boundaries:

```bash
budoux --lang ja -s $'​' -d "" "<paragraph>"
```

- `-s $'​'` is the separator (zero-width space)
- `-d ""` is the empty delimiter between sentences

The output replaces the original paragraph in the JA post. Headings with JA prose get the same treatment. Markdown structure (lists, headings, bold) survives, only paragraph text is tokenised.

Example:

Input:
```
雄大な羊蹄山を望むニセコの自然を舞台に、森林のトレイルや舗装路を組み合わせた多彩なコースを走る秋のサイクリングイベント。
```

Output (zero-width spaces shown as `​`):
```
雄大な​羊蹄山を​望むニセコの​自然を​舞台に、​森林の​トレイルや​舗装路を​組み合わせた​多彩な​コースを​走る​秋の​サイクリングイベント。
```

In the actual file these characters are invisible; they only affect line wrapping.

## What NOT to tokenise

- EN frontmatter on the JA post (e.g. `host.name`, `link.url`)
- Numbers and dates
- URLs
- Markdown syntax itself (`##`, `-`, `**`)
