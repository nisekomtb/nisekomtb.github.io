# Job Posts Reference

Layout: `job` · Category: `jobs` · Index: `jobs/index.html`

---

## Required fields

| Field | Type | Description |
|---|---|---|
| `layout` | String | Always `job` |
| `categories` | String | Always `jobs` |
| `title` | String | Job title |
| `isOpen` | Boolean | `true` shows on index and enables apply button; `false` hides listing |

## Optional fields

| Field | Type | Description |
|---|---|---|
| `description` | String | Job summary |
| `startDate` | String | Start date — can be a date or `"IMMEDIATE"` |
| `endDate` | String | Contract end date |
| `location` | String | Work location |
| `term` | String | Employment duration, e.g. `"1st May - 31st October"` |
| `workingHours` | String | Hours description, e.g. `"8 hrs a day / 5 days a week"` |
| `pay` | String | Compensation, e.g. `"¥1,800 per hour"` |
| `bonus` | String | Bonus info |
| `perks` | Array | Benefits — each has `title` and `perk` (see below) |
| `applyUrl` | String | Application URL — Google Form link or `mailto:` address |
| `masthead` | Object | Same structure as events — `img`, `credit.name`, `credit.url` |
| `og` | Object | OG image + Schema.org employment fields (see below) |
| `canonical` | String | Canonical URL for superseded listings |
| `redirect` | Boolean | Redirect to canonical URL |

## Schema.org employment fields

Nested under `og` alongside the OG image:

```yaml
og:
  image: /assets/images/jobs/trail-crew.jpg
  employmentType: TEMPORARY    # TEMPORARY, VOLUNTEER, etc.
  startDate: 2026-05-01        # ISO date for structured data
  pay: 1800                    # Numeric value for structured data
  payUnit: HOUR                # HOUR, MONTH, etc.
```

These are used by the `job.html` layout to generate Schema.org JobPosting JSON-LD.

## Perks

```yaml
perks:
  - title: Staff bike
    perk: Free use NAMBA's staff bikes
  - title: Training
    perk: Training provided at full pay
  - title: Subsidized accommodation
    perk: Available in Niseko Hirafu
```

Each perk needs `title` and `perk`.

---

## Key differences from events/competitions

- Uses `isOpen` (not `draft`) to control visibility — index page filters by
  `isOpen: "true"`
- `isOpen` also controls the apply button and the "Open"/"募集中" status label
- No pricing, itinerary, partners, or Ecwid integration
- Simpler frontmatter — mostly flat string fields
- Schema.org JobPosting structured data (not Event)
- Supports `canonical` + `redirect` for superseded job listings
