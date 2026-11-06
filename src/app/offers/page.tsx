import { staticMeta } from "@/lib/page-meta";
import { Offers } from "@/views/Catalog";

export const metadata = staticMeta("/offers");

export default function Page() {
  return <Offers />;
}
