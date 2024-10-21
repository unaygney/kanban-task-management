import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { v4 as uuidv4 } from 'uuid'

import { i18n } from './../i18n-config'
import { getLocale } from './lib/intl'

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const user_id = request.cookies.get('user_id')?.value ?? null

  const response = NextResponse.next()

  if (!user_id) {
    response.cookies.set('user_id', uuidv4(), {
      path: '/',
      maxAge: 30 * 24 * 60 * 60,
      sameSite: 'lax',
      secure: true,
      httpOnly: true,
    })
  }

  const fallbackPage = '/dashboard'

  // Check if there is any supported locale in the pathname
  const pathnameIsMissingLocale = i18n.locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  )

  // Redirect if there is no locale
  if (pathnameIsMissingLocale) {
    const locale = getLocale(request)

    const sanitizedPathname = pathname.startsWith('/')
      ? pathname.substring(1)
      : pathname

    return NextResponse.redirect(
      new URL(`/${locale}/${sanitizedPathname || fallbackPage}`, request.url)
    )
  }

  const pathnameIsMissingPage = pathname.split('/').slice(2).join('/') === ''

  // Redirect if there is no page
  if (pathnameIsMissingPage) {
    const sanitizedPathname = pathname.endsWith('/')
      ? pathname.substring(0, pathname.length - 1)
      : pathname

    return NextResponse.redirect(
      new URL(`${sanitizedPathname}/${fallbackPage}`, request.url)
    )
  }

  return response
}

export const config = {
  // Matcher ignoring `/_next/` and `/api/`
  matcher: ['/((?!api|_next/static|_next/image|images|favicon.ico).*)'],
}
