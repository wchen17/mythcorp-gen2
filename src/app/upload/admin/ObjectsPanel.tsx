'use client';
import { ObjectTile } from './ObjectTile';
import { formatMegabytes, useObjects } from './useObjects';
export function ObjectsPanel({ password }: { password: string }) {
  const { data, error, remove, saveEmbed } = useObjects(password);
  if (!data) return <p className="text-sm text-[color:var(--fg-subtle)]">Loading uploads...</p>;
  const pct = Math.min(100, data.totalBytes / data.ceiling * 100);
  const meterColor = pct >= 80 ? 'bg-[color:var(--accent-warm)]' : 'bg-[color:var(--accent)]';
  return <section className="mt-10">
    <div className="mb-4 flex items-end justify-between gap-4"><div><p className="mb-1 font-mono text-[10px] uppercase tracking-[0.24em] text-[color:var(--accent)]">Object index</p><h2 className="font-serif text-xl font-semibold">Uploads</h2></div><p className="font-mono text-[10px] text-[color:var(--fg-subtle)]">{data.objects.length} objects</p></div>
    <div className="themed-surface mb-6 p-4"><div className="mb-2 flex justify-between gap-3 font-mono text-[11px] text-[color:var(--fg-muted)]"><span>{formatMegabytes(data.totalBytes)} MB used</span><span>{(data.ceiling / 1073741824).toFixed(0)} GB ceiling</span></div><div className="h-2 overflow-hidden rounded-full bg-[color:var(--bg-elevated)]"><div className={`h-full transition-[width] ${meterColor}`} style={{ width: `${pct}%` }} /></div><p className="mt-2 font-mono text-[10px] text-[color:var(--fg-subtle)]">{pct.toFixed(1)}% of storage envelope</p></div>
    {error && <p className="mb-4 border border-[color:var(--accent-warm)]/40 bg-[color:var(--accent-warm)]/10 px-3 py-2 text-sm text-[color:var(--accent-warm)]">{error}</p>}
    {data.objects.length ? <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">{data.objects.map((object) => <ObjectTile key={object.key} object={object} publicBase={data.publicBase} onDelete={remove} onSaveEmbed={saveEmbed} />)}</div> : <div className="themed-surface p-8 text-center"><p className="font-serif text-lg">The vault is empty.</p><p className="mt-2 text-sm text-[color:var(--fg-muted)]">Feed it a screenshot from the upload console.</p></div>}
  </section>;
}
