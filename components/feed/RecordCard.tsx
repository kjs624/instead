'use client'

import { useState } from 'react'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { Card } from '@/components/ui/Card'
import type { DonationRecord } from '@/types'

interface Props {
  record: DonationRecord
  currentUserId: string
}

export default function RecordCard({ record, currentUserId }: Props) {
  const [liked, setLiked] = useState(record.liked_by_me ?? false)
  const [likesCount, setLikesCount] = useState(record.likes_count)
  const [toggling, setToggling] = useState(false)

  const handleLike = async () => {
    if (toggling) return
    setToggling(true)

    const supabase = createClient()

    if (liked) {
      await supabase
        .from('record_likes')
        .delete()
        .eq('record_id', record.id)
        .eq('user_id', currentUserId)

      await supabase
        .from('donation_records')
        .update({ likes_count: Math.max(likesCount - 1, 0) })
        .eq('id', record.id)

      setLiked(false)
      setLikesCount((c) => Math.max(c - 1, 0))
    } else {
      await supabase.from('record_likes').insert({
        record_id: record.id,
        user_id: currentUserId,
      })

      await supabase
        .from('donation_records')
        .update({ likes_count: likesCount + 1 })
        .eq('id', record.id)

      setLiked(true)
      setLikesCount((c) => c + 1)
    }

    setToggling(false)
  }

  return (
    <Card className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-medium text-primary">
          {record.user?.nickname?.[0] ?? '?'}
        </div>
        <div>
          <p className="text-sm font-medium text-text-main">{record.user?.nickname ?? '익명'}</p>
          <p className="text-xs text-text-muted">{new Date(record.created_at).toLocaleDateString('ko-KR')}</p>
        </div>
      </div>

      {record.image_url && (
        <div className="relative w-full aspect-video rounded-xl overflow-hidden">
          <Image
            src={record.image_url}
            alt="나눔 기록"
            fill
            className="object-cover"
          />
        </div>
      )}

      <p className="text-sm text-text-sub leading-relaxed">{record.content}</p>

      <button
        onClick={handleLike}
        className={`flex items-center gap-1.5 text-sm transition-all active:scale-110 ${
          liked ? 'text-red-400' : 'text-text-muted'
        }`}
      >
        <span className="text-lg leading-none">{liked ? '❤️' : '🤍'}</span>
        <span>{likesCount}</span>
      </button>
    </Card>
  )
}
