import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      const { data: { user } } = await supabase.auth.getUser()

      if (user) {
        const { data: profile } = await supabase
          .from('users')
          .select('id')
          .eq('id', user.id)
          .maybeSingle()

        // 처음 소셜 로그인하는 유저 → 닉네임 설정 페이지로
        if (!profile) {
          return NextResponse.redirect(`${origin}/onboarding`)
        }

        // Google / Kakao 로그인 → 바로 홈으로 (이메일 인증 페이지 필요 없음)
        const provider = user.app_metadata?.provider
        if (provider === 'google' || provider === 'kakao') {
          return NextResponse.redirect(`${origin}/`)
        }
      }

      // 이메일 인증 완료 → 인증 완료 페이지로
      return NextResponse.redirect(`${origin}/auth/verified`)
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_failed`)
}
