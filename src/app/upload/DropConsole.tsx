'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { UploadResult } from './UploadResult';
import { useUpload } from './useUpload';
type DragState = 'idle' | 'accept' | 'reject';
const ACCEPTED = new Set(['image/png', 'image/jpeg', 'image/gif', 'image/webp']);
function progress(loaded: number, total: number, startedAt: number): string { const elapsed = Math.max(1, performance.now() - startedAt) / 1000; return `${(loaded / 1048576).toFixed(1)} / ${(total / 1048576).toFixed(1)} MB  ${(loaded / elapsed / 1048576).toFixed(1)} MB/s`; }
export function DropConsole({ apiKey }: { apiKey: string }) {
  const { status, upload } = useUpload(apiKey);
  const [dragState, setDragState] = useState<DragState>('idle');
  const [preview, setPreview] = useState<string | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const choose = useCallback((file: File) => { setPreview((old) => { if (old) URL.revokeObjectURL(old); return URL.createObjectURL(file); }); upload(file); }, [upload]);
  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview); }, [preview]);
  useEffect(() => {
    const onPaste = (event: ClipboardEvent) => { if (document.activeElement === document.querySelector('[data-upload-key]')) return; const item = Array.from(event.clipboardData?.items ?? []).find((entry) => entry.type.startsWith('image/')); const file = item?.getAsFile(); if (file && ACCEPTED.has(file.type)) { event.preventDefault(); choose(file); } };
    window.addEventListener('paste', onPaste); return () => window.removeEventListener('paste', onPaste);
  }, [choose]);
  const uploading = status.kind === 'uploading';
  const width = uploading && status.total ? `${Math.min(100, status.loaded / status.total * 100)}%` : '0%';
  const border = dragState === 'accept' ? 'border-[color:var(--accent)] bg-[color:var(--accent)]/5' : dragState === 'reject' ? 'border-[color:var(--accent-warm)] bg-[color:var(--accent-warm)]/5' : 'border-[color:var(--border-strong)] hover:border-[color:var(--accent-soft)]';
  return <>
    <div role="button" tabIndex={0} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') fileInput.current?.click(); }} onDragOver={(event) => { event.preventDefault(); const type = event.dataTransfer.items[0]?.type ?? ''; setDragState(ACCEPTED.has(type) ? 'accept' : 'reject'); }} onDragLeave={() => setDragState('idle')} onDrop={(event) => { event.preventDefault(); setDragState('idle'); const file = event.dataTransfer.files?.[0]; if (file) choose(file); }} onClick={() => fileInput.current?.click()} className={`relative flex cursor-pointer flex-col items-center justify-center gap-2 overflow-hidden rounded-xl border-2 border-dashed px-6 py-14 text-center transition-colors ${border}`}>
      {/* Plain <img>: this one is a local object URL for a file that has not
          been uploaded yet, so there is nothing for an optimizer to fetch. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {preview && <img src={preview} alt="Local upload preview" className={`absolute inset-0 h-full w-full object-contain p-3 opacity-20 ${uploading ? 'blur-sm' : ''}`} />}
      <div className="relative"><span className="block text-sm text-[color:var(--fg-muted)]">{dragState === 'reject' ? 'That format cannot enter the vault.' : uploading ? 'Ingesting asset...' : 'Drag an image here, or click to pick'}</span><span className="mt-2 block font-mono text-[10px] uppercase tracking-widest text-[color:var(--fg-subtle)]">PNG / JPEG / GIF / WEBP, max 25 MB</span>{uploading && <div className="mt-5 w-64 max-w-full"><div className="h-1 overflow-hidden rounded-full bg-[color:var(--bg-elevated)]"><div className="h-full bg-[color:var(--accent)] transition-[width]" style={{ width }} /></div><p className="mt-2 font-mono text-[10px] text-[color:var(--fg-subtle)]">INGEST {progress(status.loaded, status.total, status.startedAt)}</p></div>}</div>
      <input ref={fileInput} type="file" accept="image/png,image/jpeg,image/gif,image/webp" className="hidden" onChange={(event) => { const file = event.target.files?.[0]; if (file) choose(file); event.target.value = ''; }} />
    </div>
    <p className="mt-3 text-center font-mono text-[10px] uppercase tracking-widest text-[color:var(--fg-subtle)]">or paste a screenshot (Ctrl V)</p>
    {status.kind === 'error' && <p className="mt-4 border border-[color:var(--accent-warm)]/40 bg-[color:var(--accent-warm)]/10 px-3 py-2 text-sm text-[color:var(--accent-warm)]">{status.message}</p>}
    {status.kind === 'done' && <UploadResult status={status} />}
  </>;
}
