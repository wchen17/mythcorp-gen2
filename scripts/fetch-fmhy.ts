/* eslint-disable no-console */
import { mkdir, rm, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { marked } from 'marked';

import {
  OTHER_OVERRIDES,
  ROOT_OVERRIDES,
} from '../src/app/fmhy/_data/categories';
import type {
  Catalog,
  CatalogCategory,
  CatalogEntry,
  CatalogProse,
  CatalogSection,
  IndexCategory,
  IndexFile,
  Namespace,
  ProseDoc,
} from '../src/app/fmhy/_lib/types';

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(HERE, '..');
const DATA_DIR = join(REPO_ROOT, 'src/app/fmhy/_data');
const CATEGORIES_DIR = join(DATA_DIR, 'categories');
const OTHER_DIR = join(CATEGORIES_DIR, 'other');
const POSTS_DIR = join(CATEGORIES_DIR, 'posts');
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

function parseEntry(line: string): CatalogEntry | null {
  let rest = line.replace(/^[*\-+]\s+/, '').trim();
  const badges: string[] = [];

  while (rest.length > 0) {
    const firstChar = rest[0];
    if (firstChar === '*' || firstChar === '[' || firstChar === ' ') break;
    const token = rest.split(/\s+/, 1)[0];
    if (!looksLikeBadge(token)) break;
    badges.push(token);
    rest = rest.slice(token.length).trimStart();
  }

  const linkMatch = rest.match(/^(\*\*)?\[([^\]]+)\]\(([^)]+)\)(\*\*)?/);
  if (!linkMatch) return null;
  const name = linkMatch[2].trim();
  const url = linkMatch[3].trim();
  rest = rest.slice(linkMatch[0].length).trim();

  if (rest.startsWith('-') || rest.startsWith(':')) {
    rest = rest.slice(1).trim();
  }

  const resourceLinks: { text: string; url: string }[] = [];
  const blurb = rest.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_m, text, href) => {
    resourceLinks.push({ text: text.trim(), url: href.trim() });
    return text.trim();
  }).replace(/\s{2,}/g, ' ').trim();

  return { name, url, blurb, badges, resourceLinks };
}

