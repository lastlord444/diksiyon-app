'use client'

/**
 * Manual Test Checklist:
 * 1. Login and navigate to /me page
 * 2. Verify attempts list shows real exercise titles (e.g., "Nefes Kontrolü ve Tonlama")
 * 3. Verify no "Silinmiş egzersiz" / "Egzersiz bulunamadı" fallbacks appear
 * 4. Check stats calculations work correctly with exercises relation
 * 5. Ensure attempts without exercises (deleted exercises) are handled gracefully
 */

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

interface AttemptWithExercise {
  id: string;
  created_at: string;
  status: string;
  exercise_id: string;
  exercises: {
    id: string;
    title: string;
  } | null;
}

type AttemptRow = {
  id: string;
  created_at: string;
  status: string;
  exercise_id: string;
  exercises: { id: string; title: string } | null;
};

export default function MePage() {
  const [user, setUser] = useState<User | null>(null)
  const [attempts, setAttempts] = useState<AttemptWithExercise[]>([])
  const [loading, setLoading] = useState(true)
  const [attemptsLoading, setAttemptsLoading] = useState(false)
  const [attemptsError, setAttemptsError] = useState('')
  const router = useRouter()

  useEffect(() => {
    const getUser = async () => {
      try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) {
          router.push('/login')
          return
        }
        
        setUser(user)
        
        // User yüklendikten sonra attempts'leri getir
        await fetchAttempts(user.id)
        
      } catch (error) {
        console.error('Kullanıcı bilgisi alınırken hata:', error)
        router.push('/login')
      } finally {
        setLoading(false)
      }
    }

    getUser()
  }, [router])

  const fetchAttempts = async (userId: string) => {
    setAttemptsLoading(true)
    setAttemptsError('')
    
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('attempts')
        .select('id, created_at, status, exercise_id, exercises!attempts_exercise_id_fkey(id, title)')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(20)

      if (error) {
        setAttemptsError(`DB Hatası: ${error.message}`)
      } else {
        const rows = (data ?? []) as unknown as AttemptRow[];
        
        const formatted: AttemptWithExercise[] = rows.map((r) => ({
          id: r.id,
          created_at: r.created_at,
          status: r.status,
          exercise_id: r.exercise_id,
          exercises: r.exercises ? { id: r.exercises.id, title: r.exercises.title } : null,
        }));
        
        setAttempts(formatted)
      }
    } catch {
      setAttemptsError('Attempts listesi yüklenemedi. Ağ bağlantınızı kontrol edin.')
    } finally {
      setAttemptsLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      const supabase = createClient()
      await supabase.auth.signOut()
      router.push('/login')
    } catch (error) {
      console.error('Çıkış yapılırken hata:', error)
    }
  }

  if (loading) {
    return (
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Profilim</h1>
        <p className="text-gray-600">Yükleniyor...</p>
      </div>
    )
  }

  if (!user) {
    return null // Router redirect çalışıyor
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Profilim</h1>
      
      <div className="space-y-6">
        <section className="border border-gray-200 rounded-lg p-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">
            Kullanıcı Bilgileri
          </h2>
          <p className="text-gray-600 mb-2">
            <strong>E-posta:</strong> {user.email}
          </p>
          <p className="text-gray-600 mb-4">
            <strong>Kayıt tarihi:</strong> {new Date(user.created_at).toLocaleDateString('tr-TR')}
          </p>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Çıkış Yap
          </button>
        </section>
        
        <section className="border border-gray-200 rounded-lg p-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">
            Deneme Geçmişi
          </h2>
          
          {attemptsLoading ? (
            <p className="text-gray-600">Denemeler yükleniyor...</p>
          ) : attemptsError ? (
            <div className="p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg">
              <p className="font-medium">Deneme geçmişi yüklenemedi</p>
              <p className="text-sm mt-1">{attemptsError}</p>
            </div>
          ) : attempts.length === 0 ? (
            <p className="text-gray-600">
              Henüz egzersiz denemesi yapılmamış. Egzersizlere başlamak için <Link href="/" className="text-blue-600 hover:underline">anasayfaya</Link> gidin.
            </p>
          ) : (
            <div className="space-y-3">
              {attempts.map((attempt) => (
                <div key={attempt.id} className="p-3 bg-gray-50 rounded-lg border">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-900">
                        {attempt.exercises?.title || 'Egzersiz bulunamadı'}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        Durum: <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">{attempt.status}</span>
                      </p>
                    </div>
                    <p className="text-sm text-gray-500">
                      {new Date(attempt.created_at).toLocaleDateString('tr-TR', {
                        year: 'numeric',
                        month: 'short', 
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
        
        <section className="border border-gray-200 rounded-lg p-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">
            İstatistikler
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">{attempts.length}</p>
              <p className="text-sm text-blue-800">Toplam Deneme</p>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">
                {attempts.filter(a => a.status === 'started').length}
              </p>
              <p className="text-sm text-green-800">Başlatılan</p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-gray-600">
                {new Set(attempts.filter(a => a.exercises?.id).map(a => a.exercises!.id)).size}
              </p>
              <p className="text-sm text-gray-800">Farklı Egzersiz</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}