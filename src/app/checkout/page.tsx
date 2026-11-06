import { staticMeta } from "@/lib/page-meta";
import Component from "@/views/Checkout";

export const metadata = staticMeta("/checkout");

export default function Page() {
  return <Component />;
}
