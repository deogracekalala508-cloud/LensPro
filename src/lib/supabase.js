import { createClient } from '@supabase/supabase-js'

// Variables d'environnement — disponibles côté client via NEXT_PUBLIC_
const supabaseUrl = (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_SUPABASE_URL) 
  || (typeof window !== 'undefined' && window.__ENV?.NEXT_PUBLIC_SUPABASE_URL)
  || ''
const supabaseAnonKey = (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  || (typeof window !== 'undefined' && window.__ENV?.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  || ''

// Vérifier que les variables sont définies
if (!supabaseUrl || !supabaseAnonKey) {
  if (typeof window !== 'undefined') {
    console.warn('Supabase credentials not configured')
  }
}

export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null
