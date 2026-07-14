import { createClient } from '@/lib/supabase/server'
import RecordClient from './RecordClient'

export default async function RecordPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: records } = await supabase
    .from('donation_records')
    .select('*, user:users(nickname)')
    .order('created_at', { ascending: false })
    .limit(20)

  // 내가 좋아요한 기록 조회
  const { data: myLikes } = await supabase
    .from('record_likes')
    .select('record_id')
    .eq('user_id', user!.id)

  const likedIds = new Set(myLikes?.map((l) => l.record_id) ?? [])
  const recordsWithLike = (records ?? []).map((r) => ({
    ...r,
    liked_by_me: likedIds.has(r.id),
  }))

  return <RecordClient userId={user!.id} initialRecords={recordsWithLike} />
}
