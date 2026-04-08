# Event Posts Reference

Layout: `event` · Category: `events` · Index: `events/index.html`

---

## Required fields

| Field | Type | Description |
|---|---|---|
| `layout` | String | Always `event` |
| `categories` | String | Always `events` |
| `title` | String | Event name |
| `startDate` | DateTime or Date | Event start — see format variations below |
| `days` | Integer | Number of days the event spans |
| `location` | String | Venue name |
| `price` | Various | See price variations below |

## Optional fields

### Display

| Field | Type | Description |
|---|---|---|
| `description` | String | Event summary (used in meta description and Schema.org) |
| `time` | String | Time range, e.g. `"9:00am - 4:00pm"` |
| `thumbnail` | String | Image path for gallery card |
| `masthead.img` | String | Header image path |
| `masthead.credit.name` | String | Photographer name |
| `masthead.credit.url` | String | Photographer URL |
| `og.image` | String | Open Graph image path |

### Venue

| Field | Type | Description |
|---|---|---|
| `address` | String | Full postal address |
| `parking` | Boolean | Show parking info section |

### Organisations

| Field | Type | Description |
|---|---|---|
| `host` | Object | Primary organiser — `name`, `img`, `url` |
| `partners` | Array | Co-hosts/sponsors — each has `name`, `img`, `url` |

Partner `img` paths are relative to `/assets/images/company/`.

### Content sections

| Field | Type | Description |
|---|---|---|
| `about` | Boolean | Show NAMBA about section |
| `moreInfo` | Array of Strings | Additional info items (can contain HTML) |

### Schedule

| Field | Type | Description |
|---|---|---|
| `itinerary` | Object | Multi-day schedule — see structure below |

### Registration & sales

| Field | Type | Description |
|---|---|---|
| `signup` | String | External sign-up URL — renders a centred primary button after content, before itinerary. Button text is bilingual ("Sign up here" / "申し込みはこちら") |
| `form` | Object | Embedded form — `url` (Google Form embed URL), `height` (px) |
| `storeProductId` | Integer | Ecwid product ID for ticket/merchandise sales |

### Special behaviour

| Field | Type | Description |
|---|---|---|
| `cancelled` | Boolean | Shows "Cancelled" ribbon on event card and page |
| `override_url` | String | Links to external event page instead of local post |
| `draft` | Boolean | `true` hides from index listings |

---

## Field variations

### `startDate`

```yaml
# Date only
startDate: 2025-07-21

# With time and timezone
startDate: 2025-07-21 09:00:00 +0900
```

Both work. Use the time+timezone format when the event has a specific start time.

### `price`

```yaml
# Free event
price: 0

# Single price
price: ¥3,000

# Tiered pricing (array)
price:
  - name: MTB 1 time ticket
    adult: ¥1,200
    child: ¥600
  - name: MTB 4 hour ticket
    adult: ¥3,500
    child: ¥1,750
```

When using tiered pricing, each item needs `name` and `adult`. `child` is optional.

### `itinerary`

```yaml
itinerary:
  days:
    - hasLocations: true       # Show location column in timetable
      events:
        - time: "9:00am"
          name: Registration
          location: Hirafu Welcome Centre    # String
        - time: "10:00am"
          name: Trail ride
          location:                          # Object with map link
            name: Twin Peaks Trailhead
            url: https://maps.google.com/...
        - time: "3:00pm"
          name: Prize draw
          cancelled: true                    # Strikethrough in timetable
    - hasLocations: false      # Day 2, no location column
      events:
        - time: "9:00am"
          name: Free riding
```

`location` in itinerary events can be a plain string or an object with `name` and `url`.

### `host` and `partners`

```yaml
# Single host
host:
  name: NAMBA
  img: namba.png           # Relative to /assets/images/company/
  url: https://namba.ngo

# Multiple partners
partners:
  - name: Rhythm Japan
    img: /rhythm.png
    url: https://rhythmjapan.com
  - name: Fox
    img: /fox.png
    url: https://www.ridefox.com
```

---

## Images

Each event needs a header image and a thumbnail, stored under
`assets/images/events/{year}/{event-slug}/` (year and slug from the post filename).

| Image | Size | Notes |
|---|---|---|
| Header (`header.jpg`) | 2000px wide | Used as `masthead.img` |
| Thumbnail (`thumb.jpg`) | 504 x 672px | Used as `thumbnail` for gallery card |

Generate the thumbnail from the centre of the header image. If an image is provided,
resize it to the appropriate sizes.

---

## Notes

- The `event.html` layout auto-generates Schema.org Event JSON-LD from frontmatter — no
  manual structured data needed.
- When `storeProductId` is set, the Ecwid widget renders automatically.
- When `override_url` is set, the gallery card links externally (`target="_blank"`)
  instead of to the post page.
- Events with dates in the past automatically show an "Ended" ribbon — handled by JS in
  the layout, not frontmatter.
