import { uploadEnv } from "./env";
import { sha256Hex } from "./hash";
import { isObjectId } from "./ids";

// Metadata we keep about each stored blob. Small on purpose: KV list metadata
// is capped at ~1 KB per entry, and this rides along free with a list() call.
export interface ObjectRecord {
  key: string;
  uploader: string;
  size: number;
  type: string;
  uploadedAt: string;
  embed?: { title?: string; description?: string; accent?: string };
  // SHA-256 of the delete token. The raw token is shown once at upload and
  // never stored, same discipline as an API key.
  deleteHash?: string;
}

const OBJ_PREFIX = "obj:";
const DEL_PREFIX = "del:";

export async function recordObject(rec: ObjectRecord): Promise<void> {
  await uploadEnv().UPLOADS_KV.put(OBJ_PREFIX + rec.key, "", { metadata: rec });
}

export async function getObjectRecord(key: string): Promise<ObjectRecord | null> {
  const entry = await uploadEnv().UPLOADS_KV.getWithMetadata<ObjectRecord>(OBJ_PREFIX + key);
  return entry.metadata ?? null;
}

// Lookup by the extensionless id the public view route uses. The trailing dot
// in the prefix is load-bearing: it pins the scan to one complete id, so a
// partial id cannot match a longer one. `isObjectId` is the real gate.
export async function getObjectRecordById(id: string): Promise<ObjectRecord | null> {
  if (!isObjectId(id)) return null;
  const res = await uploadEnv().UPLOADS_KV.list<ObjectRecord>({ prefix: `${OBJ_PREFIX}${id}.`, limit: 1 });
  return res.keys[0]?.metadata ?? null;
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

// Points a hashed delete token at its object key, so redeeming a token is one
// KV get instead of a scan over every record.
export async function recordDeleteToken(token: string, key: string): Promise<string> {
  const hash = await sha256Hex(token);
  await uploadEnv().UPLOADS_KV.put(DEL_PREFIX + hash, key);
  return hash;
}

export async function resolveDeleteToken(token: string): Promise<ObjectRecord | null> {
  if (!token) return null;
  const key = await uploadEnv().UPLOADS_KV.get(DEL_PREFIX + (await sha256Hex(token)));
  return key ? getObjectRecord(key) : null;
}

export async function forgetDeleteToken(hash: string | undefined): Promise<void> {
  if (hash) await uploadEnv().UPLOADS_KV.delete(DEL_PREFIX + hash);
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
