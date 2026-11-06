import { staticMeta } from "@/lib/page-meta";
import { DataRequest } from "@/views/Legal";

export const metadata = staticMeta("/data-request");

export default function Page() {
  return <DataRequest />;
}
