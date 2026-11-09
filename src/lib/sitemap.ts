// Sitemaps (same shape as openbiblestories.org and translationcore.com): an
// index pointing at one file for the pages, each with its lastmod (the same
// PAGE_UPDATED date as the page's footer and dateModified).
import { SITE_URL, PAGES, PAGE_UPDATED } from '../data/site';

export function xmlResponse(body: string): Response {
  return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n${body}`, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
}

export const SITEMAP_FILES = ['sitemap-pages.xml'];

export function sitemapIndex(): string {
  const items = SITEMAP_FILES.map((f) => `  <sitemap><loc>${SITE_URL}/${f}</loc></sitemap>`).join('\n');
  return `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${items}\n</sitemapindex>\n`;
}

export function pagesSitemap(): string {
  const urls = PAGES.map(
    (p) => `  <url>\n    <loc>${SITE_URL}${p.path}</loc>\n    <lastmod>${PAGE_UPDATED[p.key]}</lastmod>\n  </url>`
  );
  return `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`;
}
