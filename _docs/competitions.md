# Competition Posts Reference

Layout: `competition` · Category: `competitions` · No dedicated index page

---

## Required fields

| Field | Type | Description |
|---|---|---|
| `layout` | String | Always `competition` |
| `categories` | String | Always `competitions` |
| `title` | String | Competition name |
| `startDate` | DateTime | Competition start |
| `days` | Integer | Duration in days |
| `location` | String | Venue name |

## Optional fields

| Field | Type | Description |
|---|---|---|
| `description` | String | Competition summary |
| `endDate` | DateTime | Explicit end date |
| `drawDate` | DateTime | Prize draw date |
| `permalink` | String | Custom URL (competitions often use non-default permalinks) |
| `price` | Various | Same patterns as events — `0`, string, or array |
| `address` | String | Full postal address |
| `partners` | Array | Same structure as events — each has `name`, `img`, `url` |
| `moreInfo` | Array of Strings | Additional info (can contain HTML) |
| `thumbnail` | String | Gallery card image |
| `masthead` | Object | Same structure as events — `img`, `credit.name`, `credit.url` |
| `og.image` | String | Open Graph image |
| `imgs` | Array of Strings | Gallery images displayed on the page |
| `noindex` | Boolean | Exclude from search engine indexing |
| `storeProductId` | Integer | Ecwid product ID for entry/ticket sales |

## Prizes

Defined in frontmatter (not in `_data/prizes.yml`):

```yaml
prizes:
  - title: Prize Name
    imgs:
      - /assets/images/competitions/2024/slug/prize1.jpg
    value: ¥45,000
    subtitle: Optional subtitle
    desc: Optional description
    sponsors:
      - name: Sponsor Name
        img: /assets/images/company/sponsor.png
        url: https://sponsor.com
    validity: Valid until 15 December 2024
```

Each prize needs `title` at minimum. All other fields are optional.

---

## Key differences from events

- Uses `competition` layout instead of `event`
- Schema.org JSON-LD is commented out (not active)
- Supports `endDate` and `drawDate` (events calculate end date from `startDate` + `days`)
- Supports `prizes` array in frontmatter
- Supports `imgs` array for a page gallery
- No `itinerary`, `form`, `host`, `parking`, or `about` support
