import { useEffect, useRef, useState } from "react";
import { Headset, Send, Sparkles, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { askConcierge } from "@/lib/api";
import { cn } from "@/lib/utils";

interface Msg {
  role: "user" | "assistant";
  content: string;
}

const GREETING: Msg = {
  role: "assistant",
  content:
    "Hi! I'm your Accio Concierge. I can help you find suppliers, compare quotes, source products, or lease the perfect storefront. What are you working on today?",
};

const PROMPTS = [
  "I need 500 units for my business",
  "Find wholesale packaging suppliers",
  "Lease a storefront in the mall",
];

/** Floating white-glove concierge — drops onto any page. `surface` tags the
 *  current context so the agent can tailor routing. */
export default function Concierge({ surface }: { surface?: string }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([GREETING]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    const next = [...messages, { role: "user" as const, content: trimmed }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const { reply } = await askConcierge(
        next.filter((m) => m !== GREETING),
        surface
      );
      setMessages((m) => [...m, { role: "assistant", content: reply }]);
    } catch {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content:
            "I'm having trouble reaching the network right now — but I don't want to leave you stuck. Try again, or I can open a sourcing request and have a human success manager follow up.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="accio-theme fixed bottom-5 right-5 z-[60] flex flex-col items-end">
      {open && (
        <div className="mb-3 flex h-[30rem] w-[22rem] flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
          {/* Header */}
          <div className="flex items-center gap-3 bg-gradient-to-r from-accio-purple-deep to-accio-purple px-4 py-3 text-white">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15">
              <Sparkles className="h-4 w-4 text-accio-gold-light" />
            </span>
            <div className="flex-1">
              <div className="text-sm font-bold leading-tight">Accio Concierge</div>
              <div className="text-[11px] text-white/70">
                <span className="text-emerald-300">●</span> White-glove · Human + AI
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="rounded-md bg-transparent p-1 hover:bg-white/10">
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto bg-accio-cream/40 p-4">
            {messages.map((m, i) => (
              <div
                key={i}
                className={cn(
                  "max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm",
                  m.role === "user"
                    ? "ml-auto rounded-br-sm bg-primary text-primary-foreground"
                    : "rounded-bl-sm bg-card text-foreground shadow-sm"
                )}
              >
                {m.content}
              </div>
            ))}
            {loading && (
              <div className="flex max-w-[85%] gap-1 rounded-2xl rounded-bl-sm bg-card px-4 py-3 shadow-sm">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground/60"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
            )}
            {messages.length === 1 && (
              <div className="space-y-1.5 pt-1">
                {PROMPTS.map((p) => (
                  <button
                    key={p}
                    onClick={() => send(p)}
                    className="block w-full rounded-lg border border-border bg-card px-3 py-2 text-left text-xs font-medium text-primary shadow-sm transition-colors hover:bg-secondary"
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex items-center gap-2 border-t border-border bg-card p-3"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything…"
              className="h-10 flex-1 text-sm"
            />
            <Button type="submit" size="icon" disabled={loading || !input.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      )}

      {/* Launcher */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex h-14 items-center gap-2.5 rounded-full bg-gradient-to-r from-accio-purple-deep to-accio-purple px-5 text-white shadow-xl transition-transform hover:scale-105"
      >
        <Headset className="h-5 w-5" />
        {!open && <span className="text-sm font-semibold">Ask Concierge</span>}
      </button>
    </div>
  );
}
