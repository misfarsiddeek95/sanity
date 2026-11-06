import { NotFound } from "@/views/Catalog";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({ title: "Page not found", description: "The page you're looking for doesn't exist. Browse our bestsellers, brands and gift sets.", path: "/404", noindex: true });

export default function NotFoundPage() {
  return <NotFound />;
}
