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
          created_at: string | null
          dietary_restrictions: string | null
          email: string
          id: string
          name: string
          notes: string | null
          phone: string | null
          plus_one: boolean | null
          rsvp_status: string
          updated_at: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          dietary_restrictions?: string | null
          email: string
          id?: string
          name: string
          notes?: string | null
          phone?: string | null
          plus_one?: boolean | null
          rsvp_status: string
          updated_at?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          dietary_restrictions?: string | null
          email?: string
          id?: string
          name?: string
          notes?: string | null
          phone?: string | null
          plus_one?: boolean | null
          rsvp_status?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      music_wishlist: {
        Row: {
          artist: string
          created_at: string | null
          guest_id: string | null
          id: string
          notes: string | null
          status: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          artist: string
          created_at?: string | null
          guest_id?: string | null
          id?: string
          notes?: string | null
          status?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          artist?: string
          created_at?: string | null
          guest_id?: string | null
          id?: string
          notes?: string | null
          status?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "music_wishlist_guest_id_fkey"
            columns: ["guest_id"]
            isOneToOne: false
            referencedRelation: "guests"
            referencedColumns: ["id"]
          },
        ]
      }
      photo_comments: {
        Row: {
          content: string
          created_at: string | null
          guest_id: string | null
          id: string
          photo_id: string | null
          updated_at: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          guest_id?: string | null
          id?: string
          photo_id?: string | null
          updated_at?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          guest_id?: string | null
          id?: string
          photo_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "photo_comments_guest_id_fkey"
            columns: ["guest_id"]
            isOneToOne: false
            referencedRelation: "guests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "photo_comments_photo_id_fkey"
            columns: ["photo_id"]
            isOneToOne: false
            referencedRelation: "photos"
            referencedColumns: ["id"]
          },
        ]
      }
      photos: {
        Row: {
          caption: string | null
          created_at: string | null
          guest_id: string | null
          id: string
          updated_at: string | null
          url: string
          user_id: string | null
        }
        Insert: {
          caption?: string | null
          created_at?: string | null
          guest_id?: string | null
          id?: string
          updated_at?: string | null
          url: string
          user_id?: string | null
        }
        Update: {
          caption?: string | null
          created_at?: string | null
          guest_id?: string | null
          id?: string
          updated_at?: string | null
          url?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "photos_guest_id_fkey"
            columns: ["guest_id"]
            isOneToOne: false
            referencedRelation: "guests"
            referencedColumns: ["id"]
          },
        ]
      }
      seats: {
        Row: {
          created_at: string | null
          guest_id: string | null
          id: string
          position: Json
          table_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          guest_id?: string | null
          id?: string
          position: Json
          table_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          guest_id?: string | null
          id?: string
          position?: Json
          table_id?: string
          updated_at?: string | null
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
          created_at: string | null
          dimensions: Json
          group_id: string | null
          id: string
          name: string
          position: Json
          rotation: number | null
          shape: string
          updated_at: string | null
        }
        Insert: {
          capacity: number
          created_at?: string | null
          dimensions: Json
          group_id?: string | null
          id?: string
          name: string
          position: Json
          rotation?: number | null
          shape: string
          updated_at?: string | null
        }
        Update: {
          capacity?: number
          created_at?: string | null
          dimensions?: Json
          group_id?: string | null
          id?: string
          name?: string
          position?: Json
          rotation?: number | null
          shape?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tables_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "guest_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      timeline_milestones: {
        Row: {
          created_at: string | null
          due_date: string
          id: string
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          due_date: string
          id: string
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          due_date?: string
          id?: string
          title?: string
          updated_at?: string | null
          user_id?: string
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
      timeline_tasks: {
        Row: {
          completed: boolean | null
          created_at: string | null
          id: string
          is_custom: boolean | null
          milestone_id: string
          name: string
          skipped: boolean | null
          updated_at: string | null
        }
        Insert: {
          completed?: boolean | null
          created_at?: string | null
          id: string
          is_custom?: boolean | null
          milestone_id: string
          name: string
          skipped?: boolean | null
          updated_at?: string | null
        }
        Update: {
          completed?: boolean | null
          created_at?: string | null
          id?: string
          is_custom?: boolean | null
          milestone_id?: string
          name?: string
          skipped?: boolean | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "timeline_tasks_milestone_id_fkey"
            columns: ["milestone_id"]
            isOneToOne: false
            referencedRelation: "timeline_milestones"
            referencedColumns: ["id"]
          },
        ]
      }
      user_preferences: {
        Row: {
          created_at: string | null
          id: string
          updated_at: string | null
          user_id: string
          wedding_date: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          updated_at?: string | null
          user_id: string
          wedding_date?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          updated_at?: string | null
          user_id?: string
          wedding_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_preferences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string
          id: string
          name: string
          role: string
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email: string
          id: string
          name: string
          role: string
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string
          id?: string
          name?: string
          role?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      vendor_appointments: {
        Row: {
          created_at: string | null
          description: string | null
          end_time: string
          id: string
          location: string | null
          notes: string | null
          reminder_sent: boolean
          start_time: string
          status: string
          title: string
          updated_at: string | null
          vendor_id: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          end_time: string
          id?: string
          location?: string | null
          notes?: string | null
          reminder_sent?: boolean
          start_time: string
          status?: string
          title: string
          updated_at?: string | null
          vendor_id: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          end_time?: string
          id?: string
          location?: string | null
          notes?: string | null
          reminder_sent?: boolean
          start_time?: string
          status?: string
          title?: string
          updated_at?: string | null
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vendor_appointments_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      vendor_contracts: {
        Row: {
          created_at: string | null
          expiration_date: string | null
          file_size: number
          file_type: string
          file_url: string
          id: string
          key_terms: Json | null
          name: string
          notes: string | null
          signed_date: string | null
          status: string
          updated_at: string | null
          vendor_id: string
        }
        Insert: {
          created_at?: string | null
          expiration_date?: string | null
          file_size: number
          file_type: string
          file_url: string
          id?: string
          key_terms?: Json | null
          name: string
          notes?: string | null
          signed_date?: string | null
          status: string
          updated_at?: string | null
          vendor_id: string
        }
        Update: {
          created_at?: string | null
          expiration_date?: string | null
          file_size?: number
          file_type?: string
          file_url?: string
          id?: string
          key_terms?: Json | null
          name?: string
          notes?: string | null
          signed_date?: string | null
          status?: string
          updated_at?: string | null
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vendor_contracts_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      vendor_payments: {
        Row: {
          amount: number
          created_at: string | null
          due_date: string
          id: string
          notes: string | null
          payment_date: string | null
          payment_type: string
          status: string
          updated_at: string | null
          vendor_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          due_date: string
          id?: string
          notes?: string | null
          payment_date?: string | null
          payment_type: string
          status: string
          updated_at?: string | null
          vendor_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          due_date?: string
          id?: string
          notes?: string | null
          payment_date?: string | null
          payment_type?: string
          status?: string
          updated_at?: string | null
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vendor_payments_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      vendor_reviews: {
        Row: {
          created_at: string | null
          id: string
          rating: number
          review_text: string | null
          updated_at: string | null
          user_id: string
          vendor_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          rating: number
          review_text?: string | null
          updated_at?: string | null
          user_id: string
          vendor_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          rating?: number
          review_text?: string | null
          updated_at?: string | null
          user_id?: string
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
          created_at: string | null
          email: string | null
          id: string
          name: string
          notes: string | null
          phone: string | null
          status: string | null
          updated_at: string | null
          website: string | null
        }
        Insert: {
          address?: string | null
          category: string
          contact_name?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          name: string
          notes?: string | null
          phone?: string | null
          status?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          address?: string | null
          category?: string
          contact_name?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          name?: string
          notes?: string | null
          phone?: string | null
          status?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
