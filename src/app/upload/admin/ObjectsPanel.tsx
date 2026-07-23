'use client';

import { useCallback, useEffect, useState } from 'react';

interface ObjectRecord {
  key: string;
  uploader: string;
  size: number;
  type: string;
  uploadedAt: string;
}

interface Payload {
  objects: ObjectRecord[];
  totalBytes: number;
  ceiling: number;
  publicBase: string;
}

function mb(bytes: number): string {
  return (bytes / (1024 * 1024)).toFixed(1);
}

export function ObjectsPanel({ password }: { password: string }) {
  const [data, setData] = useState<Payload | null>(null);
  const auth = { authorization: `Bearer ${password}`, 'content-type': 'application/json' };

  const load = useCallback(async () => {
    const res = await fetch('/api/admin/objects', { headers: auth });
    if (res.ok) setData((await res.json()) as Payload);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [password]);

  useEffect(() => {
    void load();
  }, [load]);

  const remove = async (key: string) => {
    await fetch('/api/admin/objects', { method: 'DELETE', headers: auth, body: JSON.stringify({ key }) });
    void load();
  };

  if (!data) return <p className="text-sm text-[color:var(--fg-subtle)]">Loading uploads...</p>;

  const pct = Math.min(100, (data.totalBytes / data.ceiling) * 100);

  return (
    <section>
      <h2 className="mb-3 font-serif text-xl font-semibold">Uploads</h2>

      <div className="mb-4">
        <div className="mb-1 flex justify-between font-mono text-[11px] text-[color:var(--fg-muted)]">
          <span>{mb(data.totalBytes)} MB used</span>
          <span>{(data.ceiling / (1024 * 1024 * 1024)).toFixed(0)} GB ceiling</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-[color:var(--bg-elevated)]">
          <div className="h-full bg-[color:var(--accent)]" style={{ width: `${pct}%` }} />
        </div>
      </div>

      <ul className="divide-y divide-[color:var(--border)]">
        {data.objects.map((o) => (
          <li key={o.key} className="flex items-center justify-between gap-3 py-2 text-sm">
            <a
              href={`${data.publicBase.replace(/\/$/, '')}/${o.key}`}
              target="_blank"
              rel="noopener noreferrer"
              className="min-w-0 flex-1 truncate font-mono text-xs text-[color:var(--accent)] hover:underline"
            >
              {o.key}
            </a>
            <span className="whitespace-nowrap text-[11px] text-[color:var(--fg-subtle)]">
              {o.uploader} / {mb(o.size)} MB
            </span>
            <button
              onClick={() => remove(o.key)}
              className="text-xs text-[color:var(--accent-warm)] hover:underline"
            >
              Delete
            </button>
          </li>
        ))}
        {data.objects.length === 0 && (
          <li className="py-2 text-sm text-[color:var(--fg-subtle)]">Nothing uploaded yet.</li>
        )}
      </ul>
    </section>
  );
}
