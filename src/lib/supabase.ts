import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

// Fallback values for development
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://demo-placeholder.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'demo-placeholder-key'

// Check if we have valid Supabase credentials
const hasValidCredentials = supabaseUrl !== 'https://demo-placeholder.supabase.co' && 
                           supabaseAnonKey !== 'demo-placeholder-key' &&
                           supabaseUrl.includes('.supabase.co') &&
                           !supabaseUrl.includes('your-project-ref') &&
                           !supabaseAnonKey.includes('your-anon-key') &&
                           !supabaseAnonKey.includes('placeholder')

if (!hasValidCredentials) {
  console.warn('⚠️ Supabase credentials not configured properly. Using demo mode.')
  console.warn('Required variables: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY')
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  db: {
    schema: 'public'
  },
  global: {
    headers: {
      'X-Client-Info': 'pkp-monitor'
    }
  }
})

// Helper function to check if Supabase is properly configured
export function isSupabaseConfigured(): boolean {
  return hasValidCredentials
}

// Helper function to handle Supabase errors
export function handleSupabaseError(error: any) {
  console.error('Supabase error:', error)
  
  // Check for common connection issues
  if (error?.message?.includes('fetch')) {
    return {
      message: 'Tidak dapat terhubung ke database. Periksa koneksi internet atau konfigurasi Supabase.',
      details: error?.details || null,
      hint: 'Pastikan VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY sudah dikonfigurasi dengan benar',
      code: error?.code || 'CONNECTION_ERROR'
    }
  }
  
  return {
    message: error?.message || 'Terjadi kesalahan yang tidak terduga',
    details: error?.details || null,
    hint: error?.hint || null,
    code: error?.code || null
  }
}

// Helper function for consistent error handling in queries
export async function executeQuery<T>(
  queryPromise: Promise<{ data: T | null; error: any }>
): Promise<{ data: T | null; error: any }> {
  try {
    // Check if Supabase is configured before making queries
    if (!hasValidCredentials) {
      return {
        data: null,
        error: {
          message: 'Supabase belum dikonfigurasi. Silakan setup environment variables terlebih dahulu.',
          code: 'SUPABASE_NOT_CONFIGURED'
        }
      }
    }

    const result = await queryPromise
    if (result.error) {
      console.error('Query error:', result.error)
    }
    return result
  } catch (error) {
    console.error('Unexpected query error:', error)
    return {
      data: null,
      error: handleSupabaseError(error)
    }
  }
}

// Test connection function with better error handling
export async function testSupabaseConnection(): Promise<boolean> {
  try {
    if (!hasValidCredentials) {
      console.log('Supabase not configured, skipping connection test')
      return false
    }
    
    // Add timeout to prevent hanging
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('Connection timeout')), 5000)
    })
    
    const connectionPromise = supabase.from('puskesmas').select('count').limit(1)
    
    const { data, error } = await Promise.race([connectionPromise, timeoutPromise])
    
    if (error) {
      console.warn('Supabase connection test failed:', error.message)
      return false
    }
    
    console.log('Supabase connection successful')
    return true
  } catch (error: any) {
    console.warn('Supabase connection test failed:', error?.message || 'Unknown error')
    return false
  }
}