"""
PageSpeed Insights audit helper for namba.ngo.

Audits live URLs (PSI scores the deployed site, not your working tree) by
pulling the URL list from the live sitemap, calling the PSI API a few times
per URL, and taking the median to tame Lighthouse's run-to-run noise.

Read-only commands:
    python3 _scripts/psi-audit.py audit                 # audit every URL in the live sitemap
    python3 _scripts/psi-audit.py audit --limit 5       # first 5 URLs only (quick smoke test)
    python3 _scripts/psi-audit.py audit --filter twin    # only URLs whose path contains "twin"
    python3 _scripts/psi-audit.py audit --url https://namba.ngo/twin-peaks/   # explicit URL(s)
    python3 _scripts/psi-audit.py audit --strategy mobile   # mobile|desktop|both (default both)
    python3 _scripts/psi-audit.py audit --runs 5            # medians from N runs (default 5)
    python3 _scripts/psi-audit.py diff <old.json> <new.json>   # score deltas after a deploy

Output (default dir .lighthouse/, gitignored):
    psi-report-<timestamp>.json   full results, one record per url+strategy
    psi-report-<timestamp>.md     ranked summary + aggregated site-wide opportunities

A PSI API key is optional but strongly recommended for batch runs (anonymous
calls throttle hard). Read from $PSI_API_KEY or a .env line `PSI_API_KEY=...`.
Never echoed to stdout.

This audits the LIVE site. To verify a fix: push, wait for the GitHub Actions
deploy, then re-run `audit` and `diff` the new report against the old one.
"""
import argparse
import json
import os
import random
import statistics
import sys
import threading
import time
import urllib.error
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET
from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import datetime, timezone

SITEMAP = "https://namba.ngo/sitemap.xml"
PSI = "https://www.googleapis.com/pagespeedonline/v5/runPagespeed"
OUT_DIR = ".lighthouse"

# Core Web Vitals + the lab metrics PSI reports, with the audit id PSI uses.
METRICS = [
    ("LCP", "largest-contentful-paint"),
    ("CLS", "cumulative-layout-shift"),
    ("TBT", "total-blocking-time"),
    ("FCP", "first-contentful-paint"),
    ("SI", "speed-index"),
]


def api_key() -> str | None:
    k = os.environ.get("PSI_API_KEY")
    if not k and os.path.exists(".env"):
        for line in open(".env"):
            if line.startswith("PSI_API_KEY="):
                k = line.split("=", 1)[1].strip().strip("'\"")
                break
    return k or None


def fetch_sitemap_urls(sitemap_url: str) -> list[str]:
    with urllib.request.urlopen(sitemap_url, timeout=30) as r:
        xml = r.read()
    root = ET.fromstring(xml)
    ns = {"sm": "http://www.sitemaps.org/schemas/sitemap/0.9"}
    urls = [loc.text.strip() for loc in root.findall(".//sm:url/sm:loc", ns)]
    if not urls:  # fall back to namespace-agnostic search
        urls = [e.text.strip() for e in root.iter() if e.tag.endswith("loc") and e.text]
    return urls


# Global pacer: PSI's free quota is 240 queries/minute. We reserve a start slot
# per call (across all threads) so the aggregate request rate stays under the cap,
# no matter how many workers are running. Concurrency overlaps the ~10s server-side
# analyses; the pacer bounds how fast new calls *begin*.
_pace_lock = threading.Lock()
_next_slot = [0.0]
_pace_interval = [60.0 / 180]  # seconds between starts; set from --rate in cmd_audit


def pace():
    with _pace_lock:
        start = max(time.monotonic(), _next_slot[0])
        _next_slot[0] = start + _pace_interval[0]
    wait = start - time.monotonic()
    if wait > 0:
        time.sleep(wait)


def run_psi(url: str, strategy: str, key: str | None, retries: int = 5) -> dict:
    """One PSI call with exponential backoff on 429 (quota) and 500 (transient)."""
    params = {"url": url, "strategy": strategy, "category": "performance"}
    if key:
        params["key"] = key
    req = urllib.request.Request(f"{PSI}?{urllib.parse.urlencode(params)}")
    for attempt in range(retries + 1):
        pace()
        try:
            with urllib.request.urlopen(req, timeout=120) as r:
                return json.loads(r.read())
        except urllib.error.HTTPError as e:
            # 429 = over rate limit, 500/503 = transient server/analysis hiccup. Back off and retry.
            if e.code in (429, 500, 503) and attempt < retries:
                wait = min(60, 2 ** attempt) + random.uniform(0, 1.5)
                time.sleep(wait)
                continue
            raise


