-- Exchange-partner escrow ledger (PRD §11.3).
-- GrahmOS NEVER holds funds: the licensed partner (Stripe / Escrow.com) does.
-- This table is the instruction + audit ledger the agent layer operates on —
-- every hold/release/refund instruction and its outcome is appended to `timeline`.

CREATE TABLE IF NOT EXISTS escrows (
  id            TEXT PRIMARY KEY,                 -- esc_xxxxxx
  provider      TEXT NOT NULL DEFAULT 'stripe',   -- stripe | escrow_com | demo
  rail          TEXT NOT NULL DEFAULT 'fiat',     -- fiat | usdc
  status        TEXT NOT NULL DEFAULT 'pending',  -- pending | held | released | refunded | failed
  amount_cents  BIGINT NOT NULL,
  currency      TEXT NOT NULL DEFAULT 'usd',
  buyer_email   TEXT,
  tenant        TEXT NOT NULL,                    -- merchant / storefront the funds are destined for
  product_id    TEXT,
  product_name  TEXT,
  quote_id      TEXT,
  provider_ref  TEXT,                             -- Stripe session/payment_intent id, Escrow.com transaction id
  timeline      JSONB NOT NULL DEFAULT '[]'::jsonb,  -- [{at, actor, action, note}]
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_escrows_status ON escrows (status);
CREATE INDEX IF NOT EXISTS idx_escrows_created_at ON escrows (created_at DESC);
