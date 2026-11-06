import { staticMeta } from "@/lib/page-meta";
import Component from "@/views/Cart";

export const metadata = staticMeta("/cart");

export default function Page() {
  return <Component />;
}
