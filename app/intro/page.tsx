import Link from 'next/link'
import IntroReveal from './IntroReveal'
import { createClient } from '@/lib/supabase/server'

const css = `
.ip {
  min-height: 100vh;
  background: #F1F7EF;
  color: #1E2D1A;
  font-family: 'Pretendard Variable', Pretendard, -apple-system, 'Apple SD Gothic Neo', sans-serif;
  font-size: 16px;
  line-height: 1.7;
  -webkit-font-smoothing: antialiased;
}
.ip-notice {
  text-align: right;
  padding: 7px 48px;
  font-size: 11px;
  color: #8AAE7E;
  background: #E6F0E3;
  border-bottom: 1px solid #D2E5CC;
  letter-spacing: 0.02em;
}
.ip-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 48px;
  height: 64px;
  background: rgba(241,247,239,0.92);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid #D2E5CC;
  position: sticky;
  top: 0;
  z-index: 100;
}
.ip-logo {
  font-size: 17px;
  font-weight: 800;
  color: #1E2D1A;
  letter-spacing: -0.02em;
  display: flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
}
.ip-nav-links {
  display: flex;
  gap: 36px;
  list-style: none;
  padding: 0;
  margin: 0;
}
.ip-nav-links a {
  color: #5A7050;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: color 0.15s;
}
.ip-nav-links a:hover { color: #1E2D1A; }
.ip-btn-nav {
  background: #1E2D1A;
  color: #F1F7EF;
  font-size: 13px;
  font-weight: 700;
  padding: 9px 20px;
  border-radius: 40px;
  text-decoration: none;
  transition: opacity 0.15s;
  letter-spacing: 0.01em;
}
.ip-btn-nav:hover { opacity: 0.75; }
.ip-hero {
  max-width: 1100px;
  margin: 0 auto;
  padding: 96px 48px 80px;
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 64px;
  align-items: center;
}
.ip-leaf {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #3A6E48;
  margin-bottom: 28px;
}
.ip-leaf svg { width: 16px; height: 16px; }
.ip-title {
  font-size: clamp(40px, 5.5vw, 68px);
  font-weight: 900;
  line-height: 1.1;
  letter-spacing: -0.04em;
  margin-bottom: 28px;
  color: #1E2D1A;
}
.ip-title .tg { color: #3A6E48; }
.ip-title .ta { color: #B87D1A; }
.ip-desc {
  font-size: 16px;
  color: #5A7050;
  line-height: 1.85;
  max-width: 440px;
  margin-bottom: 44px;
}
.ip-desc em { font-style: normal; color: #3A6E48; font-weight: 600; }
.ip-desc .ta { color: #B87D1A; font-weight: 600; }
.ip-actions { display: flex; gap: 12px; flex-wrap: wrap; }
.ip-btn-primary {
  background: #3A6E48;
  color: #fff;
  font-size: 15px;
  font-weight: 700;
  padding: 14px 28px;
  border-radius: 40px;
  text-decoration: none;
  transition: opacity 0.15s, transform 0.1s;
  display: inline-block;
}
.ip-btn-primary:hover { opacity: 0.85; transform: translateY(-1px); }
.ip-btn-secondary {
  background: transparent;
  color: #5A7050;
  font-size: 15px;
  font-weight: 600;
  padding: 14px 24px;
  border-radius: 40px;
  border: 1.5px solid #D2E5CC;
  text-decoration: none;
  transition: border-color 0.15s;
  display: inline-block;
}
.ip-btn-secondary:hover { border-color: #8AAE7E; }
.ip-visual {
  position: relative;
  height: 380px;
  flex-shrink: 0;
}
.ip-lcard {
  position: absolute;
  background: #FAFDF9;
  border: 1px solid #D2E5CC;
  border-radius: 16px;
  padding: 18px 20px;
  width: 230px;
  box-shadow: 0 4px 24px rgba(30,45,26,0.07);
}
.ip-lcard.c1 { top: 0; left: 24px; border-top: 3px solid #3A6E48; }
.ip-lcard.c2 { top: 120px; left: 120px; border-top: 3px solid #B87D1A; }
.ip-lcard.c3 { top: 248px; left: 8px; opacity: 0.5; border-top: 3px solid #D2E5CC; }
.ip-lcard-label {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-bottom: 8px;
}
.ip-lcard-label.lg { color: #3A6E48; }
.ip-lcard-label.la { color: #B87D1A; }
.ip-lcard-label.lm { color: #8AAE7E; }
.ip-lcard-body { font-size: 13px; color: #5A7050; line-height: 1.6; margin-bottom: 12px; }
.ip-lcard-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 11px;
  color: #8AAE7E;
}
.ip-badge {
  font-size: 10px;
  font-weight: 700;
  padding: 2px 9px;
  border-radius: 20px;
}
.ip-badge.bg { background: #E0F0E6; color: #3A6E48; }
.ip-badge.ba { background: #FBF0D8; color: #B87D1A; }
.ip-divider {
  border: none;
  border-top: 1px solid #D2E5CC;
  max-width: 1100px;
  margin: 0 auto;
}
.ip-features {
  max-width: 1100px;
  margin: 0 auto;
  padding: 72px 48px 80px;
}
.ip-eyebrow {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #8AAE7E;
  margin-bottom: 40px;
}
.ip-feat-row {
  display: grid;
  grid-template-columns: 48px 200px 1fr;
  gap: 0 32px;
  align-items: start;
  padding: 28px 0;
  border-bottom: 1px solid #D2E5CC;
  transition: background 0.15s, padding 0.15s, margin 0.15s;
  border-radius: 4px;
}
.ip-feat-row:first-of-type { border-top: 1px solid #D2E5CC; }
.ip-feat-row:hover {
  background: #E6F0E3;
  padding: 28px 16px;
  margin: 0 -16px;
}
.ip-ficon {
  width: 38px; height: 38px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  flex-shrink: 0;
}
.ip-ficon.fg { background: #E0F0E6; }
.ip-ficon.fa { background: #FBF0D8; }
.ip-fname { font-size: 15px; font-weight: 700; color: #1E2D1A; letter-spacing: -0.02em; margin-bottom: 6px; }
.ip-ftags { display: flex; flex-wrap: wrap; gap: 5px; }
.ip-ftag {
  font-size: 10px; font-weight: 600;
  padding: 2px 8px; border-radius: 20px;
  border: 1px solid #D2E5CC; color: #8AAE7E;
}
.ip-fdesc { font-size: 14px; color: #5A7050; line-height: 1.75; padding-top: 2px; }
.ip-cta-wrap { padding: 0 48px 80px; max-width: 1100px; margin: 0 auto; }
.ip-cta-band {
  background: #E6F0E3;
  border: 1px solid #D2E5CC;
  border-radius: 20px;
  padding: 56px 52px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 32px;
}
.ip-cta-h { font-size: 28px; font-weight: 900; letter-spacing: -0.04em; line-height: 1.2; margin-bottom: 10px; color: #1E2D1A; }
.ip-cta-h span { color: #B87D1A; }
.ip-cta-p { font-size: 14px; color: #5A7050; }
.ip-footer {
  border-top: 1px solid #D2E5CC;
  padding: 24px 48px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1100px;
  margin: 0 auto;
  font-size: 13px;
  color: #8AAE7E;
}
.ip-footer-logo { font-weight: 700; color: #5A7050; }

@keyframes ip-fadeUp {
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes ip-float {
  0%, 100% { transform: translateY(0px); }
  50%       { transform: translateY(-8px); }
}
@keyframes ip-floatB {
  0%, 100% { transform: translateY(0px); }
  50%       { transform: translateY(-5px); }
}

.ip-leaf    { opacity: 0; animation: ip-fadeUp 0.6s ease-out 0.1s forwards; }
.ip-title   { opacity: 0; animation: ip-fadeUp 0.7s ease-out 0.25s forwards; }
.ip-desc    { opacity: 0; animation: ip-fadeUp 0.7s ease-out 0.45s forwards; }
.ip-actions { opacity: 0; animation: ip-fadeUp 0.6s ease-out 0.6s forwards; }
.ip-lcard.c1 { animation: ip-float  4.5s ease-in-out 0.3s infinite; }
.ip-lcard.c2 { animation: ip-floatB 5.2s ease-in-out 1.1s infinite; }
.ip-lcard.c3 { animation: ip-float  6s   ease-in-out 0.7s infinite; }

.ip-reveal {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.6s ease-out, transform 0.6s ease-out;
}
.ip-reveal.ip-visible { opacity: 1; transform: translateY(0); }

@media (prefers-reduced-motion: reduce) {
  .ip-leaf, .ip-title, .ip-desc, .ip-actions,
  .ip-lcard.c1, .ip-lcard.c2, .ip-lcard.c3 {
    animation: none; opacity: 1; transform: none;
  }
  .ip-reveal { opacity: 1; transform: none; }
}

@media (max-width: 820px) {
  .ip-nav, .ip-notice { padding-left: 24px; padding-right: 24px; }
  .ip-nav-links { display: none; }
  .ip-hero { grid-template-columns: 1fr; padding: 64px 24px 48px; gap: 0; }
  .ip-visual { display: none; }
  .ip-features { padding: 48px 24px 60px; }
  .ip-feat-row { grid-template-columns: 38px 1fr; }
  .ip-fdesc { display: none; }
  .ip-cta-wrap { padding: 0 24px 60px; }
  .ip-cta-band { flex-direction: column; align-items: flex-start; padding: 36px 28px; }
  .ip-footer { padding: 20px 24px; }
}
`

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
      <style>{css}</style>

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
