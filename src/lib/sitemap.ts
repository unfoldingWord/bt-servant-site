// Sitemaps (same shape as openbiblestories.org and translationcore.com): an
// index pointing at one file for the pages. Every locale of every page is
// listed, each with the full reciprocal hreflang set + x-default and its
// lastmod (the same PAGE_UPDATED date as the page's footer and dateModified).
import { SITE_URL, PAGE_UPDATED } from '../data/site';
import { locales, defaultLocale, localePath, localizedSlugs } from '../i18n/config';

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
  const urls: string[] = [];
  for (const slug of localizedSlugs) {
    const alternates = [
      ...locales.map((l) => `    <xhtml:link rel="alternate" hreflang="${l.tag}" href="${SITE_URL}${localePath(l.code, slug)}"/>`),
      `    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE_URL}${localePath(defaultLocale, slug)}"/>`,
    ].join('\n');
    for (const l of locales) {
      urls.push(
        `  <url>\n    <loc>${SITE_URL}${localePath(l.code, slug)}</loc>\n    <lastmod>${PAGE_UPDATED[slug]}</lastmod>\n${alternates}\n  </url>`
      );
    }
  }
  return `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls.join('\n')}\n</urlset>\n`;
}
