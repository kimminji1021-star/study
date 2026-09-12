'use client'

import { useState } from 'react'
import { FAQS } from '@/lib/site-content'

/** F-L-05: 기본 전체 접힘, 한 번에 하나만 펼친다. */
export function FaqList() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <div className="border-t border-line-800">
      {FAQS.map((faq, i) => {
        const isOpen = openIndex === i
        return (
          <div key={faq.q} className="border-b border-line-800">
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="flex w-full items-start gap-[18px] px-1 py-6 text-left text-fg-strong transition hover:text-fg"
            >
              <span className="flex-1 text-[16.5px] leading-[1.55] font-semibold tracking-[-0.01em] text-pretty">
                {faq.q}
              </span>
              <span className="flex-none text-lg leading-[1.4] font-semibold text-brand">
                {isOpen ? '−' : '+'}
              </span>
            </button>
            {isOpen && (
              <p className="m-0 pr-11 pb-[26px] pl-1 text-[15.5px] leading-[1.78] text-fg-dim text-pretty">
                {faq.a}
              </p>
            )}
          </div>
        )
      })}
    </div>
  )
}
