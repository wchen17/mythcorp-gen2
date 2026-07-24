import { destroyObject } from "@/lib/upload/destroy";
import { resolveDeleteToken } from "@/lib/upload/objects";

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });
}

// POST, never GET. A delete link gets pasted into chat, and link unfurlers,
// crawlers, and browser prefetch all issue GETs. If GET deleted, the first
// Discord preview would destroy the image before anyone clicked. The token
// travels in the body for the same reason.
export async function POST(request: Request): Promise<Response> {
  const { token } = (await request.json().catch(() => ({}))) as { token?: unknown };
  if (typeof token !== "string" || !token) return json({ error: "A delete token is required." }, 400);
  const record = await resolveDeleteToken(token);
  // Same answer for a wrong token and an already-deleted one, so this cannot be
  // used to probe which tokens ever existed.
  if (!record) return json({ error: "That delete link is not valid, or the image is already gone." }, 404);
  await destroyObject(record);
  return json({ ok: true });
}
