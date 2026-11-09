// Locales and routes. The same 16 locales and URL scheme as
// openbiblestories.org, churchbased.bible and translationcore.com: English at
// the site root, every other locale at /{code}/.

export interface LocaleDef {
  code: string;
  /** Language name in its own language — shown in the switcher. */
  name: string;
  /** BCP-47 tag emitted in <html lang> and hreflang. */
  tag: string;
  dir: 'ltr' | 'rtl';
  /**
   * The writing system, emitted as <html data-script> (main.css keys the
   * font-family overrides on it). Inter (body) covers Latin, Vietnamese and
   * Cyrillic, and Newsreader (headings) falls back to Georgia for Cyrillic,
   * so those locales load nothing extra. Every other value names a
   * stylesheet generated into public/assets/fonts/ by
   * scripts/build-font-css.mjs from @fontsource packages and <link>ed by
   * Base.astro (see fontHrefFor()). Self-hosted, as on the sister sites: no
   * third-party font host, which is slow or blocked in parts of the world
   * these locales serve.
   */
  script: 'latin' | 'cyrillic' | 'arabic' | 'nastaliq' | 'devanagari' | 'bengali' | 'myanmar' | 'han';
}

/** Scripts the site's Google Fonts (Newsreader + Inter) already cover. */
const BASE_SCRIPTS = new Set(['latin', 'cyrillic']);

/** Stylesheet path for the locale's script, or null when the base fonts
 *  suffice. */
export function fontHrefFor(code: string): string | null {
  const { script } = byCode(code);
  return BASE_SCRIPTS.has(script) ? null : `/assets/fonts/${script}.css`;
}

export const locales: LocaleDef[] = [
  { code: 'en', name: 'English',           tag: 'en',      dir: 'ltr', script: 'latin' },
  { code: 'es', name: 'Español',           tag: 'es-MX',   dir: 'ltr', script: 'latin' },
  { code: 'fr', name: 'Français',          tag: 'fr',      dir: 'ltr', script: 'latin' },
  { code: 'hi', name: 'हिन्दी',              tag: 'hi',      dir: 'ltr', script: 'devanagari' },
  { code: 'ru', name: 'Русский',           tag: 'ru',      dir: 'ltr', script: 'cyrillic' },
  { code: 'ar', name: 'العربية',            tag: 'ar',      dir: 'rtl', script: 'arabic' },
  { code: 'zh', name: '简体中文',           tag: 'zh-Hans', dir: 'ltr', script: 'han' },
  { code: 'sw', name: 'Kiswahili',         tag: 'sw',      dir: 'ltr', script: 'latin' },
  { code: 'pt', name: 'Português',         tag: 'pt-BR',   dir: 'ltr', script: 'latin' },
  { code: 'id', name: 'Bahasa Indonesia',  tag: 'id',      dir: 'ltr', script: 'latin' },
  { code: 'vi', name: 'Tiếng Việt',        tag: 'vi',      dir: 'ltr', script: 'latin' },
  { code: 'bn', name: 'বাংলা',              tag: 'bn',      dir: 'ltr', script: 'bengali' },
  { code: 'ur', name: 'اردو',               tag: 'ur',      dir: 'rtl', script: 'nastaliq' },
  { code: 'fa', name: 'فارسی',              tag: 'fa',      dir: 'rtl', script: 'arabic' },
  { code: 'my', name: 'ဗမာစာ',             tag: 'my',      dir: 'ltr', script: 'myanmar' },
  { code: 'nl', name: 'Nederlands',        tag: 'nl',      dir: 'ltr', script: 'latin' },
];

export const defaultLocale = 'en';

/** Pages that exist in every locale. The 404 stays English-only at the root,
 *  as on the sister sites: no /{lang}/ variant, no hreflang, no switcher. */
export const localizedSlugs = ['home', 'organizations'] as const;
export type PageSlug = (typeof localizedSlugs)[number] | '404';

/** URL path fragment for each page, relative to the locale root. */
export const slugPaths: Record<PageSlug, string> = {
  home: '',
  organizations: 'organizations/',
  '404': '404/',
};

export function isLocalized(slug: PageSlug): boolean {
  return (localizedSlugs as readonly string[]).includes(slug);
}

export function byCode(code: string): LocaleDef {
  const found = locales.find((l) => l.code === code);
  if (!found) throw new Error(`Unknown locale: ${code}`);
  return found;
}

/** Path for a page in a locale: English stays at the site root. */
export function localePath(locale: string, slug: PageSlug): string {
  const page = slugPaths[slug];
  return locale === defaultLocale || !isLocalized(slug) ? `/${page}` : `/${locale}/${page}`;
}

/** Rewrite root-relative internal links inside an HTML string so in-copy
 *  links (e.g. href="/organizations/") stay within the current locale. */
export function localizeLinks(html: string, locale: string): string {
  if (locale === defaultLocale) return html;
  const internal = new Set(localizedSlugs.map((s) => `/${slugPaths[s]}`));
  return html.replace(/href="(\/[^"#]*)(#[^"]*)?"/g, (m, path, hash = '') =>
    internal.has(path) ? `href="/${locale}${path}${hash}"` : m
  );
}

/** "2026-11-09" → the date written out in the locale ("November 9, 2026",
 *  "9 de noviembre de 2026", …). Fixed to UTC so the build machine's time
 *  zone cannot shift the day. */
export function formatDate(iso: string, locale: string): string {
  return new Intl.DateTimeFormat(byCode(locale).tag, { dateStyle: 'long', timeZone: 'UTC' }).format(new Date(`${iso}T00:00:00Z`));
}
