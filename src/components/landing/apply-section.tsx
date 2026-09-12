'use client'

import { useState } from 'react'
import { ConsultationForm } from './consultation-form'
import { openPrivacyDialog } from './privacy-dialog'
import { APPLY_POINTS } from '@/lib/site-content'

type Done = { ticket: string; course: string }

export function ApplySection() {
  const [done, setDone] = useState<Done | null>(null)

  return (
    <section id="apply" className="scroll-mt-20">
      <div className="mx-auto grid max-w-[1180px] grid-cols-1 items-start gap-[clamp(32px,5vw,64px)] px-6 pt-[clamp(56px,7vw,96px)] pb-[clamp(80px,9vw,120px)] lg:grid-cols-2">
        <div>
          <p className="mb-[18px] text-[13px] font-bold tracking-[0.14em] text-fg-ghost">APPLY</p>
          <h2 className="mb-[18px] text-[clamp(28px,3.2vw,42px)] leading-[1.28] font-extrabold tracking-[-0.03em] text-pretty">
            이름과 연락처만 남겨 주세요
          </h2>
          <p className="mb-[30px] text-base leading-[1.74] text-fg-dim text-pretty">
            상담 담당자가 <strong className="font-semibold text-fg">영업일 기준 1일 내</strong>에
            연락드립니다. 결제를 권하는 전화가 아니라, 지금 상황에 이 과정이 맞는지 먼저 확인하는 통화입니다.
          </p>

          <ul className="flex flex-col gap-3.5">
            {APPLY_POINTS.map((point, i) => (
              <li key={point} className="flex gap-3 text-[15px] leading-relaxed text-fg-muted">
                <span className="font-bold text-brand">{String(i + 1).padStart(2, '0')}</span>
                {point}
              </li>
            ))}
          </ul>

          <p className="mt-[34px] border border-line-800 bg-ink-750 px-6 py-[22px] text-[13.5px] leading-[1.75] text-fg-faint">
            만 14세 이상만 신청할 수 있습니다.
            <br />
            상담 목적 외로 연락처를 사용하지 않습니다.
          </p>
        </div>

        <ConsultationForm onDone={setDone} onOpenPrivacy={openPrivacyDialog} />
      </div>

      {done && <DoneDialog result={done} onClose={() => setDone(null)} />}
    </section>
  )
}

function DoneDialog({ result, onClose }: { result: Done; onClose: () => void }) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-120 flex items-center justify-center bg-[rgba(6,5,9,0.78)] p-6 backdrop-blur-[4px]"
    >
      <div className="animate-fadeup w-full max-w-[460px] border border-line-700 bg-ink-700 px-[34px] py-10">
        <div className="mb-6 flex size-[46px] items-center justify-center bg-brand text-[22px] text-white">
          ✓
        </div>
        <h3 className="mb-3.5 text-2xl font-extrabold tracking-tight">상담 신청이 접수되었습니다</h3>
        <p className="mb-[26px] text-[15.5px] leading-[1.76] text-fg-dim text-pretty">
          상담 담당자가{' '}
          <strong className="font-semibold text-fg">영업일 기준 1일 내(평일 10:00~19:00)</strong>에
          남겨주신 번호로 연락드립니다. 모르는 번호로 표시될 수 있으니 확인 부탁드립니다.
        </p>
        <div className="mb-[26px] border border-line-800 bg-ink-850 px-[18px] py-4 text-sm leading-[1.8] text-fg-faint">
          접수번호 {result.ticket}
          <br />
          관심 과정 {result.course}
        </div>
        <button
          type="button"
          onClick={onClose}
          className="w-full bg-brand py-[15px] text-[15px] font-bold text-white transition hover:bg-brand-hover"
        >
          확인
        </button>
      </div>
    </div>
  )
}
