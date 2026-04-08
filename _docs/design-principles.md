# Design Principles

Design standards for namba.ngo. Used by the design review agent to evaluate front-end
changes.

---

## Visual consistency

- Follow existing CSS patterns — no inline styles unless layout-specific (as in
  `event.html`)
- Use existing Bootstrap grid and classes
- Consistent spacing and alignment with the rest of the site
- Masthead images: full-width, with optional credit overlay
- Partner logos: greyscale by default, colour on hover

## Typography

- Use the existing font stack and hierarchy — do not introduce new fonts
- Heading levels must be semantic (h1, h2, h3 — no levels skipped)
- Body text must be legible at all viewport sizes
- Japanese text should be processed through BudouX for word-boundary hints

## Images

- Meaningful alt text on all images (bilingual — EN and JA versions)
- Optimise all images before committing — avoid large uncompressed files
- OG images at 1200x630px
- Follow folder conventions: `assets/images/[page-slug]/`
- Event images: header 2000px wide, thumbnail 504x672px

## Responsive

- Must work at desktop (1440px), tablet (768px), mobile (375px)
- No horizontal scrolling at any viewport
- Navigation collapses to off-canvas menu on mobile
- Tables should be responsive or scroll horizontally
- Masthead images must scale properly across breakpoints

## Accessibility (WCAG AA)

- Colour contrast 4.5:1 minimum for text
- All interactive elements must be keyboard-accessible
- Visible focus states on all focusable elements
- Semantic HTML over decorative divs (use nav, main, article, section)
- Form labels must be associated with their inputs
- Skip navigation link for keyboard users (if applicable)

## Bilingual

- Every page must have both EN and JA versions
- JA page must structurally mirror the EN page
- Japanese text processed through BudouX (zero-width spaces at word boundaries)
- Bilingual alt text on images

## Performance

- No large uncompressed images in the repo
- No unnecessary JavaScript
- No external dependencies beyond what is already in the project
- No npm, webpack, or build pipelines
