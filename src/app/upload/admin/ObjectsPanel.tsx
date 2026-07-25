'use client';
import { useMemo, useState } from 'react';
import { ObjectTile } from './ObjectTile';
import { formatBytes, formatMegabytes, useObjects } from './useObjects';

type SortMode = 'newest' | 'largest';

// Nothing expires on its own here, by choice: a link shared in a group chat
// should still resolve a year later. The tradeoff is that a full bucket is a
// manual chore, so the job of this panel is to make the chore visible early
// and easy to aim. Hence the bands below and the size sort.
const WARN_AT = 80;
const CRITICAL_AT = 95;

export function ObjectsPanel({ password }: { password: string }) {
  const { data, error, remove, saveEmbed } = useObjects(password);
  const [sort, setSort] = useState<SortMode>('newest');

  const objects = useMemo(() => {
    const list = [...(data?.objects ?? [])];
    // Sorting by size is what makes clearing space targeted instead of a purge:
    // a handful of big objects is usually the entire problem.
    return sort === 'largest'
      ? list.sort((a, b) => b.size - a.size)
      : list.sort((a, b) => b.uploadedAt.localeCompare(a.uploadedAt));
  }, [data, sort]);

  if (!data) return <p className="text-sm text-[color:var(--fg-subtle)]">Loading uploads...</p>;

  const pct = Math.min(100, (data.totalBytes / data.ceiling) * 100);
  const remaining = Math.max(0, data.ceiling - data.totalBytes);
  const critical = pct >= CRITICAL_AT;
  const pressured = pct >= WARN_AT;
  const meterColor = pressured ? 'bg-[color:var(--accent-warm)]' : 'bg-[color:var(--accent)]';

  return <section className="mt-10">
    <div className="mb-4 flex items-end justify-between gap-4">
      <div>
        <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.24em] text-[color:var(--accent)]">Object index</p>
        <h2 className="font-serif text-xl font-semibold">Uploads</h2>
      </div>
      <div className="flex items-center gap-3">
        <p className="font-mono text-[10px] text-[color:var(--fg-subtle)]">{data.objects.length} objects</p>
        <div className="flex gap-1 font-mono text-[10px]">
          {(['newest', 'largest'] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => setSort(mode)}
              aria-pressed={sort === mode}
              className={`px-2 py-1 transition-colors ${sort === mode ? 'text-[color:var(--accent)]' : 'text-[color:var(--fg-subtle)] hover:text-[color:var(--fg-muted)]'}`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>
    </div>

    <div className="themed-surface mb-6 p-4">
      <div className="mb-2 flex justify-between gap-3 font-mono text-[11px] text-[color:var(--fg-muted)]">
        <span>{formatMegabytes(data.totalBytes)} MB used</span>
        <span>{(data.ceiling / 1073741824).toFixed(0)} GB ceiling</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-[color:var(--bg-elevated)]">
        <div className={`h-full transition-[width] ${meterColor}`} style={{ width: `${pct}%` }} />
      </div>
      <p className="mt-2 font-mono text-[10px] text-[color:var(--fg-subtle)]">{pct.toFixed(1)}% of storage envelope</p>
      {pressured && (
        <p className={`mt-2 text-xs ${critical ? 'text-[color:var(--accent-warm)]' : 'text-[color:var(--fg-muted)]'}`}>
          {formatBytes(remaining)} left.{' '}
          {critical
            ? 'Uploads are about to start failing. Sort by largest and clear a few.'
            : 'Uploads hard-stop at the ceiling. Sort by largest to clear space before they do.'}
        </p>
      )}
    </div>

    {error && <p className="mb-4 border border-[color:var(--accent-warm)]/40 bg-[color:var(--accent-warm)]/10 px-3 py-2 text-sm text-[color:var(--accent-warm)]">{error}</p>}

    {objects.length ? (
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
        {objects.map((object) => <ObjectTile key={object.key} object={object} publicBase={data.publicBase} onDelete={remove} onSaveEmbed={saveEmbed} />)}
      </div>
    ) : (
      <div className="themed-surface p-8 text-center">
        <p className="font-serif text-lg">The vault is empty.</p>
        <p className="mt-2 text-sm text-[color:var(--fg-muted)]">Feed it a screenshot from the upload console.</p>
      </div>
    )}
  </section>;
}
