export interface WeddingTheme {
  id: string;
  name: string;
  description: string;
  preview_image_url: string;
  primary_color: string;
  secondary_color: string;
  font_heading: string;
  font_body: string;
  created_at: string;
  updated_at: string;
}

export interface WeddingHomepage {
  id: string;
  couple_names: string;
  wedding_date: string;
  welcome_text: string;
  contact_email: string;
  theme_id: string;
  user_id: string; // Hinzugefügt, da in getWeddingHomepageByUserId verwendet
  custom_domain?: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface WeddingSection {
  id: string;
  homepage_id: string;
  title: string;
  content: string;
  order: number;
  type: string;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
}

export interface WeddingEvent {
  id: string;
  homepage_id: string;
  title: string;
  date: string;
  start_time: string;
  end_time?: string;
  location: string;
  address: string;
  description: string;
  is_main_event: boolean;
  created_at: string;
  updated_at: string;
}

export interface WeddingPhoto {
  id: string;
  homepage_id: string;
  title?: string;
  description?: string;
  url: string;
  thumbnail_url: string;
  order?: number;
  is_featured?: boolean;
  created_at: string;
  updated_at: string;
}

export interface WeddingFAQ {
  id: string;
  homepage_id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
  created_at: string;
  updated_at: string;
}

export interface WeddingGift {
  id: string;
  homepage_id: string;
  title: string;
  description: string;
  price: number;
  image_url?: string;
  link_url?: string;
  is_reserved: boolean;
  reserved_by?: string;
  created_at: string;
  updated_at: string;
}

export interface WeddingAccommodation {
  id: string;
  homepage_id: string;
  name: string;
  address: string;
  price_category: string;
  price_range?: string;
  description: string;
  booking_link?: string;
  website?: string;
  image_url?: string;
  distance_to_venue: number;
  created_at: string;
  updated_at: string;
}

export interface WeddingGuestbookEntry {
  id: string;
  homepage_id: string;
  name: string;
  message: string;
  image_url?: string;
  is_approved: boolean;
  created_at: string;
  updated_at: string;
}

export interface WeddingRSVP {
  id: string;
  homepage_id: string;
  name: string;
  email: string;
  phone: string;
  attending: boolean;
  plus_one: boolean;
  dietary_restrictions: string;
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface WeddingMapLocation {
  id: string;
  homepage_id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  type: 'venue' | 'accommodation' | 'parking' | 'other';
  description: string;
  created_at: string;
  updated_at: string;
}
