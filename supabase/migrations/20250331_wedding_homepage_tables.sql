// This file defines the database schema for wedding homepage tables
// These tables need to be created in Supabase for the wedding homepage functionality to work

-- Create wedding_homepages table
CREATE TABLE IF NOT EXISTS wedding_homepages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  couple_names TEXT NOT NULL,
  wedding_date TEXT NOT NULL,
  theme TEXT NOT NULL,
  primary_color TEXT NOT NULL,
  secondary_color TEXT NOT NULL,
  font_family TEXT NOT NULL,
  is_published BOOLEAN NOT NULL DEFAULT false,
  custom_domain TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create wedding_sections table
CREATE TABLE IF NOT EXISTS wedding_sections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  homepage_id UUID NOT NULL REFERENCES wedding_homepages(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT,
  order INTEGER NOT NULL,
  is_visible BOOLEAN NOT NULL DEFAULT true,
  settings JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create wedding_events table
CREATE TABLE IF NOT EXISTS wedding_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  homepage_id UUID NOT NULL REFERENCES wedding_homepages(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  date TEXT NOT NULL,
  start_time TEXT,
  end_time TEXT,
  location TEXT,
  address TEXT,
  is_main_event BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create wedding_photos table
CREATE TABLE IF NOT EXISTS wedding_photos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  homepage_id UUID NOT NULL REFERENCES wedding_homepages(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  thumbnail_url TEXT,
  title TEXT,
  description TEXT,
  order INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create wedding_gifts table
CREATE TABLE IF NOT EXISTS wedding_gifts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  homepage_id UUID NOT NULL REFERENCES wedding_homepages(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  price NUMERIC,
  link TEXT,
  is_reserved BOOLEAN NOT NULL DEFAULT false,
  reserved_by TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create wedding_guestbook_entries table
CREATE TABLE IF NOT EXISTS wedding_guestbook_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  homepage_id UUID NOT NULL REFERENCES wedding_homepages(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  message TEXT NOT NULL,
  is_approved BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create wedding_accommodations table
CREATE TABLE IF NOT EXISTS wedding_accommodations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  homepage_id UUID NOT NULL REFERENCES wedding_homepages(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  address TEXT,
  price_range TEXT,
  website TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create wedding_faqs table
CREATE TABLE IF NOT EXISTS wedding_faqs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  homepage_id UUID NOT NULL REFERENCES wedding_homepages(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  order INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create wedding_rsvps table
CREATE TABLE IF NOT EXISTS wedding_rsvps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  homepage_id UUID NOT NULL REFERENCES wedding_homepages(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  attending BOOLEAN NOT NULL,
  number_of_guests INTEGER NOT NULL DEFAULT 1,
  dietary_restrictions TEXT,
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create wedding_themes table
CREATE TABLE IF NOT EXISTS wedding_themes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  preview_image TEXT NOT NULL,
  primary_color TEXT NOT NULL,
  secondary_color TEXT NOT NULL,
  font_family TEXT NOT NULL,
  is_premium BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert some default themes
INSERT INTO wedding_themes (name, description, preview_image, primary_color, secondary_color, font_family, is_premium)
VALUES 
  ('Elegant', 'Ein elegantes, zeitloses Design mit klassischen Elementen', '/themes/elegant-preview.jpg', '#3a3a3a', '#d4af37', 'Playfair Display, serif', false),
  ('Rustikal', 'Warmes, rustikales Design mit natürlichen Elementen', '/themes/rustic-preview.jpg', '#5e3b28', '#d2b48c', 'Montserrat, sans-serif', false),
  ('Modern', 'Klares, modernes Design mit minimalistischen Elementen', '/themes/modern-preview.jpg', '#2c3e50', '#3498db', 'Roboto, sans-serif', false),
  ('Romantisch', 'Verträumtes, romantisches Design mit floralen Elementen', '/themes/romantic-preview.jpg', '#d8a7b1', '#6d8b74', 'Dancing Script, cursive', false),
  ('Strand', 'Frisches, maritimes Design mit Strandelementen', '/themes/beach-preview.jpg', '#00a8cc', '#f9f9f9', 'Quicksand, sans-serif', true),
  ('Vintage', 'Nostalgisches Design mit Retro-Elementen', '/themes/vintage-preview.jpg', '#8d6e63', '#a1887f', 'Libre Baskerville, serif', true);
