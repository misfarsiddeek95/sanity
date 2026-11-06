import { notFound } from "next/navigation";
import { Suspense } from "react";
import Docs from "@/views/Docs";

export const metadata = { title: "Design documentation", robots: { index: false, follow: false } };

/** Internal design notes: available in development only, hidden in production. */
export default function Page() {
  if (process.env.NODE_ENV === "production") notFound();
  return <Suspense fallback={null}><Docs /></Suspense>;
}
