# Image hosting

Where namba.ngo's images live, why they are still inside this repo, and what to do
when that stops working. Decision taken 2026-08-24. **Revisit winter 2026.**

## The decision

Images stay in this repo through the summer 2026 story season. No CDN, no second
repo, no vendor. Three image-heavy stories are expected to close out the season:

1. Peaty's Whip Off (63 images, already ingested)
2. Downhill Series
3. Twin Peaks Tanjosai / anniversary (draft exists at `_posts/2026-09-19-twin-peaks-tanjosai.md`, no images yet)

The projection below shows all three fit with room to spare, provided the trim in
"Required before the next story" is done first. Winter is when to reopen this,
with a full season of real numbers instead of estimates.

## The two limits, which are not the same problem

Keeping these separate is the single most useful thing in this document. They have
different urgencies, different fixes, and only one of them can actually stop a deploy.

### Limit 1: GitHub Pages caps a published site at 1 GB

This is the hard one. Exceed it and the site stops publishing. It is a function of
`_site` size, so it counts delivered bytes: every jpg, every WebP tier, every PDF.

### Limit 2: git history grows forever

`.git` is a 608 MB pack. Every image ever committed is in it permanently, and a
later deletion does not reclaim the space.

**This is far less scary here than the general advice implies**, for three reasons
specific to this repo:

- **One contributor.** `git shortlog -sn --all` shows a single name, 1664 commits.
- **Zero forks.** Nothing downstream to break.
- **CI never pays for it.** `.github/workflows/deploy.yml` uses `actions/checkout@v5`
  with no `fetch-depth`, which defaults to a depth-1 shallow clone. Deploys do not
  download history.

The usual reason not to rewrite git history is that it breaks everyone else's clones
and every open branch. There is no everyone else. A `git filter-repo` pass can strip
every image from history whenever it is convenient, and the blast radius is one laptop.

**So committing images now is not an irreversible decision.** It is deferred cleanup,
not a permanent tax. That is what makes the summer plan safe.

## The numbers, as measured 2026-08-24

| | |
|---|---|
| `_site` built | 691 MB |
| `.git` pack | 608 MB |
| Tracked files | 2,422 |
| Files in `_site` | 2,621 |
| Largest single file (pre-trim) | `assets/images/events/header.jpg`, **15.76 MB**, unreferenced, since removed |

`_site/assets` by type:

| Type | Files | Size |
|---|---|---|
| jpg | 618 | 312.0 MB |
| webp | 1237 | 257.1 MB |
| jpeg | 20 | 29.9 MB |
| pdf | 6 | 29.8 MB |
| png | 197 | 24.6 MB |
| avif | 264 | 18.9 MB |
| woff2 | 12 | 1.0 MB |
| svg | 10 | 0.3 MB |

## The trim, done 2026-08-24

Executed on branch `chore/prune-unreferenced-images`. **415 files, 188.9 MB moved out
of the repo** to `~/Downloads/namba-unreferenced-images-2026-08-24/`, preserving
directory structure, rather than deleted outright. Build output went **691 MB to 514 MB**.

Only genuinely unreferenced files were touched. No file that any browser can request
was removed. Specifically **every `-large` responsive tier was kept**: an audit of
reachable tiers found 108 reachable and 0 orphaned at that level, so mobile-versus-desktop
delivery is unchanged.

### How the list was built, and why the obvious methods failed

Static analysis of the source tree does not work here, and two attempts proved it:

1. Grepping for literal `/assets/images/...` strings misses everything Jekyll builds
   dynamically from `_data/*.yml`, and misses the `-large` / `-xlarge` / `.webp`
   variants that `_includes/image.html` derives by string manipulation.
2. Whitelisting any directory containing a Liquid-interpolated path over-corrects and
   swallows whole folders. That pass returned zero dead files while `events/header.jpg`,
   a 15.76 MB unused camera original, sat in one of the whitelisted directories.

**Build the site, then diff.** After rendering, every reference is a literal URL:

```sh
JEKYLL_ENV=production bundle exec jekyll build -d /tmp/site-audit
```

Then collect every `/assets/images/...` match from the built `.html`, `.css`, `.js`,
`.json`, `.xml` and `.ics` files and subtract it from what is on disk under
`assets/images/`. Anything left is unreachable in the rendered site.

**Check for a running `jekyll serve` first** (`ps aux | grep jekyll`). A watcher rebuilds
`_site` using its startup-time config and will clobber a fresh build. Build to a separate
`-d` destination to sidestep it entirely.

**`future: true` is set in `_config.yml`**, so future-dated posts are built and their
images are correctly seen as referenced. If that ever changes, this audit will report
images for upcoming events as dead. Verify the setting before trusting a run.

### What was moved

