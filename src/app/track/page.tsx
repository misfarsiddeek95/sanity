import { Suspense } from "react";
import { staticMeta } from "@/lib/page-meta";
import { TrackPage } from "@/views/Orders";

export const metadata = staticMeta("/track");

export default function Page() {
  return <Suspense fallback={<div className="min-h-[60vh]" />}><TrackPage /></Suspense>;
}
