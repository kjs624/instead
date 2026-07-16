import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import BottomNav from '@/components/ui/BottomNav'
import Link from 'next/link'

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('users')
    .select('nickname')
    .eq('id', user.id)
    .maybeSingle()

  const initial = profile?.nickname?.[0]?.toUpperCase() ?? '?'

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header
        className="sticky top-0 z-50 flex items-center justify-between px-4 border-b border-border"
        style={{ height: 52, background: 'rgba(250,253,249,0.92)', backdropFilter: 'blur(8px)' }}
      >
        <Link
          href="/intro"
          className="flex items-center gap-1.5 font-extrabold text-[15px] tracking-tight"
          style={{ color: '#1E2D1A', letterSpacing: '-0.02em' }}
        >
          🌱 대신 기부
        </Link>
        <Link href="/mypage" aria-label="마이페이지">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white select-none"
            style={{ background: '#3A6E48' }}
          >
            {initial}
          </div>
        </Link>
      </header>
      <main className="flex-1 pb-24">{children}</main>
      <BottomNav userId={user.id} />
    </div>
  )
}