| Folder | Size |
|---|---|
| `prizes/2024` and `prizes` | 64.3 MB |
| `competitions/2025/raffle` (deliberately retired) | 20.3 MB |
| `twinpeaks` | 19.0 MB |
| `stories/peatys-whip-off` (11 unplaced outtakes + 22 unreachable `-xlarge`) | 17.6 MB |
| `events` (incl. `header.jpg`, a 6000x4000 original with 25 KB EXIF) | 16.1 MB |
| `artists/*`, `about/network`, `bg`, `company`, `jobs` | ~51 MB |

Notable: the entire `bg/bg-header-twinpeaks.*` set, 19 files including AVIF variants, was
orphaned when `twin-peaks/index.html` moved its masthead to `/assets/images/twinpeaks/header.jpg`.

### What was deliberately held back

- **OG images** (2 files). Unreferenced in the build, but external scrapers may still
  re-fetch them for previously shared links. Cheap to keep, ugly to break.
- **Greyscale partner-logo variants** (24 `.g.*` files). `.claude/rules/images.md` requires
  a `.g` variant per partner icon for a hover swap, but **zero are referenced in the built
  output**, so the mechanism is not currently wired up. Either the rule is stale or the
  feature regressed. Resolve that question before removing the files.

### Verification

Rebuilt after the move and diffed against the pre-move build. Eleven files differed,
all of them build timestamps only: `feed.xml` `<updated>`, and JSON-LD `validThrough`
on the jobs pages. **Zero image-path differences.**

### Still available, not taken

**Dropping the jpg/png fallbacks inside `<picture>`: 68.1 MB more.** These serve only
browsers older than Safari 14 / iOS 14 (Sept 2020) and Firefox 65 (Jan 2019). The failure
mode is a broken image icon, not a degraded image, so it is a real trade rather than free.
It requires pointing the `<img>` in `_includes/image.html` at the WebP.

**The `<picture>` wrapper must stay** if this is ever done. CSS targets it directly in
`home.css:936`, `home.css:1133`, `story.css:469`, `template.css:2954` and `template.css:7471`,
so collapsing to a bare `<img>` would break those layout rules.

Check GA4 (`G-7X7QGG26RB`) browser and OS-version share before deciding. **Not needed
to clear the summer season**, see the projection below.

## Why deferring is safe: the projection

Per-image cost, derived from Whip Off: 63 images at 60.5 MB of WebP across three tiers
is **~0.96 MB per image**.

| Step | Site size |
|---|---|
| Before the trim | 691 MB |
| After the trim (actual) | **514 MB** |
| + Downhill Series (70 images) | ~581 MB |
| + Anniversary (assume ~65 images) | **~643 MB** |
| GitHub Pages cap | 1000 MB |

Roughly 357 MB of headroom at season end, without the jpg-fallback trade. Even if both
remaining stories land at 100 images each, the total sits near 714 MB and still clears.

## Triggers to revisit before winter

Act early if any of these happen:

- `_site` passes **800 MB**
- A single story lands over **120 MB** after trimming
- A second contributor or a fork appears, which closes the cheap history-rewrite window
- Video returns to a story (see `_posts/2026-08-19-peatys-whip-off-recap.md`, the
  `VIDEO REMOVED 2026-08-24` comment). Video is not viable in-repo at any size.

## When you do move: the work that actually matters

**The valuable, reusable work is not choosing a host. It is making the base URL configurable.**

Images are referenced from **738 distinct paths across 203 files**, and not all of them
go through the include:

| Where | Count | Notes |
|---|---|---|
| `include image.html` / `story/*` call sites | 378 | One-line fix in the include |
| Raw `<img src="/assets/images/...">` | 76 | Bypass the include, need converting or prefixing |
| `_data/*.yml` | 10 files | staff, guides, prizes, media-coverage, artists, twin-peaks, team, sponsors, hero, trails |
| CSS backgrounds in `assets/css/template.css` | 3 | **No front matter, so not Liquid-processed.** Cannot read `_config.yml`. Hand-edit. |
| `assets/js/email-signature.js` | 1 | Same, no front matter |

This cost is **identical for every off-repo option**. It is the price of leaving
`/assets/images/`, not a property of any particular host.

Once an `image_base` exists in `_config.yml` and is threaded through all of the above,
the destination becomes a one-line change and is reversible any afternoon:

- `""`: today's behaviour, images in `_site`
- `https://img.namba.ngo`: second GitHub Pages repo
- `https://namba.b-cdn.net`: Bunny

Do the prefix work once. Stop treating the host as a big decision.

## Options evaluated

Pricing was current to roughly mid-2026 and moves around. Verify at signup.

