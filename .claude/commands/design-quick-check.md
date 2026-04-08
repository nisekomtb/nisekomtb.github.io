---
description: Quick visual check of front-end changes at desktop and mobile viewports
allowed-tools: mcp__playwright__browser_navigate, mcp__playwright__browser_take_screenshot, mcp__playwright__browser_resize, mcp__playwright__browser_console_messages, mcp__playwright__browser_close, mcp__playwright__browser_snapshot, Bash, Read, Grep, Glob
---

You are performing a quick visual check of front-end changes before committing.

CHANGED FILES:
```
!`git diff --name-only`
```

STAGED FILES:
```
!`git diff --cached --name-only`
```

**Your task:**

1. **Identify affected pages** — from the changed/staged files above, determine which pages on the site are affected. Map file paths to URLs:
   - `events/index.html` → `http://localhost:4000/events/`
   - `_posts/2025-07-21-event.md` → check its permalink/categories to build the URL
   - `_layouts/event.html` → check a recent event post URL
   - `_includes/nav.html` → check homepage
   - `ja/` prefix pages → `http://localhost:4000/ja/{path}`

2. **Check Jekyll server** — verify `http://localhost:4000` is responding. If not, tell the user to start it with `bundle exec jekyll serve --baseurl=""`.

3. **For each affected page** (including JA mirrors):
   - Navigate to the page at desktop viewport (1440x900)
   - Take a screenshot
   - Resize to mobile viewport (375x812)
   - Take a screenshot
   - Check browser console for errors/warnings

4. **Report** — for each page, show the screenshots and note:
   - Does the page render correctly?
   - Any layout issues at either viewport?
   - Any console errors?
   - Any obvious visual problems?

Keep it brief. This is a quick check, not a full review. If you find significant issues, recommend running `/design-review` for a comprehensive assessment.
