import { staticMeta } from "@/lib/page-meta";
import { Disclaimer } from "@/views/Legal";

export const metadata = staticMeta("/disclaimer");

export default function Page() {
  return <Disclaimer />;
}
