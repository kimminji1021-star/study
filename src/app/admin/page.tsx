import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { buildConsultationWhere, PAGE_SIZE, parsePage } from '@/lib/consultation-query'
import {
  CONSULTATION_STATUSES,
  PREFERRED_TIMES_SHORT,
  STATUS_FILTERS,
  formatPhone,
  ticketNo,
} from '@/lib/consultation-schema'
import { SITE } from '@/lib/site-content'
import { requireAdmin, signOut } from './actions'
import { ConsultationDetail } from '@/components/admin/consultation-detail'
import { StatusBadge } from '@/components/admin/status-badge'

export const dynamic = 'force-dynamic'

type SearchParams = { status?: string; q?: string; from?: string; to?: string; page?: string; id?: string }

export default async function AdminPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const admin = await requireAdmin()
  const params = await searchParams

  const where = buildConsultationWhere(params)
  const page = parsePage(params.page)

  const [rows, total, newCount] = await Promise.all([
    prisma.consultationRequest.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.consultationRequest.count({ where }),
    prisma.consultationRequest.count({ where: { isDeleted: false, status: 'NEW' } }),
  ])

  const selected = params.id
    ? await prisma.consultationRequest.findFirst({
        where: { id: params.id, isDeleted: false },
        include: { histories: { orderBy: { changedAt: 'desc' } } },
      })
    : null

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const activeFilter = params.status && params.status in CONSULTATION_STATUSES ? params.status : 'ALL'

  const linkWith = (patch: Record<string, string | undefined>) => {
    const next = new URLSearchParams()
    for (const [k, v] of Object.entries({ ...params, ...patch })) if (v) next.set(k, v)
    return `/admin?${next.toString()}`
  }

  return (
    <div className="min-h-screen bg-ink-850">
      <header className="border-b border-line-900 bg-ink-800">
        <div className="mx-auto flex h-16 max-w-[1420px] items-center gap-5 px-7">
          <p className="text-[15.5px] font-extrabold tracking-[-0.02em]">
            {SITE.name} <span className="font-semibold text-fg-ghost">상담 관리</span>
          </p>
          <p className="flex items-center gap-2 border border-brand-line bg-[rgba(107,78,158,0.16)] px-3 py-1.5 text-[13px] text-brand-soft">
            <span className="size-1.5 rounded-full bg-brand-light" />
            미처리 {newCount}건
          </p>
          <div className="ml-auto flex items-center gap-4 text-[13px] text-fg-ghost">
            <span className="hidden sm:inline">담당 · {admin.name ?? admin.email}</span>
            <form action={signOut}>
              <button className="border border-line-700 px-3 py-1.5 text-[12.5px] text-fg-dim transition hover:text-fg">
                로그아웃
              </button>
            </form>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1420px] p-7">
        {/* 검색 · 필터 */}
        <form action="/admin" className="mb-4 flex flex-wrap items-center gap-2.5">
          <input
            type="search"
            name="q"
            defaultValue={params.q ?? ''}
            placeholder="이름 또는 연락처 검색"
            className="min-w-[220px] flex-1 border border-line-700 bg-ink-750 px-3.5 py-2.5 text-sm text-fg outline-none focus:border-brand"
          />
          <label className="flex items-center gap-2 text-[13px] text-fg-ghost">
            기간
            <input
              type="date"
              name="from"
              defaultValue={params.from ?? ''}
              className="border border-line-700 bg-ink-750 px-3 py-2 text-[13px] text-fg outline-none focus:border-brand"
            />
            <span>~</span>
            <input
              type="date"
              name="to"
              defaultValue={params.to ?? ''}
              className="border border-line-700 bg-ink-750 px-3 py-2 text-[13px] text-fg outline-none focus:border-brand"
            />
          </label>
          {params.status && <input type="hidden" name="status" value={params.status} />}
          <button className="bg-brand px-4 py-2.5 text-[13.5px] font-semibold text-white transition hover:bg-brand-hover">
            검색
          </button>
          <Link
            href="/admin"
            className="border border-line-700 px-4 py-2.5 text-[13.5px] text-fg-dim transition hover:text-fg"
          >
            초기화
          </Link>
        </form>

        <div className="mb-[18px] flex flex-wrap items-center gap-2.5">
          <div className="flex flex-wrap gap-1 border border-line-700 bg-ink-750 p-1">
            {STATUS_FILTERS.map((filter) => {
              const active = activeFilter === filter.code
              return (
                <Link
                  key={filter.code}
                  href={linkWith({
                    status: filter.code === 'ALL' ? undefined : filter.code,
                    page: undefined,
                  })}
                  className={`px-3.5 py-2 text-[13px] font-semibold transition ${
                    active ? 'bg-brand text-white' : 'text-fg-dim hover:text-fg'
                  }`}
                >
                  {filter.label}
                </Link>
              )
            })}
          </div>
          <a
            href={`/api/admin/consultations/export?${new URLSearchParams(
              Object.entries(params).filter(([k, v]) => v && k !== 'page' && k !== 'id') as [string, string][],
            ).toString()}`}
            className="border border-brand-line px-4 py-2.5 text-[13.5px] font-semibold text-brand-soft transition hover:bg-[rgba(107,78,158,0.14)]"
          >
            엑셀 다운로드
          </a>
        </div>

        <div className="grid grid-cols-1 items-start gap-5 xl:grid-cols-2">
          {/* 목록 */}
          <div className="overflow-auto border border-line-700 bg-ink-750">
            <div className="grid min-w-[620px] grid-cols-[132px_1fr_124px_96px_86px] gap-3 border-b border-line-700 px-[18px] py-3.5 text-xs font-bold tracking-[0.04em] text-fg-ghost">
              <div>신청일시</div>
              <div>이름 · 관심 과정</div>
              <div>연락처</div>
              <div>희망 시간</div>
              <div>상태</div>
            </div>

            {rows.length === 0 ? (
              <p className="px-[18px] py-20 text-center text-sm text-fg-disabled">
                조건에 맞는 상담 신청이 없습니다.
              </p>
            ) : (
              rows.map((row) => {
                const isSelected = selected?.id === row.id
                return (
                  <Link
                    key={row.id}
                    href={linkWith({ id: row.id })}
                    scroll={false}
                    className={`grid min-w-[620px] grid-cols-[132px_1fr_124px_96px_86px] items-center gap-3 border-b border-line-900 border-l-2 px-[18px] py-[15px] transition ${
                      isSelected
                        ? 'border-l-brand bg-ink-650'
                        : row.status === 'NEW'
                          ? 'border-l-brand-line hover:bg-ink-700'
                          : 'border-l-transparent hover:bg-ink-700'
                    }`}
                  >
                    <div className="text-[13px] text-fg-faint">{formatDateTime(row.createdAt)}</div>
                    <div>
                      <div className="text-[14.5px] font-semibold text-fg-strong">
                        {row.name}{' '}
                        {row.adminMemo && <span className="text-xs font-medium text-brand">· 메모</span>}
                      </div>
                      <div className="mt-[3px] text-[12.5px] text-fg-ghost">{row.course}</div>
                    </div>
                    <div className="text-[13.5px] text-fg-muted">{formatPhone(row.phone)}</div>
                    <div className="text-[13px] text-fg-faint">
                      {PREFERRED_TIMES_SHORT[row.preferredTime]}
                    </div>
                    <div>
                      <StatusBadge status={row.status} />
                    </div>
                  </Link>
                )
              })
            )}

            <div className="flex items-center justify-between border-t border-line-700 px-[18px] py-3.5 text-[12.5px] text-fg-ghost">
              <span>{total}건 · 최신 신청순</span>
              <span className="flex items-center gap-3">
                {page > 1 && (
                  <Link href={linkWith({ page: String(page - 1) })} className="hover:text-fg">
                    이전
                  </Link>
                )}
                {page} / {totalPages} 페이지
                {page < totalPages && (
                  <Link href={linkWith({ page: String(page + 1) })} className="hover:text-fg">
                    다음
                  </Link>
                )}
              </span>
            </div>
          </div>

          {/* 상세 */}
          <div className="border border-line-700 bg-ink-750">
            {selected ? (
              <ConsultationDetail
                key={selected.id}
                request={{
                  id: selected.id,
                  ticket: ticketNo(selected.createdAt, selected.seq),
                  createdAt: formatDateTime(selected.createdAt),
                  name: selected.name,
                  phone: formatPhone(selected.phone),
                  course: selected.course,
                  preferredTime: PREFERRED_TIMES_SHORT[selected.preferredTime],
                  deviceType: selected.deviceType ?? '-',
                  agreeMarketing: selected.agreeMarketing ? '동의' : '미동의',
                  message: selected.message ?? '-',
                  adminMemo: selected.adminMemo ?? '',
                  status: selected.status,
                  utmSource: selected.utmSource ?? '-',
                  utmMedium: selected.utmMedium ?? '-',
                  utmCampaign: selected.utmCampaign ?? '-',
                  referrer: selected.referrer ?? '-',
                  histories: selected.histories.map((h) => ({
                    id: h.id,
                    at: formatDateTime(h.changedAt),
                    text: h.prevStatus
                      ? `${CONSULTATION_STATUSES[h.prevStatus]} → ${CONSULTATION_STATUSES[h.nextStatus]} (${h.changedBy})`
                      : `상담 접수 (status=${h.nextStatus})`,
                  })),
                }}
              />
            ) : (
              <p className="px-[30px] py-20 text-center text-sm leading-[1.8] text-fg-disabled">
                왼쪽 목록에서 상담 건을 선택하세요.
                <br />
                랜딩 폼으로 신청하면 이 목록에 <span className="text-brand-soft">접수</span> 상태로 즉시
                올라옵니다.
              </p>
            )}
          </div>
        </div>

        <p className="mt-[22px] border border-line-900 bg-ink-800 px-[22px] py-[18px] text-[13px] leading-[1.8] text-fg-disabled">
          알림 발송은 본 범위에서 제외되어 있습니다(BRD 6.2 / C1). 근무시간 내 1시간 단위 확인 규칙 또는
          목록 자동 새로고침 도입을 권고합니다(PRD 12.2①).
        </p>
      </div>
    </div>
  )
}

/** 서버에서 한 번만 포맷해 클라이언트와 시각이 어긋나지 않게 한다. */
function formatDateTime(date: Date) {
  const p2 = (n: number) => String(n).padStart(2, '0')
  return `${p2(date.getMonth() + 1)}-${p2(date.getDate())} ${p2(date.getHours())}:${p2(date.getMinutes())}`
}
