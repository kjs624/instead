'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ORGANIZATIONS } from '@/constants/organizations'
import { Button } from '@/components/ui/Button'

const schema = z.object({
  org_id: z.string().min(1, '기부 단체를 선택해주세요'),
  title: z.string().min(2, '제목을 입력해주세요').max(50, '50자 이하로 입력해주세요'),
  target_amount: z.number().min(1000, '최소 1,000원이에요').max(9999999, '최대 9,999,999원까지 가능해요'),
})

type FormValues = z.infer<typeof schema>

interface Props {
  onSuccess: () => void
  onClose: () => void
}

export default function CreateGroupDonation({ onSuccess, onClose }: Props) {
  const [created, setCreated] = useState(false)

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { target_amount: 50000 },
  })

  const onSubmit = async (values: FormValues) => {
    const res = await fetch('/api/group/join', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    })

    if (res.ok) {
      setCreated(true)
      setTimeout(() => {
        onSuccess()
        onClose()
      }, 1500)
    }
  }

  if (created) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-4">
        <div className="text-5xl">🤝</div>
        <p className="text-text-main font-medium">모금 창이 열렸어요!</p>
      </div>
    )
  }

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-semibold text-text-main">공동 기부 만들기</h2>
        <button onClick={onClose} className="text-text-muted hover:text-text-sub text-xl">✕</button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div>
          <label className="block text-sm text-text-sub mb-1.5">기부 단체</label>
          <select
            {...register('org_id')}
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-text-main text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            <option value="">단체 선택</option>
            {ORGANIZATIONS.map((org) => (
              <option key={org.id} value={org.id}>{org.name}</option>
            ))}
          </select>
          {errors.org_id && <p className="text-red-400 text-xs mt-1">{errors.org_id.message}</p>}
        </div>

        <div>
          <label className="block text-sm text-text-sub mb-1.5">모금 제목</label>
          <input
            {...register('title')}
            placeholder="예: 함께 유니세프에 마음을 전해요"
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-text-main text-sm placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title.message}</p>}
        </div>

        <div>
          <label className="block text-sm text-text-sub mb-1.5">목표 금액 (원)</label>
          <input
            {...register('target_amount', { valueAsNumber: true })}
            type="number"
            placeholder="50000"
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-text-main text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          {errors.target_amount && <p className="text-red-400 text-xs mt-1">{errors.target_amount.message}</p>}
        </div>

        <Button type="submit" loading={isSubmitting} size="lg" className="w-full mt-1">
          모금 창 열기 🌱
        </Button>
      </form>
    </div>
  )
}
