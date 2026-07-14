'use client'

import { useEffect, useState } from 'react'
import type { Toast as ToastType } from '@/types'

interface ToastProviderProps {
  toasts: ToastType[]
  onRemove: (id: string) => void
}

export function ToastContainer({ toasts, onRemove }: ToastProviderProps) {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>
  )
}

function ToastItem({ toast, onRemove }: { toast: ToastType; onRemove: (id: string) => void }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true))
    const timer = setTimeout(() => {
      setVisible(false)
      setTimeout(() => onRemove(toast.id), 300)
    }, 3500)
    return () => clearTimeout(timer)
  }, [toast.id, onRemove])

  const bgColor = {
    success: 'bg-success',
    error: 'bg-red-400',
    info: 'bg-secondary',
  }[toast.type]

  return (
    <div
      className={`pointer-events-auto px-4 py-3 rounded-xl text-white text-sm shadow-lg transition-all duration-300 max-w-xs ${bgColor} ${
        visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
      }`}
    >
      {toast.message}
    </div>
  )
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastType[]>([])

  const addToast = (message: string, type: ToastType['type'] = 'info') => {
    const id = Math.random().toString(36).slice(2)
    setToasts((prev) => [...prev, { id, message, type }])
  }

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  return { toasts, addToast, removeToast }
}
