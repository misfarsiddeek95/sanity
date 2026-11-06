import { staticMeta } from "@/lib/page-meta";
import { OrdersPage } from "@/views/Account";

export const metadata = staticMeta("/account/orders");

export default function Page() {
  return <OrdersPage />;
}
