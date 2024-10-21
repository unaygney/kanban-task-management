import { i18n } from '../../i18n-config'
import { createIntl } from '@formatjs/intl'
import { match as matchLocale } from '@formatjs/intl-localematcher'
import Negotiator from 'negotiator'
import { NextRequest } from 'next/server'
import 'server-only'

import type { Locale } from '@/lib/definitions'

export async function getIntl(locale: Locale) {
  return createIntl({
    locale: locale,
    messages: (await import(`../lang/${locale}.json`)).default,
  })
}

export function getLocale(request: NextRequest): string | undefined {
  // Negotiator expects plain object so we need to transform headers
  const negotiatorHeaders: Record<string, string> = {}
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value))

  // @ts-expect-error locales are readonly
  const locales: string[] = i18n.locales

  // Use negotiator and intl-localematcher to get best locale
  const languages = new Negotiator({ headers: negotiatorHeaders }).languages(
    locales
  )

  const locale = matchLocale(languages, locales, i18n.defaultLocale)

  return locale
}
