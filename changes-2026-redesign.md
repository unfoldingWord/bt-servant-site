# 2026 Homepage Redesign — What changed & what needs your input before deploy

This redesign implements the full "BT Servant Website Content and Design Brief"
homepage structure (hero → intents → how it works → reach → why → orgs →
partners → final CTA), built on top of the existing repo's real CSS variables,
fonts, and JS conventions — nothing here is a mockup; it's a direct edit of
`index.html`, `assets/css/main.css`, and `assets/js/main.js`.

## Files changed
- `index.html` — full homepage rewrite (previous version preserved in git history)
- `assets/css/main.css` — original file untouched; new styles appended under
  the `REDESIGN 2026` banner comment near the bottom
- `assets/js/main.js` — original file untouched; new behavior appended inside
  the existing `DOMContentLoaded` callback, reusing the existing `track()` GA4 helper

## ⚠️ Things you need to supply or fix before this goes live

1. **Real WhatsApp / Signal / Telegram links.** I used `https://wa.me/message`
   and `#` as placeholders wherever a direct "Open in ___" link appears
   (hero, reach selector, mobile action buttons, final CTA). The repo doesn't
   contain your actual WhatsApp number/deep-link or Signal/Telegram usernames
   anywhere I could find — swap these in. Search for `wa.me/message` and `href="#"`
   in `index.html` and `main.js` to find every spot.

2. **Signal QR code asset.** There's no `qr-code-signal.png` in
   `assets/images/` (only WhatsApp and Telegram QR codes exist). The Signal
   tab in the "Available Wherever You Serve" selector references
   `assets/images/qr-code-signal.png` — add the real file or the tab will
   show a broken image.

3. **`?intent=` and `?prompt=`-style deep links.** The intent selector's CTA
   button and the hero's hand-off links pass `?intent=understand` (etc.) to
   `app.btservant.ai/chat`. Confirm the chat app reads this param and
   pre-fills/pre-routes accordingly — otherwise it opens to a generic chat.

4. **Partner story copy.** I wrote one illustrative partner story
   ("Supporting Bible translation training") following the brief's example
   structure. It's intentionally generic — I did not fabricate a quote or
   attribute one to a real person/organization. Swap in a real story and
   testimonial when you have one to share; there's a "Tell us about it" link
   in the meantime.

5. **Icons instead of real brand logos for WhatsApp/Signal/Telegram tabs.**
   I used simple line-icon glyphs (not Meta's/Signal's/Telegram's actual
   logomarks) to avoid reproducing third-party trademarks without permission.
   If you have licensed usage rights to their official brand marks, you can
   swap these in directly.

## Notable behavior
- Hero's rotating line pauses on hover/focus and respects
  `prefers-reduced-motion` (shows static text, no animation).
- Intent selector, reach/platform selector, and context-aware "Why" demo are
  all keyboard accessible (`role="tablist"`/`aria-selected`, or native
  `<details>` for the organization accordion — no custom JS needed there).
- Mobile: QR codes are hidden by default per the brief (§16); a
  "Show QR code for another device" toggle reveals them. Direct "Open in ___"
  buttons are primary on mobile.
- New sticky mobile action bar: "Ask BT Servant" / "Choose App".
- Footer expanded to Product / Access / Organizations / Resources columns
  (the CSS for this — `.site-footer__cols` — already existed in `main.css`
  but wasn't used in the old markup).
