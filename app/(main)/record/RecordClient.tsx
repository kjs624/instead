'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import RecordCard from '@/components/feed/RecordCard'
import CreateRecord from '@/components/feed/CreateRecord'
import { Button } from '@/components/ui/Button'
import type { DonationRecord } from '@/types'

interface Props {
  userId: string
  initialRecords: DonationRecord[]
}

export default function RecordClient({ userId, initialRecords }: Props) {
  const router = useRouter()
  const [showCreate, setShowCreate] = useState(false)

  return (
    <div className="max-w-lg mx-auto px-4 pt-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-text-main">나눔 기록 📸</h1>
          <p className="text-text-muted text-xs mt-0.5">서로의 따뜻한 선행을 응원해요</p>
        </div>
        <Button size="sm" onClick={() => setShowCreate(true)}>
          기록 남기기
        </Button>
      </div>

      {initialRecords.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">🌸</div>
          <p className="text-text-sub font-medium">아직 나눔 기록이 없어요</p>
          <p className="text-text-muted text-sm mt-1">첫 번째 온기 기록을 남겨보세요</p>
          <Button className="mt-4" onClick={() => setShowCreate(true)}>
            나눔 기록 남기기
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {initialRecords.map((record) => (
            <RecordCard key={record.id} record={record} currentUserId={userId} />
          ))}
        </div>
      )}

      {showCreate && (
        <div className="fixed inset-0 bg-black/40 z-40 flex items-end">
          <div className="bg-surface w-full max-w-lg mx-auto rounded-t-2xl shadow-xl max-h-[90vh] overflow-y-auto">
            <CreateRecord
              userId={userId}
              onSuccess={() => router.refresh()}
              onClose={() => setShowCreate(false)}
            />
          </div>
        </div>
      )}
    </div>
  )
}
