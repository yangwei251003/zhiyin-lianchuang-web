// Supabase 数据库类型定义
// 对应 web/supabase/migrations/0001_init_schema.sql 中的表结构
// 严格模式下不使用 any，所有字段均显式声明类型
// 注意：每个表必须包含 Relationships 字段（GenericTable 接口要求），
// 否则 @supabase/postgrest-js 的类型推断会失效，把 Row 推断为 never。

// JSON 类型（用于 text[] 等复合类型的基础定义）
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
      // ===== 用户档案 =====
      profiles: {
        Row: {
          id: string // uuid, 关联 auth.users.id
          email: string
          nickname: string
          avatar_url: string | null
          member_level: string // free / vip / enterprise
          phone: string | null
          created_at: string // timestamptz
          updated_at: string // timestamptz
        }
        Insert: {
          id: string
          email: string
          nickname: string
          avatar_url?: string | null
          member_level?: string
          phone?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          nickname?: string
          avatar_url?: string | null
          member_level?: string
          phone?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }

      // ===== 企业认证 =====
      companies: {
        Row: {
          id: string
          user_id: string // 关联 profiles.id
          company_name: string
          credit_code: string // 18 位统一社会信用代码
          license_image_url: string
          contact_name: string
          contact_phone: string // 11 位手机号
          status: string // pending / approved / rejected
          reject_reason: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          company_name: string
          credit_code: string
          license_image_url: string
          contact_name: string
          contact_phone: string
          status?: string
          reject_reason?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          company_name?: string
          credit_code?: string
          license_image_url?: string
          contact_name?: string
          contact_phone?: string
          status?: string
          reject_reason?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }

      // ===== 订单 =====
      orders: {
        Row: {
          id: string
          user_id: string
          title: string
          category: string // 画册/海报/包装盒/手提袋/名片/其他
          craft: string // 胶印/数码/丝网/UV/烫金
          budget_min: number
          budget_max: number
          region: string
          description: string
          status: string // open / in_progress / completed / cancelled
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          category: string
          craft: string
          budget_min: number
          budget_max: number
          region: string
          description: string
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          category?: string
          craft?: string
          budget_min?: number
          budget_max?: number
          region?: string
          description?: string
          status?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }

      // ===== 报价 =====
      bids: {
        Row: {
          id: string
          order_id: string
          user_id: string
          price: number
          delivery_days: number
          note: string | null
          status: string // pending / accepted / rejected
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          order_id: string
          user_id: string
          price: number
          delivery_days: number
          note?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          user_id?: string
          price?: number
          delivery_days?: number
          note?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }

      // ===== 产能 =====
      capacities: {
        Row: {
          id: string
          user_id: string
          device_type: string
          capacity: string
          region: string
          price_min: number
          price_max: number
          available_date: string // date
          status: string // available / busy / offline
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          device_type: string
          capacity: string
          region: string
          price_min: number
          price_max: number
          available_date: string
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          device_type?: string
          capacity?: string
          region?: string
          price_min?: number
          price_max?: number
          available_date?: string
          status?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }

      // ===== 集采活动 =====
      purchases: {
        Row: {
          id: string
          title: string
          product_name: string
          product_image: string | null
          unit_price: number
          min_quantity: number
          target_quantity: number
          current_quantity: number
          start_time: string // timestamptz
          end_time: string // timestamptz
          status: string // active / ended / cancelled
          description: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          product_name: string
          product_image?: string | null
          unit_price: number
          min_quantity: number
          target_quantity: number
          current_quantity?: number
          start_time: string
          end_time: string
          status?: string
          description: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          product_name?: string
          product_image?: string | null
          unit_price?: number
          min_quantity?: number
          target_quantity?: number
          current_quantity?: number
          start_time?: string
          end_time?: string
          status?: string
          description?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }

      // ===== 集采订单 =====
      purchase_orders: {
        Row: {
          id: string
          purchase_id: string
          user_id: string
          quantity: number
          total_price: number
          status: string // pending / paid / shipped / completed
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          purchase_id: string
          user_id: string
          quantity: number
          total_price: number
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          purchase_id?: string
          user_id?: string
          quantity?: number
          total_price?: number
          status?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }

      // ===== 消息 =====
      messages: {
        Row: {
          id: string
          user_id: string
          type: string // system / order / purchase
          title: string
          content: string
          is_read: boolean
          link: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: string
          title: string
          content: string
          is_read?: boolean
          link?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: string
          title?: string
          content?: string
          is_read?: boolean
          link?: string | null
          created_at?: string
        }
        Relationships: []
      }

      // ===== 创业文章 =====
      articles: {
        Row: {
          id: string
          title: string
          summary: string
          content: string
          cover_image: string | null
          author: string
          tags: string[]
          view_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          summary: string
          content: string
          cover_image?: string | null
          author: string
          tags?: string[]
          view_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          summary?: string
          content?: string
          cover_image?: string | null
          author?: string
          tags?: string[]
          view_count?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }

      // ===== 创业案例 =====
      cases: {
        Row: {
          id: string
          title: string
          industry: string
          summary: string
          content: string
          cover_image: string | null
          investment_amount: number
          revenue: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          industry: string
          summary: string
          content: string
          cover_image?: string | null
          investment_amount: number
          revenue: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          industry?: string
          summary?: string
          content?: string
          cover_image?: string | null
          investment_amount?: number
          revenue?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }

      // ===== 创业导师 =====
      mentors: {
        Row: {
          id: string
          name: string
          title: string
          company: string
          expertise: string[]
          avatar: string | null
          bio: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          title: string
          company: string
          expertise?: string[]
          avatar?: string | null
          bio: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          title?: string
          company?: string
          expertise?: string[]
          avatar?: string | null
          bio?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }

      // ===== 导师预约 =====
      mentor_bookings: {
        Row: {
          id: string
          mentor_id: string
          user_id: string
          topic: string
          description: string
          booking_date: string // date
          booking_time: string // time
          status: string // pending / confirmed / cancelled / completed
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          mentor_id: string
          user_id: string
          topic: string
          description: string
          booking_date: string
          booking_time: string
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          mentor_id?: string
          user_id?: string
          topic?: string
          description?: string
          booking_date?: string
          booking_time?: string
          status?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }

      // ===== AI 纸价预测 =====
      price_predictions: {
        Row: {
          id: string
          paper_type: string // 铜版纸/双胶纸/白卡纸/哑粉铜版纸/轻涂纸/新闻纸
          date: string // date
          price: number
          change_rate: number
          ai_analysis: string
          is_predicted: boolean // true=预测值 false=历史值
          created_at: string
        }
        Insert: {
          id?: string
          paper_type: string
          date: string
          price: number
          change_rate: number
          ai_analysis: string
          is_predicted?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          paper_type?: string
          date?: string
          price?: number
          change_rate?: number
          ai_analysis?: string
          is_predicted?: boolean
          created_at?: string
        }
        Relationships: []
      }
    }
    Views: {}
    Functions: {}
    Enums: {}
  }
}

// 便捷类型导出：单表的 Row/Insert/Update
type PublicSchema = Database['public']
type TableName = keyof PublicSchema['Tables']

export type TablesRow<T extends TableName> = PublicSchema['Tables'][T]['Row']
export type TablesInsert<T extends TableName> =
  PublicSchema['Tables'][T]['Insert']
export type TablesUpdate<T extends TableName> =
  PublicSchema['Tables'][T]['Update']
