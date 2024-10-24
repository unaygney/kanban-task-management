import { eq } from 'drizzle-orm'
import React from 'react'

import { getIntl } from '@/lib/intl'

import { Column } from '@/components/column'
import { Button } from '@/components/ui/button'

import { db } from '@/db'
import { boardTable, columnTable, subtaskTable, taskTable } from '@/db/schema'

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

export default async function Page(props: {
  params: Promise<{ slug: string; lang: string }>
}) {
  const params = await props.params
  const { lang } = params as { slug: string; lang: 'en' | 'tr' }
  const intl = await getIntl(lang)

  const board = await db
    .select()
    .from(boardTable)
    .where(eq(boardTable.slug, params.slug))

  const columns = await db
    .select()
    .from(columnTable)
    .where(eq(columnTable.boardId, board[0]?.id))

  const columnsWithTasksAndSubtasks = await Promise.all(
    columns.map(async (column) => {
      const tasks = await db
        .select()
        .from(taskTable)
        .where(eq(taskTable.columnId, column.id))

      const tasksWithSubtasks = await Promise.all(
        tasks.map(async (task) => {
          const subTasks = await db
            .select()
            .from(subtaskTable)
            .where(eq(subtaskTable.taskId, task.id))

          return { ...task, subTasks }
        })
      )

      return { ...column, tasks: tasksWithSubtasks }
    })
  )

  return (
    <div className="flex h-[calc(100vh-64px)] gap-5 overflow-scroll p-6 md:h-[calc(100vh-5rem)] lg:h-[calc(100vh-6rem)]">
      {columnsWithTasksAndSubtasks.length > 0 ? (
        <div className="flex gap-4">
          {columnsWithTasksAndSubtasks.map((column) => (
            <Column
              key={column.id}
              name={column.name}
              tasks={column.tasks}
              subTasks={column.tasks.flatMap((task) => task.subTasks)}
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

      <div
        className="ml-auto flex max-w-[280px] flex-1 items-center justify-center rounded-[6px]"
        style={{
          background:
            'linear-gradient(180deg, rgba(43, 44, 55, 0.25) 0%, rgba(43, 44, 55, 0.13) 100% ',
        }}
      >
        <button className="text-center text-2xl font-bold leading-normal text-medium-grey">
          {intl.formatMessage({ id: 'modal.add.new.board.add.new.column' })}
        </button>
      </div>
    </div>
  )
}
