import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '감각 기반 명상 웹앱',
  description: '스킨케어와 명상을 결합한 감각 기반 명상 경험',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  )
}

