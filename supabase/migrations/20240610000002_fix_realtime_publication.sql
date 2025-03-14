-- Check if tables are already in the publication before adding them
DO $$
DECLARE
  table_exists BOOLEAN;
BEGIN
  -- Check if guests table is already in the publication
  SELECT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'guests'
  ) INTO table_exists;
  
  IF NOT table_exists THEN
    -- Only add if not already in the publication
    ALTER PUBLICATION supabase_realtime ADD TABLE guests;
  END IF;
  
  -- Check if tables table is already in the publication
  SELECT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'tables'
  ) INTO table_exists;
  
  IF NOT table_exists THEN
    -- Only add if not already in the publication
    ALTER PUBLICATION supabase_realtime ADD TABLE tables;
  END IF;
  
  -- Check if seats table is already in the publication
  SELECT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'seats'
  ) INTO table_exists;
  
  IF NOT table_exists THEN
    -- Only add if not already in the publication
    ALTER PUBLICATION supabase_realtime ADD TABLE seats;
  END IF;
END
$$;