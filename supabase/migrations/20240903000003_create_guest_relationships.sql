-- Create guest relationships table
CREATE TABLE IF NOT EXISTS guest_relationships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  guest_id UUID NOT NULL REFERENCES guests(id) ON DELETE CASCADE,
  related_guest_id UUID NOT NULL REFERENCES guests(id) ON DELETE CASCADE,
  relationship_type TEXT NOT NULL CHECK (relationship_type IN ('family', 'couple', 'friend', 'conflict')),
  strength INTEGER NOT NULL CHECK (strength >= 1 AND strength <= 10),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(guest_id, related_guest_id)
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_guest_relationships_guest_id ON guest_relationships(guest_id);
CREATE INDEX IF NOT EXISTS idx_guest_relationships_related_guest_id ON guest_relationships(related_guest_id);

-- Enable row-level security
ALTER TABLE guest_relationships ENABLE ROW LEVEL SECURITY;

-- Create policies
DROP POLICY IF EXISTS "Users can view their own guest relationships" ON guest_relationships;
CREATE POLICY "Users can view their own guest relationships"
  ON guest_relationships FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Users can insert their own guest relationships" ON guest_relationships;
CREATE POLICY "Users can insert their own guest relationships"
  ON guest_relationships FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Users can update their own guest relationships" ON guest_relationships;
CREATE POLICY "Users can update their own guest relationships"
  ON guest_relationships FOR UPDATE
  USING (true);

DROP POLICY IF EXISTS "Users can delete their own guest relationships" ON guest_relationships;
CREATE POLICY "Users can delete their own guest relationships"
  ON guest_relationships FOR DELETE
  USING (true);

-- Enable realtime
alter publication supabase_realtime add table guest_relationships;
