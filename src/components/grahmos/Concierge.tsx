import { useEffect, useRef, useState } from "react";
import { Send, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import GrandmaPicker from "@/components/grahmos/GrandmaPicker";
import { askConcierge } from "@/lib/api";
import {
  GRANDMA_CHANGED_EVENT,
  loadChosenGrandma,
  openGrandmaPicker,
  useGrandma,
} from "@/lib/grandmothers";
import { cn } from "@/lib/utils";

interface Msg {
  role: "user" | "assistant";
  content: string;
}

const PROMPTS = [
  "I need 500 units for my business",
  "Find wholesale packaging suppliers",
  "Lease a storefront in the mall",
];

/** Floating white-glove concierge — drops onto any page. `surface` tags the
 *  current context so the agent can tailor routing. The launcher is the
 *  user's grandmother guide: the persona skin of this single concierge. */
export default function Concierge({ surface }: { surface?: string }) {
  const grandma = useGrandma();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>(() => [
    { role: "assistant", content: grandma.greeting },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  // First-run: when an open is requested with no stored grandma, the picker
  // goes first and this flag opens the chat once she's chosen.
  const pendingOpenRef = useRef(false);

  function requestOpen() {
    if (!loadChosenGrandma()) {
      pendingOpenRef.current = true;
      openGrandmaPicker();
      return;
    }
    setOpen(true);
  }

  // Allow other surfaces (e.g. the landing hero) to pop the widget open and
  // optionally pre-fill the visitor's intent: window.dispatchEvent(
  //   new CustomEvent("grahmos:open-concierge", { detail: { intent } }))
  useEffect(() => {
    const onOpen = (e: Event) => {
      const intent = (e as CustomEvent<{ intent?: string }>).detail?.intent;
      if (intent) setInput(intent);
      if (!loadChosenGrandma()) {
        pendingOpenRef.current = true;
        openGrandmaPicker();
        return;
      }
      setOpen(true);
    };
    const onGrandmaChanged = () => {
      if (pendingOpenRef.current) {
        pendingOpenRef.current = false;
        setOpen(true);
      }
    };
    window.addEventListener("grahmos:open-concierge", onOpen);
    window.addEventListener(GRANDMA_CHANGED_EVENT, onGrandmaChanged);
    return () => {
      window.removeEventListener("grahmos:open-concierge", onOpen);
      window.removeEventListener(GRANDMA_CHANGED_EVENT, onGrandmaChanged);
    };
  }, []);

  // New grandma, fresh greeting — but never rewrite a conversation in progress.
  useEffect(() => {
    setMessages((m) =>
      m.length <= 1 ? [{ role: "assistant", content: grandma.greeting }] : m
    );
  }, [grandma.id, grandma.greeting]);

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
      // next[0] is always her greeting — keep it out of the model transcript.
      const { reply } = await askConcierge(next.slice(1), surface, {
        name: grandma.name,
        style: grandma.style,
      });
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
    <div className="grahmos-theme fixed bottom-5 right-5 z-[60] flex flex-col items-end">
      {open && (
        <div className="mb-3 flex h-[30rem] w-[22rem] flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
          {/* Header */}
          <div className="flex items-center gap-3 bg-gradient-to-r from-grahmos-purple-deep to-grahmos-purple px-4 py-3 text-white">
            <span
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-lg"
              style={{
                backgroundColor: `${grandma.accentColor}33`,
                boxShadow: `inset 0 0 0 1.5px ${grandma.accentColor}`,
              }}
            >
              {grandma.emoji}
            </span>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-bold leading-tight">{grandma.name}</div>
              <div className="truncate text-[11px] text-white/70">
                “{grandma.tagline}” · GrahmOS Concierge
              </div>
            </div>
            <button
              onClick={() => openGrandmaPicker()}
              className="rounded-md px-1.5 py-1 text-[11px] font-semibold text-white/80 hover:bg-white/10 hover:text-white"
              title="Switch your guide"
            >
              Switch
            </button>
            <button onClick={() => setOpen(false)} className="rounded-md bg-transparent p-1 hover:bg-white/10">
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto bg-grahmos-cream/40 p-4">
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
              placeholder={`Ask ${grandma.shortName} anything…`}
              className="h-10 flex-1 text-sm"
            />
            <Button type="submit" size="icon" disabled={loading || !input.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      )}

      {/* Launcher — her orb */}
      <style>{`
        @keyframes grahmos-orb-pulse {
          0% { transform: scale(1); opacity: 0.5; }
          70%, 100% { transform: scale(1.5); opacity: 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          .grahmos-orb-ring { animation: none !important; opacity: 0; }
        }
      `}</style>
      <button
        onClick={() => (open ? setOpen(false) : requestOpen())}
        aria-label={`Ask ${grandma.shortName}`}
        className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-grahmos-purple-deep to-grahmos-purple text-2xl shadow-xl transition-transform hover:scale-105"
      >
        <span
          aria-hidden
          className="grahmos-orb-ring pointer-events-none absolute inset-0 rounded-full"
          style={{
            border: `2px solid ${grandma.accentColor}`,
            animation: "grahmos-orb-pulse 2.4s ease-out infinite",
          }}
        />
        <span aria-hidden>{grandma.emoji}</span>
        <span
          aria-hidden
          className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full text-[10px] text-white shadow"
          style={{ backgroundColor: grandma.accentColor }}
        >
          ✦
        </span>
        {!open && (
          <span className="pointer-events-none absolute right-full top-1/2 mr-3 hidden -translate-y-1/2 whitespace-nowrap rounded-lg bg-grahmos-ink/90 px-2.5 py-1 text-xs font-semibold text-white group-hover:block">
            Ask {grandma.shortName}
          </span>
        )}
      </button>

      <GrandmaPicker />
    </div>
  );
}
