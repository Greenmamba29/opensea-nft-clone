-- GrahmOS Marketplace - NEON Postgres Schema

-- Marketplaces Table (The 20 Verticals)
CREATE TABLE marketplaces (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    icon TEXT,
    description TEXT,
    vertical TEXT NOT NULL, -- MRO, Chemicals, Medical, etc.
    gmv_ytd NUMERIC(15, 2) DEFAULT 0,
    aov_target NUMERIC(10, 2),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Suppliers Table
CREATE TABLE suppliers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    company_reg_number TEXT,
    address JSONB,
    rating NUMERIC(3, 2),
    loyalty_points INTEGER DEFAULT 0,
    stripe_account_id TEXT,
    status TEXT DEFAULT 'pending', -- pending, verified, suspended
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Products Table (Synced with Airtable)
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    marketplace_id UUID REFERENCES marketplaces(id),
    supplier_id UUID REFERENCES suppliers(id),
    name TEXT NOT NULL,
    sku TEXT UNIQUE NOT NULL,
    description TEXT,
    price_per_unit NUMERIC(12, 2) NOT NULL,
    unit_type TEXT NOT NULL, -- metric ton, unit, box, etc.
    stock_level INTEGER DEFAULT 0,
    category TEXT,
    airtable_id TEXT UNIQUE, -- Connection to Airtable automation
    status TEXT DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Buyers Table
CREATE TABLE buyers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_name TEXT NOT NULL,
    contact_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    address JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- RFQ (Request for Quote) Table
CREATE TABLE rfqs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    buyer_id UUID REFERENCES buyers(id),
    product_id UUID REFERENCES products(id),
    quantity INTEGER NOT NULL,
    target_price NUMERIC(12, 2),
    offered_price NUMERIC(12, 2),
    status TEXT DEFAULT 'open', -- open, quoted, accepted, rejected, ordered
    shipment_details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Orders Table
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    rfq_id UUID REFERENCES rfqs(id),
    total_amount NUMERIC(12, 2) NOT NULL,
    stripe_payment_id TEXT,
    payment_status TEXT DEFAULT 'pending',
    shipping_status TEXT DEFAULT 'processing',
    paperwork_url TEXT, -- Link to generated PDF invoices/compliance
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
