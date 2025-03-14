-- Update expenses table to properly link to vendors
ALTER TABLE expenses
ADD COLUMN IF NOT EXISTS vendor_id UUID REFERENCES vendors(id) ON DELETE SET NULL;

-- Create index for faster vendor expense lookups
CREATE INDEX IF NOT EXISTS expenses_vendor_id_idx ON expenses(vendor_id);

-- Add realtime publication for expenses
ALTER PUBLICATION supabase_realtime ADD TABLE expenses;
