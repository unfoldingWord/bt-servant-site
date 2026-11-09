import type { APIRoute } from 'astro';
import {
  SITE_URL, PRODUCT_NAME, DEFINITION, PUBLISHER_NAME, PUBLISHER_URL, CONTACT_URL,
  GITHUB_URL, CHANNELS, INTENTS, PARTNERS, PAGE_UPDATED,
} from '../../data/site';

// A machine-readable summary for answer engines that look for
// /ai/summary.json (as on openbiblestories.org and translationcore.com). Not a
// standard Google uses — the JSON-LD on every page is the real entity markup —
// so this only restates the same public facts from src/data/site.ts.
export const GET: APIRoute = () =>
  new Response(
    JSON.stringify(
      {
        name: PRODUCT_NAME,
        description: DEFINITION,
        url: `${SITE_URL}/`,
        publisher: { name: PUBLISHER_NAME, url: PUBLISHER_URL, contact: CONTACT_URL },
        isAccessibleForFree: true,
        channels: CHANNELS.map((c) => ({ name: c.name, url: c.url })),
        capabilities: INTENTS.map((i) => ({ name: i.name, description: i.text })),
        languages: ['English', 'Indonesian', 'Spanish', 'and many more'],
        input: ['text', 'voice'],
        partners: PARTNERS.map((p) => ({ name: p.name, url: p.url })),
        sourceCode: GITHUB_URL,
        dateModified: PAGE_UPDATED.home,
        links: {
          organizations: `${SITE_URL}/organizations/`,
          faq: `${SITE_URL}/ai/faq.json`,
          llms: `${SITE_URL}/llms.txt`,
          llmsFull: `${SITE_URL}/llms-full.txt`,
          sitemap: `${SITE_URL}/sitemap-index.xml`,
        },
      },
      null,
      2
    ),
    { headers: { 'Content-Type': 'application/json; charset=utf-8' } }
  );
