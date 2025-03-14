-- Create vendor contracts table
CREATE TABLE IF NOT EXISTS vendor_contracts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  signed_date DATE,
  expiration_date DATE,
  status TEXT NOT NULL CHECK (status IN ('draft', 'pending', 'active', 'expired', 'cancelled')),
  key_terms JSONB,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable row level security
ALTER TABLE vendor_contracts ENABLE ROW LEVEL SECURITY;

-- Add to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE vendor_contracts;
