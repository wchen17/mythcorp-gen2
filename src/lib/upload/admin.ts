import { uploadEnv } from "./env";

// Constant-time string compare. Runs over the full length regardless of where
// the first mismatch is, so an attacker cannot time-probe the password char by
// char. Length is compared with a difference too, not an early return.
function timingSafeEqual(a: string, b: string): boolean {
  const enc = new TextEncoder();
  const ba = enc.encode(a);
  const bb = enc.encode(b);
  let diff = ba.length ^ bb.length;
  const len = Math.max(ba.length, bb.length);
  for (let i = 0; i < len; i++) {
    diff |= (ba[i] ?? 0) ^ (bb[i] ?? 0);
  }
  return diff === 0;
}

// Reads the admin password from the Authorization header and checks it against
// the secret. Returns true only on an exact, constant-time match.
export function verifyAdmin(request: Request): boolean {
  const header = request.headers.get("authorization") ?? "";
  const presented = header.replace(/^Bearer\s+/i, "");
  if (!presented) return false;
  return timingSafeEqual(presented, uploadEnv().ADMIN_PASSWORD);
}
