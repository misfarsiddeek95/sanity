import { staticMeta } from "@/lib/page-meta";
import { BrandsIndex } from "@/views/Catalog";

export const metadata = staticMeta("/brands");

export default function Page() {
  return <BrandsIndex />;
}
