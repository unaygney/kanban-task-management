import { Locale } from '@/lib/definitions'

interface Props {
  params: Promise<{
    lang: Locale
  }>
}

export default async function Home(props: Props) {
  const params = await props.params

  const { lang: locale } = params

  return <div>test {locale}</div>
}
