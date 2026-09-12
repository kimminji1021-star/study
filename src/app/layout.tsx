import type { Metadata } from 'next'
import './globals.css'
import { SITE } from '@/lib/site-content'

export const metadata: Metadata = {
  title: SITE.title,
  description: SITE.description,
  openGraph: {
    title: SITE.title,
    description: SITE.description,
    siteName: SITE.name,
    type: 'website',
    locale: 'ko_KR',
  },
  twitter: { card: 'summary_large_image', title: SITE.title, description: SITE.description },
}

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="flex min-h-full flex-col font-sans">{children}</body>
    </html>
  )
}
