import { staticMeta } from "@/lib/page-meta";
import { CommunicationPreferences } from "@/views/Legal";

export const metadata = staticMeta("/communication-preferences");

export default function Page() {
  return <CommunicationPreferences />;
}
