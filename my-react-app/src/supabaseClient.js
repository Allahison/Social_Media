// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    'Supabase URL and Anon Key must be provided in .env file\n' +
    'Please check your VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY values'
  )
}

export const supabase = createClient(supabaseUrl, supabaseKey)
