#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js'

async function smokeTestSupabase() {
  // Environment variables kontrolü
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl) {
    console.error('❌ NEXT_PUBLIC_SUPABASE_URL environment variable is missing')
    process.exit(1)
  }

  if (!supabaseAnonKey) {
    console.error('❌ NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable is missing')
    process.exit(1)
  }

  try {
    // Supabase client oluştur
    const supabase = createClient(supabaseUrl, supabaseAnonKey)
    
    // Auth session kontrolü (basit bağlantı testi)
    const { error } = await supabase.auth.getSession()
    
    if (error) {
      console.error('❌ Supabase connection error:', error.message)
      process.exit(1)
    }
    
    // Başarılı
    console.log('✅ SUPABASE_SMOKE_OK')
    process.exit(0)
    
  } catch (error) {
    console.error('❌ Supabase smoke test failed:', error.message)
    process.exit(1)
  }
}

smokeTestSupabase()