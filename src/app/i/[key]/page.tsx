import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/app/components/SiteHeader";
import { getObjectRecord, isEmbedAccent } from "@/lib/upload/objects";
import { publicUrl } from "@/lib/upload/r2";

export const dynamic = "force-dynamic";
type PageProps = { params: Promise<{ key: string }> };
function titleFor(key: string): string { return `MYTHCORP asset ${key}`; }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { key } = await params;
  const record = await getObjectRecord(key);
  if (!record) return { title: "Asset not found", robots: { index: false, follow: false } };
  const image = publicUrl(record.key);
  const title = record.embed?.title || titleFor(record.key);
  const description = record.embed?.description || "A public image asset from the MYTHCORP ingest terminal.";
  const accent = record.embed?.accent && isEmbedAccent(record.embed.accent) ? record.embed.accent : undefined;
  return { title, description, ...(accent ? { other: { "theme-color": accent } } : {}), openGraph: { title, description, type: "website", images: [{ url: image, type: record.type }] }, twitter: { card: "summary_large_image", title, description, images: [image] } };
}

export default async function ImageViewPage({ params }: PageProps) {
  const { key } = await params;
  const record = await getObjectRecord(key);
  if (!record) notFound();
  const image = publicUrl(record.key);
  return <div className="min-h-screen bg-[color:var(--bg)] text-[color:var(--fg)]"><SiteHeader /><main className="mx-auto max-w-4xl px-6 pt-28 pb-16"><p className="mb-3 font-mono text-xs uppercase tracking-[0.4em] text-[color:var(--accent)]">[ public / asset ]</p><h1 className="themed-heading mb-3 text-3xl md:text-5xl">{record.embed?.title || titleFor(record.key)}</h1><p className="mb-8 font-mono text-xs text-[color:var(--fg-muted)]">{record.type.toUpperCase()} / {formatBytes(record.size)} / {new Date(record.uploadedAt).toLocaleDateString("en-US")}</p><figure className="themed-surface overflow-hidden p-3"><img src={image} alt={record.embed?.title || titleFor(record.key)} className="max-h-[70vh] w-full object-contain" /></figure><div className="mt-5 flex flex-wrap items-center gap-3 font-mono text-xs"><span className="text-[color:var(--fg-subtle)]">Direct public link</span><a href={image} target="_blank" rel="noopener noreferrer" className="break-all text-[color:var(--accent)] hover:underline">{image}</a></div></main></div>;
}
function formatBytes(bytes: number): string { return bytes < 1048576 ? `${Math.max(1, Math.round(bytes / 1024))} KB` : `${(bytes / 1048576).toFixed(1)} MB`; }

