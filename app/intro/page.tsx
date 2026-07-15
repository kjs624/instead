import Link from 'next/link'

const features = [
  {
    icon: '💌',
    title: '대신 기부 편지',
    desc: '기부하고 싶은 마음을 편지로 보내면, 누군가가 대신 기부해줘요.',
  },
  {
    icon: '🤝',
    title: '함께하는 공동 기부',
    desc: '혼자는 어려운 큰 기부도 여럿이 모이면 가능해요.',
  },
  {
    icon: '📸',
    title: '나눔 기록',
    desc: '직접 한 기부를 기록하고 서로의 따뜻한 마음을 응원해요.',
  },
]

export default function IntroPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex justify-end px-4 pt-3">
        <span className="text-[10px] text-text-muted">현재 데모 버전이며 8월 17일 개발 완료 예정</span>
      </div>
      {/* Hero */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pt-16 pb-8 text-center">
        <div className="text-6xl mb-4">🌱</div>
        <h1 className="text-3xl font-bold text-text-main leading-tight">
          대신 기부
        </h1>
        <p className="text-text-muted mt-3 text-base leading-relaxed max-w-xs">
          기부하고 싶은 마음은 있지만<br />
          망설여질 때, 우리가 함께해요.
        </p>

        <div className="flex flex-col gap-3 w-full max-w-xs mt-10">
          <Link
            href="/signup"
            className="w-full py-3 rounded-2xl bg-primary text-white font-semibold text-base text-center shadow-sm active:scale-95 transition-transform"
          >
            시작할게요
          </Link>
          <Link
            href="/login"
            className="w-full py-3 rounded-2xl border border-border text-text-sub font-medium text-base text-center active:scale-95 transition-transform"
          >
            이미 계정이 있어요
          </Link>
        </div>
      </div>

      {/* Features */}
      <div className="px-6 pb-16 max-w-sm mx-auto w-full">
        <div className="flex flex-col gap-4">
          {features.map(({ icon, title, desc }) => (
            <div key={title} className="flex items-start gap-4 bg-surface rounded-2xl border border-border p-4">
              <span className="text-3xl shrink-0">{icon}</span>
              <div>
                <p className="font-semibold text-text-main text-sm">{title}</p>
                <p className="text-text-muted text-xs mt-0.5 leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
