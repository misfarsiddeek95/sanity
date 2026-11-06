import type { Metadata } from "next";
import { orderMeta } from "@/lib/page-meta";
import { OrderConfirmation } from "@/views/Orders";

type Props = { params: Promise<{ id: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return orderMeta((await params).id);
}

/** Orders live in the visitor's browser (no backend yet), so this page renders on demand and is never indexed. */
export default async function Page({ params }: Props) {
  return <OrderConfirmation id={(await params).id} />;
}
