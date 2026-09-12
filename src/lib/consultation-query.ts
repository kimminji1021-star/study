import type { Prisma } from '@/generated/prisma'
import { ConsultationStatus } from '@/generated/prisma'

export const PAGE_SIZE = 20

export type ConsultationFilters = {
  status?: string
  q?: string
  from?: string
  to?: string
  page?: string
}

/** 목록·CSV·건수 집계가 같은 조건을 쓰도록 한 곳에서 만든다. */
export function buildConsultationWhere(filters: ConsultationFilters): Prisma.ConsultationRequestWhereInput {
  const status =
    filters.status && filters.status in ConsultationStatus
      ? (filters.status as ConsultationStatus)
      : undefined

  const q = filters.q?.trim()
  const digits = q?.replace(/\D/g, '')

  // to 는 그날 하루 전체를 포함해야 하므로 다음 날 00:00 미만으로 본다.
  const from = filters.from ? new Date(`${filters.from}T00:00:00`) : undefined
  const toDate = filters.to ? new Date(`${filters.to}T00:00:00`) : undefined
  if (toDate) toDate.setDate(toDate.getDate() + 1)

  return {
    isDeleted: false,
    ...(status ? { status } : {}),
    ...(from || toDate
      ? { createdAt: { ...(from ? { gte: from } : {}), ...(toDate ? { lt: toDate } : {}) } }
      : {}),
    ...(q
      ? {
          OR: [
            { name: { contains: q, mode: 'insensitive' as const } },
            ...(digits ? [{ phone: { contains: digits } }] : []),
          ],
        }
      : {}),
  }
}

export function parsePage(raw?: string) {
  const n = Number(raw)
  return Number.isInteger(n) && n > 0 ? n : 1
}
