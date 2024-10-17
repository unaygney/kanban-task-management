'use client'

import { motion } from 'framer-motion'
import { Eye, EyeOff, Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useRef, useState } from 'react'
import { useOnClickOutside } from 'usehooks-ts'

import { cn } from '@/lib/utils'

import { LogoWithText } from './icons'
import { useSidebar } from './providers'
import { Switch } from './ui/switch'

export const NAV_LINKS = [
  {
    id: 0,
    name: 'Overview',

    link: '/',
  },
  {
    id: 1,
    name: 'Transactions',

    link: '/transactions',
  },
  {
    id: 2,
    name: 'Budgets',

    link: '/budgets',
  },
  {
    id: 3,
    name: 'Pots',

    link: '/pots',
  },
  {
    id: 4,
    name: 'Recurring bills',

    link: '/recurring-bills',
  },
] as const
export type NavLinkType = (typeof NAV_LINKS)[number]

export default function SideBar() {
  const { isActive, setActive, toggle } = useSidebar()
  const ref = useRef(null)

  useOnClickOutside(ref, () => {
    if (isActive) setActive(false)
  })

  return (
    <motion.div
      data-isactive={isActive}
      ref={ref}
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
          'px-6 pt-8': isActive,
        }
      )}
    >
      <Logo />
      <Menu isActive={isActive} />
      <ModeToggle />
      <HideSideBar setActive={setActive} />
      <EyeToggle toggle={toggle} />
    </motion.div>
  )
}

function Logo() {
  return (
    <div
      key="full-logo"
      className="flex items-center justify-start [[data-isactive=false]_&]:hidden"
    >
      <Link href="/en/dashboard">
        <LogoWithText className="text-main-dark dark:text-light-grey" />
      </Link>
    </div>
  )
}
function Menu({ isActive }: { isActive: boolean }) {
  return (
    <nav className="flex w-full flex-grow flex-col gap-5 truncate [[data-isactive=false]_&]:hidden">
      <h3 className="text-xs font-bold uppercase leading-normal tracking-[2.4px] text-medium-grey">
        All Boards ({NAV_LINKS.length})
      </h3>
      <ul className="flex flex-col gap-1">
        {NAV_LINKS.map((link) => (
          <NavLink key={link.id} link={link} isActive={isActive} />
        ))}
      </ul>
    </nav>
  )
}
export function NavLink({
  link,
  isActive,
}: {
  link: NavLinkType
  isActive: boolean
}) {
  const pathname = usePathname()

  const isLinkActive = pathname === link.link

  return (
    <Link
      href={'/en/dashboard'}
      className={cn('group flex items-center gap-4', {
        'border-secondary-green rounded-r-lg border-l-4 bg-white text-white':
          isLinkActive && isActive,
        'hover:bg-grey-800 hover:text-white': !isLinkActive,
      })}
    >
      <span
        className={cn('text-current', {
          'text-secondary-green': isLinkActive,
        })}
      >
        logo
      </span>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: isActive ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className={cn('text-preset-3 truncate font-bold', {
          'group-hover:text-white': !isLinkActive,
          'text-grey-900': isLinkActive,
          'text-grey-300': !isLinkActive,
        })}
      >
        {link.name}
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
        className="flex h-full w-full items-center justify-center group-hover:text-white"
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
    <button
      onClick={() => setActive(false)}
      className="inline-flex items-center gap-4 text-[15px] font-bold text-medium-grey [[data-isactive=false]_&]:hidden"
    >
      <EyeOff className="h-[16px] w-[18px]" />
      <span>Hide Sidebar</span>
    </button>
  )
}
export function ModeToggle() {
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
  )
}
