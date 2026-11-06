import { staticMeta } from "@/lib/page-meta";
import { ShopAll } from "@/views/Catalog";

export const metadata = staticMeta("/shop");

export default function Page() {
  return <ShopAll />;
}
