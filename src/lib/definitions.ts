import { i18n } from '../../i18n-config'
import { InferInsertModel, type InferSelectModel } from 'drizzle-orm'
import { z } from 'zod'

import { addNewBoardSchema, addNewTaskSchema } from './validations'
import { boardTable, taskTable } from '@/db/schema'

export type Locale = (typeof i18n)['locales'][number]
export type AddNewBoardSchema = z.infer<typeof addNewBoardSchema>
export type AddNewTaskSchema = z.infer<typeof addNewTaskSchema>

export type SelectBoard = InferSelectModel<typeof boardTable>
export type InsertBoard = InferInsertModel<typeof boardTable>
export type SelectTask = InferSelectModel<typeof taskTable>
export type InsertTask = InferInsertModel<typeof taskTable>
