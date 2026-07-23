import { AwsClient } from "aws4fetch";
import { uploadEnv } from "./env";

// One signer per request is fine; it just holds the credentials.
function client(env: CloudflareEnv): AwsClient {
  return new AwsClient({
    accessKeyId: env.R2_ACCESS_KEY_ID,
    secretAccessKey: env.R2_SECRET_ACCESS_KEY,
    service: "s3",
    region: "auto",
  });
}

// R2's S3 endpoint for a given account: https://<accountid>.r2.cloudflarestorage.com
function objectUrl(env: CloudflareEnv, key: string): string {
  const base = `https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`;
  return `${base}/${env.R2_BUCKET}/${key}`;
}

export async function putObject(
  key: string,
  body: ArrayBuffer,
  contentType: string,
): Promise<void> {
  const env = uploadEnv();
  const res = await client(env).fetch(objectUrl(env, key), {
    method: "PUT",
    body,
    headers: { "content-type": contentType },
  });
  if (!res.ok) {
    throw new Error(`R2 PUT failed: ${res.status} ${await res.text()}`);
  }
}

export async function deleteObject(key: string): Promise<void> {
  const env = uploadEnv();
  const res = await client(env).fetch(objectUrl(env, key), { method: "DELETE" });
  // S3 DELETE is idempotent: 204 for deleted, 404 is also fine (already gone).
  if (!res.ok && res.status !== 404) {
    throw new Error(`R2 DELETE failed: ${res.status} ${await res.text()}`);
  }
}

// The link we hand back. Uses the PUBLIC domain, never the S3 endpoint (which
// requires signing). The bucket must have public access or a custom domain.
export function publicUrl(key: string): string {
  const base = uploadEnv().R2_PUBLIC_BASE_URL.replace(/\/$/, "");
  return `${base}/${key}`;
}
