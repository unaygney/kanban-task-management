'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { type ThemeProviderProps } from 'next-themes/dist/types'
import * as React from 'react'
import { createContext, useContext, useEffect, useState } from 'react'
import { useLocalStorage } from 'usehooks-ts'

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}

const SidebarContext = createContext<{
  isActive: boolean
  setActive: (value: boolean) => void
  toggle: () => void
} | null>(null)

export const SidebarProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [isMounted, setIsMounted] = useState(false)
  const [isActive, setActive] = useLocalStorage('sidebarIsActive', false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const toggle = () => setActive(!isActive)

  if (!isMounted) {
    return null
  }

  return (
    <SidebarContext.Provider value={{ isActive, setActive, toggle }}>
      {children}
    </SidebarContext.Provider>
  )
}

export const useSidebar = () => {
  const context = useContext(SidebarContext)
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider')
  }
  return context
}

const queryClient = new QueryClient()

export function TanstackProvider({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}
