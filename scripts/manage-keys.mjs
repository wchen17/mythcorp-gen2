#!/usr/bin/env node
// Upload-key management, out of band.
//
// This replaces the /upload/admin panel, removed 2026-07-25. The reasoning is
// the one 0x0.st and catbox use: the most secure admin panel is the one that
// does not exist on the public internet. There was no rate limiting in front of
// the admin password, so every admin endpoint was a brute-force target AND a
// denial-of-wallet target, since each attempt costs a Worker request whether it
// succeeds or fails. Deleting the surface removed both at once.
//
// Auth here is wrangler's OAuth session against your Cloudflare account. It
// never crosses the public internet as a password.
//
// Usage, from the repo root:
//   node scripts/manage-keys.mjs mint <label>    mint a key, print it ONCE
//   node scripts/manage-keys.mjs list            list keys (hashes + labels)
//   node scripts/manage-keys.mjs revoke <hash>   revoke by hash from `list`
//
// Object management is plain wrangler, no wrapper needed:
//   npx wrangler kv key list --binding UPLOADS_KV --remote
//   npx wrangler kv key get --binding UPLOADS_KV --remote "obj:<key>"
//   npx wrangler r2 object delete "real/<key>" --remote   (gmail account, see STATUS)

import { createHash, randomBytes } from 'node:crypto';
import { execFileSync } from 'node:child_process';

const KV = ['--binding', 'UPLOADS_KV', '--remote'];

// Wrangler's JS entry point is invoked with the current node binary rather than
// going through `npx`. Two reasons: on Windows, spawning npx.cmd without a
// shell fails with EINVAL, and spawning it WITH a shell would interpolate the
// label and hash arguments through a command line, which is an injection hole
// for a script whose whole job is handling credentials. execFileSync with an
// argv array never touches a shell.
const WRANGLER = new URL('../node_modules/wrangler/bin/wrangler.js', import.meta.url).pathname
  .replace(/^\/([A-Za-z]:)/, '$1');

function wrangler(args) {
  return execFileSync(process.execPath, [WRANGLER, ...args], {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'inherit'],
  });
}

// Mirrors newApiKey() in src/lib/upload/ids.ts: "mc_" + base64url of 24 random
// bytes. 192 bits, which is why upload keys are not the brute-force concern the
// admin password was. Keep the two in step if either changes.
function newApiKey() {
  const b64 = randomBytes(24).toString('base64');
  return 'mc_' + b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

// The worker looks a key up by the SHA-256 of the raw value, so only the hash
// is ever stored. Same one-way treatment the old createKey() used.
const hashOf = (raw) => createHash('sha256').update(raw).digest('hex');

function mint(label) {
  if (!label) throw new Error('mint needs a label, e.g. `mint alice`');
  const raw = newApiKey();
  const record = JSON.stringify({
    label,
    admin: false,
    createdAt: new Date().toISOString(),
  });
  // Metadata carries the same record so `list` can show labels without a
  // read per key, which is exactly what the old dashboard relied on.
  wrangler(['kv', 'key', 'put', ...KV, `key:${hashOf(raw)}`, record, '--metadata', record]);
  console.log(`\nlabel: ${label}`);
  console.log(`key:   ${raw}`);
  console.log('\nThis is the only time the key is shown. Store it now.');
  console.log('It is a write credential: it can upload to your bucket. Treat it like a password.');
}

function list() {
  const raw = wrangler(['kv', 'key', 'list', ...KV]);
  const rows = JSON.parse(raw.slice(raw.indexOf('[')))
    .filter((k) => k.name.startsWith('key:'))
    .map((k) => ({ hash: k.name.slice(4), label: k.metadata?.label ?? '?', created: k.metadata?.createdAt ?? '?' }));
  if (!rows.length) return console.log('No upload keys.');
  for (const r of rows) console.log(`${r.hash}  ${r.label.padEnd(16)} ${r.created}`);
}

function revoke(hash) {
  if (!hash) throw new Error('revoke needs a key hash from `list`');
  wrangler(['kv', 'key', 'delete', ...KV, `key:${hash}`]);
  console.log(`Revoked ${hash}. That key stops working immediately, with no redeploy.`);
}

const [command, arg] = process.argv.slice(2);
try {
  if (command === 'mint') mint(arg);
  else if (command === 'list') list();
  else if (command === 'revoke') revoke(arg);
  else {
    console.log('Usage: node scripts/manage-keys.mjs <mint <label> | list | revoke <hash>>');
    process.exit(1);
  }
} catch (error) {
  console.error(`\n${error.message}`);
  process.exit(1);
}
