'use client';

import { useState } from 'react';
import { SiteHeader } from '../../components/SiteHeader';
import { KeysPanel } from './KeysPanel';
import { ObjectsPanel } from './ObjectsPanel';

export default function AdminPage() {
  // Password is held in memory only. Refreshing makes you re-enter it, on
  // purpose: admin credentials are never persisted to disk or localStorage.
  const [password, setPassword] = useState('');
  const [entered, setEntered] = useState('');
  const [error, setError] = useState<string | null>(null);

  const signIn = async () => {
    setError(null);
    // Probe one admin endpoint to check the password before showing the panels.
    const res = await fetch('/api/admin/keys', {
      headers: { authorization: `Bearer ${entered}` },
    });
    if (res.ok) setPassword(entered);
    else setError('Wrong password.');
  };

  return (
    <div className="min-h-screen bg-[color:var(--bg)] text-[color:var(--fg)]">
      <SiteHeader />
      <main className="mx-auto min-h-screen max-w-xl px-6 pt-24 pb-16">
        <p className="mb-3 font-mono text-xs uppercase tracking-[0.4em] text-[color:var(--accent)]">
          [ UPLOAD ADMIN ]
        </p>

        {!password ? (
          <div className="mt-6">
            <h1 className="mb-6 font-serif text-3xl font-semibold">Sign in</h1>
            <input
              type="password"
              value={entered}
              onChange={(e) => setEntered(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && void signIn()}
              placeholder="Admin password"
              className="mb-3 w-full rounded-lg border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-3 py-2 text-sm outline-none focus:border-[color:var(--accent)]"
            />
            {error && <p className="mb-3 text-sm text-[color:var(--accent-warm)]">{error}</p>}
            <button
              onClick={signIn}
              className="rounded-lg bg-[color:var(--accent)] px-4 py-2 text-sm font-medium text-[color:var(--bg)]"
            >
              Enter
            </button>
          </div>
        ) : (
          <>
            <h1 className="mb-8 font-serif text-3xl font-semibold">Dashboard</h1>
            <KeysPanel password={password} />
            <ObjectsPanel password={password} />
          </>
        )}
      </main>
    </div>
  );
}
