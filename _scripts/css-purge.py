#!/usr/bin/env python3
"""Conservative CSS purger for template.css.

Walks rules in template.css. For each rule, looks at every comma-separated
selector. A selector is "safe to drop" only if it references AT LEAST ONE
class AND every class it references is missing from the live class
inventory built from _site/**/*.html and assets/js/.

A rule is dropped only if ALL of its selectors are safe to drop. This means:
- Rules touching bare element selectors (h1, p, button) are kept.
- Rules touching id selectors (#hero) are kept.
- Rules where any class is still used are kept.
- Rules buried inside @media blocks are handled because we keep their text
  intact if any inner selector is alive.

Outputs to template.purged.css alongside a report of dropped class names.
"""

import re
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
DEFAULT_SRC = REPO / "assets" / "css" / "template.css"
DEFAULT_DST = REPO / "assets" / "css" / "template.purged.css"

if len(sys.argv) >= 3:
    SRC = Path(sys.argv[1])
    DST = Path(sys.argv[2])
elif len(sys.argv) == 2:
    SRC = Path(sys.argv[1])
    DST = SRC.with_suffix(".purged" + SRC.suffix)
else:
    SRC = DEFAULT_SRC
    DST = DEFAULT_DST

# Used-class inventory: written by the surrounding shell pipeline. To rebuild:
#   grep -rohE 'class="[^"]+"' _site --include="*.html" | \
#     sed 's/class="//; s/"$//' | tr ' ' '\n' | sort -u > /tmp/used-all.txt
USED_CLASSES = set(Path("/tmp/used-all.txt").read_text().splitlines())

# Always-keep classes (even if not directly used in HTML): referenced by JS
# or by inline scripts in includes, may be conditionally added at runtime.
ALWAYS_KEEP = {
    "equal-height", "equal-height-child", "img-grayscale", "gotcolors",
    "enable-effect", "fade-up", "in", "ja", "ja-animate", "ja-decor-1",
    "ja-decor-2", "ja-decor-3", "ja-decor-4", "ja-decor-5", "ja-decor-6",
    "caption", "img_caption", "img_caption-left", "img_caption-right",
    "img_caption-none", "active", "open", "show", "hidden", "no-touch",
    "touch", "mm-hover", "com_content", "video-ready", "is-loaded",
    # Splide carousel — used in one post, still needs the framework hooks
    "splide", "splide__track", "splide__list", "splide__slide",
    "splide__arrow", "splide__pagination",
    # Bootstrap row/col grid — base utility on lots of templates
    "row", "col", "container", "wrap",
    # Bootstrap JS-toggled transient classes (collapse, dropdown sub, etc.)
    "collapsing", "dropdown-submenu",
    # Layout hooks that JS may toggle
    "scrolled", "menu-open", "nav-open",
    # Runtime-injected DOM (Google Maps, reCAPTCHA, Ecwid, choice widgets)
    "gm-style", "gm-style-iw-c", "gm-style-iw-d", "gm-style-iw-tc",
    "gm-ui-hover-effect", "grecaptcha-badge", "ec-grid", "ec-page-title",
    "choices", "choices__inner", "chzn-container", "chzn-container-active",
    "chzn-container-single", "chzn-drop", "chzn-results", "chzn-single",
    "chzn-single-with-drop",
    # Bootstrap modal triggered by JS
    "modal-body", "modal-content", "modal-dialog", "modal-header",
    "modal-backdrop", "modal-open", "close",
    # Map popup blurb is injected into InfoWindow content at runtime
    "map-popup-blurb",
}

src = SRC.read_text()
# Strip /* ... */ comments to simplify rule parsing (we'll keep them in output
# by rebuilding the file from the original text; for the analysis we only
# need to know the selector strings).
# Actually: a simpler approach is to parse rule-by-rule preserving original
# text. Use a state machine.

