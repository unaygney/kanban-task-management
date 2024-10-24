import React from 'react'

import { Locale } from '@/lib/definitions'

import Header from '@/components/header'

interface Props {
  children: React.ReactNode
  params: Promise<{
    lang: Locale
  }>
}

async function getMessages(locale: string) {
  const messages = (await import(`../../../lang/${locale}.json`)).default
  return messages
}

export default async function DashboardLayout(props: Props) {
  const params = await props.params

  const { lang: locale } = params

  const { children } = props

  const messages = await getMessages(locale)

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header locale={locale} messages={messages} />
      <div className="flex-1 overflow-scroll">{children}</div>
    </div>
  )
}
