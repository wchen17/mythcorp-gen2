'use client';

import { useCallback, useEffect, useState } from 'react';
import { shareXConfig } from './sharex';

interface KeyListing {
  hash: string;
  label: string;
  admin: boolean;
  createdAt: string;
}

export function KeysPanel({ password }: { password: string }) {
  const [keys, setKeys] = useState<KeyListing[]>([]);
  const [label, setLabel] = useState('');
  const [fresh, setFresh] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const auth = { authorization: `Bearer ${password}`, 'content-type': 'application/json' };

  const load = useCallback(async () => {
    const res = await fetch('/api/admin/keys', { headers: auth });
    if (res.ok) setKeys(((await res.json()) as { keys: KeyListing[] }).keys);
    else setError('Could not load keys.');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [password]);

  useEffect(() => {
    void load();
  }, [load]);

  const create = async () => {
    setError(null);
    const res = await fetch('/api/admin/keys', {
      method: 'POST',
      headers: auth,
      body: JSON.stringify({ label }),
    });
    const data = (await res.json()) as { key?: string; error?: string };
    if (!res.ok) return setError(data.error ?? 'Failed to create key.');
    setFresh(data.key!); // shown once, never again
    setLabel('');
    void load();
  };

  const revoke = async (hash: string) => {
    await fetch('/api/admin/keys', { method: 'DELETE', headers: auth, body: JSON.stringify({ hash }) });
    void load();
  };

  return (
    <section className="mb-10">
      <h2 className="mb-3 font-serif text-xl font-semibold">Keys</h2>

      <div className="mb-4 flex gap-2">
        <input
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="Person's name (label)"
          className="flex-1 rounded-lg border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-3 py-2 text-sm outline-none focus:border-[color:var(--accent)]"
        />
        <button
          onClick={create}
          disabled={!label.trim()}
          className="rounded-lg bg-[color:var(--accent)] px-4 py-2 text-sm font-medium text-[color:var(--bg)] disabled:opacity-40"
        >
          Create
        </button>
      </div>

      {error && <p className="mb-3 text-sm text-[color:var(--accent-warm)]">{error}</p>}

      {fresh && (
        <div className="mb-4 rounded-lg border border-[color:var(--accent)]/40 bg-[color:var(--accent)]/10 p-3">
          <p className="mb-2 text-xs text-[color:var(--fg-muted)]">
            Copy this now. It is shown once and cannot be recovered.
          </p>
          <code className="block break-all font-mono text-xs text-[color:var(--accent)]">{fresh}</code>
          <button
            onClick={() =>
              void navigator.clipboard.writeText(shareXConfig(window.location.origin, fresh))
            }
            className="mt-2 rounded-md border border-[color:var(--border)] px-2 py-1 text-[11px] text-[color:var(--fg-muted)] hover:text-[color:var(--fg)]"
          >
            Copy ShareX config
          </button>
        </div>
      )}

      <ul className="divide-y divide-[color:var(--border)]">
        {keys.map((k) => (
          <li key={k.hash} className="flex items-center justify-between gap-3 py-2 text-sm">
            <span>
              {k.label}
              {k.admin && (
                <span className="ml-2 font-mono text-[10px] uppercase tracking-widest text-[color:var(--accent)]">
                  admin
                </span>
              )}
            </span>
            <button
              onClick={() => revoke(k.hash)}
              className="text-xs text-[color:var(--accent-warm)] hover:underline"
            >
              Revoke
            </button>
          </li>
        ))}
        {keys.length === 0 && (
          <li className="py-2 text-sm text-[color:var(--fg-subtle)]">No keys yet.</li>
        )}
      </ul>
    </section>
  );
}
