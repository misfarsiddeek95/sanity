import { JsonLd } from "@/components/JsonLd";
import { FAQS } from "@/data/faq";
import { staticMeta } from "@/lib/page-meta";
import { faqLd, websiteLd } from "@/lib/schema";
import Home from "@/views/Home";

export const metadata = staticMeta("/");

export default function Page() {
  return (
    <>
      <JsonLd data={[faqLd(FAQS.slice(0, 6)), websiteLd()]} />
      <Home />
    </>
  );
}
