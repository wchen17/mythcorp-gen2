#!/usr/bin/env node
/* eslint-disable no-console */
// Reads BACKLOG.md, parses each "## #N, <title>" section, and posts it to
// GitHub Issues on the current repo via the gh CLI. Re-running is safe:
// it skips any issue whose title already exists.
//
// Usage:
//   gh auth login          # one time
//   node tools/post-backlog-to-issues.mjs
//
// Cross-platform Node port of the original PowerShell script. Works wherever
// Node 18+ and the gh CLI are available (Codespaces, Linux, macOS, Windows).

import { spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

function fail(msg) {
  console.error(msg);
  process.exit(1);
}

function ghAvailable() {
  const r = spawnSync('gh', ['--version'], { stdio: 'ignore' });
  return r.status === 0;
}

function ghAuthOk() {
  const r = spawnSync('gh', ['auth', 'status'], { stdio: 'ignore' });
  return r.status === 0;
}

function fetchExistingTitles() {
  const r = spawnSync('gh', ['issue', 'list', '--state', 'all', '--limit', '500', '--json', 'title'], {
    encoding: 'utf8',
  });
  if (r.status !== 0) fail(`gh issue list failed:\n${r.stderr}`);
  const arr = JSON.parse(r.stdout);
  return new Set(arr.map((x) => x.title.trim()));
}

function parseBacklog(text) {
  const blocks = text.split(/^---\s*$/m);
  const items = [];
  for (const block of blocks) {
    const headingMatch = block.match(/^## #\d+,\s*(.+?)\s*$/m);
    if (!headingMatch) continue;
    const title = headingMatch[1].trim();

    const labelsMatch = block.match(/^\*\*Labels:\*\*\s*(.+?)\s*$/m);
    const labels = [];
    if (labelsMatch) {
      const rx = /`([^`]+)`/g;
      let m;
      while ((m = rx.exec(labelsMatch[1])) !== null) labels.push(m[1]);
    }

    const bodyMatch = block.match(/^\*\*Body:\*\*\s*\n([\s\S]+)$/m);
    const body = bodyMatch ? bodyMatch[1].trim() : '(see BACKLOG.md for full content)';
    items.push({ title, labels, body });
  }
  return items;
}

function main() {
  if (!ghAvailable()) {
    fail("gh CLI not found. Install from https://cli.github.com, then run 'gh auth login'.");
  }
  if (!ghAuthOk()) {
    fail("Not logged into gh. Run 'gh auth login' first.");
  }

  const backlogPath = new URL('../BACKLOG.md', import.meta.url);
  let raw;
  try {
    raw = readFileSync(backlogPath, 'utf8');
  } catch {
    fail(`BACKLOG.md not found at ${backlogPath}`);
  }

  const items = parseBacklog(raw);
  if (items.length === 0) {
    console.log('No backlog items found.');
    return;
  }

  console.log('Fetching existing issues...');
  const existing = fetchExistingTitles();

  const tmp = mkdtempSync(join(tmpdir(), 'backlog-'));
  let created = 0;
  let skipped = 0;
  let failed = 0;

  for (const item of items) {
    if (existing.has(item.title)) {
      console.log(`SKIP (already exists): ${item.title}`);
      skipped += 1;
      continue;
    }

    const bodyFile = join(tmp, `${created}-${Date.now()}.md`);
    writeFileSync(bodyFile, item.body, 'utf8');

    const args = ['issue', 'create', '--title', item.title, '--body-file', bodyFile];
    for (const label of item.labels) args.push('--label', label);

    console.log(`CREATE: ${item.title}`);
    const r = spawnSync('gh', args, { encoding: 'utf8' });
    if (r.status === 0) {
      console.log(`  -> ${r.stdout.trim()}`);
      created += 1;
    } else {
      console.log(`  ! gh exited ${r.status}`);
      console.log(`    ${r.stderr.trim()}`);
      failed += 1;
    }
  }

  rmSync(tmp, { recursive: true, force: true });
  console.log(`\nDone. Created: ${created}. Skipped (already exist): ${skipped}. Failed: ${failed}.`);
}

main();
