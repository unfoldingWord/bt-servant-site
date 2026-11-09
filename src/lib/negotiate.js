// Markdown content negotiation for the Cloudflare Pages Functions in
// functions/. Plain JS (not TS) so the Pages Functions bundler and Astro can
// both read it. Any failure falls through to the static page.
export async function negotiate({ request, next, env }, markdownPath) {
  const wantsMarkdown =
    (request.method === 'GET' || request.method === 'HEAD') &&
    /(^|,)\s*text\/markdown\b/i.test(request.headers.get('Accept') || '');
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
