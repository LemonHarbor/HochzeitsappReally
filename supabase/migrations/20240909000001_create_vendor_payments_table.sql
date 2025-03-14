CREATE TABLE IF NOT EXISTS vendor_payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL,
  payment_date DATE,
  due_date DATE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('paid', 'pending', 'cancelled')),
  payment_type TEXT NOT NULL CHECK (payment_type IN ('deposit', 'installment', 'final')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable row-level security
ALTER TABLE vendor_payments ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable read access for all users" ON vendor_payments
  FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users" ON vendor_payments
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users" ON vendor_payments
  FOR UPDATE USING (true);

CREATE POLICY "Enable delete for authenticated users" ON vendor_payments
  FOR DELETE USING (true);

-- Add to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE vendor_payments;
