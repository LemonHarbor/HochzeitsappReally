-- Add visit_date column to vendor_reviews table
ALTER TABLE vendor_reviews ADD COLUMN IF NOT EXISTS visit_date TIMESTAMPTZ;

-- Update realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE vendor_reviews;
