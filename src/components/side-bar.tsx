'use client'

import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { FormattedMessage, IntlProvider } from 'react-intl'
import { useOnClickOutside } from 'usehooks-ts'

import { Locale } from '@/lib/definitions'
import { cn } from '@/lib/utils'

import { getBoards } from '@/app/[lang]/dashboard/actions'

import AddNewBoard from './add-new-board'
import { Board, LogoWithText } from './icons'
import { useSidebar } from './providers'
import { Switch } from './ui/switch'

interface Props {
  locale: Locale
  messages: Record<string, string>
}

export default function SideBar({ locale, messages }: Props) {
  const [isMounted, setIsMounted] = useState(false)
  const { isActive, setActive, toggle } = useSidebar()
  const ref = React.useRef(null)

  useOnClickOutside(ref, () => {
    if (isActive) setActive(false)
  })

  useEffect(() => {
    setIsMounted(true)
  }, [])

  return isMounted ? (
    <IntlProvider locale={locale} messages={messages}>
      <motion.div
        ref={ref}
        data-isactive={isActive}
        initial={{
          width: '0px',
        }}
        animate={{
          width: isActive ? '300px ' : '0px ',
        }}
        transition={{ duration: 0.3 }}
        className={cn(
          'relative hidden h-screen flex-col gap-6 border-r border-lines-light bg-white pb-[47px] dark:border-lines-dark dark:bg-dark-grey lg:flex',
          {
            'pt-8': isActive,
          }
        )}
      >
        <Logo />
        <Menu isActive={isActive} />
        <ModeToggle />
        <HideSideBar setActive={setActive} />
        <EyeToggle toggle={toggle} />
      </motion.div>
    </IntlProvider>
  ) : null
}

function Logo() {
  return (
    <div
      key="full-logo"
      className="flex items-center justify-start px-8 [[data-isactive=false]_&]:hidden"
    >
      <Link href="/en/dashboard">
        <LogoWithText className="text-main-dark dark:text-light-grey" />
      </Link>
    </div>
  )
}
function Menu({ isActive }: { isActive: boolean }) {
  const { data } = useQuery({
    queryKey: ['boards'],
    queryFn: async () => await getBoards(),
    staleTime: 600000,
    refetchOnWindowFocus: true,
  })

  const NavLinks = data?.data || []

  return (
    <nav className="flex w-full flex-grow flex-col gap-5 truncate pr-8 [[data-isactive=false]_&]:hidden">
      <h3 className="px-8 text-xs font-bold uppercase leading-normal tracking-[2.4px] text-medium-grey">
        <FormattedMessage id="page.sidebar.allboard" />({NavLinks.length})
      </h3>
      <ul className="flex flex-col gap-1">
        {NavLinks.map((link) => (
          <NavLink key={link.id} data={link} isActive={isActive} />
        ))}
      </ul>
      {/* To add new board */}
      <AddNewBoard />
    </nav>
  )
}
export function NavLink({
  data,
  isActive,
}: {
  data: {
    name: string
    id: number
    slug: string
    userId: string
  }
  isActive: boolean
}) {
  const pathname = usePathname()
  const locale = pathname.split('/')[1] as Locale
  const isLinkActive = pathname === `/${locale}/dashboard/${data.slug}`

  return (
    <Link
      href={`/${locale}/dashboard/${data.slug}`}
      className={cn(
        'group flex items-center gap-4 rounded-r-[100px] py-[14px] pl-8 transition-colors duration-200',
        {
          'bg-main-purple text-white': isLinkActive && isActive,
          'text-medium-grey hover:bg-main-purple hover:bg-opacity-10 hover:text-main-purple':
            !isLinkActive,
        }
      )}
    >
      <span
        className={cn('text-current', {
          'text-white': isLinkActive,
        })}
      >
        <Board />
      </span>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: isActive ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className={cn('text-preset-3 truncate font-bold', {
          'group-hover:text-main-purple': !isLinkActive,
          'text-white': isLinkActive,
          'text-medium-grey': !isLinkActive,
        })}
      >
        {data.name}
      </motion.p>
    </Link>
  )
}
function EyeToggle({ toggle }: { toggle: () => void }) {
  return (
    <button
      onClick={toggle}
      className="group absolute bottom-8 right-[-56px] inline-flex h-12 w-14 items-center justify-center rounded-r-[100px] bg-purple-500 [[data-isactive=true]_&]:hidden"
    >
      <motion.div
        className="flex h-full w-full items-center justify-center text-white hover:text-opacity-30"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Eye />
      </motion.div>
    </button>
  )
}
function HideSideBar({ setActive }: { setActive: (value: boolean) => void }) {
  return (
    <div className="px-8">
      <button
        onClick={() => setActive(false)}
        className="inline-flex items-center gap-4 truncate text-[15px] font-bold text-medium-grey [[data-isactive=false]_&]:hidden"
      >
        <EyeOff className="h-[16px] w-[18px]" />
        <span>
          <FormattedMessage id="page.sidebar.hide.sidebar" />
        </span>
      </button>
    </div>
  )
}
export function ModeToggle({ className }: { className?: string }) {
  const { setTheme, theme } = useTheme()
  const [isDarkMode, setIsDarkMode] = useState(theme === 'dark')

  useEffect(() => {
    setIsDarkMode(theme === 'dark')
  }, [theme])

  const handleToggle = (checked: boolean) => {
    setIsDarkMode(checked)

    setTimeout(() => {
      setTheme(checked ? 'dark' : 'light')
    }, 150)
  }

  return (
    <div className={cn('px-8', className)}>
      <div className="flex h-12 w-full items-center justify-center gap-6 rounded-lg bg-light-grey text-medium-grey dark:bg-very-dark-grey [[data-isactive=false]_&]:hidden">
        <button onClick={() => handleToggle(false)}>
          <Sun className="h-5 w-5" />
        </button>
        <Switch
          checked={isDarkMode}
          onCheckedChange={handleToggle}
          className="bg-main-purple"
        />
        <button onClick={() => handleToggle(true)}>
          <Moon className="h-5 w-5" />
        </button>
      </div>
    </div>
  )
}
