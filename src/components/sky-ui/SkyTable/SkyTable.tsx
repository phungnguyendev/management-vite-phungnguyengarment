import type { DragCancelEvent, DragEndEvent, DragMoveEvent, DragOverEvent, DragStartEvent } from '@dnd-kit/core'
import { DndContext } from '@dnd-kit/core'
import { restrictToVerticalAxis } from '@dnd-kit/modifiers'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import type { TableProps } from 'antd'
import { Table } from 'antd'
import type { ColumnsType, ColumnType } from 'antd/es/table'
import { cn } from '~/utils/helpers'
import SkyTableRow from './SkyTableRow'

export type SkyTableRequiredDataType = {
  key: string
}

export interface SkyTableProps<T extends SkyTableRequiredDataType> extends TableProps {
  dataSource: T[]
  tableColumns: {
    columns: ColumnsType<T>
    actionColumn?: ColumnType<T>
    showAction?: boolean
  }
  onPageChange?: (page: number, pageSize: number) => void
  onDragStart?(event: DragStartEvent): void
  onDragMove?(event: DragMoveEvent): void
  onDragOver?(event: DragOverEvent): void
  onDragEnd?(event: DragEndEvent): void
  onDragCancel?(event: DragCancelEvent): void
}

const SkyTable = <T extends SkyTableRequiredDataType>({ ...props }: SkyTableProps<T>) => {
  return (
    <DndContext modifiers={[restrictToVerticalAxis]} {...props}>
      <SortableContext items={props.dataSource.map((i) => i.key)} strategy={verticalListSortingStrategy}>
        <Table
          {...props}
          columns={
            props.tableColumns.showAction ?? true
              ? props.tableColumns.actionColumn
                ? [...props.tableColumns.columns, props.tableColumns.actionColumn]
                : props.tableColumns.columns
              : props.tableColumns.columns
          }
          bordered
          components={{
            body: {
              row: SkyTableRow
            }
          }}
          pagination={
            props.pagination ?? {
              pageSize: 10,
              onChange: props.onPageChange
            }
          }
          rowClassName='editable-row'
          className={cn('z-0', props.className)}
          rowKey='key'
          dataSource={props.dataSource}
        />
      </SortableContext>
    </DndContext>
  )
}

export default SkyTable
