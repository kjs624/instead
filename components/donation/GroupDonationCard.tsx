'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import type { GroupDonation } from '@/types'

interface Props {
  group: GroupDonation
  onJoin?: () => void
}

export default function GroupDonationCard({ group, onJoin }: Props) {
  const [showJoin, setShowJoin] = useState(false)
  const [amount, setAmount] = useState(1000)
  const [joining, setJoining] = useState(false)
  const [completed, setCompleted] = useState(group.status === 'completed')

  const progress = Math.min((group.current_amount / group.target_amount) * 100, 100)
  const remaining = group.target_amount - group.current_amount

  const handleJoin = async () => {
    if (amount < 100) return
    setJoining(true)

    const res = await fetch('/api/group/join', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ group_id: group.id, amount }),
    })

    const data = await res.json()
    setJoining(false)
    setShowJoin(false)

    if (data.completed) {
      setCompleted(true)
      alert('우리가 함께 해냈어요! 🎉 기부가 완료됐습니다.')
    } else {
      onJoin?.()
    }
  }

  return (
    <Card className="flex flex-col gap-3">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <span className="text-xs text-text-muted">{group.organization?.name}</span>
          <h3 className="text-sm font-semibold text-text-main mt-0.5 truncate">{group.title}</h3>
        </div>
        <span className={`text-xs font-medium ml-2 shrink-0 ${completed ? 'text-success' : 'text-primary'}`}>
          {completed ? '모금 완료 ✓' : '모금 중'}
        </span>
      </div>

      <div>
        <div className="flex justify-between text-xs text-text-muted mb-1.5">
          <span>{group.current_amount.toLocaleString()}원</span>
          <span>목표 {group.target_amount.toLocaleString()}원</span>
        </div>
        <div className="h-2 bg-border rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-700 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between text-xs mt-1">
          <span className="text-primary font-medium">{progress.toFixed(0)}% 달성</span>
          {!completed && <span className="text-text-muted">앞으로 {remaining.toLocaleString()}원</span>}
        </div>
      </div>

      {group.participants && (
        <p className="text-xs text-text-muted">{group.participants.length}명 참여 중</p>
      )}

      {!completed && !showJoin && (
        <Button size="sm" onClick={() => setShowJoin(true)} className="w-full">
          함께할게요 🤝
        </Button>
      )}

      {showJoin && (
        <div className="flex gap-2 items-center">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            min={100}
            className="flex-1 px-3 py-2 rounded-xl border border-border bg-background text-sm text-text-main focus:outline-none focus:ring-2 focus:ring-primary/30"
            placeholder="참여 금액 (원)"
          />
          <Button size="sm" loading={joining} onClick={handleJoin}>확인</Button>
          <Button size="sm" variant="ghost" onClick={() => setShowJoin(false)}>취소</Button>
        </div>
      )}
    </Card>
  )
}
