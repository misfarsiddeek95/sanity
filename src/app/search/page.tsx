import { Suspense } from "react";
import { staticMeta } from "@/lib/page-meta";
import { SearchPage } from "@/views/Catalog";

export const metadata = staticMeta("/search");

export default function Page() {
  return <Suspense fallback={<div className="min-h-[60vh]" />}><SearchPage /></Suspense>;
}
