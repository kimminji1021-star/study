'use client'

import { openPrivacyDialog } from './privacy-dialog'

export function PrivacyLink({ children }: { children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={openPrivacyDialog}
      className="text-left text-fg-faint transition hover:text-fg-dim"
    >
      {children}
    </button>
  )
}
