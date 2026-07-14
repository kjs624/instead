export type UserRole = 'wisher' | 'partner'

export interface User {
  id: string
  nickname: string
  email: string
  avatar_url: string | null
  push_token: string | null
  created_at: string
}

export interface Organization {
  id: string
  name: string
  description: string
  logo_url: string | null
  category: string
}

export type LetterStatus = 'pending' | 'matched' | 'accepted' | 'rejected' | 'completed'

export interface Letter {
  id: string
  sender_id: string
  receiver_id: string | null
  org_id: string
  content: string
  status: LetterStatus
  sender_named: boolean
  receiver_named: boolean
  amount: number
  created_at: string
  matched_at: string | null
  completed_at: string | null
  sender?: User
  receiver?: User
  organization?: Organization
}

export type GroupDonationStatus = 'open' | 'completed' | 'cancelled'

export interface GroupDonation {
  id: string
  creator_id: string
  org_id: string
  title: string
  target_amount: number
  current_amount: number
  status: GroupDonationStatus
  created_at: string
  completed_at: string | null
  creator?: User
  organization?: Organization
  participants?: GroupParticipant[]
}

export interface GroupParticipant {
  id: string
  group_donation_id: string
  user_id: string
  amount: number
  paid_at: string
  user?: User
}

export interface DonationRecord {
  id: string
  user_id: string
  content: string
  image_url: string | null
  likes_count: number
  created_at: string
  user?: User
  liked_by_me?: boolean
}

export interface RecordLike {
  id: string
  record_id: string
  user_id: string
  created_at: string
}

export interface Toast {
  id: string
  message: string
  type: 'info' | 'success' | 'error'
}
