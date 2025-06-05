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
          created_at: string
          updated_at: string
          email: string
          name: string | null
          avatar_url: string | null
        }
        Insert: {
          id: string
          created_at?: string
          updated_at?: string
          email: string
          name?: string | null
          avatar_url?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          email?: string
          name?: string | null
          avatar_url?: string | null
        }
      }
      portfolios: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          user_id: string
          name: string
          description: string | null
          is_public: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id: string
          name: string
          description?: string | null
          is_public?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id?: string
          name?: string
          description?: string | null
          is_public?: boolean
        }
      }
      holdings: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          portfolio_id: string
          coin_id: string
          quantity: number
          purchase_price: number | null
          purchase_date: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          portfolio_id: string
          coin_id: string
          quantity: number
          purchase_price?: number | null
          purchase_date?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          portfolio_id?: string
          coin_id?: string
          quantity?: number
          purchase_price?: number | null
          purchase_date?: string | null
        }
      }
      transactions: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          user_id: string
          type: 'buy' | 'sell' | 'transfer'
          coin_id: string
          quantity: number
          price: number
          fee: number | null
          notes: string | null
          transaction_date: string
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id: string
          type: 'buy' | 'sell' | 'transfer'
          coin_id: string
          quantity: number
          price: number
          fee?: number | null
          notes?: string | null
          transaction_date: string
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id?: string
          type?: 'buy' | 'sell' | 'transfer'
          coin_id?: string
          quantity?: number
          price?: number
          fee?: number | null
          notes?: string | null
          transaction_date?: string
        }
      }
      watchlist: {
        Row: {
          id: string
          created_at: string
          user_id: string
          coin_id: string
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          coin_id: string
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          coin_id?: string
        }
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
  }
}
