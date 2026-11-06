import { z } from "zod";
import { clean } from "./guard";

/** Sri Lankan mobile: 07XXXXXXXX, 947XXXXXXXX or +947XXXXXXXX → +947XXXXXXXX */
const phone = z.string().trim().max(20).transform((v) => v.replace(/[\s\-()]/g, "")).refine((v) => /^(?:\+?94|0)7\d{8}$/.test(v), "invalid_phone").transform((v) => `+94${v.slice(-9)}`);

export const LeadSchema = z.object({
  source: z.enum(["gift-finder", "offer-popup", "newsletter", "notify"]),
  name: z.string().trim().max(80).optional().transform((v) => (v ? clean(v) : undefined)),
  phone: phone.optional(),
  email: z.string().trim().toLowerCase().max(120).pipe(z.email()).optional(),
  note: z.string().trim().max(300).optional().transform((v) => (v ? clean(v) : undefined)),
  website: z.string().max(200).optional(), // honeypot: real people never fill this
  t: z.number().int().optional(), // client page-load timestamp (time trap)
}).refine((v) => v.phone || v.email, { message: "contact_required" });

export type LeadInput = z.infer<typeof LeadSchema>;

/**
 * Delivery adapter. The shop has no back office yet, so by default a valid lead is only acknowledged.
 * Set LEAD_WEBHOOK_URL (n8n, Zapier, Make, a Slack/Google-Chat webhook, your CRM) to forward every accepted lead as JSON.
 */
export async function deliverLead(lead: Omit<LeadInput, "website" | "t">) {
  const url = process.env.LEAD_WEBHOOK_URL;
  if (!url) return;
  try {
    await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...lead, at: new Date().toISOString() }), signal: AbortSignal.timeout(5000) });
  } catch {
    console.error("lead webhook failed"); // never log the lead itself (personal data)
  }
}
