'use client'

import { useEffect, useState, useSyncExternalStore } from 'react'
import { trackEvent } from '@/lib/analytics'
import { COHORT } from '@/lib/site-content'

/** F-L-03: 폼으로 이동한 뒤 첫 필드에 포커스를 준다. */
export function scrollToApply(position: string) {
  trackEvent('cta_click', { position })
  const el = document.getElementById('apply')
  if (!el) return
  window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 70, behavior: 'smooth' })
  setTimeout(() => document.getElementById('f-name')?.focus({ preventScroll: true }), 520)
}

export function ApplyButton({
  position,
  children,
  className,
}: {
  position: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <button type="button" onClick={() => scrollToApply(position)} className={className}>
      {children}
    </button>
  )
}

// 정적 프리렌더 시각과 방문 시각이 다를 수 있어 서버에서는 비워 두고, 클라이언트에서 한 번만 센다.
let cachedDays: number | null = null
const readDays = () => {
  if (cachedDays === null) {
    const diff = new Date(COHORT.deadline).getTime() - Date.now()
    cachedDays = Math.max(0, Math.ceil(diff / 86_400_000))
  }
  return cachedDays
}
const noSubscribe = () => () => {}

/** 남은 모집일. 마감일이 지나면 '모집 마감'으로 표시한다. */
export function useDeadline() {
  return useSyncExternalStore(noSubscribe, readDays, () => null)
}

/** F-L-03: 폼이 화면에 들어오면 숨긴다. */
export function FloatingCta() {
  const [hidden, setHidden] = useState(false)
  const days = useDeadline()

  useEffect(() => {
    const target = document.getElementById('apply')
    if (!target || !('IntersectionObserver' in window)) return
    const io = new IntersectionObserver(([entry]) => setHidden(entry.isIntersecting), {
      threshold: 0.12,
    })
    io.observe(target)
    return () => io.disconnect()
  }, [])

  if (hidden) return null

  return (
    <div className="fixed inset-x-5 bottom-5 z-70 ml-auto max-w-[340px]">
      <button
        type="button"
        onClick={() => scrollToApply('floating')}
        className="flex w-full items-center justify-center gap-2.5 bg-brand px-[22px] py-[17px] text-[15.5px] font-bold text-white shadow-[0_14px_34px_rgba(0,0,0,0.5)] transition hover:bg-brand-hover"
      >
        1:1 무료 상담 신청
        <span className="text-xs font-semibold text-brand-pale">
          {COHORT.label} {days === null ? '' : days > 0 ? `D-${days}` : '마감'}
        </span>
      </button>
    </div>
  )
}
