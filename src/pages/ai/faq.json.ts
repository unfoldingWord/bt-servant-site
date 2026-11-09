import type { APIRoute } from 'astro';
import { SITE_URL, FAQ, PAGE_UPDATED, plainText } from '../../data/site';

// The home page FAQ as JSON: the same questions and answers as the visible
// "Frequently asked questions" section and its FAQPage JSON-LD.
export const GET: APIRoute = () =>
  new Response(
    JSON.stringify(
      {
        url: `${SITE_URL}/#faq`,
        dateModified: PAGE_UPDATED.home,
        faqs: FAQ.map(({ q, a }) => ({ question: plainText(q), answer: plainText(a) })),
      },
      null,
      2
    ),
    { headers: { 'Content-Type': 'application/json; charset=utf-8' } }
  );
