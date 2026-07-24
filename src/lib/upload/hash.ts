// SHA-256 -> hex. Same input always yields the same hash, so a presented secret
// can be looked up by hashing it. One-way: the hash cannot be turned back into
// the secret. Shared by API keys and per-object delete tokens so both get the
// same treatment: we store the hash, the raw value is shown once and then gone.
export async function sha256Hex(raw: string): Promise<string> {
  const data = new TextEncoder().encode(raw);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return [...new Uint8Array(digest)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
