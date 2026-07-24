'use client';
import { useEffect, useState } from 'react';
import type { ObjectRecord } from './useObjects';
function formatBytes(bytes: number): string { return bytes < 1048576 ? `${Math.max(1, Math.round(bytes / 1024))} KB` : `${(bytes / 1048576).toFixed(1)} MB`; }
export function ObjectTile({ object, publicBase, onDelete, onSaveEmbed }: { object: ObjectRecord; publicBase: string; onDelete: (key: string) => void; onSaveEmbed: (key: string, embed: ObjectRecord["embed"]) => Promise<boolean> }) {
  const [copied, setCopied] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(object.embed?.title ?? "");
  const [description, setDescription] = useState(object.embed?.description ?? "");
  const [accent, setAccent] = useState(object.embed?.accent ?? "");
  const url = `${publicBase.replace(/\/$/, '')}/${object.key}`;
  useEffect(() => { if (!copied) return; const timer = window.setTimeout(() => setCopied(false), 1400); return () => window.clearTimeout(timer); }, [copied]);
  useEffect(() => { if (!confirming) return; const timer = window.setTimeout(() => setConfirming(false), 2200); return () => window.clearTimeout(timer); }, [confirming]);
  return <article className="themed-surface themed-surface-interactive group overflow-hidden">
    <a href={url} target="_blank" rel="noopener noreferrer" className="relative block aspect-square bg-[color:var(--bg-elevated)]">
      <img src={url} alt={`${object.type} upload ${object.key}`} className="h-full w-full object-contain" loading="lazy" />
      <span className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-2 bg-[color:var(--bg-overlay)] px-3 py-2 font-mono text-[10px] text-[color:var(--fg)] opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100">{object.key}</span>
    </a>
    <div className="flex items-center justify-between gap-2 p-3">
      <p className="min-w-0 truncate font-mono text-[10px] text-[color:var(--fg-subtle)]">{object.uploader} / {formatBytes(object.size)}</p>
      <div className="flex shrink-0 gap-2 text-[10px] font-medium">
        <button type="button" onClick={() => { void navigator.clipboard.writeText(url); setCopied(true); }} className="text-[color:var(--accent)] hover:underline">{copied ? 'Copied' : 'Copy'}</button>
        {confirming ? <><button type="button" onClick={() => onDelete(object.key)} className="text-[color:var(--accent-warm)] hover:underline">Confirm</button><button type="button" onClick={() => setConfirming(false)} className="text-[color:var(--fg-muted)] hover:underline">Cancel</button></> : <button type="button" onClick={() => setConfirming(true)} className="text-[color:var(--accent-warm)] hover:underline">Delete</button>}
      </div>
    </div>
    <div className="border-t border-[color:var(--border)] p-3">
      <button type="button" onClick={() => setEditing((value) => !value)} className="font-mono text-[10px] uppercase tracking-widest text-[color:var(--accent)] hover:underline">{editing ? "Close embed editor" : "Edit rich embed"}</button>
      {editing && <form className="mt-3 grid gap-2" onSubmit={async (event) => { event.preventDefault(); const ok = await onSaveEmbed(object.key, { title, description, accent }); if (ok) setEditing(false); }}>
        <input value={title} onChange={(event) => setTitle(event.target.value)} maxLength={120} placeholder="Embed title" className="themed-surface px-2 py-1 text-xs" />
        <textarea value={description} onChange={(event) => setDescription(event.target.value)} maxLength={300} placeholder="Embed description" rows={2} className="themed-surface px-2 py-1 text-xs" />
        <input value={accent} onChange={(event) => setAccent(event.target.value)} placeholder="#00ffff" pattern="^#[0-9a-fA-F]{6}$" className="themed-surface px-2 py-1 font-mono text-xs" />
        <button type="submit" className="themed-button px-2 py-1 text-[10px] uppercase tracking-widest">Save embed</button>
      </form>}
    </div>
  </article>;
}

