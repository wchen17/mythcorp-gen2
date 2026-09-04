import type { Metadata } from 'next';

// Keep the workshop reachable by URL but out of search and the primary path.
// This controls first impressions, not access. Nothing here is sensitive.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function OgLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
