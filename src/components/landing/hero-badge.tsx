'use client'

import { COHORT } from '@/lib/site-content'
import { useDeadline } from './apply-cta'

/** 모집 마감 D-day. 서버/클라이언트 시각 차이를 피하려 마운트 후 계산한다. */
export function HeroBadge() {
  const days = useDeadline()

  return (
    <p className="mb-[26px] inline-flex items-center gap-2.5 border border-brand-line bg-[rgba(107,78,158,0.18)] px-3 py-[7px] text-[13px] font-semibold text-brand-soft">
      <span className="size-1.5 rounded-full bg-brand-light" />
      {COHORT.label} 모집 중
      {days !== null && <span>· {days > 0 ? `마감 D-${days}` : '모집 마감'}</span>}
    </p>
  )
}
