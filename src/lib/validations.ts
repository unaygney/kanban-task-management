import { z } from 'zod'

export const addNewBoardSchema = z.object({
  name: z.string().min(1, {
    message: 'Name is required.',
  }),
  columns: z.array(
    z.string().min(1, {
      message: 'Column name is required.',
    })
  ),
})
