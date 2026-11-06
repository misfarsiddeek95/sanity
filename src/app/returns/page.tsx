import { staticMeta } from "@/lib/page-meta";
import { Returns } from "@/views/Legal";

export const metadata = staticMeta("/returns");

export default function Page() {
  return <Returns />;
}
