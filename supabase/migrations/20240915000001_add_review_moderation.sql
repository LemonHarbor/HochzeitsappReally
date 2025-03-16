-- Add moderation fields to vendor_reviews table
ALTER TABLE vendor_reviews
ADD COLUMN IF NOT EXISTS status text DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS moderation_notes text,
ADD COLUMN IF NOT EXISTS moderated_by uuid REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS moderated_at timestamp with time zone;

-- Create index on status for faster queries
CREATE INDEX IF NOT EXISTS idx_vendor_reviews_status ON vendor_reviews(status);

-- Update existing reviews to be approved
UPDATE vendor_reviews SET status = 'approved' WHERE status IS NULL;

-- Make sure realtime is enabled for this table
alter publication supabase_realtime add table vendor_reviews;
