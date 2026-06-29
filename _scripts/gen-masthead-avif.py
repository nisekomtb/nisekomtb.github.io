#!/usr/bin/env python3
"""Generate AVIF siblings for every masthead WebP tier.

Mastheads render via _includes/masthead.html, which emits a 4-tier <picture>
srcset (-mobile 400w, base 800w, -medium 1200w, -large 1600w) plus an AVIF
<source> mirroring it. This produces the .avif files that source references,
1:1 with the .webp tiers.

A "masthead base" = any image with a sibling "<base>-medium.webp" (the -medium
tier is unique to the masthead partial; image.html never emits it). AVIF mirrors
every WebP tier 1:1 (the partial emits identical srcsets, so coverage must
match), encoding from the JPG/JPEG/PNG master at q40 and upscaling to match any WebP tier
that was itself upscaled. Idempotent (existing .avif skipped). Keep-smaller
guard: an AVIF not smaller than its WebP is discarded. Re-run after adding a
masthead.

Usage: python3 _scripts/gen-masthead-avif.py [--root assets/images] [--quality 40]
"""
import argparse
import glob
import os
import subprocess
import sys

def log(m): print(f"[gen-masthead-avif] {m}", flush=True)

def img_width(path):
    try:
        out = subprocess.run(["sips", "-g", "pixelWidth", path],
                             capture_output=True, text=True, check=True)
        for line in out.stdout.splitlines():
            if "pixelWidth" in line:
                return int(line.split(":")[1].strip())
    except Exception:
        return None
    return None

def encode_avif(master, width, out_path, quality):
    subprocess.run(
        ["npx", "-y", "sharp-cli", "-i", master, "-o", out_path,
         "resize", str(width), "-q", str(quality)],
        check=True, capture_output=True, text=True)

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--root", default="assets/images")
    ap.add_argument("--quality", type=int, default=40)
    args = ap.parse_args()

    bases = sorted(p[:-len("-medium.webp")]
                   for p in glob.glob(os.path.join(args.root, "**", "*-medium.webp"),
                                      recursive=True))
    log(f"found {len(bases)} masthead base(s)")
    made = skipped = guarded = 0

    for base in bases:
        master = next((base + ext for ext in (".jpg", ".jpeg", ".png")
                       if os.path.isfile(base + ext)), None)
        if master is None:
            log(f"WARNING: no jpg/jpeg/png master for {base} (skipping base)")
            continue
        tiers = [base + ".webp", base + "-mobile.webp",
                 base + "-medium.webp", base + "-large.webp"]
        for webp in tiers:
            if not os.path.isfile(webp):
                continue
            avif = webp[:-len(".webp")] + ".avif"
            if os.path.isfile(avif):
                skipped += 1
                continue
            w = img_width(webp)
            if w is None:
                log(f"WARNING: could not read width of {webp}; skipping")
                continue
            try:
                encode_avif(master, w, avif, args.quality)
            except subprocess.CalledProcessError as e:
                log(f"WARNING: encode failed for {avif}: {e.stderr[:120]}")
                continue
            # keep-smaller guard
            if os.path.getsize(avif) >= os.path.getsize(webp):
                os.remove(avif)
                guarded += 1
                log(f"discarded (not smaller): {avif}")
                continue
            made += 1

    log(f"done: {made} created, {skipped} already existed, "
        f"{guarded} discarded (not smaller)")
    return 0

if __name__ == "__main__":
    sys.exit(main())
