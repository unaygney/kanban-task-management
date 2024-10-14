import '../globals.css'
import type { Metadata } from 'next'

import { Locale } from '@/lib/definitions'
import { cn } from '@/lib/utils'

import { ThemeProvider } from '@/components/providers'
import SideBar from '@/components/side-bar'

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
    <html lang={params.lang} className="h-full w-full scroll-smooth">
      <body className={cn('h-full w-full antialiased')}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex h-full w-full">
            <SideBar />
            <div className="flex-1">{children}</div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
