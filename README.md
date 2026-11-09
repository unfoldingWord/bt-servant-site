# BT Servant — website

Site for [btservant.ai](https://btservant.ai): trusted Scripture guidance through conversation, free on WhatsApp, Telegram, Signal, and the web. Built with [Astro](https://astro.build) and deployed to Cloudflare Pages. Astro is used only for the shared layout and the generated SEO/GEO files: the output is plain HTML/CSS/JS with no client framework.

The engineering follows [openbiblestories.org](https://github.com/unfoldingWord/obs-website) and [translationcore.com](https://github.com/unfoldingWord/translationCore-Suite-website) (same Astro setup and URL conventions, same Cloudflare Pages deployment, same SEO/GEO plumbing). BT Servant is English-only, so the localization machinery of those sites is left out. The design, copy and layout are BT Servant's own, carried over verbatim from the hand-written static site this repository used to hold (see "Migration" below).

## Local development

```
npm install
npm run dev      # dev server at http://localhost:4321/
npm run build    # builds the site into dist/
npm run preview  # serves the built dist/
```

Requires Node 18.20+ (Astro's minimum); `.nvmrc` pins 22.

Checks (CI runs all three on every pull request, `.github/workflows/checks.yml`):

```
npm test               # unit tests for the markdown content negotiation
npm run build
npm run check:routes   # after a build: links, assets, canonicals, JSON-LD, visible FAQ vs FAQPage, sitemaps, llms files, redirects
```

To try the Cloudflare Pages Function (markdown negotiation, below) locally: `npx wrangler pages dev dist`.

## Repository layout

| Path | What it is |
|---|---|
| `src/pages/` | One file per route: `index.astro` (home), `organizations/index.astro`, `404.astro`, plus the sitemaps, `/llms.txt`, `/llms-full.txt`, `/index.md`, `/organizations/index.md` and `/ai/*.json`. |
| `src/layouts/Base.astro` | The page shell: `<head>` (canonical, Open Graph, JSON-LD, analytics), header, footer, mobile bar, script. |
| `src/components/` | `Header.astro`, `Footer.astro`, `MobileBar.astro`, `GoogleAnalytics.astro`. |
| `src/data/site.ts` | **The facts and shared copy**: URLs, channel links, the six intents, the "why" cards, partners, the organizations paths, the FAQ, page titles/descriptions and `PAGE_UPDATED` dates. The pages render the intents, "why" cards, partners, organizations cards and FAQ from here, and the JSON-LD and markdown/JSON files read the same data, so editing a value here changes every copy of it. |
| `src/lib/` | `jsonld.ts` (structured data), `markdown.ts` (llms files, per-page markdown), `sitemap.ts`, `negotiate.js` (used by the Pages Function). |
| `functions/` | Cloudflare Pages Functions for `/` and `/organizations/` only: markdown content negotiation. |
| `public/` | Copied to the site root verbatim: `assets/` (CSS, JS, images), `brand-assets/` (style guide and logo lockups), `style.css` (legacy shim), `_headers`, `_redirects`, `robots.txt`, `.well-known/ai.txt`. |
| `scripts/` | `check-routes.mjs` (the post-build check) and `negotiate.test.mjs` (`npm test`). |
| `docs/` | `deployment.md` (Cloudflare setup and go-live), `search-visibility.md`. |

## Pages

| Page | URL | Source |
|---|---|---|
| Home | `/` | `src/pages/index.astro` |
| Organizations | `/organizations/` | `src/pages/organizations/index.astro` |
| Not found | any missing URL | `src/pages/404.astro` (standalone markup, `noindex`) |

## Brand identity

- **Logo:** raster lockups in `public/assets/images/`: `logo-full.png` (header, light background) and `logo-full-inverse.png` (footer, dark background), plus mark/icon variants and SVG copies for favicons and print. Full lockups live in `public/brand-assets/logos/`; the style guide is `public/brand-assets/bt-servant-style-guide.pdf` / `.html`.
- **Palette (locked theme):** `<html data-theme="carbon">` in `Base.astro`. Values (from `public/assets/css/main.css`): Charcoal `#23282C` (ink), Clarity Orange `#FF5A1F` (accent/CTA), Off-white `#FAF9F6` (paper), Tagline Gray `#9CA1A5` (muted). All colors are CSS custom properties (`--bt-navy`, `--bt-bronze`, …; the names are legacy, the values are the current brand) overridden in the `[data-theme="carbon"]` block. Do not change `data-theme` without confirming that block still matches the brand guidelines.
- **Type:** Newsreader (display) + Inter (body/UI), via Google Fonts.
- The hero tagline types itself (typewriter effect; respects `prefers-reduced-motion` with a static line).
- **Social image:** `public/assets/images/og-image.png` (1200 × 630), Charcoal background, inverse logo, Newsreader headline.

## Reach channels (live links)

Defined once in `src/data/site.ts` (the page markup and `public/assets/js/main.js` carry the same links):

- **WhatsApp:** `https://wa.me/15558196461?text=Hello%2C%20BT%20Servant` (number +1 555-819-6461; a direct `wa.me` deep link, which also works when the QR code is scanned from inside WhatsApp)
- **Telegram:** `@bt_servant_bot` → `https://t.me/bt_servant_bot`
- **Signal:** `https://signal.me/#eu/-RGNTp_ER2U74QlijVSyUHxU_EnzcvATLyvcTyCYS8r_jcbr-FlNxJcgZ7fPXTce`
- **Web App:** `https://app.btservant.ai/chat`

If a link changes, update `site.ts`, the matching `href`s in `src/pages/index.astro` / the components, and `CHANNELS` in `main.js`; `check:routes` does not follow external links.

## SEO and GEO

- **One JSON-LD `@graph` per page** (`src/lib/jsonld.ts`, emitted by `Base.astro`): `Organization` (unfoldingWord, with the same confirmed `sameAs` profiles unfoldingword.org and openbiblestories.org use), `WebSite` (BT Servant), `SoftwareApplication` (BT Servant itself: free, the four channels, the six intents) and `WebPage` (the page's own title, description, author/publisher and `dateModified`). The home page adds `FAQPage`. Every fact in the structured data is stated in the page copy.
- **Canonical host is the bare domain** `https://btservant.ai` (the `site` in `astro.config.mjs`, `SITE_URL` in `src/data/site.ts`, and every canonical, sitemap, JSON-LD and llms URL). URLs end in `/`. `www.btservant.ai` and the `btservant.com` hosts must 301 to it (zone rules, see `docs/deployment.md`).
- **Author and date on every page.** `<meta name="author">`, the `WebPage` author/publisher, and a "Last updated" date in the footer (`<time datetime>`). **When a page's copy or facts change, update its date in `PAGE_UPDATED` (`src/data/site.ts`)**: it drives the footer, `dateModified` and the sitemap `lastmod`.
- **Home FAQ.** A visible "Frequently asked questions" section and the `FAQPage` node, both rendered from `FAQ` in `src/data/site.ts`, so the structured data always matches the page (a Google requirement; `check:routes` verifies every question is visible). Answers restate only facts the site already states; keep it that way.
- **Sitemaps:** `sitemap-index.xml` → `sitemap-pages.xml` (both pages, with `lastmod`). `robots.txt` points at the index.
- **Markdown for AI agents.** `/llms.txt` (index: definition, pages, channels, intents, FAQ, project links), `/llms-full.txt` (the full text of both pages), `/index.md` and `/organizations/index.md` (each page as markdown, linked from its `<head>` as `rel="alternate" type="text/markdown"`). A request to `/` or `/organizations/` whose `Accept` header names `text/markdown` exactly, with q > 0 and no lower than `text/html`, gets that markdown from the Pages Function in `functions/`; every other request gets the static HTML (with `Vary: Accept`). All of it is generated from `src/data/site.ts`.
- **`/ai/summary.json`** and **`/ai/faq.json`** restate the same facts as JSON; **`/.well-known/ai.txt`** states the same allow-all policy as `robots.txt`. The engine's GitHub releases Atom feed is linked from every `<head>` as the update feed.
- **The GEO score.** openbiblestories.org and translationcore.com keep their [geo-optimizer](https://github.com/auriti-labs/geo-optimizer-skill) score in the 90s. Run the audit against production (not a pages.dev preview, which sends `X-Robots-Tag: noindex`) after any change to `<head>`, JSON-LD, the FAQ or `robots.txt`:

  ```
  uvx --from geo-optimizer-skill geo audit --url btservant.ai
  ```

  Before this migration production scored 42/100. This build scored 91/100 on a local Cloudflare Pages preview (`wrangler pages dev`) built with the canonical pointing at the audited host, i.e. the way production will be audited. The points still open: Knowledge Graph links (no Wikipedia, Wikidata, LinkedIn or Crunchbase profile could be confirmed for BT Servant or unfoldingWord; add one to `ORGANIZATION_SAME_AS` in `jsonld.ts` only once it is verified) and "front-loading" (a number in the first 30% of the page text, which would mean changing the hero copy).

## Crawlers and AI policy

`public/robots.txt` allows **every** crawler: search engines, live-retrieval agents (OAI-SearchBot, ChatGPT-User, PerplexityBot, Claude-SearchBot, …) and bulk training crawlers (GPTBot, Google-Extended, ClaudeBot, CCBot, …), each named in its own group. This is the policy openbiblestories.org adopted in [unfoldingWord/obs-website#15](https://github.com/unfoldingWord/obs-website/issues/15) and translationcore.com follows. If BT Servant needs a different policy, change it here and in the Cloudflare dashboard together.

**As of 2026-11-09 the btservant.ai zone does not match this policy:** Cloudflare prepends its managed robots.txt (`Content-Signal: ai-train=no`, `Disallow: /` for GPTBot, ClaudeBot, Google-Extended, CCBot and others), and its bot settings answer GPTBot and PerplexityBot with HTTP 403. Those are zone settings, not files in this repository; `docs/deployment.md` step 3 lists what to switch off. Verify after go-live:

```
curl -fsS https://btservant.ai/robots.txt > /tmp/robots.txt \
  && ! grep -Ei '^[[:space:]]*(Disallow|Content-Signal)[[:space:]]*:' /tmp/robots.txt \
  && echo "OK: served robots.txt has no Disallow or Content-Signal directive"
```

## Google Analytics

`src/components/GoogleAnalytics.astro` emits the same GA4 snippet the static site used (measurement ID `G-LT1CE2F1PZ`, override with `PUBLIC_GA_MEASUREMENT_ID`), in production builds only. The `gtag.js` loader is fetched only on `btservant.ai` and `www.btservant.ai`, so pages.dev previews send nothing. `public/assets/js/main.js` sends the click events (`data-track` attributes, `intent_select`, `reach_tab`, `copy_link`). The 404 page loads the same tag.

## Caching and redirects (`public/_headers`, `public/_redirects`)

- HTML: `public, max-age=300, s-maxage=86400, stale-while-revalidate=86400` (browsers revalidate after five minutes; Pages purges the edge on every deploy). Security headers carried over from the Netlify config: `X-Frame-Options: SAMEORIGIN`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`.
- `/assets/images/*`: one year, `immutable`. `/assets/js/*`, `/assets/css/*`, `/style.css`: `no-cache` plus `s-maxage`, because they are edited in place under the same filenames. (The Netlify config cached all of `/assets/*` as immutable, so an edited `main.css` could stay stale in browsers for a year.)
- `/index.html` → `/` and `/organizations.html` → `/organizations/` (301). `/organizations` → `/organizations/` is Cloudflare Pages' own trailing-slash redirect.
- Host redirects (`www.btservant.ai`, `btservant.com`, `www.btservant.com` → `https://btservant.ai`) are zone Redirect Rules, not `_redirects` lines: Pages ignores domain-level rules there.
- Retiring a route is a two-part change: delete the page **and** add a `_redirects` rule. `check:routes` fails on a redirect whose target was not built, or one that chains.

## Deployment

Cloudflare Pages: project `bt-servant-site`, production branch `main`, via the Git integration. Build command `npm run build`, output directory `dist` (also in `wrangler.jsonc`); `functions/` is picked up automatically. Every other branch gets a preview at `<branch>.bt-servant-site.pages.dev`. The one-time setup and the cut-over from Netlify are in **`docs/deployment.md`**.

## Migration from the static site

Until this change the repository was a hand-written static site published by Netlify from the repo root. It was turned into this Astro project mechanically:

- `index.html` and `organizations.html` → `src/pages/index.astro` and `src/pages/organizations/index.astro`: the `<main>` markup carried over verbatim; the repeated header, footer, mobile bar and `<head>` became `Base.astro` and the components. `404.html` → `src/pages/404.astro`, verbatim. `assets/`, `brand-assets/` and `style.css` moved to `public/` unchanged.
- Asset and page links became root-absolute (`/assets/…`, `/#where-to-use-it`, `/organizations/`), including the image paths in `main.js`, so they resolve from `/organizations/`.
- **Verified:** before the SEO/GEO additions, every page rendered pixel-identical to the static site at 1280 px and 390 px (Chromium full-page screenshots, reduced motion, 0 differing pixels on all 3 pages). After them, everything above the new FAQ section is still pixel-identical, and the final CTA and footer differ only by sub-pixel anti-aliasing from the shift, plus the new "Last updated" date.
- Visible additions (for GEO): the home page FAQ section (built from the existing `org-card` accordion styles) and the footer's "Last updated" date. Everything else added is in `<head>` or in separate files.
- Removed: `netlify.toml` (its headers and redirects moved to `_headers`, `_redirects` and zone rules).
