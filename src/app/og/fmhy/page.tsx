'use client';

import { useState } from 'react';
import { SiteHeader } from '../../components/SiteHeader';
import { DraftBanner } from '../../components/DraftBanner';

interface ContentItem {
  id: number;
  title: string;
  category: string;
  url: string;
  description: string;
  dateAdded: string;
}

const CONTENT_ITEMS: ReadonlyArray<ContentItem> = [
  {
    id: 1,
    title: 'Research Archive 2024',
    category: 'Research',
    url: '#',
    description: 'Comprehensive research documentation and findings',
    dateAdded: '2024-11-01',
  },
  {
    id: 2,
    title: 'Project Documentation',
    category: 'Documentation',
    url: '#',
    description: 'Technical documentation for internal projects',
    dateAdded: '2024-10-28',
  },
  {
    id: 3,
    title: 'Data Visualization Tools',
    category: 'Tools',
    url: '#',
    description: 'Collection of data visualization resources',
    dateAdded: '2024-10-25',
  },
  {
    id: 4,
    title: 'AI Training Datasets',
    category: 'Research',
    url: '#',
    description: 'Curated datasets for machine learning projects',
    dateAdded: '2024-10-20',
  },
  {
    id: 5,
    title: 'Code Libraries Archive',
    category: 'Development',
    url: '#',
    description: 'Essential code libraries and frameworks',
    dateAdded: '2024-10-15',
  },
];

const CATEGORIES = ['All', 'Research', 'Documentation', 'Tools', 'Development'] as const;

export default function FmhySketch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<typeof CATEGORIES[number]>('All');

  const filteredItems = CONTENT_ITEMS.filter((item) => {
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      item.title.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q);
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[color:var(--bg)] text-[color:var(--fg)]">
      <SiteHeader />

      <main className="mx-auto max-w-4xl px-4 pt-24 pb-12 sm:px-6">
        <DraftBanner note="The eventual goal: an FMHY-style backup hub. Right now it's a UI shell with placeholder data — wire a real source to make it useful." />

        <h1 className="font-serif text-3xl font-semibold tracking-tight sm:text-4xl">
          Backup content archive
        </h1>
        <p className="mt-2 text-sm text-[color:var(--fg-muted)]">
          Search and filter by category. Links go nowhere yet.
        </p>

        <div className="mt-8 space-y-3">
          <input
            type="text"
            placeholder="search…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-[color:var(--border)]
                       bg-[color:var(--bg-elevated)] px-4 py-3
                       text-[color:var(--fg)] placeholder:text-[color:var(--fg-subtle)]
                       focus:border-[color:var(--accent)] focus:outline-none"
          />
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((category) => {
              const active = category === selectedCategory;
              return (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={[
                    'rounded-full px-4 py-1.5 text-xs font-medium uppercase tracking-widest transition-all',
                    active
                      ? 'bg-[color:var(--accent)] text-[color:var(--bg)]'
                      : 'border border-[color:var(--border)] bg-[color:var(--bg-overlay)] text-[color:var(--fg-muted)] hover:border-[color:var(--border-strong)]',
                  ].join(' ')}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>

        <ul className="mt-8 space-y-3">
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <li
                key={item.id}
                className="rounded-lg border border-[color:var(--border)]
                           bg-[color:var(--bg-elevated)] p-4 transition-all
                           hover:border-[color:var(--border-strong)]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-serif text-lg font-semibold">{item.title}</h3>
                    <span className="mt-1 inline-block rounded-full
                                     border border-[color:var(--accent)]/40
                                     bg-[color:var(--accent)]/10 px-2 py-0.5
                                     font-mono text-[10px] uppercase tracking-widest text-[color:var(--accent)]">
                      {item.category}
                    </span>
                  </div>
                  <span className="font-mono text-xs text-[color:var(--fg-subtle)]">
                    {item.dateAdded}
                  </span>
                </div>
                <p className="mt-2 text-sm text-[color:var(--fg-muted)]">{item.description}</p>
                <a
                  href={item.url}
                  className="mt-3 inline-block rounded
                             border border-[color:var(--border)]
                             bg-[color:var(--bg-overlay)] px-3 py-1.5
                             font-mono text-xs uppercase tracking-widest
                             text-[color:var(--fg-muted)] transition-all
                             hover:border-[color:var(--border-strong)]
                             hover:text-[color:var(--accent)]"
                >
                  open →
                </a>
              </li>
            ))
          ) : (
            <li className="rounded-lg border border-dashed border-[color:var(--border)]
                           p-8 text-center text-[color:var(--fg-subtle)]">
              No content found.
            </li>
          )}
        </ul>
      </main>
    </div>
  );
}
