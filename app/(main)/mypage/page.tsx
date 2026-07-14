import { createClient } from '@/lib/supabase/server'
import MypageClient from './MypageClient'

export default async function MypagePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [{ data: profile }, { data: letters }, { data: groups }] = await Promise.all([
    supabase.from('users').select('*').eq('id', user!.id).single(),
    supabase
      .from('letters')
      .select('id, status, created_at, organization:organizations(name)')
      .or(`sender_id.eq.${user!.id},receiver_id.eq.${user!.id}`)
      .order('created_at', { ascending: false })
      .limit(10),
    supabase
      .from('group_participants')
      .select('id, amount, paid_at, group:group_donations(title, status)')
      .eq('user_id', user!.id)
      .order('paid_at', { ascending: false })
      .limit(10),
  ])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const typedLetters = (letters ?? []) as any[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const typedGroups = (groups ?? []) as any[]

  return (
    <MypageClient
      userId={user!.id}
      profile={profile}
      letters={typedLetters}
      groups={typedGroups}
    />
  )
}
