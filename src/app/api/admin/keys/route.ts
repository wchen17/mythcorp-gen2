import { verifyAdmin } from "@/lib/upload/admin";
import { createKey, listKeys, revokeKey } from "@/lib/upload/keys";

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

export async function GET(request: Request): Promise<Response> {
  if (!verifyAdmin(request)) return json({ error: "Unauthorized" }, 401);
  return json({ keys: await listKeys() });
}

export async function POST(request: Request): Promise<Response> {
  if (!verifyAdmin(request)) return json({ error: "Unauthorized" }, 401);
  const { label, admin } = (await request.json().catch(() => ({}))) as {
    label?: string;
    admin?: boolean;
  };
  if (!label || !label.trim()) return json({ error: "A label is required." }, 400);
  // The raw key is returned ONCE here and never again. Show it, then it's gone.
  const raw = await createKey(label.trim(), Boolean(admin));
  return json({ key: raw }, 201);
}

export async function DELETE(request: Request): Promise<Response> {
  if (!verifyAdmin(request)) return json({ error: "Unauthorized" }, 401);
  const { hash } = (await request.json().catch(() => ({}))) as { hash?: string };
  if (!hash) return json({ error: "A key hash is required." }, 400);
  await revokeKey(hash);
  return json({ ok: true });
}
