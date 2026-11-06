import { JsonLd } from "@/components/JsonLd";
import { staticMeta } from "@/lib/page-meta";
import { guidesIndexLd } from "@/lib/schema";
import { GuidesIndex } from "@/views/Guides";

export const metadata = staticMeta("/guides");

export default function Page() {
  return (
    <>
      <JsonLd data={guidesIndexLd()} />
      <GuidesIndex />
    </>
  );
}
