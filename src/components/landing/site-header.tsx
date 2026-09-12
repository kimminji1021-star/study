'use client'

import { useState } from 'react'
import { NAV, SITE } from '@/lib/site-content'
import { scrollToApply } from './apply-cta'

export function SiteHeader() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-60 border-b border-line-900 bg-[rgba(15,14,18,0.88)] backdrop-blur-[12px]">
      <div className="mx-auto flex h-[68px] max-w-[1180px] items-center gap-4 px-4 sm:gap-8 sm:px-6">
        <a
          href="#hero"
          className="flex min-w-0 items-baseline gap-2 text-[17px] font-extrabold tracking-[-0.02em] sm:text-[19px]"
        >
          {SITE.name}
          {/* 좁은 화면에서는 서브 브랜드를 접어 CTA 자리를 확보한다. */}
          <span className="hidden text-[11px] font-semibold tracking-[0.06em] text-fg-ghost lg:inline">
            {SITE.subBrand}
          </span>
        </a>

        <nav className="ml-auto hidden flex-wrap gap-[22px] text-sm md:flex">
          {NAV.map((item) => (
            <a key={item.href} href={item.href} className="text-fg-dim transition hover:text-fg">
              {item.label}
            </a>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2 md:ml-0">
          <button
            type="button"
            onClick={() => scrollToApply('header')}
            className="flex-none bg-brand px-3.5 py-2.5 text-[13px] font-bold whitespace-nowrap text-white transition hover:bg-brand-hover sm:px-5 sm:text-sm"
          >
            무료 상담 신청
          </button>
          <button
            type="button"
            aria-label="메뉴 열기"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="p-2 text-fg-dim md:hidden"
          >
            <span className="block h-0.5 w-5 bg-current" />
            <span className="mt-1 block h-0.5 w-5 bg-current" />
            <span className="mt-1 block h-0.5 w-5 bg-current" />
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-line-900 bg-ink-850 px-6 py-3 md:hidden">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="block py-2.5 text-sm text-fg-dim"
            >
              {item.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  )
}
