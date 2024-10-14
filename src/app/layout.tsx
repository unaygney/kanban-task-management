import type { Metadata } from 'next'

import './globals.css'

export const metadata: Metadata = {
  title: 'Kanban | Task Management',
  description: 'Kanban board for task management',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`antialiased`}>{children}</body>
    </html>
  )
}
