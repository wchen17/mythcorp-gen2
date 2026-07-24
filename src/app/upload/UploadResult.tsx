'use client';
import { useEffect, useState } from 'react';
import type { UploadStatus } from './useUpload';
function formatBytes(bytes: number): string { return bytes < 1048576 ? `${Math.max(1, Math.round(bytes / 1024))} KB` : `${(bytes / 1048576).toFixed(1)} MB`; }
export function UploadResult({ status }: { status: Extract<UploadStatus, { kind: 'done' }> }) {
  const [copied, setCopied] = useState(false);
  const [copiedView, setCopiedView] = useState(false);
  useEffect(() => { if (!copied) return; const timer = window.setTimeout(() => setCopied(false), 1400); return () => window.clearTimeout(timer); }, [copied]);
  useEffect(() => { if (!copiedView) return; const timer = window.setTimeout(() => setCopiedView(false), 1400); return () => window.clearTimeout(timer); }, [copiedView]);
  return <div className="themed-surface mt-5 space-y-3 p-4">
    <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[color:var(--accent)]">Ingest complete</p>
    <p className="font-mono text-xs text-[color:var(--fg-muted)]">{status.type.toUpperCase().replace('IMAGE/', '')} - public asset - {formatBytes(status.size)}</p>
    <LinkRow label="Direct public link" value={status.url} copied={copied} onCopy={() => { void navigator.clipboard.writeText(status.url); setCopied(true); }} />
    <LinkRow label="Rich embed link" value={status.viewUrl} copied={copiedView} onCopy={() => { void navigator.clipboard.writeText(status.viewUrl); setCopiedView(true); }} />
  </div>;
}
function LinkRow({ label, value, copied, onCopy }: { label: string; value: string; copied: boolean; onCopy: () => void }) {
  return <div className="space-y-1.5">
    <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[color:var(--fg-subtle)]">{label}</p>
    <div className="flex gap-2">
      <input aria-label={label} readOnly value={value} onFocus={(event) => event.currentTarget.select()} className="min-w-0 flex-1 bg-transparent font-mono text-xs text-[color:var(--fg)] outline-none" />
      <button type="button" onClick={onCopy} className="themed-button shrink-0 px-3 py-1.5 text-xs">{copied ? 'Copied' : 'Copy'}</button>
    </div>
  </div>;
}
