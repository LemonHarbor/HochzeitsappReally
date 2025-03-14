-- Create vendor appointments table
CREATE TABLE IF NOT EXISTS vendor_appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  location TEXT,
  status TEXT NOT NULL DEFAULT 'scheduled',
  notes TEXT,
  reminder_sent BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE vendor_appointments;

-- Create index for faster vendor-based queries
CREATE INDEX IF NOT EXISTS idx_vendor_appointments_vendor_id ON vendor_appointments(vendor_id);

-- Create index for date-based queries
CREATE INDEX IF NOT EXISTS idx_vendor_appointments_start_time ON vendor_appointments(start_time);
