import { staticMeta } from "@/lib/page-meta";
import { ReviewPolicy } from "@/views/Legal";

export const metadata = staticMeta("/review-policy");

export default function Page() {
  return <ReviewPolicy />;
}
