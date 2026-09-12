import { prisma } from '@/lib/prisma'
import { buildConsultationWhere } from '@/lib/consultation-query'
import {
  CONSULTATION_STATUSES,
  PREFERRED_TIMES_SHORT,
  ticketNo,
  formatPhone,
} from '@/lib/consultation-schema'
import { requireAdmin } from '@/app/admin/actions'

const HEADERS = [
  '접수번호',
  '신청일시',
  '이름',
  '연락처',
  '관심과정',
  '희망시간',
  '상태',
  '메모',
  '마케팅수신',
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'referrer',
]

/** F-A-12: 현재 필터 조건 그대로 내보낸다. */
export async function GET(request: Request) {
  await requireAdmin()

  const params = Object.fromEntries(new URL(request.url).searchParams)
  const rows = await prisma.consultationRequest.findMany({
    where: buildConsultationWhere(params),
    orderBy: { createdAt: 'desc' },
  })

  const body = rows.map((r) => [
    ticketNo(r.createdAt, r.seq),
    r.createdAt.toISOString().slice(0, 16).replace('T', ' '),
    r.name,
    formatPhone(r.phone),
    r.course,
    PREFERRED_TIMES_SHORT[r.preferredTime],
    CONSULTATION_STATUSES[r.status],
    (r.adminMemo ?? '').replace(/\n/g, ' '),
    r.agreeMarketing ? '동의' : '미동의',
    r.utmSource ?? '',
    r.utmMedium ?? '',
    r.utmCampaign ?? '',
    r.referrer ?? '',
  ])

  // Excel 이 UTF-8 로 열도록 BOM 을 붙인다.
  const csv =
    '﻿' +
    [HEADERS, ...body]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\r\n')

  const stamp = new Date().toISOString().slice(0, 10)

  return new Response(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="consultations-${stamp}.csv"`,
    },
  })
}
