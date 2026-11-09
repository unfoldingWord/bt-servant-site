// Locale integrity check (the same checks as translationcore.com and
// openbiblestories.org, adapted):
//  - every locale has every page file, and the JSON parses
//  - structure (keys, array lengths) matches English
//  - embedded markup is untouched: every tag in an English string — with its
//    attributes, so hrefs and inline styles too — appears in the translation
//  - {placeholders} survive (the footer's {date} is filled in at build time)
//  - protected names (products, initiatives, the organization) survive
//  - an untranslated-ratio report per locale
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;
// src/i18n/config.ts (kept in sync by hand, as on the sister sites).
const LOCALES = ['en', 'es', 'fr', 'hi', 'ru', 'ar', 'zh', 'sw', 'pt', 'id', 'vi', 'bn', 'ur', 'fa', 'my', 'nl'];
const PAGES = ['ui', 'home', 'organizations'];
// Keys whose values must be byte-identical to English (none on this site;
// kept for parity with the sister sites' check).
const ASSET_KEYS = new Set([]);
// Names that are never translated: wherever English has one, the locale must
// carry it verbatim. (Order matters only for readability.)
export const PROTECTED = [
  'BT Servant', 'unfoldingWord', 'WhatsApp', 'Telegram', 'Signal', 'GitHub',
  'Translation Words', 'Translation Academy', 'ETEN Innovation Lab', 'Word Collective', 'Spoken Worldwide',
  '@bt_servant_bot', 'app.btservant.ai', '+1 555-819-6461',
];

let errors = 0;
const err = (m) => {
  console.error('ERROR', m);
  errors++;
};

/** Every opening tag (with attributes) and closing tag, sorted. */
const tagsOf = (s) => (String(s).match(/<\/?[a-zA-Z][^>]*>/g) || []).sort().join(' ');
const placeholdersOf = (s) => (String(s).match(/\{\w+\}/g) || []).sort().join(' ');

function compare(locale, page, base, loc, path) {
  if (Array.isArray(base)) {
    if (!Array.isArray(loc) || loc.length !== base.length) {
      err(`${locale}/${page} ${path}: array length ${loc?.length} != ${base.length}`);
      return;
    }
    base.forEach((v, i) => compare(locale, page, v, loc[i], `${path}[${i}]`));
    return;
  }
  if (base && typeof base === 'object') {
    for (const k of Object.keys(base)) {
      if (!loc || !(k in loc)) {
        err(`${locale}/${page} ${path}.${k}: missing key`);
        continue;
      }
      const b = base[k];
      const l = loc[k];
      if (typeof b === 'string') {
        if (typeof l !== 'string') err(`${locale}/${page} ${path}.${k}: not a string`);
        else if (ASSET_KEYS.has(k) && l !== b) err(`${locale}/${page} ${path}.${k}: routing value changed ("${l}" != "${b}")`);
        else {
          if (tagsOf(b) !== tagsOf(l)) err(`${locale}/${page} ${path}.${k}: markup changed\n    en: ${tagsOf(b)}\n    ${locale}: ${tagsOf(l)}`);
          if (placeholdersOf(b) !== placeholdersOf(l)) err(`${locale}/${page} ${path}.${k}: {placeholders} changed`);
          for (const name of PROTECTED) {
            if (b.includes(name) && !l.includes(name)) err(`${locale}/${page} ${path}.${k}: protected name "${name}" translated or missing`);
          }
        }
      } else compare(locale, page, b, l, `${path}.${k}`);
    }
    for (const k of Object.keys(loc ?? {})) if (!(k in base)) err(`${locale}/${page} ${path}.${k}: key not in English`);
  }
}

for (const locale of LOCALES) {
  for (const page of PAGES) {
    const f = join(ROOT, 'src/i18n', locale, `${page}.json`);
    if (!existsSync(f)) {
      err(`${locale}/${page}.json missing`);
      continue;
    }
    let data;
    try {
      data = JSON.parse(readFileSync(f, 'utf8'));
    } catch (e) {
      err(`${locale}/${page}.json invalid JSON: ${e.message}`);
      continue;
    }
    if (locale === 'en') continue;
    const base = JSON.parse(readFileSync(join(ROOT, 'src/i18n/en', `${page}.json`), 'utf8'));
    compare(locale, page, base, data, '');
    if (/unfolding\s[Ww]ord|Unfoldingword|UnfoldingWord/.test(JSON.stringify(data))) err(`${locale}/${page}: unfoldingWord split or miscased`);
    if (locale === 'bn' && /[ऀ-ॣ०-ॿ]/.test(JSON.stringify(data))) err(`bn/${page}: Devanagari characters in Bengali file`);
    // The hero rotator needs a rotating word list of the same length.
    if (page === 'home' && data.hero?.rotatorWords?.some((w) => !w)) err(`${locale}/home hero.rotatorWords: empty word`);
  }
}

console.log('\nUntranslated ratio (identical to English):');
for (const locale of LOCALES.filter((l) => l !== 'en')) {
  let same = 0;
  let total = 0;
  for (const page of PAGES) {
    const f = join(ROOT, 'src/i18n', locale, `${page}.json`);
    if (!existsSync(f)) continue;
    const base = JSON.parse(readFileSync(join(ROOT, 'src/i18n/en', `${page}.json`), 'utf8'));
    const loc = JSON.parse(readFileSync(f, 'utf8'));
    (function walk(b, l, key) {
      if (typeof b === 'string') {
        // Skip routing values and strings that are only names.
        const stripped = PROTECTED.reduce((s, n) => s.split(n).join(''), b.replace(/<[^>]*>|&\w+;|\{\w+\}/g, ''));
        if (ASSET_KEYS.has(key) || !/[a-zA-Z]{3,}/.test(stripped)) return;
        total++;
        if (b === l) same++;
        return;
      }
      if (Array.isArray(b)) b.forEach((v, i) => walk(v, l?.[i], key));
      else if (b && typeof b === 'object') for (const k of Object.keys(b)) walk(b[k], l?.[k], k);
    })(base, loc, '');
  }
  console.log(`  ${locale}: ${total ? ((same / total) * 100).toFixed(1) : '0.0'}% (${same}/${total})`);
}

console.log(errors ? `\n${errors} error(s)` : '\nAll locale checks passed.');
process.exit(errors ? 1 : 0);
