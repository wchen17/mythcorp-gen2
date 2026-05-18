import { notFound } from 'next/navigation';
import { OTHER_DOCS, categoryBySlug } from '../../_data/categories';
import { renderProse } from '../../_components/ProsePage';

export const dynamic = 'force-static';

export function generateStaticParams() {
  return OTHER_DOCS.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const meta = categoryBySlug(slug, 'other');
  if (!meta) return { title: 'Not found' };
  return {
    title: `${meta.name} (FMHY mirror), MYTHCORP`,
    description: meta.blurb,
  };
}

export default async function OtherDocPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const meta = categoryBySlug(slug, 'other');
  if (!meta) notFound();
  return renderProse('other', slug);
}
