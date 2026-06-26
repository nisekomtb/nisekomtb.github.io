# PageSpeed Insights audit workflow

How to audit every live page on namba.ngo against Google PageSpeed Insights,
prioritise fixes, and verify the gains after deploy. Driven by
`_scripts/psi-audit.py` (stdlib only, no pip deps).

## When to use this

- Periodically, to catch performance regressions across the whole site.
- After shipping a performance fix, to confirm the score actually moved
  (audit before, deploy, audit after, `diff`).

## The one constraint that shapes the loop

PSI scores the **live, deployed** site, not your working tree. Your edits only
reach namba.ngo after you push and the GitHub Actions deploy finishes (~2 min).
So the loop is **not** "edit → re-score the same page locally". It is:

1. **Audit-wide** — score every live URL, get a ranked report. (this script)
2. **Fix** — batch edits locally. Most PSI findings on this static Jekyll site
   are site-wide (shared layout/include/asset), so one fix lifts many pages.
3. **Deploy** — Tom pushes; GitHub Actions rebuilds and redeploys.
4. **Verify** — re-run the audit and `diff` the new report against the old.

## Prerequisites

- A `.env` file at the repo root with `PSI_API_KEY=...` (gitignored). Get a free
  key from Google Cloud Console: enable the *PageSpeed Insights API*, then
  **Create credentials → API key** (a plain API key — not OAuth, not a service
  account; PSI is a public API). Restrict the key to the PageSpeed Insights API.
- Python 3.10+ (stdlib only).

Without a key the API works but throttles to a few calls before returning 429,
so a key is required for any batch run.

## Key hygiene

- Never echo the key into terminal output, commits, or messages.
- The key only grants read access to a public scoring API, but treat it like
  any secret: keep it in `.env`, which is gitignored.

## Quota — why pacing matters

The free PSI quota is **240 queries per minute**. A full run is
128 URLs × 2 strategies × 5 runs = 1,280 calls, so an unpaced burst trips the
limit immediately. The script caps the aggregate request rate (`--rate`,
default 180/min) across all worker threads, and retries 429/500 with
exponential backoff. Leave the defaults alone unless you raise the quota in
Cloud Console.

## Commands

```bash
# Full sitemap audit (mobile + desktop, median-of-5)
python3 _scripts/psi-audit.py audit

# Mobile only — where the problems and the ranking signal are. Faster.
python3 _scripts/psi-audit.py audit --strategy mobile

# A quick smoke test before a big run
python3 _scripts/psi-audit.py audit --limit 5

# Just a section
python3 _scripts/psi-audit.py audit --filter twin-peaks

# Re-audit a specific set (e.g. URLs that failed last time)
python3 _scripts/psi-audit.py audit --url-file .lighthouse/retry-urls.txt

# Compare two reports after a deploy
python3 _scripts/psi-audit.py diff old-report.json new-report.json
```

Useful flags: `--runs N` (median sample size, default 5), `--concurrency N`
(default 8), `--rate N` (calls/min ceiling, default 180), `--strategy
mobile|desktop|both`.

A full run is long (PSI takes ~10s per call server-side). Run it in the
background and check the report when it lands.

## Output

Reports are written to `.lighthouse/` (gitignored) with a UTC timestamp:

- `psi-report-<stamp>.json` — full results, one record per URL+strategy. Feed
  this to `diff`.
- `psi-report-<stamp>.md` — human summary:
  - **Scores (lowest first)** — score + LCP/CLS/TBT per URL+strategy. Triage top.
  - **Opportunities by reach** — each finding ranked by how many pages it hits.
    This is the workhorse: a finding on ~all pages is almost always a single
    shared-asset fix, so fix it once rather than per page.

## Interpreting results — what is and isn't ours to fix

Some PSI findings are platform limitations on GitHub Pages and should **not** be
chased:

- **"Use efficient cache lifetimes"** — GitHub Pages serves a fixed
  `cache-control: max-age=600`. We can't change it. Ignore.
- **"Minify CSS/JavaScript"** — our own CSS/JS *is* minified at deploy
  (lightningcss + terser; verify with `curl -s <asset> | wc -l` → 1 line). When
  PSI flags minify, it's third-party (Ecwid, Trailforks, gtag), not ours.
- **"Avoid multiple page redirects"** — the main pages have no redirect chain;
  this is an edge flag, not a site-wide reality.

Real, actionable levers (in leverage order):

1. **Render-blocking CSS volume** — the `<head>` loads full Bootstrap (~232KB)
   + `template.css` (~148KB) + others synchronously. This is the dominant LCP
   driver across all pages.
2. **LCP** — mostly downstream of #1; also check the masthead hero is WebP /
   responsive and discovered early.
3. **Trailforks-widget pages** (`/twin-peaks/`, `/where-to-ride/<park>/`) — the
   embedded widget is the worst per-page offender (LCP 30s+, high TBT). Defer it.
4. **Unused / legacy JavaScript** — globally loaded JS (Bootstrap bundle, etc.).

## Notes

- A handful of old archived event/job posts (2023-2024) return persistent PSI
  500s even with retries — PSI itself failing to analyse them, not a page bug.
  They share the post template with newer events that score fine, so template
  coverage is complete without them.
- Lighthouse lab scores swing run-to-run; that's why this takes a median. Don't
  trust a single-run delta, and don't read a sub-5-point `diff` as a real change.
