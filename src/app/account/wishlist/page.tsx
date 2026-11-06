import { staticMeta } from "@/lib/page-meta";
import { WishlistPage } from "@/views/Account";

export const metadata = staticMeta("/account/wishlist");

export default function Page() {
  return <WishlistPage />;
}
