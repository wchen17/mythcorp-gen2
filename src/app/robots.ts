import type { MetadataRoute } from 'next';

// Falls back to the deployed workers.dev origin, not mythcorp.dev: that domain
// does not resolve yet (BACKLOG #20), and pointing `host` and `sitemap` at a
// non-existent hostname is worse than pointing them at an ugly one. Set
// NEXT_PUBLIC_SITE_URL at BUILD time (it is inlined, not read at runtime) when
// the custom domain lands.
const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://mythcorp-gen2.7737w27qh.workers.dev').replace(/\/$/, '');

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

