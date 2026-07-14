'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import type { User } from '@/types'

interface LetterItem {
  id: string
  status: string
  created_at: string
  organization: { name: string } | { name: string }[] | null
}

interface GroupItem {
  id: string
  amount: number
  paid_at: string
  group: { title: string; status: string } | { title: string; status: string }[] | null
}

interface Props {
  userId: string
  profile: User | null
  letters: LetterItem[]
  groups: GroupItem[]
}

export default function MypageClient({ userId, profile, letters, groups }: Props) {
  const router = useRouter()
  const [nickname, setNickname] = useState(profile?.nickname ?? '')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSaveNickname = async () => {
    if (!nickname.trim() || nickname.length < 2) return
    setSaving(true)

    const supabase = createClient()
    await supabase.from('users').update({ nickname: nickname.trim() }).eq('id', userId)

    setSaved(true)
    setSaving(false)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  const completedLetters = letters.filter((l) => l.status === 'completed').length

  return (
    <div className="max-w-lg mx-auto px-4 pt-6 pb-8">
      <h1 className="text-xl font-bold text-text-main mb-6">마이페이지 👤</h1>

      <Card className="mb-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-xl font-bold text-primary">
            {profile?.nickname?.[0] ?? '?'}
          </div>
          <div>
            <p className="font-semibold text-text-main">{profile?.nickname}</p>
            <p className="text-xs text-text-muted">{profile?.email}</p>
          </div>
        </div>

        <div className="flex gap-4 text-center py-3 border-t border-border">
          <div className="flex-1">
            <p className="text-lg font-bold text-primary">{letters.length}</p>
            <p className="text-xs text-text-muted">편지 참여</p>
          </div>
          <div className="flex-1 border-x border-border">
            <p className="text-lg font-bold text-success">{completedLetters}</p>
            <p className="text-xs text-text-muted">기부 완료</p>
          </div>
          <div className="flex-1">
            <p className="text-lg font-bold text-secondary">{groups.length}</p>
            <p className="text-xs text-text-muted">공동 기부</p>
          </div>
        </div>
      </Card>

      <Card className="mb-4">
        <h2 className="text-sm font-semibold text-text-main mb-3">닉네임 수정</h2>
        <div className="flex gap-2">
          <input
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            maxLength={10}
            className="flex-1 px-4 py-2.5 rounded-xl border border-border bg-background text-text-main text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          <Button size="sm" loading={saving} onClick={handleSaveNickname}>
            {saved ? '저장됨 ✓' : '저장'}
          </Button>
        </div>
      </Card>

      {letters.length > 0 && (
        <Card className="mb-4">
          <h2 className="text-sm font-semibold text-text-main mb-3">기부 이력</h2>
          <div className="flex flex-col gap-2">
            {letters.map((letter) => (
              <div key={letter.id} className="flex justify-between items-center py-2 border-b border-border last:border-0">
                <div>
                  <p className="text-sm text-text-main">
                    {Array.isArray(letter.organization)
                      ? letter.organization[0]?.name ?? '기부 단체'
                      : (letter.organization as { name: string } | null)?.name ?? '기부 단체'}
                  </p>
                  <p className="text-xs text-text-muted">{new Date(letter.created_at).toLocaleDateString('ko-KR')}</p>
                </div>
                <span className={`text-xs font-medium ${letter.status === 'completed' ? 'text-success' : 'text-text-muted'}`}>
                  {letter.status === 'completed' ? '완료' : letter.status === 'rejected' ? '거절' : '진행중'}
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}

      <Button variant="ghost" size="lg" className="w-full" onClick={handleLogout}>
        로그아웃
      </Button>
    </div>
  )
}
