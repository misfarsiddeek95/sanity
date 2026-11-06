import { llmsFull } from "@/lib/feeds";

export const dynamic = "force-static";
export const GET = () => new Response(llmsFull(), { headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=3600" } });
