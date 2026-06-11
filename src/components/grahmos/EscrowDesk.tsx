import { useEffect, useState } from "react";
import { ShieldCheck, ArrowRight, RotateCcw, Lock } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { listEscrows, instructEscrow, type EscrowRecord, type EscrowStatus } from "@/lib/api";

const STATUS_VARIANT: Record<EscrowStatus, "secondary" | "warning" | "success" | "destructive"> = {
  pending: "secondary",
  held: "warning",
  released: "success",
  refunded: "destructive",
  failed: "destructive",
};

const money = (cents: number, ccy: string) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: ccy || "USD" }).format(cents / 100);

/**
 * The Escrow Desk (PRD §11.3) — the agent's money-instruction surface.
 * GrahmOS never holds funds: the operator only issues hold/release/refund
 * instructions; the licensed partner moves the money. Operator/agent only.
 */
export default function EscrowDesk() {
  const [rows, setRows] = useState<EscrowRecord[] | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  async function refresh() {
    try {
      const { escrows } = await listEscrows();
      setRows(escrows);
    } catch {
      setRows([]);
    }
  }
  useEffect(() => {
    refresh();
  }, []);

  async function instruct(id: string, action: "release" | "refund" | "simulate_hold") {
    setBusy(id + action);
    setErr(null);
    try {
      const res = await instructEscrow(id, action);
      if ("error" in res) setErr(res.error);
      else await refresh();
    } catch {
      setErr("Instruction failed — partner unreachable.");
    } finally {
      setBusy(null);
    }
  }

  const held = rows?.filter((r) => r.status === "held").length ?? 0;

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-primary" /> Escrow Desk
        </CardTitle>
        <span className="text-xs text-muted-foreground">
          {held > 0 ? `${held} awaiting your instruction` : "partner-held funds"}
        </span>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <Lock className="h-3 w-3" /> GrahmOS never holds funds — you instruct the partner to release or refund.
        </p>
        {err && <p className="text-sm text-destructive">{err}</p>}

        {rows === null ? (
          <p className="text-sm text-muted-foreground">Loading escrows…</p>
        ) : rows.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No escrows yet. A buyer checkout opens one here for hold → release/refund.
          </p>
        ) : (
          <div className="space-y-2">
            {rows.slice(0, 8).map((e) => (
              <div key={e.id} className="rounded-xl border border-border p-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="text-sm font-semibold">
                      {e.productName ?? `Purchase from ${e.tenant}`}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {money(e.amountCents, e.currency)} · {e.tenant} ·{" "}
                      <span className="uppercase">{e.provider}</span>/{e.rail}
                    </div>
                  </div>
                  <Badge variant={STATUS_VARIANT[e.status]}>{e.status}</Badge>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {e.status === "pending" && (
                    <Button size="sm" variant="outline" disabled={busy === e.id + "simulate_hold"}
                      onClick={() => instruct(e.id, "simulate_hold")}>
                      Simulate partner hold
                    </Button>
                  )}
                  {e.status === "held" && (
                    <>
                      <Button size="sm" disabled={busy === e.id + "release"}
                        onClick={() => instruct(e.id, "release")}>
                        <ArrowRight className="h-3.5 w-3.5" /> Release to {e.tenant.split(" ")[0]}
                      </Button>
                      <Button size="sm" variant="outline" disabled={busy === e.id + "refund"}
                        onClick={() => instruct(e.id, "refund")}>
                        <RotateCcw className="h-3.5 w-3.5" /> Refund buyer
                      </Button>
                    </>
                  )}
                  {(e.status === "released" || e.status === "refunded") && (
                    <span className="text-xs text-muted-foreground">
                      {e.timeline.length} ledger entries · final
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
