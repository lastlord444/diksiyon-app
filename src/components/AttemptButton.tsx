'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface AttemptButtonProps {
  exerciseId: string;
}

export default function AttemptButton({ exerciseId }: AttemptButtonProps) {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleCreateAttempt = async () => {
    setLoading(true)
    setError('')
    setMessage('')

    try {
      const supabase = createClient()
      
      // Auth kontrolü
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/login')
        return
      }

      // Attempt insert
      const { error: insertError } = await supabase
        .from('attempts')
        .insert({
          user_id: user.id,
          exercise_id: exerciseId,
          status: 'started'
        })

      if (insertError) {
        setError(`DB Hatası: ${insertError.message} | Olası sebepler: RLS policy sorunu, geçersiz exercise ID, auth session süresi dolmuş`)
      } else {
        setMessage('✅ Attempt başarıyla oluşturuldu! Profilinizden takip edebilirsiniz.')
        // Me page'i refresh için router
        router.refresh()
      }
    } catch {
      setError('Ağ bağlantısı hatası. İnternet bağlantınızı kontrol edin ve tekrar deneyin.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <button
        onClick={handleCreateAttempt}
        disabled={loading}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
      >
        {loading ? 'Oluşturuluyor...' : 'Attempt Başlat'}
      </button>
      
      {message && (
        <div className="mt-3 p-3 bg-green-100 border border-green-300 text-green-700 rounded-lg">
          {message}
        </div>
      )}
      
      {error && (
        <div className="mt-3 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg">
          <p className="font-medium">Attempt oluşturulamadı</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      )}
    </div>
  )
}