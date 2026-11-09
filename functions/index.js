// Cloudflare Pages Function for "/" only: content negotiation for AI agents.
// A request that asks for `Accept: text/markdown` gets the page as markdown
// (/index.md, built from the same copy as the HTML); every other request gets
// the static HTML exactly as before. See README → SEO and GEO.
import { negotiate } from '../src/lib/negotiate.js';

export const onRequest = (context) => negotiate(context, '/index.md');
