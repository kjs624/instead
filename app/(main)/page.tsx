import { createClient } from '@/lib/supabase/server'
import HomeClient from './HomeClient'

export default async function HomePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [{ data: received }, { data: sent }] = await Promise.all([
    supabase
      .from('letters')
      .select('*, sender:users!letters_sender_id_fkey(nickname), organization:organizations(name)')
      .eq('receiver_id', user!.id)
      .order('created_at', { ascending: false })
      .limit(20),
    supabase
      .from('letters')
      .select('*, organization:organizations(name)')
      .eq('sender_id', user!.id)
      .order('created_at', { ascending: false })
      .limit(20),
  ])

  return (
    <HomeClient
      userId={user!.id}
      initialReceived={received ?? []}
      initialSent={sent ?? []}
    />
  )
}
