'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

interface Props {
  userId: string
}

export default function BottomNav({ userId }: Props) {
  const pathname = usePathname()
  const [unread, setUnread] = useState(0)

  useEffect(() => {
    const supabase = createClient()
    const check = async () => {
      const { count } = await supabase
        .from('letters')
        .select('id', { count: 'exact', head: true })
        .eq('receiver_id', userId)
        .eq('status', 'matched')
      setUnread(count ?? 0)
    }
    check()
    const interval = setInterval(check, 5000)
    return () => clearInterval(interval)
  }, [userId])

  const navItems = [
    { href: '/', label: '편지', icon: '💌', badge: unread > 0 },
    { href: '/together', label: '공동기부', icon: '🤝', badge: false },
    { href: '/record', label: '나눔기록', icon: '📸', badge: false },
    { href: '/mypage', label: '마이', icon: '👤', badge: false },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-surface border-t border-border safe-area-pb">
      <div className="flex max-w-lg mx-auto">
        {navItems.map(({ href, label, icon, badge }) => {
          const active = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={`flex-1 flex flex-col items-center py-2.5 gap-0.5 text-xs transition-colors ${
                active ? 'text-primary' : 'text-text-muted'
              }`}
            >
              <span className="text-xl leading-none relative">
                {icon}
                {badge && (
                  <span className="absolute -top-0.5 -right-1 w-2 h-2 bg-red-500 rounded-full" />
                )}
              </span>
              <span className={`font-medium ${active ? 'text-primary' : 'text-text-muted'}`}>{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
