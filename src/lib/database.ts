import { supabase, executeQuery } from './supabase'
import type {
  Bundle,
  BundleWithKlasters,
  Klaster,
  KlasterWithIndikators,
  Indikator,
  IndikatorWithDetails,
  ScoringIndikator,
  TargetAchievementIndikator,
  Puskesmas,
  Penilaian,
  PenilaianInsert,
  PenilaianUpdate,
  Evaluasi,
  EvaluasiInsert,
  EvaluasiUpdate,
  Verifikasi,
  VerifikasiInsert,
  VerifikasiUpdate,
  User,
  UserInsert,
  UserUpdate
} from '@/types/database'

// Bundle operations
export const bundleService = {
  // Get all bundles
  async getAll() {
    return executeQuery(
      supabase
        .from('bundles')
        .select('*')
        .order('tahun', { ascending: false })
    )
  },

  // Get bundle by ID with full details
  async getById(id: number) {
    return executeQuery(
      supabase
        .from('bundles')
        .select(`
          *,
          klasters (
            *,
            indikators (
              *,
              scoring_indikators (*),
              target_achievement_indikators (*)
            )
          )
        `)
        .eq('id', id)
        .single()
    )
  },

  // Get active bundle
  async getActive() {
    return executeQuery(
      supabase
        .from('bundles')
        .select(`
          *,
          klasters (
            *,
            indikators (
              *,
              scoring_indikators (*),
              target_achievement_indikators (*)
            )
          )
        `)
        .eq('status', 'active')
        .single()
    )
  }
}

// Puskesmas operations
export const puskesmasService = {
  // Get all puskesmas
  async getAll() {
    return executeQuery(
      supabase
        .from('puskesmas')
        .select('*')
        .order('nama')
    )
  },

  // Get puskesmas by ID
  async getById(id: number) {
    return executeQuery(
      supabase
        .from('puskesmas')
        .select('*')
        .eq('id', id)
        .single()
    )
  }
}

// Penilaian operations
export const penilaianService = {
  // Get penilaian by puskesmas and bundle
  async getByPuskesmasAndBundle(puskesmasId: number, bundleId: number) {
    return executeQuery(
      supabase
        .from('penilaians')
        .select(`
          *,
          indikator:indikators (
            *,
            scoring_indikators (*),
            target_achievement_indikators (*)
          )
        `)
        .eq('puskesmas_id', puskesmasId)
        .eq('bundle_id', bundleId)
    )
  },

  // Upsert penilaian
  async upsert(penilaian: PenilaianInsert) {
    return executeQuery(
      supabase
        .from('penilaians')
        .upsert(penilaian, {
          onConflict: 'puskesmas_id,bundle_id,indikator_id,periode'
        })
        .select()
    )
  },

  // Update penilaian
  async update(id: number, updates: PenilaianUpdate) {
    return executeQuery(
      supabase
        .from('penilaians')
        .update(updates)
        .eq('id', id)
        .select()
    )
  },

  // Get all penilaian for verification (dinkes only)
  async getAllForVerification() {
    return executeQuery(
      supabase
        .from('penilaians')
        .select(`
          *,
          puskesmas (*),
          indikator:indikators (*),
          bundle:bundles (*)
        `)
        .order('created_at', { ascending: false })
    )
  }
}

// Evaluasi operations
export const evaluasiService = {
  // Get evaluasi by puskesmas and bundle
  async getByPuskesmasAndBundle(puskesmasId: number, bundleId: number) {
    return executeQuery(
      supabase
        .from('evaluasis')
        .select('*')
        .eq('puskesmas_id', puskesmasId)
        .eq('bundle_id', bundleId)
        .order('triwulan')
    )
  },

  // Upsert evaluasi
  async upsert(evaluasi: EvaluasiInsert) {
    return executeQuery(
      supabase
        .from('evaluasis')
        .upsert(evaluasi, {
          onConflict: 'puskesmas_id,bundle_id,triwulan,tahun'
        })
        .select()
    )
  },

  // Update evaluasi
  async update(id: number, updates: EvaluasiUpdate) {
    return executeQuery(
      supabase
        .from('evaluasis')
        .update(updates)
        .eq('id', id)
        .select()
    )
  }
}

