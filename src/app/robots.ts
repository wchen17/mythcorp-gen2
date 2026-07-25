import type { MetadataRoute } from 'next';

// mythcorp.ORG, not .dev and not the workers.dev origin. See the note in
// sitemap.ts: this is the live custom domain, and `host` here is what tells
// crawlers which of the several hostnames serving this worker is canonical.
const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://mythcorp.org').replace(/\/$/, '');

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // `/a` is deliberately NOT here. Uploaded assets are kept out of search
      // by a noindex meta tag instead, because Discordbot and Twitterbot obey
      // robots.txt but ignore noindex: disallowing /a would kill rich embeds,
      // which is the entire point of that route.
      disallow: ['/og', '/d', '/upload'],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}