function parseCatalog(slug: string, namespace: Namespace, sourceFile: string, md: string): CatalogCategory {
  const stripped = stripIntro(md);
  const lines = stripped.split(/\r?\n/);
  const sections: CatalogSection[] = [];
  let current: CatalogSection | null = null;
  let subheading: string | undefined;

  for (const raw of lines) {
    const line = raw.trimEnd();
    if (line.startsWith('## ')) {
      const heading = line.slice(3).replace(/[#`]/g, '').trim();
      current = { heading, entries: [] };
      sections.push(current);
      subheading = undefined;
      continue;
    }
    if (line.startsWith('### ')) {
      subheading = line.slice(4).replace(/[#`]/g, '').trim();
      continue;
    }
    if (!current) continue;
    if (!/^[*\-+]\s/.test(line)) continue;

    const entry = parseEntry(line);
    if (!entry) continue;

    if (subheading) {
      const lastSection = sections[sections.length - 1];
      if (lastSection.subheading !== subheading) {
        const split: CatalogSection = { heading: current.heading, subheading, entries: [] };
        sections.push(split);
        current = split;
      }
    }

    current.entries.push(entry);
  }

  return {
    slug,
    namespace,
    sourceFile,
    sections: sections.filter((s) => s.entries.length > 0),
  };
}

type Frontmatter = { title?: string; description?: string; body: string };

function stripFrontmatter(md: string): Frontmatter {
  const match = md.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) return { body: md };
  const fm = match[1];
  const body = match[2];
  const out: Frontmatter = { body };
  for (const line of fm.split(/\r?\n/)) {
    const m = line.match(/^(\w+):\s*(.*)$/);
    if (!m) continue;
    const v = m[2].trim().replace(/^['"]|['"]$/g, '');
    if (m[1] === 'title') out.title = v;
    if (m[1] === 'description') out.description = v;
  }
  return out;
}

function stripVitepressContainers(md: string): string {
  // VitePress :::warning / :::tip / :::info blocks → plain blockquotes.
  return md.replace(/^:::\s*(\w+)\s*\n([\s\S]*?)^:::\s*$/gm, (_m, kind: string, body: string) => {
    const label = kind.toUpperCase();
    const quoted = body.trim().split(/\r?\n/).map((l) => `> ${l}`).join('\n');
    return `> **${label}**\n${quoted}\n`;
  });
}

function deriveTitle(slug: string): string {
  return slug
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function parseProse(slug: string, namespace: Namespace, sourceFile: string, md: string): CatalogProse {
  const fm = stripFrontmatter(md);
  const cleaned = stripVitepressContainers(fm.body);
  const html = marked.parse(cleaned, { async: false }) as string;
  return {
    slug,
    namespace,
    sourceFile,
    title: fm.title ?? deriveTitle(slug),
    description: fm.description,
    html,
  };
}

function topHighlights(category: CatalogCategory, n: number): IndexCategory['highlights'] {
  const starred: CatalogEntry[] = [];
  const rest: CatalogEntry[] = [];
  for (const s of category.sections) {
    for (const e of s.entries) {
      if (e.badges.includes('⭐')) starred.push(e);
      else rest.push(e);
    }
  }
  const pool = [...starred, ...rest].slice(0, n);
  return pool.map((e) => ({
    name: e.name,
    url: e.url,
    blurb: e.blurb.length > 120 ? e.blurb.slice(0, 117) + '...' : e.blurb,
  }));
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

async function processCatalog(
  meta: { slug: string; namespace: 'root'; sourceFile: string; display: { name: string; emoji: string; blurb: string } },
  fetchedAt: string,
): Promise<IndexCategory | null> {
  process.stdout.write(`  [root]   ${meta.slug.padEnd(22)} ← ${meta.sourceFile.padEnd(28)} `);
  try {
    const md = await fetchMarkdown(meta.sourceFile);
    const category = parseCatalog(meta.slug, 'root', meta.sourceFile, md);
    const entryCount = category.sections.reduce((n, s) => n + s.entries.length, 0);
    if (entryCount === 0) {
      // Prose-style root doc (beginners-guide, sandbox, startpage, unsafe, ...).
      // Render the markdown directly so it still appears in the mirror.
      const doc = parseProse(meta.slug, 'root', meta.sourceFile, md);
      const file: ProseDoc = { fetchedAt, doc };
      await writeFile(join(CATEGORIES_DIR, `${meta.slug}.json`), JSON.stringify(file, null, 2) + '\n', 'utf8');
      console.log(`ok prose (${(doc.html.length / 1024).toFixed(1)}kb html)`);
      return {
        slug: meta.slug,
        namespace: 'root',
        sourceFile: meta.sourceFile,
        kind: 'prose',
        name: meta.display.name || doc.title,
        emoji: meta.display.emoji,
        blurb: meta.display.blurb || (doc.description ?? ''),
        sectionCount: 1,
        entryCount: 0,
        highlights: [],
      };
    }
    const file: Catalog = { fetchedAt, categories: [category] };
    await writeFile(join(CATEGORIES_DIR, `${meta.slug}.json`), JSON.stringify(file, null, 2) + '\n', 'utf8');
    console.log(`ok (${category.sections.length} sections, ${entryCount} entries)`);
    return {
      slug: meta.slug,
      namespace: 'root',
      sourceFile: meta.sourceFile,
      kind: 'catalog',
      ...meta.display,
      sectionCount: category.sections.length,
      entryCount,
      highlights: topHighlights(category, 4),
    };
  } catch (err) {
    console.log(`FAIL: ${(err as Error).message}`);
    return null;
  }
}

async function processProse(
  meta: { slug: string; namespace: 'other' | 'posts'; sourceFile: string; display: { name: string; emoji: string; blurb: string }; outDir: string },
  fetchedAt: string,
): Promise<IndexCategory | null> {
  process.stdout.write(`  [${meta.namespace.padEnd(5)}] ${meta.slug.padEnd(22)} ← ${meta.sourceFile.padEnd(28)} `);
  try {
    const md = await fetchMarkdown(meta.sourceFile);
    const doc = parseProse(meta.slug, meta.namespace, meta.sourceFile, md);
    const file: ProseDoc = { fetchedAt, doc };
    await writeFile(join(meta.outDir, `${meta.slug}.json`), JSON.stringify(file, null, 2) + '\n', 'utf8');
    const blurb = meta.display.blurb || (doc.description ?? '');
    console.log(`ok (${(doc.html.length / 1024).toFixed(1)}kb html)`);
    return {
      slug: meta.slug,
      namespace: meta.namespace,
      sourceFile: meta.sourceFile,
      kind: 'prose',
      name: meta.display.name || doc.title,
      emoji: meta.display.emoji,
      blurb,
      sectionCount: 1,
      entryCount: 0,
      highlights: [],
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

  const rootFiles = root
    .filter((f) => f.type === 'file' && f.name.endsWith('.md') && f.name !== 'index.md' && f.name !== 'feedback.md' && f.name !== 'posts.md')
    .map((f) => ({
      slug: f.name.replace(/\.md$/, ''),
      namespace: 'root' as const,
      sourceFile: f.name,
      display: rootMeta(f.name.replace(/\.md$/, '')),
    }));

  const otherFiles = other
    .filter((f) => f.type === 'file' && f.name.endsWith('.md'))
    .map((f) => ({
      slug: f.name.replace(/\.md$/, ''),
      namespace: 'other' as const,
      sourceFile: `other/${f.name}`,
      display: otherMeta(f.name.replace(/\.md$/, '')),
      outDir: OTHER_DIR,
    }));

  const postFiles = posts
    .filter((f) => f.type === 'file' && f.name.endsWith('.md'))
    .map((f) => ({
      slug: f.name.replace(/\.md$/, ''),
      namespace: 'posts' as const,
      sourceFile: `posts/${f.name}`,
      display: postMeta(f.name.replace(/\.md$/, '')),
      outDir: POSTS_DIR,
    }));

  console.log(`  root: ${rootFiles.length} files, other: ${otherFiles.length} files, posts: ${postFiles.length} files`);

  // Clean output dirs so removed upstream files disappear from mirror.
  await rm(CATEGORIES_DIR, { recursive: true, force: true });
  await mkdir(CATEGORIES_DIR, { recursive: true });
  await mkdir(OTHER_DIR, { recursive: true });
  await mkdir(POSTS_DIR, { recursive: true });

  const entries: IndexCategory[] = [];

  for (const meta of rootFiles) {
    const e = await processCatalog(meta, fetchedAt);
    if (e) entries.push(e);
  }
  for (const meta of otherFiles) {
    const e = await processProse(meta, fetchedAt);
    if (e) entries.push(e);
  }
  for (const meta of postFiles) {
    const e = await processProse(meta, fetchedAt);
    if (e) entries.push(e);
  }

  const indexFile: IndexFile = { fetchedAt, categories: entries };
  await writeFile(INDEX_PATH, JSON.stringify(indexFile, null, 2) + '\n', 'utf8');

  const totalEntries = entries.reduce((n, c) => n + c.entryCount, 0);
  const roots = entries.filter((e) => e.namespace === 'root').length;
  const others = entries.filter((e) => e.namespace === 'other').length;
  const postCount = entries.filter((e) => e.namespace === 'posts').length;
  console.log(`\nWrote ${entries.length} docs (root ${roots} / other ${others} / posts ${postCount})`);
  console.log(`Total catalog entries: ${totalEntries.toLocaleString()}.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
