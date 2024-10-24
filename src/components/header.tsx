'use client'

import { useQuery } from '@tanstack/react-query'
import { ChevronDown, EllipsisVertical, Plus } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useRouter } from 'next/navigation'
import React from 'react'
import toast from 'react-hot-toast'
import { FormattedMessage, IntlProvider } from 'react-intl'

import { Locale } from '@/lib/definitions'
import { cn } from '@/lib/utils'

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

import { deleteBoard, getBoards } from '@/app/[lang]/dashboard/actions'

import AddNewBoard from './add-new-board'
import AddNewTask from './add-new.task'
import { Logo, LogoWithText } from './icons'
import { useSidebar } from './providers'
import SelectLanguage from './select-language'
import { ModeToggle, NavLink } from './side-bar'
import { Button } from './ui/button'

interface Props {
  locale: Locale
  messages: Record<string, string>
}

export default function Header({ locale, messages }: Props) {
  const pathname = usePathname()
  const router = useRouter()
  const { isActive } = useSidebar()

  const { data } = useQuery({
    queryKey: ['boards'],
    queryFn: async () => await getBoards(),
    staleTime: 600000,
    refetchOnWindowFocus: true,
  })

  const NavLinks = data?.data || []
  const slug = pathname.split('/')[3]

  const title = NavLinks.find((link) => link.slug === slug)

  const handleDeleteTask = async () => {
    if (!title) {
      return
    }
    const { success, message } = await deleteBoard(title.id, locale)

    if (success) {
      toast.success(message)
      router.push(`/${locale}/dashboard`)
      setTimeout(() => {
        window.location.reload()
      }, 700)
    } else {
      toast.error(message)
    }
  }
  return (
    <IntlProvider locale={locale} messages={messages}>
      <div className="flex h-16 w-full items-center border-b border-lines-light bg-white px-6 dark:border-lines-dark dark:bg-dark-grey md:h-20 lg:h-24">
        {/* Mobile Header */}
        <div className="flex w-full items-center gap-4 md:hidden">
          <Logo className="h-[25px] w-6" />
          <Popover>
            <PopoverTrigger className="inline-flex items-center gap-2 text-lg font-bold capitalize text-main-dark dark:text-white">
              {title?.name || null}
              <ChevronDown className="h-4 w-4 text-main-purple transition-transform duration-300 [[data-state=open]_&]:rotate-180" />
            </PopoverTrigger>
            <PopoverContent className="flex flex-col gap-4 bg-white dark:bg-dark-grey md:hidden">
              <nav className="flex w-full flex-grow flex-col gap-5 truncate [[data-isactive=false]_&]:hidden">
                <h3 className="text-xs font-bold uppercase leading-normal tracking-[2.4px] text-medium-grey">
                  <FormattedMessage id="page.header.allboard" />(
                  {NavLinks.length})
                </h3>
                <ul className="flex flex-col gap-1">
                  {NavLinks.map((link) => (
                    <NavLink key={link.id} data={link} isActive={true} />
                  ))}
                </ul>
                <AddNewBoard />
              </nav>
              <ModeToggle className="px-0" />
              <SelectLanguage className="inline-flex h-12 w-12 items-center justify-center rounded-full" />
            </PopoverContent>
          </Popover>

          {/* Add news task and dots area */}
          <div className="ml-auto flex items-center gap-4">
            <Button
              size="icon"
              disabled={title === undefined}
              className="rounded-full"
            >
              <Plus />
            </Button>

            <Popover>
              <PopoverTrigger className="ml-5">
                <EllipsisVertical />
              </PopoverTrigger>
              <PopoverContent className="w-[250px] bg-white px-6 dark:border-lines-dark dark:bg-dark-grey">
                <div className="flex flex-col gap-4">
                  <h3 className="text-lg font-bold">
                    <FormattedMessage id="popup.delete.title" />
                  </h3>
                  {/* Delete Button */}
                  <Button
                    disabled={title === undefined}
                    onClick={handleDeleteTask}
                    variant="destructive"
                  >
                    <FormattedMessage id="popup.delete.task" />
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
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
          <h2 className="text-xl font-bold capitalize text-main-dark dark:text-white">
            {title?.name || null}
          </h2>

          {/* Right Buttons Area */}
          <div className="ml-auto flex gap-5">
            <div className="flex items-center">
              <AddNewTask title={title} />

              <Popover>
                <PopoverTrigger className="ml-5">
                  <EllipsisVertical />
                </PopoverTrigger>
                <PopoverContent className="w-[250px] bg-white px-6 dark:border-lines-dark dark:bg-dark-grey">
                  <div className="flex flex-col gap-4">
                    <h3 className="text-lg font-bold">
                      <FormattedMessage id="popup.delete.title" />
                    </h3>
                    {/* Delete Button */}
                    <Button
                      disabled={title === undefined}
                      onClick={handleDeleteTask}
                      variant="destructive"
                    >
                      <FormattedMessage id="popup.delete.task" />
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
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
