'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { Eye } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useRef } from 'react'
import { useOnClickOutside } from 'usehooks-ts'

import { cn } from '@/lib/utils'

const NAV_LINKS = [
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
type NavLinkType = (typeof NAV_LINKS)[number]

export default function SideBar() {
  const [isActive, setActive] = React.useState<boolean>(false)
  const ref = useRef(null)

  useOnClickOutside(ref, () => {
    if (isActive) setActive(false)
  })

  const toggle = () => setActive(!isActive)
  return (
    <motion.div
      ref={ref}
      initial={{
        width: '0px',
      }}
      animate={{
        width: isActive ? '300px' : '0px',
      }}
      transition={{ duration: 0.3 }}
      className="text-grey-300 relative hidden h-screen flex-col gap-6 rounded-r-lg bg-white dark:bg-[#2B2C37] lg:flex"
    >
      {/* LOGO */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            key="full-logo"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex h-[101px] items-center justify-start px-8 py-10"
          >
            <Link href="/en/dashboard">logo</Link>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MENU */}
      {/* <AnimatePresence>
        {isActive && (
          <motion.nav
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full flex-grow"
          >
            <ul className="flex flex-col gap-1 pr-6">
              {NAV_LINKS.map((link) => (
                <NavLink key={link.id} link={link} isActive={isActive} />
              ))}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence> */}

      {/* TOGGLE */}
      <AnimatePresence>
        {!isActive && (
          <motion.button
            onClick={toggle}
            className="group absolute bottom-8 right-[-56px] inline-flex h-12 w-14 items-center justify-center rounded-r-[100px] bg-purple-500"
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
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

function NavLink({ link, isActive }: { link: NavLinkType; isActive: boolean }) {
  const pathname = usePathname()

  const isLinkActive = pathname === link.link

  return (
    <Link
      href={'/en/dashboard'}
      className={cn('group flex items-center gap-4 px-8 py-4', {
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
