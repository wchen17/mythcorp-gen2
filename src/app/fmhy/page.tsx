'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { SiteHeader } from '../components/SiteHeader';
import {
  FETCHED_AT,
  OTHER_DOCS,
  POSTS,
  ROOT_CATEGORIES,
} from './_data/categories';
import { CategoryNav } from './_components/CategoryNav';
import { SearchBox } from './_components/SearchBox';
import type { IndexCategory, Namespace } from './_lib/types';

const ROOT_CATALOGS = ROOT_CATEGORIES.filter((c) => c.kind === 'catalog' && c.entryCount > 0);
const ROOT_GUIDES = ROOT_CATEGORIES.filter((c) => c.kind === 'prose');

const FETCHED_DATE = new Date(FETCHED_AT).toLocaleDateString('en-US', {
  year: 'numeric', month: 'short', day: 'numeric',
});

function hrefFor(c: IndexCategory): string {
  if (c.namespace === 'root') return `/fmhy/${c.slug}`;
  return `/fmhy/${c.namespace}/${c.slug}`;
}

export default function FmhyPage() {
  const [query, setQuery] = useState('');
  const [activeSlug, setActiveSlug] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return ROOT_CATALOGS.filter((c) => {
      if (activeSlug && c.slug !== activeSlug) return false;
      if (!q) return true;
      if (c.name.toLowerCase().includes(q)) return true;
      if (c.blurb.toLowerCase().includes(q)) return true;
      return c.highlights.some(
        (h) => h.name.toLowerCase().includes(q) || h.blurb.toLowerCase().includes(q),
      );
    });
  }, [query, activeSlug]);

  const totalEntries = ROOT_CATALOGS.reduce((n, c) => n + c.entryCount, 0);
  const totalDocs = ROOT_CATALOGS.length + OTHER_DOCS.length + POSTS.length;

  return (
    <div className="min-h-screen bg-[color:var(--bg)] text-[color:var(--fg)]">
      <SiteHeader tagline="FMHY MIRROR" />

      <main className="mx-auto max-w-5xl px-4 pt-24 pb-16 sm:px-6">
        <div className="text-center">
          <p className="font-mono text-xs uppercase tracking-[0.4em] text-[color:var(--accent)]">
            [ /FMHY ]
          </p>
          <h1 className="themed-heading mt-3 text-4xl font-semibold sm:text-5xl">
            FMHY mirror
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-[color:var(--fg-muted)] sm:text-base">
            A full mirror of <a href="https://fmhy.net" target="_blank" rel="noreferrer"
              className="text-[color:var(--accent)] underline underline-offset-4 hover:text-[color:var(--accent-soft)]">fmhy.net</a>.
            {' '}{totalEntries.toLocaleString()} link entries across {ROOT_CATALOGS.length} categories,
            plus {OTHER_DOCS.length} guides and {POSTS.length} posts, auto-discovered from{' '}
            <a href="https://github.com/fmhy/edit" target="_blank" rel="noreferrer"
              className="text-[color:var(--accent)] underline underline-offset-4 hover:text-[color:var(--accent-soft)]">
              github.com/fmhy/edit
            </a>. Snapshot {FETCHED_DATE}, {totalDocs} docs total.
          </p>
        </div>

        <div className="mt-10 space-y-4">
          <SearchBox
            value={query}
            onChange={setQuery}
            placeholder="Search across all categories..."
            resultsLabel={`${filtered.length} / ${ROOT_CATALOGS.length}`}
          />
          <CategoryNav categories={ROOT_CATALOGS} activeSlug={activeSlug} onSelect={setActiveSlug} />
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
                href={hrefFor(c)}
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

        <DocGroup
          title="Guides"
          subtitle="Long-form root docs (intro, sandbox, unsafe sites, ...)"
          namespace="root"
          docs={ROOT_GUIDES}
        />

        <DocGroup
          title="Other docs"
          subtitle="Guides and reference material from docs/other/"
          namespace="other"
          docs={OTHER_DOCS}
        />

        <DocGroup
          title="Posts"
          subtitle="Monthly changelogs and announcements from docs/posts/"
          namespace="posts"
          docs={POSTS}
        />

        <p className="mt-12 text-center text-xs text-[color:var(--fg-subtle)]">
          FMHY is community-maintained. This mirror auto-discovers the upstream tree on every refresh,
          run via <code className="font-mono text-[color:var(--accent-soft)]">npm run fetch:fmhy</code>.
        </p>
      </main>
    </div>
  );
}

function DocGroup({
  title,
  subtitle,
  namespace,
  docs,
}: {
  title: string;
  subtitle: string;
  namespace: Namespace;
  docs: ReadonlyArray<IndexCategory>;
}) {
  if (docs.length === 0) return null;
  return (
    <section className="mt-16">
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="themed-heading text-2xl font-semibold">{title}</h2>
        <span className="font-mono text-[10px] uppercase tracking-widest text-[color:var(--fg-subtle)]">
          {docs.length} docs
        </span>
      </div>
      <p className="mt-1 text-sm text-[color:var(--fg-muted)]">{subtitle}</p>
      <ul className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {docs.map((d) => (
          <li key={d.slug}>
            <Link
              href={namespace === 'root' ? `/fmhy/${d.slug}` : `/fmhy/${namespace}/${d.slug}`}
              className="themed-surface themed-surface-interactive flex items-center gap-3 p-3"
            >
              <span aria-hidden className="text-lg">{d.emoji}</span>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium text-[color:var(--fg)]">{d.name}</div>
                {d.blurb && (
                  <div className="truncate text-[11px] text-[color:var(--fg-subtle)]">{d.blurb}</div>
                )}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
