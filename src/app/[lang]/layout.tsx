import '../globals.css'
import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import { Toaster } from 'react-hot-toast'

import { Locale } from '@/lib/definitions'
import { jakarta } from '@/lib/font'
import { cn } from '@/lib/utils'

import {
  SidebarProvider,
  TanstackProvider,
  ThemeProvider,
} from '@/components/providers'

const SideBar = dynamic(() => import('@/components/side-bar'), { ssr: false })

export const metadata: Metadata = {
  title: 'Kanban | Task Management',
  description: 'Kanban board for task management',
}

interface Props {
  params: { lang: Locale }
  children: React.ReactNode
}

async function getMessages(locale: string) {
  const messages = (await import(`../../lang/${locale}.json`)).default
  return messages
}

export default async function RootLayout({ params, children }: Props) {
  const messages = await getMessages(params.lang)

  return (
    <html lang={params.lang} className="h-full w-full scroll-smooth">
      <body className={cn('h-full w-full antialiased', jakarta.className)}>
        <TanstackProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <SidebarProvider>
              <div className="flex h-full w-full">
                <SideBar locale={params.lang} messages={messages} />
                <div className="flex-1 bg-light-grey dark:bg-very-dark-grey">
                  {children}
                </div>
              </div>
              <Toaster />
            </SidebarProvider>
          </ThemeProvider>
        </TanstackProvider>
      </body>
    </html>
  )
}
