import React from 'react'

import { db } from '@/db'
import { boardTable } from '@/db/schema'

export async function generateStaticParams() {
  const boards = await db.select().from(boardTable)

  const supportedLanguages = ['en', 'tr']

  return boards.flatMap((post) =>
    supportedLanguages.map((lang) => ({
      lang,
      slug: post.slug,
    }))
  )
}

export default async function Page({
  params,
}: {
  params: { slug: string; lang: string }
}) {
  console.log(params)
  return <div>test</div>
}
