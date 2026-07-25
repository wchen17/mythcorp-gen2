import { LIMITS } from "./env";

// Reading the upload body in the two shapes clients actually send.
//
// Raw binary is what ShareX sends (Body: "Binary") and what this endpoint
// accepted first. But `curl -F 'file=@cat.png'` is the universal idiom, and
// every long-standing image host takes it, so multipart/form-data is a first
// class input here rather than a special case.
//
// Both paths end at the same place: an ArrayBuffer handed to validateUpload,
// which sniffs the real magic bytes. Nothing below trusts a filename or a
// client-declared Content-Type, because both are attacker-controlled.

// Field names to look for, in order, before falling back to the first file in
// the form. "file" is the curl and HTML-form default; the rest are what other
// hosts and their client scripts have trained people to send.
const FILE_FIELDS = ["file", "image", "upload", "files[]"] as const;

// Multipart wraps the file in boundary lines and per-part headers, so a legal
// request is slightly larger than the file it carries. 1 MB of slack is far
// more than that overhead and keeps the early reject from firing on a valid
// upload sitting just under the file cap.
const MULTIPART_OVERHEAD_SLACK = 1024 * 1024;

export type BodyResult =
  | { ok: true; body: ArrayBuffer }
  | { ok: false; status: number; message: string };

// Cheap pre-buffer reject. Content-Length is client-claimed, so this is a
// courtesy check that stops an honest oversized upload before we park it in
// memory, NOT a security control. validateUpload re-checks the real byte
// length after buffering, and that is the one that counts.
function declaredTooLarge(request: Request, ceiling: number): boolean {
  const declared = Number(request.headers.get("content-length"));
  return Number.isFinite(declared) && declared > ceiling;
}

async function readMultipart(request: Request): Promise<BodyResult> {
  if (declaredTooLarge(request, LIMITS.MAX_FILE_BYTES + MULTIPART_OVERHEAD_SLACK)) {
    return { ok: false, status: 413, message: "File too large." };
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    // A truncated body or a malformed boundary lands here. This is the client's
    // mistake, not ours, so it is a 400 and not a 500.
    return { ok: false, status: 400, message: "Could not parse the multipart body." };
  }

  let file: File | null = null;
  for (const name of FILE_FIELDS) {
    const value = form.get(name);
    if (value instanceof File) {
      file = value;
      break;
    }
  }
  // Fall back to the first file part under any name, so a client using its own
  // field name still works instead of failing for a cosmetic reason.
  if (!file) {
    for (const value of form.values()) {
      if (value instanceof File) {
        file = value;
        break;
      }
    }
  }
  if (!file) {
    return {
      ok: false,
      status: 400,
      message: "No file part in the form. Send the image as a file field, for example: -F 'file=@image.png'.",
    };
  }
  // file.size is the buffered part's real length, so unlike Content-Length this
  // one is trustworthy. Checking here just returns the right error sooner.
  if (file.size > LIMITS.MAX_FILE_BYTES) {
    return { ok: false, status: 413, message: "File too large." };
  }
  return { ok: true, body: await file.arrayBuffer() };
}

export async function readUploadBody(request: Request): Promise<BodyResult> {
  const contentType = request.headers.get("content-type") ?? "";
  if (contentType.toLowerCase().startsWith("multipart/form-data")) {
    return readMultipart(request);
  }
  if (declaredTooLarge(request, LIMITS.MAX_FILE_BYTES)) {
    return { ok: false, status: 413, message: "File too large." };
  }
  return { ok: true, body: await request.arrayBuffer() };
}
