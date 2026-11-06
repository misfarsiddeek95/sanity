import { staticMeta } from "@/lib/page-meta";
import { Accessibility } from "@/views/Legal";

export const metadata = staticMeta("/accessibility");

export default function Page() {
  return <Accessibility />;
}
