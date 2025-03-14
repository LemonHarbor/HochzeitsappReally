-- Create guest groups table
CREATE TABLE IF NOT EXISTS guest_groups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  color TEXT NOT NULL DEFAULT '#4f46e5',
  type TEXT NOT NULL DEFAULT 'standard',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add group_id to tables
ALTER TABLE tables ADD COLUMN IF NOT EXISTS group_id UUID REFERENCES guest_groups(id) ON DELETE SET NULL;

-- Add realtime publication for guest_groups
ALTER PUBLICATION supabase_realtime ADD TABLE guest_groups;
