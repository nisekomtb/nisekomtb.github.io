"""
Helper for talking to the NAMBA Ecwid store.

Read-only commands:
    python3 _scripts/ecwid-helpers.py ping             # confirm token works
    python3 _scripts/ecwid-helpers.py list             # list all products (id, enabled, name)
    python3 _scripts/ecwid-helpers.py show <id>        # show one product as JSON
    python3 _scripts/ecwid-helpers.py dump [path]      # dump every product (default /tmp/ecwid-before.json)
    python3 _scripts/ecwid-helpers.py audit            # report which enabled products are missing alts / SEO fields
    python3 _scripts/ecwid-helpers.py thumbs [dir]     # download 400px thumbs for every enabled image (default /tmp/ecwid-thumbs/)

Write commands (require ECWID_TOKEN and an alts JSON):
    python3 _scripts/ecwid-helpers.py apply-alts <alts.json>
        # PUTs alt.main + alt.translated.{en,ja} for every image in <alts.json>
        # Schema of alts.json:
        # {
        #   "<product_id>": {
        #     "name": "<for log readability>",
        #     "alts": [
        #       {"en": "...", "ja": "..."},   # one entry per image, IN ORDER
        #       ...
        #     ]
        #   }
        # }

    python3 _scripts/ecwid-helpers.py apply-fields <fields.json>
        # PUTs arbitrary product fields. Schema of fields.json:
        # {
        #   "<product_id>": {
        #     "_name": "<for log readability, stripped before the PUT>",
        #     "subtitle": "...", "subtitleTranslated": {"en": "...", "ja": "..."},
        #     "description": "...", "descriptionTranslated": {...},
        #     "nameTranslated": {...}, "seoTitleTranslated": {...}, ...
        #   }
        # }
        # Anything the Ecwid product API accepts on PUT works here, including
        # `options` (send the whole array, it is replaced wholesale).

    python3 _scripts/ecwid-helpers.py upload-gallery <product_id> <img.jpg> [img.jpg ...]
        # Appends each JPEG to the product's gallery, in the order given, after
        # any images already on the product. Resize to ~2000px on the long edge
        # first; Ecwid derives its 160/400/800/1500px variants from the upload.

The token is read from $ECWID_TOKEN or from a .env line `ECWID_TOKEN=...`.
The token is never echoed to stdout.

See _docs/ecwid-product-alts.md for the end-to-end workflow.
"""
import json
import os
import sys
import time
import urllib.request
import urllib.parse
import urllib.error

STORE_ID = "71386768"
BASE = f"https://app.ecwid.com/api/v3/{STORE_ID}"


def token() -> str:
    t = os.environ.get("ECWID_TOKEN")
    if not t and os.path.exists(".env"):
        for line in open(".env"):
            if line.startswith("ECWID_TOKEN="):
                t = line.split("=", 1)[1].strip().strip("'\"")
                break
    if not t:
        sys.exit("ECWID_TOKEN not set (env var or .env)")
    return t


def api(method: str, path: str, params: dict | None = None, body: dict | None = None):
    url = f"{BASE}{path}"
    if params:
        url += "?" + urllib.parse.urlencode(params)
    data = json.dumps(body).encode() if body is not None else None
    req = urllib.request.Request(
        url,
        method=method,
        data=data,
        headers={
            "Authorization": f"Bearer {token()}",
            "Accept": "application/json",
            "Content-Type": "application/json",
        },
    )
    try:
        with urllib.request.urlopen(req) as resp:
            return resp.status, json.loads(resp.read())
    except urllib.error.HTTPError as e:
        return e.code, e.read().decode()


def fetch_products() -> list:
    status, payload = api("GET", "/products", {"limit": 100})
    if status != 200:
        sys.exit(f"GET /products failed ({status}): {payload}")
    return payload["items"]


def cmd_ping():
    status, p = api("GET", "/profile")
    if status != 200:
        sys.exit(f"ping failed ({status}): {p}")
    print("Store:    ", p.get("generalInfo", {}).get("storeUrl") or "(unknown)")
    print("Languages:", p.get("languages", {}).get("enabledLanguages", []))
    print("Default:  ", p.get("languages", {}).get("defaultLanguage", "?"))


def cmd_list():
    for p in fetch_products():
        flag = " " if p.get("enabled", True) else "✗"
        print(f"{p['id']:>12}  {flag}  {p['name']}")


def cmd_show(pid: str):
    status, p = api("GET", f"/products/{pid}")
    if status != 200:
        sys.exit(f"show failed ({status}): {p}")
    print(json.dumps(p, indent=2, ensure_ascii=False))


def cmd_dump(path: str = "/tmp/ecwid-before.json"):
    items = fetch_products()
    with open(path, "w") as f:
        json.dump(items, f, indent=2, ensure_ascii=False)
    print(f"Wrote {len(items)} products to {path}")


