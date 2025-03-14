-- Create photos table
CREATE TABLE IF NOT EXISTS photos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  guest_id UUID REFERENCES guests(id),
  url TEXT NOT NULL,
  caption TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE
);

-- Create photo comments table
CREATE TABLE IF NOT EXISTS photo_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  photo_id UUID REFERENCES photos(id) ON DELETE CASCADE,
  guest_id UUID REFERENCES guests(id),
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE
);

-- Create storage bucket for wedding photos
INSERT INTO storage.buckets (id, name, public) 
VALUES ('wedding-photos', 'wedding-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policy to allow authenticated uploads
CREATE POLICY "Anyone can upload photos" 
ON storage.objects FOR INSERT 
TO authenticated 
WITH CHECK (bucket_id = 'wedding-photos');

-- Set up storage policy to allow public viewing of photos
CREATE POLICY "Anyone can view photos" 
ON storage.objects FOR SELECT 
TO public 
USING (bucket_id = 'wedding-photos');

-- Set up storage policy to allow authenticated users to delete their own photos
CREATE POLICY "Users can delete their own photos" 
ON storage.objects FOR DELETE 
TO authenticated 
USING (bucket_id = 'wedding-photos');

-- Enable RLS on photos table
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;

-- Create policy for inserting photos
CREATE POLICY "Anyone can insert photos"
ON photos FOR INSERT
TO authenticated
WITH CHECK (true);

-- Create policy for selecting photos
CREATE POLICY "Anyone can view photos"
ON photos FOR SELECT
TO public
USING (true);

-- Create policy for updating photos
CREATE POLICY "Users can update their own photos"
ON photos FOR UPDATE
TO authenticated
USING (auth.uid() = user_id OR guest_id IN (
  SELECT id FROM guests WHERE email = auth.email()
));

-- Create policy for deleting photos
CREATE POLICY "Users can delete their own photos"
ON photos FOR DELETE
TO authenticated
USING (auth.uid() = user_id OR guest_id IN (
  SELECT id FROM guests WHERE email = auth.email()
));

-- Enable RLS on photo_comments table
ALTER TABLE photo_comments ENABLE ROW LEVEL SECURITY;

-- Create policy for inserting comments
CREATE POLICY "Anyone can insert comments"
ON photo_comments FOR INSERT
TO authenticated
WITH CHECK (true);

-- Create policy for selecting comments
CREATE POLICY "Anyone can view comments"
ON photo_comments FOR SELECT
TO public
USING (true);

-- Create policy for updating comments
CREATE POLICY "Users can update their own comments"
ON photo_comments FOR UPDATE
TO authenticated
USING (guest_id IN (
  SELECT id FROM guests WHERE email = auth.email()
));

-- Create policy for deleting comments
CREATE POLICY "Users can delete their own comments"
ON photo_comments FOR DELETE
TO authenticated
USING (guest_id IN (
  SELECT id FROM guests WHERE email = auth.email()
));

-- Add to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE photos;
ALTER PUBLICATION supabase_realtime ADD TABLE photo_comments;
