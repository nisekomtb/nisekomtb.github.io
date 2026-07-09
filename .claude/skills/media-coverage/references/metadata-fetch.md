# Metadata fetch cascade

Many outlets (Pinkbike, for one) sit behind Cloudflare and return 403 to both
WebFetch and curl. Work down this cascade until one yields the metadata.

## 1. curl with a browser user-agent (fast path)

```bash
curl -sL -A "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15" "<url>" -o /tmp/mc.html -w "HTTP %{http_code}\n"
```

If HTTP 200, extract:
```bash
grep -oE '<meta[^>]*property="og:(title|image)"[^>]*>' /tmp/mc.html
grep -oE '<meta[^>]*property="article:published_time"[^>]*>' /tmp/mc.html
grep -oE '<title>[^<]*</title>' /tmp/mc.html
```

If HTTP 403 or a Cloudflare challenge title, go to step 2.

## 2. Playwright MCP browser (real browser, defeats Cloudflare/JS)

Use the Playwright MCP tools:
1. `mcp__playwright__browser_navigate` to the URL.
2. `mcp__playwright__browser_evaluate` with a function returning the metadata:

```js
() => ({
  title: document.querySelector('meta[property="og:title"]')?.content || document.title,
  image: document.querySelector('meta[property="og:image"]')?.content,
  date: document.querySelector('meta[property="article:published_time"]')?.content
        || document.querySelector('time')?.getAttribute('datetime'),
  logo: document.querySelector('link[rel="apple-touch-icon"]')?.href
        || document.querySelector('meta[property="og:logo"]')?.content
})
```

The `og:image` and logo URLs are usually on an open CDN, so `curl` can download
them even when the article page itself is protected.

## 3. Manual paste (final fallback)

If both fail, ask the user for: headline, publish date, publication name, and
either an og:image URL or an image dropped into `assets/images/_triage/`.
