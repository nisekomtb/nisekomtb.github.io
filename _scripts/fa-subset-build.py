#!/usr/bin/env python3
"""One-shot Font Awesome subsetter for namba.ngo.

Reads the inventory of fa-* classes used across the site, extracts their
codepoints from all.min.css, subsets fa-solid-900.woff2 and
fa-brands-400.woff2 to only those glyphs, and writes a minimal fa-subset.css
with the @font-face rules and per-icon class declarations.

Run once locally; commit the generated files. The full FA bundle stays in the
repo as a fallback / dev reference but is no longer linked from base.html.
"""

import re
import subprocess
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent.parent / "Code" / "nisekomtb.github.io"
# Fall back to CWD if we're invoked from inside the repo
if not REPO.exists():
    REPO = Path.cwd()

FA_DIR = REPO / "assets" / "fonts" / "font-awesome"
CSS_SRC = FA_DIR / "css" / "all.min.css"
SOLID_SRC = FA_DIR / "webfonts" / "fa-solid-900.woff2"
BRANDS_SRC = FA_DIR / "webfonts" / "fa-brands-400.woff2"
OUT_DIR = REPO / "assets" / "fonts" / "font-awesome-subset"
OUT_DIR.mkdir(parents=True, exist_ok=True)
(OUT_DIR / "webfonts").mkdir(exist_ok=True)

# Auto-discover icon classes by scanning the site source. Looks in every
# template/post/data/script file for `fa-foo` tokens and unions them into
# USED_SOLID. Brand icons (facebook, instagram, etc.) are listed
# explicitly because the brand family has its own woff2 file.
SCAN_ROOTS = [
    "_includes", "_layouts", "_posts", "_data",
    "ja", "assets/js", "assets/css",
]
FA_STRUCTURAL = {  # Style modifiers, not icon glyphs — exclude from subset
    "solid", "brands", "regular", "classic", "light", "duotone", "thin",
    "sharp", "fw", "lg", "sm", "xs", "xl", "2xs", "rotate-90", "rotate-180",
    "rotate-270", "flip-horizontal", "flip-vertical", "spin", "spin-pulse",
    "spin-reverse", "pulse", "stack", "stack-1x", "stack-2x", "inverse",
    "border", "pull-left", "pull-right", "ul", "li", "subset", "width",
}
BRAND_ICONS = {"facebook", "instagram", "twitter", "youtube", "linkedin",
               "tiktok", "x-twitter", "github", "vimeo", "strava"}


def discover_icons():
    """Walk SCAN_ROOTS and union every fa-* token. Return (solid, brands)."""
    pat = re.compile(r"\bfa-([a-z][a-z0-9-]+)")
    found = set()
    for root in SCAN_ROOTS:
        root_path = REPO / root
        if not root_path.exists():
            continue
        for f in root_path.rglob("*"):
            if not f.is_file():
                continue
            if f.suffix not in {".html", ".md", ".yml", ".yaml", ".js", ".css"}:
                continue
            try:
                txt = f.read_text(errors="ignore")
            except Exception:
                continue
            for m in pat.finditer(txt):
                found.add(m.group(1))
    found -= FA_STRUCTURAL
    brands = found & BRAND_ICONS
    solid = found - BRAND_ICONS
    return solid, brands


USED_SOLID, USED_BRANDS = discover_icons()


def extract_codepoints(css_text, names):
    """Return {name: int_codepoint} for the given names.

    FA6 minified format groups aliases in a comma-separated selector:
      .fa-name,.fa-alias{--fa:"\\hex"}
    We scan each `.fa-X[,...]{--fa:"\\hex"}` block and assign the codepoint to
    every class in the selector list.
    """
    out = {}
    pat = re.compile(r'((?:\.fa-[a-z0-9-]+,?)+)\{--fa:"\\([0-9a-fA-F]+)"')
    for m in pat.finditer(css_text):
        selectors = m.group(1)
        cp = int(m.group(2), 16)
        for cls in re.findall(r'\.fa-([a-z0-9-]+)', selectors):
            if cls in names:
                out[cls] = cp
    return out


def subset_font(src, dst, codepoints):
    """Run pyftsubset to keep only the given codepoints."""
    unicodes = ",".join(f"U+{cp:04X}" for cp in sorted(codepoints))
    subprocess.run([
        "pyftsubset", str(src),
        f"--output-file={dst}",
        "--flavor=woff2",
        f"--unicodes={unicodes}",
        "--no-hinting",
        "--desubroutinize",
        "--ignore-missing-glyphs",
    ], check=True)


