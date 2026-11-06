import { staticMeta } from "@/lib/page-meta";
import { Delivery } from "@/views/Info";

export const metadata = staticMeta("/delivery");

export default function Page() {
  return <Delivery />;
}
