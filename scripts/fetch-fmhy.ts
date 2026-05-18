/* eslint-disable no-console */
import { writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  OTHER_OVERRIDES,
  ROOT_OVERRIDES,
} from '../src/app/fmhy/_data/categories';
import type {
  IndexCategory,
  IndexFile,
  IndexHighlight,
  Namespace,
} from '../src/app/fmhy/_lib/types';

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(HERE, '..');
const DATA_DIR = join(REPO_ROOT, 'src/app/fmhy/_data');
const INDEX_PATH = join(DATA_DIR, 'index.json');

const RAW_BASE = 'https://raw.githubusercontent.com/fmhy/edit/main/docs';
const API_BASE = 'https://api.github.com/repos/fmhy/edit/contents/docs';

const BADGE_GLYPHS = new Set([
  '⭐', '🌐', '↪', '↪️', '🔧', '🇺🇸', '🇪🇸', '🇫🇷', '🇨🇳', '🇯🇵',
  '🇰🇷', '🇩🇪', '🇮🇹', '🇷🇺', '🇧🇷', '🇮🇳', '🇹🇼', '🇻🇳', '🇹🇷',
]);

function looksLikeBadge(token: string): boolean {
  if (!token) return false;
  if (BADGE_GLYPHS.has(token)) return true;
  return /^\p{Extended_Pictographic}/u.test(token);
}

type RemoteFile = { name: string; path: string; type: 'file' | 'dir' };

async function listDir(subpath = ''): Promise<RemoteFile[]> {
  const url = subpath ? `${API_BASE}/${subpath}` : API_BASE;
  const headers: Record<string, string> = { 'User-Agent': 'mythcorp-mirror' };
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  const res = await fetch(url, { headers });
  if (!res.ok) throw new Error(`list ${url} returned ${res.status}`);
  const json = (await res.json()) as RemoteFile[];
  return json;
}

