'use client';
import { useCallback, useEffect, useState } from 'react';
export interface ObjectRecord { key: string; uploader: string; size: number; type: string; uploadedAt: string; embed?: { title?: string; description?: string; accent?: string }; }
export interface ObjectsPayload { objects: ObjectRecord[]; totalBytes: number; ceiling: number; publicBase: string; }
export function formatMegabytes(bytes: number): string { return (bytes / 1048576).toFixed(1); }
export function useObjects(password: string) {
  const [data, setData] = useState<ObjectsPayload | null>(null);
  const [error, setError] = useState<string | null>(null);
  const auth = { authorization: `Bearer ${password}`, 'content-type': 'application/json' };
  const load = useCallback(async () => {
    setError(null);
    const response = await fetch('/api/admin/objects', { headers: auth });
    if (!response.ok) { setError('The object index could not be read.'); return; }
    setData((await response.json()) as ObjectsPayload);
  }, [password]);
  useEffect(() => { void load(); }, [load]);
  const remove = useCallback(async (key: string) => {
    const response = await fetch('/api/admin/objects', { method: 'DELETE', headers: auth, body: JSON.stringify({ key }) });
    if (!response.ok) { setError('The object could not be removed.'); return; }
    await load();
  }, [load, password]);
  const saveEmbed = useCallback(async (key: string, embed: ObjectRecord["embed"]) => {
    const response = await fetch("/api/admin/objects", { method: "PATCH", headers: auth, body: JSON.stringify({ key, embed }) });
    if (!response.ok) return false;
    await load();
    return true;
  }, [load, password]);
  return { data, error, load, remove, saveEmbed };
}

