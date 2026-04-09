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
      alert_logs: {
        Row: {
          channel_id: string
          delivered: boolean
          error: string | null
          id: string
          incident_id: string
          payload: Json | null
          sent_at: string
          type: Database["public"]["Enums"]["alert_type"]
          updated_at: string
        }
        Insert: {
          channel_id: string
          delivered?: boolean
          error?: string | null
          id?: string
          incident_id: string
          payload?: Json | null
          sent_at?: string
          type: Database["public"]["Enums"]["alert_type"]
          updated_at?: string
        }
        Update: {
          channel_id?: string
          delivered?: boolean
          error?: string | null
          id?: string
          incident_id?: string
          payload?: Json | null
          sent_at?: string
          type?: Database["public"]["Enums"]["alert_type"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "alert_logs_channel_id_fkey"
            columns: ["channel_id"]
            isOneToOne: false
            referencedRelation: "notification_channels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "alert_logs_incident_id_fkey"
            columns: ["incident_id"]
            isOneToOne: false
            referencedRelation: "incidents"
            referencedColumns: ["id"]
          },
        ]
      }
      checks: {
        Row: {
          checked_at: string
          error: string | null
          id: string
          is_up: boolean
          latency_ms: number | null
          monitor_id: string
          region: string | null
          status_code: number | null
        }
        Insert: {
          checked_at?: string
          error?: string | null
          id?: string
          is_up: boolean
          latency_ms?: number | null
          monitor_id: string
          region?: string | null
          status_code?: number | null
        }
        Update: {
          checked_at?: string
          error?: string | null
          id?: string
          is_up?: boolean
          latency_ms?: number | null
          monitor_id?: string
          region?: string | null
          status_code?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "checks_monitor_id_fkey"
            columns: ["monitor_id"]
            isOneToOne: false
            referencedRelation: "monitors"
            referencedColumns: ["id"]
          },
        ]
      }
      incidents: {
        Row: {
          cause: string | null
          created_at: string
          duration_seconds: number | null
          id: string
          monitor_id: string
          resolved_at: string | null
          started_at: string
          title: string | null
        }
        Insert: {
          cause?: string | null
          created_at?: string
          duration_seconds?: number | null
          id?: string
          monitor_id: string
          resolved_at?: string | null
          started_at: string
          title?: string | null
        }
        Update: {
          cause?: string | null
          created_at?: string
          duration_seconds?: number | null
          id?: string
          monitor_id?: string
          resolved_at?: string | null
          started_at?: string
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "incidents_monitor_id_fkey"
            columns: ["monitor_id"]
            isOneToOne: false
            referencedRelation: "monitors"
            referencedColumns: ["id"]
          },
        ]
      }
      monitors: {
        Row: {
          avg_latency_ms: number | null
          avg_uptime: number
          consecutive_failures: number
          created_at: string
          failure_threshold: number
          id: string
          interval_seconds: Database["public"]["Enums"]["ping_intervals"]
          last_alerted_at: string | null
          last_checked_at: string | null
          method: Database["public"]["Enums"]["http_method"]
          name: string
          next_check_at: string | null
          paused: boolean
          status: Database["public"]["Enums"]["monitor_status"]
          timeout_ms: number
          total_checks: number
          updated_at: string | null
          url: string
          user_id: string
        }
        Insert: {
          avg_latency_ms?: number | null
          avg_uptime?: number
          consecutive_failures?: number
          created_at?: string
          failure_threshold?: number
          id?: string
          interval_seconds?: Database["public"]["Enums"]["ping_intervals"]
          last_alerted_at?: string | null
          last_checked_at?: string | null
          method?: Database["public"]["Enums"]["http_method"]
          name: string
          next_check_at?: string | null
          paused?: boolean
          status?: Database["public"]["Enums"]["monitor_status"]
          timeout_ms?: number
          total_checks?: number
          updated_at?: string | null
          url: string
          user_id: string
        }
        Update: {
          avg_latency_ms?: number | null
          avg_uptime?: number
          consecutive_failures?: number
          created_at?: string
          failure_threshold?: number
          id?: string
          interval_seconds?: Database["public"]["Enums"]["ping_intervals"]
          last_alerted_at?: string | null
          last_checked_at?: string | null
          method?: Database["public"]["Enums"]["http_method"]
          name?: string
          next_check_at?: string | null
          paused?: boolean
          status?: Database["public"]["Enums"]["monitor_status"]
          timeout_ms?: number
          total_checks?: number
          updated_at?: string | null
          url?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "monitors_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      monitors_check_daily: {
        Row: {
          avg_latency_ms: number | null
          day: string
          down_count: number
          downtime_seconds: number | null
          monitor_id: string
          total_checks: number
          up_count: number
        }
        Insert: {
          avg_latency_ms?: number | null
          day: string
          down_count?: number
          downtime_seconds?: number | null
          monitor_id: string
          total_checks?: number
          up_count?: number
        }
        Update: {
          avg_latency_ms?: number | null
          day?: string
          down_count?: number
          downtime_seconds?: number | null
          monitor_id?: string
          total_checks?: number
          up_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "monitors_check_daily_monitor_id_fkey"
            columns: ["monitor_id"]
            isOneToOne: false
            referencedRelation: "monitors"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_channels: {
        Row: {
          created_at: string
          destination: string
          enabled: boolean
          id: string
          monitor_id: string
          name: string | null
          type: Database["public"]["Enums"]["notification_chanels"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          destination: string
          enabled?: boolean
          id?: string
          monitor_id: string
          name?: string | null
          type?: Database["public"]["Enums"]["notification_chanels"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          destination?: string
          enabled?: boolean
          id?: string
          monitor_id?: string
          name?: string | null
          type?: Database["public"]["Enums"]["notification_chanels"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "notification_channels_monitor_id_fkey"
            columns: ["monitor_id"]
            isOneToOne: false
            referencedRelation: "monitors"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          id: string
          monitor_limit: number
          plan: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          monitor_limit?: number
          plan?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          monitor_limit?: number
          plan?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
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
      alert_type: "up" | "down" | "pending"
      http_method: "GET" | "POST" | "HEAD"
      monitor_status: "pending" | "up" | "down" | "paused"
      notification_chanels: "email" | "slack" | "sms" | "webhook"
      ping_intervals: "30" | "60" | "300" | "600"
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
      alert_type: ["up", "down", "pending"],
      http_method: ["GET", "POST", "HEAD"],
      monitor_status: ["pending", "up", "down", "paused"],
      notification_chanels: ["email", "slack", "sms", "webhook"],
      ping_intervals: ["30", "60", "300", "600"],
    },
  },
} as const
