export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      access_codes: {
        Row: {
          code: string
          created_at: string | null
          description: string | null
          expires_at: string | null
          id: string
          is_active: boolean | null
          updated_at: string | null
        }
        Insert: {
          code: string
          created_at?: string | null
          description?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          updated_at?: string | null
        }
        Update: {
          code?: string
          created_at?: string | null
          description?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
      budget_categories: {
        Row: {
          amount: number
          color: string
          created_at: string | null
          id: string
          name: string
          percentage: number
          recommended: number
          spent: number
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          amount?: number
          color?: string
          created_at?: string | null
          id?: string
          name: string
          percentage?: number
          recommended?: number
          spent?: number
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          amount?: number
          color?: string
          created_at?: string | null
          id?: string
          name?: string
          percentage?: number
          recommended?: number
          spent?: number
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "budget_categories_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      wedding_homepages: {
        Row: {
          id: string
          couple_names: string
          wedding_date: string
          welcome_text: string
          contact_email: string
          theme_id: string
          user_id: string
          custom_domain?: string
          is_published: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          couple_names: string
          wedding_date: string
          welcome_text: string
          contact_email: string
          theme_id: string
          user_id: string
          custom_domain?: string
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          couple_names?: string
          wedding_date?: string
          welcome_text?: string
          contact_email?: string
          theme_id?: string
          user_id?: string
          custom_domain?: string
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "wedding_homepages_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      wedding_sections: {
        Row: {
          id: string
          homepage_id: string
          title: string
          content: string
          order: number
          type: string
          is_visible: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          homepage_id: string
          title: string
          content: string
          order: number
          type: string
          is_visible?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          homepage_id?: string
          title?: string
          content?: string
          order?: number
          type?: string
          is_visible?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "wedding_sections_homepage_id_fkey"
            columns: ["homepage_id"]
            isOneToOne: false
            referencedRelation: "wedding_homepages"
            referencedColumns: ["id"]
          },
        ]
      }
      wedding_events: {
        Row: {
          id: string
          homepage_id: string
          title: string
          date: string
          start_time: string
          end_time?: string
          location: string
          address: string
          description: string
          is_main_event: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          homepage_id: string
          title: string
          date: string
          start_time: string
          end_time?: string
          location: string
          address: string
          description: string
          is_main_event?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          homepage_id?: string
          title?: string
          date?: string
          start_time?: string
          end_time?: string
          location?: string
          address?: string
          description?: string
          is_main_event?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "wedding_events_homepage_id_fkey"
            columns: ["homepage_id"]
            isOneToOne: false
            referencedRelation: "wedding_homepages"
            referencedColumns: ["id"]
          },
        ]
      }
      wedding_photos: {
        Row: {
          id: string
          homepage_id: string
          title?: string
          description?: string
          url: string
          thumbnail_url: string
          order?: number
          is_featured?: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          homepage_id: string
          title?: string
          description?: string
          url: string
          thumbnail_url: string
          order?: number
          is_featured?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          homepage_id?: string
          title?: string
          description?: string
          url?: string
          thumbnail_url?: string
          order?: number
          is_featured?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "wedding_photos_homepage_id_fkey"
            columns: ["homepage_id"]
            isOneToOne: false
            referencedRelation: "wedding_homepages"
            referencedColumns: ["id"]
          },
        ]
      }
      email_logs: {
        Row: {
          created_at: string | null
          email_type: string
          error_message: string | null
          id: string
          recipient_email: string
          sent_at: string
          status: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email_type: string
          error_message?: string | null
          id?: string
          recipient_email: string
          sent_at: string
          status: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email_type?: string
          error_message?: string | null
          id?: string
          recipient_email?: string
          sent_at?: string
          status?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      expenses: {
        Row: {
          amount: number
          category: string
          created_at: string | null
          date: string
          id: string
          name: string
          notes: string | null
          receipt_url: string | null
          status: string
          updated_at: string | null
          user_id: string | null
          vendor: string | null
          vendor_id: string | null
        }
        Insert: {
          amount: number
          category: string
          created_at?: string | null
          date: string
          id?: string
          name: string
          notes?: string | null
          receipt_url?: string | null
          status: string
          updated_at?: string | null
          user_id?: string | null
          vendor?: string | null
          vendor_id?: string | null
        }
        Update: {
          amount?: number
          category?: string
          created_at?: string | null
          date?: string
          id?: string
          name?: string
          notes?: string | null
          receipt_url?: string | null
          status?: string
          updated_at?: string | null
          user_id?: string | null
          vendor?: string | null
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "expenses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "expenses_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      guest_groups: {
        Row: {
          color: string
          created_at: string | null
          id: string
          name: string
          type: string
          updated_at: string | null
        }
        Insert: {
          color?: string
          created_at?: string | null
          id?: string
          name: string
          type?: string
          updated_at?: string | null
        }
        Update: {
          color?: string
          created_at?: string | null
          id?: string
          name?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      guest_relationships: {
        Row: {
          created_at: string | null
          guest_id: string
          id: string
          related_guest_id: string
          relationship_type: string
          strength: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          guest_id: string
          id?: string
          related_guest_id: string
          relationship_type: string
          strength: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          guest_id?: string
          id?: string
          related_guest_id?: string
          relationship_type?: string
          strength?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "guest_relationships_guest_id_fkey"
            columns: ["guest_id"]
            isOneToOne: false
            referencedRelation: "guests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "guest_relationships_related_guest_id_fkey"
            columns: ["related_guest_id"]
            isOneToOne: false
            referencedRelation: "guests"
            referencedColumns: ["id"]
          },
        ]
      }
      guests: {
        Row: {
          category: string
          created_at: string
          dietary_restrictions: string
          email: string
          id: string
          name: string
          notes: string
          phone: string
          plus_one: boolean
          rsvp_status: string
          updated_at: string
        }
        Insert: {
          category?: string
          created_at?: string
          dietary_restrictions?: string
          email?: string
          id?: string
          name: string
          notes?: string
          phone?: string
          plus_one?: boolean
          rsvp_status?: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          dietary_restrictions?: string
          email?: string
          id?: string
          name?: string
          notes?: string
          phone?: string
          plus_one?: boolean
          rsvp_status?: string
          updated_at?: string
        }
        Relationships: []
      }
      photos: {
        Row: {
          created_at: string
          description: string
          id: string
          title: string
          updated_at: string
          url: string
        }
        Insert: {
          created_at?: string
          description?: string
          id?: string
          title: string
          updated_at?: string
          url: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          title?: string
          updated_at?: string
          url?: string
        }
        Relationships: []
      }
      seats: {
        Row: {
          created_at: string
          guest_id: string | null
          id: string
          position: number
          table_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          guest_id?: string | null
          id?: string
          position: number
          table_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          guest_id?: string | null
          id?: string
          position?: number
          table_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "seats_guest_id_fkey"
            columns: ["guest_id"]
            isOneToOne: false
            referencedRelation: "guests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "seats_table_id_fkey"
            columns: ["table_id"]
            isOneToOne: false
            referencedRelation: "tables"
            referencedColumns: ["id"]
          },
        ]
      }
      tables: {
        Row: {
          capacity: number
          created_at: string
          id: string
          name: string
          position: Json
          rotation: number
          shape: string
          updated_at: string
        }
        Insert: {
          capacity?: number
          created_at?: string
          id?: string
          name: string
          position?: Json
          rotation?: number
          shape?: string
          updated_at?: string
        }
        Update: {
          capacity?: number
          created_at?: string
          id?: string
          name?: string
          position?: Json
          rotation?: number
          shape?: string
          updated_at?: string
        }
        Relationships: []
      }
      timeline_milestones: {
        Row: {
          completed: boolean
          created_at: string | null
          date: string
          description: string
          id: string
          title: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          completed?: boolean
          created_at?: string | null
          date: string
          description: string
          id?: string
          title: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          completed?: boolean
          created_at?: string | null
          date?: string
          description?: string
          id?: string
          title?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "timeline_milestones_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          name?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      vendor_reviews: {
        Row: {
          comment: string | null
          created_at: string | null
          id: string
          rating: number
          updated_at: string | null
          user_id: string | null
          vendor_id: string
        }
        Insert: {
          comment?: string | null
          created_at?: string | null
          id?: string
          rating: number
          updated_at?: string | null
          user_id?: string | null
          vendor_id: string
        }
        Update: {
          comment?: string | null
          created_at?: string | null
          id?: string
          rating?: number
          updated_at?: string | null
          user_id?: string | null
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vendor_reviews_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_reviews_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      vendors: {
        Row: {
          address: string | null
          category: string
          contact_name: string | null
          created_at: string
          email: string | null
          id: string
          name: string
          notes: string | null
          phone: string | null
          status: string
          updated_at: string
          website: string | null
        }
        Insert: {
          address?: string | null
          category: string
          contact_name?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name: string
          notes?: string | null
          phone?: string | null
          status?: string
          updated_at?: string
          website?: string | null
        }
        Update: {
          address?: string | null
          category?: string
          contact_name?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          notes?: string | null
          phone?: string | null
          status?: string
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
    }
    Views: {}
    Functions: {}
    Enums: {}
    CompositeTypes: {}
  }
}
