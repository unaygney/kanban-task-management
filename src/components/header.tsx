'use client'

import { ChevronDown, EllipsisVertical, Plus } from 'lucide-react'
import React from 'react'
import { FormattedMessage, IntlProvider } from 'react-intl'

import { Locale } from '@/lib/definitions'
import { cn } from '@/lib/utils'

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

import { Logo, LogoWithText } from './icons'
import { useSidebar } from './providers'
import SelectLanguage from './select-language'
import { ModeToggle, NAV_LINKS, NavLink } from './side-bar'
import { Button } from './ui/button'

interface Props {
  locale: Locale
  messages: Record<string, string>
}

export default function Header({ locale, messages }: Props) {
  const { isActive } = useSidebar()

  return (
    <IntlProvider locale={locale} messages={messages}>
      <div className="flex h-16 w-full items-center border-b border-lines-light bg-white px-6 dark:border-lines-dark dark:bg-dark-grey md:h-20 lg:h-24">
        {/* Mobile Header */}
        <div className="flex w-full items-center gap-4 md:hidden">
          <Logo className="h-[25px] w-6" />
          <Popover>
            <PopoverTrigger className="inline-flex items-center gap-2 text-lg font-bold text-main-dark dark:text-white">
              <FormattedMessage id="page.header.title" />
              <ChevronDown className="h-4 w-4 text-main-purple transition-transform duration-300 [[data-state=open]_&]:rotate-180" />
            </PopoverTrigger>
            <PopoverContent className="flex flex-col gap-4 bg-white dark:bg-dark-grey">
              <nav className="flex w-full flex-grow flex-col gap-5 truncate [[data-isactive=false]_&]:hidden">
                <h3 className="text-xs font-bold uppercase leading-normal tracking-[2.4px] text-medium-grey">
                  <FormattedMessage id="page.header.allboard" />(
                  {NAV_LINKS.length})
                </h3>
                <ul className="flex flex-col gap-1">
                  {NAV_LINKS.map((link) => (
                    <NavLink key={link.id} link={link} isActive={isActive} />
                  ))}
                </ul>
              </nav>
              <ModeToggle />
              <SelectLanguage className="inline-flex h-12 w-12 items-center justify-center rounded-full" />
            </PopoverContent>
          </Popover>

          {/* Add news task and dots area */}
          <div className="ml-auto flex items-center gap-4">
            <Button size="icon" className="rounded-full">
              <Plus />
            </Button>
            <button>
              <EllipsisVertical />
            </button>
          </div>
          <div></div>
        </div>
        {/* Tablet and Desktop Header */}
        <div className="hidden h-full w-full items-center md:flex">
          <LogoWithText className={cn({ hidden: isActive })} />
          <span
            className={cn(
              'mx-8 block h-full w-[1px] bg-lines-light dark:bg-lines-dark',
              {
                hidden: isActive,
              }
            )}
          />
          <h2 className="text-xl font-bold text-main-dark dark:text-white">
            <FormattedMessage id="page.header.title" />
          </h2>

          {/* Right Buttons Area */}
          <div className="ml-auto flex gap-5">
            <div className="flex items-center">
              <Button>
                <FormattedMessage id="page.header.add.new.task" />
              </Button>
              <button className="ml-5">
                <EllipsisVertical />
              </button>
            </div>
            {/* Language Switcher */}
            <div className="">
              <SelectLanguage />
            </div>
          </div>
        </div>
      </div>
    </IntlProvider>
  )
}
