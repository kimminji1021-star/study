import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { consultationSchema, ticketNo } from '@/lib/consultation-schema'

/** F-F-05: 같은 번호로 24시간 내 재신청은 막는다. */
const DUPLICATE_WINDOW_MS = 24 * 60 * 60 * 1000

export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      { error: '일시적인 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.' },
      { status: 400 },
    )
  }

  const parsed = consultationSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: '입력값을 확인해 주세요.', fields: z.flattenError(parsed.error).fieldErrors },
      { status: 422 },
    )
  }

  const { website, message, referrer, ...rest } = parsed.data

  // 봇 트랩에 값이 있으면 성공처럼 응답하고 버린다.
  if (website) return NextResponse.json({ ok: true })

  const recent = await prisma.consultationRequest.findFirst({
    where: {
      phone: rest.phone,
      isDeleted: false,
      createdAt: { gte: new Date(Date.now() - DUPLICATE_WINDOW_MS) },
    },
    select: { id: true },
  })
  if (recent) {
    return NextResponse.json(
      { error: '이미 접수된 신청이 있습니다. 담당자가 곧 연락드릴 예정입니다.', duplicate: true },
      { status: 409 },
    )
  }

  const created = await prisma.consultationRequest.create({
    data: {
      ...rest,
      message: message || null,
      referrer: referrer || request.headers.get('referer') || null,
      histories: { create: { nextStatus: 'NEW', changedBy: '시스템' } },
    },
    select: { id: true, seq: true, createdAt: true, course: true },
  })

  return NextResponse.json(
    {
      ok: true,
      ticket: ticketNo(created.createdAt, created.seq),
      course: created.course,
    },
    { status: 201 },
  )
}
