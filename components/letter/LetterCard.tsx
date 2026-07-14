'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import type { Letter } from '@/types'

interface Props {
  letter: Letter
  currentUserId: string
  onUpdate?: () => void
}

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  pending: { label: '파트너 찾는 중', color: 'text-secondary' },
  matched: { label: '파트너 매칭됨', color: 'text-primary' },
  accepted: { label: '수락됨', color: 'text-success' },
  rejected: { label: '거절됨', color: 'text-text-muted' },
  completed: { label: '기부 완료 ✓', color: 'text-success' },
}

export default function LetterCard({ letter, currentUserId, onUpdate }: Props) {
  const [responding, setResponding] = useState(false)
  const [done, setDone] = useState(false)

  const isReceiver = letter.receiver_id === currentUserId
  const canRespond = isReceiver && letter.status === 'matched' && !done

  const handleRespond = async (action: 'accept' | 'reject') => {
    setResponding(true)
    const res = await fetch('/api/letter/respond', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ letter_id: letter.id, action }),
    })

    if (res.ok) {
      setDone(true)
      if (action === 'accept') {
        alert('기부 파트너님이 마음을 전해줬어요 💛 기부가 완료됐어요!')
      }
      onUpdate?.()
    }
    setResponding(false)
  }

  const statusInfo = STATUS_LABELS[letter.status]
  const orgName = letter.organization?.name ?? '기부 단체'
  const senderNick = isReceiver ? (letter.sender?.nickname ?? '소망자') : '나'

  return (
    <Card className="gap-3 flex flex-col">
      <div className="flex items-start justify-between">
        <div>
          <span className="text-xs text-text-muted">{senderNick}의 편지</span>
          <p className="text-sm font-medium text-text-main mt-0.5">{orgName} 기부 희망</p>
        </div>
        <span className={`text-xs font-medium ${statusInfo.color}`}>{statusInfo.label}</span>
      </div>

      {isReceiver && (
        <p className="text-sm text-text-sub leading-relaxed bg-background rounded-xl p-3 border border-border">
          {letter.content}
        </p>
      )}

      <div className="flex items-center justify-between text-xs text-text-muted">
        <span>희망 금액 {letter.amount.toLocaleString()}원</span>
        <span>{new Date(letter.created_at).toLocaleDateString('ko-KR')}</span>
      </div>

      {canRespond && (
        <div className="flex gap-2 pt-1">
          <Button
            variant="ghost"
            size="sm"
            className="flex-1"
            loading={responding}
            onClick={() => handleRespond('reject')}
          >
            거절할게요
          </Button>
          <Button
            size="sm"
            className="flex-1"
            loading={responding}
            onClick={() => handleRespond('accept')}
          >
            기꺼이 대신할게요 💛
          </Button>
        </div>
      )}

      {done && (
        <p className="text-sm text-success text-center font-medium py-1">
          마음을 전해드렸어요 🌸
        </p>
      )}

      {letter.status === 'completed' && !canRespond && (
        <p className="text-xs text-success text-center">
          따뜻한 기부가 완료됐어요 🌸
        </p>
      )}
    </Card>
  )
}
