# Bilingual Reference

Detailed conventions for the EN/JA bilingual system on namba.ngo.

---

## BudouX workflow

BudouX is a CLI tool that inserts zero-width spaces (U+200B) at Japanese word
boundaries, giving the browser line-break hints for better text wrapping.

**Content creation workflow:**
1. Write EN content
2. Machine translate to JA
3. Run JA text through BudouX:
   ```
   budoux --lang ja --html "Japanese text here"
   ```
4. Strip the outer `<span>` tag from the output — the layout's `.ja` CSS class
   already handles styling
5. Use the text (with embedded zero-width spaces) in the JA page

The zero-width spaces work alongside the `.ja` CSS class (`word-break: keep-all;
overflow-wrap: break-word;`) to produce clean Japanese text wrapping.

## `_data/` bilingual pattern

Data files use nested `.ja.*` properties for Japanese translations. Files that follow
this pattern:

- `_data/nav.yml` — navigation menu items
- `_data/hero.yml` — homepage hero slides
- `_data/team.yml` — team member names and titles
- `_data/sponsors.yml` — sponsor labels and URLs

### Flat pattern (nav)

```yaml
- en: Events
  ja: イベント
  url: /events/
```

### Nested pattern (team, hero)

```yaml
- name: Tom
  title: President
  ja:
    name: トム
    title: 会長
```

### Optional JA override (sponsors)

```yaml
- name: Sponsor Name
  url: https://example.com
  ja:
    label: スポンサー名    # Only if JA label differs
    url: https://example.jp  # Only if JA URL differs
```

When reading data in templates, check for the `.ja.*` property first, falling back to
the root property if no JA override exists.

## Hardcoded bilingual text in layouts and includes

When layouts or includes need bilingual text, use the standard conditional pattern:

```liquid
{% if page.lang == "en" %}English text{% else %}日本語テキスト{% endif %}
```

Files using this pattern:
- `_includes/nav.html` — menu labels, language switcher
- `_includes/hero-slides.html` — hero carousel text
- `_includes/hero.html` — main heading
- `_includes/masthead-crowdfund.html` — crowdfund header text
- `_includes/sponsors.html` — sponsor section labels
- `_includes/pdf.html` — PDF viewer locale
- `_layouts/event.html` — event detail labels
- `_layouts/job.html` — job detail labels ("Position Details" / "ポジション詳細")

## SEO and language linking

`_layouts/base.html` handles all bilingual SEO automatically:
- Sets `lang="{{ page.lang }}"` on the `<html>` tag
- Generates `hreflang` alternate links in `<head>` for EN ↔ JA
- Sets `og:locale` to `en_GB` or `ja_JP`
- Sets `og:site_name` to the English or Japanese site name

No manual SEO markup needed in individual pages.

## Language switcher

Located in `_includes/nav.html`:
- Toggles between `/path/` and `/ja/path/`
- Sets a cookie for language preference (365 days)
- Auto-detects browser language on first visit (EN or JA)
- Button text: "日本語" on EN pages, "English" on JA pages

## Legacy cleanup

Some older JA pages have two legacy patterns that can be cleaned up when encountered:

- **Manual `<span class="ja">` wrapping** — from before the `.ja` CSS class was added to
  layouts. Remove the `<span class="ja">` wrapper; the layout handles styling now.
- **`<wbr>` tags** — older versions of BudouX inserted `<wbr>` tags instead of
  zero-width spaces. These still work but the current approach uses zero-width spaces.
