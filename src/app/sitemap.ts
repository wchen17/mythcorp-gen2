import type { MetadataRoute } from 'next';

// Override with NEXT_PUBLIC_SITE_URL once the custom domain (BACKLOG #20) is final.
const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://mythcorp.dev').replace(/\/$/, '');

type Entry = {
  path: string;
  priority: number;
  changeFrequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
};

// Hand-maintained because the route set is small and mostly static. When you add
// a page (see CLAUDE.md "Adding a page"), add it here too.
const ROUTES: Entry[] = [
  { path: '/', priority: 1.0, changeFrequency: 'monthly' },
  { path: '/experience', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/fmhy', priority: 0.7, changeFrequency: 'weekly' },
  { path: '/wc', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/wc/about', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/wc/papers', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/wc/papers/ai-cybercrime', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/wc/learn', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/wc/learn/theme-system', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/about', priority: 0.5, changeFrequency: 'yearly' },
  { path: '/contact', priority: 0.3, changeFrequency: 'yearly' },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return ROUTES.map((r) => ({
    url: `${SITE_URL}${r.path}`,
    lastModified,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));
}

