'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { X } from 'lucide-react'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { FormattedMessage, useIntl } from 'react-intl'

import { AddNewBoardSchema } from '@/lib/definitions'
import { addNewBoardSchema } from '@/lib/validations'

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

import { Board } from './icons'

export default function AddNewBoard() {
  const [columns, setColumns] = useState<string[]>([''])
  const intl = useIntl()

  const form = useForm<AddNewBoardSchema>({
    resolver: zodResolver(addNewBoardSchema),
    defaultValues: {
      columns: [''],
      name: '',
    },
  })

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
  } = form

  const onSubmit = async (data: AddNewBoardSchema) => {
    console.log(data)
  }

  const addColumn = () => {
    const currentColumns = getValues('columns') || []
    setColumns([...currentColumns, ''])
    setValue('columns', [...currentColumns, ''])
  }

  const removeColumn = (index: number) => {
    const currentColumns = getValues('columns') || []
    const updatedColumns = currentColumns.filter((_, i) => i !== index)
    setColumns(updatedColumns)
    setValue('columns', updatedColumns)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="flex items-center gap-4 px-8 font-bold text-main-purple hover:text-main-purple-hover">
          <Board />
          <FormattedMessage id="modal.add.new.board.title" />
        </button>
      </DialogTrigger>
      <DialogContent className="max-h-[600px] overflow-scroll">
        <DialogHeader>
          <DialogTitle>
            <FormattedMessage id="modal.add.new.board.title" />
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Name Input */}
            <FormField
              control={control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <FormattedMessage id="modal.add.new.board.name" />
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder={intl.formatMessage({
                        id: 'modal.add.new.board.name.placeholder',
                        defaultMessage: 'e.g Web Design',
                      })}
                    />
                  </FormControl>
                  <FormMessage>{errors.name?.message}</FormMessage>
                </FormItem>
              )}
            />
            {/* Dynamic Columns */}
            {columns.map((_, index) => (
              <FormField
                key={index}
                control={control}
                name={`columns.${index}`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <FormattedMessage id="modal.add.new.board.columns" />
                    </FormLabel>
                    <div className="flex items-center gap-2">
                      <FormControl>
                        <Input
                          {...field}
                          value={field.value || ''}
                          placeholder={intl.formatMessage({
                            id: 'modal.add.new.board.columns.placeholder',
                            defaultMessage: 'e.g Todo',
                          })}
                        />
                      </FormControl>
                      <button type="button" onClick={() => removeColumn(index)}>
                        <X className="text-[#828fa3]" />
                      </button>
                    </div>
                    <FormMessage>
                      {errors.columns?.[index]?.message}
                    </FormMessage>
                  </FormItem>
                )}
              />
            ))}
            <div className="flex flex-col gap-6">
              {/* Add New Column */}
              <Button variant="secondary" type="button" onClick={addColumn}>
                <FormattedMessage id="modal.add.new.board.add.new.column" />
              </Button>
              {/* Submit Button */}
              <Button type="submit">
                <FormattedMessage id="modal.add.new.board.create" />
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