def extract(result: dict) -> dict:
    """Pull the performance score, lab metrics, and opportunities from one PSI response."""
    lh = result.get("lighthouseResult", {})
    audits = lh.get("audits", {})
    score = lh.get("categories", {}).get("performance", {}).get("score")
    metrics = {}
    for label, audit_id in METRICS:
        a = audits.get(audit_id, {})
        metrics[label] = {"value": a.get("numericValue"), "display": a.get("displayValue")}
    opportunities = []
    for audit_id, a in audits.items():
        details = a.get("details", {}) or {}
        savings = details.get("overallSavingsMs") or a.get("numericValue")
        is_opp = details.get("type") == "opportunity"
        underperforming = a.get("score") is not None and a.get("score") < 0.9
        if (is_opp or underperforming) and a.get("scoreDisplayMode") not in ("notApplicable", "informative", "manual"):
            opportunities.append({
                "id": audit_id,
                "title": a.get("title"),
                "score": a.get("score"),
                "savings_ms": savings if is_opp else None,
                "display": a.get("displayValue"),
            })
    opportunities.sort(key=lambda o: (o["savings_ms"] is None, -(o["savings_ms"] or 0)))
    return {"score": score, "metrics": metrics, "opportunities": opportunities}


def audit_one(url: str, strategy: str, runs: int, key: str | None, delay: float) -> dict:
    scores, metric_vals, last = [], {label: [] for label, _ in METRICS}, None
    for i in range(runs):
        try:
            res = run_psi(url, strategy, key)
        except urllib.error.HTTPError as e:
            print(f"    ! HTTP {e.code} on run {i + 1} ({e.reason})", file=sys.stderr)
            time.sleep(delay)
            continue
        except (urllib.error.URLError, TimeoutError) as e:
            print(f"    ! network error on run {i + 1}: {e}", file=sys.stderr)
            time.sleep(delay)
            continue
        ex = extract(res)
        if ex["score"] is not None:
            scores.append(ex["score"])
        for label, _ in METRICS:
            v = ex["metrics"][label]["value"]
            if v is not None:
                metric_vals[label].append(v)
        last = ex  # keep the most recent run's opportunities/displays
        if delay and i < runs - 1:
            time.sleep(delay)
    median_score = round(statistics.median(scores) * 100) if scores else None
    median_metrics = {}
    for label, _ in METRICS:
        vals = metric_vals[label]
        median_metrics[label] = round(statistics.median(vals), 2) if vals else None
    return {
        "url": url,
        "strategy": strategy,
        "runs_ok": len(scores),
        "runs_requested": runs,
        "score": median_score,
        "metrics": median_metrics,
        "opportunities": (last or {}).get("opportunities", []),
    }


def grade(score: int | None) -> str:
    if score is None:
        return "?"
    return "🟢" if score >= 90 else "🟡" if score >= 50 else "🔴"


def cmd_audit(args):
    _pace_interval[0] = 60.0 / args.rate
    key = api_key()
    if not key:
        print("! No PSI_API_KEY found — running anonymously (rate-limited). Add PSI_API_KEY to .env for batch runs.\n", file=sys.stderr)

    if args.url_file:
        with open(args.url_file) as f:
            urls = [ln.strip() for ln in f if ln.strip() and not ln.startswith("#")]
    elif args.url:
        urls = args.url
    else:
        urls = fetch_sitemap_urls(args.sitemap)
        if args.filter:
            urls = [u for u in urls if args.filter in u]
        if args.limit:
            urls = urls[: args.limit]
    strategies = ["mobile", "desktop"] if args.strategy == "both" else [args.strategy]
    work = [(u, s) for u in urls for s in strategies]
    print(f"Auditing {len(urls)} URL(s) × {len(strategies)} strateg(ies) × {args.runs} run(s) "
          f"= {len(work) * args.runs} calls, concurrency {args.concurrency}\n")

    lock = threading.Lock()
    done = [0]

    def task(item):
        u, s = item
        r = audit_one(u, s, args.runs, key, args.delay)
        with lock:
            done[0] += 1
            print(f"  [{done[0]:>3}/{len(work)}] {grade(r['score'])} {str(r['score']):>4} "
                  f"{s:7} {u}  ({r['runs_ok']}/{r['runs_requested']} ok)")
        return r

    results = []
    with ThreadPoolExecutor(max_workers=args.concurrency) as pool:
        for r in as_completed([pool.submit(task, w) for w in work]):
            results.append(r.result())

    os.makedirs(args.out, exist_ok=True)
    stamp = datetime.now(timezone.utc).strftime("%Y%m%d-%H%M%S")
    json_path = os.path.join(args.out, f"psi-report-{stamp}.json")
    md_path = os.path.join(args.out, f"psi-report-{stamp}.md")
    with open(json_path, "w") as f:
        json.dump({"generated": stamp, "results": results}, f, indent=2)
    with open(md_path, "w") as f:
        f.write(render_md(results, stamp))
    print(f"\nWrote {json_path}\n      {md_path}")


