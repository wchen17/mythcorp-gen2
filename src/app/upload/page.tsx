'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { SiteHeader } from '../components/SiteHeader';

type Status =
  | { kind: 'idle' }
  | { kind: 'uploading' }
  | { kind: 'done'; url: string }
  | { kind: 'error'; message: string };

export default function UploadPage() {
  const [apiKey, setApiKey] = useState('');
  const [dragging, setDragging] = useState(false);
  const [status, setStatus] = useState<Status>({ kind: 'idle' });
  const [copied, setCopied] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  // Remember the key locally so you paste it once, not every visit.
  useEffect(() => {
    setApiKey(localStorage.getItem('mc_upload_key') ?? '');
  }, []);
  useEffect(() => {
    if (apiKey) localStorage.setItem('mc_upload_key', apiKey);
  }, [apiKey]);

  const upload = useCallback(
    async (file: File) => {
      if (!apiKey) {
        setStatus({ kind: 'error', message: 'Paste your upload key first.' });
        return;
      }
      setStatus({ kind: 'uploading' });
      setCopied(false);
      try {
        const res = await fetch('/api/upload', {
          method: 'POST',
          headers: { authorization: `Bearer ${apiKey}`, 'content-type': file.type || 'application/octet-stream' },
          body: file,
        });
        const data = (await res.json().catch(() => ({}))) as { url?: string; error?: string };
        if (!res.ok) {
          setStatus({ kind: 'error', message: data.error ?? `Upload failed (${res.status}).` });
          return;
        }
        setStatus({ kind: 'done', url: data.url! });
      } catch {
        setStatus({ kind: 'error', message: 'Network error. Is the server running?' });
      }
    },
    [apiKey],
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files?.[0];
      if (file) void upload(file);
    },
    [upload],
  );

  return (
    <div className="min-h-screen bg-[color:var(--bg)] text-[color:var(--fg)]">
      <SiteHeader />
      <main className="mx-auto flex min-h-screen max-w-xl flex-col justify-center px-6 pt-24 pb-16">
        <p className="mb-3 font-mono text-xs uppercase tracking-[0.4em] text-[color:var(--accent)]">
          [ UPLOAD ]
        </p>
        <h1 className="mb-6 font-serif text-3xl font-semibold tracking-tight md:text-4xl">
          Drop an image, get a link
        </h1>

        <label className="mb-2 block font-mono text-xs uppercase tracking-widest text-[color:var(--fg-subtle)]">
          Your upload key
        </label>
        <input
          type="password"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="mc_..."
          className="mb-6 w-full rounded-lg border border-[color:var(--border)]
                     bg-[color:var(--bg-elevated)] px-3 py-2 font-mono text-sm
                     text-[color:var(--fg)] outline-none focus:border-[color:var(--accent)]"
        />

        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          onClick={() => fileInput.current?.click()}
          className={[
            'flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-6 py-14 text-center transition-colors',
            dragging
              ? 'border-[color:var(--accent)] bg-[color:var(--accent)]/5'
              : 'border-[color:var(--border-strong)] hover:border-[color:var(--accent-soft)]',
          ].join(' ')}
        >
          <span className="text-sm text-[color:var(--fg-muted)]">
            {status.kind === 'uploading' ? 'Uploading...' : 'Drag a PNG, JPEG, GIF, or WEBP here, or click to pick'}
          </span>
          <span className="font-mono text-[10px] uppercase tracking-widest text-[color:var(--fg-subtle)]">
            Max 25 MB
          </span>
          <input
            ref={fileInput}
            type="file"
            accept="image/png,image/jpeg,image/gif,image/webp"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void upload(file);
              e.target.value = '';
            }}
          />
        </div>

        {status.kind === 'error' && (
          <p className="mt-4 rounded-lg border border-[color:var(--accent-warm)]/40 bg-[color:var(--accent-warm)]/10 px-3 py-2 text-sm text-[color:var(--accent-warm)]">
            {status.message}
          </p>
        )}

        {status.kind === 'done' && (
          <div className="mt-4 flex items-center gap-2 rounded-lg border border-[color:var(--border)] bg-[color:var(--bg-elevated)] p-2">
            <input
              readOnly
              value={status.url}
              className="flex-1 bg-transparent px-2 font-mono text-xs text-[color:var(--fg)] outline-none"
            />
            <button
              type="button"
              onClick={() => {
                void navigator.clipboard.writeText(status.url);
                setCopied(true);
              }}
              className="rounded-md bg-[color:var(--accent)] px-3 py-1.5 text-xs font-medium text-[color:var(--bg)] transition-opacity hover:opacity-90"
            >
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
