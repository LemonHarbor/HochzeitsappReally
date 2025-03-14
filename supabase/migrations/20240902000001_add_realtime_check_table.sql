-- Create a table for realtime connection checks
CREATE TABLE IF NOT EXISTS _realtime_check (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert a single row that we can query to check connection
INSERT INTO _realtime_check (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

-- Enable realtime for this table
ALTER PUBLICATION supabase_realtime ADD TABLE _realtime_check;
