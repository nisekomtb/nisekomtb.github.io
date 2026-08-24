#!/usr/bin/env python3
"""Ingest a folder of story photographs into the responsive-image layout the story kit needs.

Two stages, because a photographer delivers the whole take and a story wants ~25 frames.

  1. Review the take without processing it:

         python3 _scripts/ingest-story-photos.py peatys-whip-off --preview

     Writes numbered contact sheets to _docs/story-manifests/ and touches nothing else.
     Each cell is labelled with its short id (DSC1252), which is what the selection in
     stage 2 refers to.

  2. Process only the frames that made the cut:

         python3 _scripts/ingest-story-photos.py peatys-whip-off --only 1252,1305,1389

  3. Add a frame to a set that is already published, without renumbering it:

         python3 _scripts/ingest-story-photos.py peatys-whip-off --only 2293 --start-index 31

     Frame numbers appear in prose, in prompt sheets and in a story's markup, so a
     re-run that renumbers everything invalidates work already done against them.

Reads  assets/images/_triage/<slug>/   (any filenames, gitignored)
Writes assets/images/stories/<slug>/   (slug-NN.jpg + WebP tiers)
       _docs/story-manifests/<slug>.yml          (dims + empty alt slots)
       _docs/story-manifests/<slug>-contact.jpg  (numbered contact sheet)

The manifest exists so that `dims`, `width` and `height` in a story/gallery.html or
story/figure.html call come from measurement rather than by hand. Getting one of those
wrong is silent: the lightbox letterboxes a slide, or the browser reserves the wrong
aspect ratio, and neither fails a build.

Requires Pillow. No ImageMagick on this machine, and Pillow is the better fit anyway:
resizing is by explicit width, which is the one thing `sips -Z` gets wrong on portraits
(see _docs/responsive-images.md).
"""

import argparse
import re
import shutil
import sys
from pathlib import Path

try:
    from PIL import Image, ImageDraw, ImageFont, ImageOps
except ImportError:
    sys.exit("Pillow is required:  python3 -m pip install Pillow")

REPO = Path(__file__).resolve().parent.parent
TRIAGE = REPO / "assets" / "images" / "_triage"
STORIES = REPO / "assets" / "images" / "stories"
MANIFESTS = REPO / "_docs" / "story-manifests"

SUFFIXES = ["", "-large", "-xlarge"]
READABLE = {".jpg", ".jpeg", ".png"}

# Story photographs are of people, so the default sits in the faces band rather than the
# scenes band. Blind re-encoding at a lower quality is how an already-optimised delivery
# from a photographer gets worse and bigger at the same time; see --quality and the
# keep-smaller guard in write_master().
DEFAULT_QUALITY = 82
DEFAULT_WIDTHS = "800,1600,2400"

# The JPG is a fallback for browsers with no WebP support, which _docs/responsive-images.md
# puts at ~3% and shrinking, and it gets no srcset of its own. Encoding it at the full
# xlarge width made it the single heaviest thing in the output: on the 30-frame Whip Off
# set the JPGs alone were 22MB of 51MB, all of it serving that 3%. Capping the fallback
# costs those browsers some sharpness on a large display and nobody else anything, since
# the WebP tiers are untouched. Aspect ratio is identical, so the recorded dimensions
# (taken from the largest WebP, not from this file) stay correct for width/height and dims.
DEFAULT_FALLBACK_WIDTH = 1600


def short_id(path):
    """Last distinctive token of a filename, e.g. DSC1252. How a frame gets referred to."""
    return re.split(r"[_\- ]", path.stem)[-1] or path.stem


def shot_time(path):
    """EXIF capture time, for ordering. Falls back to filename."""
    try:
        with Image.open(path) as im:
            exif = im.getexif()
            # 36867 DateTimeOriginal, 306 DateTime
            for tag in (36867, 306):
                if exif.get(tag):
                    return str(exif[tag])
    except Exception:
        pass
    return ""


def load_upright(path):
    """Open and apply the EXIF orientation flag.

    Without exif_transpose a portrait frame stays landscape in the output while every
    viewer that honours the flag shows it upright, so the recorded width and height are
    transposed relative to what actually renders. That desync surfaces much later as a
    stretched lightbox slide.
    """
    im = Image.open(path)
    im = ImageOps.exif_transpose(im)
    return im.convert("RGB")


