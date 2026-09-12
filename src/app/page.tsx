import { SiteHeader } from '@/components/landing/site-header'
import { FaqList } from '@/components/landing/faq-list'
import { ApplySection } from '@/components/landing/apply-section'
import { FloatingCta } from '@/components/landing/apply-cta'
import { MidCta, MidCtaBanner } from '@/components/landing/mid-cta'
import { HeroBadge } from '@/components/landing/hero-badge'
import { PrivacyDialog } from '@/components/landing/privacy-dialog'
import { PrivacyLink } from '@/components/landing/privacy-link'
import {
  CURRICULUM,
  HERO,
  INSTRUCTORS,
  OUTCOME_CASES,
  OUTCOME_STATS,
  PRICE,
  PROBLEMS,
  REVIEWS,
  SITE,
} from '@/lib/site-content'

const eyebrow = 'mb-[18px] text-[13px] font-bold tracking-[0.14em] text-fg-ghost'
const h2 = 'text-[clamp(26px,3vw,38px)] leading-[1.32] font-extrabold tracking-[-0.03em] text-pretty'
const shell = 'mx-auto max-w-[1180px] px-6 py-[clamp(56px,7vw,96px)]'

export default function Home() {
  return (
    <>
      <SiteHeader />

      <main>
        {/* Hero */}
        <section id="hero" className="scroll-mt-20 border-b border-line-900">
          <div className="mx-auto grid max-w-[1180px] grid-cols-1 items-center gap-[clamp(32px,5vw,64px)] px-6 pt-[clamp(48px,7vw,96px)] pb-[clamp(56px,7vw,104px)] lg:grid-cols-2">
            <div className="animate-fadeup">
              <HeroBadge />
              <h1 className="mb-[22px] text-[clamp(34px,4.6vw,58px)] leading-[1.18] font-extrabold tracking-[-0.035em] text-pretty">
                {HERO.headline.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </h1>
              <p className="mb-8 max-w-[33em] text-[clamp(16px,1.4vw,19px)] leading-[1.72] text-[#B4AFC1] text-pretty">
                <strong className="font-semibold text-fg">{SITE.name}</strong>
                {HERO.bodyTail}
              </p>

              <div className="mb-[30px] flex flex-wrap gap-2.5">
                <MidCta position="hero" className="px-7 py-4 text-base">
                  1:1 무료 상담 신청하기
                </MidCta>
                <a
                  href="#curriculum"
                  className="border border-line-500 px-[26px] py-4 text-base font-semibold text-fg transition hover:border-brand hover:text-brand-soft"
                >
                  커리큘럼 먼저 보기
                </a>
              </div>

              <div className="flex flex-wrap gap-x-5 gap-y-2 text-[13.5px] text-fg-faint">
                {HERO.meta.map((item, i) => (
                  <span key={item} className="flex gap-x-5">
                    {i > 0 && <span className="text-line-500">·</span>}
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="animate-fadeup">
              <div className="flex min-h-[320px] items-end border border-line-700 p-[22px] [aspect-ratio:4/5] [background:repeating-linear-gradient(135deg,#1A181F_0_10px,#15141A_10px_20px)]">
                <p className="font-mono text-xs leading-relaxed text-fg-ghost">
                  [ 이미지 ]
                  <br />
                  강의 현장 또는 대표 강사 촬영컷
                  <br />
                  권장 1200×1500 · WebP
                </p>
              </div>
              <dl className="mt-px grid grid-cols-1 gap-px border border-line-700 bg-line-700 sm:grid-cols-3">
                {HERO.stats.map((stat) => (
                  <div key={stat.label} className="bg-ink-750 p-4">
                    <dd className="text-[22px] font-extrabold tracking-[-0.02em] text-brand-soft">
                      {stat.value}
                    </dd>
                    <dt className="mt-1 text-[12.5px] text-fg-faint">{stat.label}</dt>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </section>

        {/* Problem */}
        <section id="problem" className="scroll-mt-20 border-b border-line-900 bg-ink-800">
          <div className={shell}>
            <p className={eyebrow}>WHY NOW</p>
            <h2 className={`${h2} mb-3.5`}>
              혹시 이런 상태로
              <br />몇 달째 멈춰 있진 않으신가요
            </h2>
            <p className="mb-11 text-base leading-relaxed text-fg-faint">
              12기 수강생의 78%가 아래 문장 중 하나로 첫 상담을 시작했습니다.
            </p>

            <div className="grid grid-cols-1 gap-px border border-line-800 bg-line-800 sm:grid-cols-2">
              {PROBLEMS.map((problem) => (
                <div key={problem.no} className="bg-ink-750 px-[26px] pt-[30px] pb-[34px]">
                  <p className="mb-4 font-mono text-xs text-brand">{problem.no}</p>
                  <p className="text-[16.5px] leading-[1.7] text-fg-strong text-pretty">{problem.text}</p>
                </div>
              ))}
            </div>

            <p className="mt-8 border-l-2 border-brand bg-[rgba(107,78,158,0.12)] px-6 py-5 text-base leading-[1.72] text-[#CFC9DC] text-pretty">
              괜찮습니다. 문제는 의지가 아니라{' '}
              <strong className="font-semibold text-white">
                &lsquo;내 업무에 어떻게 적용할지&rsquo;를 대신 고민해 줄 사람
              </strong>
              이 없었던 것입니다. 그 역할을 현직자 강사가 8주 동안 맡습니다.
            </p>
          </div>
        </section>

        {/* Curriculum */}
        <section id="curriculum" className="scroll-mt-20 border-b border-line-900">
          <div className={shell}>
            <div className="mb-11 flex flex-wrap items-end justify-between gap-6">
              <div>
                <p className={eyebrow}>CURRICULUM</p>
                <h2 className={h2}>8주 뒤, 손에 남는 것으로 설계했습니다</h2>
              </div>
              <p className="text-sm leading-[1.8] text-fg-faint">
                {CURRICULUM.note.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-px border border-line-800 bg-line-800 sm:grid-cols-2 lg:grid-cols-4">
              {CURRICULUM.weeks.map((week) => (
                <div key={week.range} className="flex flex-col gap-3.5 bg-ink-750 px-[26px] pt-[30px] pb-[34px]">
                  <p className="font-mono text-xs tracking-[0.06em] text-brand-soft">{week.range}</p>
                  <h3 className="text-[19px] leading-[1.45] font-bold tracking-[-0.02em]">{week.title}</h3>
                  <ul className="flex flex-col gap-2.5">
                    {week.items.map((item) => (
                      <li
                        key={item}
                        className="relative pl-[15px] text-[14.5px] leading-[1.65] text-fg-dim text-pretty before:absolute before:top-[9px] before:left-0 before:h-px before:w-[5px] before:bg-brand"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-auto border-t border-[#221F2A] pt-4 text-[13px] text-fg-ghost">
                    산출물 · {week.output}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Outcome */}
        <section id="outcome" className="scroll-mt-20 border-b border-line-900 bg-ink-800">
          <div className={shell}>
            <p className={eyebrow}>OUTCOME</p>
            <h2 className={`${h2} mb-11`}>수료 후에 실제로 무엇이 달라졌나</h2>

            <dl className="mb-10 grid grid-cols-1 gap-px border border-line-800 bg-line-800 sm:grid-cols-3">
              {OUTCOME_STATS.map((stat) => (
                <div key={stat.label} className="bg-ink-750 px-[26px] py-[34px]">
                  <dd className="text-[clamp(32px,3.6vw,44px)] leading-none font-extrabold tracking-[-0.04em] text-brand-soft">
                    {stat.value}
                  </dd>
                  <dt className="mt-3 text-[15px] font-semibold text-fg-strong">{stat.label}</dt>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-fg-ghost">{stat.note}</p>
                </div>
              ))}
            </dl>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {OUTCOME_CASES.map((item) => (
                <article
                  key={item.who}
                  className="flex items-start gap-5 border border-line-800 bg-ink-750 p-7"
                >
                  <div className="size-16 flex-none border border-line-700 [background:repeating-linear-gradient(135deg,#1A181F_0_6px,#15141A_6px_12px)]" />
                  <div>
                    <p className="mb-2 text-[13px] text-fg-ghost">
                      {item.before} → <span className="text-brand-soft">{item.after}</span>
                    </p>
                    <p className="mb-3 text-base leading-[1.7] text-fg-strong text-pretty">{item.quote}</p>
                    <p className="text-[13px] text-fg-faint">{item.who}</p>
                  </div>
                </article>
              ))}
            </div>

            <MidCtaBanner
              position="outcome"
              heading="내 직무에도 맞을지, 10분만 이야기해 보시겠어요?"
              label="상담 신청 · 비용 없음"
            />
          </div>
        </section>

        {/* Instructor */}
        <section id="instructor" className="scroll-mt-20 border-b border-line-900">
          <div className={shell}>
            <p className={eyebrow}>INSTRUCTOR</p>
            <h2 className={`${h2} mb-3.5`}>가르치는 사람이 지금도 그 일을 하고 있습니다</h2>
            <p className="mb-11 text-base leading-relaxed text-fg-faint">
              전임 강사가 아니라, 현업에서 같은 문제를 매주 푸는 실무자들이 수업을 맡습니다.
            </p>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {INSTRUCTORS.map((person) => (
                <article key={person.name + person.role} className="border border-line-800 bg-ink-750">
                  <div className="flex items-end border-b border-line-800 p-4 [aspect-ratio:4/3] [background:repeating-linear-gradient(135deg,#1A181F_0_10px,#15141A_10px_20px)]">
                    <p className="font-mono text-[11.5px] text-fg-disabled">[ 강사 프로필 사진 ]</p>
                  </div>
                  <div className="p-[26px]">
                    <p className="mb-2 text-[13px] text-brand-soft">{person.role}</p>
                    <h3 className="mb-3.5 text-xl font-bold tracking-[-0.02em]">{person.name}</h3>
                    <ul className="flex flex-col gap-2">
                      {person.career.map((line) => (
                        <li key={line} className="text-sm leading-relaxed text-fg-dim">
                          {line}
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Review */}
        <section id="review" className="scroll-mt-20 border-b border-line-900 bg-ink-800">
          <div className={shell}>
            <p className={eyebrow}>REVIEW</p>
            <h2 className={`${h2} mb-11`}>먼저 8주를 지난 분들의 말</h2>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {REVIEWS.map((review) => (
                <figure
                  key={review.who}
                  className="flex flex-col gap-[18px] border border-line-800 bg-ink-750 px-[26px] py-[30px]"
                >
                  <p className="text-sm tracking-[0.16em] text-brand" aria-label="별점 5점">
                    ★★★★★
                  </p>
                  <blockquote className="text-base leading-[1.76] text-fg-strong text-pretty">
                    {review.body}
                  </blockquote>
                  <figcaption className="mt-auto border-t border-[#221F2A] pt-4 text-[13.5px] text-fg-faint">
                    {review.who}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        {/* Price */}
        <section id="price" className="scroll-mt-20 border-b border-line-900">
          <div className={shell}>
            <p className={eyebrow}>PRICE</p>
            <h2 className={`${h2} mb-11`}>비용은 상담에서 숨기지 않습니다</h2>

            <div className="grid grid-cols-1 items-start gap-5 md:grid-cols-3">
              <div className="border border-line-800 bg-ink-750 px-[30px] py-[34px]">
                <p className="mb-3.5 text-sm text-fg-faint">{PRICE.list.label}</p>
                <p className="text-[34px] font-extrabold tracking-[-0.03em] text-fg-strong">
                  {PRICE.list.amount}
                  <span className="ml-1 text-lg font-semibold">원</span>
                </p>
                <p className="mt-2 text-[13.5px] text-fg-ghost">{PRICE.list.note}</p>
              </div>

              <div className="border border-brand-line bg-[rgba(107,78,158,0.14)] px-[30px] py-[34px]">
                <p className="mb-3.5 inline-block bg-brand px-2.5 py-[5px] text-xs font-bold text-white">
                  {PRICE.subsidized.badge}
                </p>
                <p className="text-[34px] font-extrabold tracking-[-0.03em] text-white">
                  {PRICE.subsidized.amount}
                  <span className="ml-1 text-lg font-semibold">원</span>
                </p>
                <p className="mt-2 text-[13.5px] text-[#BDB4D2]">{PRICE.subsidized.note}</p>
              </div>

              <div className="border border-line-800 bg-ink-750 px-[30px] py-[34px]">
                <p className="mb-4 text-sm text-fg-faint">결제 방식</p>
                <ul className="flex flex-col gap-[11px] text-[14.5px] leading-relaxed text-fg-muted">
                  {PRICE.methods.map((method) => (
                    <li key={method}>{method}</li>
                  ))}
                </ul>
              </div>
            </div>

            <p className="mt-[26px] text-[13.5px] leading-[1.7] text-fg-ghost">{PRICE.disclaimer}</p>

            <MidCtaBanner
              position="price"
              heading="내가 지원금을 받을 수 있는지, 상담에서 3분이면 확인됩니다"
              label="지원 자격 확인하기"
            />
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="scroll-mt-20 border-b border-line-900 bg-ink-800">
          <div className="mx-auto max-w-[900px] px-6 py-[clamp(56px,7vw,96px)]">
            <p className={eyebrow}>FAQ</p>
            <h2 className={`${h2} mb-11`}>신청 전에 가장 많이 묻는 것들</h2>
            <FaqList />
          </div>
        </section>

        <ApplySection />
      </main>

      <footer className="border-t border-line-900 bg-ink-900">
        <div className="mx-auto grid max-w-[1180px] grid-cols-1 gap-8 px-6 pt-[54px] pb-[90px] sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <p className="mb-3.5 text-[17px] font-extrabold tracking-[-0.02em]">{SITE.name}</p>
            <p className="text-[13px] leading-[1.85] text-fg-disabled">
              {SITE.company} · 대표 {SITE.ceo}
              <br />
              사업자등록번호 {SITE.bizNo}
              <br />
              통신판매업신고 {SITE.mailOrderNo}
              <br />
              {SITE.address}
            </p>
          </div>

          <div>
            <p className="mb-3.5 text-[13px] font-bold tracking-[0.12em] text-fg-quiet">CONTACT</p>
            <p className="text-[13px] leading-[1.85] text-fg-disabled">
              대표번호 {SITE.phone} ({SITE.phoneHours})
              <br />
              {SITE.email}
            </p>
          </div>

          <div>
            <p className="mb-3.5 text-[13px] font-bold tracking-[0.12em] text-fg-quiet">POLICY</p>
            <div className="flex flex-col gap-2.5 text-[13px]">
              <PrivacyLink>개인정보처리방침</PrivacyLink>
              <PrivacyLink>환불 규정</PrivacyLink>
            </div>
            <p className="mt-5 text-[12.5px] text-[#45414F]">
              © {new Date().getFullYear()} JD Corporate Education. 본 페이지의 성과 수치는 시안용
              예시입니다.
            </p>
          </div>
        </div>
      </footer>

      <FloatingCta />
      <PrivacyDialog />
    </>
  )
}
