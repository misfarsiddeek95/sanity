import { clean, guard, looksLikeSpam, reply } from "@/lib/server/guard";
import { deliverLead, LeadSchema } from "@/lib/server/leads";
import { rateLimit } from "@/lib/server/rate-limit";

export const dynamic = "force-dynamic";

/** POST /api/lead: newsletter, offer pop-up, gift-finder and back-in-stock requests. Validated, spam-screened, rate-limited. */
export async function POST(req: Request) {
  const g = await guard(req, { key: "lead", max: 5, windowMs: 10 * 60_000 });
  if (!g.ok) return g.res;

  const parsed = LeadSchema.safeParse(g.data);
  if (!parsed.success) return reply(422, { ok: false, error: "invalid" });
  const { website, t, ...lead } = parsed.data;

  // Silent success for bots: honeypot filled, submitted faster than a human can type, or stale/forged timestamp.
  const age = typeof t === "number" ? Date.now() - t : null;
  if (website || age === null || age < 1500 || age > 24 * 3600_000) return reply(202, { ok: true });
  if (looksLikeSpam(lead.name, lead.note, lead.email)) return reply(202, { ok: true });

  // One submission per contact per hour (stops list-bombing someone else's email/phone)
  const contact = clean(lead.email ?? lead.phone ?? "");
  if (!rateLimit(`lead-contact:${contact}`, 1, 60 * 60_000).ok) return reply(202, { ok: true });

  await deliverLead(lead);
  return reply(202, { ok: true });
}

export const GET = () => reply(405, { ok: false, error: "method_not_allowed" }, { Allow: "POST" });
