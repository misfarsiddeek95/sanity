import { staticMeta } from "@/lib/page-meta";
import { Complaints } from "@/views/Legal";

export const metadata = staticMeta("/complaints");

export default function Page() {
  return <Complaints />;
}