def cmd_audit():
    """Report what's missing on enabled products."""
    items = [p for p in fetch_products() if p.get("enabled", True)]
    print(f"Enabled products: {len(items)}\n")
    issues = 0
    for p in items:
        pid = p["id"]
        name = p["name"]
        missing = []
        if not (p.get("descriptionTranslated") or {}).get("ja"):
            missing.append("desc-JA")
        if not (p.get("seoTitleTranslated") or {}).get("ja"):
            missing.append("seoTitle-JA")
        if not (p.get("seoDescriptionTranslated") or {}).get("ja"):
            missing.append("seoDesc-JA")
        imgs = p.get("media", {}).get("images", [])
        n_main = n_en = n_ja = 0
        for img in imgs:
            alt = img.get("alt") or {}
            if alt.get("main"):
                n_main += 1
            t = alt.get("translated") or {}
            if t.get("en"):
                n_en += 1
            if t.get("ja"):
                n_ja += 1
        if n_main < len(imgs):
            missing.append(f"alt.main {n_main}/{len(imgs)}")
        if n_en < len(imgs):
            missing.append(f"alt.en {n_en}/{len(imgs)}")
        if n_ja < len(imgs):
            missing.append(f"alt.ja {n_ja}/{len(imgs)}")
        if missing:
            issues += 1
            print(f"  {pid}  {name:<36}  {', '.join(missing)}")
        else:
            print(f"  {pid}  {name:<36}  OK")
    print()
    print(f"Products with gaps: {issues}/{len(items)}")


def cmd_thumbs(out_dir: str = "/tmp/ecwid-thumbs"):
    os.makedirs(out_dir, exist_ok=True)
    items = [p for p in fetch_products() if p.get("enabled", True)]
    count = 0
    for p in items:
        for i, img in enumerate(p.get("media", {}).get("images", [])):
            fn = os.path.join(out_dir, f"{p['id']}_{i:02d}.jpg")
            if not os.path.exists(fn):
                urllib.request.urlretrieve(img["image400pxUrl"], fn)
            count += 1
    print(f"Downloaded {count} thumbnails to {out_dir}/")


def cmd_apply_alts(alts_path: str):
    """PUT alt.main + alt.translated.{en,ja} for every image in alts.json."""
    alts = json.load(open(alts_path))
    items = fetch_products()
    by_id = {str(p["id"]): p for p in items}
    total = 0
    for pid, entry in alts.items():
        product = by_id.get(pid)
        if not product:
            print(f"  SKIP {pid}: not found")
            continue
        imgs = product["media"]["images"]
        if len(imgs) != len(entry["alts"]):
            print(f"  WARN {pid} ({entry['name']}): {len(imgs)} images vs {len(entry['alts'])} alts; skipping")
            continue
        payload_images = [
            {
                "id": img["id"],
                "alt": {
                    "main": a["en"],
                    "translated": {"en": a["en"], "ja": a["ja"]},
                },
            }
            for img, a in zip(imgs, entry["alts"])
        ]
        status, resp = api("PUT", f"/products/{pid}", body={"media": {"images": payload_images}})
        if status == 200:
            print(f"  OK   {pid}  {entry['name']:<36} {len(imgs):>2} imgs")
            total += len(imgs)
        else:
            print(f"  FAIL {pid}  {entry['name']}  status={status}  {resp}")
        time.sleep(0.3)
    print(f"\nUpdated {total} images across {len(alts)} products")


def cmd_apply_fields(fields_path: str):
    """PUT arbitrary product fields (name/subtitle/description/seo/options + *Translated)."""
    payloads = json.load(open(fields_path))
    by_id = {str(p["id"]): p for p in fetch_products()}
    for pid, entry in payloads.items():
        if pid not in by_id:
            print(f"  SKIP {pid}: not found")
            continue
        label = entry.pop("_name", by_id[pid]["name"])
        if not entry:
            print(f"  SKIP {pid} ({label}): no fields")
            continue
        status, resp = api("PUT", f"/products/{pid}", body=entry)
        if status == 200:
            print(f"  OK   {pid}  {label:<40} {', '.join(sorted(entry))}")
        else:
            print(f"  FAIL {pid}  {label}  status={status}  {resp}")
        time.sleep(0.3)


def cmd_upload_gallery(pid: str, paths: list):
    """POST each file to /products/{pid}/gallery, appended in the order given."""
    for path in paths:
        with open(path, "rb") as f:
            data = f.read()
        req = urllib.request.Request(
            f"{BASE}/products/{pid}/gallery",
            method="POST",
            data=data,
            headers={
                "Authorization": f"Bearer {token()}",
                "Content-Type": "image/jpeg",
                "Accept": "application/json",
            },
        )
        try:
            with urllib.request.urlopen(req) as resp:
                body = json.loads(resp.read())
            print(f"  OK   {os.path.basename(path):<44} id={body.get('id')} ({len(data) // 1024} KB)")
        except urllib.error.HTTPError as e:
            sys.exit(f"  FAIL {os.path.basename(path)}: {e.code} {e.read().decode()}")
        time.sleep(0.3)


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(1)
    cmd = sys.argv[1]
    rest = sys.argv[2:]
    if cmd == "ping":
        cmd_ping()
    elif cmd == "list":
        cmd_list()
    elif cmd == "show":
        cmd_show(rest[0])
    elif cmd == "dump":
        cmd_dump(rest[0] if rest else "/tmp/ecwid-before.json")
    elif cmd == "audit":
        cmd_audit()
    elif cmd == "thumbs":
        cmd_thumbs(rest[0] if rest else "/tmp/ecwid-thumbs")
    elif cmd == "apply-alts":
        if not rest:
            sys.exit("apply-alts requires a path to alts.json")
        cmd_apply_alts(rest[0])
    elif cmd == "apply-fields":
        if not rest:
            sys.exit("apply-fields requires a path to fields.json")
        cmd_apply_fields(rest[0])
    elif cmd == "upload-gallery":
        if len(rest) < 2:
            sys.exit("upload-gallery requires <product_id> <image.jpg> [image.jpg ...]")
        cmd_upload_gallery(rest[0], rest[1:])
    else:
        sys.exit(f"unknown cmd: {cmd}")
