import { staticMeta } from "@/lib/page-meta";
import { RegisterPage } from "@/views/Account";

export const metadata = staticMeta("/register");

export default function Page() {
  return <RegisterPage />;
}
