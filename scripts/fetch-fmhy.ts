/* eslint-disable no-console */
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { CATEGORIES } from '../src/app/fmhy/_data/categories';
import type {
  Catalog,
  CatalogCategory,
  CatalogEntry,
  CatalogSection,
} from '../src/app/fmhy/_lib/types';

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(HERE, '..');
const DATA_DIR = join(REPO_ROOT, 'src/app/fmhy/_data');
const CATEGORIES_DIR = join(DATA_DIR, 'categories');
const INDEX_PATH = join(DATA_DIR, 'index.json');

const RAW_BASE = 'https://raw.githubusercontent.com/fmhy/edit/main/docs';

const BADGE_GLYPHS = new Set([
  '⭐', '🌐', '↪', '↪️', '🔧', '🇺🇸', '🇪🇸', '🇫🇷', '🇨🇳', '🇯🇵',
  '🇰🇷', '🇩🇪', '🇮🇹', '🇷🇺', '🇧🇷', '🇮🇳', '🇹🇼', '🇻🇳', '🇹🇷',
]);

function looksLikeBadge(token: string): boolean {
  if (!token) return false;
  if (BADGE_GLYPHS.has(token)) return true;
  return /^\p{Extended_Pictographic}/u.test(token);
}

async function fetchMarkdown(file: string): Promise<string> {
  const url = `${RAW_BASE}/${file}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`fetch ${url} returned ${res.status}`);
  }
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

  if (rest.startsWith('-') || rest.startsWith('—') || rest.startsWith(':')) {
    rest = rest.slice(1).trim();
  }

  const resourceLinks: { text: string; url: string }[] = [];
  const blurb = rest.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_m, text, href) => {
    resourceLinks.push({ text: text.trim(), url: href.trim() });
    return text.trim();
  }).replace(/\s{2,}/g, ' ').trim();

  return { name, url, blurb, badges, resourceLinks };
}

function parseCategory(slug: string, sourceFile: string, md: string): CatalogCategory {
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
      const last = current.entries[current.entries.length - 1];
      const lastSection = sections[sections.length - 1];
      if (lastSection.subheading !== subheading) {
        const split: CatalogSection = { heading: current.heading, subheading, entries: [] };
        sections.push(split);
        current = split;
      }
      void last;
    }

    current.entries.push(entry);
  }

  return {
    slug,
    sourceFile,
    sections: sections.filter((s) => s.entries.length > 0),
  };
}

type IndexEntry = {
  slug: string;
  sourceFile: string;
  sectionCount: number;
  entryCount: number;
  highlights: { name: string; url: string; blurb: string }[];
};

type IndexFile = {
  fetchedAt: string;
  categories: IndexEntry[];
};

function topHighlights(category: CatalogCategory, n: number): IndexEntry['highlights'] {
  const all: CatalogEntry[] = [];
  for (const s of category.sections) {
    for (const e of s.entries) {
      if (e.badges.includes('⭐')) all.push(e);
      if (all.length >= n) break;
    }
    if (all.length >= n) break;
  }
  if (all.length < n) {
    for (const s of category.sections) {
      for (const e of s.entries) {
        if (!all.includes(e)) all.push(e);
        if (all.length >= n) break;
      }
      if (all.length >= n) break;
    }
  }
  return all.slice(0, n).map((e) => ({
    name: e.name,
    url: e.url,
    blurb: e.blurb.length > 120 ? e.blurb.slice(0, 117) + '...' : e.blurb,
  }));
}

async function main(): Promise<void> {
  console.log(`Fetching ${CATEGORIES.length} FMHY categories...`);
  const fetchedAt = new Date().toISOString();
  const indexEntries: IndexEntry[] = [];

  await mkdir(CATEGORIES_DIR, { recursive: true });

  for (const meta of CATEGORIES) {
    process.stdout.write(`  ${meta.slug.padEnd(22)} ← ${meta.upstreamFile.padEnd(24)} `);
    try {
      const md = await fetchMarkdown(meta.upstreamFile);
      const category = parseCategory(meta.slug, meta.upstreamFile, md);
      const entryCount = category.sections.reduce((n, s) => n + s.entries.length, 0);

      const perCategory: Catalog = {
        fetchedAt,
        categories: [category],
      };
      const filePath = join(CATEGORIES_DIR, `${meta.slug}.json`);
      await writeFile(filePath, JSON.stringify(perCategory, null, 2) + '\n', 'utf8');

      indexEntries.push({
        slug: meta.slug,
        sourceFile: meta.upstreamFile,
        sectionCount: category.sections.length,
        entryCount,
        highlights: topHighlights(category, 4),
      });

      console.log(`ok (${category.sections.length} sections, ${entryCount} entries)`);
    } catch (err) {
      console.log(`FAIL: ${(err as Error).message}`);
    }
  }

  const indexFile: IndexFile = { fetchedAt, categories: indexEntries };
  await writeFile(INDEX_PATH, JSON.stringify(indexFile, null, 2) + '\n', 'utf8');

  const totalEntries = indexEntries.reduce((n, c) => n + c.entryCount, 0);
  console.log(`\nWrote ${indexEntries.length} per-category JSON files in ${CATEGORIES_DIR}`);
  console.log(`Wrote summary index ${INDEX_PATH}`);
  console.log(`Total: ${totalEntries.toLocaleString()} entries across ${indexEntries.length} categories.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
