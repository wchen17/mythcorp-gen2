import { notFound } from 'next/navigation';
import { POSTS, categoryBySlug } from '../../_data/categories';
import { renderProse } from '../../_components/ProsePage';

export const dynamic = 'force-static';

export function generateStaticParams() {
  return POSTS.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const meta = categoryBySlug(slug, 'posts');
  if (!meta) return { title: 'Not found' };
  return {
    title: `${meta.name} (FMHY mirror), MYTHCORP`,
    description: meta.blurb,
  };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const meta = categoryBySlug(slug, 'posts');
  if (!meta) notFound();
  return renderProse('posts', slug);
}
