export interface OrgOption {
  id: string
  name: string
  description: string
  category: string
}

export const ORGANIZATIONS: OrgOption[] = [
  { id: 'unicef', name: '유니세프', description: '전 세계 어린이를 위한 긴급 구호 및 개발 지원', category: '아동' },
  { id: 'worldvision', name: '월드비전', description: '취약계층 아동과 가족의 삶 개선', category: '아동' },
  { id: 'greenpeace', name: '그린피스', description: '환경 보호와 기후변화 대응', category: '환경' },
  { id: 'redcross', name: '대한적십자사', description: '재난 구호 및 혈액 사업', category: '인도주의' },
  { id: 'community-chest', name: '사회복지공동모금회', description: '소외 이웃을 위한 나눔 캠페인', category: '복지' },
  { id: 'beautiful-store', name: '아름다운가게', description: '물건 나눔으로 공정한 사회 만들기', category: '나눔' },
  { id: 'save-children', name: '세이브더칠드런', description: '아동의 생존·보호·발달·참여 지원', category: '아동' },
  { id: 'hope-bridge', name: '희망브리지', description: '재난 피해자 긴급 구호 및 복구 지원', category: '재난' },
]
