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
  await recordObject({ key: objectKey, uploader: key.label, size: body.byteLength, type: check.type, uploadedAt: new Date().toISOString() });
  await commitUsage(key.label, body.byteLength);
  const url = publicUrl(objectKey);
  const viewUrl = `${new URL(request.url).origin}/i/${objectKey}`;
  return json({ url, viewUrl, key: objectKey }, 201);
}
