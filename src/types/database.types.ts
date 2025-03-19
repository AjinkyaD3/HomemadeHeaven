export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          first_name: string | null
          last_name: string | null
          phone: string | null
          role: string
          is_verified: boolean
          last_login: string | null
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id: string
          email: string
          first_name?: string | null
          last_name?: string | null
          phone?: string | null
          role?: string
          is_verified?: boolean
          last_login?: string | null
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          email?: string
          first_name?: string | null
          last_name?: string | null
          phone?: string | null
          role?: string
          is_verified?: boolean
          last_login?: string | null
          created_at?: string
          updated_at?: string | null
        }
      }
      products: {
        Row: {
          id: string
          name: string
          description: string
          price: number
          category: string
          image_url: string
          customizable: boolean
          materials: string[]
          dimensions: Json | null
          in_stock: boolean
          featured: boolean
          likes: number | null
          sku: string | null
          seo_title: string | null
          seo_description: string | null
          seo_url: string | null
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          name: string
          description: string
          price: number
          category: string
          image_url: string
          customizable?: boolean
          materials: string[]
          dimensions?: Json | null
          in_stock?: boolean
          featured?: boolean
          likes?: number | null
          sku?: string | null
          seo_title?: string | null
          seo_description?: string | null
          seo_url?: string | null
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          description?: string
          price?: number
          category?: string
          image_url?: string
          customizable?: boolean
          materials?: string[]
          dimensions?: Json | null
          in_stock?: boolean
          featured?: boolean
          likes?: number | null
          sku?: string | null
          seo_title?: string | null
          seo_description?: string | null
          seo_url?: string | null
          created_at?: string
          updated_at?: string | null
        }
      }
      orders: {
        Row: {
          id: string
          user_id: string
          status: string
          payment_status: string
          payment_method: string
          payment_id: string | null
          subtotal: number
          tax: number
          shipping: number
          discount: number | null
          total: number
          shipping_address_id: string
          billing_address_id: string
          coupon_code: string | null
          notes: string | null
          tracking_number: string | null
          tracking_url: string | null
          status_history: Json | null
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          status?: string
          payment_status?: string
          payment_method: string
          payment_id?: string | null
          subtotal: number
          tax: number
          shipping: number
          discount?: number | null
          total: number
          shipping_address_id: string
          billing_address_id: string
          coupon_code?: string | null
          notes?: string | null
          tracking_number?: string | null
          tracking_url?: string | null
          status_history?: Json | null
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          status?: string
          payment_status?: string
          payment_method?: string
          payment_id?: string | null
          subtotal?: number
          tax?: number
          shipping?: number
          discount?: number | null
          total?: number
          shipping_address_id?: string
          billing_address_id?: string
          coupon_code?: string | null
          notes?: string | null
          tracking_number?: string | null
          tracking_url?: string | null
          status_history?: Json | null
          created_at?: string
          updated_at?: string | null
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string
          quantity: number
          price: number
          customizations: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          product_id: string
          quantity: number
          price: number
          customizations?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          product_id?: string
          quantity?: number
          price?: number
          customizations?: Json | null
          created_at?: string
        }
      }
      addresses: {
        Row: {
          id: string
          user_id: string
          name: string
          street: string
          city: string
          state: string
          zip: string
          country: string
          phone: string
          is_default: boolean
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          street: string
          city: string
          state: string
          zip: string
          country: string
          phone: string
          is_default?: boolean
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          street?: string
          city?: string
          state?: string
          zip?: string
          country?: string
          phone?: string
          is_default?: boolean
          created_at?: string
          updated_at?: string | null
        }
      }
      product_favorites: {
        Row: {
          id: string
          user_id: string
          product_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          product_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          product_id?: string
          created_at?: string
        }
      }
      reviews: {
        Row: {
          id: string
          product_id: string
          user_id: string
          user_name: string
          rating: number
          title: string | null
          content: string
          images: string[] | null
          helpful_count: number
          is_verified_purchase: boolean
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          product_id: string
          user_id: string
          user_name: string
          rating: number
          title?: string | null
          content: string
          images?: string[] | null
          helpful_count?: number
          is_verified_purchase?: boolean
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          product_id?: string
          user_id?: string
          user_name?: string
          rating?: number
          title?: string | null
          content?: string
          images?: string[] | null
          helpful_count?: number
          is_verified_purchase?: boolean
          created_at?: string
          updated_at?: string | null
        }
      }
      coupons: {
        Row: {
          id: string
          code: string
          type: string
          value: number
          min_purchase: number | null
          max_discount: number | null
          start_date: string
          end_date: string
          usage_limit: number | null
          usage_count: number
          is_active: boolean
          applicable_products: string[] | null
          applicable_categories: string[] | null
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          code: string
          type: string
          value: number
          min_purchase?: number | null
          max_discount?: number | null
          start_date: string
          end_date: string
          usage_limit?: number | null
          usage_count?: number
          is_active?: boolean
          applicable_products?: string[] | null
          applicable_categories?: string[] | null
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          code?: string
          type?: string
          value?: number
          min_purchase?: number | null
          max_discount?: number | null
          start_date?: string
          end_date?: string
          usage_limit?: number | null
          usage_count?: number
          is_active?: boolean
          applicable_products?: string[] | null
          applicable_categories?: string[] | null
          created_at?: string
          updated_at?: string | null
        }
      }
    }
  }
}