def tokenise(text):
    """Yield (kind, raw_text). kinds: 'comment','at-block-open',
    'at-block-close','at-statement','rule','whitespace'."""
    i = 0
    n = len(text)
    while i < n:
        ch = text[i]
        if ch.isspace():
            j = i
            while j < n and text[j].isspace():
                j += 1
            yield ("ws", text[i:j])
            i = j
            continue
        if text.startswith("/*", i):
            end = text.find("*/", i + 2)
            if end == -1:
                end = n
            else:
                end += 2
            yield ("comment", text[i:end])
            i = end
            continue
        if ch == "}":
            yield ("close", "}")
            i += 1
            continue
        if ch == "@":
            # @-rule: read until '{' or ';'
            j = i
            depth = 0
            while j < n:
                c = text[j]
                if c == "{":
                    yield ("at-open", text[i:j+1])
                    i = j + 1
                    break
                if c == ";" and depth == 0:
                    yield ("at-stmt", text[i:j+1])
                    i = j + 1
                    break
                j += 1
            else:
                yield ("at-stmt", text[i:])
                i = n
            continue
        # Otherwise, a rule: read selector until '{', then body until matching '}'
        j = i
        while j < n and text[j] != "{":
            j += 1
        if j == n:
            yield ("trailing", text[i:])
            break
        selector = text[i:j]
        # find matching close
        depth = 1
        k = j + 1
        while k < n and depth > 0:
            if text[k] == "{":
                depth += 1
            elif text[k] == "}":
                depth -= 1
            k += 1
        body = text[j:k]
        yield ("rule", selector + body)
        i = k

CLASS_RE = re.compile(r"\.([a-zA-Z][a-zA-Z0-9_-]*)")
HAS_ELEMENT_OR_ID = re.compile(r"(?:^|[\s,>+~])(?:[a-zA-Z][a-zA-Z0-9]*|\*|#)", re.M)


def selector_classes(sel):
    return set(CLASS_RE.findall(sel))


def has_non_class_anchor(sel):
    """True if the selector has an element name, id, or universal selector
    (so it could match even with no classes)."""
    # Strip pseudo-class/element fragments to avoid matching e.g. ":hover"
    cleaned = re.sub(r"::?[a-zA-Z-]+(\([^)]*\))?", "", sel)
    cleaned = re.sub(r"\[[^\]]+\]", "", cleaned)
    # Now split selector chains
    return bool(HAS_ELEMENT_OR_ID.search(" " + cleaned))


def selector_is_dead(sel):
    classes = selector_classes(sel)
    if not classes:
        # No classes at all - either bare element/id or pseudo. Keep.
        return False
    if has_non_class_anchor(sel):
        # Selector also bound to element/id, keep to be safe
        return False
    for c in classes:
        if c in USED_CLASSES or c in ALWAYS_KEEP:
            return False
    return True


def rule_is_dead(rule_text):
    """rule_text looks like 'selector1, selector2 { ... }'"""
    sel_part, _, _ = rule_text.partition("{")
    selectors = [s.strip() for s in sel_part.split(",") if s.strip()]
    if not selectors:
        return False
    return all(selector_is_dead(s) for s in selectors)


# Tokenise and rebuild, dropping dead rules. For @media etc, we keep the
# wrapper and selectively drop inner rules.

def transform(text, dropped_classes_acc):
    out = []
    tokens = list(tokenise(text))
    i = 0
    while i < len(tokens):
        kind, raw = tokens[i]
        if kind == "at-open":
            # Find matching close and recursively transform inner content
            depth = 1
            j = i + 1
            while j < len(tokens) and depth > 0:
                k2, _ = tokens[j]
                if k2 == "at-open":
                    depth += 1
                elif k2 == "close":
                    depth -= 1
                j += 1
            inner_tokens = tokens[i+1:j-1]
            inner_text = "".join(t[1] for t in inner_tokens)
            transformed_inner = transform(inner_text, dropped_classes_acc)
            out.append(raw)
            out.append(transformed_inner)
            out.append("}")
            i = j
        elif kind == "rule":
            if rule_is_dead(raw):
                # Record what we dropped
                sel_part, _, _ = raw.partition("{")
                for c in selector_classes(sel_part):
                    dropped_classes_acc.add(c)
                # skip
            else:
                out.append(raw)
            i += 1
        else:
            out.append(raw)
            i += 1
    return "".join(out)


dropped = set()
purged = transform(src, dropped)

# Guard: the source template.css ships with stray trailing close braces that
# lightningcss tolerated before purging but rejects after. Strip any unmatched
# trailing `}` so the minifier accepts the output.
opens = purged.count("{")
closes = purged.count("}")
stray = closes - opens
if stray > 0:
    end = purged.rstrip()
    if end.endswith("}" * stray):
        purged = end[:-stray].rstrip() + "\n"
        print(f"Stripped {stray} stray trailing close-brace(s).")

DST.write_text(purged)
src_size = len(src)
dst_size = len(purged)
print(f"Source: {src_size:,} bytes")
print(f"Purged: {dst_size:,} bytes ({100*(src_size-dst_size)/src_size:.1f}% smaller)")
print(f"Dropped {len(dropped)} unique class names:")
for c in sorted(dropped):
    print(f"  .{c}")
