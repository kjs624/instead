'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ORGANIZATIONS } from '@/constants/organizations'
import { Button } from '@/components/ui/Button'

const schema = z.object({
  content: z.string().min(10, '최소 10자 이상 써주세요').max(150, '150자를 초과할 수 없어요'),
  org_id: z.string().min(1, '기부 단체를 선택해주세요'),
  amount: z.number().min(100, '최소 100원이에요').max(100000, '최대 10만원까지 가능해요'),
  anonymous: z.boolean().default(false),
})

type FormValues = z.infer<typeof schema>

interface Props {
  onSuccess: () => void
  onClose: () => void
}

export default function LetterCompose({ onSuccess, onClose }: Props) {
  const [submitResult, setSubmitResult] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { amount: 1000, anonymous: false },
  })

  const contentLength = watch('content')?.length ?? 0
  const anonymous = watch('anonymous')

  const onSubmit = async (values: FormValues) => {
    const res = await fetch('/api/letter/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...values, sender_named: !values.anonymous }),
    })

    const data = await res.json()

    if (!res.ok) {
      setSubmitResult(data.error || '전송에 실패했어요')
      return
    }

    setSubmitResult(data.matched ? '편지가 전달됐어요 💌' : '곧 기부 파트너를 찾아드릴게요')
    setTimeout(() => {
      onSuccess()
      onClose()
    }, 1500)
  }

  if (submitResult) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-4">
        <div className="text-5xl">💌</div>
        <p className="text-text-main font-medium text-center">{submitResult}</p>
      </div>
    )
  }

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-semibold text-text-main">편지 쓰기</h2>
        <button onClick={onClose} className="text-text-muted hover:text-text-sub text-xl">✕</button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div>
          <label className="block text-sm text-text-sub mb-1.5">기부 파트너에게 전할 마음을 써주세요</label>
          <textarea
            {...register('content')}
            rows={5}
            placeholder="저 대신 기부해주실 마음 따뜻한 분을 찾고 있어요. 제가 기부하고 싶은 이유는..."
            className="w-full px-4 py-3 rounded-xl border border-border bg-background text-text-main text-sm placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all resize-none"
          />
          <div className="flex justify-between mt-1">
            {errors.content ? (
              <p className="text-red-400 text-xs">{errors.content.message}</p>
            ) : <span />}
            <span className={`text-xs ${contentLength > 140 ? 'text-red-400' : 'text-text-muted'}`}>
              {contentLength}/150
            </span>
          </div>
        </div>

        <div>
          <label className="block text-sm text-text-sub mb-1.5">기부할 단체를 선택해주세요</label>
          <select
            {...register('org_id')}
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-text-main text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
          >
            <option value="">단체 선택</option>
            {ORGANIZATIONS.map((org) => (
              <option key={org.id} value={org.id}>{org.name} — {org.description.slice(0, 20)}...</option>
            ))}
          </select>
          {errors.org_id && <p className="text-red-400 text-xs mt-1">{errors.org_id.message}</p>}
        </div>

        <div>
          <label className="block text-sm text-text-sub mb-1.5">기부 금액 (원)</label>
          <input
            {...register('amount', { valueAsNumber: true })}
            type="number"
            placeholder="1000"
            min={100}
            max={100000}
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-text-main text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
          />
          {errors.amount && <p className="text-red-400 text-xs mt-1">{errors.amount.message}</p>}
        </div>

        <label className="flex items-center gap-2.5 cursor-pointer select-none">
          <input
            type="checkbox"
            {...register('anonymous')}
            className="w-4 h-4 rounded accent-primary"
          />
          <span className="text-sm text-text-sub">
            익명으로 보내기
            {anonymous && <span className="ml-1.5 text-xs text-text-muted">(상대방에게 내 닉네임이 보이지 않아요)</span>}
          </span>
        </label>

        <Button type="submit" loading={isSubmitting} size="lg" className="w-full mt-1">
          마음을 전송할게요 💌
        </Button>
      </form>
    </div>
  )
}
