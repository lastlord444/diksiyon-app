import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET() {
  const headers = { 'Cache-Control': 'no-store' }
  
  // Environment variables kontrolü
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  const missing: string[] = []
  if (!supabaseUrl) missing.push('NEXT_PUBLIC_SUPABASE_URL')
  if (!supabaseAnonKey) missing.push('NEXT_PUBLIC_SUPABASE_ANON_KEY')
  
  if (missing.length > 0) {
    return NextResponse.json(
      { ok: false, error: 'MISSING_ENV', missing },
      { status: 500, headers }
    )
  }
  
  try {
    // Supabase client oluştur ve bağlantı test et
    const supabase = createClient(supabaseUrl as string, supabaseAnonKey as string)
    const { error } = await supabase.auth.getSession()
    
    if (error) {
      return NextResponse.json(
        { ok: false, error: 'SUPABASE_UNREACHABLE', message: error.message },
        { status: 503, headers }
      )
    }
    
    // Başarılı
    return NextResponse.json(
      { 
        ok: true, 
        service: 'diksiyon-app', 
        supabase: true, 
        ts: new Date().toISOString() 
      },
      { status: 200, headers }
    )
    
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { ok: false, error: 'SUPABASE_UNREACHABLE', message },
      { status: 503, headers }
    )
  }
}