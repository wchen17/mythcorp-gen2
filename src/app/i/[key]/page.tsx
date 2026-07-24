import { permanentRedirect } from "next/navigation";
import { objectId } from "@/lib/upload/ids";

export const dynamic = "force-dynamic";

// Legacy view route. `/i/<key>.png` served HTML, which fights the convention
// every long-standing image host follows: an `i` host plus a file extension
// means raw bytes. The page now lives at `/a/<id>` with no extension, and this
// 308 keeps links that were already shared working.
export default async function LegacyImageView({ params }: { params: Promise<{ key: string }> }) {
  const { key } = await params;
  permanentRedirect(`/a/${objectId(key)}`);
}
