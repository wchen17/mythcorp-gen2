import { verifyKey } from "@/lib/upload/keys";
import { validateUpload } from "@/lib/upload/validate";
import { checkCaps, commitUsage } from "@/lib/upload/caps";
import { newDeleteToken, objectId, randomObjectKey } from "@/lib/upload/ids";
import { putObject, publicUrl } from "@/lib/upload/r2";
import { recordDeleteToken, recordObject } from "@/lib/upload/objects";

function bearer(request: Request): string {
  return (request.headers.get("authorization") ?? "").replace(/^Bearer\s+/i, "");
}
function json(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });
}
export async function POST(request: Request): Promise<Response> {
  const key = await verifyKey(bearer(request));
  if (!key) return json({ error: "Unauthorized" }, 401);
  const body = await request.arrayBuffer();
  const check = validateUpload(body);
  if (!check.ok) return json({ error: check.message }, check.status);
  const cap = await checkCaps(key.label, body.byteLength);
  if (!cap.ok) return json({ error: cap.message }, cap.status);
  const objectKey = randomObjectKey(check.type);
  await putObject(objectKey, body, check.type);
  // Mint the delete token before recording, so the hash is part of the record
  // from the start and no object exists that a token cannot reach.
  const token = newDeleteToken();
  const deleteHash = await recordDeleteToken(token, objectKey);
  await recordObject({ key: objectKey, uploader: key.label, size: body.byteLength, type: check.type, uploadedAt: new Date().toISOString(), deleteHash });
  await commitUsage(key.label, body.byteLength);
  const origin = new URL(request.url).origin;
  return json({
    url: publicUrl(objectKey),
    viewUrl: `${origin}/a/${objectId(objectKey)}`,
    deleteUrl: `${origin}/d/${token}`,
    key: objectKey,
  }, 201);
}
