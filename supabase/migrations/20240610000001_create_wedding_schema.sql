-- Create guests table
CREATE TABLE IF NOT EXISTS guests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  category TEXT NOT NULL,
  rsvp_status TEXT NOT NULL,
  dietary_restrictions TEXT,
  plus_one BOOLEAN DEFAULT FALSE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create tables table
CREATE TABLE IF NOT EXISTS tables (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  shape TEXT NOT NULL,
  capacity INTEGER NOT NULL,
  position JSONB NOT NULL,
  dimensions JSONB NOT NULL,
  rotation INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create seats table
CREATE TABLE IF NOT EXISTS seats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  table_id UUID NOT NULL REFERENCES tables(id) ON DELETE CASCADE,
  guest_id UUID REFERENCES guests(id) ON DELETE SET NULL,
  position JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE tables ENABLE ROW LEVEL SECURITY;
ALTER TABLE seats ENABLE ROW LEVEL SECURITY;

-- Create policies for guests table
CREATE POLICY "Public read access to guests"
  ON guests FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert guests"
  ON guests FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update guests"
  ON guests FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete guests"
  ON guests FOR DELETE
  USING (auth.role() = 'authenticated');

-- Create policies for tables table
CREATE POLICY "Public read access to tables"
  ON tables FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert tables"
  ON tables FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update tables"
  ON tables FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete tables"
  ON tables FOR DELETE
  USING (auth.role() = 'authenticated');

-- Create policies for seats table
CREATE POLICY "Public read access to seats"
  ON seats FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert seats"
  ON seats FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update seats"
  ON seats FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete seats"
  ON seats FOR DELETE
  USING (auth.role() = 'authenticated');

-- Enable realtime for all tables
ALTER PUBLICATION supabase_realtime ADD TABLE guests;
ALTER PUBLICATION supabase_realtime ADD TABLE tables;
ALTER PUBLICATION supabase_realtime ADD TABLE seats;
