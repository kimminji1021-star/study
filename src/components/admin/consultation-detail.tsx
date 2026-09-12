'use client'

import { useState } from 'react'
import {
  CONSULTATION_STATUSES,
  STATUS_ORDER,
  type ConsultationStatusCode,
} from '@/lib/consultation-schema'
import {
  deleteConsultation,
  updateConsultationMemo,
  updateConsultationStatus,
} from '@/app/admin/actions'

type Request = {
  id: string
  ticket: string
  createdAt: string
  name: string
  phone: string
  course: string
  preferredTime: string
  deviceType: string
  agreeMarketing: string
  message: string
  adminMemo: string
  status: ConsultationStatusCode
  utmSource: string
  utmMedium: string
  utmCampaign: string
  referrer: string
  histories: { id: string; at: string; text: string }[]
}

export function ConsultationDetail({ request }: { request: Request }) {
  const [memoSaved, setMemoSaved] = useState('')

  return (
    <div>
      <div className="border-b border-line-700 px-6 py-[22px]">
        <p className="mb-2 text-[12.5px] text-fg-ghost">
          접수번호 {request.ticket} · {request.createdAt}
        </p>
        <p className="text-[21px] font-extrabold tracking-[-0.025em]">
          {request.name}{' '}
          <span className="text-[15px] font-semibold text-fg-dim">{request.phone}</span>
        </p>
      </div>

      <dl className="grid grid-cols-2 gap-[18px] border-b border-line-700 px-6 py-[22px] sm:grid-cols-4">
        <Field label="관심 과정" value={request.course} />
        <Field label="희망 시간대" value={request.preferredTime} />
        <Field label="디바이스" value={request.deviceType} />
        <Field label="마케팅 수신" value={request.agreeMarketing} />
      </dl>

      <div className="border-b border-line-700 px-6 py-[22px]">
        <p className="mb-2 text-xs text-fg-ghost">문의 내용</p>
        <p className="text-sm leading-[1.7] whitespace-pre-wrap text-fg-muted text-pretty">
          {request.message}
        </p>
      </div>

      <div className="border-b border-line-700 bg-ink-800 px-6 py-[22px]">
        <p className="mb-2.5 text-xs text-fg-ghost">유입 정보</p>
        <p className="font-mono text-[12.5px] leading-[1.9] text-fg-dim">
          utm_source = {request.utmSource}
          <br />
          utm_medium = {request.utmMedium}
          <br />
          utm_campaign = {request.utmCampaign}
          <br />
          referrer = {request.referrer}
        </p>
      </div>

      <div className="border-b border-line-700 px-6 py-[22px]">
        <p className="mb-2.5 text-xs text-fg-ghost">상담 상태</p>
        <div className="flex flex-wrap gap-1.5">
          {STATUS_ORDER.map((code) => {
            const active = request.status === code
            return (
              <form key={code} action={updateConsultationStatus}>
                <input type="hidden" name="id" value={request.id} />
                <input type="hidden" name="status" value={code} />
                <button
                  className={`border px-3.5 py-2.5 text-[13px] font-semibold transition ${
                    active
                      ? 'border-brand bg-brand text-white'
                      : 'border-line-700 text-fg-dim hover:text-fg'
                  }`}
                >
                  {CONSULTATION_STATUSES[code]}
                </button>
              </form>
            )
          })}
        </div>
      </div>

      <form
        action={async (formData) => {
          await updateConsultationMemo(formData)
          setMemoSaved('저장되었습니다')
        }}
        className="border-b border-line-700 px-6 py-[22px]"
      >
        <input type="hidden" name="id" value={request.id} />
        <label htmlFor="memo" className="mb-2.5 block text-xs text-fg-ghost">
          상담 메모
        </label>
        <textarea
          id="memo"
          name="adminMemo"
          rows={3}
          defaultValue={request.adminMemo}
          onChange={() => setMemoSaved('')}
          placeholder="통화 결과를 남겨주세요. 예: 부재중 1회, 19시 이후 재연락 요청"
          className="w-full resize-y border border-line-700 bg-ink-850 px-3.5 py-3 text-sm leading-relaxed text-fg outline-none focus:border-brand"
        />
        <div className="mt-2.5 flex items-center gap-2.5">
          <button className="bg-brand px-[18px] py-2.5 text-[13.5px] font-bold text-white transition hover:bg-brand-hover">
            메모 저장
          </button>
          <span className="text-[12.5px] text-brand">{memoSaved}</span>
        </div>
      </form>

      <div className="px-6 py-[22px]">
        <p className="mb-3 text-xs text-fg-ghost">상태 변경 이력</p>
        <div className="flex flex-col gap-2.5">
          {request.histories.map((h) => (
            <p key={h.id} className="flex gap-3 text-[13px] text-fg-dim">
              <span className="flex-none font-mono text-fg-disabled">{h.at}</span>
              <span>{h.text}</span>
            </p>
          ))}
        </div>
      </div>

      <form action={deleteConsultation} className="border-t border-line-900 px-6 py-4">
        <input type="hidden" name="id" value={request.id} />
        <button className="text-xs text-fg-disabled transition hover:text-danger-fg">
          이 건 숨기기 (논리 삭제)
        </button>
      </form>
    </div>
  )
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="mb-1.5 text-xs text-fg-ghost">{label}</dt>
      <dd className="text-sm text-fg-strong">{value}</dd>
    </div>
  )
}
