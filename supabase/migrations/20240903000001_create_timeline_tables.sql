-- Create timeline tables for wedding planning

-- User preferences table to store wedding date
CREATE TABLE IF NOT EXISTS user_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  wedding_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Timeline milestones table
CREATE TABLE IF NOT EXISTS timeline_milestones (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  due_date TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Timeline tasks table
CREATE TABLE IF NOT EXISTS timeline_tasks (
  id TEXT PRIMARY KEY,
  milestone_id TEXT NOT NULL REFERENCES timeline_milestones(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  skipped BOOLEAN DEFAULT FALSE,
  is_custom BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE user_preferences;
ALTER PUBLICATION supabase_realtime ADD TABLE timeline_milestones;
ALTER PUBLICATION supabase_realtime ADD TABLE timeline_tasks;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_timeline_milestones_user_id ON timeline_milestones(user_id);
CREATE INDEX IF NOT EXISTS idx_timeline_tasks_milestone_id ON timeline_tasks(milestone_id);
