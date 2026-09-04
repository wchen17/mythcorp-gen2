import { uploadEnv, LIMITS } from "./env";

const DAY_MS = 24 * 60 * 60 * 1000;
const TOTAL_BYTES_KEY = "stat:totalbytes";

function todayUtc(): string {
  return new Date().toISOString().slice(0, 10); // YYYY-MM-DD
}

async function readInt(k: string): Promise<number> {
  const v = await uploadEnv().UPLOADS_KV.get(k);
  return v ? parseInt(v, 10) || 0 : 0;
}

export type CapResult = { ok: true } | { ok: false; status: number; message: string };

// Called BEFORE storing. Refuses if this upload would cross either ceiling.
export async function checkCaps(label: string, size: number): Promise<CapResult> {
  const dayKey = `count:${label}:${todayUtc()}`;
  const [dayCount, totalBytes] = await Promise.all([readInt(dayKey), readInt(TOTAL_BYTES_KEY)]);

  if (dayCount >= LIMITS.DAILY_PER_USER) {
    return { ok: false, status: 429, message: "Daily upload limit reached. Try again tomorrow." };
  }
  if (totalBytes + size > LIMITS.TOTAL_BYTES_CEILING) {
    return { ok: false, status: 507, message: "Storage ceiling reached. Delete some uploads first." };
  }
  return { ok: true };
}

// Called AFTER a successful store, to move the counters forward.
// NOTE: KV has no atomic increment, so this read-modify-write can undercount
// under heavy concurrency. Fine for a group chat; a Durable Object would be the
// correct atomic primitive if this ever needed to be exact under load.
export async function commitUsage(label: string, size: number): Promise<void> {
  const kv = uploadEnv().UPLOADS_KV;
  const dayKey = `count:${label}:${todayUtc()}`;
  const [dayCount, totalBytes] = await Promise.all([readInt(dayKey), readInt(TOTAL_BYTES_KEY)]);
  await Promise.all([
    // Daily counter self-destructs after 2 days via TTL, so it never piles up.
    kv.put(dayKey, String(dayCount + 1), { expirationTtl: Math.floor((2 * DAY_MS) / 1000) }),
    kv.put(TOTAL_BYTES_KEY, String(totalBytes + size)),
  ]);
}

// Called on delete so freeing space actually lowers the total.
export async function releaseBytes(size: number): Promise<void> {
  const total = await readInt(TOTAL_BYTES_KEY);
  await uploadEnv().UPLOADS_KV.put(TOTAL_BYTES_KEY, String(Math.max(0, total - size)));
}
