'use client';

import type { CanvasEntry } from './manifest';

/**
 * The diegetic half of the page: what the bench is holding right now, written
 * the way an instrument would write it rather than the way a feature card
 * would.
 */
export function StageReadout({
  entry,
  htmlInCanvas,
  calm,
}: {
  entry: CanvasEntry | undefined;
  htmlInCanvas: boolean | null;
  calm: boolean;
}) {
  const api = htmlInCanvas === null ? 'probing' : htmlInCanvas ? 'present' : 'absent';

  return (
    <dl className="flex flex-wrap items-baseline gap-x-8 gap-y-2 border-b
                   border-[color:var(--border)] pb-3 font-mono text-[11px]">
      <Field label="mounted" value={entry ? entry.name : 'none'} lit={Boolean(entry)} />
      <Field label="subject" value={entry ? (entry.subject === 'page' ? 'live dom' : 'spectre.glb') : 'none'} />
      <Field label="api" value={api} lit={htmlInCanvas === true} />
      <Field label="motion" value={calm ? 'reduced' : 'full'} />
      <Field label="chunks" value={entry ? '1 of 10' : '0 of 10'} />
    </dl>
  );
}

function Field({ label, value, lit = false }: { label: string; value: string; lit?: boolean }) {
  return (
    <div className="flex items-baseline gap-2">
      <dt className="uppercase tracking-[0.24em] text-[color:var(--fg-subtle)]">{label}</dt>
      <dd className={lit ? 'text-[color:var(--accent)]' : 'text-[color:var(--fg)]'}>{value}</dd>
    </div>
  );
}
