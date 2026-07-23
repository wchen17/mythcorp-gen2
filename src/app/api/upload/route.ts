import { verifyKey } from "@/lib/upload/keys";
import { validateUpload } from "@/lib/upload/validate";
import { checkCaps, commitUsage } from "@/lib/upload/caps";
import { randomObjectKey } from "@/lib/upload/ids";
import { putObject, publicUrl } from "@/lib/upload/r2";
import { recordObject } from "@/lib/upload/objects";

function bearer(request: Request): string {
  return (request.headers.get("authorization") ?? "").replace(/^Bearer\s+/i, "");
}

function json(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

export async function POST(request: Request): Promise<Response> {
  // 1. AUTH. One KV read. Fails before we touch the body.
  const key = await verifyKey(bearer(request));
  if (!key) return json({ error: "Unauthorized" }, 401);

  // 2. Read the bytes. `.arrayBuffer()` is the raw file, header/name ignored.
  const body = await request.arrayBuffer();

  // 3. VALIDATE. Size + magic-byte type. The sniffed type is trusted; the
  //    client's Content-Type is not.
  const check = validateUpload(body);
  if (!check.ok) return json({ error: check.message }, check.status);

  // 4. CAPS. Refuse before storing if this would cross a ceiling.
  const cap = await checkCaps(key.label, body.byteLength);
  if (!cap.ok) return json({ error: cap.message }, cap.status);

  // 5. STORE. Random key, served with the sniffed type (never the client's).
  const objectKey = randomObjectKey(check.type);
  await putObject(objectKey, body, check.type);

  // 6. RECORD + count. Metadata index and usage counters.
  await recordObject({
    key: objectKey,
    uploader: key.label,
    size: body.byteLength,
    type: check.type,
    uploadedAt: new Date().toISOString(),
  });
  await commitUsage(key.label, body.byteLength);

  return json({ url: publicUrl(objectKey), key: objectKey }, 201);
}
