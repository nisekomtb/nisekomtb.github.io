#!/usr/bin/env bash
# Asserts the Twin Peaks Birthday page keeps its ticketed morning and its free
# afternoon separate, as 景品表示法 requires: prizes tied to a paid transaction
# are capped, prizes from a no-purchase activity are not. If the copy ever
# re-bundles the two parts, the prize activity stops being lawful, so these
# checks are a legal guard rather than a style one.
#
# Spec: _docs/superpowers/specs/2026-09-14-twin-peaks-birthday-two-part-design.md
# Run after `bundle exec jekyll build`. Exits non-zero on any violation.
set -uo pipefail

EN_SRC="_site/events/twin-peaks-birthday-2026/index.html"
JA_SRC="_site/ja/events/twin-peaks-birthday-2026/index.html"
fails=0

for f in "$EN_SRC" "$JA_SRC"; do
  [ -f "$f" ] || { echo "missing build output: $f — run 'bundle exec jekyll build' first"; exit 1; }
done

# JA copy carries zero-width spaces (body) and <wbr> (front matter) for line
# breaking. Both are invisible to a reader and would break every literal match,
# so assert against a stripped copy.
tmp=$(mktemp -d)
trap 'rm -rf "$tmp"' EXIT
EN="$tmp/en.html"; JA="$tmp/ja.html"
# -CSD is load-bearing: without it perl treats the file as bytes and the
# \x{200b} substitution silently matches nothing, turning every JA assertion
# that relies on stripping into a false pass.
perl -CSD -pe 's/\x{200b}//g; s/<wbr>//g' "$EN_SRC" > "$EN"
perl -CSD -pe 's/\x{200b}//g; s/<wbr>//g' "$JA_SRC" > "$JA"

ok()  { printf '  \033[32mPASS\033[0m %s\n' "$1"; }
bad() { printf '  \033[31mFAIL\033[0m %s\n' "$1"; fails=$((fails+1)); }
has()   { grep -qF -- "$2" "$1" && ok "$3" || bad "$3"; }
hasnt() { grep -qF -- "$2" "$1" && bad "$3" || ok "$3"; }

echo "== Both parts named and present =="
has "$EN" "Dig Morning"    "EN names the Dig Morning"
has "$EN" "Birthday Party" "EN names the Birthday Party"
has "$JA" "トレイル整備の朝" "JA names the Dig Morning"
has "$JA" "3周年パーティー"  "JA names the Birthday Party"

echo "== Free-part activities never appear inside Part 1 =="
python3 - "$EN" "$JA" <<'PY'
import re, sys
forbidden = {
  "en": ["game ticket", "prize", "draw", "party", "Rhythm"],
  "ja": ["ゲームチケット", "賞品", "抽選", "パーティー", "Rhythm"],
}
marks = {"en": "Dig Morning", "ja": "トレイル整備の朝"}
rc = 0
for path, lang in zip(sys.argv[1:3], ("en", "ja")):
    html = open(path, encoding="utf-8").read()
    m = re.search(r"<h2[^>]*>[^<]*" + re.escape(marks[lang]) + r"[^<]*</h2>(.*?)<h2",
                  html, re.S)
    if not m:
        print(f"  \033[31mFAIL\033[0m {lang}: could not locate the Part 1 section"); rc = 1; continue
    section = m.group(1)
    hits = [w for w in forbidden[lang] if w.lower() in section.lower()]
    if hits:
        print(f"  \033[31mFAIL\033[0m {lang}: Part 1 mentions free-part items: {hits}"); rc = 1
    else:
        print(f"  \033[32mPASS\033[0m {lang}: Part 1 carries no free-part item")
sys.exit(rc)
PY
[ $? -eq 0 ] || fails=$((fails+1))

echo "== Everyone gets five game tickets, not just ticket holders =="
has "$EN" "Everyone at the Birthday Party gets five game tickets" "EN states everyone gets five"
has "$JA" "ゲームチケットを5枚" "JA states the five game tickets"

echo "== Withdrawn content stays withdrawn =="
hasnt "$EN" "Stumpjumper"  "EN: no bike prize"
hasnt "$JA" "Stumpjumper"  "JA: no bike prize"
hasnt "$EN" "990,000"      "EN: no bike value"
hasnt "$JA" "990,000"      "JA: no bike value"
hasnt "$EN" "All day"      "EN: no all-day bundling"
hasnt "$EN" "all day"      "EN: no all-day bundling (lowercase)"
hasnt "$JA" "終日パス"      "JA: no all-day pass"
hasnt "$JA" "夕方のみ"      "JA: no evening-only pass"
hasnt "$EN" "Evening only" "EN: no evening-only pass"

echo "== Structured data agrees with the page =="
has "$EN" '"isAccessibleForFree": true' "EN JSON-LD marks the event free to attend"
has "$JA" '"isAccessibleForFree": true' "JA JSON-LD marks the event free to attend"
has "$EN" '"price": 0'        "EN JSON-LD carries the free offer"
has "$EN" '"price": 5000'     "EN JSON-LD carries the paid offer"
has "$EN" '"@type": "FAQPage"' "EN emits FAQ schema"
has "$JA" '"@type": "FAQPage"' "JA emits FAQ schema"

echo "== Schedule marks the boundary exactly once =="
# Match the rendered row, not the CSS rule (`tr.free-divider`) in the same file.
for pair in "EN:$EN" "JA:$JA"; do
  n=${pair%%:*}; f=${pair#*:}
  c=$(grep -o 'class="free-divider"' "$f" | wc -l | tr -d ' ')
  [ "$c" = "1" ] && ok "$n: one schedule divider" || bad "$n: expected 1 divider, found $c"
done

echo
if [ "$fails" -eq 0 ]; then
  printf '\033[32mAll checks passed.\033[0m\n'; exit 0
else
  printf '\033[31m%s check(s) failed.\033[0m\n' "$fails"; exit 1
fi
