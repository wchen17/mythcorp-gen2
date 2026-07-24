'use client';
import { useCallback, useState } from 'react';
export type UploadStatus =
  | { kind: 'idle' }
  | { kind: 'uploading'; loaded: number; total: number; startedAt: number }
  | { kind: 'done'; url: string; viewUrl: string; type: string; size: number }
  | { kind: 'error'; message: string };
export function useUpload(apiKey: string) {
  const [status, setStatus] = useState<UploadStatus>({ kind: 'idle' });
  const upload = useCallback((file: File) => {
    if (!apiKey) { setStatus({ kind: 'error', message: 'Paste your upload key first.' }); return; }
    const request = new XMLHttpRequest();
    const startedAt = performance.now();
    setStatus({ kind: 'uploading', loaded: 0, total: file.size, startedAt });
    request.open('POST', '/api/upload');
    request.setRequestHeader('authorization', `Bearer ${apiKey}`);
    request.setRequestHeader('content-type', file.type || 'application/octet-stream');
    request.upload.onprogress = (event) => { if (event.lengthComputable) setStatus({ kind: 'uploading', loaded: event.loaded, total: event.total, startedAt }); };
    request.onload = () => {
      let data: { url?: string; viewUrl?: string; error?: string } = {}
      try { data = JSON.parse(request.responseText) as typeof data; } catch { data = {}; }
      if (request.status < 200 || request.status >= 300 || !data.url || !data.viewUrl) { setStatus({ kind: 'error', message: data.error ?? `Upload failed (${request.status}).` }); return; }
      setStatus({ kind: 'done', url: data.url, viewUrl: data.viewUrl, type: file.type, size: file.size });
    };
    request.onerror = () => setStatus({ kind: 'error', message: 'Network error. Is the server running?' });
    request.onabort = () => setStatus({ kind: 'error', message: 'Upload cancelled.' });
    request.send(file);
  }, [apiKey]);
  return { status, upload };
}

