import { promises as fs } from 'node:fs';
import path from 'node:path';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SiteHeader } from '../../components/SiteHeader';
import { categoryBySlug } from '../_data/categories';
import type { Namespace, ProseDoc } from '../_lib/types';

async function loadProse(namespace: Namespace, slug: string): Promise<ProseDoc | null> {
  try {
    const file = path.join(process.cwd(), 'src/app/fmhy/_data/categories', namespace, `${slug}.json`);
    const raw = await fs.readFile(file, 'utf8');
    return JSON.parse(raw) as ProseDoc;
  } catch {
    return null;
  }
}

export async function renderProse(namespace: 'other' | 'posts', slug: string) {
  const meta = categoryBySlug(slug, namespace);
  if (!meta) notFound();
  const file = await loadProse(namespace, slug);
  if (!file) notFound();

  const { doc, fetchedAt } = file;
  const fetchedDate = new Date(fetchedAt).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  });
  const crumbLabel = namespace === 'other' ? 'Other Docs' : 'Posts';

  return (
    <div className="min-h-screen bg-[color:var(--bg)] text-[color:var(--fg)]">
      <SiteHeader tagline="FMHY MIRROR" />

      <main className="mx-auto max-w-3xl px-4 pt-24 pb-16 sm:px-6">
        <nav className="text-xs text-[color:var(--fg-subtle)]">
          <Link href="/fmhy" className="hover:text-[color:var(--accent)]">/fmhy</Link>
          <span className="mx-2">›</span>
          <span className="text-[color:var(--fg-muted)]">{crumbLabel}</span>
          <span className="mx-2">›</span>
          <span className="text-[color:var(--fg-muted)]">{doc.title}</span>
        </nav>

        <div className="mt-6">
          <p className="font-mono text-xs uppercase tracking-[0.4em] text-[color:var(--accent)]">
            [ /FMHY/{namespace.toUpperCase()}/{doc.slug.toUpperCase()} ]
          </p>
          <h1 className="themed-heading mt-3 flex items-baseline gap-3 text-3xl font-semibold sm:text-4xl">
            <span aria-hidden>{meta.emoji}</span>
            <span>{doc.title}</span>
          </h1>
          {doc.description && (
            <p className="mt-2 text-sm text-[color:var(--fg-muted)]">{doc.description}</p>
          )}
          <p className="mt-2 font-mono text-[10px] uppercase tracking-widest text-[color:var(--fg-subtle)]">
            snapshot {fetchedDate}
          </p>
        </div>

        <article
          className="fmhy-prose mt-10"
          dangerouslySetInnerHTML={{ __html: doc.html }}
        />

        <footer className="mt-16 border-t border-[color:var(--border)] pt-6 text-xs text-[color:var(--fg-subtle)]">
          Source:{' '}
          <a href={`https://github.com/fmhy/edit/blob/main/docs/${doc.sourceFile}`}
             target="_blank" rel="noreferrer"
             className="text-[color:var(--accent-soft)] underline underline-offset-4">
            docs/{doc.sourceFile}
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
