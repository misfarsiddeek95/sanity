import { staticMeta } from "@/lib/page-meta";
import { ProfilePage } from "@/views/Account";

export const metadata = staticMeta("/account");

export default function Page() {
  return <ProfilePage />;
}
