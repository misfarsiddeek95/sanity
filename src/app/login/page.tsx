import { staticMeta } from "@/lib/page-meta";
import { LoginPage } from "@/views/Account";

export const metadata = staticMeta("/login");

export default function Page() {
  return <LoginPage />;
}
