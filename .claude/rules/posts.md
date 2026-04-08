# Posts

All posts live in `_posts/` (EN) and `ja/_posts/` (JA). Always create both versions.
Filename format: `YYYY-MM-DD-slug.md`.

## Post types

| Type | Layout | Category | Index page | Reference |
|---|---|---|---|---|
| Event | `event` | `events` | `events/index.html` | `@_docs/events.md` |
| Competition | `competition` | `competitions` | No dedicated index — standalone pages | `@_docs/competitions.md` |
| Job | `job` | `jobs` | `jobs/index.html` | `@_docs/jobs.md` |

## Minimum required fields

- **Event:** `layout`, `categories`, `title`, `startDate`, `days`, `location`, `price`
- **Competition:** `layout`, `categories`, `title`, `startDate`, `days`, `location`
- **Job:** `layout`, `categories`, `title`, `isOpen`

All post types also commonly use `description`, `thumbnail`, `masthead`, and `og.image`.

## Before creating or editing a post

Check the relevant `_docs/` reference doc for the full schema, field types, variations,
and examples.
