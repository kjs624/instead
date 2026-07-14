import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return NextResponse.json({ error: '로그인이 필요해요' }, { status: 401 })

  const { letter_id, action } = await request.json()

  if (!letter_id || !['accept', 'reject'].includes(action)) {
    return NextResponse.json({ error: '잘못된 요청이에요' }, { status: 400 })
  }

  const { data: letter } = await supabase
    .from('letters')
    .select('*')
    .eq('id', letter_id)
    .eq('receiver_id', user.id)
    .eq('status', 'matched')
    .single()

  if (!letter) return NextResponse.json({ error: '편지를 찾을 수 없어요' }, { status: 404 })

  if (action === 'reject') {
    await supabase
      .from('letters')
      .update({ status: 'rejected' })
      .eq('id', letter_id)

    return NextResponse.json({ success: true, status: 'rejected' })
  }

  // 수락 + mock 결제 처리 → 바로 completed
  await supabase
    .from('letters')
    .update({
      status: 'completed',
      completed_at: new Date().toISOString(),
    })
    .eq('id', letter_id)

  return NextResponse.json({ success: true, status: 'completed' })
}
