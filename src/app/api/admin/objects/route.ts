import { verifyAdmin } from "@/lib/upload/admin";
import { isEmbedAccent, listObjects, deleteObjectRecord, type ObjectRecord, updateObjectEmbed } from "@/lib/upload/objects";
import { deleteObject } from "@/lib/upload/r2";
import { releaseBytes } from "@/lib/upload/caps";
import { uploadEnv, LIMITS } from "@/lib/upload/env";

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

export async function GET(request: Request): Promise<Response> {
  if (!verifyAdmin(request)) return json({ error: "Unauthorized" }, 401);
  const objects = await listObjects();
  const totalBytes = objects.reduce((sum, o) => sum + o.size, 0);
  return json({
    objects,
    totalBytes,
    ceiling: LIMITS.TOTAL_BYTES_CEILING,
    publicBase: uploadEnv().R2_PUBLIC_BASE_URL,
  });
}

export async function DELETE(request: Request): Promise<Response> {
  if (!verifyAdmin(request)) return json({ error: "Unauthorized" }, 401);
  const { key } = (await request.json().catch(() => ({}))) as { key?: string };
  if (!key) return json({ error: "An object key is required." }, 400);

  // Look up the record first so we know how many bytes to release.
  const record = (await listObjects()).find((o: ObjectRecord) => o.key === key);
  await deleteObject(key); // R2 blob
  await deleteObjectRecord(key); // KV metadata
  if (record) await releaseBytes(record.size); // usage counter
  return json({ ok: true });
}

export async function PATCH(request: Request): Promise<Response> {
  if (!verifyAdmin(request)) return json({ error: "Unauthorized" }, 401);
  const body = (await request.json().catch(() => ({}))) as { key?: string; embed?: { title?: unknown; description?: unknown; accent?: unknown } };
  if (!body.key || !body.embed) return json({ error: "An object key and embed settings are required." }, 400);
  const title = typeof body.embed.title === "string" ? body.embed.title.trim().slice(0, 120) : "";
  const description = typeof body.embed.description === "string" ? body.embed.description.trim().slice(0, 300) : "";
  const accent = typeof body.embed.accent === "string" ? body.embed.accent.trim() : "";
  if (accent && !isEmbedAccent(accent)) return json({ error: "Accent must be a six-digit hex color." }, 400);
  const record = await updateObjectEmbed(body.key, { ...(title ? { title } : {}), ...(description ? { description } : {}), ...(accent ? { accent } : {}) });
  if (!record) return json({ error: "Object not found." }, 404);
  return json({ object: record });
}
