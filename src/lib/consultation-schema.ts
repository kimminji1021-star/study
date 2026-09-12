import { z } from 'zod'

/** PRD 6.4 상담 상태값. 순서가 곧 관리자 화면의 노출 순서. */
export const CONSULTATION_STATUSES = {
  NEW: '접수',
  IN_PROGRESS: '연락중',
  NO_ANSWER: '부재중',
  DONE: '상담완료',
  CONVERTED: '등록',
  HOLD: '보류',
  CLOSED: '종료',
} as const

export type ConsultationStatusCode = keyof typeof CONSULTATION_STATUSES

export const STATUS_ORDER = Object.keys(CONSULTATION_STATUSES) as ConsultationStatusCode[]

/** 목록 상단 필터. 보류·종료는 기본 필터에서 제외(디자인 기준). */
export const STATUS_FILTERS: { code: 'ALL' | ConsultationStatusCode; label: string }[] = [
  { code: 'ALL', label: '전체' },
  { code: 'NEW', label: '접수' },
  { code: 'IN_PROGRESS', label: '연락중' },
  { code: 'NO_ANSWER', label: '부재중' },
  { code: 'DONE', label: '상담완료' },
  { code: 'CONVERTED', label: '등록' },
]

export const PREFERRED_TIMES = {
  ANY: '무관',
  MORNING: '오전 (09~12시)',
  AFTERNOON: '오후 (12~18시)',
  EVENING: '저녁 (18~21시)',
} as const

/** 목록처럼 좁은 자리에 쓰는 짧은 라벨. */
export const PREFERRED_TIMES_SHORT = {
  ANY: '무관',
  MORNING: '오전',
  AFTERNOON: '오후',
  EVENING: '저녁',
} as const

const TIME_KEYS = Object.keys(PREFERRED_TIMES) as [
  keyof typeof PREFERRED_TIMES,
  ...(keyof typeof PREFERRED_TIMES)[],
]

const emptyToUndefined = (v: unknown) => (v === '' || v === null ? undefined : v)

/** PRD 5.1: 숫자만 10~11자리. 하이픈은 표시용이므로 검증 전에 제거한다. */
const digitsOnly = (v: unknown) => (typeof v === 'string' ? v.replace(/\D/g, '') : v)

export const consultationSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, '이름을 입력해 주세요.')
    .min(2, '이름은 2~20자로 입력해 주세요.')
    .max(20, '이름은 2~20자로 입력해 주세요.'),
  phone: z.preprocess(
    digitsOnly,
    z
      .string()
      .min(1, '연락처를 입력해 주세요.')
      .regex(/^\d{10,11}$/, '연락처를 정확히 입력해 주세요. (예: 01012345678)'),
  ),
  course: z.string().trim().min(1, '관심 과정을 선택해 주세요.').max(100),
  preferredTime: z.enum(TIME_KEYS).default('ANY'),
  message: z.preprocess(emptyToUndefined, z.string().trim().max(500).optional()),
  agreePrivacy: z.literal(true, { error: '개인정보 수집·이용에 동의해 주세요.' }),
  agreeMarketing: z.boolean().default(false),
  // 봇 트랩. 여기서 막지 않고 통과시킨 뒤 핸들러가 조용히 버린다.
  // 검증 오류로 돌려주면 봇에게 탐지 사실을 알려주는 셈이 된다.
  website: z.string().optional(),
  // 유입 정보는 클라이언트가 채워서 보낸다. 없으면 서버가 referer 로 보완.
  utmSource: z.preprocess(emptyToUndefined, z.string().max(100).optional()),
  utmMedium: z.preprocess(emptyToUndefined, z.string().max(100).optional()),
  utmCampaign: z.preprocess(emptyToUndefined, z.string().max(100).optional()),
  referrer: z.preprocess(emptyToUndefined, z.string().max(255).optional()),
  deviceType: z.enum(['PC', 'MOBILE']).optional(),
})

/** 폼이 다루는 원본 값 (phone 은 하이픈 포함). */
export type ConsultationFormValues = z.input<typeof consultationSchema>
/** 검증·정규화를 통과한 값 (phone 은 숫자만). */
export type ConsultationInput = z.output<typeof consultationSchema>

/** 010-1234-5678 형태로 끊어 준다. 입력 중에도 안전하게 동작한다. */
export function formatPhone(raw: string) {
  const d = (raw || '').replace(/\D/g, '').slice(0, 11)
  if (d.length < 4) return d
  if (d.length < 8) return `${d.slice(0, 3)}-${d.slice(3)}`
  return `${d.slice(0, 3)}-${d.slice(3, d.length - 4)}-${d.slice(d.length - 4)}`
}

/** 접수번호. 저장된 일련번호와 접수일을 조합한다. */
export function ticketNo(createdAt: Date, seq: number) {
  const yy = String(createdAt.getFullYear()).slice(2)
  const mm = String(createdAt.getMonth() + 1).padStart(2, '0')
  const dd = String(createdAt.getDate()).padStart(2, '0')
  return `C-${yy}${mm}${dd}-${String(seq).padStart(3, '0')}`
}
