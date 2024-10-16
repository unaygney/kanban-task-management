import '../globals.css'
import type { Metadata } from 'next'
import dynamic from 'next/dynamic'

import { Locale } from '@/lib/definitions'
import { jakarta } from '@/lib/font'
import { cn } from '@/lib/utils'

import { SidebarProvider, ThemeProvider } from '@/components/providers'

const SideBar = dynamic(() => import('@/components/side-bar'), { ssr: false })

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
      <body className={cn('h-full w-full antialiased', jakarta.className)}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SidebarProvider>
            <div className="flex h-full w-full">
              <SideBar />
              <div className="flex-1 bg-light-grey dark:bg-very-dark-grey">
                {children}
              </div>
            </div>
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
