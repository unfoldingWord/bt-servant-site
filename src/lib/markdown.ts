// /llms.txt and /llms-full.txt, built from the same facts and copy as the
// HTML (src/data/site.ts), so the markdown cannot drift from the pages.
import {
  SITE_URL,
  PRODUCT_NAME,
  DEFINITION,
  PUBLISHER_NAME,
  PUBLISHER_URL,
  CONTACT_URL,
  WEB_APP_HOME_URL,
  GITHUB_URL,
  RELEASES_URL,
  DISCORD_URL,
  DEMO_VIDEO_URL,
  CHANNELS,
  INTENTS,
  WHY,
  LANGUAGES_LINE,
  PARTNERS,
  ORG_PATHS,
  FAQ,
  PAGES,
  PAGE_UPDATED,
  markdownText,
} from '../data/site';

export function textResponse(body: string): Response {
  return new Response(body, { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } });
}

const url = (path: string) => `${SITE_URL}${path}`;

function channelsList(): string {
  return CHANNELS.map((c) => `- [${c.name}](${c.url})${c.note ? ` (${c.note})` : ''}`).join('\n');
}

function faqMarkdown(level: string): string {
  return FAQ.map(({ q, a }) => `${level} ${q}\n\n${markdownText(a)}`).join('\n\n');
}

export function llmsTxt(): string {
  const pages = PAGES.map((p) => `- [${p.title}](${url(p.path)}): ${p.description}`).join('\n');
  return `# ${PRODUCT_NAME}

> ${DEFINITION}

${PRODUCT_NAME} is a project of [${PUBLISHER_NAME}](${PUBLISHER_URL}). It equips disciples to understand, study, teach, translate, and share God’s Word, and to equip others. People ask in text or voice, inside the apps they already use, and get answers grounded in vetted biblical resources.

## Pages

${pages}

## Where to use it

${channelsList()}

Languages: ${LANGUAGES_LINE}

## What you can do

${INTENTS.map((i) => `- **${i.name}**: ${i.text}`).join('\n')}

## Why BT Servant

${WHY.map((w) => `- **${w.name}**: ${w.text}`).join('\n')}

## For organizations

${ORG_PATHS.map((o) => `- **${o.name}**: ${o.summary} ${o.detail}`).join('\n')}

More: [BT Servant for Organizations](${url('/organizations/')})

## Frequently asked questions

${faqMarkdown('###')}

## Project

- Publisher: [${PUBLISHER_NAME}](${PUBLISHER_URL})
- Partners: ${PARTNERS.map((p) => `[${p.name}](${p.url})`).join(', ')}
- Open-source engine: [${GITHUB_URL.replace('https://', '')}](${GITHUB_URL}) ([release notes](${RELEASES_URL}))
- Community: [Discord](${DISCORD_URL})
- Demo video: [YouTube](${DEMO_VIDEO_URL})
- Contact: [${CONTACT_URL}](${CONTACT_URL})

## Optional

- [Full text of every page](${url('/llms-full.txt')})
- [Home page as markdown](${url('/index.md')})
- [Organizations page as markdown](${url('/organizations/index.md')})
- [Machine-readable summary](${url('/ai/summary.json')})
- [FAQ as JSON](${url('/ai/faq.json')})
- [Sitemap](${url('/sitemap-index.xml')})
`;
}

/** The home page as markdown (served at /index.md and to agents that ask for
 *  text/markdown at /). */
export function homeMarkdown(): string {
  return `# ${PRODUCT_NAME} equips disciples to understand God\u2019s Word

> ${DEFINITION}

URL: ${url('/')} \u2014 last updated ${PAGE_UPDATED.home} \u2014 publisher: ${PUBLISHER_NAME}

Ask in text or voice. Get trusted, context-aware guidance \u2014 inside the apps you already use.

## Available wherever you serve

Free, in the apps you already know.

${channelsList()}

How to start, on any of them:

1. Open BT Servant on WhatsApp, Telegram (search ${CHANNELS[1].note}), Signal, or the web app at app.btservant.ai \u2014 or scan its QR code on the home page.
2. Send any question.
3. Reply in text or voice.

${LANGUAGES_LINE}

## What would you like to do today?

Pick a starting point. The rest is a conversation.

${INTENTS.map((i) => `- **${i.name}**: ${i.text}`).join('\n')}

## Guidance you can trust

${WHY.map((w) => `- **${w.name}**: ${w.text}`).join('\n')}

## Built with ministries. Shaped by real use.

${PARTNERS.map((p) => `- [${p.name}](${p.url})`).join('\n')}

## Frequently asked questions

${faqMarkdown('###')}

## What would you like to do next?

- Individuals: start on WhatsApp, Telegram, Signal, or the web app.
- Organizations: [use it with your team, customize it, or integrate it](${url('/organizations/')}).

Ask naturally. Receive trusted guidance. Take action with confidence.
`;
}

/** The organizations page as markdown (/organizations/index.md). */
export function organizationsMarkdown(): string {
  return `# ${PRODUCT_NAME} for organizations

> Bring trusted, context-aware Scripture guidance to your team \u2014 start free, customize as you grow, or integrate it into your own tools.

URL: ${url('/organizations/')} \u2014 last updated ${PAGE_UPDATED.organizations} \u2014 publisher: ${PUBLISHER_NAME}

Use It \u2192 Customize It \u2192 Integrate It

${ORG_PATHS.map((o) => `## ${o.name}\n\n${o.summary}\n\n${o.detail}`).join('\n\n')}

## Ready to bring BT Servant to your team?

- Use it with your team: ${WEB_APP_HOME_URL}
- Customize or integrate: contact unfoldingWord at ${CONTACT_URL}
- The engine on GitHub: ${GITHUB_URL}
`;
}

/** Every page in one file (/llms-full.txt). */
export function llmsFullTxt(): string {
  return `${homeMarkdown()}\n---\n\n${organizationsMarkdown()}`;
}
