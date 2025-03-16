-- Add helpfulness voting to vendor_reviews table
ALTER TABLE vendor_reviews
ADD COLUMN IF NOT EXISTS helpful_votes INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS unhelpful_votes INTEGER DEFAULT 0;

-- Create a new table to track user votes
CREATE TABLE IF NOT EXISTS vendor_review_votes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  review_id UUID NOT NULL REFERENCES vendor_reviews(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  is_helpful BOOLEAN NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(review_id, user_id)
);

-- Enable row-level security
ALTER TABLE vendor_review_votes ENABLE ROW LEVEL SECURITY;

-- Create policies for vendor_review_votes
DROP POLICY IF EXISTS "Users can view all review votes" ON vendor_review_votes;
CREATE POLICY "Users can view all review votes"
ON vendor_review_votes FOR SELECT
TO authenticated
USING (true);

DROP POLICY IF EXISTS "Users can insert their own votes" ON vendor_review_votes;
CREATE POLICY "Users can insert their own votes"
ON vendor_review_votes FOR INSERT
TO authenticated
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own votes" ON vendor_review_votes;
CREATE POLICY "Users can update their own votes"
ON vendor_review_votes FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own votes" ON vendor_review_votes;
CREATE POLICY "Users can delete their own votes"
ON vendor_review_votes FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Add to realtime publication
alter publication supabase_realtime add table vendor_review_votes;

-- Create function to update vote counts
CREATE OR REPLACE FUNCTION update_review_vote_counts()
RETURNS TRIGGER AS $$
DECLARE
  helpful_count INTEGER;
  unhelpful_count INTEGER;
BEGIN
  -- Count helpful votes
  SELECT COUNT(*) INTO helpful_count
  FROM vendor_review_votes
  WHERE review_id = COALESCE(NEW.review_id, OLD.review_id) AND is_helpful = TRUE;
  
  -- Count unhelpful votes
  SELECT COUNT(*) INTO unhelpful_count
  FROM vendor_review_votes
  WHERE review_id = COALESCE(NEW.review_id, OLD.review_id) AND is_helpful = FALSE;
  
  -- Update the review with the new counts
  UPDATE vendor_reviews
  SET 
    helpful_votes = helpful_count,
    unhelpful_votes = unhelpful_count,
    updated_at = NOW()
  WHERE id = COALESCE(NEW.review_id, OLD.review_id);
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for insert, update, and delete operations
DROP TRIGGER IF EXISTS update_review_votes_on_insert ON vendor_review_votes;
CREATE TRIGGER update_review_votes_on_insert
AFTER INSERT ON vendor_review_votes
FOR EACH ROW
EXECUTE FUNCTION update_review_vote_counts();

DROP TRIGGER IF EXISTS update_review_votes_on_update ON vendor_review_votes;
CREATE TRIGGER update_review_votes_on_update
AFTER UPDATE ON vendor_review_votes
FOR EACH ROW
EXECUTE FUNCTION update_review_vote_counts();

DROP TRIGGER IF EXISTS update_review_votes_on_delete ON vendor_review_votes;
CREATE TRIGGER update_review_votes_on_delete
AFTER DELETE ON vendor_review_votes
FOR EACH ROW
EXECUTE FUNCTION update_review_vote_counts();
