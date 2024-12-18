import { relations } from 'drizzle-orm'
import {
  boolean,
  index,
  integer,
  pgTable,
  uniqueIndex,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core'

export const boardTable = pgTable(
  'boards',
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: varchar({ length: 255 }).notNull(),
    slug: varchar({ length: 255 }).notNull(),
    userId: uuid().notNull(),
  },
  (table) => ({
    userIdIdx: index('user_id_idx').on(table.userId),
    userSlugUniqueIdx: uniqueIndex('user_slug_unique_idx').on(
      table.userId,
      table.slug
    ),
  })
)
export const boardsRelations = relations(boardTable, ({ many }) => ({
  columns: many(columnTable),
}))

export const columnTable = pgTable('columns', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  boardId: integer()
    .references(() => boardTable.id)
    .notNull(),
})

export const columnsRelations = relations(columnTable, ({ one, many }) => ({
  board: one(boardTable, {
    fields: [columnTable.boardId],
    references: [boardTable.id],
  }),
  tasks: many(taskTable),
}))

export const taskTable = pgTable('tasks', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  title: varchar({ length: 255 }).notNull(),
  description: varchar({ length: 1000 }),
  status: varchar({ length: 50 }).notNull(),
  columnId: integer()
    .references(() => columnTable.id)
    .notNull(),
})

export const tasksRelations = relations(taskTable, ({ one, many }) => ({
  column: one(columnTable, {
    fields: [taskTable.columnId],
    references: [columnTable.id],
  }),
  subtasks: many(subtaskTable),
}))

export const subtaskTable = pgTable('subtasks', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  title: varchar({ length: 255 }).notNull(),
  isCompleted: boolean().notNull().default(false),
  taskId: integer()
    .references(() => taskTable.id)
    .notNull(),
})

export const subtasksRelations = relations(subtaskTable, ({ one }) => ({
  task: one(taskTable, {
    fields: [subtaskTable.taskId],
    references: [taskTable.id],
  }),
}))
