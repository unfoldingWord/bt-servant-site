// Facts and copy shared by the HTML pages, the JSON-LD, /llms.txt,
// /llms-full.txt and the /ai/*.json files. Anything stated in more than one
// of those places lives here, so the machine-readable files cannot drift from
// what a visitor reads on the page.
//
// Rule: every fact here must already be stated on the site (or, for the
// engine, in its own README). Do not add claims for search engines that a
// visitor cannot read on the page.

import { content } from '../i18n/content';

/** Canonical origin. Must match `site` in astro.config.mjs. */
export const SITE_URL = 'https://btservant.ai';
export const PRODUCT_NAME = 'BT Servant';

export const PUBLISHER_NAME = 'unfoldingWord';
export const PUBLISHER_URL = 'https://unfoldingword.org/';
export const PUBLISHER_ABOUT_URL = 'https://unfoldingword.org/about-2/';
export const CONTACT_URL = 'https://unfoldingword.org/contact/';

export const WEB_APP_URL = 'https://app.btservant.ai/chat';
export const WEB_APP_LOGIN_URL = 'https://app.btservant.ai/login';
export const WEB_APP_HOME_URL = 'https://app.btservant.ai';
/** The number behind the WhatsApp link (wa.me/15558196461). */
export const WHATSAPP_NUMBER = '+1 555-819-6461';
export const WHATSAPP_URL = 'https://wa.me/15558196461?text=Hello%2C%20BT%20Servant';
export const TELEGRAM_URL = 'https://t.me/bt_servant_bot';
export const TELEGRAM_HANDLE = '@bt_servant_bot';
export const SIGNAL_URL = 'https://signal.me/#eu/-RGNTp_ER2U74QlijVSyUHxU_EnzcvATLyvcTyCYS8r_jcbr-FlNxJcgZ7fPXTce';

export const GITHUB_URL = 'https://github.com/unfoldingWord/bt-servant-engine';
export const RELEASES_URL = 'https://github.com/unfoldingWord/bt-servant-engine/releases';
/** GitHub's Atom feed of engine releases, linked from every page's <head>
 *  as the site's update feed (the footer links the same releases page). */
export const RELEASES_FEED_URL = 'https://github.com/unfoldingWord/bt-servant-engine/releases.atom';
export const DISCORD_URL = 'https://discord.gg/pvzDWQ82zq';
export const DEMO_VIDEO_URL = 'https://www.youtube.com/watch?v=dIda6Q2lGYE&list=PLa3_fZSWwn6AEbqMCPamBokvLxCUtwMXB';

/** One-sentence English definition, kept identical wherever it appears
 *  (WebSite and SoftwareApplication JSON-LD, /llms.txt, /ai/summary.json;
 *  the first FAQ answer says the same in other words). */
export const DEFINITION =
  'BT Servant is a free AI assistant from unfoldingWord that gives trusted, context-aware Scripture guidance through conversation, on WhatsApp, Telegram, Signal, and the web.';

/** When each page's content last changed (YYYY-MM-DD). Shown in the page's
 *  footer ("Last updated") and emitted as its WebPage dateModified, so the
 *  two always agree. Update a page's date when its copy or facts change; a
 *  change to the shared header or footer changes every page. */
export const PAGE_UPDATED = {
  home: '2026-11-09',
  organizations: '2026-11-09',
} as const;
export type PageKey = keyof typeof PAGE_UPDATED;

// English copy, read from src/i18n/en/*.json (the same strings the English
// pages render), for the English-only machine-readable files: /llms.txt,
// /llms-full.txt, the markdown pages, /ai/*.json and the JSON-LD.
const EN_HOME = content<any>('en', 'home');
const EN_ORGS = content<any>('en', 'organizations');

export const PAGES: { key: PageKey; path: string; title: string; description: string }[] = [
  { key: 'home', path: '/', title: EN_HOME.meta.title, description: EN_HOME.meta.description },
  { key: 'organizations', path: '/organizations/', title: EN_ORGS.meta.title, description: EN_ORGS.meta.description },
];
export const page = (key: PageKey) => PAGES.find((p) => p.key === key)!;

