'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

type Provider = 'google' | 'kakao' | 'github'

const PROVIDERS: { id: Provider; label: string; bg: string; text: string; border: string; icon: React.ReactNode }[] = [
  {
    id: 'google',
    label: 'Google로 계속하기',
    bg: 'bg-white',
    text: 'text-[#3c4043]',
    border: 'border border-[#dadce0]',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18">
        <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"/>
        <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/>
        <path fill="#FBBC05" d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z"/>
        <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.961L3.964 7.293C4.672 5.163 6.656 3.58 9 3.58z"/>
      </svg>
    ),
  },
  {
    id: 'kakao',
    label: '카카오로 계속하기',
    bg: 'bg-[#FEE500]',
    text: 'text-[#191919]',
    border: 'border border-[#FEE500]',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path fillRule="evenodd" clipRule="evenodd" d="M9 1.5C4.858 1.5 1.5 4.134 1.5 7.388c0 2.07 1.372 3.888 3.44 4.916l-.876 3.244c-.077.285.263.513.506.34l3.898-2.577c.175.02.352.03.532.03 4.142 0 7.5-2.634 7.5-5.887C16.5 4.134 13.142 1.5 9 1.5z" fill="#191919"/>
      </svg>
    ),
  },
  {
    id: 'github',
    label: 'GitHub으로 계속하기',
    bg: 'bg-[#24292e]',
    text: 'text-white',
    border: 'border border-[#24292e]',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
        <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
      </svg>
    ),
  },
]

export default function SocialLoginButtons() {
  const [loading, setLoading] = useState<Provider | null>(null)

  const handleLogin = async (provider: Provider) => {
    setLoading(provider)
    const supabase = createClient()
    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
  }

  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex items-center gap-3 my-1">
        <div className="flex-1 h-px bg-border" />
        <span className="text-xs text-text-muted">또는</span>
        <div className="flex-1 h-px bg-border" />
      </div>

      {PROVIDERS.map(({ id, label, bg, text, border, icon }) => (
        <button
          key={id}
          onClick={() => handleLogin(id)}
          disabled={loading !== null}
          className={`w-full flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-xl ${bg} ${text} ${border} text-sm font-medium transition-all active:scale-95 disabled:opacity-60`}
        >
          {loading === id ? (
            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
          ) : icon}
          {label}
        </button>
      ))}
    </div>
  )
}
