'use client'

import { useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

interface RealtimeOptions {
  table: string
  filter?: string
  onInsert?: (payload: Record<string, unknown>) => void
  onUpdate?: (payload: Record<string, unknown>) => void
  onDelete?: (payload: Record<string, unknown>) => void
}

export function useRealtime({ table, filter, onInsert, onUpdate, onDelete }: RealtimeOptions) {
  useEffect(() => {
    const supabase = createClient()
    const channelName = `realtime-${table}-${Math.random()}`

    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table, filter },
        (payload) => {
          if (payload.eventType === 'INSERT' && onInsert) onInsert(payload.new as Record<string, unknown>)
          if (payload.eventType === 'UPDATE' && onUpdate) onUpdate(payload.new as Record<string, unknown>)
          if (payload.eventType === 'DELETE' && onDelete) onDelete(payload.old as Record<string, unknown>)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [table, filter, onInsert, onUpdate, onDelete])
}
