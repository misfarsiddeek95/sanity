import { staticMeta } from "@/lib/page-meta";
import { Cookies } from "@/views/Legal";

export const metadata = staticMeta("/cookies");

export default function Page() {
  return <Cookies />;
}
