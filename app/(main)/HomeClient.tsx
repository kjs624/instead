'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import LetterCard from '@/components/letter/LetterCard'
import LetterCompose from '@/components/letter/LetterCompose'
import { Button } from '@/components/ui/Button'
import { createClient } from '@/lib/supabase/client'
import type { Letter } from '@/types'

interface Props {
  userId: string
  initialReceived: Letter[]
  initialSent: Letter[]
}

export default function HomeClient({ userId, initialReceived, initialSent }: Props) {
  const router = useRouter()
  const [tab, setTab] = useState<'received' | 'sent'>('received')
  const [showCompose, setShowCompose] = useState(false)
  const [received, setReceived] = useState<Letter[]>(initialReceived)
  const [sent, setSent] = useState<Letter[]>(initialSent)

  useEffect(() => { setReceived(initialReceived) }, [initialReceived])
  useEffect(() => { setSent(initialSent) }, [initialSent])

  useEffect(() => {
    const supabase = createClient()

    const fetchLetters = async () => {
      const [{ data: r }, { data: s }] = await Promise.all([
        supabase
          .from('letters')
          .select('*, sender:users!letters_sender_id_fkey(nickname), organization:organizations(name)')
          .eq('receiver_id', userId)
          .order('created_at', { ascending: false })
          .limit(20),
        supabase
          .from('letters')
          .select('*, organization:organizations(name)')
          .eq('sender_id', userId)
          .order('created_at', { ascending: false })
          .limit(20),
      ])
      if (r) setReceived(r)
      if (s) setSent(s)
    }

    const interval = setInterval(fetchLetters, 5000)
    return () => clearInterval(interval)
  }, [userId])

  const letters = tab === 'received' ? received : sent

  return (
    <div className="max-w-lg mx-auto px-4 pt-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-text-main">편지함 💌</h1>
          <p className="text-text-muted text-xs mt-0.5">따뜻한 마음이 모이는 곳</p>
        </div>
        <Button size="sm" onClick={() => setShowCompose(true)}>
          편지 쓰기
        </Button>
      </div>

      <div className="flex gap-1 mb-4 bg-border/30 rounded-xl p-1">
        <button
          onClick={() => setTab('received')}
          className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
            tab === 'received' ? 'bg-surface text-primary shadow-sm' : 'text-text-muted'
          }`}
        >
          받은 편지 ({received.length})
        </button>
        <button
          onClick={() => setTab('sent')}
          className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
            tab === 'sent' ? 'bg-surface text-primary shadow-sm' : 'text-text-muted'
          }`}
        >
          보낸 편지 ({sent.length})
        </button>
      </div>

      {letters.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">{tab === 'received' ? '📬' : '📮'}</div>
          <p className="text-text-sub font-medium">
            {tab === 'received' ? '아직 받은 편지가 없어요' : '아직 보낸 편지가 없어요'}
          </p>
          <p className="text-text-muted text-sm mt-1">
            {tab === 'received' ? '누군가의 따뜻한 편지를 기다리고 있어요' : '첫 편지를 써볼까요?'}
          </p>
          {tab === 'sent' && (
            <Button className="mt-4" onClick={() => setShowCompose(true)}>
              편지 쓰기
            </Button>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {letters.map((letter) => (
            <LetterCard
              key={letter.id}
              letter={letter}
              currentUserId={userId}
              onUpdate={() => router.refresh()}
            />
          ))}
        </div>
      )}

      {showCompose && (
        <div className="fixed inset-0 bg-black/40 z-40 flex items-end">
          <div className="bg-surface w-full max-w-lg mx-auto rounded-t-2xl shadow-xl max-h-[90vh] overflow-y-auto">
            <LetterCompose
              onSuccess={() => {
                router.refresh()
                setSent((prev) => prev)
              }}
              onClose={() => setShowCompose(false)}
            />
          </div>
        </div>
      )}
    </div>
  )
}
