'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

export default function MePage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
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
      } catch (error) {
        console.error('Kullanıcı bilgisi alınırken hata:', error)
        router.push('/login')
      } finally {
        setLoading(false)
      }
    }

    getUser()
  }, [router])

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
            İlerleme
          </h2>
          <p className="text-gray-600">
            Attempt geçmişi TASK-009&apos;da gelecek. (placeholder)
          </p>
        </section>
        
        <section className="border border-gray-200 rounded-lg p-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">
            İstatistikler
          </h2>
          <p className="text-gray-600">
            Egzersiz istatistikleri burada görünecek. (placeholder)
          </p>
        </section>
      </div>
    </div>
  )
}