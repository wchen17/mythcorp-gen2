import { ALLOWED } from "@/lib/upload/env";
import { isObjectId } from "@/lib/upload/ids";
import { getObject } from "@/lib/upload/r2";

// Serves the raw image bytes for i.mythcorp.org.
//
// The bucket sits in a different Cloudflare account from this worker and the
// mythcorp.org zone, and an R2 custom domain requires the zone and the bucket
// to share an account. So instead of attaching i.mythcorp.org to the bucket,
// the worker fetches from R2 over the signed S3 endpoint and streams the
// result. See the note on getObject in lib/upload/r2.ts.

// Extension to content type, inverted from the upload allowlist so the two can
// never drift apart.
// Typed as <string, string> rather than left to inference: the values of
// ALLOWED are a literal union, so an inferred Map would only accept those exact
// four strings as a lookup argument, and the whole point here is looking up an
// arbitrary extension off the wire.
const TYPE_BY_EXT = new Map<string, string>(
  Object.entries(ALLOWED).map(([type, ext]) => [ext, type]),
);

// The key arriving here is attacker-controlled, and it is interpolated into an
// S3 object path. Validate the exact shape before it gets anywhere near a
// fetch: 22-character id, a dot, one known extension. isObjectId is the same
// guard the /a/<id> route uses, and it exists because an unvalidated key is a
// path-traversal and bucket-enumeration hole.
function contentTypeFor(key: string): string | null {
  const dot = key.lastIndexOf(".");
  if (dot < 1) return null;
  const id = key.slice(0, dot);
  const ext = key.slice(dot + 1).toLowerCase();
  if (!isObjectId(id)) return null;
  return TYPE_BY_EXT.get(ext) ?? null;
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ key: string }> },
): Promise<Response> {
  const { key } = await params;
  const contentType = contentTypeFor(key);
  if (!contentType) return new Response("Not found", { status: 404 });

  const upstream = await getObject(key);
  if (!upstream.ok || !upstream.body) {
    return new Response("Not found", { status: 404 });
  }

  return new Response(upstream.body, {
    status: 200,
    headers: {
      // Content type comes from OUR allowlist, not from whatever R2 echoes
      // back, so a stored object can never talk the browser into treating it
      // as something executable.
      "content-type": contentType,
      "x-content-type-options": "nosniff",
      // One hour, not the year an immutable content-addressed key would
      // justify. Delete tokens are a real feature here, and a deleted image
      // that keeps serving from cache for months would make deletion a lie.
      // An hour keeps the worker off the hot path for repeat views while
      // keeping deletion meaningful.
      "cache-control": "public, max-age=3600",
      // Matches the noindex on the /a/<id> view page. Discordbot and
      // Twitterbot ignore this, which is exactly why /a is not disallowed in
      // robots.txt either: embeds keep working, search engines stay out.
      "x-robots-tag": "noindex",
    },
  });
}
