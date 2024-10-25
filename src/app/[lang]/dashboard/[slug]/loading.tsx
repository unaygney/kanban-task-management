import { Loader2 } from 'lucide-react'
import React from 'react'

export default function LoadingPage() {
  return (
    <div className="flex h-[calc(100vh-64px)] items-center justify-center md:h-[calc(100vh-5rem)] lg:h-[calc(100vh-6rem)]">
      <Loader2 className="h-8 w-8 animate-spin text-main-purple" />
    </div>
  )
}