// Verifikasi operations
export const verifikasiService = {
  // Get all verifikasi (dinkes only)
  async getAll() {
    return executeQuery(
      supabase
        .from('verifikasis')
        .select(`
          *,
          puskesmas (*),
          bundle:bundles (*),
          verified_by_user:users!verifikasis_verified_by_fkey (*)
        `)
        .order('created_at', { ascending: false })
    )
  },

  // Get verifikasi by puskesmas
  async getByPuskesmas(puskesmasId: number) {
    return executeQuery(
      supabase
        .from('verifikasis')
        .select(`
          *,
          bundle:bundles (*),
          verified_by_user:users!verifikasis_verified_by_fkey (*)
        `)
        .eq('puskesmas_id', puskesmasId)
        .order('created_at', { ascending: false })
    )
  },

  // Upsert verifikasi
  async upsert(verifikasi: VerifikasiInsert) {
    return executeQuery(
      supabase
        .from('verifikasis')
        .upsert(verifikasi, {
          onConflict: 'puskesmas_id,bundle_id,periode'
        })
        .select()
    )
  },

  // Update verifikasi
  async update(id: number, updates: VerifikasiUpdate) {
    return executeQuery(
      supabase
        .from('verifikasis')
        .update(updates)
        .eq('id', id)
        .select()
    )
  }
}

// User operations
export const userService = {
  // Get current user profile
  async getCurrentProfile() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { data: null, error: { message: 'Not authenticated' } }

    return executeQuery(
      supabase
        .from('users')
        .select(`
          *,
          puskesmas (*)
        `)
        .eq('id', user.id)
        .single()
    )
  },

  // Create user profile
  async createProfile(profile: UserInsert) {
    return executeQuery(
      supabase
        .from('users')
        .insert(profile)
        .select()
        .single()
    )
  },

  // Update user profile
  async updateProfile(id: string, updates: UserUpdate) {
    return executeQuery(
      supabase
        .from('users')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
    )
  }
}

// Statistics and reporting
export const statisticsService = {
  // Get dashboard statistics for puskesmas
  async getPuskesmasStats(puskesmasId: number, bundleId: number) {
    // Get total indikators count
    const { data: indikators } = await supabase
      .from('indikators')
      .select('id, klaster:klasters!inner(bundle_id)')
      .eq('klaster.bundle_id', bundleId)

    // Get filled penilaians count
    const { data: penilaians } = await supabase
      .from('penilaians')
      .select('id')
      .eq('puskesmas_id', puskesmasId)
      .eq('bundle_id', bundleId)
      .not('calculated_percentage', 'is', null)

    // Get evaluasi completion
    const { data: evaluasis } = await supabase
      .from('evaluasis')
      .select('id')
      .eq('puskesmas_id', puskesmasId)
      .eq('bundle_id', bundleId)

    return {
      data: {
        totalIndikators: indikators?.length || 0,
        filledIndikators: penilaians?.length || 0,
        completedEvaluasi: evaluasis?.length || 0,
        progress: indikators?.length ? Math.round((penilaians?.length || 0) / indikators.length * 100) : 0
      },
      error: null
    }
  },

  // Get dashboard statistics for dinkes
  async getDinkesStats(bundleId: number) {
    // Get total puskesmas count
    const { data: puskesmas } = await supabase
      .from('puskesmas')
      .select('id')

    // Get verifikasi statistics
    const { data: verifikasis } = await supabase
      .from('verifikasis')
      .select('status')
      .eq('bundle_id', bundleId)

    const pending = verifikasis?.filter(v => v.status === 'pending').length || 0
    const approved = verifikasis?.filter(v => v.status === 'approved').length || 0
    const revision = verifikasis?.filter(v => v.status === 'revision').length || 0

    return {
      data: {
        totalPuskesmas: puskesmas?.length || 0,
        pendingVerifikasi: pending,
        approvedVerifikasi: approved,
        revisionVerifikasi: revision
      },
      error: null
    }
  }
}