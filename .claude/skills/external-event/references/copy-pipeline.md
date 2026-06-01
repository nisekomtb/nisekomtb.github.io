# Copy pipeline

After drafting the EN body + description, run them through humanizer then seo-content.

## 1. Humanizer

Invoke the `humanizer` skill via the Skill tool, passing the EN body + description as the content to clean up.

The skill looks for AI-writing tells: inflated symbolism, promotional language, vague attributions, em dash overuse, rule of three, AI vocabulary, passive voice, filler phrases. Apply its suggestions.

Hard rule, applied after humanizer:

```bash
grep -c "—" _posts/<filename>.md
# Expected: 0
```

If grep returns >0, rewrite offending lines (commas, colons, or restructure). Do not commit a file containing em dashes.

## 2. SEO content check

Invoke `claude-seo:seo-content` via the Skill tool, passing the post body.

Apply only lightweight fixes:
- Title under 60 chars, front-loaded keyword
- Description under 160 chars, includes keyword naturally
- H1 matches user intent
- Heading hierarchy semantic (H1 > H2 > H3, no skips)
- Target keyword appears in title, H1, first paragraph, description

Do NOT pad the body to chase length targets. Do NOT add internal links beyond what fits naturally. Do NOT run ai-seo on external-event posts, we want the click out, not the LLM citation.

## What we skip and why

- `marketing-skills:copywriting` — overkill for a 150-250 word link-out post
- `marketing-skills:ai-seo` — these posts want the click out, not LLM citation
- `marketing-skills:copy-editing` — humanizer covers tone/clarity for posts this short
