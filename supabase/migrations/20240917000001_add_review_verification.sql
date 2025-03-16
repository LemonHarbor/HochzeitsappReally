-- Add verification fields to vendor_reviews table
ALTER TABLE vendor_reviews
ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS verification_type TEXT,
ADD COLUMN IF NOT EXISTS verification_date TIMESTAMPTZ;

-- Create index for faster queries on verified reviews
CREATE INDEX IF NOT EXISTS idx_vendor_reviews_is_verified ON vendor_reviews(is_verified);

-- Create function to check if a user has booked a vendor
CREATE OR REPLACE FUNCTION check_user_booked_vendor(user_id UUID, vendor_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  has_appointment BOOLEAN;
  has_contract BOOLEAN;
  has_payment BOOLEAN;
BEGIN
  -- Check for appointments
  SELECT EXISTS (
    SELECT 1 FROM vendor_appointments 
    WHERE vendor_id = $2 AND user_id = $1
    LIMIT 1
  ) INTO has_appointment;
  
  -- Check for contracts
  SELECT EXISTS (
    SELECT 1 FROM vendor_contracts 
    WHERE vendor_id = $2 AND user_id = $1
    LIMIT 1
  ) INTO has_contract;
  
  -- Check for payments
  SELECT EXISTS (
    SELECT 1 FROM vendor_payments 
    WHERE vendor_id = $2 AND user_id = $1
    LIMIT 1
  ) INTO has_payment;
  
  RETURN has_appointment OR has_contract OR has_payment;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-verify reviews when possible
CREATE OR REPLACE FUNCTION auto_verify_review()
RETURNS TRIGGER AS $$
DECLARE
  has_booked BOOLEAN;
  has_contract BOOLEAN;
BEGIN
  -- Check if user has booked this vendor
  SELECT check_user_booked_vendor(NEW.user_id, NEW.vendor_id) INTO has_booked;
  
  IF has_booked THEN
    -- Check specifically for contracts
    SELECT EXISTS (
      SELECT 1 FROM vendor_contracts 
      WHERE vendor_id = NEW.vendor_id AND user_id = NEW.user_id
      LIMIT 1
    ) INTO has_contract;
    
    -- Set verification fields
    NEW.is_verified := TRUE;
    NEW.verification_date := NOW();
    
    IF has_contract THEN
      NEW.verification_type := 'contract';
    ELSE
      NEW.verification_type := 'booking';
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add trigger to auto-verify reviews on insert
DROP TRIGGER IF EXISTS trigger_auto_verify_review ON vendor_reviews;
CREATE TRIGGER trigger_auto_verify_review
BEFORE INSERT ON vendor_reviews
FOR EACH ROW
EXECUTE FUNCTION auto_verify_review();

-- Add realtime for the new columns
ALTER PUBLICATION supabase_realtime ADD TABLE vendor_reviews;
