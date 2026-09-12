'use client'

import { useEffect, useState } from 'react'
import { PRIVACY_SECTIONS, SITE } from '@/lib/site-content'

const OPEN_EVENT = 'privacy-dialog:open'

/** 폼·푸터 등 어디서든 모달을 열 수 있게 이벤트로 연결한다. */
export function openPrivacyDialog() {
  window.dispatchEvent(new Event(OPEN_EVENT))
}

export function PrivacyDialog() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const show = () => setOpen(true)
    window.addEventListener(OPEN_EVENT, show)
    return () => window.removeEventListener(OPEN_EVENT, show)
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  if (!open) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="개인정보 수집·이용 동의 전문"
      onClick={(e) => e.target === e.currentTarget && setOpen(false)}
      className="fixed inset-0 z-130 flex items-center justify-center bg-[rgba(6,5,9,0.78)] p-6 backdrop-blur-[4px]"
    >
      <div className="flex max-h-[82vh] w-full max-w-[620px] flex-col border border-line-700 bg-ink-700">
        <div className="flex items-center justify-between gap-4 border-b border-line-800 px-[30px] py-[26px]">
          <h3 className="text-[19px] font-bold tracking-tight">개인정보 수집·이용 동의 (전문)</h3>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="닫기"
            className="size-8 flex-none border border-line-600 text-base text-fg-dim transition hover:text-fg"
          >
            ✕
          </button>
        </div>

        <div className="overflow-auto px-[30px] py-[26px] text-[14.5px] leading-[1.85] text-fg-dim">
          <p className="mb-[18px]">
            {SITE.name}은 교육 과정 상담 제공을 위해 아래와 같이 개인정보를 수집·이용합니다.
          </p>
          {PRIVACY_SECTIONS.map((section) => (
            <div key={section.title} className="mb-[18px] border-l-2 border-brand pl-3.5 last:mb-0">
              <strong className="text-fg-strong">{section.title}</strong>
              <br />
              <span className="whitespace-pre-line">{section.body}</span>
            </div>
          ))}
          <p className="mt-[22px] text-[13px] text-fg-disabled">
            ※ 본 문안은 시안용 예시입니다. 실제 오픈 전 발주사 개인정보처리방침과 문안을 일치시켜야 합니다.
            (PRD 5.4 / OI-1)
          </p>
        </div>
      </div>
    </div>
  )
}
