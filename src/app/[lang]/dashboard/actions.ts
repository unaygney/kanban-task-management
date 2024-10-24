'use server'

import { eq, inArray } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import slugify from 'slugify'

import { AddNewBoardSchema, AddNewTaskSchema } from '@/lib/definitions'
import { addNewBoardSchema, addNewTaskSchema } from '@/lib/validations'

import { db } from '@/db'
import { boardTable, columnTable, subtaskTable, taskTable } from '@/db/schema'

async function getMessages(locale: 'en' | 'tr') {
  const messages = (await import(`../../../lang/${locale}.json`)).default
  return messages
}

export async function addNewBoard(
  values: AddNewBoardSchema,
  locale: 'en' | 'tr'
) {
  const userId = (await cookies()).get('user_id')?.value ?? null

  const messages = await getMessages(locale)

  if (!userId) {
    return {
      success: false,
      message: messages['userNotFound'] || 'User not found',
    }
  }

  const isValid = await addNewBoardSchema.safeParseAsync(values)

  if (!isValid.success) {
    return {
      success: false,
      message: messages['validationError'] || 'Validation error',
    }
  }

  try {
    const insertedBoard = await db
      .insert(boardTable)
      .values({
        name: values.name,
        userId,
        slug: slugify(values.name, { lower: true }),
      })
      .returning({ id: boardTable.id })

    const boardId = insertedBoard[0].id

    for (const column of values.columns) {
      await db.insert(columnTable).values({
        name: column,
        boardId,
      })
    }

    revalidatePath('/', 'layout')
    return {
      success: true,
      message: messages['boardAdded'] || 'New board added',
    }
  } catch (error) {
    console.error(error)
    return {
      success: false,
      message: messages['boardFailed'] || 'Failed to add new board',
    }
  }
}
export async function getBoards(locale: 'en' | 'tr' = 'en') {
  const userId = (await cookies()).get('user_id')?.value ?? null

  const messages = await getMessages(locale)

  if (!userId) {
    return {
      success: false,
      message: messages['userNotFound'] || 'User not found',
    }
  }

  try {
    const boards = await db
      .select()
      .from(boardTable)
      .where(eq(boardTable.userId, userId))
    return {
      success: true,
      data: boards,
    }
  } catch (error) {
    console.error(error)
    return {
      success: false,
      message: messages['boardsFetchFailed'] || 'Failed to fetch boards',
    }
  }
}
export async function getColumnByTask(boardId: number) {
  const columns = await db
    .select()
    .from(columnTable)
    .where(eq(columnTable.boardId, boardId))
    .execute()

  return columns
}
export async function addNewsTask(
  values: AddNewTaskSchema,
  titleId: number,
  locale: 'en' | 'tr'
) {
  const userId = (await cookies()).get('user_id')?.value ?? null

  const messages = await getMessages(locale)

  if (!userId) {
    return {
      success: false,
      message: messages['userNotFound'] || 'User not found',
    }
  }

  const isValid = await addNewTaskSchema.safeParseAsync(values)

  if (!isValid.success) {
    return {
      success: false,
      message: messages['validationError'] || 'Validation error',
    }
  }

  try {
    //todo : find column id
    const columnsId = await db
      .select()
      .from(columnTable)
      .where(eq(columnTable.name, values.status))
    // todo : add new task
    const insertedTask = await db
      .insert(taskTable)
      .values({
        title: values.title,
        description: values.description,
        columnId: columnsId[0].id,
        status: values.status,
      })
      .returning({ id: taskTable.id })
    // todo : add subtasks
    for (const subtask of values.subtasks) {
      await db.insert(subtaskTable).values({
        taskId: insertedTask[0].id,
        title: subtask.title,
        isCompleted: false,
      })
    }
    revalidatePath('/', 'layout')
    return { success: true, message: messages['taskAdded'] || 'New task added' }
  } catch (error) {
    console.error(error)
    return {
      success: false,
      message: messages['taskFailed'] || 'Failed to add new task',
    }
  }
}

export async function deleteBoard(boardId: number, locale: 'en' | 'tr') {
  const userId = (await cookies()).get('user_id')?.value ?? null

  const messages = await getMessages(locale)

  if (!userId) {
    return {
      success: false,
      message: messages['userNotFound'] || 'User not found',
    }
  }

  try {
    const columns = await db
      .select({ id: columnTable.id })
      .from(columnTable)
      .where(eq(columnTable.boardId, boardId))

    const columnIds = columns.map((column) => column.id)

    if (columnIds.length > 0) {
      const tasks = await db
        .select({ id: taskTable.id })
        .from(taskTable)
        .where(inArray(taskTable.columnId, columnIds))

      const taskIds = tasks.map((task) => task.id)

      if (taskIds.length > 0) {
        await db
          .delete(subtaskTable)
          .where(inArray(subtaskTable.taskId, taskIds))
          .execute()
      }

      await db
        .delete(taskTable)
        .where(inArray(taskTable.columnId, columnIds))
        .execute()
    }

    await db
      .delete(columnTable)
      .where(eq(columnTable.boardId, boardId))
      .execute()

    await db.delete(boardTable).where(eq(boardTable.id, boardId)).execute()

    revalidatePath('/', 'layout')

    return {
      success: true,
      message: messages['boardDeleted'] || 'Board deleted successfully',
    }
  } catch (error) {
    console.error(error)
    return {
      success: false,
      message: messages['boardDeleteFailed'] || 'Failed to delete board',
    }
  }
}
