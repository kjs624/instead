import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return NextResponse.json({ error: '로그인이 필요해요' }, { status: 401 })

  const { group_id, amount } = await request.json()

  if (!group_id || !amount || amount < 100) {
    return NextResponse.json({ error: '참여 금액을 확인해주세요 (최소 100원)' }, { status: 400 })
  }

  const { data: group } = await supabase
    .from('group_donations')
    .select('*')
    .eq('id', group_id)
    .eq('status', 'open')
    .single()

  if (!group) return NextResponse.json({ error: '모금 창을 찾을 수 없어요' }, { status: 404 })

  // mock 결제 처리: 바로 paid_at 기록
  await supabase.from('group_participants').insert({
    group_donation_id: group_id,
    user_id: user.id,
    amount,
    paid_at: new Date().toISOString(),
  })

  const newAmount = group.current_amount + amount

  if (newAmount >= group.target_amount) {
    await supabase
      .from('group_donations')
      .update({ current_amount: newAmount, status: 'completed', completed_at: new Date().toISOString() })
      .eq('id', group_id)

    return NextResponse.json({ success: true, completed: true, current_amount: newAmount })
  }

  await supabase
    .from('group_donations')
    .update({ current_amount: newAmount })
    .eq('id', group_id)

  return NextResponse.json({ success: true, completed: false, current_amount: newAmount })
}

export async function PUT(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return NextResponse.json({ error: '로그인이 필요해요' }, { status: 401 })

  const { org_id, title, target_amount } = await request.json()

  if (!org_id || !title || !target_amount || target_amount > 9999999) {
    return NextResponse.json({ error: '입력값을 확인해주세요' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('group_donations')
    .insert({
      creator_id: user.id,
      org_id,
      title,
      target_amount,
      current_amount: 0,
      status: 'open',
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: '모금 창 개설에 실패했어요' }, { status: 500 })

  return NextResponse.json({ success: true, group: data })
}
