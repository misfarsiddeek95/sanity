import { JsonLd } from "@/components/JsonLd";
import { FAQS } from "@/data/faq";
import { staticMeta } from "@/lib/page-meta";
import { faqLd } from "@/lib/schema";
import { FAQ } from "@/views/Info";

export const metadata = staticMeta("/faq");

export default function Page() {
  return (
    <>
      <JsonLd data={faqLd(FAQS)} />
      <FAQ />
    </>
  );
}
