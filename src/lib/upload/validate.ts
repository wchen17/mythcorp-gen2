import { LIMITS, type AllowedType } from "./env";

// "Magic bytes": the real file-type signature at the start of the bytes. The
// browser-sent Content-Type and the filename are attacker-controlled and mean
// nothing. These byte patterns are what the file actually IS.
function sniff(bytes: Uint8Array): AllowedType | null {
  const b = bytes;
  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47) return "image/png";
  // JPEG: FF D8 FF
  if (b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return "image/jpeg";
  // GIF: "GIF8"
  if (b[0] === 0x47 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x38) return "image/gif";
  // WEBP: "RIFF"...."WEBP"
  if (
    b[0] === 0x52 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x46 &&
    b[8] === 0x57 && b[9] === 0x45 && b[10] === 0x42 && b[11] === 0x50
  ) return "image/webp";
  return null;
}

export type ValidationResult =
  | { ok: true; type: AllowedType }
  | { ok: false; status: number; message: string };

// The full gate. Order matters: cheap checks (size) before the byte sniff.
export function validateUpload(body: ArrayBuffer): ValidationResult {
  if (body.byteLength === 0) {
    return { ok: false, status: 400, message: "Empty file." };
  }
  // Size cap. Blocks a single huge file from blowing the per-file budget and
  // from parking megabytes in memory. Checked against the real byte length,
  // not a client-claimed Content-Length header.
  if (body.byteLength > LIMITS.MAX_FILE_BYTES) {
    return { ok: false, status: 413, message: "File too large." };
  }
  // Type allowlist via magic bytes. Blocks: an HTML/JS file renamed cat.gif
  // (stored XSS), an SVG with a script payload, and any non-image content
  // masquerading behind an image Content-Type header.
  const type = sniff(new Uint8Array(body.slice(0, 16)));
  if (!type) {
    return { ok: false, status: 415, message: "Only PNG, JPEG, GIF, or WEBP images are allowed." };
  }
  return { ok: true, type };
}
