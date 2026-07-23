// Secrets injected at runtime via `wrangler secret put` (prod) or `.dev.vars` (local).
// They are intentionally NOT in wrangler.jsonc, so `cf-typegen` cannot see them.
// This interface-merge tells TypeScript they exist on the Cloudflare env.
interface CloudflareEnv {
  R2_ACCOUNT_ID: string;
  R2_ACCESS_KEY_ID: string;
  R2_SECRET_ACCESS_KEY: string;
  R2_BUCKET: string;
  ADMIN_PASSWORD: string;
}
