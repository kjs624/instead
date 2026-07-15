'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import GroupDonationCard from '@/components/donation/GroupDonationCard'
import CreateGroupDonation from '@/components/donation/CreateGroupDonation'
import { Button } from '@/components/ui/Button'
import { createClient } from '@/lib/supabase/client'
import type { GroupDonation } from '@/types'

interface Props {
  initialGroups: GroupDonation[]
}

export default function TogetherClient({ initialGroups }: Props) {
  const router = useRouter()
  const [showCreate, setShowCreate] = useState(false)
  const [groups, setGroups] = useState<GroupDonation[]>(initialGroups)

  useEffect(() => { setGroups(initialGroups) }, [initialGroups])

  useEffect(() => {
    const supabase = createClient()
    const fetch = async () => {
      const { data } = await supabase
        .from('group_donations')
        .select('*, organization:organizations(name), participants:group_participants(id)')
        .order('created_at', { ascending: false })
        .limit(20)
      if (data) setGroups(data)
    }
    const interval = setInterval(fetch, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="max-w-lg mx-auto px-4 pt-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-text-main">공동 기부 🤝</h1>
          <p className="text-text-muted text-xs mt-0.5">함께라면 더 큰 마음을 전할 수 있어요</p>
        </div>
        <Button size="sm" onClick={() => setShowCreate(true)}>
          새로 만들기
        </Button>
      </div>

      {groups.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">🌱</div>
          <p className="text-text-sub font-medium">아직 진행 중인 공동 기부가 없어요</p>
          <p className="text-text-muted text-sm mt-1">첫 번째로 따뜻한 모금 창을 열어보세요</p>
          <Button className="mt-4" onClick={() => setShowCreate(true)}>
            모금 창 열기
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {groups.map((group) => (
            <GroupDonationCard
              key={group.id}
              group={group}
              onJoin={() => router.refresh()}
            />
          ))}
        </div>
      )}

      {showCreate && (
        <div className="fixed inset-0 bg-black/40 z-40 flex items-end">
          <div className="bg-surface w-full max-w-lg mx-auto rounded-t-2xl shadow-xl max-h-[90vh] overflow-y-auto">
            <CreateGroupDonation
              onSuccess={() => router.refresh()}
              onClose={() => setShowCreate(false)}
            />
          </div>
        </div>
      )}
    </div>
  )
}
