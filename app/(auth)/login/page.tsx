'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import SocialLoginButtons from '@/components/ui/SocialLoginButtons'

const schema = z.object({
  email: z.string().email('올바른 이메일 주소를 입력해주세요'),
  password: z.string().min(6, '비밀번호는 6자 이상이어야 해요'),
})

type FormValues = z.infer<typeof schema>

export default function LoginPage() {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  const onSubmit = async (values: FormValues) => {
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    })

    if (error) {
      if (error.message.includes('Email not confirmed')) {
        setError('root', { message: '이메일 인증이 필요해요. 받은 편지함을 확인해주세요 📬' })
      } else if (error.message.includes('Invalid login credentials')) {
        setError('root', { message: '이메일 또는 비밀번호가 일치하지 않아요' })
      } else {
        setError('root', { message: error.message })
      }
      return
    }

    router.push('/')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="text-4xl mb-3">💌</div>
          <h1 className="text-2xl font-bold text-text-main">대신 기부</h1>
          <p className="text-text-muted text-sm mt-1">따뜻한 마음을 함께 나눠요</p>
        </div>

        <div className="bg-surface rounded-2xl border border-border p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-text-main mb-5">시작할게요</h2>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
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

            {errors.root && (
              <p className="text-red-400 text-sm text-center">{errors.root.message}</p>
            )}

            <Button type="submit" loading={isSubmitting} size="lg" className="w-full mt-1">
              로그인할게요
            </Button>
          </form>

          <SocialLoginButtons />
        </div>

        <p className="text-center text-sm text-text-muted mt-5">
          아직 계정이 없으신가요?{' '}
          <Link href="/signup" className="text-primary font-medium hover:underline">
            함께해요
          </Link>
        </p>
      </div>
    </div>
  )
}
