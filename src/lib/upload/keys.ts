import { uploadEnv } from "./env";
import { sha256Hex as hashKey } from "./hash";

// What we keep about each key. The raw key is NEVER stored; only its hash is,
// as the KV key name. `label` is who the key belongs to.
export interface KeyRecord {
  label: string;
  admin: boolean;
  createdAt: string;
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

// createKey, listKeys, and revokeKey were removed on 2026-07-25 with the admin
// panel. Key management now happens out of band via scripts/manage-keys.mjs,
// which writes the same `key:<sha256hex>` records straight into KV through
// wrangler. The worker only ever needs to VERIFY a key, so that is all it
// carries now: less code in the request path, and no key-minting capability
// exposed to the internet at all.
