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

// Per-object delete token, handed to the uploader once. Separate secret from the
// API key on purpose: pasting a delete link somewhere costs you one image, not
// your whole upload account.
export function newDeleteToken(): string {
  return `mcd_${base64url(randomBytes(16))}`;
}

// An object key is `<id>.<ext>`. The id is what the public view route takes,
// because a URL ending in .png should mean raw bytes everywhere, ours included.
export function objectId(key: string): string {
  return key.replace(/\.[a-z0-9]+$/i, "");
}

// 16 random bytes in base64url is ALWAYS 22 characters, so anything else is a
// probe. This guard matters: the id is used as a KV list prefix, and an
// unvalidated short prefix would let someone walk other people's keys one
// character at a time. Reject the shape before it reaches storage.
export function isObjectId(value: string): boolean {
  return /^[A-Za-z0-9_-]{22}$/.test(value);
}
