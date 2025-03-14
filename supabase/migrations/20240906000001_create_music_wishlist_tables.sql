-- Create music wishlist tables

-- Table for storing song requests
CREATE TABLE IF NOT EXISTS music_wishlist (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  guest_id UUID REFERENCES guests(id),
  title TEXT NOT NULL,
  artist TEXT NOT NULL,
  notes TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable row level security
ALTER TABLE music_wishlist ENABLE ROW LEVEL SECURITY;

-- Create policies
DROP POLICY IF EXISTS "Guests can view all songs" ON music_wishlist;
CREATE POLICY "Guests can view all songs"
  ON music_wishlist FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Guests can insert their own songs" ON music_wishlist;
CREATE POLICY "Guests can insert their own songs"
  ON music_wishlist FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Guests can update their own songs" ON music_wishlist;
CREATE POLICY "Guests can update their own songs"
  ON music_wishlist FOR UPDATE
  USING (guest_id = auth.uid());

DROP POLICY IF EXISTS "Guests can delete their own songs" ON music_wishlist;
CREATE POLICY "Guests can delete their own songs"
  ON music_wishlist FOR DELETE
  USING (guest_id = auth.uid());

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE music_wishlist;
