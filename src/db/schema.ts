import {
  index,
  integer,
  jsonb,
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
    columns: jsonb().array().notNull(),
    userId: uuid().notNull(),
  },
  (table) => ({
    userIdIdx: index('user_id_idx').on(table.userId),
    slugUniqueIdx: uniqueIndex('slug_unique_idx').on(table.slug),
  })
)
