'use client'

import { Languages } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'
import { FormattedMessage } from 'react-intl'

import { cn } from '@/lib/utils'

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

export default function SelectLanguage({ className }: { className?: string }) {
  const pathname = usePathname()

  const REST_URL = pathname.split('/').slice(3).join('/')

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className={cn('rounded-full border-2 p-2', className)}>
          <Languages />
        </button>
      </PopoverTrigger>
      <PopoverContent className={cn('ml-auto w-32 bg-white dark:bg-dark-grey')}>
        <div className="flex flex-col divide-y">
          <Link className="pb-2" href={`/en/dashboard/${REST_URL}`}>
            <span>
              <FormattedMessage id="page.header.language.en" />
            </span>
          </Link>
          <Link className="py-2" href={`/tr/dashboard/${REST_URL}`}>
            <span>
              <FormattedMessage id="page.header.language.tr" />
            </span>
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  )
}
