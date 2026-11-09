# Search visibility

What to do once btservant.ai is served by the new site (see `deployment.md`).

## Search Console and Bing

1. Google Search Console → **Add property** → **Domain** → `btservant.ai` (verify with the DNS TXT record Cloudflare can add). A domain property covers `www` and both protocols. If a URL-prefix property for `https://www.btservant.ai/` already exists, keep it to watch the redirect, but treat the domain property as the main one.
2. **Sitemaps** → submit `https://btservant.ai/sitemap-index.xml`.
3. **URL inspection** on `/` and `/organizations/` → Request indexing.
4. Bing Webmaster Tools → **Import from Google Search Console** (or add the site and submit the same sitemap). Bing also feeds DuckDuckGo, Copilot and ChatGPT search.
5. Cloudflare → btservant.ai → **Caching → Configuration → Crawler Hints**: on. Cloudflare then sends IndexNow notices when pages change, so no IndexNow key file is needed in `public/`.

## What to watch

- **Pages → Not found (404):** each URL there is an old link that needs a `_redirects` rule, or a typo elsewhere.
- **Pages → Page with redirect / Alternate page with proper canonical:** should list only `www.btservant.ai`, `.html` and `btservant.com` URLs, which redirect. Anything else means a canonical is wrong (`check:routes` asserts canonicals at build time).
- **Enhancements → FAQ / Software apps:** the `FAQPage` and `SoftwareApplication` structured data show up here. Warnings about missing `aggregateRating` are expected for software apps and should not be "fixed" with invented ratings.

## Generative answers (GEO)

Run the open-source audit against production after any change to `<head>`, JSON-LD, the FAQ or `robots.txt`:

```
uvx --from geo-optimizer-skill geo audit --url btservant.ai
```

The sister sites keep this in the 90s. A pages.dev preview scores lower because of its `noindex` header and because its canonical points at btservant.ai; audit production only. If the score drops, the usual causes are zone settings (managed robots.txt switched back on, AI crawlers blocked) rather than the site itself.
