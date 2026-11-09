// JSON-LD builders. One graph per page: Base.astro emits a single
// <script type="application/ld+json"> with Organization + WebSite + the
// SoftwareApplication (BT Servant itself) + the page's WebPage node, plus
// whatever page-specific nodes a page passes in (the home page's FAQPage).
//
// Every fact here is one the site states in its copy (src/data/site.ts).
import {
  SITE_URL,
  PRODUCT_NAME,
  DEFINITION,
  PUBLISHER_NAME,
  PUBLISHER_URL,
  CONTACT_URL,
  WEB_APP_URL,
  WHATSAPP_URL,
  TELEGRAM_URL,
  SIGNAL_URL,
  GITHUB_URL,
  INTENTS,
  plainText,
} from '../data/site';

export const PUBLISHER_ID = 'https://unfoldingword.org/#organization';
export const WEBSITE_ID = `${SITE_URL}/#website`;
export const APP_ID = `${SITE_URL}/#software`;

// Only profiles whose identity is confirmed: a wrong sameAs merges two
// entities in a knowledge graph. These are the profiles unfoldingword.org and
// openbiblestories.org declare for unfoldingWord. (No Wikipedia, Wikidata,
// LinkedIn or Crunchbase entry could be confirmed as of 2026-11; add one
// here only once it is verified to be unfoldingWord's own.)
const ORGANIZATION_SAME_AS = [
  'https://door43.org/',
  'https://www.facebook.com/unfoldingWord',
  'https://x.com/unfoldingword',
  'https://github.com/unfoldingWord',
];

export function organizationNode() {
  return {
    '@type': 'Organization',
    '@id': PUBLISHER_ID,
    name: PUBLISHER_NAME,
    url: PUBLISHER_URL,
    logo: { '@type': 'ImageObject', url: `${SITE_URL}/assets/images/partners/unfoldingword.png` },
    sameAs: ORGANIZATION_SAME_AS,
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'general inquiries',
      url: CONTACT_URL,
      availableLanguage: 'en',
    },
  };
}

export function websiteNode() {
  return {
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    url: `${SITE_URL}/`,
    name: PRODUCT_NAME,
    description: DEFINITION,
    inLanguage: 'en',
    publisher: { '@id': PUBLISHER_ID },
    author: { '@id': PUBLISHER_ID },
    about: { '@id': APP_ID },
  };
}

/** BT Servant itself: a free conversational app reached through messaging
 *  apps and the web app. */
export function appNode() {
  return {
    '@type': 'SoftwareApplication',
    '@id': APP_ID,
    name: PRODUCT_NAME,
    description: DEFINITION,
    url: `${SITE_URL}/`,
    applicationCategory: 'ReferenceApplication',
    operatingSystem: 'Web browser, WhatsApp, Telegram, Signal',
    installUrl: [WHATSAPP_URL, TELEGRAM_URL, SIGNAL_URL, WEB_APP_URL],
    isAccessibleForFree: true,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    featureList: INTENTS.map((i) => `${i.name}: ${i.text}`),
    inLanguage: ['en', 'id', 'es'],
    image: `${SITE_URL}/assets/images/logo-full.png`,
    screenshot: `${SITE_URL}/assets/images/wa/understand.png`,
    publisher: { '@id': PUBLISHER_ID },
    author: { '@id': PUBLISHER_ID },
    sameAs: [GITHUB_URL],
  };
}

/** The page itself: its own title and meta description (the same strings as
 *  <title> and <meta name="description">), who wrote it, and when it last
 *  changed (PAGE_UPDATED: the date the footer shows). */
export function webPageNode(url: string, name: string, description: string, dateModified: string, inLanguage = 'en') {
  return {
    '@type': 'WebPage',
    '@id': `${url}#webpage`,
    url,
    name,
    description,
    inLanguage,
    isPartOf: { '@id': WEBSITE_ID },
    about: { '@id': APP_ID },
    author: { '@id': PUBLISHER_ID },
    publisher: { '@id': PUBLISHER_ID },
    dateModified,
  };
}

/** FAQPage built from the same strings the page shows. */
export function faqNode(url: string, items: { q: string; a: string }[], inLanguage = 'en') {
  return {
    '@type': 'FAQPage',
    '@id': `${url}#faq`,
    url,
    inLanguage,
    isPartOf: { '@id': WEBSITE_ID },
    mainEntity: items.map(({ q, a }) => ({
      '@type': 'Question',
      name: plainText(q),
      acceptedAnswer: { '@type': 'Answer', text: plainText(a) },
    })),
  };
}

export function serializeGraph(nodes: unknown[]): string {
  // Escape "<" so a string can never close the <script> element.
  return JSON.stringify({ '@context': 'https://schema.org', '@graph': nodes }).replace(/</g, '\\u003c');
}
