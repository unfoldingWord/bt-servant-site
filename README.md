# BT Servant — Static Site (2026 Rebrand)

Marketing site for BT Servant — trusted Scripture guidance through conversation,
free on WhatsApp, Telegram, and the web. Pure static HTML/CSS/JS — no build
step. Ready to deploy to Netlify from GitHub.

## The 2026 identity

- **Mark:** "The Living Text" — a Torah-frame scroll carrying three typing
  dots (two paper, one bronze). Inline SVG everywhere; `assets/images/logo-mark.svg`
  and `favicon.svg` hold standalone copies.
- **Palette:** four built-in themes, switched via `<html data-theme="...">`:
  - **carbon** *(LOCKED as the live theme via `<html data-theme="carbon">`)* —
    near-black `#17161C` + white + amber `#E39A26`; maximum sharpness
  - **scriptorium** *(default when no attribute set)* — navy, bronze, vellum
  - **ultramarine** — white + ink + cobalt `#2F3BD3`; single-accent, modern
  - **midnight** — dark UI, violet + gold on deep indigo
  To lock one, set the attribute on the `<html>` tag (no other change needed).
- **Type:** Newsreader (display) + Inter (body/UI), both via Google Fonts.
- All colors/typography are CSS custom properties at the top of `assets/css/main.css`.
- The hero tagline **types itself** (typewriter with bronze caret) — echoing
  the typing-dots mark. The chat card's dots animate too. Both respect
  `prefers-reduced-motion` (static full line, no caret).

## Structure

```
.
├── index.html            Single-page landing (hero → intents → how it works →
│                         reach → why → organizations → partners → CTA)
├── 404.html              Branded 404 fallback
├── style.css             Legacy shim → @imports assets/css/main.css
├── netlify.toml          Netlify headers + .com → .ai redirects
└── assets/
    ├── css/main.css      Complete theme (self-contained, replaces old pair)
    ├── js/main.js        Nav, hero rotator, intent/reach/context tabs,
    │                     copy-link, GA4 track() helper
    └── images/           Brand mark and favicon
```

## Resolved since the previous redesign notes

- **WhatsApp link is real:** `https://wa.me/15558196461` (+1 555 819-6461,
  from the product home page in Notion) — used in every CTA.
- **Signal is live:** +1 (407) 205-2046 → `https://signal.me/#p/+14072052046`,
  with its own tab and CTAs.
- **Telegram is live:** `@bt_servant_bot` → `https://t.me/bt_servant_bot`,
  with its own tab and CTAs.
- **Partner logos:** rendered as styled text links (unfoldingWord, Spoken
  Worldwide, ETEN Innovation Lab) so no image files can 404. Swap in licensed
  SVG logos in `.partner-banner` when available.

## Still TODO before go-live

1. **Confirm `?intent=` deep links** — the intent CTA passes
   `?intent=understand` (etc.) to `app.btservant.ai/chat`; confirm the app
   reads it.
2. **Real partner story/testimonial** — the current story is illustrative.

## Deploy to Netlify

1. Push this folder to a GitHub repo.
2. Netlify → **Add new site → Import an existing project → GitHub** → pick the repo.
3. `netlify.toml` is read automatically — publish dir `.`, no build command.
4. Every push to `main` redeploys; PRs get preview URLs.

## Local preview

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```
