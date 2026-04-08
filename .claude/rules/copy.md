# Copy & Content Rules

When adding or editing any visible text on namba.ngo — page copy, blog posts, event
descriptions, CTAs, meta descriptions, headings — follow this workflow to ensure content
is strategically effective, not just grammatically correct.

## Voice & tone

NAMBA's voice is welcoming, active, and community-focused. Write as a passionate local
who happens to build world-class trails — not as a corporate brand or tourism board.

- **Confident but not boastful** — let data and achievements speak ("21km+ of free trails"
  not "the best trails you'll ever ride")
- **Inclusive** — all abilities, all backgrounds, families and solo riders alike
- **Action-oriented** — "Ride," "Join," "Explore," "Build with us" — not passive
- **Grounded in place** — Niseko, Hokkaido, Japan. Reference the landscape, seasons, onsen,
  food. The destination is the differentiator
- **Nonprofit energy** — volunteers, community, stewardship. Never salesy

## Audiences

Every piece of copy serves at least one audience. Know which before writing:

| Audience | What they care about | Key pages |
|---|---|---|
| International riders | Trip planning, trail quality, "is it worth the flight?" | /plan-your-trip/, /twin-peaks/, /blog/ |
| Corporate sponsors | Impact data, brand exposure, ROI, growth trajectory | /get-involved/partner/, /impact/ |
| Media & influencers | The story, unique angles, high-res assets | /press/, /about/ |
| Local community | Events, volunteering, belonging | /events/, /get-involved/ |
| Resort & government | Expertise, multi-park vision, economic benefit | /about/projects/ |

Reference `_docs/marketing-strategy.md` §1 (Positioning & Messaging) for audience-specific
key messages.

## Required skills workflow

When creating or substantially editing page copy, invoke these skills in order. Skip
steps that genuinely don't apply, but err toward using them.

### 1. Before writing — understand intent

- **`/marketing-skills:product-marketing-context`** — if the page targets a new audience
  or the product context doc doesn't exist yet
- **`/marketing-skills:customer-research`** — if writing for an audience you don't have
  clear insight into

### 2. Strategy & structure

- **`/marketing-skills:content-strategy`** — for new content sections, blog planning, or
  deciding what to write
- **`/marketing-skills:site-architecture`** — if adding new pages or restructuring
  navigation
- **`/marketing-skills:copywriting`** — for writing or rewriting any marketing page copy
  (homepage, landing, pricing, features, about)

### 3. SEO integration

Every piece of content should be discoverable. Run at minimum:

- **`/claude-seo:seo-schema`** — ensure correct structured data (JSON-LD) for the page type
- **`/marketing-skills:schema-markup`** — supplement with any additional markup needed
- **`/claude-seo:seo-content`** — check E-E-A-T signals, readability, and content depth
- **`/marketing-skills:ai-seo`** — optimise for AI search engines (LLM citations, answer
  engines)

For blog posts and long-form content, also use:

- **`/claude-seo:seo-page`** — full single-page SEO analysis after writing
- **`/claude-seo:seo-hreflang`** — validate hreflang tags (every page is bilingual)

### 4. Conversion optimisation

If the page has a call to action (partner inquiry, membership signup, event registration,
shop link):

- **`/marketing-skills:page-cro`** — optimise the page for conversions
- **`/marketing-skills:signup-flow-cro`** — if the CTA is a signup or registration flow
- **`/marketing-skills:form-cro`** — if the page contains a form

### 5. Quality review

After writing, always run:

- **`/marketing-skills:copy-editing`** — review for clarity, tone consistency, and polish

## SEO non-negotiables

These apply to every page, every time:

- **Meta description** — unique, under 160 characters, includes target keyword naturally
- **Title tag** — under 60 characters, front-load the keyword
- **H1** — one per page, matches user intent
- **Heading hierarchy** — semantic H1 > H2 > H3, no skipped levels
- **Alt text** — on every image, bilingual (EN page gets EN alt, JA page gets JA alt)
- **Internal links** — link to at least 2 related pages on the site
- **Target keywords** — reference `_docs/marketing-strategy.md` §2 for keyword list

## Blog post checklist

Blog posts (`_posts/`) have additional requirements:

- [ ] Target keyword identified and used in title, H1, first paragraph, and meta description
- [ ] 1,000+ words for SEO value (shorter posts for news/announcements are fine)
- [ ] At least 3 internal links to other NAMBA pages
- [ ] CTA at the end (ride, visit, join, support — match the post topic)
- [ ] OG image set in front matter
- [ ] Both EN and JA versions created

## Sponsor-facing copy

Copy on /get-involved/partner/, /impact/, or any sponsor-facing page must:

- Lead with data (visitor numbers, growth %, trail km, funding record)
- Include social proof (named sponsors, media features, testimonials)
- Frame sponsorship as investment, not donation
- Reference the regional vision (not just Twin Peaks)

## Do not

- Do not use jargon that excludes beginners ("huck," "send it," "gnar") without context
- Do not make claims without data to back them up
- Do not write walls of text — use headings, short paragraphs, and visual breaks
- Do not forget the Japanese version — bilingual is non-negotiable
- Do not duplicate the marketing strategy doc — reference it, don't repeat it
