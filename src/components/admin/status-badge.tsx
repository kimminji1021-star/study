import { CONSULTATION_STATUSES, type ConsultationStatusCode } from '@/lib/consultation-schema'

/** 시안 STATUS 맵과 동일한 색. 목록/상세에서 같은 뱃지를 쓴다. */
const STYLES: Record<ConsultationStatusCode, string> = {
  NEW: 'text-brand-soft bg-[rgba(107,78,158,0.22)] border-brand-line',
  IN_PROGRESS: 'text-[#8FC8E8] bg-[rgba(47,111,143,0.2)] border-[#2F5C73]',
  NO_ANSWER: 'text-[#F0B98A] bg-[rgba(180,110,50,0.18)] border-[#6B4A2C]',
  DONE: 'text-fg-dim bg-white/6 border-line-500',
  CONVERTED: 'text-[#9FE0B8] bg-[rgba(63,125,99,0.22)] border-[#2F5C46]',
  HOLD: 'text-fg-dim bg-white/4 border-line-700',
  CLOSED: 'text-fg-disabled bg-transparent border-line-800',
}

export function StatusBadge({ status }: { status: ConsultationStatusCode }) {
  return (
    <span className={`inline-block border px-2.5 py-1 text-xs font-bold ${STYLES[status]}`}>
      {CONSULTATION_STATUSES[status]}
    </span>
  )
}

export const STATUS_BADGE_STYLES = STYLES
