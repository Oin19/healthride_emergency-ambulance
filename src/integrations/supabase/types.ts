export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      ambulance_request_audit_log: {
        Row: {
          action: string
          actor_user_id: string | null
          changed_fields: Json | null
          created_at: string
          id: string
          new_driver_id: string | null
          new_row: Json | null
          new_status: string | null
          old_driver_id: string | null
          old_row: Json | null
          old_status: string | null
          request_id: string
        }
        Insert: {
          action: string
          actor_user_id?: string | null
          changed_fields?: Json | null
          created_at?: string
          id?: string
          new_driver_id?: string | null
          new_row?: Json | null
          new_status?: string | null
          old_driver_id?: string | null
          old_row?: Json | null
          old_status?: string | null
          request_id: string
        }
        Update: {
          action?: string
          actor_user_id?: string | null
          changed_fields?: Json | null
          created_at?: string
          id?: string
          new_driver_id?: string | null
          new_row?: Json | null
          new_status?: string | null
          old_driver_id?: string | null
          old_row?: Json | null
          old_status?: string | null
          request_id?: string
        }
        Relationships: []
      }
      ambulance_requests: {
        Row: {
          city: string
          created_at: string
          driver_id: string | null
          driver_lat: number | null
          driver_lng: number | null
          emergency_type: string
          eta_minutes: number | null
          id: string
          notes: string | null
          patient_address: string | null
          patient_lat: number
          patient_lng: number
          patient_name: string | null
          patient_phone: string | null
          patient_user_id: string | null
          status: string
          updated_at: string
        }
        Insert: {
          city?: string
          created_at?: string
          driver_id?: string | null
          driver_lat?: number | null
          driver_lng?: number | null
          emergency_type: string
          eta_minutes?: number | null
          id?: string
          notes?: string | null
          patient_address?: string | null
          patient_lat: number
          patient_lng: number
          patient_name?: string | null
          patient_phone?: string | null
          patient_user_id?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          city?: string
          created_at?: string
          driver_id?: string | null
          driver_lat?: number | null
          driver_lng?: number | null
          emergency_type?: string
          eta_minutes?: number | null
          id?: string
          notes?: string | null
          patient_address?: string | null
          patient_lat?: number
          patient_lng?: number
          patient_name?: string | null
          patient_phone?: string | null
          patient_user_id?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ambulance_requests_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "driver_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      driver_profiles: {
        Row: {
          ambulance_type: string
          city: string
          created_at: string
          current_lat: number | null
          current_lng: number | null
          full_name: string
          id: string
          is_available: boolean
          mobile: string
          registration_id: string | null
          updated_at: string
          user_id: string
          vehicle_number: string
        }
        Insert: {
          ambulance_type: string
          city?: string
          created_at?: string
          current_lat?: number | null
          current_lng?: number | null
          full_name: string
          id?: string
          is_available?: boolean
          mobile: string
          registration_id?: string | null
          updated_at?: string
          user_id: string
          vehicle_number: string
        }
        Update: {
          ambulance_type?: string
          city?: string
          created_at?: string
          current_lat?: number | null
          current_lng?: number | null
          full_name?: string
          id?: string
          is_available?: boolean
          mobile?: string
          registration_id?: string | null
          updated_at?: string
          user_id?: string
          vehicle_number?: string
        }
        Relationships: [
          {
            foreignKeyName: "driver_profiles_registration_id_fkey"
            columns: ["registration_id"]
            isOneToOne: false
            referencedRelation: "driver_registrations"
            referencedColumns: ["id"]
          },
        ]
      }
      driver_registrations: {
        Row: {
          admin_notes: string | null
          ambulance_type: string
          created_at: string
          hospital_name: string | null
          id: string
          license_number: string
          mobile: string
          ownership_type: string
          status: string
          updated_at: string
          vehicle_number: string
        }
        Insert: {
          admin_notes?: string | null
          ambulance_type: string
          created_at?: string
          hospital_name?: string | null
          id?: string
          license_number: string
          mobile: string
          ownership_type?: string
          status?: string
          updated_at?: string
          vehicle_number: string
        }
        Update: {
          admin_notes?: string | null
          ambulance_type?: string
          created_at?: string
          hospital_name?: string | null
          id?: string
          license_number?: string
          mobile?: string
          ownership_type?: string
          status?: string
          updated_at?: string
          vehicle_number?: string
        }
        Relationships: []
      }
      emergency_contacts: {
        Row: {
          contact_name: string
          created_at: string
          id: string
          phone: string
          profile_id: string
          relationship: string | null
          updated_at: string
        }
        Insert: {
          contact_name: string
          created_at?: string
          id?: string
          phone: string
          profile_id: string
          relationship?: string | null
          updated_at?: string
        }
        Update: {
          contact_name?: string
          created_at?: string
          id?: string
          phone?: string
          profile_id?: string
          relationship?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "emergency_contacts_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      hospital_registrations: {
        Row: {
          address: string
          admin_notes: string | null
          business_contact: string
          created_at: string
          facilities: string | null
          hospital_name: string
          id: string
          id_number: string
          id_type: string
          status: string
          updated_at: string
        }
        Insert: {
          address: string
          admin_notes?: string | null
          business_contact: string
          created_at?: string
          facilities?: string | null
          hospital_name: string
          id?: string
          id_number: string
          id_type?: string
          status?: string
          updated_at?: string
        }
        Update: {
          address?: string
          admin_notes?: string | null
          business_contact?: string
          created_at?: string
          facilities?: string | null
          hospital_name?: string
          id?: string
          id_number?: string
          id_type?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      insurance_details: {
        Row: {
          created_at: string
          group_number: string | null
          id: string
          policy_number: string | null
          profile_id: string
          provider: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          group_number?: string | null
          id?: string
          policy_number?: string | null
          profile_id: string
          provider?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          group_number?: string | null
          id?: string
          policy_number?: string | null
          profile_id?: string
          provider?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "insurance_details_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      medical_history: {
        Row: {
          allergies: string | null
          conditions: string | null
          created_at: string
          id: string
          medications: string | null
          profile_id: string
          updated_at: string
        }
        Insert: {
          allergies?: string | null
          conditions?: string | null
          created_at?: string
          id?: string
          medications?: string | null
          profile_id: string
          updated_at?: string
        }
        Update: {
          allergies?: string | null
          conditions?: string | null
          created_at?: string
          id?: string
          medications?: string | null
          profile_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "medical_history_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          address: string | null
          blood_type: string | null
          created_at: string
          date_of_birth: string | null
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          address?: string | null
          blood_type?: string | null
          created_at?: string
          date_of_birth?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          address?: string | null
          blood_type?: string | null
          created_at?: string
          date_of_birth?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      security_events: {
        Row: {
          actor_email: string | null
          actor_user_id: string | null
          created_at: string
          details: Json | null
          event_type: string
          id: string
          ip_address: string | null
          resource: string | null
          severity: string
          user_agent: string | null
        }
        Insert: {
          actor_email?: string | null
          actor_user_id?: string | null
          created_at?: string
          details?: Json | null
          event_type: string
          id?: string
          ip_address?: string | null
          resource?: string | null
          severity?: string
          user_agent?: string | null
        }
        Update: {
          actor_email?: string | null
          actor_user_id?: string | null
          created_at?: string
          details?: Json | null
          event_type?: string
          id?: string
          ip_address?: string | null
          resource?: string | null
          severity?: string
          user_agent?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      dispatch_queue: {
        Row: {
          city: string | null
          created_at: string | null
          emergency_type: string | null
          id: string | null
          patient_lat: number | null
          patient_lng: number | null
          status: string | null
        }
        Insert: {
          city?: string | null
          created_at?: string | null
          emergency_type?: string | null
          id?: string | null
          patient_lat?: number | null
          patient_lng?: number | null
          status?: string | null
        }
        Update: {
          city?: string | null
          created_at?: string | null
          emergency_type?: string | null
          id?: string | null
          patient_lat?: number | null
          patient_lng?: number | null
          status?: string | null
        }
        Relationships: []
      }
      security_alerts: {
        Row: {
          event_type: string | null
          first_seen: string | null
          last_seen: string | null
          max_severity: string | null
          occurrences: number | null
          scope: string | null
          scope_key: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_own_profile: { Args: { _profile_id: string }; Returns: boolean }
      log_security_event: {
        Args: {
          _actor_email?: string
          _details?: Json
          _event_type: string
          _ip_address?: string
          _resource?: string
          _severity?: string
          _user_agent?: string
        }
        Returns: string
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
