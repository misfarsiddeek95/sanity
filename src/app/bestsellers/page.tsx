import { staticMeta } from "@/lib/page-meta";
import { Bestsellers } from "@/views/Catalog";

export const metadata = staticMeta("/bestsellers");

export default function Page() {
  return <Bestsellers />;
}
