'use client';

import type { CategoryMeta } from '../_data/categories';

interface CategoryNavProps {
  categories: ReadonlyArray<CategoryMeta & { entryCount: number }>;
  activeSlug: string | null;
  onSelect: (slug: string | null) => void;
}

export function CategoryNav({ categories, activeSlug, onSelect }: CategoryNavProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={() => onSelect(null)}
        className={chip(activeSlug === null)}
      >
        ALL
      </button>
      {categories.map((c) => (
        <button
          key={c.slug}
          type="button"
          onClick={() => onSelect(c.slug)}
          className={chip(activeSlug === c.slug)}
          title={c.blurb}
        >
          <span className="mr-1.5">{c.emoji}</span>
          {c.name}
          <span className="ml-2 font-mono text-[10px] opacity-60">{c.entryCount}</span>
        </button>
      ))}
    </div>
  );
}

function chip(active: boolean): string {
  const base = 'themed-pill px-3 py-1.5 text-xs font-medium tracking-wide transition-colors';
  return active
    ? `${base} text-[color:var(--accent)] border-[color:var(--accent)]`
    : `${base} text-[color:var(--fg-muted)] hover:text-[color:var(--accent-soft)]`;
}
