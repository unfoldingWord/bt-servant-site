// Markdown content negotiation for the Cloudflare Pages Functions in
// functions/. Plain JS (not TS) so the Pages Functions bundler and Astro can
// both read it. Any failure falls through to the static page.

/** Parse an Accept header into [{ type, subtype, q }] (RFC 9110 §12.5.1).
 *  Parameters other than q are ignored; a malformed q counts as 0. */
export function parseAccept(header) {
  return (header || '')
    .split(',')
    .map((part) => {
      const [range, ...params] = part.split(';').map((s) => s.trim());
      const [type, subtype] = range.toLowerCase().split('/');
      if (!type || !subtype) return null;
      let q = 1;
      for (const p of params) {
        const [k, v] = p.split('=').map((s) => s.trim());
        if (k.toLowerCase() === 'q') {
          q = /^(0(\.\d{0,3})?|1(\.0{0,3})?)$/.test(v || '') ? Number(v) : 0;
        }
      }
      return { type, subtype, q };
    })
    .filter(Boolean);
}

/** The q a client gives a media type: from the most specific matching range
 *  (exact type/subtype, then type/*, then *\/*), or 0 if nothing matches. */
function qualityFor(ranges, type, subtype) {
  const match = (r) => r.type === type && r.subtype === subtype;
  const wild = (r) => r.type === type && r.subtype === '*';
  const any = (r) => r.type === '*' && r.subtype === '*';
  for (const test of [match, wild, any]) {
    const hit = ranges.find(test);
    if (hit) return hit.q;
  }
  return 0;
}

/** True only when the client names text/markdown exactly, accepts it
 *  (q > 0), and does not prefer text/html over it. Ties go to markdown,
 *  since naming it explicitly is the signal. */
export function prefersMarkdown(acceptHeader) {
  const ranges = parseAccept(acceptHeader);
  const named = ranges.find((r) => r.type === 'text' && r.subtype === 'markdown');
  if (!named || named.q <= 0) return false;
  return named.q >= qualityFor(ranges, 'text', 'html');
}

export async function negotiate({ request, next, env }, markdownPath) {
  const wantsMarkdown =
    (request.method === 'GET' || request.method === 'HEAD') && prefersMarkdown(request.headers.get('Accept'));
  if (wantsMarkdown) {
    try {
      const md = await env.ASSETS.fetch(new URL(markdownPath, request.url));
      if (md.ok) {
        return new Response(request.method === 'HEAD' ? null : md.body, {
          headers: {
            'Content-Type': 'text/markdown; charset=utf-8',
            'Cache-Control': 'public, max-age=300, s-maxage=86400',
            'Vary': 'Accept',
            'X-Content-Type-Options': 'nosniff',
          },
        });
      }
    } catch {
      // fall through to the HTML
    }
  }
  const res = await next();
  const out = new Response(res.body, res);
  out.headers.append('Vary', 'Accept');
  return out;
}
