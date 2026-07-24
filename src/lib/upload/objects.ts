import { uploadEnv } from "./env";

// Metadata we keep about each stored blob. Small on purpose: KV list metadata
// is capped at ~1 KB per entry, and this rides along free with a list() call.
export interface ObjectRecord {
  key: string;
  uploader: string;
  size: number;
  type: string;
  uploadedAt: string;
  embed?: { title?: string; description?: string; accent?: string };
}

const OBJ_PREFIX = "obj:";

export async function recordObject(rec: ObjectRecord): Promise<void> {
  await uploadEnv().UPLOADS_KV.put(OBJ_PREFIX + rec.key, "", { metadata: rec });
}

export async function getObjectRecord(key: string): Promise<ObjectRecord | null> {
  const entry = await uploadEnv().UPLOADS_KV.getWithMetadata<ObjectRecord>(OBJ_PREFIX + key);
  return entry.metadata ?? null;
}

export async function listObjects(): Promise<ObjectRecord[]> {
  const out: ObjectRecord[] = [];
  const res = await uploadEnv().UPLOADS_KV.list<ObjectRecord>({ prefix: OBJ_PREFIX });
  for (const k of res.keys) {
    if (k.metadata) out.push(k.metadata);
  }
  return out.sort((a, b) => b.uploadedAt.localeCompare(a.uploadedAt));
}

export async function deleteObjectRecord(key: string): Promise<void> {
  await uploadEnv().UPLOADS_KV.delete(OBJ_PREFIX + key);
}


export function isEmbedAccent(value: string): boolean {
  return /^#[0-9a-fA-F]{6}$/.test(value);
}

export async function updateObjectEmbed(key: string, embed: ObjectRecord['embed']): Promise<ObjectRecord | null> {
  const record = await getObjectRecord(key);
  if (!record) return null;
  const updated = { ...record, embed };
  await recordObject(updated);
  return updated;
}
