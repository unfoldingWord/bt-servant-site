// Facts and copy shared by the HTML pages, the JSON-LD, /llms.txt,
// /llms-full.txt and the /ai/*.json files. Anything stated in more than one
// of those places lives here, so the machine-readable files cannot drift from
// what a visitor reads on the page.
//
// Rule: every fact here must already be stated on the site (or, for the
// engine, in its own README). Do not add claims for search engines that a
// visitor cannot read on the page.

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

export const PAGES: { key: PageKey; path: string; title: string; description: string }[] = [
  {
    key: 'home',
    path: '/',
    title: 'BT Servant — Trusted Scripture guidance, in the tools you already use',
    description:
      'BT Servant equips disciples to understand, study, teach, translate, share, and equip others with God’s Word — free on WhatsApp, Telegram, and the web.',
  },
  {
    key: 'organizations',
    path: '/organizations/',
    title: 'BT Servant for Organizations — Use it, customize it, integrate it',
    description:
      'Bring BT Servant’s trusted, context-aware Scripture guidance to your team — free to use, customizable for your resources and workflows, and open source to integrate into your own apps.',
  },
];
export const page = (key: PageKey) => PAGES.find((p) => p.key === key)!;

export const CHANNELS = [
  { name: 'WhatsApp', url: WHATSAPP_URL },
  { name: 'Telegram', url: TELEGRAM_URL, note: TELEGRAM_HANDLE },
  { name: 'Signal', url: SIGNAL_URL },
  { name: 'Web App', url: WEB_APP_URL, note: 'app.btservant.ai' },
];

/** The six starting points on the home page ("What would you like to do
 *  today?"). `key` is the intent's data-intent value (also used by
 *  public/assets/js/main.js and the ?intent= link to the web app). */
export const INTENTS = [
  { key: 'understand', name: 'Understand', text: 'What a passage means.' },
  { key: 'study', name: 'Study', text: 'Context, questions, resources.' },
  { key: 'teach', name: 'Teach', text: 'Lessons and discussions.' },
  { key: 'translate', name: 'Translate', text: 'Terms, meaning, decisions.' },
  { key: 'share', name: 'Share', text: 'The gospel, said clearly.' },
  { key: 'equip', name: 'Equip', text: 'Train and multiply leaders.' },
];

/** "Guidance you can trust" cards. */
export const WHY = [
  { name: 'Trusted', text: 'Grounded in vetted biblical resources — not the open internet.' },
  { name: 'Natural', text: 'Text or voice. No commands to learn.' },
  { name: 'Human-centered', text: 'Supports pastors, teachers, and translators. Never replaces them.' },
];

export const LANGUAGES_LINE = 'English, Indonesian, Spanish, and many more languages. Audio supported.';

export const PARTNERS = [
  { name: 'unfoldingWord', url: 'https://www.unfoldingword.org/', logo: '/assets/images/partners/unfoldingword.png' },
  { name: 'ETEN Innovation Lab', url: 'https://www.etenlab.org', logo: '/assets/images/partners/eten-innovation-lab.png' },
  { name: 'Word Collective', url: 'https://www.wordcollective.com/', logo: '/assets/images/partners/word-collective.png' },
  { name: 'Spoken Worldwide', url: 'https://spoken.org/', logo: '/assets/images/partners/spoken-worldwide.png' },
];

/** The organizations page: Use → Customize → Integrate. `id` is the card's
 *  anchor (/organizations/#use …). `detail` may carry inline HTML (<strong>). */
export const ORG_PATHS = [
  {
    id: 'use',
    name: 'Use',
    summary: 'Free access for your team on WhatsApp, Telegram, and the web.',
    detail: '<strong>Best for:</strong> teams, pilots, workshops.',
  },
  {
    id: 'customize',
    name: 'Customize',
    summary: 'Your resources, language, tone, and workflows.',
    detail: 'Custom modes (Trainer, Translator, Checking), white-label deployments, and production support — through partner commitments.',
  },
  {
    id: 'integrate',
    name: 'Integrate',
    summary: 'Bring trusted guidance into your own apps.',
    detail: 'The engine is open source — embed it or self-host it, free.',
  },
];