async function fetchMarkdown(file: string): Promise<string> {
  const url = `${RAW_BASE}/${file}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`fetch ${url} returned ${res.status}`);
  return res.text();
}

function stripIntro(md: string): string {
  const idx = md.search(/^##\s+/m);
  return idx >= 0 ? md.slice(idx) : md;
}

type ParsedEntry = { name: string; url: string; blurb: string; starred: boolean };

function parseEntry(line: string): ParsedEntry | null {
  let rest = line.replace(/^[*\-+]\s+/, '').trim();
  let starred = false;

  while (rest.length > 0) {
    const firstChar = rest[0];
    if (firstChar === '*' || firstChar === '[' || firstChar === ' ') break;
    const token = rest.split(/\s+/, 1)[0];
    if (!looksLikeBadge(token)) break;
    if (token === '⭐') starred = true;
    rest = rest.slice(token.length).trimStart();
  }

  const linkMatch = rest.match(/^(\*\*)?\[([^\]]+)\]\(([^)]+)\)(\*\*)?/);
  if (!linkMatch) return null;
  const name = linkMatch[2].trim();
  const url = linkMatch[3].trim();
  rest = rest.slice(linkMatch[0].length).trim();

  if (rest.startsWith('-') || rest.startsWith(':')) rest = rest.slice(1).trim();

  const blurb = rest.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_m, text: string) => text.trim())
    .replace(/\s{2,}/g, ' ').trim();

  return { name, url, blurb, starred };
}

type CatalogStats = {
  sectionCount: number;
  entryCount: number;
  highlights: IndexHighlight[];
};

function statsFromCatalog(md: string, n: number): CatalogStats {
  const stripped = stripIntro(md);
  const lines = stripped.split(/\r?\n/);
  let sectionCount = 0;
  let entryCount = 0;
  const starred: ParsedEntry[] = [];
  const rest: ParsedEntry[] = [];

  for (const raw of lines) {
    const line = raw.trimEnd();
    if (line.startsWith('## ')) { sectionCount++; continue; }
    if (!/^[*\-+]\s/.test(line)) continue;
    const entry = parseEntry(line);
    if (!entry) continue;
    entryCount++;
    if (entry.starred) starred.push(entry);
    else rest.push(entry);
  }

  const highlights = [...starred, ...rest].slice(0, n).map((e) => ({
    name: e.name,
    url: e.url,
    blurb: e.blurb.length > 120 ? e.blurb.slice(0, 117) + '...' : e.blurb,
  }));

  return { sectionCount, entryCount, highlights };
}

function deriveTitle(slug: string): string {
  return slug.replace(/[-_]+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

function rootMeta(slug: string): { name: string; emoji: string; blurb: string } {
  return ROOT_OVERRIDES[slug] ?? { name: deriveTitle(slug), emoji: '◇', blurb: '' };
}

function otherMeta(slug: string): { name: string; emoji: string; blurb: string } {
  return OTHER_OVERRIDES[slug] ?? { name: deriveTitle(slug), emoji: '◇', blurb: '' };
}

function postMeta(slug: string): { name: string; emoji: string; blurb: string } {
  return { name: deriveTitle(slug), emoji: '◷', blurb: 'FMHY changelog / post.' };
}

type Discovery = {
  slug: string;
  namespace: Namespace;
  sourceFile: string;
  display: { name: string; emoji: string; blurb: string };
};

async function entryFor(meta: Discovery): Promise<IndexCategory | null> {
  process.stdout.write(`  [${meta.namespace.padEnd(5)}] ${meta.slug.padEnd(22)} `);
  try {
    let kind: 'catalog' | 'prose' = 'prose';
    let sectionCount = 1;
    let entryCount = 0;
    let highlights: IndexHighlight[] = [];

    if (meta.namespace === 'root') {
      const md = await fetchMarkdown(meta.sourceFile);
      const stats = statsFromCatalog(md, 4);
      if (stats.entryCount > 0) {
        kind = 'catalog';
        sectionCount = stats.sectionCount;
        entryCount = stats.entryCount;
        highlights = stats.highlights;
      }
    }

    console.log(`ok (${kind}, ${entryCount} entries)`);
    return {
      slug: meta.slug,
      namespace: meta.namespace,
      sourceFile: meta.sourceFile,
      kind,
      name: meta.display.name,
      emoji: meta.display.emoji,
      blurb: meta.display.blurb,
      sectionCount,
      entryCount,
      highlights,
    };
  } catch (err) {
    console.log(`FAIL: ${(err as Error).message}`);
    return null;
  }
}

async function main(): Promise<void> {
  const fetchedAt = new Date().toISOString();
  console.log(`Discovering FMHY tree from ${API_BASE}...`);

  const root = await listDir();
  const other = await listDir('other');
  const posts = await listDir('posts');

  const discoveries: Discovery[] = [];

  for (const f of root) {
    if (f.type !== 'file' || !f.name.endsWith('.md')) continue;
    if (f.name === 'index.md' || f.name === 'feedback.md' || f.name === 'posts.md') continue;
    const slug = f.name.replace(/\.md$/, '');
    discoveries.push({ slug, namespace: 'root', sourceFile: f.name, display: rootMeta(slug) });
  }
  for (const f of other) {
    if (f.type !== 'file' || !f.name.endsWith('.md')) continue;
    const slug = f.name.replace(/\.md$/, '');
    discoveries.push({ slug, namespace: 'other', sourceFile: `other/${f.name}`, display: otherMeta(slug) });
  }
  for (const f of posts) {
    if (f.type !== 'file' || !f.name.endsWith('.md')) continue;
    const slug = f.name.replace(/\.md$/, '');
    discoveries.push({ slug, namespace: 'posts', sourceFile: `posts/${f.name}`, display: postMeta(slug) });
  }

  console.log(`  root: ${root.length} files, other: ${other.length} files, posts: ${posts.length} files`);

  const entries: IndexCategory[] = [];
  for (const meta of discoveries) {
    const e = await entryFor(meta);
    if (e) entries.push(e);
  }

  const indexFile: IndexFile = { fetchedAt, categories: entries };
  await writeFile(INDEX_PATH, JSON.stringify(indexFile, null, 2) + '\n', 'utf8');

  const totalEntries = entries.reduce((n, c) => n + c.entryCount, 0);
  const roots = entries.filter((e) => e.namespace === 'root').length;
  const others = entries.filter((e) => e.namespace === 'other').length;
  const postCount = entries.filter((e) => e.namespace === 'posts').length;
  console.log(`\nWrote index with ${entries.length} docs (root ${roots} / other ${others} / posts ${postCount})`);
  console.log(`Total catalog entries indexed: ${totalEntries.toLocaleString()}.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
