import { uploadEnv } from "./env";
import { newApiKey } from "./ids";

// What we keep about each key. The raw key is NEVER stored; only its hash is,
// as the KV key name. `label` is who the key belongs to.
export interface KeyRecord {
  label: string;
  admin: boolean;
  createdAt: string;
}

// SHA-256 -> hex. Same input always yields the same hash, so we can look up a
// presented key by hashing it and checking KV. One-way: the hash cannot be
// turned back into the key.
async function hashKey(raw: string): Promise<string> {
  const data = new TextEncoder().encode(raw);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return [...new Uint8Array(digest)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

const KEY_PREFIX = "key:";

// Returns the key's record if valid, or null. This IS the auth check.
export async function verifyKey(raw: string): Promise<KeyRecord | null> {
  if (!raw) return null;
  const hash = await hashKey(raw);
  const rec = await uploadEnv().UPLOADS_KV.get<KeyRecord>(
    KEY_PREFIX + hash,
    "json",
  );
  return rec ?? null;
}

// Mints a new key, stores only its hash, and returns the raw key ONCE.
// After this call the raw key is unrecoverable, exactly like a real API token.
export async function createKey(label: string, admin = false): Promise<string> {
  const raw = newApiKey();
  const rec: KeyRecord = {
    label,
    admin,
    createdAt: new Date().toISOString(),
  };
  await uploadEnv().UPLOADS_KV.put(KEY_PREFIX + (await hashKey(raw)), JSON.stringify(rec), {
    metadata: rec,
  });
  return raw;
}

export interface KeyListing {
  hash: string;
  label: string;
  admin: boolean;
  createdAt: string;
}

// For the dashboard: every key's metadata (never the raw keys, which are gone).
export async function listKeys(): Promise<KeyListing[]> {
  const out: KeyListing[] = [];
  const res = await uploadEnv().UPLOADS_KV.list<KeyRecord>({ prefix: KEY_PREFIX });
  for (const k of res.keys) {
    const m = k.metadata;
    if (!m) continue;
    out.push({ hash: k.name.slice(KEY_PREFIX.length), label: m.label, admin: m.admin, createdAt: m.createdAt });
  }
  return out;
}

// Revoke by the hash shown in the dashboard. The person's key stops working
// immediately, with no redeploy and no effect on anyone else.
export async function revokeKey(hash: string): Promise<void> {
  await uploadEnv().UPLOADS_KV.delete(KEY_PREFIX + hash);
}
