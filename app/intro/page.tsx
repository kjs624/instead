import Link from 'next/link'
import './intro.css'
import IntroReveal from './IntroReveal'
import { createClient } from '@/lib/supabase/server'

export default async function IntroPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let initial: string | null = null
  if (user) {
    const { data: profile } = await supabase
      .from('users')
      .select('nickname')
      .eq('id', user.id)
      .maybeSingle()
    initial = profile?.nickname?.[0]?.toUpperCase() ?? '?'
  }

  return (
    <div className="ip">
      <div className="ip-notice">현재 데모 버전이며 8월 17일 개발 완료 예정</div>

      <nav className="ip-nav">
        <Link href="/intro" className="ip-logo">🌱 대신 기부</Link>
        <ul className="ip-nav-links">
          <li><Link href="/">편지 기부</Link></li>
          <li><Link href="/together">공동 기부</Link></li>
          <li><Link href="/record">나눔 기록</Link></li>
        </ul>
        {initial ? (
          <Link
            href="/mypage"
            aria-label="마이페이지"
            style={{
              width: 34, height: 34, borderRadius: '50%',
              background: '#3A6E48', color: '#fff',
              fontSize: 14, fontWeight: 700,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              textDecoration: 'none',
            }}
          >
            {initial}
          </Link>
        ) : (
          <Link href="/signup" className="ip-btn-nav">시작할게요</Link>
        )}
      </nav>

      <section className="ip-hero">
        <div>
          <div className="ip-leaf">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c0-5.5-4-10-10-10 5.5 0 10 4 10 10 0-5.5 4-10 10-10-5.5 0-10-4.5-10-10z" />
            </svg>
            기부 커뮤니티
          </div>
          <h1 className="ip-title">
            <span className="tg">代身</span>으로 시작해<br />
            <span className="ta">大信</span>으로 갑니다
          </h1>
          <p className="ip-desc">
            누군가의 마음을 <em>대신(代身)</em> 전하다 보면,<br />
            그 사이에 <span className="ta">대신(大信)</span> — 큰 믿음이 자랍니다.<br /><br />
            씨앗 하나가 숲이 되듯, 작은 나눔이 세상을 바꿔요.
          </p>
          <div className="ip-actions">
            <Link href="/signup" className="ip-btn-primary">함께 시작할게요</Link>
            <Link href="/login" className="ip-btn-secondary">이미 계정이 있어요</Link>
          </div>
        </div>

        <div className="ip-visual" aria-hidden="true">
          <div className="ip-lcard c1">
            <div className="ip-lcard-label lg">매칭 완료</div>
            <div className="ip-lcard-body">아이들을 위해 기부하고 싶은데 지금은 어려워요. 따뜻한 마음 가진 분이 대신해주실 수 있을까요?</div>
            <div className="ip-lcard-footer">
              <span>유니세프 · 1,000원</span>
              <span className="ip-badge bg">매칭됨</span>
            </div>
          </div>
          <div className="ip-lcard c2">
            <div className="ip-lcard-label la">파트너 찾는 중</div>
            <div className="ip-lcard-body">환경을 지키고 싶어요. 제 마음을 대신 전해주실 분을 기다리고 있어요.</div>
            <div className="ip-lcard-footer">
              <span>그린피스 · 2,000원</span>
              <span className="ip-badge ba">대기중</span>
            </div>
          </div>
          <div className="ip-lcard c3">
            <div className="ip-lcard-label lm">기부 완료 ✓</div>
            <div className="ip-lcard-body">따뜻한 마음 잘 전해드렸어요 🌸</div>
            <div className="ip-lcard-footer"><span>대한적십자사 · 5,000원</span></div>
          </div>
        </div>
      </section>

      <hr className="ip-divider" />

      <section className="ip-features">
        <div className="ip-eyebrow">무엇을 할 수 있나요</div>

        <div className="ip-feat-row ip-reveal">
          <div className="ip-ficon fg">💌</div>
          <div>
            <div className="ip-fname">대신 기부 편지</div>
            <div className="ip-ftags">
              <span className="ip-ftag">랜덤 매칭</span>
              <span className="ip-ftag">익명 모드</span>
            </div>
          </div>
          <div className="ip-fdesc">기부 소망을 편지로 적으면 다른 사용자와 자연스럽게 연결돼요. 받은 사람은 수락하거나 거절할 수 있고, 수락하면 따뜻한 나눔이 완성됩니다.</div>
        </div>

        <div className="ip-feat-row ip-reveal" style={{ transitionDelay: '0.12s' }}>
          <div className="ip-ficon fa">🤝</div>
          <div>
            <div className="ip-fname">공동 기부</div>
            <div className="ip-ftags">
              <span className="ip-ftag">목표 금액</span>
              <span className="ip-ftag">함께 참여</span>
            </div>
          </div>
          <div className="ip-fdesc">혼자는 어려운 큰 기부도 여럿이 모이면 가능해요. 모금 창을 열면 누구나 함께 참여해 마음을 모을 수 있습니다.</div>
        </div>

        <div className="ip-feat-row ip-reveal" style={{ transitionDelay: '0.24s' }}>
          <div className="ip-ficon fg">📸</div>
          <div>
            <div className="ip-fname">나눔 기록</div>
            <div className="ip-ftags">
              <span className="ip-ftag">기록 공유</span>
              <span className="ip-ftag">응원하기</span>
            </div>
          </div>
          <div className="ip-fdesc">직접 한 기부와 봉사를 기록하고 서로 응원해요. 작은 선행 하나하나가 모여 더 따뜻한 커뮤니티가 됩니다.</div>
        </div>
      </section>

      <div className="ip-cta-wrap">
        <div className="ip-cta-band ip-reveal">
          <div>
            <div className="ip-cta-h">오늘 심은 씨앗이<br /><span>누군가의 숲</span>이 됩니다</div>
            <div className="ip-cta-p">첫 편지를 써보세요. 작은 마음 하나가 큰 믿음이 되어요.</div>
          </div>
          <Link href="/signup" className="ip-btn-primary" style={{ whiteSpace: 'nowrap', flexShrink: 0 }}>
            함께 시작할게요 →
          </Link>
        </div>
      </div>

      <footer className="ip-footer">
        <div className="ip-footer-logo">🌱 대신 기부</div>
        <div>현재 데모 버전 · 8월 17일 개발 완료 예정</div>
      </footer>

      <IntroReveal />
    </div>
  )
}
