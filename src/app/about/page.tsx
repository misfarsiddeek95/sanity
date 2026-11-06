import { staticMeta } from "@/lib/page-meta";
import { About } from "@/views/Info";

export const metadata = staticMeta("/about");

export default function Page() {
  return <About />;
}