def resized(im, width):
    if im.width <= width:
        return im.copy()
    height = round(im.height * width / im.width)
    return im.resize((width, height), Image.LANCZOS)


def sources_in(slug):
    src_dir = TRIAGE / slug
    if not src_dir.is_dir():
        sys.exit(f"No such folder: {src_dir}\nDrop the picks in there first.")
    files = sorted(
        (p for p in src_dir.iterdir()
         if p.suffix.lower() in READABLE and not p.name.startswith(".")),
        key=lambda p: (shot_time(p), p.name.lower()),
    )
    ignored = [p.name for p in src_dir.iterdir()
               if p.is_file() and p.suffix.lower() not in READABLE and not p.name.startswith(".")]
    if not files:
        sys.exit(f"No readable images in {src_dir} (looking for {', '.join(sorted(READABLE))})")
    return src_dir, files, ignored


def build_sheet(cells, out_path, cols, cell_w, thumb_source=None):
    """Grid of labelled thumbnails, letterboxed rather than cropped.

    Letterboxed on purpose: a 3:2 crop would hide exactly the portrait framing that
    decides whether a shot belongs in a gallery cell, which is one of the things the
    sheet is for.
    """
    pad, label_h = 8, 24
    cell_h = round(cell_w * 2 / 3)
    rows = (len(cells) + cols - 1) // cols
    sheet = Image.new(
        "RGB",
        (cols * (cell_w + pad) + pad, rows * (cell_h + label_h + pad) + pad),
        (24, 22, 20),
    )
    draw = ImageDraw.Draw(sheet)
    try:
        font = ImageFont.load_default(size=15)
    except TypeError:
        font = ImageFont.load_default()

    for idx, (label, path) in enumerate(cells):
        with Image.open(path) as im:
            # draft() decodes JPEGs at a reduced scale. On a 143-frame take of 3.8MB
            # files that is the difference between seconds and minutes.
            im.draft("RGB", (cell_w * 2, cell_w * 2))
            thumb = ImageOps.exif_transpose(im).convert("RGB")
        thumb.thumbnail((cell_w, cell_h), Image.LANCZOS)
        col, row = idx % cols, idx // cols
        x = pad + col * (cell_w + pad)
        y = pad + row * (cell_h + label_h + pad)
        sheet.paste(thumb, (x + (cell_w - thumb.width) // 2, y + (cell_h - thumb.height) // 2))
        draw.text((x + 2, y + cell_h + 4), label, fill=(226, 221, 214), font=font)

    sheet.save(out_path, "JPEG", quality=78, optimize=True)
    return out_path


def preview(slug, per_page, cols, cell_w):
    src_dir, files, ignored = sources_in(slug)
    MANIFESTS.mkdir(parents=True, exist_ok=True)
    print(f"{len(files)} image(s) in {src_dir.relative_to(REPO)}")
    if ignored:
        print(f"  ignored (unreadable format): {', '.join(ignored)}")

    for existing in MANIFESTS.glob(f"{slug}-contact*.jpg"):
        existing.unlink()

    pages = (len(files) + per_page - 1) // per_page
    for page in range(pages):
        chunk = files[page * per_page:(page + 1) * per_page]
        cells = [(f"{page * per_page + i + 1:03d}  {short_id(p)}", p) for i, p in enumerate(chunk)]
        out = MANIFESTS / f"{slug}-contact-{page + 1:02d}.jpg"
        build_sheet(cells, out, cols, cell_w)
        print(f"  {out.relative_to(REPO)}  ({len(chunk)} frames)")

    print(f"\nNothing was written to assets/. Pick frames by short id, then:\n"
          f"  python3 _scripts/ingest-story-photos.py {slug} --only DSC1252,DSC1305,...")


def write_fallback(im, src, dest, quality, width):
    """Write the JPG fallback, preferring the original bytes when re-encoding would grow it."""
    needs_resize = im.width > width
    resized(im, width).save(dest, "JPEG", quality=quality, optimize=True, progressive=True)

    if not needs_resize and src.suffix.lower() in {".jpg", ".jpeg"}:
        if dest.stat().st_size >= src.stat().st_size:
            shutil.copyfile(src, dest)
            return True
    return False


def ingest(slug, widths, quality, force, dry_run, only, fallback_width, start_index):
    src_dir, sources, ignored = sources_in(slug)

    if only:
        wanted = [t.strip().lower() for t in only.split(",") if t.strip()]
        chosen, missing = [], []
        for token in wanted:
            hits = [p for p in sources if token in p.name.lower()]
            if not hits:
                missing.append(token)
            elif len(hits) > 1:
                sys.exit(f"--only token {token!r} matches {len(hits)} files; use a longer token")
            else:
                chosen.append(hits[0])
        if missing:
            sys.exit(f"--only matched nothing for: {', '.join(missing)}")
        # Selection order is the caller's, deliberately: it is the running order of the
        # story, not the order the shutter fired in.
        sources = chosen

    dest_dir = STORIES / slug
    appending = start_index > 1
    if dest_dir.exists() and any(dest_dir.iterdir()) and not force and not dry_run and not appending:
        sys.exit(f"{dest_dir} already has files. Re-run with --force to overwrite, "
                 f"or --start-index N to add frames without renumbering the existing ones.")

    print(f"{len(sources)} image(s) selected from {src_dir.relative_to(REPO)}")
    if ignored and not only:
        print(f"  ignored (unreadable format): {', '.join(ignored)}")
    if dry_run:
        for i, p in enumerate(sources, start_index):
            print(f"  {i:02d}  {p.name}  ->  {slug}-{i:02d}.jpg")
        return

    if force and not appending and dest_dir.exists():
        shutil.rmtree(dest_dir)
    dest_dir.mkdir(parents=True, exist_ok=True)
    MANIFESTS.mkdir(parents=True, exist_ok=True)

    entries = []
    for i, src in enumerate(sources, start_index):
        stem = f"{slug}-{i:02d}"
        im = load_upright(src)

        # `full` is the reference image: it defines the recorded dimensions and is the
        # source for every WebP tier. The JPG fallback is derived separately and may be
        # narrower, so it must not be what gets measured.
        full = resized(im, max(widths))
        kept_original = write_fallback(im, src, dest_dir / f"{stem}.jpg", quality,
                                       min(max(widths), fallback_width))

        produced = []
        # RECORD THE LARGEST TIER ACTUALLY WRITTEN, NOT THE MASTER. For a master narrower
        # than max(widths) the top tier is skipped by the no-upscale rule below, so the
        # master's own pixels are a size that ships nowhere. That bit portraits and only
        # portraits: an 1800x2700 frame got recorded as 1800x2700 while the widest WebP on
        # disk was 1600x2400, and those numbers go straight into width/height and into the
        # lightbox's data-pswp-*, so PhotoSwipe upscaled 12.5% at full zoom. Aspect ratio
        # is identical either way, which is why nothing looked broken and no build failed.
        top = (full.width, full.height)
        for width, suffix in zip(widths, SUFFIXES):
            # Never upscale. A tier wider than the source would ship a soft image at a
            # width the srcset promises is sharp, and the browser would prefer it.
            if width > full.width and produced:
                continue
            tier = resized(full, width)
            tier.save(dest_dir / f"{stem}{suffix}.webp", "WEBP", quality=quality, method=6)
            produced.append(width)
            top = (tier.width, tier.height)  # widths ascend, so the last one wins

        entries.append({
            "n": i,
            "stem": stem,
            "w": top[0],
            "h": top[1],
            "widths": ",".join(str(w) for w in produced),
            "source": src.name,
        })
        flag = "  (fallback kept original bytes)" if kept_original else ""
        print(f"  {i:02d}  {short_id(src)}  ->  {stem}.jpg  {top[0]}x{top[1]}"
              f"  [{', '.join(str(w) for w in produced)}]{flag}")
        im.close()

    write_manifest(slug, entries, appending)
    # Rebuilt from every frame on disk, not just this run's, so an appended frame does not
    # produce a contact sheet showing one photograph.
    all_frames = sorted(q for q in dest_dir.glob(f"{slug}-[0-9][0-9].jpg"))
    build_sheet([(q.stem.rsplit("-", 1)[-1], q) for q in all_frames],
                MANIFESTS / f"{slug}-contact.jpg", 5, 420)

    total = sum(p.stat().st_size for p in dest_dir.iterdir() if p.is_file())
    print(f"\n{len(list(dest_dir.iterdir()))} files, {total / 1_048_576:.0f}MB in "
          f"{dest_dir.relative_to(REPO)}")
    print(f"Manifest:      {(MANIFESTS / f'{slug}.yml').relative_to(REPO)}")
    print(f"Contact sheet: {(MANIFESTS / f'{slug}-contact.jpg').relative_to(REPO)}")
    print(f"\nSource files left in {src_dir.relative_to(REPO)}. Delete them once the story is published.")


def write_manifest(slug, entries, append=False):
    lines = [] if append else [
        f"# {slug}: ingested photo set.",
        "# Generated by _scripts/ingest-story-photos.py. w/h are the LARGEST GENERATED TIER,",
        "# which for a master narrower than the top width is smaller than the master itself.",
        "# Feed them to width/height on figure.html and to dims on gallery.html.",
        "# Fill alt_en and alt_ja by looking at each image, never from the filename.",
        "",
    ]
    for e in entries:
        lines += [
            f"- n: {e['n']}",
            f"  src: /assets/images/stories/{slug}/{e['stem']}.jpg",
            f"  w: {e['w']}",
            f"  h: {e['h']}",
            f"  widths: \"{e['widths']}\"",
            f"  source: \"{e['source']}\"",
            "  alt_en: \"\"",
            "  alt_ja: \"\"",
            "  caption_en: \"\"",
            "  caption_ja: \"\"",
            "",
        ]
    out = MANIFESTS / f"{slug}.yml"
    if append:
        # Alt text already written against the existing entries must survive, so the new
        # blocks are appended rather than the file being regenerated.
        with out.open("a", encoding="utf-8") as fh:
            fh.write("\n".join(lines))
    else:
        out.write_text("\n".join(lines), encoding="utf-8")


def main():
    ap = argparse.ArgumentParser(description=__doc__,
                                 formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("slug", help="folder name under assets/images/_triage/, e.g. peatys-whip-off")
    ap.add_argument("--preview", action="store_true",
                    help="write contact sheets of the whole take and stop; writes nothing to assets/")
    ap.add_argument("--only", help="comma-separated short ids to process, in story order (e.g. DSC1252,DSC1305)")
    ap.add_argument("--per-page", type=int, default=30, help="frames per preview sheet (default 30)")
    ap.add_argument("--widths", default=DEFAULT_WIDTHS,
                    help=f"comma-separated tier widths, 1-3 values (default {DEFAULT_WIDTHS})")
    ap.add_argument("--quality", type=int, default=DEFAULT_QUALITY,
                    help=f"JPEG/WebP quality (default {DEFAULT_QUALITY}; drop to ~72 for scenery without faces)")
    ap.add_argument("--fallback-width", type=int, default=DEFAULT_FALLBACK_WIDTH,
                    help=f"width of the JPG fallback (default {DEFAULT_FALLBACK_WIDTH}; WebP tiers are unaffected)")
    ap.add_argument("--force", action="store_true", help="replace an existing output folder")
    ap.add_argument("--start-index", type=int, default=1,
                    help="number the new frames from here and append to the manifest, for adding "
                         "frames to an already-published set without renumbering it")
    ap.add_argument("--dry-run", action="store_true", help="list the renames and stop")
    args = ap.parse_args()

    if args.preview:
        preview(args.slug, args.per_page, cols=6, cell_w=320)
        return

    try:
        widths = [int(w) for w in args.widths.split(",") if w.strip()]
    except ValueError:
        sys.exit(f"--widths must be integers, got {args.widths!r}")
    if not 1 <= len(widths) <= 3:
        sys.exit("--widths takes 1 to 3 values; image.html maps them to base, -large, -xlarge")
    if widths != sorted(widths):
        sys.exit("--widths must be ascending; image.html maps them in order")

    if args.start_index < 1:
        sys.exit("--start-index must be 1 or greater")
    ingest(args.slug, widths, args.quality, args.force, args.dry_run, args.only,
           args.fallback_width, args.start_index)


if __name__ == "__main__":
    main()
