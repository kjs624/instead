'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'

export default function OnboardingPage() {
  const router = useRouter()
  const [nickname, setNickname] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (nickname.trim().length < 2) {
      setError('닉네임은 2자 이상이어야 해요')
      return
    }
    if (nickname.trim().length > 10) {
      setError('닉네임은 10자 이하여야 해요')
      return
    }

    setLoading(true)
    setError('')
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      router.push('/login')
      return
    }

    const { data: existing } = await supabase
      .from('users')
      .select('id')
      .eq('nickname', nickname.trim())
      .maybeSingle()

    if (existing) {
      setError('이미 사용 중인 닉네임이에요')
      setLoading(false)
      return
    }

    await supabase.from('users').insert({
      id: user.id,
      nickname: nickname.trim(),
      email: user.email ?? '',
      avatar_url: user.user_metadata?.avatar_url ?? null,
      push_token: null,
    })

    router.push('/')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="text-4xl mb-3">🌸</div>
          <h1 className="text-2xl font-bold text-text-main">거의 다 왔어요!</h1>
          <p className="text-text-muted text-sm mt-1">앱에서 사용할 닉네임을 정해주세요</p>
        </div>

        <div className="bg-surface rounded-2xl border border-border p-6 shadow-sm">
          <label className="block text-sm text-text-sub mb-1.5">닉네임</label>
          <input
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            placeholder="2~10자"
            maxLength={10}
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-text-main text-sm placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all mb-3"
          />
          {error && <p className="text-red-400 text-xs mb-3">{error}</p>}
          <Button size="lg" className="w-full" loading={loading} onClick={handleSubmit}>
            시작할게요 💌
          </Button>
        </div>
      </div>
    </div>
  )
}
