'use server'

import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import slugify from 'slugify'

import { AddNewBoardSchema } from '@/lib/definitions'
import { addNewBoardSchema } from '@/lib/validations'

import { db } from '@/db'
import { boardTable } from '@/db/schema'

async function getMessages(locale: 'en' | 'tr') {
  const messages = (await import(`../../../lang/${locale}.json`)).default
  return messages
}

export async function addNewBoard(
  values: AddNewBoardSchema,
  locale: 'en' | 'tr'
) {
  const userId = cookies().get('user_id')?.value ?? null

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
    await db.insert(boardTable).values({
      name: values.name,
      columns: values.columns,
      userId,
      slug: slugify(values.name, { lower: true }),
    })
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
  const userId = cookies().get('user_id')?.value ?? null

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
