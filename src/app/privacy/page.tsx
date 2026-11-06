import { staticMeta } from "@/lib/page-meta";
import { Privacy } from "@/views/Legal";

export const metadata = staticMeta("/privacy");

export default function Page() {
  return <Privacy />;
}
