-- Add reminder fields to vendor_appointments table if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'vendor_appointments' AND column_name = 'reminder_time') THEN
    ALTER TABLE vendor_appointments ADD COLUMN reminder_time TIMESTAMPTZ;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'vendor_appointments' AND column_name = 'reminder_type') THEN
    ALTER TABLE vendor_appointments ADD COLUMN reminder_type TEXT;
  END IF;
  
  -- Create an index on reminder_time for faster queries
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_vendor_appointments_reminder_time') THEN
    CREATE INDEX idx_vendor_appointments_reminder_time ON vendor_appointments(reminder_time);
  END IF;
END $$;