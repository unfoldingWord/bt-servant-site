# Deploying btservant.ai on Cloudflare Pages

One-time setup and the cut-over from Netlify. The repository side (`wrangler.jsonc`, `functions/`, `public/_headers`, `public/_redirects`, `public/robots.txt`) is in place; these steps are the dashboard side, which cannot be done from the repository. They mirror how openbiblestories.org (`obs-website`) and translationcore.com (`translationcore-website`) are deployed.

## Where things stand before the cut-over (checked 2026-11-09)

- `btservant.ai` is a Cloudflare zone. The apex is proxied by Cloudflare and 301-redirects to `https://www.btservant.ai/`.
- `www.btservant.ai` is served by **Netlify** (`server: Netlify`), from this repository's old `netlify.toml` setup.
- `btservant.com` is served by Netlify, which 301-redirects it to `https://www.btservant.ai/`.
- Cloudflare prepends its **managed robots.txt** on `btservant.ai` (`Content-Signal: search=yes,ai-train=no,use=reference`, and `Disallow: /` for GPTBot, ClaudeBot, Google-Extended, CCBot, Amazonbot, Applebot-Extended, Bytespider and others), and answers GPTBot and PerplexityBot with **HTTP 403**.

The new site is canonical on the **apex**, `https://btservant.ai` (as openbiblestories.org and translationcore.com are), so the existing apex → www rule has to be reversed (step 2).

## 1. Create the Pages project

1. Cloudflare dashboard → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**.
2. Pick **unfoldingWord/bt-servant-site**. If it is not listed, use "Configure GitHub App" to give the Cloudflare app access to it.
3. Set up builds:
   - **Project name:** `bt-servant-site`. It must match `name` in `wrangler.jsonc`, or the build fails.
   - **Production branch:** `main`
   - **Framework preset:** Astro
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
   - **Root directory:** the repository root (so `functions/` is deployed with the site). Node comes from `.nvmrc` (22).
4. **Save and Deploy.** Open `bt-servant-site.pages.dev` (or the URL the project's overview shows) and spot-check `/`, `/organizations/`, `/llms.txt`, `/sitemap-index.xml` and a missing URL (branded 404). Check the markdown negotiation:

   ```
   curl -s -H 'Accept: text/markdown' https://bt-servant-site.pages.dev/ | head -3   # markdown
   curl -sI https://bt-servant-site.pages.dev/ | grep -i content-type                 # text/html
   ```

Every other branch and pull request gets a preview at `<branch>.bt-servant-site.pages.dev`; Cloudflare sends `X-Robots-Tag: noindex` on previews.

## 2. Attach the domains and flip the host redirect (the go-live step)

1. Pages project → **Custom domains** → add `btservant.ai`, then `www.btservant.ai`. **Both must be attached**, or `www` stops serving anything. Cloudflare replaces the existing `@` and `www` records (which point at Netlify) with CNAMEs to `bt-servant-site.pages.dev`; if it refuses, delete the old records first.
2. Wait for both to show **Active**.
3. btservant.ai zone → **Rules → Redirect Rules**:
   - **Delete (or disable) the existing rule that sends the apex to `www`.** Left in place it would redirect the canonical URL away from itself.
   - **Create** `www_to_apex` (the same rule as on openbiblestories.org): wildcard pattern `https://www.btservant.ai/*` → `https://btservant.ai/${1}`, **301**, **Preserve query string** on.
4. **btservant.com.** Until now Netlify redirected it, from `netlify.toml`, which this change removes. Pick one before the Netlify site is shut down:
   - *Recommended:* add `btservant.com` to Cloudflare as a zone (if it is not already), give the apex and `www` proxied placeholder records (e.g. `AAAA 100::`), and add a Redirect Rule `https://*btservant.com/*` → `https://btservant.ai/${2}`, 301, preserve query string.
   - *Or* keep a minimal Netlify site with only the four `.com` redirects that used to be in `netlify.toml` (`[[redirects]] from = "https://btservant.com/*" to = "https://btservant.ai/:splat" status = 301 force = true`, and the same for `www.` and `http://`). Note the target changes from `www.btservant.ai` to `btservant.ai`.
5. Once the Pages domains are active and `.com` is handled, remove `btservant.ai` / `www.btservant.ai` from the Netlify site so it stops renewing certificates for them.

Leave the zone's other records alone, especially `app.btservant.ai` (the web app) and any MX/TXT records.

## 3. Zone settings that override the repository

These decide whether crawlers ever see `public/robots.txt`. They are what made the old site score poorly on AI crawler access.

- **Security → Settings → AI Crawler and Agent access** (or **AI Crawl Control**): set every category (Search, Training, Agents) to **Allow (do not block)**. GPTBot and PerplexityBot currently get HTTP 403.
- **Managed robots.txt / Bot Preference Sync: off.** With it on, Cloudflare prepends `Content-Signal: … ai-train=no` and `Disallow: /` groups for the training crawlers ahead of this repository's file. AI Crawl Control → Signals should then show "Not set".
- **Bot Fight Mode** and **AI Labyrinth**: off (as on the sister sites).
- **Caching:** no Cache Rules are needed. HTML should come back with the `cache-control` from `public/_headers`; if it shows `no-store` or another `max-age`, a Cache Rule or the zone's Browser Cache TTL is overriding it ("Respect Existing Headers" avoids that).
- **Optional:** if the plan offers Cloudflare's *Markdown for Agents*, it is not needed here; the Pages Function already answers `Accept: text/markdown` for both pages with hand-built markdown.

## 4. Verify production

```
curl -sI https://www.btservant.ai/organizations/ | grep -iE '^HTTP|^location'   # 301 -> https://btservant.ai/organizations/
curl -sI https://btservant.com/ | grep -iE '^HTTP|^location'                     # 301 -> https://btservant.ai/
curl -sI https://btservant.ai/ | grep -iE '^HTTP|cache-control|vary'             # 200, max-age=300 …, Vary: Accept
curl -sI https://btservant.ai/organizations.html | grep -iE '^HTTP|^location'    # 301 -> /organizations/
curl -sI -A 'GPTBot/1.0' https://btservant.ai/ | grep -i '^HTTP'                  # 200, not 403
curl -s  https://btservant.ai/robots.txt | grep -Ei '^(Disallow|Content-Signal)'  # no output
curl -s  -H 'Accept: text/markdown' https://btservant.ai/ | head -3               # markdown
uvx --from geo-optimizer-skill geo audit --url btservant.ai                       # expect 90+
```

Then follow `docs/search-visibility.md`.

## Optional: deploy without the Git integration

`npx wrangler pages deploy dist --project-name bt-servant-site` uploads a local build (run it from the repository root so `functions/` is included). It needs a Cloudflare API token with *Cloudflare Pages: Edit* in `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`. The Git integration is the intended path; this is for emergencies.
