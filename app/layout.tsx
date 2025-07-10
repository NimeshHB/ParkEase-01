import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'group09',
  description: 'Created with group0',
  generator: 'group09UoR',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
