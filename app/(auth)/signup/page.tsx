'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import SocialLoginButtons from '@/components/ui/SocialLoginButtons'

const schema = z.object({
  nickname: z.string().min(2, '닉네임은 2자 이상이어야 해요').max(10, '닉네임은 10자 이하여야 해요'),
  email: z.string().email('올바른 이메일 주소를 입력해주세요'),
  password: z.string().min(6, '비밀번호는 6자 이상이어야 해요'),
  passwordConfirm: z.string(),
}).refine((d) => d.password === d.passwordConfirm, {
  message: '비밀번호가 일치하지 않아요',
  path: ['passwordConfirm'],
})

type FormValues = z.infer<typeof schema>

export default function SignupPage() {
  const router = useRouter()
  const [emailSent, setEmailSent] = useState(false)
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  const onSubmit = async (values: FormValues) => {
    const supabase = createClient()

    const { data: existing } = await supabase
      .from('users')
      .select('id')
      .eq('nickname', values.nickname)
      .maybeSingle()

    if (existing) {
      setError('nickname', { message: '이미 사용 중인 닉네임이에요' })
      return
    }

    const { data, error } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
      options: {
        data: { nickname: values.nickname },
      },
    })

    if (error || !data.user) {
      setError('root', { message: '가입 중 문제가 생겼어요. 다시 시도해주세요' })
      return
    }

    // 이메일 인증이 필요한 경우 (identities가 있지만 confirmed_at이 없음)
    const needsConfirmation = !data.user.confirmed_at
    if (needsConfirmation) {
      setEmailSent(true)
      return
    }

    router.push('/')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="text-4xl mb-3">🌱</div>
          <h1 className="text-2xl font-bold text-text-main">대신 기부</h1>
          <p className="text-text-muted text-sm mt-1">따뜻한 마음을 함께 나눠요</p>
        </div>

        {emailSent ? (
          <div className="bg-surface rounded-2xl border border-border p-8 shadow-sm text-center">
            <div className="text-5xl mb-4">📬</div>
            <h2 className="text-lg font-semibold text-text-main mb-2">이메일을 확인해주세요</h2>
            <p className="text-text-sub text-sm leading-relaxed">
              가입하신 이메일로 인증 링크를 보냈어요.<br />
              링크를 클릭하면 바로 시작할 수 있어요!
            </p>
            <p className="text-text-muted text-xs mt-3">
              📌 이메일이 안 보이면 <span className="font-medium">스팸 폴더</span>도 확인해주세요
            </p>
            <Link href="/login" className="inline-block mt-5 text-sm text-primary font-medium hover:underline">
              로그인 페이지로 →
            </Link>
          </div>
        ) : (

        <div className="bg-surface rounded-2xl border border-border p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-text-main mb-5">함께해요</h2>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm text-text-sub mb-1.5">닉네임</label>
              <input
                {...register('nickname')}
                placeholder="2~10자"
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-text-main text-sm placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
              />
              {errors.nickname && <p className="text-red-400 text-xs mt-1">{errors.nickname.message}</p>}
            </div>

            <div>
              <label className="block text-sm text-text-sub mb-1.5">이메일</label>
              <input
                {...register('email')}
                type="email"
                placeholder="hello@example.com"
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-text-main text-sm placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
              />
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm text-text-sub mb-1.5">비밀번호</label>
              <input
                {...register('password')}
                type="password"
                placeholder="6자 이상"
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-text-main text-sm placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
              />
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <div>
              <label className="block text-sm text-text-sub mb-1.5">비밀번호 확인</label>
              <input
                {...register('passwordConfirm')}
                type="password"
                placeholder="비밀번호를 한 번 더 입력해주세요"
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-text-main text-sm placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
              />
              {errors.passwordConfirm && <p className="text-red-400 text-xs mt-1">{errors.passwordConfirm.message}</p>}
            </div>

            {errors.root && (
              <p className="text-red-400 text-sm text-center">{errors.root.message}</p>
            )}

            <Button type="submit" loading={isSubmitting} size="lg" className="w-full mt-1">
              마음을 나눌게요
            </Button>
          </form>

          <SocialLoginButtons />
        </div>

        )}

        {!emailSent && (
          <p className="text-center text-sm text-text-muted mt-5">
            이미 계정이 있으신가요?{' '}
            <Link href="/login" className="text-primary font-medium hover:underline">
              시작할게요
            </Link>
          </p>
        )}
      </div>
    </div>
  )
}
