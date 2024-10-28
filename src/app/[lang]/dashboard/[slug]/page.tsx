import { eq } from 'drizzle-orm'
import { redirect } from 'next/navigation'
import React from 'react'

import { getIntl } from '@/lib/intl'

import { Column } from '@/components/column'
import { Button } from '@/components/ui/button'

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

async function getMessages(locale: string) {
  const messages = (await import(`../../../../lang/${locale}.json`)).default
  return messages
}

export default async function Page(props: {
  params: Promise<{ slug: string; lang: string }>
}) {
  const params = await props.params
  const { lang } = params as { slug: string; lang: 'en' | 'tr' }
  const intl = await getIntl(lang)
  const messages = await getMessages(lang)

  const result = await db.query.boardTable.findFirst({
    where: (board) => eq(board.slug, params.slug),
    with: {
      columns: {
        with: {
          tasks: {
            with: {
              subtasks: true,
            },
          },
        },
      },
    },
  })

  if (!result) {
    redirect(`/${lang}/dashboard`)
  }

  const { columns } = result

  return (
    <div className="flex h-[calc(100vh-64px)] gap-5 overflow-scroll p-6 md:h-[calc(100vh-5rem)] lg:h-[calc(100vh-6rem)]">
      {columns.length > 0 ? (
        <div className="flex gap-4">
          {columns.map((column) => (
            <Column
              key={column.id}
              id={column.boardId}
              name={column.name}
              tasks={column.tasks}
              subTasks={column.tasks.flatMap((task) => task.subtasks)}
              locale={lang}
              messages={messages}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-8">
          <p className="text-lg font-bold leading-normal text-medium-grey">
            {intl.formatMessage({ id: 'page.empty.board' })}
          </p>
          <Button className="mx-auto self-start">
            {intl.formatMessage({ id: 'modal.add.new.board.add.new.column' })}
          </Button>
        </div>
      )}

      {/* <div
        className="ml-auto flex max-w-[280px] flex-1 items-center justify-center rounded-[6px]"
        style={{
          background:
            'linear-gradient(180deg, rgba(43, 44, 55, 0.25) 0%, rgba(43, 44, 55, 0.13) 100% ',
        }}
      >
        <button className="text-center text-2xl font-bold leading-normal text-medium-grey">
          {intl.formatMessage({ id: 'modal.add.new.board.add.new.column' })}
        </button>
      </div> */}
    </div>
  )
}
