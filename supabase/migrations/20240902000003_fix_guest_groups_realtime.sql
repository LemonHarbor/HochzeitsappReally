-- Check if the publication already exists for guest_groups
DO $$
BEGIN
    -- Check if guest_groups is already in the publication
    IF EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' 
        AND schemaname = 'public' 
        AND tablename = 'guest_groups'
    ) THEN
        -- If it exists, do nothing
        RAISE NOTICE 'guest_groups is already in supabase_realtime publication';
    ELSE
        -- If it doesn't exist, add it
        ALTER PUBLICATION supabase_realtime ADD TABLE public.guest_groups;
    END IF;
END
$$;