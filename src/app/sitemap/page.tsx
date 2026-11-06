import { staticMeta } from "@/lib/page-meta";
import { SiteMapPage } from "@/views/Guides";

export const metadata = staticMeta("/sitemap");

export default function Page() {
  return <SiteMapPage />;
}
