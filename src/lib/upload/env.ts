import { getCloudflareContext } from "@opennextjs/cloudflare";

// Single place every upload module reaches the Cloudflare bindings + secrets.
// Works in `next dev` (local emulated bindings) and in the deployed Worker.
export function uploadEnv(): CloudflareEnv {
  return getCloudflareContext().env;
}

// Tunable ceilings. Kept in code (not env) so they are reviewable in git.
export const LIMITS = {
  // Largest single file we accept, in bytes. 25 MB covers big GIFs comfortably.
  MAX_FILE_BYTES: 25 * 1024 * 1024,
  // Uploads one key may make per calendar day (UTC).
  DAILY_PER_USER: 100,
  // Hard stop before R2's 10 GB free tier. Cloudflare will NOT auto-stop billing,
  // so this ceiling has to live in our own code.
  TOTAL_BYTES_CEILING: 9 * 1024 * 1024 * 1024,
} as const;

// The only content we will store and serve. SVG is deliberately absent: an SVG
// can carry JavaScript and would run as our origin (stored XSS) if opened raw.
export const ALLOWED = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/gif": "gif",
  "image/webp": "webp",
} as const;

export type AllowedType = keyof typeof ALLOWED;
