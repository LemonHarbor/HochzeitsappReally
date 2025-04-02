// src/types/supabase-types.ts
// Integration der generierten Supabase-Typen mit den einheitlichen Interfaces

import { Database } from './supabase-generated';
import * as Models from './models';

// Typen aus der Supabase-Datenbank
export type Tables = Database['public']['Tables'];

// Mapping von Supabase-Tabellen zu unseren Modellen
export type SupabaseGuest = Tables['guests']['Row'];
export type SupabaseTable = Tables['tables']['Row'];
export type SupabaseSeat = Tables['seats']['Row'];
export type SupabaseVendor = Tables['vendors']['Row'];
export type SupabaseAppointment = Tables['appointments']['Row'];
export type SupabaseContract = Tables['contracts']['Row'];
export type SupabaseWeddingHomepage = Tables['wedding_homepages']['Row'];
export type SupabaseWeddingSection = Tables['wedding_sections']['Row'];
export type SupabaseWeddingEvent = Tables['wedding_events']['Row'];
export type SupabaseWeddingPhoto = Tables['wedding_photos']['Row'];
export type SupabaseProfile = Tables['profiles']['Row'];

// Konvertierungsfunktionen zwischen Supabase-Typen und unseren Modellen
export const mappers = {
  // Gäste
  guestFromSupabase: (guest: SupabaseGuest): Models.Guest => ({
    id: guest.id,
    user_id: guest.user_id,
    name: guest.name,
    email: guest.email || undefined,
    phone: guest.phone || undefined,
    category: guest.category,
    rsvp_status: guest.rsvp_status as 'pending' | 'confirmed' | 'declined',
    plus_one: guest.plus_one,
    dietary_restrictions: guest.dietary_restrictions || undefined,
    notes: guest.notes || undefined,
    group_id: guest.group_id || undefined,
    created_at: guest.created_at,
    updated_at: guest.updated_at
  }),
  
  guestToSupabase: (guest: Models.Guest): Partial<SupabaseGuest> => ({
    id: guest.id,
    user_id: guest.user_id,
    name: guest.name,
    email: guest.email,
    phone: guest.phone,
    category: guest.category,
    rsvp_status: guest.rsvp_status,
    plus_one: guest.plus_one,
    dietary_restrictions: guest.dietary_restrictions,
    notes: guest.notes,
    group_id: guest.group_id,
    created_at: guest.created_at,
    updated_at: guest.updated_at
  }),
  
  // Tische
  tableFromSupabase: (table: SupabaseTable): Models.Table => ({
    id: table.id,
    name: table.name,
    capacity: table.capacity,
    shape: table.shape,
    position: table.position as { x: number, y: number },
    rotation: table.rotation,
    created_at: table.created_at,
    updated_at: table.updated_at
  }),
  
  tableToSupabase: (table: Models.Table): Partial<SupabaseTable> => ({
    id: table.id,
    name: table.name,
    capacity: table.capacity,
    shape: table.shape,
    position: table.position,
    rotation: table.rotation,
    created_at: table.created_at,
    updated_at: table.updated_at
  }),
  
  // Weitere Mapper für andere Modelle...
  
  // Beispiel für Termine
  appointmentFromSupabase: (appointment: SupabaseAppointment): Models.Appointment => ({
    id: appointment.id,
    vendor_id: appointment.vendor_id,
    title: appointment.title,
    description: appointment.description,
    start_time: appointment.start_time,
    end_time: appointment.end_time,
    location: appointment.location,
    status: appointment.status as 'scheduled' | 'completed' | 'cancelled' | 'rescheduled',
    notes: appointment.notes,
    reminder_sent: appointment.reminder_sent,
    created_at: appointment.created_at,
    updated_at: appointment.updated_at
  }),
  
  appointmentToSupabase: (appointment: Models.Appointment): Partial<SupabaseAppointment> => ({
    id: appointment.id,
    vendor_id: appointment.vendor_id,
    title: appointment.title,
    description: appointment.description,
    start_time: appointment.start_time,
    end_time: appointment.end_time,
    location: appointment.location,
    status: appointment.status,
    notes: appointment.notes,
    reminder_sent: appointment.reminder_sent,
    created_at: appointment.created_at,
    updated_at: appointment.updated_at
  })
};

// Typsichere Supabase-Tabellennamen
export const TABLES = {
  GUESTS: 'guests',
  TABLES: 'tables',
  SEATS: 'seats',
  VENDORS: 'vendors',
  APPOINTMENTS: 'appointments',
  CONTRACTS: 'contracts',
  WEDDING_HOMEPAGES: 'wedding_homepages',
  WEDDING_SECTIONS: 'wedding_sections',
  WEDDING_EVENTS: 'wedding_events',
  WEDDING_PHOTOS: 'wedding_photos',
  PROFILES: 'profiles'
} as const;

// Typsichere Supabase-Bucket-Namen
export const BUCKETS = {
  PHOTOS: 'photos',
  CONTRACTS: 'contracts',
  AVATARS: 'avatars'
} as const;
