'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery } from '@tanstack/react-query'
import { Plus, X } from 'lucide-react'
import { usePathname } from 'next/navigation'
import React from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { FormattedMessage, useIntl } from 'react-intl'

import { AddNewTaskSchema, SelectBoard } from '@/lib/definitions'
import { addNewTaskSchema } from '@/lib/validations'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { addNewsTask, getColumnByTask } from '@/app/[lang]/dashboard/actions'

import { Textarea } from './ui/textarea'

export default function AddNewTask({
  title,
}: {
  title: SelectBoard | undefined
}) {
  const taskId = title?.id

  const pathname = usePathname()
  const locale = pathname.split('/')[1] as 'en' | 'tr'

  const { data } = useQuery({
    queryKey: ['columns', taskId],
    queryFn: () => {
      if (taskId === undefined) {
        return Promise.reject('Task ID is undefined')
      }
      return getColumnByTask(taskId)
    },
    enabled: !!taskId,
  })

  const intl = useIntl()

  const form = useForm<AddNewTaskSchema>({
    resolver: zodResolver(addNewTaskSchema),
    defaultValues: {
      subtasks: [{ title: '' }],
    },
  })

  const {
    handleSubmit,
    formState: { errors },
    control,
    register,
    setValue,
  } = form

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'subtasks',
  })

  const onSubmit = async (data: AddNewTaskSchema) => {
    console.log('submit', data)

    if (title?.id === undefined) {
      toast.error('Task ID is undefined')
      return
    }
    const res = await addNewsTask(data, title.id, locale)

    if (res.success) {
      toast.success('Task created successfully')
    } else {
      toast.error(res.message)
    }
  }

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <div>
            <Button
              disabled={title === undefined}
              className="hidden md:inline-flex"
            >
              <FormattedMessage id="page.header.add.new.task" />
            </Button>
            <Button
              size="icon"
              disabled={title === undefined}
              className="rounded-full md:hidden"
            >
              <Plus />
            </Button>
          </div>
        </DialogTrigger>
        <DialogContent className="max-h-[600px] overflow-scroll">
          <DialogHeader>
            <DialogTitle>
              <FormattedMessage id="modal.add.new.task.header" />
            </DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Title Input */}
              <FormField
                control={control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <FormattedMessage id="modal.add.new.task.title" />
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        value={field.value || ''}
                        placeholder={intl.formatMessage({
                          id: 'modal.add.new.task.title.placeholder',
                          defaultMessage: 'e.g Take coffee break',
                        })}
                      />
                    </FormControl>
                    <FormMessage>{errors.title?.message}</FormMessage>
                  </FormItem>
                )}
              />

              {/* Description Input */}
              <FormField
                control={control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <FormattedMessage id="modal.add.new.task.description.label" />
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        className="h-[135px] resize-none"
                        {...field}
                        placeholder={intl.formatMessage({
                          id: 'modal.add.new.task.description.placeholder',
                          defaultMessage:
                            'e.g. It’s always good to take a break. This 15 minute break will recharge the batteries a little.',
                        })}
                      />
                    </FormControl>
                    <FormMessage>{errors.description?.message}</FormMessage>
                  </FormItem>
                )}
              />

              {/* Subtasks (Dinamik Alanlar) */}
              <div>
                <FormLabel>
                  <FormattedMessage id="modal.add.new.task.add.subtask.label" />
                </FormLabel>
                {fields.map((field, index) => (
                  <div key={field.id} className="flex items-center gap-2">
                    <FormControl>
                      <Input
                        className="mt-1 w-full"
                        placeholder={intl.formatMessage({
                          id: 'modal.add.new.task.add.subtask',
                          defaultMessage:
                            'e.g. It’s always good to take a break. This 15 minute break will recharge the batteries a little.',
                        })}
                        {...register(`subtasks.${index}.title` as const, {
                          required: true,
                        })}
                      />
                    </FormControl>
                    <button type="button" onClick={() => remove(index)}>
                      <X className="text-medium-grey" />
                    </button>
                  </div>
                ))}
              </div>
              <Button
                type="button"
                onClick={() => append({ title: '' })}
                className="mt-2 h-10 w-full"
                variant="secondary"
              >
                <FormattedMessage id="modal.add.new.task.add.new.subtask" />
              </Button>

              <FormField
                control={control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <FormattedMessage id="modal.add.new.task.status" />
                    </FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={(value) =>
                          setValue('status', value as string)
                        }
                        defaultValue={field.value?.toString()}
                      >
                        <SelectTrigger>
                          <SelectValue
                            placeholder={intl.formatMessage({
                              id: 'modal.add.new.task.status.placeholder',
                              defaultMessage: 'Select a status',
                            })}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {data?.map((column) => (
                            <SelectItem key={column.id} value={column.name}>
                              {column.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage>{errors?.status?.message}</FormMessage>
                  </FormItem>
                )}
              />

              {/* Submit Button */}
              <Button type="submit" className="h-10 w-full">
                <FormattedMessage id="modal.add.new.task.create" />
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  )
}
