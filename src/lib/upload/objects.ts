import { uploadEnv } from "./env";

// Metadata we keep about each stored blob. Small on purpose: KV list metadata
// is capped at ~1 KB per entry, and this rides along free with a list() call.
export interface ObjectRecord {
  key: string;
  uploader: string;
  size: number;
  type: string;
  uploadedAt: string;
}

const OBJ_PREFIX = "obj:";

export async function recordObject(rec: ObjectRecord): Promise<void> {
  await uploadEnv().UPLOADS_KV.put(OBJ_PREFIX + rec.key, "", { metadata: rec });
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
