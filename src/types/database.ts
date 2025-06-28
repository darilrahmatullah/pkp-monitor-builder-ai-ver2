// Database type definitions
// These will be generated from your Supabase schema

export interface Bundle {
  id: number
  tahun: number
  judul: string
  status: 'draft' | 'active' | 'completed'
  created_at: string
  updated_at: string
}

export interface Klaster {
  id: number
  bundle_id: number
  nama_klaster: string
  urutan: number
  created_at: string
  updated_at: string
}

export interface Indikator {
  id: number
  klaster_id: number
  nama_indikator: string
  definisi_operasional: string
  type: 'scoring' | 'target_achievement'
  urutan: number
  created_at: string
  updated_at: string
}

export interface ScoringIndikator {
  id: number
  indikator_id: number
  skor_0: string
  skor_4: string
  skor_7: string
  skor_10: string
}

export interface TargetAchievementIndikator {
  id: number
  indikator_id: number
  target_percentage: number
  total_sasaran: number
  satuan: string
  periodicity: 'annual' | 'monthly'
}

export interface Puskesmas {
  id: number
  nama: string
  kode: string
  alamat?: string
  created_at: string
  updated_at: string
}

export interface Penilaian {
  id: number
  puskesmas_id: number
  bundle_id: number
  indikator_id: number
  periode: string
  score?: number
  actual_achievement?: number
  calculated_percentage?: number
  created_at: string
  updated_at: string
}

export interface Evaluasi {
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

export interface Verifikasi {
  id: number
  penilaian_id: number
  status: 'pending' | 'approved' | 'revision'
  komentar: string
  verified_by: string
  verified_at: string
  created_at: string
  updated_at: string
}