'use client'

import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  consultationSchema,
  formatPhone,
  PREFERRED_TIMES,
  type ConsultationFormValues,
  type ConsultationInput,
} from '@/lib/consultation-schema'
import { COURSES } from '@/lib/site-content'
import { trackEvent } from '@/lib/analytics'

const fieldBase =
  'w-full border bg-ink-850 px-4 py-3.5 text-[15.5px] text-fg outline-none transition placeholder:text-[#5C5769] focus:border-brand'
const labelBase = 'mb-2.5 block text-sm font-semibold text-fg-strong'
const errorText = 'mt-2 text-[13px] text-danger-fg'

type Props = {
  onDone: (result: { ticket: string; course: string }) => void
  onOpenPrivacy: () => void
}

export function ConsultationForm({ onDone, onOpenPrivacy }: Props) {
  const [submitError, setSubmitError] = useState('')
  const startedRef = useRef(false)

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ConsultationFormValues, unknown, ConsultationInput>({
    resolver: zodResolver(consultationSchema),
    mode: 'onBlur',
    defaultValues: { preferredTime: 'ANY', agreeMarketing: false, course: '' },
  })

  // F-L-08: 진입 시점의 UTM 을 세션에 보관했다가 제출에 실어 보낸다.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const stored = sessionStorage.getItem('utm')
    const fromUrl = {
      utmSource: params.get('utm_source') ?? undefined,
      utmMedium: params.get('utm_medium') ?? undefined,
      utmCampaign: params.get('utm_campaign') ?? undefined,
    }
    const utm = fromUrl.utmSource || fromUrl.utmMedium || fromUrl.utmCampaign
      ? fromUrl
      : stored
        ? JSON.parse(stored)
        : {}

    if (utm.utmSource || utm.utmMedium || utm.utmCampaign) {
      sessionStorage.setItem('utm', JSON.stringify(utm))
      setValue('utmSource', utm.utmSource)
      setValue('utmMedium', utm.utmMedium)
      setValue('utmCampaign', utm.utmCampaign)
    }
    setValue('referrer', document.referrer || 'direct')
    setValue('deviceType', window.innerWidth < 768 ? 'MOBILE' : 'PC')
  }, [setValue])

  // F-F-01: 오류 발생 시 GA4 로 어느 필드에서 막혔는지 남긴다.
  useEffect(() => {
    const failed = Object.keys(errors)
    if (failed.length > 0) trackEvent('form_error', { field: failed.join(',') })
  }, [errors])

  const onSubmit = handleSubmit(async (values) => {
    setSubmitError('')
    try {
      const res = await fetch('/api/consultations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })
      const data = await res.json().catch(() => null)

      if (!res.ok) {
        setSubmitError(data?.error ?? '일시적인 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.')
        return
      }

      trackEvent('generate_lead', { course: values.course, utm_source: values.utmSource })
      onDone({ ticket: data.ticket, course: data.course })
      reset({ preferredTime: 'ANY', agreeMarketing: false, course: '' })
    } catch {
      // F-F-04: 입력값은 그대로 두고 재시도만 유도한다.
      setSubmitError('일시적인 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.')
    }
  })

  function markStart() {
    if (startedRef.current) return
    startedRef.current = true
    trackEvent('form_start')
  }

  const phoneField = register('phone')

  return (
    <form
      onSubmit={onSubmit}
      onFocus={markStart}
      noValidate
      className="border border-line-700 bg-ink-750 p-[clamp(26px,3vw,38px)]"
    >
      <div className="flex flex-col gap-[22px]">
        <div>
          <label className={labelBase} htmlFor="f-name">
            이름 <span className="text-brand-light">*</span>
          </label>
          <input
            id="f-name"
            placeholder="홍길동"
            aria-invalid={!!errors.name}
            className={`${fieldBase} ${errors.name ? 'border-danger' : 'border-line-600'}`}
            {...register('name')}
          />
          {errors.name && <p className={errorText}>{errors.name.message}</p>}
        </div>

        <div>
          <label className={labelBase} htmlFor="f-phone">
            연락처 <span className="text-brand-light">*</span>
          </label>
          <input
            id="f-phone"
            type="tel"
            inputMode="numeric"
            placeholder="010-1234-5678"
            aria-invalid={!!errors.phone}
            className={`${fieldBase} ${errors.phone ? 'border-danger' : 'border-line-600'}`}
            {...phoneField}
            onChange={(e) => {
              e.target.value = formatPhone(e.target.value)
              phoneField.onChange(e)
            }}
          />
          {errors.phone && <p className={errorText}>{errors.phone.message}</p>}
        </div>

        <div>
          <label className={labelBase} htmlFor="f-course">
            관심 과정 <span className="text-brand-light">*</span>
          </label>
          <select
            id="f-course"
            aria-invalid={!!errors.course}
            className={`${fieldBase} appearance-none ${errors.course ? 'border-danger' : 'border-line-600'}`}
            {...register('course')}
          >
            <option value="">선택해 주세요</option>
            {COURSES.map((course) => (
              <option key={course} value={course}>
                {course}
              </option>
            ))}
          </select>
          {errors.course && <p className={errorText}>{errors.course.message}</p>}
        </div>

        <div>
          <label className={labelBase} htmlFor="f-time">
            상담 희망 시간대 <span className="font-medium text-fg-disabled">선택</span>
          </label>
          <select
            id="f-time"
            className={`${fieldBase} appearance-none border-line-600`}
            {...register('preferredTime')}
          >
            {Object.entries(PREFERRED_TIMES).map(([value, text]) => (
              <option key={value} value={value}>
                {text}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelBase} htmlFor="f-msg">
            문의 내용 <span className="font-medium text-fg-disabled">선택 · 최대 500자</span>
          </label>
          <textarea
            id="f-msg"
            rows={3}
            maxLength={500}
            placeholder="현재 직무나 궁금한 점을 적어주시면 상담이 빨라집니다."
            className={`${fieldBase} resize-y border-line-600 leading-relaxed`}
            {...register('message')}
          />
        </div>

        {/* 봇 트랩 */}
        <input
          {...register('website')}
          type="text"
          tabIndex={-1}
          aria-hidden="true"
          autoComplete="off"
          className="absolute left-[-9999px] h-px w-px opacity-0"
        />

        <div className="flex flex-col gap-3.5 border border-line-800 bg-ink-850 p-5">
          <label htmlFor="f-agree" className="flex cursor-pointer items-start gap-3">
            <input
              id="f-agree"
              type="checkbox"
              className="mt-0.5 size-[18px] flex-none accent-brand"
              {...register('agreePrivacy')}
            />
            <span className="text-sm leading-relaxed text-fg-strong">
              [필수] 개인정보 수집·이용에 동의합니다.
              <br />
              <span className="text-[13px] text-fg-faint">
                수집 항목: 이름·연락처·관심 과정 / 목적: 교육 과정 상담 / 보유 기간: 상담 종료 후 1년 또는
                동의 철회 시까지 ·{' '}
                <button
                  type="button"
                  onClick={onOpenPrivacy}
                  className="text-brand-light underline underline-offset-2"
                >
                  전문 보기
                </button>
              </span>
            </span>
          </label>

          {errors.agreePrivacy && (
            <p className="border border-danger-line bg-[rgba(229,105,92,0.12)] px-3 py-2.5 text-[13px] text-danger-fg">
              {errors.agreePrivacy.message}
            </p>
          )}

          <label
            htmlFor="f-mkt"
            className="flex cursor-pointer items-start gap-3 border-t border-[#201E28] pt-3.5"
          >
            <input
              id="f-mkt"
              type="checkbox"
              className="mt-0.5 size-[18px] flex-none accent-brand"
              {...register('agreeMarketing')}
            />
            <span className="text-sm leading-relaxed text-fg-dim">
              [선택] 기수 모집·혜택 정보 수신에 동의합니다. 미동의해도 상담은 정상 진행됩니다.
            </span>
          </label>
        </div>

        {submitError && (
          <div className="flex flex-wrap items-center justify-between gap-3 border border-danger-line bg-[rgba(229,105,92,0.12)] px-4 py-3.5">
            <span className="text-sm text-danger-fg">{submitError}</span>
            <button
              type="submit"
              className="bg-brand px-4 py-2.5 text-[13px] font-bold text-white transition hover:bg-brand-hover"
            >
              다시 시도
            </button>
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-brand px-6 py-[18px] text-[16.5px] font-bold text-white transition hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? '접수 중…' : '1:1 무료 상담 신청하기'}
        </button>
        <p className="text-center text-[13px] text-fg-disabled">
          제출 즉시 상담 대기열에 접수됩니다 · 광고·스팸 연락 없음
        </p>
      </div>
    </form>
  )
}
