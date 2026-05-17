import type { CatalogEntry } from '../_lib/types';

interface EntryRowProps {
  entry: CatalogEntry;
  compact?: boolean;
}

export function EntryRow({ entry, compact = false }: EntryRowProps) {
  return (
    <li className="group flex items-start gap-3 py-2">
      {entry.badges.length > 0 && (
        <span aria-hidden className="mt-0.5 shrink-0 text-sm">
          {entry.badges.join(' ')}
        </span>
      )}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
          <a
            href={entry.url}
            target="_blank"
            rel="noreferrer"
            className="font-serif text-base font-semibold text-[color:var(--fg)]
                       transition-colors group-hover:text-[color:var(--accent)]
                       hover:underline underline-offset-4"
          >
            {entry.name}
          </a>
          {!compact && entry.resourceLinks.length > 0 && (
            <span className="flex flex-wrap gap-1.5">
              {entry.resourceLinks.map((r, i) => (
                <a
                  key={i}
                  href={r.url}
                  target="_blank"
                  rel="noreferrer"
                  className="font-mono text-[10px] uppercase tracking-wider
                             text-[color:var(--fg-subtle)]
                             hover:text-[color:var(--accent-soft)]"
                >
                  [{r.text}]
                </a>
              ))}
            </span>
          )}
        </div>
        {entry.blurb && (
          <p className={`mt-0.5 text-[color:var(--fg-muted)] ${compact ? 'text-xs' : 'text-sm'} line-clamp-2`}>
            {entry.blurb}
          </p>
        )}
      </div>
    </li>
  );
}
