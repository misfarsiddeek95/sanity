import { staticMeta } from "@/lib/page-meta";
import { NewArrivals } from "@/views/Catalog";

export const metadata = staticMeta("/new");

export default function Page() {
  return <NewArrivals />;
}
