import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Flavor — AI Business Architect',
  description: 'Validate your startup idea with AI-driven falsification analysis',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className="dark">
      <body className="min-h-screen">{children}</body>
    </html>
  )
}
