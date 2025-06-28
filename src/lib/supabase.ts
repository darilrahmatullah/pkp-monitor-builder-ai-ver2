import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

// Helper function to handle Supabase errors
export function handleSupabaseError(error: any) {
  console.error('Supabase error:', error)
  return {
    message: error?.message || 'An unexpected error occurred',
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