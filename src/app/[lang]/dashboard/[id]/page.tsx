import React from 'react'

export default function PreviewKanbanPage({
  params: { id },
}: {
  params: { id: string }
}) {
  return <div>id : {id}</div>
}
