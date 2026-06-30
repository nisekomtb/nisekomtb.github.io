#!/usr/bin/env bash
# Prune unused CSS from build output (_site) only. Source CSS is never touched.
# Fail-safe: replace a sheet with its pruned version only if that version is
# non-empty AND smaller than the original; otherwise keep the original. Never
# fails the build — on any error the full (working) CSS ships.
set -uo pipefail

CSSDIR="_site/assets/css"
TMP="_site/.purged"
TARGETS="template.css megamenu.css mobile-nav.css home.css bootstrap.min.css"

rm -rf "$TMP"; mkdir -p "$TMP"

if ! npx --no-install purgecss --config purgecss.config.cjs >/dev/null 2>&1; then
  echo "[purge-css] WARNING: purgecss failed; shipping full CSS"
  rm -rf "$TMP"
  exit 0
fi

# bootstrap.min.css is pre-minified vendor and the pipeline's Minify CSS step
# skips *.min.css, so minify the pruned bootstrap here before the size guard
# (un-minified PurgeCSS output would otherwise look larger than the minified
# original and be rejected). Best-effort: on failure the guard keeps the original.
if [ -s "$TMP/bootstrap.min.css" ]; then
  npx --no-install lightningcss --minify --error-recovery "$TMP/bootstrap.min.css" -o "$TMP/bootstrap.min.css" 2>/dev/null || true
fi

for f in $TARGETS; do
  orig="$CSSDIR/$f"
  pruned="$TMP/$f"
  [ -f "$orig" ] || continue
  if [ -s "$pruned" ] && [ "$(wc -c <"$pruned")" -lt "$(wc -c <"$orig")" ]; then
    before=$(wc -c <"$orig"); after=$(wc -c <"$pruned")
    mv "$pruned" "$orig"
    echo "[purge-css] $f: $before -> $after bytes"
  else
    echo "[purge-css] $f: kept original (pruned missing/empty/not-smaller)"
  fi
done

rm -rf "$TMP"
