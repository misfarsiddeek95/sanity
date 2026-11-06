import { staticMeta } from "@/lib/page-meta";
import { Terms } from "@/views/Legal";

export const metadata = staticMeta("/terms");

export default function Page() {
  return <Terms />;
}
