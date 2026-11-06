import { staticMeta } from "@/lib/page-meta";
import { Contact } from "@/views/Info";

export const metadata = staticMeta("/contact");

export default function Page() {
  return <Contact />;
}
