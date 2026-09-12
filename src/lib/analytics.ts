/** GA4. 측정 ID가 없으면 조용히 아무 것도 하지 않는다. (PRD 9.1) */
declare global {
  interface Window {
    gtag?: (command: string, event: string, params?: Record<string, unknown>) => void
  }
}

export type AnalyticsEvent =
  | 'cta_click'
  | 'section_view'
  | 'form_start'
  | 'form_error'
  | 'generate_lead'

export function trackEvent(event: AnalyticsEvent, params: Record<string, unknown> = {}) {
  if (typeof window === 'undefined') return
  window.gtag?.('event', event, params)
}