export const CHANNELS = [
  { name: 'WhatsApp', url: WHATSAPP_URL },
  { name: 'Telegram', url: TELEGRAM_URL, note: TELEGRAM_HANDLE },
  { name: 'Signal', url: SIGNAL_URL },
  { name: 'Web App', url: WEB_APP_URL, note: 'app.btservant.ai' },
];

/** The six starting points on the home page ("What would you like to do
 *  today?"), in order. The key is the intent's data-intent value (also used
 *  by public/assets/js/main.js and the ?intent= link to the web app); the
 *  copy is `intents.items` in src/i18n/{locale}/home.json, in the same order. */
export const INTENT_KEYS = ['understand', 'study', 'teach', 'translate', 'share', 'equip'] as const;
export const INTENTS = INTENT_KEYS.map((key, i) => ({
  key,
  name: plainText(EN_HOME.intents.items[i].name),
  text: plainText(EN_HOME.intents.items[i].text),
}));

/** "Guidance you can trust" cards (English). */
export const WHY: { name: string; text: string }[] = EN_HOME.why.items.map((w: any) => ({
  name: plainText(w.name),
  text: plainText(w.text),
}));

export const LANGUAGES_LINE = 'English, Indonesian, Spanish, and many more languages. Audio supported.';

export const PARTNERS = [
  { name: 'unfoldingWord', url: 'https://www.unfoldingword.org/', logo: '/assets/images/partners/unfoldingword.png' },
  { name: 'ETEN Innovation Lab', url: 'https://www.etenlab.org', logo: '/assets/images/partners/eten-innovation-lab.png' },
  { name: 'Word Collective', url: 'https://www.wordcollective.com/', logo: '/assets/images/partners/word-collective.png' },
  { name: 'Spoken Worldwide', url: 'https://spoken.org/', logo: '/assets/images/partners/spoken-worldwide.png' },
];

/** The organizations page: Use → Customize → Integrate, in order. The id is
 *  the card's anchor (/organizations/#use …); the copy is `cards` in
 *  src/i18n/{locale}/organizations.json. `detail` may carry inline HTML. */
export const ORG_IDS = ['use', 'customize', 'integrate'] as const;
export const ORG_PATHS = ORG_IDS.map((id, i) => ({
  id,
  name: EN_ORGS.cards[i].name as string,
  summary: EN_ORGS.cards[i].summary as string,
  detail: EN_ORGS.cards[i].detail as string,
}));

/** Home page FAQ (English): `faq.items` in src/i18n/en/home.json. Every
 *  locale renders its own FAQ as a visible section AND as FAQPage JSON-LD
 *  (Google requires structured-data answers to be visible on the page);
 *  /ai/faq.json and /llms.txt carry the English one. Answers may carry inline
 *  HTML (links); the machine-readable copies strip it. Every answer restates
 *  a fact the site already states elsewhere: keep it that way. */
export const FAQ: { q: string; a: string }[] = EN_HOME.faq.items;

/** Decode the HTML entities the i18n strings use. */
export function decodeEntities(s: string): string {
  return s
    .replace(/&rsquo;/g, '\u2019')
    .replace(/&lsquo;/g, '\u2018')
    .replace(/&rdquo;/g, '\u201d')
    .replace(/&ldquo;/g, '\u201c')
    .replace(/&mdash;/g, '\u2014')
    .replace(/&ndash;/g, '\u2013')
    .replace(/&middot;/g, '\u00b7')
    .replace(/&copy;/g, '\u00a9')
    .replace(/&rarr;/g, '\u2192')
    .replace(/&nbsp;/g, ' ')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&');
}

/** Strip the inline HTML used in the strings (for JSON-LD, JSON and text). */
export function plainText(html: string): string {
  return decodeEntities(html.replace(/<[^>]+>/g, '')).trim();
}

/** Inline HTML → markdown (for /llms.txt, /llms-full.txt and the .md pages). */
export function markdownText(html: string): string {
  return decodeEntities(
    html
      .replace(/<a href="([^"]+)"[^>]*>([^<]+)<\/a>/g, (_, href: string, text: string) =>
        `[${text}](${href.startsWith('/') ? SITE_URL + href : href})`
      )
      .replace(/<strong>([^<]+)<\/strong>/g, '**$1**')
      .replace(/<em>([^<]+)<\/em>/g, '*$1*')
      .replace(/<[^>]+>/g, '')
  ).trim();
}
