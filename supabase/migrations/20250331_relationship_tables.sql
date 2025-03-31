// This file defines the database schema for guest relationship tables
// These tables need to be created in Supabase for the relationship functionality to work

-- Create guest_relationships table
CREATE TABLE IF NOT EXISTS guest_relationships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  guest_id UUID NOT NULL REFERENCES guests(id) ON DELETE CASCADE,
  related_guest_id UUID NOT NULL REFERENCES guests(id) ON DELETE CASCADE,
  relationship_type TEXT NOT NULL,
  strength INTEGER NOT NULL DEFAULT 5 CHECK (strength BETWEEN 1 AND 10),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (guest_id, related_guest_id),
  CHECK (guest_id != related_guest_id)
);
