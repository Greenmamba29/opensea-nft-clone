import type { Config, Context } from "@netlify/functions";
import Anthropic from "@anthropic-ai/sdk";

import { authenticate, json } from "./_auth";

/**
 * Accio white-glove concierge — the agent-assisted layer.
 *
 * POST /api/concierge  { messages: [{role, content}], surface?: string }
 *
 * Powered by Claude (claude-opus-4-8). Falls back to a deterministic canned
 * reply when ANTHROPIC_API_KEY is not configured, so the UI works in any env.
 */

const SYSTEM = `You are the Accio Concierge — the white-glove AI commerce agent for Accio,
a premium virtual mall where brands rent, lease, or own digital storefronts and
buyers shop across B2C, D2C, and B2B with human + AI agent support.

Your job: greet warmly, understand intent, and route to the right action —
product discovery, B2B sourcing, bulk quotes, storefront leasing, or order
support. Be concise (2-4 sentences), specific, and never leave a dead end: if
you can't fully resolve something, offer to open a sourcing request, create a
quote, or connect a human success manager. Currencies are flexible (card, ACH,
net terms, stablecoin). Never invent order numbers or prices — ask or hand off.`;

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

function cannedReply(messages: ChatMessage[]): string {
  const userMsgs = messages.filter((m) => m.role === "user");
  const last = (userMsgs.length ? userMsgs[userMsgs.length - 1].content : "").toLowerCase();
  if (last.includes("quote") || last.includes("bulk") || /\d{3,}/.test(last)) {
    return "I can help with that. Tell me the product and quantity, and I'll open a B2B quote and route it to our sourcing agents for verified pricing — usually back within 24 hours.";
  }
  if (last.includes("storefront") || last.includes("lease") || last.includes("rent") || last.includes("sell")) {
    return "Wonderful — Accio offers Pop-Up, Starter, Premium, and Anchor storefronts. Tell me your category and goals and I'll match you with a leasing concierge to secure your placement.";
  }
  if (last.includes("source") || last.includes("supplier") || last.includes("find")) {
    return "I'll put our sourcing desk on it. Share what you're looking for (specs, quantity, timeline) and I'll match verified partners in the Accio network — no dead ends.";
  }
  return "Hi! I'm your Accio Concierge. I can help you find suppliers, compare quotes, source products, or lease the perfect storefront. What are you working on today?";
}

export default async (req: Request, _context: Context) => {
  // Concierge is open to any signed-in user; anonymous gets the canned greeter.
  const user = await authenticate(req);

  let body: { messages?: ChatMessage[]; surface?: string } = {};
  try {
    body = await req.json();
  } catch {
    return json({ error: "invalid_json" }, 400);
  }
  const messages = (body.messages ?? []).filter(
    (m) => (m.role === "user" || m.role === "assistant") && typeof m.content === "string"
  );
  if (messages.length === 0) {
    return json({ reply: cannedReply([]), source: "canned" });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return json({ reply: cannedReply(messages), source: "canned", demo: true });
  }

  try {
    const client = new Anthropic({ apiKey });
    const surfaceNote = body.surface ? `\n\nThe buyer is currently on the "${body.surface}" surface of Accio.` : "";
    const response = await client.messages.create({
      model: "claude-opus-4-8",
      max_tokens: 1024,
      system: SYSTEM + surfaceNote,
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
    });
    const text = response.content.find((b) => b.type === "text");
    return json({
      reply: text && text.type === "text" ? text.text : cannedReply(messages),
      source: "claude",
      role: user?.role ?? "guest",
    });
  } catch (err) {
    // Never dead-end the buyer — degrade to the canned concierge.
    return json({ reply: cannedReply(messages), source: "fallback" });
  }
};

export const config: Config = { path: "/api/concierge" };