| Option | Verdict |
|---|---|
| **Stay in repo** | **Chosen for summer 2026.** Free, zero work, ~437 MB headroom after the trim. |
| **Bunny (Storage + CDN + Optimizer)** | **Front-runner for winter.** ~$1/mo minimum plus $9.50/mo for Optimizer. Plain CNAME from Namecheap, no DNS migration. Optimizer is the real prize: one master per photo, on-the-fly resize and AVIF/WebP negotiation, which deletes tier generation from the ingest script entirely. Bunny Stream separately solves five of the six blockers in the Whip Off video comment. Note Asia/Oceania bandwidth is ~3× EU/NA, and the audience is substantially Japan. |
| **Second GitHub Pages repo at `img.namba.ngo`** | Viable free fallback. Own 1 GB allowance, own domain via CNAME, no third party, no billing. Caveat: GitHub's Pages terms discourage CDN and bulk file hosting, so it is grey rather than clean. |
| **Cloudflare R2** | Best economics (zero egress) but a custom domain requires the whole zone on Cloudflare. `namba.ngo` is on Namecheap DNS. That migration touches live DNS with email attached, so it is a deliberate project. |
| **Cloudflare Pages (host the whole site)** | Removes the 1 GB cap for free with **zero image migration**, since paths never change. Limits are 20,000 files/deploy and 25 MB/file; the site is at 2,621 files and 15 MB max, so it fits comfortably. Also needs the zone on Cloudflare. Does nothing for git size. |
| **Cloudinary / ImageKit** | Generous free tiers and on-the-fly transforms, but real lock-in on URL format. |
| **AWS S3 + CloudFront** | Works from any DNS. Most setup, most knobs, genuine surprise-bill risk. Worth revisiting if the AWS nonprofit credit programme is pursued. |
| **DigitalOcean Spaces** | Flat $5/mo for 250 GB and 1 TB transfer. Predictable, boring, fine. |
| **jsDelivr** | **Ruled out.** Their terms prohibit use as an image CDN. Also no transforms, and it borrows donated open-source infrastructure for an organisation's marketing assets. |
| **Git LFS** | **Ruled out.** Bytes leave the pack but still land in `_site`, so the 1 GB cap is untouched. Solves the wrong half. |
| **Google Photos** | **Ruled out.** `baseUrl` values expire in ~60 minutes by design, the Library API has been restricted to app-created media, and the scraped `lh3.googleusercontent.com` links are undocumented. Already forbidden by `.claude/rules/images.md`. |
| **Flickr** | **Ruled out as delivery.** Hotlinking is permitted only on condition the image links back to its Flickr page, which collides with the PhotoSwipe lightbox that `_includes/story/gallery.html` enables by default. JPEG only, so no WebP or AVIF ever, and a fixed 640/800/1024/1600/2048 ladder that does not match our widths. **But worth considering for two adjacent jobs:** an off-site archive of masters (`assets/images/_triage` is 554 MB across 148 files, gitignored, existing only on one laptop), and high-res press asset distribution for `/press/`. |

## Purging git history, when the time comes

Safe here because of the solo-contributor situation described above. Do it in the
same sitting as any migration, since the migration alone reclaims nothing.

```sh
# Confirm the preconditions still hold before starting
git shortlog -sn --all          # expect one name
gh repo view --json forkCount   # expect 0

# Back up first. This rewrites every commit.
git clone --mirror . ../namba-backup.git

pipx install git-filter-repo
git filter-repo --path assets/images --invert-paths
git push --force --all && git push --force --tags
```

Afterwards, delete and re-clone any other working copies rather than trying to
reconcile them.

## How to re-measure

```sh
# Site size and the Pages cap
bundle exec jekyll build && du -sh _site

# Redundant fallbacks: jpg/png that already have a .webp beside them
python3 - <<'PY'
import pathlib
root = pathlib.Path("_site/assets")
tot=n=0
for f in root.rglob("*"):
    if f.suffix.lower() in {".jpg",".jpeg",".png"} and f.with_suffix(".webp").exists():
        n+=1; tot+=f.stat().st_size
print(f"{n} files, {tot/1e6:.1f} MB")
PY

# Orphaned tiers: xlarge files no include call can request
# (compare each post's widths= arity against the files on disk)

# Reference surface, if reconsidering a move
grep -rho '/assets/images/[A-Za-z0-9._/-]*' --include='*.html' --include='*.md' \
  --include='*.css' --include='*.js' --include='*.yml' . | grep -v '^\./_site' | sort -u | wc -l
```

## Related

- `_docs/responsive-images.md`: the variant workflow this document proposes replacing with on-the-fly transforms
- `.claude/rules/images.md`: storage conventions and the no-hotlinking rule
- `_scripts/ingest-story-photos.py`: where tier generation happens
