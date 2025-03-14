-- Create email logs table to track email notifications
CREATE TABLE IF NOT EXISTS email_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  recipient_email TEXT NOT NULL,
  email_type TEXT NOT NULL,
  sent_at TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT NOT NULL,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable row level security
ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;

-- Create policy for admin access
DROP POLICY IF EXISTS "Admin can do everything" ON email_logs;
CREATE POLICY "Admin can do everything"
  ON email_logs
  USING (true);

-- Add to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE email_logs;
