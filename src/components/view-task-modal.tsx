'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { z } from 'zod'

import { SelectSubTask, SelectTask } from '@/lib/definitions'
import { cn } from '@/lib/utils'

import { Checkbox } from '@/components/ui/checkbox'
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import {
  getColumnById,
  updateSubTaskStatus,
  updateTaskStatus,
} from '@/app/[lang]/dashboard/actions'

interface Props {
  task: SelectTask
  subTasks: SelectSubTask[]
  columnId: number
}

const formSchema = z.object({
  currentStatus: z.string({ required_error: 'Please select a status' }),
  subTasks: z.array(
    z.object({
      id: z.number(),
      title: z.string(),
      completed: z.boolean().optional(),
    })
  ),
})

export default function ViewTaskModal({ task, subTasks, columnId }: Props) {
  // get the columns
  const { data: columns } = useQuery({
    queryKey: ['columns'],
    queryFn: async () => getColumnById(columnId),
  })
  // update the subtask status
  const { mutate: mutateSubTaskStatus } = useMutation({
    mutationFn: async ({
      subTaskId,
      completed,
    }: {
      subTaskId: number
      completed: boolean
    }) => {
      return updateSubTaskStatus(subTaskId, completed)
    },
    onSuccess: () => {
      toast.success('Subtask updated successfully')
    },
    onError: (error) => {
      console.error(error)
      toast.error('Failed to update subtask')
    },
  })
  // update the task status
  const { mutate: mutateTaskStatus } = useMutation({
    mutationFn: async (status: string) => {
      return updateTaskStatus(task.id, status)
    },
    onSuccess: () => {
      toast.success('Task status updated successfully')
    },
    onError: () => {
      toast.error('Failed to update task status')
    },
  })

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      currentStatus: task.status,
      subTasks: subTasks.map((subTask) => ({
        id: subTask.id,
        title: subTask.title,
        completed: subTask.isCompleted ?? false,
      })),
    },
  })

  const handleStatusChange = (status: string) => {
    form.setValue('currentStatus', status)
    mutateTaskStatus(status)
  }

  const handleSubTaskChange = (subTaskId: number, completed: boolean) => {
    form.setValue(
      'subTasks',
      form
        .getValues('subTasks')
        .map((subTask) =>
          subTask.id === subTaskId ? { ...subTask, completed } : subTask
        )
    )
    mutateSubTaskStatus({ subTaskId, completed })
  }

  return (
    <DialogContent className="h-[400px] overflow-scroll bg-white dark:bg-dark-grey">
      <DialogHeader className="flex flex-col gap-6">
        <DialogTitle className="text-lg font-bold tracking-wide text-main-dark dark:text-white">
          {task.title}
        </DialogTitle>
        <DialogDescription className="font-medium leading-6 text-medium-grey">
          {task.description}
        </DialogDescription>
      </DialogHeader>

      <Form {...form}>
        <form className="space-y-4">
          {form.watch('subTasks').map((subTask, index) => (
            <FormField
              key={subTask.id}
              control={form.control}
              name={`subTasks.${index}.completed`}
              render={({ field }) => (
                <FormItem className="flex items-center gap-2 space-y-0 rounded bg-light-grey p-3 dark:bg-very-dark-grey">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={(checked) =>
                        handleSubTaskChange(subTask.id, checked as boolean)
                      }
                      className="border-medium-grey data-[state=checked]:border-none data-[state=checked]:bg-main-purple data-[state=checked]:text-white"
                      id={`subtask-${subTask.id}`}
                    />
                  </FormControl>
                  <FormLabel
                    htmlFor={`subtask-${subTask.id}`}
                    className={cn(
                      'text-main-dark transition-colors duration-300 dark:text-white',
                      {
                        'line-through opacity-50': field.value,
                      }
                    )}
                  >
                    {subTask.title}
                  </FormLabel>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}

          <FormField
            control={form.control}
            name="currentStatus"
            render={() => (
              <FormItem>
                <FormLabel>Şuanki Durum</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={(value) => handleStatusChange(value)}
                    defaultValue={task.status}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {columns?.map((column) => (
                        <SelectItem key={column.id} value={column.name}>
                          {column.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </DialogContent>
  )
}
