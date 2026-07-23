import { ALLOWED, type AllowedType } from "./env";

// URL-safe base64 of raw bytes, no padding. Good for object keys and API keys.
function base64url(bytes: Uint8Array): string {
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function randomBytes(n: number): Uint8Array {
  const buf = new Uint8Array(n);
  crypto.getRandomValues(buf);
  return buf;
}

// 16 bytes = 128 bits of entropy. Unguessable and non-enumerable: nobody can
// walk /a, /b, /c to scrape other people's uploads.
export function randomObjectKey(type: AllowedType): string {
  return `${base64url(randomBytes(16))}.${ALLOWED[type]}`;
}

// 24 bytes = 192 bits for API keys. Prefixed so a leaked key is greppable
// (e.g. someone pasting it in a public repo) and obviously ours.
export function newApiKey(): string {
  return `mc_${base64url(randomBytes(24))}`;
}
