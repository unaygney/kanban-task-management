'use client'

import { Reorder, useDragControls } from 'framer-motion'
import { Grip } from 'lucide-react'
import React from 'react'
import { useState } from 'react'

import { SelectSubTask, SelectTask } from '@/lib/definitions'

import { Dialog, DialogTrigger } from '@/components/ui/dialog'

import ViewTaskModal from './view-task-modal'

interface ColumnProps {
  name: string
  tasks: SelectTask[]
  subTasks: SelectSubTask[]
  id: number
}

export const Column: React.FC<ColumnProps> = ({
  name,
  tasks,
  subTasks,
  id,
}) => {
  const [items, setItems] = useState(tasks)
  const controls = useDragControls()

  return (
    <>
      <div className="flex w-[280px] flex-col gap-6">
        <div className="flex items-center gap-3">
          <span
            className="block h-[15px] w-[15px] rounded-full"
            style={{ backgroundColor: 'red' }}
          />
          <h2 className="text-xs font-bold uppercase leading-normal tracking-[2.4px] text-medium-grey">
            {name} ({items.length})
          </h2>
        </div>

        <Reorder.Group
          axis="y"
          values={items}
          onReorder={setItems}
          className="flex flex-col gap-5"
        >
          {items.map((task) => {
            const relatedSubTasks = subTasks.filter(
              (subTask) => subTask.taskId === task.id
            )

            return (
              <Reorder.Item
                dragListener={false}
                dragControls={controls}
                key={task.id}
                value={task}
              >
                <Task
                  id={id}
                  task={task}
                  subTasks={relatedSubTasks}
                  controls={controls}
                />
              </Reorder.Item>
            )
          })}
        </Reorder.Group>
      </div>
    </>
  )
}

interface TaskProps {
  task: SelectTask
  subTasks: SelectSubTask[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  controls: any
  id: number
}

export const Task: React.FC<TaskProps> = ({ task, subTasks, controls, id }) => {
  const completedSubTasks = subTasks.filter((subTask) => subTask.isCompleted)

  return (
    <div className="relative h-[88px] w-full cursor-pointer rounded-[8px] bg-white px-4 py-[23px] shadow dark:bg-dark-grey">
      <button
        onPointerDown={(e) => controls.start(e)}
        className="absolute right-4 top-[23px]"
      >
        <Grip className="h-4 w-4" />
      </button>
      <Dialog>
        <DialogTrigger asChild>
          <div className="flex h-full w-full flex-col gap-2">
            <h6 className="text-[15px] font-bold text-main-dark dark:text-white">
              {task.title}
            </h6>
            <p className="text-xs font-bold leading-normal text-medium-grey">
              {completedSubTasks.length} of {subTasks.length} subtasks completed
            </p>
          </div>
        </DialogTrigger>
        <ViewTaskModal task={task} subTasks={subTasks} columnId={id} />
      </Dialog>
    </div>
  )
}
