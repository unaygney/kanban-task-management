import '../globals.css'
import type { Metadata } from 'next'

import { Locale } from '@/lib/definitions'

import { ThemeProvider } from '@/components/providers'

export const metadata: Metadata = {
  title: 'Kanban | Task Management',
  description: 'Kanban board for task management',
}

interface Props {
  params: { lang: Locale }
  children: React.ReactNode
}

export default async function RootLayout({ params, children }: Props) {
  return (
    <html lang={params.lang} className="scroll-smooth">
      <body className={`antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