/** Home page FAQ. Rendered as a visible section AND as FAQPage JSON-LD,
 *  /ai/faq.json and the FAQ in /llms.txt — Google requires structured-data
 *  answers to be visible on the page. Answers may carry inline HTML (links);
 *  the machine-readable copies strip it. Every answer restates a fact the
 *  site already states elsewhere: keep it that way. */
export const FAQ: { q: string; a: string }[] = [
  {
    q: 'What is BT Servant?',
    a: `BT Servant is a free AI assistant from unfoldingWord that gives trusted, context-aware Scripture guidance through conversation, inside the messaging apps people already use and on the web. It helps disciples understand, study, teach, translate, and share God\u2019s Word, and equip others to do the same.`,
  },
  {
    q: 'What can I ask BT Servant?',
    a: 'Start from what you need: understand what a passage means; study its context, questions, and resources; teach with lessons and discussions; translate terms, meaning, and decisions; share the gospel clearly; or equip others to train and multiply leaders. The rest is a conversation.',
  },
  {
    q: 'Where can I use BT Servant?',
    a: `On WhatsApp (${WHATSAPP_NUMBER}), on Telegram (${TELEGRAM_HANDLE}), on Signal, and in any web browser at <a href="${WEB_APP_URL}">app.btservant.ai</a>. Ask in text or voice; there are no commands to learn.`,
  },
  {
    q: 'How do I start a conversation?',
    a: 'Scan the QR code on this page with your phone, or tap the button for the app you already use. Send any question, then reply in text or voice. You can begin in a browser and continue on your phone later.',
  },
  {
    q: 'Does BT Servant cost anything?',
    a: 'No. BT Servant is free for individuals and for teams. Organizations can also customize it through partner commitments, or build its engine into their own apps.',
  },
  {
    q: 'Which languages does BT Servant support?',
    a: 'English, Indonesian, Spanish, and many more languages. You can ask and get answers in text or by voice.',
  },
  {
    q: 'Where do BT Servant\u2019s answers come from?',
    a: 'Answers are grounded in vetted biblical resources rather than the internet at large. Translation questions, for example, draw on Translation Words and Translation Academy. BT Servant supports pastors, teachers, and translators; it never replaces them.',
  },
  {
    q: 'Who makes BT Servant?',
    a: `BT Servant is a project of <a href="${PUBLISHER_ABOUT_URL}">unfoldingWord</a>, built with ministry partners ETEN Innovation Lab, Word Collective, and Spoken Worldwide. Its engine is published on <a href="${GITHUB_URL}">GitHub</a>, free to embed or self-host.`,
  },
  {
    q: 'Can my organization use BT Servant?',
    a: 'Yes. Teams can <a href="/organizations/">use it, customize it, or integrate it</a>: free access for the whole team; custom modes such as Trainer, Translator, and Checking; or the engine itself inside your own tools.',
  },
];

/** Strip the inline HTML used in FAQ answers (for JSON-LD, JSON and text). */
export function plainText(html: string): string {
  return html
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&rsquo;/g, '’')
    .replace(/&mdash;/g, '—')
    .replace(/&nbsp;/g, ' ')
    .trim();
}

/** Inline HTML → markdown links (for /llms.txt and /llms-full.txt). */
export function markdownText(html: string): string {
  return html
    .replace(/<a href="([^"]+)">([^<]+)<\/a>/g, (_, href: string, text: string) =>
      `[${text}](${href.startsWith('/') ? SITE_URL + href : href})`
    )
    .replace(/<strong>([^<]+)<\/strong>/g, '**$1**')
    .replace(/<[^>]+>/g, '')
    .trim();
}

/** "2026-11-09" → "November 9, 2026" (fixed, not locale-dependent). */
export function formatDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  return `${months[m - 1]} ${d}, ${y}`;
}
