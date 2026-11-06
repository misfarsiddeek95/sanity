import { staticMeta } from "@/lib/page-meta";
import { ComparePage } from "@/views/Product";

export const metadata = staticMeta("/compare");

export default function Page() {
  return <ComparePage />;
}
