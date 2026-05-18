import { promises as fs } from 'node:fs';
import path from 'node:path';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SiteHeader } from '../../components/SiteHeader';
import { ROOT_CATEGORIES, categoryBySlug } from '../_data/categories';
import { EntryRow } from '../_components/EntryRow';
import type { Catalog, CatalogCategory, ProseDoc } from '../_lib/types';

export const dynamic = 'force-static';

export function generateStaticParams() {
  return ROOT_CATEGORIES.map((c) => ({ category: c.slug }));
}

async function loadRaw(slug: string): Promise<unknown | null> {
  try {
    const file = path.join(process.cwd(), 'src/app/fmhy/_data/categories', `${slug}.json`);
    const raw = await fs.readFile(file, 'utf8');
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function asCatalog(raw: unknown): { category: CatalogCategory; fetchedAt: string } | null {
  if (!raw || typeof raw !== 'object') return null;
  const obj = raw as { categories?: CatalogCategory[]; fetchedAt?: string };
  if (!Array.isArray(obj.categories) || !obj.fetchedAt) return null;
  const category = obj.categories[0];
  if (!category) return null;
  return { category, fetchedAt: obj.fetchedAt };
}

function asProse(raw: unknown): ProseDoc | null {
  if (!raw || typeof raw !== 'object') return null;
  const obj = raw as Partial<ProseDoc>;
  if (!obj.doc || !obj.fetchedAt) return null;
  return obj as ProseDoc;
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }) {
  const { category: slug } = await params;
  const meta = categoryBySlug(slug, 'root');
  if (!meta) return { title: 'Not found' };
  return {
    title: `${meta.name} (FMHY mirror), MYTHCORP`,
    description: meta.blurb,
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category: slug } = await params;
  const meta = categoryBySlug(slug, 'root');
  if (!meta) notFound();
  const raw = await loadRaw(slug);
  if (!raw) notFound();

  if (meta.kind === 'prose') {
    const file = asProse(raw);
    if (!file) notFound();
    const { doc, fetchedAt } = file;
    const fetchedDate = new Date(fetchedAt).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
    });
    return (
      <div className="min-h-screen bg-[color:var(--bg)] text-[color:var(--fg)]">
        <SiteHeader tagline="FMHY MIRROR" />
        <main className="mx-auto max-w-3xl px-4 pt-24 pb-16 sm:px-6">
          <nav className="text-xs text-[color:var(--fg-subtle)]">
            <Link href="/fmhy" className="hover:text-[color:var(--accent)]">/fmhy</Link>
            <span className="mx-2">›</span>
            <span className="text-[color:var(--fg-muted)]">{meta.name}</span>
          </nav>
          <div className="mt-6">
            <p className="font-mono text-xs uppercase tracking-[0.4em] text-[color:var(--accent)]">
              [ /FMHY/{meta.slug.toUpperCase()} ]
            </p>
            <h1 className="themed-heading mt-3 flex items-baseline gap-3 text-3xl font-semibold sm:text-4xl">
              <span aria-hidden>{meta.emoji}</span>
              <span>{doc.title}</span>
            </h1>
            {meta.blurb && (
              <p className="mt-2 text-sm text-[color:var(--fg-muted)]">{meta.blurb}</p>
            )}
            <p className="mt-2 font-mono text-[10px] uppercase tracking-widest text-[color:var(--fg-subtle)]">
              snapshot {fetchedDate}
            </p>
          </div>
          <article className="fmhy-prose mt-10" dangerouslySetInnerHTML={{ __html: doc.html }} />
          <footer className="mt-16 border-t border-[color:var(--border)] pt-6 text-xs text-[color:var(--fg-subtle)]">
            Source:{' '}
            <a href={`https://github.com/fmhy/edit/blob/main/docs/${meta.sourceFile}`}
               target="_blank" rel="noreferrer"
               className="text-[color:var(--accent-soft)] underline underline-offset-4">
              docs/{meta.sourceFile}
            </a>
            {' '}on the FMHY edit repo.{' '}
            <Link href="/fmhy" className="ml-2 text-[color:var(--accent)] underline underline-offset-4">
              ← back to /fmhy
            </Link>
          </footer>
        </main>
      </div>
    );
  }

  const data = asCatalog(raw);
  if (!data || data.category.sections.length === 0) notFound();

  const { category, fetchedAt } = data;
  const fetchedDate = new Date(fetchedAt).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  });
  const entryCount = category.sections.reduce((n, s) => n + s.entries.length, 0);

  return (
    <div className="min-h-screen bg-[color:var(--bg)] text-[color:var(--fg)]">
      <SiteHeader tagline="FMHY MIRROR" />

      <main className="mx-auto max-w-3xl px-4 pt-24 pb-16 sm:px-6">
        <nav className="text-xs text-[color:var(--fg-subtle)]">
          <Link href="/fmhy" className="hover:text-[color:var(--accent)]">/fmhy</Link>
          <span className="mx-2">›</span>
          <span className="text-[color:var(--fg-muted)]">{meta.name}</span>
        </nav>

        <div className="mt-6">
          <p className="font-mono text-xs uppercase tracking-[0.4em] text-[color:var(--accent)]">
            [ /FMHY/{meta.slug.toUpperCase()} ]
          </p>
          <h1 className="themed-heading mt-3 flex items-baseline gap-3 text-3xl font-semibold sm:text-4xl">
            <span aria-hidden>{meta.emoji}</span>
            <span>{meta.name}</span>
          </h1>
          <p className="mt-2 text-sm text-[color:var(--fg-muted)]">{meta.blurb}</p>
          <p className="mt-2 font-mono text-[10px] uppercase tracking-widest text-[color:var(--fg-subtle)]">
            {category.sections.length} sections, {entryCount} entries, snapshot {fetchedDate}
          </p>
        </div>

        <SectionList sections={category.sections} />

        <footer className="mt-16 border-t border-[color:var(--border)] pt-6 text-xs text-[color:var(--fg-subtle)]">
          Source:{' '}
          <a href={`https://github.com/fmhy/edit/blob/main/docs/${meta.sourceFile}`}
             target="_blank" rel="noreferrer"
             className="text-[color:var(--accent-soft)] underline underline-offset-4">
            docs/{meta.sourceFile}
          </a>
          {' '}on the FMHY edit repo.{' '}
          <Link href="/fmhy" className="ml-2 text-[color:var(--accent)] underline underline-offset-4">
            ← back to /fmhy
          </Link>
        </footer>
      </main>
    </div>
  );
}

function SectionList({ sections }: { sections: CatalogCategory['sections'] }) {
  let lastHeading: string | null = null;
  return (
    <div className="mt-10 space-y-10">
      {sections.map((section, i) => {
        const showHeading = section.heading !== lastHeading;
        lastHeading = section.heading;
        return (
          <section key={i}>
            {showHeading && (
              <h2 className="themed-heading text-xl font-semibold text-[color:var(--fg)] sm:text-2xl">
                {section.heading}
              </h2>
            )}
            {section.subheading && (
              <h3 className="mt-3 font-mono text-xs uppercase tracking-widest text-[color:var(--accent-soft)]">
                {section.subheading}
              </h3>
            )}
            <ul className="mt-2 divide-y divide-[color:var(--border)]">
              {section.entries.map((entry, j) => (
                <EntryRow key={j} entry={entry} />
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
