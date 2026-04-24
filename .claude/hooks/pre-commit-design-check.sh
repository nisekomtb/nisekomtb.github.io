#!/bin/bash
# Check if any front-end files have changed compared to the remote branch
REMOTE_BRANCH=$(git rev-parse --abbrev-ref --symbolic-full-name @{upstream} 2>/dev/null || echo "origin/main")
FRONTEND_FILES=$(git diff --name-only "$REMOTE_BRANCH"...HEAD 2>/dev/null | grep -E '\.(html|css)$|^_layouts/|^_includes/')

if [ -n "$FRONTEND_FILES" ]; then
  echo "Front-end files changed since $REMOTE_BRANCH:" >&2
  echo "$FRONTEND_FILES" >&2
  echo "" >&2
  echo "Run /design-quick-check before pushing front-end changes." >&2
  exit 2
fi

exit 0