def main():
    css = CSS_SRC.read_text()
    solid_map = extract_codepoints(css, USED_SOLID)
    brands_map = extract_codepoints(css, USED_BRANDS)

    missing_solid = USED_SOLID - solid_map.keys()
    missing_brands = USED_BRANDS - brands_map.keys()
    if missing_solid:
        print(f"WARNING: missing solid icons (will skip): {missing_solid}", file=sys.stderr)
    if missing_brands:
        print(f"WARNING: missing brands icons (will skip): {missing_brands}", file=sys.stderr)

    print(f"Solid: {len(solid_map)} glyphs")
    print(f"Brands: {len(brands_map)} glyphs")

    solid_dst = OUT_DIR / "webfonts" / "fa-solid-900.subset.woff2"
    brands_dst = OUT_DIR / "webfonts" / "fa-brands-400.subset.woff2"
    subset_font(SOLID_SRC, solid_dst, solid_map.values())
    subset_font(BRANDS_SRC, brands_dst, brands_map.values())

    # Print resulting sizes for the report
    print(f"  Solid: {SOLID_SRC.stat().st_size} -> {solid_dst.stat().st_size} bytes")
    print(f"  Brands: {BRANDS_SRC.stat().st_size} -> {brands_dst.stat().st_size} bytes")

    # Build minimal CSS
    lines = []
    lines.append("/* Font Awesome subset — generated by _scripts/fa-subset-build.py.")
    lines.append("   Only includes glyphs used on namba.ngo. To add icons, update")
    lines.append("   USED_SOLID / USED_BRANDS in the script and rerun. */")
    lines.append("")
    # Base styles for any fa-* icon. Bare `.fa` defaults to solid family,
    # matching FA7's convention so legacy markup like `<span class="fa
    # fa-arrow-up">` keeps working.
    lines.append(
        ".fa,.fa-solid,.fa-brands,.fas,.fab{"
        "-moz-osx-font-smoothing:grayscale;"
        "-webkit-font-smoothing:antialiased;"
        "display:var(--fa-display,inline-block);"
        "font-style:normal;"
        "font-variant:normal;"
        "line-height:1;"
        "text-align:center;"
        "text-rendering:auto;"
        "width:var(--fa-width,1.25em)"
        "}"
    )
    # Font-family declarations. The bundle ships as Font Awesome 7. We use
    # only the FA7 family names; legacy FA5/FA6 references are not supported.
    # `.fa` alone (no .fa-solid sibling) is treated as solid.
    lines.append(
        ".fa,.fa-solid,.fas{font-family:'Font Awesome 7 Free';font-weight:900}"
    )
    lines.append(
        ".fa-brands,.fab{font-family:'Font Awesome 7 Brands';font-weight:400}"
    )
    # Selectors that render the glyph via ::before
    lines.append(
        ".fa::before,.fa-solid::before,.fa-brands::before,.fas::before,.fab::before"
        "{content:var(--fa)}"
    )
    # @font-face rules
    lines.append(
        "@font-face{font-family:'Font Awesome 7 Free';font-style:normal;"
        "font-weight:900;font-display:block;"
        "src:url(webfonts/fa-solid-900.subset.woff2) format('woff2')}"
    )
    lines.append(
        "@font-face{font-family:'Font Awesome 7 Brands';font-style:normal;"
        "font-weight:400;font-display:block;"
        "src:url(webfonts/fa-brands-400.subset.woff2) format('woff2')}"
    )
    # Per-icon classes
    for name, cp in sorted(solid_map.items()):
        lines.append(f'.fa-{name}{{--fa:"\\{cp:x}"}}')
    for name, cp in sorted(brands_map.items()):
        lines.append(f'.fa-{name}{{--fa:"\\{cp:x}"}}')
    # Utility classes that may be used
    lines.append(".fa-fw{text-align:center;width:1.25em}")
    lines.append(".fa-spin{animation:fa-spin 2s infinite linear}")
    lines.append("@keyframes fa-spin{0%{transform:rotate(0)}100%{transform:rotate(360deg)}}")

    css_out = OUT_DIR / "fa-subset.css"
    css_out.write_text("\n".join(lines) + "\n")
    print(f"Wrote {css_out} ({css_out.stat().st_size} bytes)")


if __name__ == "__main__":
    main()
