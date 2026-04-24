# BT Servant — Static Site

Landing page for BT Servant (AI-powered Bible translation assistant).
Pure static HTML/CSS/JS — no build step, no server-side code. Ready to
deploy to Netlify from GitHub.

## Structure

```
.
├── index.html         Site (single-page landing)
├── style.css          Theme variables + typography
├── netlify.toml       Netlify build/headers config
├── .gitignore
└── assets/
    ├── css/main.css   Main stylesheet
    ├── js/main.js     Mobile nav + smooth scroll
    └── images/        Logos, QR code, partner logos
```

## Deploy to Netlify via GitHub

1. Create a new repository on GitHub (e.g. `bt-servant-site`).
2. From this folder:
   ```bash
   git init
   git add .
   git commit -m "Initial BT Servant static site"
   git branch -M main
   git remote add origin https://github.com/<your-org>/bt-servant-site.git
   git push -u origin main
   ```
3. In Netlify: **Add new site → Import an existing project → GitHub**, pick the repo.
4. Netlify reads `netlify.toml` automatically:
   - Publish directory: `.` (repo root)
   - Build command: none
5. Click **Deploy**. Every push to `main` redeploys the site.

## Local preview

Opening `index.html` directly via `file://` works for most things, but
some browsers treat relative paths differently. For an accurate preview:

```bash
npx serve .
# or
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## Editing content

All copy lives in `index.html`. Brand colors and typography are defined
as CSS custom properties at the top of `assets/css/main.css`. The logo
and image assets live under `assets/images/`.