def render_md(results: list[dict], stamp: str) -> str:
    lines = [f"# PSI audit — {stamp} UTC\n"]
    lines.append("## Scores (lowest first)\n")
    lines.append("| Score | Strategy | URL | LCP (ms) | CLS | TBT (ms) |")
    lines.append("|---|---|---|---|---|---|")
    for r in sorted(results, key=lambda r: (r["score"] is None, r["score"] or 0)):
        m = r["metrics"]
        lines.append(
            f"| {grade(r['score'])} {r['score']} | {r['strategy']} | {r['url']} "
            f"| {m.get('LCP')} | {m.get('CLS')} | {m.get('TBT')} |"
        )

    # Aggregate opportunities across pages — on a static Jekyll site, the most
    # frequent ones are usually a single site-wide fix (layout/include/asset).
    agg: dict[str, dict] = {}
    for r in results:
        for o in r["opportunities"]:
            a = agg.setdefault(o["id"], {"title": o["title"], "pages": 0, "savings": []})
            a["pages"] += 1
            if o["savings_ms"]:
                a["savings"].append(o["savings_ms"])
    lines.append("\n## Opportunities by reach (most pages first)\n")
    lines.append("| Pages | Avg saving (ms) | Audit |")
    lines.append("|---|---|---|")
    for _id, a in sorted(agg.items(), key=lambda kv: (-kv[1]["pages"], -(max(kv[1]["savings"]) if kv[1]["savings"] else 0))):
        avg = round(statistics.mean(a["savings"])) if a["savings"] else "—"
        lines.append(f"| {a['pages']} | {avg} | {a['title']} |")
    return "\n".join(lines) + "\n"


def cmd_diff(args):
    old = {(_r["url"], _r["strategy"]): _r for _r in json.load(open(args.old))["results"]}
    new = {(_r["url"], _r["strategy"]): _r for _r in json.load(open(args.new))["results"]}
    print(f"{'Δ':>5}  {'old':>4} {'new':>4}  strategy  url")
    for key in sorted(new):
        n = new[key]
        o = old.get(key)
        if not o or o["score"] is None or n["score"] is None:
            print(f"{'?':>5}  {'·':>4} {n['score'] or '·':>4}  {key[1]:7}  {key[0]}")
            continue
        d = n["score"] - o["score"]
        arrow = "▲" if d > 0 else "▼" if d < 0 else "="
        print(f"{arrow}{abs(d):>4}  {o['score']:>4} {n['score']:>4}  {key[1]:7}  {key[0]}")


def main():
    p = argparse.ArgumentParser(description="PageSpeed Insights audit for namba.ngo")
    sub = p.add_subparsers(dest="cmd", required=True)

    a = sub.add_parser("audit", help="audit live URLs from the sitemap")
    a.add_argument("--sitemap", default=SITEMAP)
    a.add_argument("--url", action="append", help="explicit URL (repeatable); overrides sitemap")
    a.add_argument("--url-file", help="file of URLs, one per line (# comments ok); overrides sitemap")
    a.add_argument("--strategy", choices=["mobile", "desktop", "both"], default="both")
    a.add_argument("--runs", type=int, default=5, help="runs per URL+strategy for median (default 5)")
    a.add_argument("--limit", type=int, help="only the first N sitemap URLs")
    a.add_argument("--filter", help="only URLs whose loc contains this substring")
    a.add_argument("--delay", type=float, default=0.0, help="seconds between a URL's own runs")
    a.add_argument("--concurrency", type=int, default=8, help="parallel URL+strategy workers (default 8)")
    a.add_argument("--rate", type=float, default=180, help="max API calls/minute across all workers (PSI cap is 240; default 180 leaves headroom)")
    a.add_argument("--out", default=OUT_DIR)
    a.set_defaults(func=cmd_audit)

    d = sub.add_parser("diff", help="compare two report JSON files")
    d.add_argument("old")
    d.add_argument("new")
    d.set_defaults(func=cmd_diff)

    args = p.parse_args()
    args.func(args)


if __name__ == "__main__":
    main()
