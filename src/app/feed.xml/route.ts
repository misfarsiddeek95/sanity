import { guidesRss } from "@/lib/feeds";

export const dynamic = "force-static";
export const GET = () => new Response(guidesRss(), { headers: { "Content-Type": "application/rss+xml; charset=utf-8", "Cache-Control": "public, max-age=3600" } });
