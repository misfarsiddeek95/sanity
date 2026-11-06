import { staticMeta } from "@/lib/page-meta";
import Component from "@/views/Gifts";

export const metadata = staticMeta("/gifts");

export default function Page() {
  return <Component />;
}
