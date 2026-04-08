#!/bin/bash
# Check if any staged files are front-end files
FRONTEND_FILES=$(git diff --cached --name-only | grep -E '\.(html|css)$|^_layouts/|^_includes/')

if [ -n "$FRONTEND_FILES" ]; then
  echo "Front-end files staged for commit:" >&2
  echo "$FRONTEND_FILES" >&2
  echo "" >&2
  echo "Run /design-quick-check before committing front-end changes." >&2
  exit 2
fi

exit 0
