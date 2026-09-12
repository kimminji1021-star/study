'use client'

import { scrollToApply } from './apply-cta'

/** 섹션 사이에 반복 배치하는 CTA. PRD 3.2: 섹션 2~8 사이 최소 2회. */
export function MidCta({
  position,
  children,
  className = '',
}: {
  position: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <button
      type="button"
      onClick={() => scrollToApply(position)}
      className={`flex-none bg-brand font-bold text-white transition hover:bg-brand-hover ${className}`}
    >
      {children}
    </button>
  )
}

export function MidCtaBanner({
  position,
  heading,
  label,
}: {
  position: string
  heading: string
  label: string
}) {
  return (
    <div className="mt-10 flex flex-wrap items-center justify-between gap-5 border border-line-800 bg-ink-750 p-[30px]">
      <p className="text-[clamp(17px,1.8vw,21px)] leading-[1.5] font-bold tracking-[-0.02em] text-pretty">
        {heading}
      </p>
      <MidCta position={position} className="px-[26px] py-[15px] text-[15px]">
        {label}
      </MidCta>
    </div>
  )
}
