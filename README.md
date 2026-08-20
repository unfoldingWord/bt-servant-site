# BT Servant — Static Site

Main site for BT Servant — trusted Scripture guidance through conversation,
free on WhatsApp, Telegram, Signal, and the web. Pure static HTML/CSS/JS — no
build step. 
## Brand identity

- **Logo:** raster lockups in `assets/images/` — `logo-full.png` (header,
  light background) and `logo-full-inverse.png` (footer, dark background),
  plus standalone mark/icon variants (`logo-mark.png`, `logo.png`) and SVG
  copies (`logo.svg`, `logo-light.svg`, `logo-mark.svg`) for favicons and
  print. Full brand lockups (primary + reversed, in black and charcoal
  backgrounds) live in `brand-assets/logos/`. The full style guide is at
  `brand-assets/bt-servant-style-guide.pdf` / `.html`.
- **Palette (locked theme):** set via `<html data-theme="carbon">` in
  `index.html`. Current values (from `assets/css/main.css`):
  - Charcoal `#23282C` — primary text/ink
  - Clarity Orange `#FF5A1F` — accent/CTA
  - Off-white `#FAF9F6` — background/paper
  - Tagline Gray `#9CA1A5` — muted text
  All colors are CSS custom properties (`--bt-navy`, `--bt-bronze`, etc. —
  names are legacy but values are the current brand refresh) at the top of
  `assets/css/main.css`, overridden per-theme in the `[data-theme="carbon"]`
  block. Do not change the `data-theme` attribute without also confirming
  the CSS block still matches brand guidelines.
- **Type:** Newsreader (display) + Inter (body/UI), both via Google Fonts.
- The hero tagline types itself (typewriter effect, respects
  `prefers-reduced-motion` with a static fallback line).

## Structure

```
.
├── index.html              Single-page landing (hero → intents → how it
│                           works → reach → why → organizations → partners
│                           → CTA)
├── organizations.html      Organizations page
├── 404.html                Branded 404 fallback
├── style.css               Legacy shim → @imports assets/css/main.css
├── netlify.toml             Netlify headers + asset caching
├── changes-2026-redesign.md Design/redesign notes
└── assets/
    ├── css/main.css        Complete theme (brand colors, typography, layout)
    ├── js/main.js          Nav, hero rotator, intent/reach tabs, GA4 track()
    └── images/
        ├── logo*.{svg,png}         Header/footer logo lockups + favicons
        ├── favicon*.png, .svg      Favicon set (16/32/48/64/180 + apple-touch)
        ├── qr-code*.png            Channel QR codes (WhatsApp, Telegram,
        │                           Signal, Web App) — icons embedded, verified
        │                           scannable
        ├── wa/                     Real BT Servant WhatsApp conversation
        │                           screenshots, one per intent
        └── partners/               Partner logos (unfoldingWord, ETEN
                                    Innovation Lab, Word Collective)

brand-assets/
├── bt-servant-style-guide.pdf / .html   Full brand/style guide
└── logos/                                Primary + reversed lockups
```

## Reach channels (live links)

All four are wired into the reach/QR section on the homepage and verified
to decode correctly:

- **WhatsApp:** `https://wa.me/15558196461?text=Hello%2C%20BT%20Servant` (a direct `wa.me`
  deep link — previously this went through a `scanned.page` short-link redirect,
  which required loading a browser before handing off to WhatsApp and failed
  when the QR code was scanned from inside WhatsApp itself; see change log below)
- **Telegram:** `@bt_servant_bot` → `https://t.me/bt_servant_bot`
- **Signal:** `https://signal.me/#eu/-RGNTp_ER2U74QlijVSyUHxU_EnzcvATLyvcTyCYS8r_jcbr-FlNxJcgZ7fPXTce`
- **Web App:** `https://app.btservant.ai/chat`

## Partners

Real logo images (not placeholder text) for unfoldingWord, ETEN Innovation
Lab, and Word Collective are in place at `assets/images/partners/` and
rendered in the `.partner-banner` section, each linking to the partner's
site.

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

## Editing content

All copy lives in `index.html` and `organizations.html`. Brand colors and
typography are CSS custom properties at the top of `assets/css/main.css`.
Logo, favicon, QR code, and partner images live under `assets/images/`.
