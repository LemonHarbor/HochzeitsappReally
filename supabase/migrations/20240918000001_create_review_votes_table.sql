-- Create vendor_review_votes table if it doesn't exist already
CREATE TABLE IF NOT EXISTS vendor_review_votes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  review_id UUID NOT NULL REFERENCES vendor_reviews(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  is_helpful BOOLEAN NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(review_id, user_id)
);

-- Add helpful_votes and unhelpful_votes columns to vendor_reviews if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'vendor_reviews' AND column_name = 'helpful_votes') THEN
    ALTER TABLE vendor_reviews ADD COLUMN helpful_votes INTEGER DEFAULT 0;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'vendor_reviews' AND column_name = 'unhelpful_votes') THEN
    ALTER TABLE vendor_reviews ADD COLUMN unhelpful_votes INTEGER DEFAULT 0;
  END IF;
END $$;

-- Create function to update vote counts on vendor_reviews
CREATE OR REPLACE FUNCTION update_review_vote_counts()
RETURNS TRIGGER AS $$
DECLARE
  helpful_count INTEGER;
  unhelpful_count INTEGER;
BEGIN
  -- Count helpful votes
  SELECT COUNT(*) INTO helpful_count
  FROM vendor_review_votes
  WHERE review_id = COALESCE(NEW.review_id, OLD.review_id)
  AND is_helpful = TRUE;
  
  -- Count unhelpful votes
  SELECT COUNT(*) INTO unhelpful_count
  FROM vendor_review_votes
  WHERE review_id = COALESCE(NEW.review_id, OLD.review_id)
  AND is_helpful = FALSE;
  
  -- Update the review with the new counts
  UPDATE vendor_reviews
  SET 
    helpful_votes = helpful_count,
    unhelpful_votes = unhelpful_count
  WHERE id = COALESCE(NEW.review_id, OLD.review_id);
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create triggers to update vote counts when votes change
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

-- Enable row-level security
ALTER TABLE vendor_review_votes ENABLE ROW LEVEL SECURITY;

-- Create policies
DROP POLICY IF EXISTS "Users can view all review votes" ON vendor_review_votes;
CREATE POLICY "Users can view all review votes"
ON vendor_review_votes FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Users can only vote on their own behalf" ON vendor_review_votes;
CREATE POLICY "Users can only vote on their own behalf"
ON vendor_review_votes FOR INSERT
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can only update their own votes" ON vendor_review_votes;
CREATE POLICY "Users can only update their own votes"
ON vendor_review_votes FOR UPDATE
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can only delete their own votes" ON vendor_review_votes;
CREATE POLICY "Users can only delete their own votes"
ON vendor_review_votes FOR DELETE
USING (auth.uid() = user_id);

-- Enable realtime for vendor_review_votes
ALTER PUBLICATION supabase_realtime ADD TABLE vendor_review_votes;
