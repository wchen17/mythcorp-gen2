// Secrets injected at runtime via `wrangler secret put` (prod) or `.dev.vars` (local).
// They are intentionally NOT in wrangler.jsonc, so `cf-typegen` cannot see them.
// This interface-merge tells TypeScript they exist on the Cloudflare env.
// ADMIN_PASSWORD is deliberately absent: the admin panel and its API routes
// were removed on 2026-07-25, so nothing reads it. The secret itself is still
// set on the worker, harmlessly, and `wrangler secret delete ADMIN_PASSWORD`
// clears it. Declaring it here again is step one of bringing the panel back.
interface CloudflareEnv {
  R2_ACCOUNT_ID: string;
  R2_ACCESS_KEY_ID: string;
  R2_SECRET_ACCESS_KEY: string;
  R2_BUCKET: string;
}
