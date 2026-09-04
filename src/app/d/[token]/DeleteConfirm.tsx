'use client';
import { useState } from 'react';

type State = 'idle' | 'working' | 'done' | 'error';

export function DeleteConfirm({ token }: { token: string }) {
  const [state, setState] = useState<State>('idle');
  const [message, setMessage] = useState('');

  const remove = async () => {
    setState('working');
    try {
      const res = await fetch('/api/delete', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ token }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) { setMessage(data.error ?? 'Delete failed.'); setState('error'); return; }
      setState('done');
    } catch {
      setMessage('Network error. Try again in a moment.');
      setState('error');
    }
  };

  if (state === 'done') {
    return <p className="font-mono text-sm text-[color:var(--accent)]">Deleted. The links are dead and the space is back.</p>;
  }

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={() => void remove()}
        disabled={state === 'working'}
        className="themed-button px-4 py-2 text-sm disabled:opacity-60"
      >
        {state === 'working' ? 'Deleting' : 'Delete it'}
      </button>
      {state === 'error' && <p className="font-mono text-xs text-[color:var(--accent-warm)]">{message}</p>}
      <p className="font-mono text-[10px] text-[color:var(--fg-subtle)]">Close this tab to keep the image.</p>
    </div>
  );
}
