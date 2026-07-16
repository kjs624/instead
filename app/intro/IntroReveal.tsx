'use client'

import { useEffect } from 'react'

export default function IntroReveal() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('ip-visible')
            io.unobserve(e.target)
          }
        })
      },
      { threshold: 0.15 }
    )
    document.querySelectorAll('.ip-reveal').forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  return null
}
