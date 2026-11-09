// Post-build checks (run after `npm run build`): every internal link, asset,
// sitemap URL, /llms.txt URL and redirect target resolves to a built file;
// every page has one <h1>, a correct canonical and valid JSON-LD; the FAQ in
// the JSON-LD matches the visible FAQ. Same idea as check:routes on
// translationcore.com, sized for this site. Exits non-zero on any failure.
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const DIST = new URL('../dist/', import.meta.url).pathname;
const SITE = 'https://btservant.ai';
const errors = [];
const fail = (msg) => errors.push(msg);

if (!existsSync(DIST)) {
  console.error('dist/ not found: run `npm run build` first.');
  process.exit(1);
}

function walk(dir) {
  return readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
}
const files = walk(DIST);

/** Does a root-relative URL path resolve to a built file (the way Cloudflare
 *  Pages serves them: /x/ → x/index.html, /x → x.html or x/index.html)? */
function resolves(path) {
  const clean = decodeURI(path.split('#')[0].split('?')[0]);
  if (clean === '' ) return true; // pure fragment
  const p = join(DIST, clean);
  if (clean.endsWith('/')) return existsSync(join(p, 'index.html'));
  return existsSync(p) || existsSync(`${p}.html`) || existsSync(join(p, 'index.html'));
}

const normalize = (s) => s.replace(/\s+/g, ' ').trim();

/** The text a visitor sees in an HTML fragment: scripts, styles and
 *  templates removed, tags stripped, common entities decoded. */
function visibleText(html) {
  return normalize(
    html
      .replace(/<(script|style|template|noscript)[^>]*>[\s\S]*?<\/\1>/gi, ' ')
      .replace(/<[^>]+>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&rsquo;/g, '’')
      .replace(/&mdash;/g, '—')
      .replace(/&#39;/g, "'")
      .replace(/&quot;/g, '"')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&')
  );
}

function internalPath(url) {
  if (url.startsWith(SITE)) return url.slice(SITE.length) || '/';
  if (url.startsWith('/') && !url.startsWith('//')) return url;
  return null;
}

// --- HTML pages ---------------------------------------------------------
const htmlFiles = files.filter((f) => f.endsWith('.html') && !relative(DIST, f).startsWith('brand-assets'));
for (const file of htmlFiles) {
  const rel = '/' + relative(DIST, file);
  const html = readFileSync(file, 'utf8');
  const urlPath = rel.endsWith('index.html') ? rel.slice(0, -'index.html'.length) : rel;
  const isNotFound = rel === '/404.html';

  const h1s = html.match(/<h1[\s>]/g) || [];
  if (h1s.length !== 1) fail(`${rel}: expected one <h1>, found ${h1s.length}`);

  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
  if (isNotFound) {
    if (canonical) fail(`${rel}: the 404 must not have a canonical`);
    if (!/<meta name="robots" content="noindex"/.test(html)) fail(`${rel}: the 404 must be noindex`);
  } else {
    if (canonical !== SITE + urlPath) fail(`${rel}: canonical is ${canonical}, expected ${SITE + urlPath}`);
    if (!/<meta name="description" content="[^"]{50,}"/.test(html)) fail(`${rel}: missing or short meta description`);
    if (!/<meta property="og:image" content="https:/.test(html)) fail(`${rel}: missing og:image`);
    const ld = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1];
    if (!ld) fail(`${rel}: no JSON-LD`);
    else {
      try {
        const graph = JSON.parse(ld)['@graph'];
        const types = graph.map((n) => n['@type']);
        for (const t of ['Organization', 'WebSite', 'SoftwareApplication', 'WebPage'])
          if (!types.includes(t)) fail(`${rel}: JSON-LD has no ${t}`);
        const page = graph.find((n) => n['@type'] === 'WebPage');
        const shown = html.match(/<time datetime="([^"]+)"/)?.[1];
        if (page && page.dateModified !== shown) fail(`${rel}: WebPage dateModified ${page?.dateModified} != footer date ${shown}`);
        const faq = graph.find((n) => n['@type'] === 'FAQPage');
        if (faq) {
          // Read only the rendered FAQ section, never the JSON-LD itself.
          const section = html.match(/<section class="faq" id="faq">([\s\S]*?)<\/section>/)?.[1];
          if (!section) fail(`${rel}: has FAQPage JSON-LD but no visible <section id="faq">`);
          else {
            const text = visibleText(section);
            for (const q of faq.mainEntity) {
              if (!text.includes(normalize(q.name))) fail(`${rel}: FAQ question not visible on the page: ${q.name}`);
              if (!text.includes(normalize(q.acceptedAnswer.text)))
                fail(`${rel}: FAQ answer not visible on the page (or differs from the JSON-LD): ${q.name}`);
            }
          }
        }
      } catch (e) {
        fail(`${rel}: JSON-LD does not parse (${e.message})`);
      }
    }
  }

  for (const [, attr, url] of html.matchAll(/\s(href|src)="([^"]+)"/g)) {
    const path = internalPath(url);
    if (path === null) continue;
    if (/\.html(#|$)/.test(path)) fail(`${rel}: links to a .html URL (${url}); use the trailing-slash URL`);
    if (!resolves(path)) fail(`${rel}: ${attr}="${url}" does not resolve`);
  }
}

// --- main.js image paths --------------------------------------------------
const mainJs = readFileSync(join(DIST, 'assets/js/main.js'), 'utf8');
for (const [, p] of mainJs.matchAll(/'(\/assets\/[^']+)'/g)) {
  if (!resolves(p)) fail(`assets/js/main.js: ${p} does not resolve`);
}

