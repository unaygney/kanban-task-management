import { i18n } from '../../i18n-config'
import { InferInsertModel, type InferSelectModel } from 'drizzle-orm'
import { z } from 'zod'

import { addNewBoardSchema } from './validations'
import { boardTable } from '@/db/schema'

export type Locale = (typeof i18n)['locales'][number]
export type AddNewBoardSchema = z.infer<typeof addNewBoardSchema>
export type SelectBoard = InferSelectModel<typeof boardTable>
export type InsertBoard = InferInsertModel<typeof boardTable>
