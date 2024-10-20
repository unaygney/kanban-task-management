import { Locale } from '@/lib/definitions'

interface Props {
  params: {
    lang: Locale
  }
}

export default async function Home({ params: { lang: locale } }: Props) {
  return <div>test {locale}</div>
}
