CREATE TABLE IF NOT EXISTS permissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  resource_id UUID NOT NULL,
  resource_type TEXT NOT NULL CHECK (resource_type IN ('jga', 'wedding_homepage')),
  user_id UUID,
  user_email TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('owner', 'admin', 'editor', 'viewer')),
  is_accepted BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_permissions_resource ON permissions(resource_id, resource_type);
CREATE INDEX IF NOT EXISTS idx_permissions_user_id ON permissions(user_id);
CREATE INDEX IF NOT EXISTS idx_permissions_user_email ON permissions(user_email);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_permissions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_permissions_timestamp ON permissions;
CREATE TRIGGER update_permissions_timestamp
BEFORE UPDATE ON permissions
FOR EACH ROW
EXECUTE FUNCTION update_permissions_updated_at();

-- Create RLS policies
ALTER TABLE permissions ENABLE ROW LEVEL SECURITY;

-- Policy for selecting permissions
CREATE POLICY select_permissions ON permissions
  FOR SELECT
  USING (
    auth.uid() = user_id OR
    EXISTS (
      SELECT 1 FROM permissions p
      WHERE p.resource_id = permissions.resource_id
      AND p.resource_type = permissions.resource_type
      AND p.user_id = auth.uid()
      AND p.role IN ('owner', 'admin')
      AND p.is_accepted = TRUE
    )
  );

-- Policy for inserting permissions
CREATE POLICY insert_permissions ON permissions
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM permissions p
      WHERE p.resource_id = NEW.resource_id
      AND p.resource_type = NEW.resource_type
      AND p.user_id = auth.uid()
      AND p.role IN ('owner', 'admin')
      AND p.is_accepted = TRUE
    )
  );

-- Policy for updating permissions
CREATE POLICY update_permissions ON permissions
  FOR UPDATE
  USING (
    auth.uid() = user_id OR
    EXISTS (
      SELECT 1 FROM permissions p
      WHERE p.resource_id = permissions.resource_id
      AND p.resource_type = permissions.resource_type
      AND p.user_id = auth.uid()
      AND p.role IN ('owner', 'admin')
      AND p.is_accepted = TRUE
    )
  );

-- Policy for deleting permissions
CREATE POLICY delete_permissions ON permissions
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM permissions p
      WHERE p.resource_id = permissions.resource_id
      AND p.resource_type = permissions.resource_type
      AND p.user_id = auth.uid()
      AND p.role IN ('owner', 'admin')
      AND p.is_accepted = TRUE
    )
  );
