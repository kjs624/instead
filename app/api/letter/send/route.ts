import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return NextResponse.json({ error: '로그인이 필요해요' }, { status: 401 })

  const body = await request.json()
  const { content, org_id, amount } = body

  if (!content || content.length > 150) {
    return NextResponse.json({ error: '편지 내용을 확인해주세요 (1~150자)' }, { status: 400 })
  }

  // 랜덤 기부 파트너 매칭 (자기 자신 제외, 활성 유저 중)
  const { data: candidates } = await supabase
    .from('users')
    .select('id')
    .neq('id', user.id)

  if (!candidates || candidates.length === 0) {
    // 매칭 파트너 없으면 pending 상태로 저장
    const { data: letter, error } = await supabase
      .from('letters')
      .insert({
        sender_id: user.id,
        receiver_id: null,
        org_id,
        content,
        status: 'pending',
        sender_named: true,
        receiver_named: true,
        amount: amount || 1000,
      })
      .select()
      .single()

    if (error) {
      console.error('[letter/send] pending insert error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json({ letter, matched: false })
  }

  const partner = candidates[Math.floor(Math.random() * candidates.length)]

  const { data: letter, error } = await supabase
    .from('letters')
    .insert({
      sender_id: user.id,
      receiver_id: partner.id,
      org_id,
      content,
      status: 'matched',
      sender_named: true,
      receiver_named: true,
      amount: amount || 1000,
      matched_at: new Date().toISOString(),
    })
    .select()
    .single()

  if (error) {
    console.error('[letter/send] matched insert error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ letter, matched: true })
}
