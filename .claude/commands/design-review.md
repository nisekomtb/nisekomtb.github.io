---
description: Comprehensive design review of front-end changes
allowed-tools: mcp__playwright__browser_navigate, mcp__playwright__browser_take_screenshot, mcp__playwright__browser_resize, mcp__playwright__browser_console_messages, mcp__playwright__browser_close, mcp__playwright__browser_snapshot, mcp__playwright__browser_click, mcp__playwright__browser_press_key, mcp__playwright__browser_evaluate, Bash, Read, Grep, Glob, WebFetch, TodoWrite, Agent
---

Conduct a comprehensive design review of the current front-end changes using the
@agent-design-review agent.

GIT STATUS:
```
!`git status`
```

FILES MODIFIED:
```
!`git diff --name-only`
```

DIFF CONTENT:
```
!`git diff`
```

Use the @agent-design-review agent to conduct a comprehensive design review of the
changes above. The review should follow the design principles in `_docs/design-principles.md`.
The Jekyll dev server is at http://localhost:4000.

Reply with the full design review report.
