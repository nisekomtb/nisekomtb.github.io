#!/usr/bin/env python3
"""Subset the self-hosted Zen Maru Gothic woff2 in the build output (_site)
down to only the glyphs that actually render in it.

The font is applied (as the JA fallback behind the Latin-only "Fruit Viesta")
to a set of heading selectors. Rather than hardcode that list, we DERIVE it from
the CSS at build time: any rule whose font-family value mentions "Zen Maru
Gothic" contributes its selectors, so the subset scope tracks the CSS
automatically even if it changes. We then
collect the text of matching elements across every rendered HTML page, union a
fixed kana/Latin/punctuation baseline, and subset.

Runs against build output ONLY (like the CSS/JS/HTML minifiers) — the repo
master font is never touched. Fail-safe: on any error the original file is left
in place so a tooling hiccup never ships a broken font or blocks a deploy.

Usage: python3 _scripts/subset-ja-font.py [--site-dir _site]
"""
import argparse
import glob
import os
import re
import sys
import tempfile
from pathlib import Path

FONT_FAMILY_TOKEN = "Zen Maru Gothic"
FONT_REL_PATH = "assets/fonts/zen-maru-gothic/zen-maru-gothic-900.woff2"
MIN_BYTES = 40 * 1024  # floor well below today's ~60KB heading subset; catches a degenerate/empty subset (ship the master instead)


def log(msg):
    print(f"[subset-ja-font] {msg}", flush=True)


def warn(msg):
    print(f"[subset-ja-font] WARNING: {msg}", flush=True)


def baseline_chars():
    """Always-included glyphs: kana, ASCII, JP punctuation, fullwidth forms,
    common symbols. Guards against heading text inserted client-side and any
    selector-engine miss."""
    cps = set()
    cps |= set(range(0x20, 0x7F))      # ASCII printable
    cps |= set(range(0x3000, 0x3040))  # CJK symbols & punctuation (incl 、。「」（）)
    cps |= set(range(0x3041, 0x3097))  # hiragana
    cps |= set(range(0x30A1, 0x3100))  # katakana + phonetic extensions/punctuation
    cps |= set(range(0xFF00, 0xFFF0))  # fullwidth forms (digits, punctuation, ￥)
    cps |= {0x301C, 0x2026, 0x2014, 0x2013, 0x2018, 0x2019, 0x201C, 0x201D,
            0x00A5, 0x00B0, 0x30FB, 0x30FC}
    return {chr(c) for c in cps}


def derive_selectors(css_dir):
    """Selectors whose rule sets a font-family including the Zen Maru token."""
    selectors = []
    block_re = re.compile(r"([^{}]+)\{([^{}]*)\}")
    comment_re = re.compile(r"/\*.*?\*/", re.S)
    for css_path in sorted(glob.glob(os.path.join(css_dir, "*.css"))):
        try:
            css = Path(css_path).read_text(encoding="utf-8")
        except Exception:
            continue
        css = comment_re.sub("", css)  # strip comments so they aren't read as selectors
        for m in block_re.finditer(css):
            sel, body = m.group(1), m.group(2)
            if FONT_FAMILY_TOKEN in body and "font-family" in body:
                for s in sel.split(","):
                    s = s.strip()
                    if s and not s.startswith("@"):
                        selectors.append(s)
    seen, out = set(), []
    for s in selectors:
        if s not in seen:
            seen.add(s)
            out.append(s)
    return out


def collect_selector_chars(site_dir, selectors):
    """Characters from elements matching the derived selectors. Returns
    (charset, n_html, n_elements). Raises on selector-engine failure."""
    from bs4 import BeautifulSoup
    chars = set()
    combined = ", ".join(selectors)
    html_files = glob.glob(os.path.join(site_dir, "**", "*.html"), recursive=True)
    n_el = 0
    for hp in html_files:
        try:
            soup = BeautifulSoup(Path(hp).read_text(encoding="utf-8"), "html.parser")
        except Exception:
            continue
        els = soup.select(combined)  # may raise on an unparseable selector
        for el in els:
            n_el += 1
            chars.update(el.get_text())
    return chars, len(html_files), n_el


