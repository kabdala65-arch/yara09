import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)

if (!isSupabaseConfigured) {
  // eslint-disable-next-line no-console
  console.warn(
    'لسه محطتش بيانات Supabase في ملف .env — راجعي ملف SUPABASE_SETUP.md'
  )
}

// لو الإعدادات لسه مش متظبطة، بنستخدم قيم وهمية عشان الموقع ميقعش
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
)

export const BUCKETS = {
  images: 'gallery-images',
  music: 'site-music',
  voice: 'voice-messages',
}
