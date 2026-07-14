import { createClient } from '@/lib/supabase/server'
import TogetherClient from './TogetherClient'

export default async function TogetherPage() {
  const supabase = await createClient()

  const { data: groups } = await supabase
    .from('group_donations')
    .select('*, organization:organizations(name), participants:group_participants(id)')
    .order('created_at', { ascending: false })
    .limit(20)

  return <TogetherClient initialGroups={groups ?? []} />
}
