import { Locale } from '@/lib/definitions'
import { getIntl } from '@/lib/intl'

interface Props {
  params: Promise<{
    lang: Locale
  }>
}

export default async function Home(props: Props) {
  const params = await props.params
  const { lang: locale } = params

  const intl = await getIntl(locale)

  return (
    <div className="flex h-[calc(100vh-64px)] items-center justify-center overflow-scroll p-6 md:h-[calc(100vh-5rem)] lg:h-[calc(100vh-6rem)]">
      <div className="flex flex-col gap-8">
        <p className="text-lg font-bold leading-normal text-medium-grey">
          {intl.formatMessage({ id: 'page.empty.board' })}
        </p>
      </div>
    </div>
  )
}
