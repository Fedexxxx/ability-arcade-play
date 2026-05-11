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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      challenges: {
        Row: {
          active: boolean
          age_band: string
          concept: string | null
          created_at: string
          id: string
          module_id: string
          mountain_id: string
          payload: Json
          sort_order: number
          tier: string
          type: string
        }
        Insert: {
          active?: boolean
          age_band: string
          concept?: string | null
          created_at?: string
          id?: string
          module_id: string
          mountain_id: string
          payload: Json
          sort_order?: number
          tier: string
          type: string
        }
        Update: {
          active?: boolean
          age_band?: string
          concept?: string | null
          created_at?: string
          id?: string
          module_id?: string
          mountain_id?: string
          payload?: Json
          sort_order?: number
          tier?: string
          type?: string
        }
        Relationships: []
      }
      explorer_progress: {
        Row: {
          explorer_id: string
          id: string
          level: number
          updated_at: string
          xp_total: number
        }
        Insert: {
          explorer_id: string
          id?: string
          level?: number
          updated_at?: string
          xp_total?: number
        }
        Update: {
          explorer_id?: string
          id?: string
          level?: number
          updated_at?: string
          xp_total?: number
        }
        Relationships: [
          {
            foreignKeyName: "explorer_progress_explorer_id_fkey"
            columns: ["explorer_id"]
            isOneToOne: true
            referencedRelation: "explorer_state"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "explorer_progress_explorer_id_fkey"
            columns: ["explorer_id"]
            isOneToOne: true
            referencedRelation: "explorers"
            referencedColumns: ["id"]
          },
        ]
      }
      explorers: {
        Row: {
          age_band: string
          avatar_emoji: string
          created_at: string
          id: string
          name: string
        }
        Insert: {
          age_band: string
          avatar_emoji?: string
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          age_band?: string
          avatar_emoji?: string
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      ledger_entries: {
        Row: {
          amount: number
          created_at: string
          dedup_key: string
          explorer_id: string
          id: string
          label: string
          reason: string
        }
        Insert: {
          amount: number
          created_at?: string
          dedup_key: string
          explorer_id: string
          id?: string
          label: string
          reason: string
        }
        Update: {
          amount?: number
          created_at?: string
          dedup_key?: string
          explorer_id?: string
          id?: string
          label?: string
          reason?: string
        }
        Relationships: [
          {
            foreignKeyName: "ledger_entries_explorer_id_fkey"
            columns: ["explorer_id"]
            isOneToOne: false
            referencedRelation: "explorer_state"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ledger_entries_explorer_id_fkey"
            columns: ["explorer_id"]
            isOneToOne: false
            referencedRelation: "explorers"
            referencedColumns: ["id"]
          },
        ]
      }
      module_completions: {
        Row: {
          completed_at: string
          explorer_id: string
          id: string
          module_id: string
          mountain_id: string
          score: number
          tier: string
        }
        Insert: {
          completed_at?: string
          explorer_id: string
          id?: string
          module_id: string
          mountain_id: string
          score: number
          tier: string
        }
        Update: {
          completed_at?: string
          explorer_id?: string
          id?: string
          module_id?: string
          mountain_id?: string
          score?: number
          tier?: string
        }
        Relationships: [
          {
            foreignKeyName: "module_completions_explorer_id_fkey"
            columns: ["explorer_id"]
            isOneToOne: false
            referencedRelation: "explorer_state"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "module_completions_explorer_id_fkey"
            columns: ["explorer_id"]
            isOneToOne: false
            referencedRelation: "explorers"
            referencedColumns: ["id"]
          },
        ]
      }
      module_tiers: {
        Row: {
          explorer_id: string
          id: string
          module_id: string
          mountain_id: string
          pinned: boolean
          recent_results: boolean[]
          tier: string
          updated_at: string
        }
        Insert: {
          explorer_id: string
          id?: string
          module_id: string
          mountain_id: string
          pinned?: boolean
          recent_results?: boolean[]
          tier?: string
          updated_at?: string
        }
        Update: {
          explorer_id?: string
          id?: string
          module_id?: string
          mountain_id?: string
          pinned?: boolean
          recent_results?: boolean[]
          tier?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "module_tiers_explorer_id_fkey"
            columns: ["explorer_id"]
            isOneToOne: false
            referencedRelation: "explorer_state"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "module_tiers_explorer_id_fkey"
            columns: ["explorer_id"]
            isOneToOne: false
            referencedRelation: "explorers"
            referencedColumns: ["id"]
          },
        ]
      }
      mountain_progress: {
        Row: {
          explorer_id: string
          id: string
          mountain_id: string
          pct_complete: number
          status: string
          updated_at: string
        }
        Insert: {
          explorer_id: string
          id?: string
          mountain_id: string
          pct_complete?: number
          status?: string
          updated_at?: string
        }
        Update: {
          explorer_id?: string
          id?: string
          mountain_id?: string
          pct_complete?: number
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "mountain_progress_explorer_id_fkey"
            columns: ["explorer_id"]
            isOneToOne: false
            referencedRelation: "explorer_state"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mountain_progress_explorer_id_fkey"
            columns: ["explorer_id"]
            isOneToOne: false
            referencedRelation: "explorers"
            referencedColumns: ["id"]
          },
        ]
      }
      owned_items: {
        Row: {
          acquired_at: string
          equipped: boolean
          explorer_id: string
          id: string
          item_id: string
          slot: string
        }
        Insert: {
          acquired_at?: string
          equipped?: boolean
          explorer_id: string
          id?: string
          item_id: string
          slot: string
        }
        Update: {
          acquired_at?: string
          equipped?: boolean
          explorer_id?: string
          id?: string
          item_id?: string
          slot?: string
        }
        Relationships: [
          {
            foreignKeyName: "owned_items_explorer_id_fkey"
            columns: ["explorer_id"]
            isOneToOne: false
            referencedRelation: "explorer_state"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "owned_items_explorer_id_fkey"
            columns: ["explorer_id"]
            isOneToOne: false
            referencedRelation: "explorers"
            referencedColumns: ["id"]
          },
        ]
      }
      wallet: {
        Row: {
          balance: number
          explorer_id: string
          id: string
          updated_at: string
        }
        Insert: {
          balance?: number
          explorer_id: string
          id?: string
          updated_at?: string
        }
        Update: {
          balance?: number
          explorer_id?: string
          id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "wallet_explorer_id_fkey"
            columns: ["explorer_id"]
            isOneToOne: true
            referencedRelation: "explorer_state"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wallet_explorer_id_fkey"
            columns: ["explorer_id"]
            isOneToOne: true
            referencedRelation: "explorers"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      explorer_state: {
        Row: {
          age_band: string | null
          alticoins: number | null
          avatar_emoji: string | null
          created_at: string | null
          id: string | null
          level: number | null
          name: string | null
          xp_total: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      create_explorer: {
        Args: { p_age_band: string; p_avatar: string; p_name: string }
        Returns: string
      }
      current_explorer_id: { Args: never; Returns: string }
      set_config: {
        Args: { is_local: boolean; new_value: string; setting_name: string }
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
