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
  const params = await props.params;

  const {
    lang: locale
  } = params;

  const {
    children
  } = props;

  const messages = await getMessages(locale)

  return (
    <div className="min-h-screen w-full">
      <Header locale={locale} messages={messages} />
      <div className="overflow-scroll p-6">{children}</div>
    </div>
  )
}
