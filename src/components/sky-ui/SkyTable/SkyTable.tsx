import { Table } from 'antd'
import type { ColumnsType, TableProps } from 'antd/es/table'
import { ColumnType } from 'antd/lib/table'
import { useEffect, useRef, useState } from 'react'
import { ResponseDataType, defaultRequestBody } from '~/api/client'
import { cn } from '~/utils/helpers'
import ActionRow, { ActionProps } from '../ActionRow'

export interface SkyTableProps<T extends { key?: React.Key; createdAt?: string; updatedAt?: string }>
  extends TableProps<T> {
  metaData: ResponseDataType | undefined
  onPageChange?: (page: number, pageSize: number) => void
  isShowDeleted?: boolean
  editingKey: React.Key
  deletingKey: React.Key
  actions?: ActionProps<T>
  scrollTo?: number
  pageSize?: number
}

const SkyTable = <T extends { key?: React.Key; createdAt?: string; updatedAt?: string }>({
  ...props
}: SkyTableProps<T>) => {
  const tblRef: Parameters<typeof Table>[0]['ref'] = useRef(null)
  const [editKey, setEditKey] = useState<React.Key>('-1')
  // const [deleteKey, setDeleteKey] = useState<React.Key>('-1')
  const isEditing = (key?: React.Key): boolean => {
    return props.editingKey === key
  }

  // const isDeleting = (key?: React.Key): boolean => {
  //   return props.deletingKey === key
  // }

  useEffect(() => {
    if (props.scrollTo) {
      tblRef.current?.scrollTo({ index: props.scrollTo })
    }
  }, [props.scrollTo])

  const actionsCols: ColumnType<T> = {
    title: 'Operation',
    width: '1%',
    dataIndex: 'operation',
    render: (_value: any, record: T) => {
      return (
        <ActionRow
          isEditing={isEditing(record.key)}
          onAdd={{
            ...props.actions?.onAdd,
            onClick: (e) => props.actions?.onAdd?.onClick?.(e, record),
            disabled: props.actions?.onAdd?.disabled ?? isEditing(editKey),
            isShow: props.actions?.onAdd ? props.actions.onAdd.isShow ?? true : false
          }}
          onSave={{
            ...props.actions?.onSave,
            onClick: (e) => props.actions?.onSave?.onClick?.(e, record),
            disabled: props.actions?.onSave?.disabled ?? isEditing(editKey),
            isShow: props.actions?.onSave ? props.actions.onSave.isShow ?? true : false
          }}
          onEdit={{
            ...props.actions?.onEdit,
            onClick: (e) => {
              setEditKey(record.key!)
              props.actions?.onEdit?.onClick?.(e, record)
            },
            disabled: props.actions?.onEdit?.disabled ?? isEditing(editKey),
            isShow: props.actions?.onEdit ? props.actions.onEdit.isShow ?? true : false
          }}
          onDelete={{
            ...props.actions?.onDelete,
            onClick: (e) => {
              // setDeleteKey(record.key!)
              props.actions?.onDelete?.onClick?.(e, record)
            },
            disabled: props.actions?.onDelete?.disabled ?? isEditing(editKey),
            isShow: props.actions?.onDelete ? props.actions.onDelete.isShow ?? true : false
          }}
          onRestore={{
            ...props.actions?.onRestore,
            onClick: (e) => {
              // setDeleteKey(record.key!)
              props.actions?.onRestore?.onClick?.(e, record)
            },
            disabled: props.actions?.onRestore?.disabled ?? isEditing(editKey),
            isShow: props.actions?.onRestore ? props.actions.onRestore.isShow ?? true : false
          }}
          onConfirmCancelEditing={(e) => props.actions?.onConfirmCancelEditing?.(e)}
          onConfirmCancelDeleting={props.actions?.onConfirmCancelDeleting}
          onConfirmDelete={() => props.actions?.onConfirmDelete?.(record)}
          onConfirmRestore={() => props.actions?.onConfirmRestore?.(record)}
        />
      )
    }
  }

  const columns: ColumnsType<T> = props.columns
    ? props.actions?.isShow
      ? props.isShowDeleted
        ? [...props.columns, actionsCols]
        : [...props.columns, actionsCols]
      : props.isShowDeleted
        ? [...props.columns]
        : [...props.columns]
    : []

  return (
    <Table
      {...props}
      ref={tblRef}
      className={props.className}
      loading={props.loading}
      bordered
      columns={columns}
      dataSource={props.dataSource}
      rowClassName={cn('editable-row', props.rowClassName)}
      pagination={
        props.pagination ?? {
          onChange: props.onPageChange,
          current: props.metaData?.page,
          // pageSize: props.metaData?.pageSize
          //   ? props.metaData.pageSize !== -1
          //     ? props.metaData.pageSize
          //     : undefined
          //   : 10,
          pageSize: props.pageSize ?? defaultRequestBody.paginator?.pageSize,
          total: props.metaData?.total
        }
      }
      expandable={props.expandable}
    />
  )
}

export default SkyTable
