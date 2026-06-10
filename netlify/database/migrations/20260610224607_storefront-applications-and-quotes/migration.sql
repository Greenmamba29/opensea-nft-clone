-- Persistence for storefront applications and B2B quotes.
-- Applied automatically by the Netlify deploy (preview branch, then production).

CREATE TABLE IF NOT EXISTS storefront_applications (
  id            TEXT PRIMARY KEY,
  merchant      TEXT NOT NULL,
  category      TEXT NOT NULL,
  store_type    TEXT NOT NULL DEFAULT 'Retail Store',
  tier          TEXT NOT NULL DEFAULT 'rent',
  contact_email TEXT,
  notes         TEXT,
  status        TEXT NOT NULL DEFAULT 'new',
  assigned_agent TEXT NOT NULL DEFAULT 'Unassigned',
  monthly_lease NUMERIC(10, 2) NOT NULL DEFAULT 59,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_storefront_applications_created_at
  ON storefront_applications (created_at DESC);

CREATE TABLE IF NOT EXISTS quotes (
  id         TEXT PRIMARY KEY,
  buyer      TEXT NOT NULL,
  company    TEXT NOT NULL DEFAULT '-',
  items      JSONB NOT NULL DEFAULT '[]'::jsonb,
  request    JSONB,
  status     TEXT NOT NULL DEFAULT 'submitted',
  total      NUMERIC(12, 2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_quotes_created_at
  ON quotes (created_at DESC);
