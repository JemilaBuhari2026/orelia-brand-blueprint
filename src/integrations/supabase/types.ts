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
      bundle_items: {
        Row: {
          bundle_id: string
          created_at: string
          id: string
          position: number
          product_id: string | null
          quantity: number
          variant_id: string | null
        }
        Insert: {
          bundle_id: string
          created_at?: string
          id?: string
          position?: number
          product_id?: string | null
          quantity?: number
          variant_id?: string | null
        }
        Update: {
          bundle_id?: string
          created_at?: string
          id?: string
          position?: number
          product_id?: string | null
          quantity?: number
          variant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bundle_items_bundle_id_fkey"
            columns: ["bundle_id"]
            isOneToOne: false
            referencedRelation: "product_bundles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bundle_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "commerce_products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bundle_items_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          },
        ]
      }
      commerce_products: {
        Row: {
          base_price: number | null
          catalog_slug: string
          channels: Database["public"]["Enums"]["sales_channel"][]
          commerce_status: Database["public"]["Enums"]["commerce_status"]
          compare_at_price: number | null
          created_at: string
          currency: string | null
          id: string
          notes: string | null
          publicly_visible: boolean
          sellable: boolean
          shipping_class: string | null
          tax_category: string | null
          updated_at: string
        }
        Insert: {
          base_price?: number | null
          catalog_slug: string
          channels?: Database["public"]["Enums"]["sales_channel"][]
          commerce_status?: Database["public"]["Enums"]["commerce_status"]
          compare_at_price?: number | null
          created_at?: string
          currency?: string | null
          id?: string
          notes?: string | null
          publicly_visible?: boolean
          sellable?: boolean
          shipping_class?: string | null
          tax_category?: string | null
          updated_at?: string
        }
        Update: {
          base_price?: number | null
          catalog_slug?: string
          channels?: Database["public"]["Enums"]["sales_channel"][]
          commerce_status?: Database["public"]["Enums"]["commerce_status"]
          compare_at_price?: number | null
          created_at?: string
          currency?: string | null
          id?: string
          notes?: string | null
          publicly_visible?: boolean
          sellable?: boolean
          shipping_class?: string | null
          tax_category?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      contact_enquiries: {
        Row: {
          company: string | null
          created_at: string
          email: string
          enquiry_type: Database["public"]["Enums"]["enquiry_type"]
          id: string
          message: string
          name: string
          phone: string | null
          status: Database["public"]["Enums"]["enquiry_status"]
        }
        Insert: {
          company?: string | null
          created_at?: string
          email: string
          enquiry_type?: Database["public"]["Enums"]["enquiry_type"]
          id?: string
          message: string
          name: string
          phone?: string | null
          status?: Database["public"]["Enums"]["enquiry_status"]
        }
        Update: {
          company?: string | null
          created_at?: string
          email?: string
          enquiry_type?: Database["public"]["Enums"]["enquiry_type"]
          id?: string
          message?: string
          name?: string
          phone?: string | null
          status?: Database["public"]["Enums"]["enquiry_status"]
        }
        Relationships: []
      }
      customers: {
        Row: {
          channel: Database["public"]["Enums"]["sales_channel"]
          created_at: string
          email: string
          full_name: string | null
          id: string
          marketing_opt_in: boolean
          phone: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          channel?: Database["public"]["Enums"]["sales_channel"]
          created_at?: string
          email: string
          full_name?: string | null
          id?: string
          marketing_opt_in?: boolean
          phone?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          channel?: Database["public"]["Enums"]["sales_channel"]
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          marketing_opt_in?: boolean
          phone?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      newsletter_subscribers: {
        Row: {
          consent: boolean
          consent_at: string
          created_at: string
          email: string
          first_name: string | null
          id: string
          source: string
          updated_at: string
        }
        Insert: {
          consent?: boolean
          consent_at?: string
          created_at?: string
          email: string
          first_name?: string | null
          id?: string
          source?: string
          updated_at?: string
        }
        Update: {
          consent?: boolean
          consent_at?: string
          created_at?: string
          email?: string
          first_name?: string | null
          id?: string
          source?: string
          updated_at?: string
        }
        Relationships: []
      }
      order_items: {
        Row: {
          bundle_id: string | null
          created_at: string
          currency_snapshot: string | null
          id: string
          line_total_snapshot: number | null
          order_id: string
          product_id: string | null
          product_name_snapshot: string
          quantity: number
          sku_snapshot: string | null
          unit_price_snapshot: number | null
          variant_id: string | null
          variant_name_snapshot: string | null
        }
        Insert: {
          bundle_id?: string | null
          created_at?: string
          currency_snapshot?: string | null
          id?: string
          line_total_snapshot?: number | null
          order_id: string
          product_id?: string | null
          product_name_snapshot: string
          quantity?: number
          sku_snapshot?: string | null
          unit_price_snapshot?: number | null
          variant_id?: string | null
          variant_name_snapshot?: string | null
        }
        Update: {
          bundle_id?: string | null
          created_at?: string
          currency_snapshot?: string | null
          id?: string
          line_total_snapshot?: number | null
          order_id?: string
          product_id?: string | null
          product_name_snapshot?: string
          quantity?: number
          sku_snapshot?: string | null
          unit_price_snapshot?: number | null
          variant_id?: string | null
          variant_name_snapshot?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "order_items_bundle_id_fkey"
            columns: ["bundle_id"]
            isOneToOne: false
            referencedRelation: "product_bundles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "commerce_products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          billing_address: Json | null
          channel: Database["public"]["Enums"]["sales_channel"]
          created_at: string
          currency: string | null
          customer_id: string | null
          delivery_region: string | null
          discount_total: number | null
          fulfillment_status: Database["public"]["Enums"]["fulfillment_status"]
          id: string
          notes: string | null
          order_number: string
          payment_provider: string | null
          payment_reference: string | null
          payment_status: Database["public"]["Enums"]["payment_status"]
          placed_at: string | null
          shipping_address: Json | null
          shipping_method: string | null
          shipping_total: number | null
          status: Database["public"]["Enums"]["order_status"]
          subtotal: number | null
          tax_total: number | null
          total: number | null
          updated_at: string
        }
        Insert: {
          billing_address?: Json | null
          channel?: Database["public"]["Enums"]["sales_channel"]
          created_at?: string
          currency?: string | null
          customer_id?: string | null
          delivery_region?: string | null
          discount_total?: number | null
          fulfillment_status?: Database["public"]["Enums"]["fulfillment_status"]
          id?: string
          notes?: string | null
          order_number: string
          payment_provider?: string | null
          payment_reference?: string | null
          payment_status?: Database["public"]["Enums"]["payment_status"]
          placed_at?: string | null
          shipping_address?: Json | null
          shipping_method?: string | null
          shipping_total?: number | null
          status?: Database["public"]["Enums"]["order_status"]
          subtotal?: number | null
          tax_total?: number | null
          total?: number | null
          updated_at?: string
        }
        Update: {
          billing_address?: Json | null
          channel?: Database["public"]["Enums"]["sales_channel"]
          created_at?: string
          currency?: string | null
          customer_id?: string | null
          delivery_region?: string | null
          discount_total?: number | null
          fulfillment_status?: Database["public"]["Enums"]["fulfillment_status"]
          id?: string
          notes?: string | null
          order_number?: string
          payment_provider?: string | null
          payment_reference?: string | null
          payment_status?: Database["public"]["Enums"]["payment_status"]
          placed_at?: string | null
          shipping_address?: Json | null
          shipping_method?: string | null
          shipping_total?: number | null
          status?: Database["public"]["Enums"]["order_status"]
          subtotal?: number | null
          tax_total?: number | null
          total?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      product_bundles: {
        Row: {
          channels: Database["public"]["Enums"]["sales_channel"][]
          commerce_status: Database["public"]["Enums"]["commerce_status"]
          compare_at_price: number | null
          created_at: string
          currency: string | null
          description: string | null
          id: string
          name: string
          price: number | null
          publicly_visible: boolean
          slug: string
          updated_at: string
        }
        Insert: {
          channels?: Database["public"]["Enums"]["sales_channel"][]
          commerce_status?: Database["public"]["Enums"]["commerce_status"]
          compare_at_price?: number | null
          created_at?: string
          currency?: string | null
          description?: string | null
          id?: string
          name: string
          price?: number | null
          publicly_visible?: boolean
          slug: string
          updated_at?: string
        }
        Update: {
          channels?: Database["public"]["Enums"]["sales_channel"][]
          commerce_status?: Database["public"]["Enums"]["commerce_status"]
          compare_at_price?: number | null
          created_at?: string
          currency?: string | null
          description?: string | null
          id?: string
          name?: string
          price?: number | null
          publicly_visible?: boolean
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      product_variants: {
        Row: {
          availability: Database["public"]["Enums"]["availability_status"]
          barcode: string | null
          channels: Database["public"]["Enums"]["sales_channel"][]
          compare_at_price: number | null
          created_at: string
          currency: string | null
          height_mm: number | null
          id: string
          inventory_quantity: number | null
          inventory_tracked: boolean
          is_default: boolean
          length_mm: number | null
          low_stock_threshold: number | null
          name: string
          pack_size: number | null
          position: number
          preorder: boolean
          price: number | null
          product_id: string
          publicly_visible: boolean
          sku: string | null
          unit: string | null
          updated_at: string
          variant_type: string | null
          weight_grams: number | null
          width_mm: number | null
        }
        Insert: {
          availability?: Database["public"]["Enums"]["availability_status"]
          barcode?: string | null
          channels?: Database["public"]["Enums"]["sales_channel"][]
          compare_at_price?: number | null
          created_at?: string
          currency?: string | null
          height_mm?: number | null
          id?: string
          inventory_quantity?: number | null
          inventory_tracked?: boolean
          is_default?: boolean
          length_mm?: number | null
          low_stock_threshold?: number | null
          name: string
          pack_size?: number | null
          position?: number
          preorder?: boolean
          price?: number | null
          product_id: string
          publicly_visible?: boolean
          sku?: string | null
          unit?: string | null
          updated_at?: string
          variant_type?: string | null
          weight_grams?: number | null
          width_mm?: number | null
        }
        Update: {
          availability?: Database["public"]["Enums"]["availability_status"]
          barcode?: string | null
          channels?: Database["public"]["Enums"]["sales_channel"][]
          compare_at_price?: number | null
          created_at?: string
          currency?: string | null
          height_mm?: number | null
          id?: string
          inventory_quantity?: number | null
          inventory_tracked?: boolean
          is_default?: boolean
          length_mm?: number | null
          low_stock_threshold?: number | null
          name?: string
          pack_size?: number | null
          position?: number
          preorder?: boolean
          price?: number | null
          product_id?: string
          publicly_visible?: boolean
          sku?: string | null
          unit?: string | null
          updated_at?: string
          variant_type?: string | null
          weight_grams?: number | null
          width_mm?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "product_variants_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "commerce_products"
            referencedColumns: ["id"]
          },
        ]
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
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      subscribe_to_newsletter: {
        Args: {
          _consent?: boolean
          _email: string
          _first_name?: string
          _source?: string
        }
        Returns: string
      }
    }
    Enums: {
      app_role: "admin" | "staff" | "customer"
      availability_status:
        | "unknown"
        | "in_stock"
        | "out_of_stock"
        | "preorder"
        | "discontinued"
      commerce_status: "not_ready" | "draft" | "ready" | "live" | "retired"
      enquiry_status: "new" | "in_progress" | "closed"
      enquiry_type:
        | "general"
        | "corporate"
        | "wholesale"
        | "gifting"
        | "vending"
        | "partnership"
        | "other"
      fulfillment_status:
        | "unfulfilled"
        | "partially_fulfilled"
        | "fulfilled"
        | "returned"
      order_status:
        | "pending"
        | "confirmed"
        | "processing"
        | "packed"
        | "shipped"
        | "delivered"
        | "cancelled"
        | "refunded"
      payment_status:
        | "pending"
        | "paid"
        | "failed"
        | "refunded"
        | "partially_refunded"
      sales_channel: "dtc" | "wholesale" | "corporate" | "gifting"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
      app_role: ["admin", "staff", "customer"],
      availability_status: [
        "unknown",
        "in_stock",
        "out_of_stock",
        "preorder",
        "discontinued",
      ],
      commerce_status: ["not_ready", "draft", "ready", "live", "retired"],
      enquiry_status: ["new", "in_progress", "closed"],
      enquiry_type: [
        "general",
        "corporate",
        "wholesale",
        "gifting",
        "vending",
        "partnership",
        "other",
      ],
      fulfillment_status: [
        "unfulfilled",
        "partially_fulfilled",
        "fulfilled",
        "returned",
      ],
      order_status: [
        "pending",
        "confirmed",
        "processing",
        "packed",
        "shipped",
        "delivered",
        "cancelled",
        "refunded",
      ],
      payment_status: [
        "pending",
        "paid",
        "failed",
        "refunded",
        "partially_refunded",
      ],
      sales_channel: ["dtc", "wholesale", "corporate", "gifting"],
    },
  },
} as const
