'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { SiteHeader } from '../components/SiteHeader';
import { CATEGORIES } from './_data/categories';
import indexData from './_data/index.json';
import { CategoryNav } from './_components/CategoryNav';
import { SearchBox } from './_components/SearchBox';

type IndexEntry = {
  slug: string;
  sourceFile: string;
  sectionCount: number;
  entryCount: number;
  highlights: { name: string; url: string; blurb: string }[];
};

const INDEX = indexData as { fetchedAt: string; categories: IndexEntry[] };

const FETCHED_AT = new Date(INDEX.fetchedAt).toLocaleDateString('en-US', {
  year: 'numeric', month: 'short', day: 'numeric',
});

const ENRICHED = CATEGORIES
  .map((meta) => {
    const idx = INDEX.categories.find((c) => c.slug === meta.slug);
    if (!idx || idx.entryCount === 0) return null;
    return { ...meta, ...idx };
  })
  .filter((c): c is NonNullable<typeof c> => c !== null);

export default function FmhyPage() {
  const [query, setQuery] = useState('');
  const [activeSlug, setActiveSlug] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return ENRICHED.filter((c) => {
      if (activeSlug && c.slug !== activeSlug) return false;
      if (!q) return true;
      if (c.name.toLowerCase().includes(q)) return true;
      if (c.blurb.toLowerCase().includes(q)) return true;
      return c.highlights.some(
        (h) => h.name.toLowerCase().includes(q) || h.blurb.toLowerCase().includes(q),
      );
    });
  }, [query, activeSlug]);

  const totalEntries = ENRICHED.reduce((n, c) => n + c.entryCount, 0);

  return (
    <div className="min-h-screen bg-[color:var(--bg)] text-[color:var(--fg)]">
      <SiteHeader tagline="FMHY MIRROR" />

      <main className="mx-auto max-w-5xl px-4 pt-24 pb-16 sm:px-6">
        <div className="text-center">
          <p className="font-mono text-xs uppercase tracking-[0.4em] text-[color:var(--accent)]">
            [ /FMHY ]
          </p>
          <h1 className="themed-heading mt-3 text-4xl font-semibold sm:text-5xl">
            FMHY backup
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-[color:var(--fg-muted)] sm:text-base">
            A local mirror of <a href="https://fmhy.net" target="_blank" rel="noreferrer"
              className="text-[color:var(--accent)] underline underline-offset-4 hover:text-[color:var(--accent-soft)]">fmhy.net</a>.
            {' '}{totalEntries.toLocaleString()} entries across {ENRICHED.length} categories,
            fetched fresh from{' '}
            <a href="https://github.com/fmhy/edit" target="_blank" rel="noreferrer"
              className="text-[color:var(--accent)] underline underline-offset-4 hover:text-[color:var(--accent-soft)]">
              github.com/fmhy/edit
            </a>. Snapshot {FETCHED_AT}.
          </p>
        </div>

        <div className="mt-10 space-y-4">
          <SearchBox
            value={query}
            onChange={setQuery}
            placeholder="Search across all categories..."
            resultsLabel={`${filtered.length} / ${ENRICHED.length}`}
          />
          <CategoryNav categories={ENRICHED} activeSlug={activeSlug} onSelect={setActiveSlug} />
        </div>

        <ul className="mt-10 grid gap-4 sm:grid-cols-2">
          {filtered.length === 0 && (
            <li className="col-span-full rounded-[var(--radius)] border border-dashed border-[color:var(--border)]
                           bg-[color:var(--bg-elevated)] p-8 text-center text-sm text-[color:var(--fg-muted)]">
              No matches. Try a shorter query or clear the category filter.
            </li>
          )}
          {filtered.map((c) => (
            <li key={c.slug}>
              <Link
                href={`/fmhy/${c.slug}`}
                className="themed-surface themed-surface-interactive block h-full p-5"
              >
                <div className="flex items-start gap-3">
                  <span aria-hidden className="text-2xl">{c.emoji}</span>
                  <div className="flex-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <h2 className="font-serif text-lg font-semibold text-[color:var(--fg)]">
                        {c.name}
                      </h2>
                      <span className="font-mono text-[10px] uppercase tracking-widest text-[color:var(--fg-subtle)]">
                        {c.entryCount} entries
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-[color:var(--fg-muted)]">{c.blurb}</p>
                  </div>
                </div>

                {c.highlights.length > 0 && (
                  <ul className="mt-4 space-y-1.5 border-t border-[color:var(--border)] pt-3">
                    {c.highlights.map((h, i) => (
                      <li key={i} className="text-xs text-[color:var(--fg-muted)]">
                        <span className="font-medium text-[color:var(--fg)]">{h.name}</span>
                        {h.blurb && <span className="text-[color:var(--fg-subtle)]">, {h.blurb}</span>}
                      </li>
                    ))}
                  </ul>
                )}

                <p className="mt-3 text-right font-mono text-[10px] uppercase tracking-widest text-[color:var(--accent-soft)]">
                  see all {c.entryCount} →
                </p>
              </Link>
            </li>
          ))}
        </ul>

        <p className="mt-12 text-center text-xs text-[color:var(--fg-subtle)]">
          FMHY is community-maintained. This page mirrors a snapshot, refreshed by
          {' '}<code className="font-mono text-[color:var(--accent-soft)]">npm run fetch:fmhy</code>.
        </p>
      </main>
    </div>
  );
}