def collect_all_text_chars(site_dir):
    """Fallback: every character in every rendered page (safe superset)."""
    from bs4 import BeautifulSoup
    chars = set()
    html_files = glob.glob(os.path.join(site_dir, "**", "*.html"), recursive=True)
    for hp in html_files:
        try:
            soup = BeautifulSoup(Path(hp).read_text(encoding="utf-8"), "html.parser")
        except Exception:
            continue
        chars.update(soup.get_text())
    return chars, len(html_files)


def build_subset(font_path, charset, tmp_path):
    """Subset font_path to charset, write woff2 to tmp_path."""
    from fontTools.ttLib import TTFont
    from fontTools.subset import Subsetter, Options
    opts = Options()
    opts.flavor = "woff2"
    opts.layout_features = ["*"]
    opts.hinting = False
    opts.notdef_outline = True
    opts.ignore_missing_glyphs = True
    font = TTFont(font_path)
    ss = Subsetter(options=opts)
    ss.populate(text="".join(sorted(charset)))
    ss.subset(font)
    font.flavor = "woff2"
    font.save(tmp_path)


def validate(tmp_path, font_path, orig_size):
    """Return True if tmp_path is a valid, smaller subset covering the baseline
    glyphs that exist in the master."""
    from fontTools.ttLib import TTFont
    new_size = os.path.getsize(tmp_path)
    if new_size >= orig_size:
        warn(f"subset ({new_size}B) not smaller than master ({orig_size}B)")
        return False
    if new_size < MIN_BYTES:
        warn(f"subset suspiciously small ({new_size}B < {MIN_BYTES}B floor)")
        return False
    try:
        master_cmap = set(TTFont(font_path).getBestCmap().keys())
        new_cmap = set(TTFont(tmp_path).getBestCmap().keys())
    except Exception as e:
        warn(f"subset failed to open for validation: {e}")
        return False
    want = {ord(c) for c in baseline_chars()} & master_cmap
    missing = want - new_cmap
    if missing:
        warn(f"subset missing {len(missing)} baseline glyphs the master has")
        return False
    return True


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--site-dir", default="_site")
    args = ap.parse_args()

    font_path = os.path.join(args.site_dir, FONT_REL_PATH)
    css_dir = os.path.join(args.site_dir, "assets", "css")

    if not os.path.isfile(font_path):
        log(f"font not found at {font_path}; nothing to do")
        return 0
    orig_size = os.path.getsize(font_path)

    try:
        selectors = derive_selectors(css_dir)
        if not selectors:
            warn("no Zen Maru Gothic selectors found in CSS; leaving master in place")
            return 0
        log(f"derived {len(selectors)} selector(s): {selectors}")

        try:
            used, n_html, n_el = collect_selector_chars(args.site_dir, selectors)
            log(f"scanned {n_html} HTML files, matched {n_el} elements, "
                f"{len(used)} content chars")
        except Exception as e:
            warn(f"selector matching failed ({e}); falling back to all-text scan")
            used, n_html = collect_all_text_chars(args.site_dir)
            log(f"fallback scanned {n_html} HTML files, {len(used)} content chars")

        charset = used | baseline_chars()
        log(f"final charset: {len(charset)} glyphs")

        tmp_fd, tmp_path = tempfile.mkstemp(
            suffix=".woff2", dir=os.path.dirname(font_path))
        os.close(tmp_fd)
        try:
            build_subset(font_path, charset, tmp_path)
            if validate(tmp_path, font_path, orig_size):
                os.replace(tmp_path, font_path)
                new_size = os.path.getsize(font_path)
                pct = round((1 - new_size / orig_size) * 100)
                log(f"replaced: {orig_size // 1024}KB -> {new_size // 1024}KB "
                    f"(-{pct}%)")
            else:
                os.remove(tmp_path)
                warn(f"validation failed; left {orig_size // 1024}KB master in place")
        finally:
            if os.path.exists(tmp_path):
                try:
                    os.remove(tmp_path)
                except OSError:
                    pass
    except Exception as e:  # never block a deploy on this optimisation
        warn(f"unexpected error ({e}); left master font in place")
    return 0


if __name__ == "__main__":
    sys.exit(main())
