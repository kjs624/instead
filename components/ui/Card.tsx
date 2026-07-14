import { HTMLAttributes } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padding?: boolean
}

export function Card({ padding = true, className = '', children, ...props }: CardProps) {
  return (
    <div
      className={`bg-surface rounded-2xl border border-border shadow-sm ${padding ? 'p-4' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}
