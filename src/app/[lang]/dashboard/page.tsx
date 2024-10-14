import { Locale } from '@/lib/definitions'
import { getIntl } from '@/lib/intl'

import { ModeToggle } from '@/components/toggle'
import { Button } from '@/components/ui/button'

interface Props {
  params: {
    lang: Locale
  }
}

export default async function Home({ params: { lang: locale } }: Props) {
  const intl = await getIntl(locale)
  return (
    <div className="min-h-screen w-full bg-red-300 dark:bg-slate-500">
      <ModeToggle />
      <Button>
        {intl.formatMessage({ id: 'common.navigation.discover' })}
      </Button>
    </div>
  )
}