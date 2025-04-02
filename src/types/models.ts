// src/types/models.ts
// Einheitliche Interfaces für alle Datenmodelle

// Basisinterface für alle Modelle
export interface BaseModel {
  id: string;
  created_at: string;
  updated_at?: string;
}

// Benutzermodell
export interface User extends BaseModel {
  email: string;
  name?: string;
  avatar_url?: string;
  phone?: string;
  role: 'admin' | 'user';
  last_login?: string;
}

// Profil
export interface Profile extends BaseModel {
  user_id: string;
  first_name?: string;
  last_name?: string;
  partner_name?: string;
  wedding_date?: string;
  location?: string;
  budget?: number;
  guest_count?: number;
  preferences?: Record<string, any>;
}

// Hochzeitswebseite
export interface WeddingHomepage extends BaseModel {
  user_id: string;
  couple_names: string;
  wedding_date: string;
  welcome_text: string;
  contact_email: string;
  theme_id: string;
  custom_domain?: string;
  is_published: boolean;
}

// Hochzeitssektion
export interface WeddingSection extends BaseModel {
  homepage_id: string;
  title: string;
  content: string;
  order: number;
  type: string;
  is_visible: boolean;
}

// Hochzeitsereignis
export interface WeddingEvent extends BaseModel {
  homepage_id: string;
  title: string;
  date: string;
  start_time: string;
  end_time?: string;
  location: string;
  address: string;
  description: string;
  is_main_event: boolean;
}

// Hochzeitsfoto
export interface WeddingPhoto extends BaseModel {
  homepage_id: string;
  title?: string;
  description?: string;
  url: string;
  thumbnail_url: string;
  order?: number;
  is_featured?: boolean;
}

// Hochzeits-FAQ
export interface WeddingFAQ extends BaseModel {
  homepage_id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
}

// Hochzeitsgeschenk
export interface WeddingGift extends BaseModel {
  homepage_id: string;
  title: string;
  description: string;
  price: number;
  image_url?: string;
  link_url?: string;
  is_reserved: boolean;
  reserved_by?: string;
}

// Hochzeitsunterkunft
export interface WeddingAccommodation extends BaseModel {
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
}

// Gästebucheintrag
export interface WeddingGuestbookEntry extends BaseModel {
  homepage_id: string;
  name: string;
  message: string;
  image_url?: string;
  is_approved: boolean;
}

// RSVP
export interface WeddingRSVP extends BaseModel {
  homepage_id: string;
  name: string;
  email: string;
  phone: string;
  attending: boolean;
  plus_one: boolean;
  dietary_restrictions: string;
  notes: string;
}

// Kartenstandort
export interface WeddingMapLocation extends BaseModel {
  homepage_id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  type: 'venue' | 'accommodation' | 'parking' | 'other';
  description: string;
}

// Hochzeitsthema
export interface WeddingTheme extends BaseModel {
  name: string;
  description: string;
  preview_image_url: string;
  primary_color: string;
  secondary_color: string;
  font_heading: string;
  font_body: string;
}

// Gast
export interface Guest extends BaseModel {
  user_id: string;
  name: string;
  email?: string;
  phone?: string;
  category: string;
  rsvp_status: 'pending' | 'confirmed' | 'declined';
  plus_one: boolean;
  dietary_restrictions?: string;
  notes?: string;
  group_id?: string;
}

// Gästegruppe
export interface GuestGroup extends BaseModel {
  name: string;
  type: string;
  color: string;
}

// Tisch
export interface Table extends BaseModel {
  name: string;
  capacity: number;
  shape: string;
  position: {
    x: number;
    y: number;
  };
  rotation: number;
}

// Sitzplatz
export interface Seat extends BaseModel {
  table_id: string;
  position: number;
  guest_id?: string;
}

// Dienstleister
export interface Vendor extends BaseModel {
  name: string;
  category: string;
  contact_name?: string;
  email?: string;
  phone?: string;
  address?: string;
  website?: string;
  status: 'active' | 'inactive' | 'pending';
  notes?: string;
}

// Termin
export interface Appointment extends BaseModel {
  vendor_id: string;
  title: string;
  description: string;
  start_time: string;
  end_time: string;
  location: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
  notes: string;
  reminder_sent: boolean;
}

// Vertrag
export interface Contract extends BaseModel {
  vendor_id: string;
  name: string;
  file_url?: string;
  file_type?: string;
  file_size?: number;
  signed_date?: string;
  expiration_date?: string;
  status: 'draft' | 'pending' | 'active' | 'expired' | 'cancelled';
  key_terms?: Record<string, string>;
  notes?: string;
}

// Ausgabe
export interface Expense extends BaseModel {
  user_id: string;
  name: string;
  amount: number;
  category: string;
  date: string;
  vendor?: string;
  vendor_id?: string;
  status: string;
  notes?: string;
  receipt_url?: string;
}

// Budgetkategorie
export interface BudgetCategory extends BaseModel {
  user_id: string;
  name: string;
  amount: number;
  percentage: number;
  spent: number;
  recommended: number;
  color: string;
}

// Meilenstein
export interface TimelineMilestone extends BaseModel {
  user_id: string;
  title: string;
  description: string;
  date: string;
  completed: boolean;
}

// Dienstleisterbewertung
export interface VendorReview extends BaseModel {
  vendor_id: string;
  user_id: string;
  rating: number;
  comment?: string;
}

// E-Mail-Protokoll
export interface EmailLog extends BaseModel {
  recipient_email: string;
  email_type: string;
  sent_at: string;
  status: string;
  error_message?: string;
}

// Zugangscode
export interface AccessCode extends BaseModel {
  code: string;
  description?: string;
  expires_at?: string;
  is_active: boolean;
}
