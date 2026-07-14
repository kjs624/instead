'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { href: '/', label: '편지', icon: '💌' },
  { href: '/together', label: '공동기부', icon: '🤝' },
  { href: '/record', label: '나눔기록', icon: '📸' },
  { href: '/mypage', label: '마이', icon: '👤' },
]

export default function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-surface border-t border-border safe-area-pb">
      <div className="flex max-w-lg mx-auto">
        {navItems.map(({ href, label, icon }) => {
          const active = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={`flex-1 flex flex-col items-center py-2.5 gap-0.5 text-xs transition-colors ${
                active ? 'text-primary' : 'text-text-muted'
              }`}
            >
              <span className="text-xl leading-none">{icon}</span>
              <span className={`font-medium ${active ? 'text-primary' : 'text-text-muted'}`}>{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
