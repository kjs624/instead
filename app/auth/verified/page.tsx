import Link from 'next/link'

export default function VerifiedPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm text-center">
        <div className="text-6xl mb-5">✅</div>
        <h1 className="text-2xl font-bold text-text-main mb-2">인증이 완료됐어요!</h1>
        <p className="text-text-sub text-sm leading-relaxed mb-8">
          이메일 인증이 성공적으로 완료됐어요.<br />
          이제 로그인하고 시작해보세요 🌱
        </p>
        <Link
          href="/login"
          className="inline-block w-full py-3 rounded-2xl bg-primary text-white font-semibold text-base text-center active:scale-95 transition-transform"
        >
          로그인 하러 가기
        </Link>
      </div>
    </div>
  )
}
