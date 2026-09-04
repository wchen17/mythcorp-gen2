import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/app/components/SiteHeader";
import { resolveDeleteToken } from "@/lib/upload/objects";
import { publicUrl } from "@/lib/upload/r2";
import { DeleteConfirm } from "./DeleteConfirm";

export const dynamic = "force-dynamic";
type PageProps = { params: Promise<{ token: string }> };

export const metadata: Metadata = {
  title: "Delete asset",
  robots: { index: false, follow: false },
};

// Rendering this page is read-only. The delete happens on the POST the button
// fires, never on this GET, because unfurlers and prefetchers load links
// unprompted and a GET-deletes design loses the image to the first preview.
export default async function DeletePage({ params }: PageProps) {
  const { token } = await params;
  const record = await resolveDeleteToken(token);
  if (!record) notFound();
  return (
    <div className="min-h-screen bg-[color:var(--bg)] text-[color:var(--fg)]">
      <SiteHeader />
      <main className="mx-auto max-w-xl px-6 pt-28 pb-16">
        <p className="mb-3 font-mono text-xs uppercase tracking-[0.4em] text-[color:var(--accent-warm)]">[ delete / asset / wip ]</p>
        <h1 className="themed-heading mb-3 text-3xl md:text-4xl">Remove this image?</h1>
        <p className="mb-6 max-w-md text-sm leading-relaxed text-[color:var(--fg-muted)]">
          This deletes the file and its links for good. Anything already embedded elsewhere will stop loading.
        </p>
        <figure className="themed-surface mb-6 overflow-hidden p-3">
          {/* Plain <img>: see the note in /a/[id]. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={publicUrl(record.key)} alt="The image this link deletes" className="max-h-[40vh] w-full object-contain" />
        </figure>
        <DeleteConfirm token={token} />
      </main>
    </div>
  );
}
