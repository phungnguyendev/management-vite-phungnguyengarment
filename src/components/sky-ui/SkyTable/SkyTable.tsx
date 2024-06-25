import type { DragCancelEvent, DragEndEvent, DragMoveEvent, DragOverEvent, DragStartEvent } from '@dnd-kit/core'
import { DndContext } from '@dnd-kit/core'
import { restrictToVerticalAxis } from '@dnd-kit/modifiers'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import type { TableProps } from 'antd'
import { Table } from 'antd'
import { ColumnType, ColumnsType } from 'antd/es/table'
import { useState } from 'react'
import ActionRow, { ActionProps } from '../ActionRow'
import SkyTableRow from './SkyTableRow'

export type SkyTableRequiredDataType = {
  key: string
  id?: number
  createdAt?: string
  updatedAt?: string
  orderNumber?: number | null
}

export interface SkyTableProps<T extends SkyTableRequiredDataType> extends TableProps {
  dataSource: T[]
  onPageChange?: (page: number, pageSize: number) => void
  actionProps?: ActionProps<T>
  isShowDeleted?: boolean
  editingKey?: string
  deletingKey?: string
  onDragStart?(event: DragStartEvent): void
  onDragMove?(event: DragMoveEvent): void
  onDragOver?(event: DragOverEvent): void
  onDragEnd?(event: DragEndEvent): void
  onDragCancel?(event: DragCancelEvent): void
}

const SkyTable = <T extends SkyTableRequiredDataType>({ ...props }: SkyTableProps<T>) => {
  const [editKey, setEditKey] = useState<string>('-1')
  const isEditing = (key: string): boolean => {
    return props.editingKey === key
  }

  const actionsCol: ColumnType<T> = {
    title: 'Operation',
    width: '1%',
    dataIndex: 'operation',
    render: (_value: any, record: T) => {
      return (
        <ActionRow
          isEditing={isEditing(record.key)}
          onAdd={{
            ...props.actionProps?.onAdd,
            onClick: (e) => props.actionProps?.onAdd?.onClick?.(e, record),
            disabled: props.actionProps?.onAdd?.disabled ?? isEditing(editKey),
            isShow: props.actionProps?.onAdd ? props.actionProps.onAdd.isShow ?? true : false
          }}
          onSave={{
            ...props.actionProps?.onSave,
            onClick: (e) => props.actionProps?.onSave?.onClick?.(e, record),
            disabled: props.actionProps?.onSave?.disabled ?? isEditing(editKey),
            isShow: props.actionProps?.onSave ? props.actionProps.onSave.isShow ?? true : false
          }}
          onEdit={{
            ...props.actionProps?.onEdit,
            onClick: (e) => {
              setEditKey(record.key!)
              props.actionProps?.onEdit?.onClick?.(e, record)
            },
            disabled: props.actionProps?.onEdit?.disabled ?? isEditing(editKey),
            isShow: props.actionProps?.onEdit ? props.actionProps.onEdit.isShow ?? true : false
          }}
          onDelete={{
            ...props.actionProps?.onDelete,
            onClick: (e) => {
              // setDeleteKey(record.key!)
              props.actionProps?.onDelete?.onClick?.(e, record)
            },
            disabled: props.actionProps?.onDelete?.disabled ?? isEditing(editKey),
            isShow: props.actionProps?.onDelete ? props.actionProps.onDelete.isShow ?? true : false
          }}
          onRestore={{
            ...props.actionProps?.onRestore,
            onClick: (e) => {
              // setDeleteKey(record.key!)
              props.actionProps?.onRestore?.onClick?.(e, record)
            },
            disabled: props.actionProps?.onRestore?.disabled ?? isEditing(editKey),
            isShow: props.actionProps?.onRestore ? props.actionProps.onRestore.isShow ?? true : false
          }}
          onConfirmCancelEditing={(e) => props.actionProps?.onConfirmCancelEditing?.(e)}
          onConfirmCancelDeleting={props.actionProps?.onConfirmCancelDeleting}
          onConfirmDelete={() => props.actionProps?.onConfirmDelete?.(record)}
          onConfirmRestore={() => props.actionProps?.onConfirmRestore?.(record)}
        />
      )
    }
  }

  const getColumn = (showAction: boolean): ColumnsType<T> => {
    return showAction ? [...props.columns!, actionsCol] : [...props.columns!]
  }

  return (
    <DndContext modifiers={[restrictToVerticalAxis]} {...props}>
      <SortableContext
        // rowKey array
        items={props.dataSource.map((i) => `${i.key}`)}
        strategy={verticalListSortingStrategy}
      >
        <Table
          {...props}
          columns={getColumn(props.actionProps?.isShow ?? false)}
          components={{
            body: {
              row: SkyTableRow
            }
          }}
          className='z-0'
          rowKey='key'
          dataSource={props.dataSource}
        />
      </SortableContext>
    </DndContext>
  )
}

export default SkyTable
