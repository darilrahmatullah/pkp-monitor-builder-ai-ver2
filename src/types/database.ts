// Updated database type definitions based on the actual Supabase schema

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          role: 'puskesmas' | 'dinkes'
          nama: string
          puskesmas_id: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          role?: 'puskesmas' | 'dinkes'
          nama: string
          puskesmas_id?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          role?: 'puskesmas' | 'dinkes'
          nama?: string
          puskesmas_id?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      puskesmas: {
        Row: {
          id: number
          nama: string
          kode: string
          alamat: string | null
          telepon: string | null
          email: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          nama: string
          kode: string
          alamat?: string | null
          telepon?: string | null
          email?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          nama?: string
          kode?: string
          alamat?: string | null
          telepon?: string | null
          email?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      bundles: {
        Row: {
          id: number
          tahun: number
          judul: string
          status: 'draft' | 'active' | 'completed'
          deskripsi: string | null
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          tahun: number
          judul: string
          status?: 'draft' | 'active' | 'completed'
          deskripsi?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          tahun?: number
          judul?: string
          status?: 'draft' | 'active' | 'completed'
          deskripsi?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      klasters: {
        Row: {
          id: number
          bundle_id: number
          nama_klaster: string
          deskripsi: string | null
          urutan: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          bundle_id: number
          nama_klaster: string
          deskripsi?: string | null
          urutan?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          bundle_id?: number
          nama_klaster?: string
          deskripsi?: string | null
          urutan?: number
          created_at?: string
          updated_at?: string
        }
      }
      indikators: {
        Row: {
          id: number
          klaster_id: number
          nama_indikator: string
          definisi_operasional: string
          type: 'scoring' | 'target_achievement'
          urutan: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          klaster_id: number
          nama_indikator: string
          definisi_operasional: string
          type: 'scoring' | 'target_achievement'
          urutan?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          klaster_id?: number
          nama_indikator?: string
          definisi_operasional?: string
          type?: 'scoring' | 'target_achievement'
          urutan?: number
          created_at?: string
          updated_at?: string
        }
      }
      scoring_indikators: {
        Row: {
          id: number
          indikator_id: number
          skor_0: string
          skor_4: string
          skor_7: string
          skor_10: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          indikator_id: number
          skor_0: string
          skor_4: string
          skor_7: string
          skor_10: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          indikator_id?: number
          skor_0?: string
          skor_4?: string
          skor_7?: string
          skor_10?: string
          created_at?: string
          updated_at?: string
        }
      }
      target_achievement_indikators: {
        Row: {
          id: number
          indikator_id: number
          target_percentage: number
          total_sasaran: number
          satuan: string
          periodicity: 'annual' | 'monthly'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          indikator_id: number
          target_percentage: number
          total_sasaran: number
          satuan: string
          periodicity: 'annual' | 'monthly'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          indikator_id?: number
          target_percentage?: number
          total_sasaran?: number
          satuan?: string
          periodicity?: 'annual' | 'monthly'
          created_at?: string
          updated_at?: string
        }
      }
      penilaians: {
        Row: {
          id: number
          puskesmas_id: number
          bundle_id: number
          indikator_id: number
          periode: string
          score: number | null
          actual_achievement: number | null
          calculated_percentage: number | null
          catatan: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          puskesmas_id: number
          bundle_id: number
          indikator_id: number
          periode: string
          score?: number | null
          actual_achievement?: number | null
          calculated_percentage?: number | null
          catatan?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          puskesmas_id?: number
          bundle_id?: number
          indikator_id?: number
          periode?: string
          score?: number | null
          actual_achievement?: number | null
          calculated_percentage?: number | null
          catatan?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      evaluasis: {
        Row: {
          id: number
          puskesmas_id: number
          bundle_id: number
          triwulan: number
          tahun: number
          analisis: string
          hambatan: string
          rencana: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          puskesmas_id: number
          bundle_id: number
          triwulan: number
          tahun: number
          analisis: string
          hambatan: string
          rencana: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          puskesmas_id?: number
          bundle_id?: number
          triwulan?: number
          tahun?: number
          analisis?: string
          hambatan?: string
          rencana?: string
          created_at?: string
          updated_at?: string
        }
      }
      verifikasis: {
        Row: {
          id: number
          puskesmas_id: number
          bundle_id: number
          periode: string
          status: 'pending' | 'approved' | 'revision'
          komentar: string | null
          verified_by: string | null
          verified_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          puskesmas_id: number
          bundle_id: number
          periode: string
          status?: 'pending' | 'approved' | 'revision'
          komentar?: string | null
          verified_by?: string | null
          verified_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          puskesmas_id?: number
          bundle_id?: number
          periode?: string
          status?: 'pending' | 'approved' | 'revision'
          komentar?: string | null
          verified_by?: string | null
          verified_at?: string | null
          created_at?: string
          updated_at?: string
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
      user_role: 'puskesmas' | 'dinkes'
      bundle_status: 'draft' | 'active' | 'completed'
      indikator_type: 'scoring' | 'target_achievement'
      periodicity_type: 'annual' | 'monthly'
      verifikasi_status: 'pending' | 'approved' | 'revision'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Convenience types for easier usage
export type User = Database['public']['Tables']['users']['Row']
export type Puskesmas = Database['public']['Tables']['puskesmas']['Row']
export type Bundle = Database['public']['Tables']['bundles']['Row']
export type Klaster = Database['public']['Tables']['klasters']['Row']
export type Indikator = Database['public']['Tables']['indikators']['Row']
export type ScoringIndikator = Database['public']['Tables']['scoring_indikators']['Row']
export type TargetAchievementIndikator = Database['public']['Tables']['target_achievement_indikators']['Row']
export type Penilaian = Database['public']['Tables']['penilaians']['Row']
export type Evaluasi = Database['public']['Tables']['evaluasis']['Row']
export type Verifikasi = Database['public']['Tables']['verifikasis']['Row']

// Insert types
export type UserInsert = Database['public']['Tables']['users']['Insert']
export type PuskesmasInsert = Database['public']['Tables']['puskesmas']['Insert']
export type BundleInsert = Database['public']['Tables']['bundles']['Insert']
export type KlasterInsert = Database['public']['Tables']['klasters']['Insert']
export type IndikatorInsert = Database['public']['Tables']['indikators']['Insert']
export type ScoringIndikatorInsert = Database['public']['Tables']['scoring_indikators']['Insert']
export type TargetAchievementIndikatorInsert = Database['public']['Tables']['target_achievement_indikators']['Insert']
export type PenilaianInsert = Database['public']['Tables']['penilaians']['Insert']
export type EvaluasiInsert = Database['public']['Tables']['evaluasis']['Insert']
export type VerifikasiInsert = Database['public']['Tables']['verifikasis']['Insert']

// Update types
export type UserUpdate = Database['public']['Tables']['users']['Update']
export type PuskesmasUpdate = Database['public']['Tables']['puskesmas']['Update']
export type BundleUpdate = Database['public']['Tables']['bundles']['Update']
export type KlasterUpdate = Database['public']['Tables']['klasters']['Update']
export type IndikatorUpdate = Database['public']['Tables']['indikators']['Update']
export type ScoringIndikatorUpdate = Database['public']['Tables']['scoring_indikators']['Update']
export type TargetAchievementIndikatorUpdate = Database['public']['Tables']['target_achievement_indikators']['Update']
export type PenilaianUpdate = Database['public']['Tables']['penilaians']['Update']
export type EvaluasiUpdate = Database['public']['Tables']['evaluasis']['Update']
export type VerifikasiUpdate = Database['public']['Tables']['verifikasis']['Update']

// Enum types
export type UserRole = Database['public']['Enums']['user_role']
export type BundleStatus = Database['public']['Enums']['bundle_status']
export type IndikatorType = Database['public']['Enums']['indikator_type']
export type PeriodicityType = Database['public']['Enums']['periodicity_type']
export type VerifikasiStatus = Database['public']['Enums']['verifikasi_status']

// Extended types with relationships
export interface IndikatorWithDetails extends Indikator {
  scoring_indikators?: ScoringIndikator
  target_achievement_indikators?: TargetAchievementIndikator
}

export interface KlasterWithIndikators extends Klaster {
  indikators?: IndikatorWithDetails[]
}

export interface BundleWithKlasters extends Bundle {
  klasters?: KlasterWithIndikators[]
}

export interface PenilaianWithDetails extends Penilaian {
  indikator?: IndikatorWithDetails
  puskesmas?: Puskesmas
}

export interface EvaluasiWithDetails extends Evaluasi {
  puskesmas?: Puskesmas
  bundle?: Bundle
}

export interface VerifikasiWithDetails extends Verifikasi {
  puskesmas?: Puskesmas
  bundle?: Bundle
  verified_by_user?: User
}