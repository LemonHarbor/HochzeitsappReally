-- Ensure the position column in tables is properly stored as JSONB
ALTER TABLE tables
ALTER COLUMN position TYPE JSONB USING position::JSONB;

-- Ensure the dimensions column in tables is properly stored as JSONB
ALTER TABLE tables
ALTER COLUMN dimensions TYPE JSONB USING dimensions::JSONB;

-- Ensure the position column in seats is properly stored as JSONB
ALTER TABLE seats
ALTER COLUMN position TYPE JSONB USING position::JSONB;