// --- sitemaps, llms.txt, ai files --------------------------------------
const index = readFileSync(join(DIST, 'sitemap-index.xml'), 'utf8');
for (const [, loc] of index.matchAll(/<loc>([^<]+)<\/loc>/g)) {
  const path = internalPath(loc);
  if (!path || !existsSync(join(DIST, path))) fail(`sitemap-index.xml: ${loc} was not built`);
  else
    for (const [, u] of readFileSync(join(DIST, path), 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)) {
      const up = internalPath(u);
      if (!up || !resolves(up)) fail(`${path}: ${u} does not resolve`);
    }
}
for (const name of ['llms.txt', 'llms-full.txt', 'index.md', 'organizations/index.md']) {
  const text = readFileSync(join(DIST, name), 'utf8');
  for (const [, u] of text.matchAll(/\((https:\/\/btservant\.ai[^)\s]*)\)/g)) {
    if (!resolves(internalPath(u))) fail(`${name}: ${u} does not resolve`);
  }
  if (/<[a-z][^>]*>/i.test(text)) fail(`${name}: contains a raw HTML tag`);
  if (/&[a-z]+;/i.test(text)) fail(`${name}: contains an undecoded HTML entity`);
}
for (const name of ['ai/summary.json', 'ai/faq.json']) {
  try {
    JSON.parse(readFileSync(join(DIST, name), 'utf8'));
  } catch (e) {
    fail(`${name}: invalid JSON (${e.message})`);
  }
}
const robots = readFileSync(join(DIST, 'robots.txt'), 'utf8');
if (!robots.includes(`Sitemap: ${SITE}/sitemap-index.xml`)) fail('robots.txt: no Sitemap line for the index');
if (/^\s*Disallow\s*:\s*\/\s*$/m.test(robots)) fail('robots.txt: has a Disallow: / rule');
if (!existsSync(join(DIST, '.well-known/ai.txt'))) fail('.well-known/ai.txt was not copied to dist/');

// --- redirects: every target is built, none chains ----------------------
const redirects = readFileSync(join(DIST, '_redirects'), 'utf8')
  .split('\n')
  .filter((l) => l.trim() && !l.trim().startsWith('#'))
  .map((l) => l.trim().split(/\s+/));
const sources = new Set(redirects.map(([from]) => from));
for (const [from, to] of redirects) {
  if (!resolves(to)) fail(`_redirects: ${from} → ${to}, which was not built`);
  if (sources.has(to)) fail(`_redirects: ${from} → ${to} chains into another redirect`);
}

if (errors.length) {
  console.error(`check:routes found ${errors.length} problem(s):\n- ${errors.join('\n- ')}`);
  process.exit(1);
}
console.log(`check:routes: OK (${htmlFiles.length} pages, sitemaps, llms files, ai files, ${redirects.length} redirects)`);
