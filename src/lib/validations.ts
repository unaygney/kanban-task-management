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
export const addNewTaskSchema = z.object({
  title: z.string().min(1, {
    message: 'Title is required.',
  }),
  description: z.string().min(1, {
    message: 'Description is required.',
  }),
  status: z.string().min(1, {
    message: 'Status is required.',
  }),
  subtasks: z.array(
    z.object({
      title: z.string().min(1, {
        message: 'Subtask title is required.',
      }),
    })
  ),
})
