import { ColumnType } from 'antd/es/table'
import { Dayjs } from 'dayjs'
import React from 'react'
import { UseTableProps } from '~/components/hooks/useTable'
import EditableStateCell from '~/components/sky-ui/SkyTable/EditableStateCell'
import SkyTable from '~/components/sky-ui/SkyTable/SkyTable'
import SkyTableTypography from '~/components/sky-ui/SkyTable/SkyTableTypography'
import {
  dateValidatorChange,
  dateValidatorDisplay,
  dateValidatorInit,
  numberValidatorChange,
  numberValidatorDisplay,
  numberValidatorInit
} from '~/utils/helpers'
import { ImportationExpandableAddNewProps, ImportationExpandableTableDataType, ImportationTableDataType } from '../type'

interface Props {
  productRecord: ImportationTableDataType
  viewModelProps: {
    tableProps: UseTableProps<ImportationTableDataType>
    showDeleted: boolean
    newRecord: ImportationExpandableAddNewProps
    setNewRecord: React.Dispatch<React.SetStateAction<ImportationExpandableAddNewProps>>
    handleUpdate: (productRecord: ImportationTableDataType, record: ImportationExpandableTableDataType) => void
    handleDelete: (productRecord: ImportationTableDataType, record: ImportationExpandableTableDataType) => void
    handleDeleteForever: (productRecord: ImportationTableDataType, record: ImportationExpandableTableDataType) => void
    handleRestore: (record: ImportationExpandableTableDataType) => void
    handlePageChange: (page: number, pageSize: number) => void
  }
}

const ImportationTable: React.FC<Props> = ({ productRecord, viewModelProps }) => {
  const {
    tableProps,
    showDeleted,
    newRecord,
    setNewRecord,
    handleUpdate,
    handleDeleteForever,
    handleRestore,
    handlePageChange
  } = viewModelProps

  const columns = {
    quantity: (record: ImportationExpandableTableDataType) => {
      return (
        <EditableStateCell
          isEditing={tableProps.isEditing(record.key!)}
          dataIndex='quantity'
          title='Lô nhập'
          inputType='number'
          required
          initialValue={numberValidatorInit(record.quantity)}
          value={newRecord.quantity}
          onValueChange={(val: number) =>
            setNewRecord((prev) => {
              return { ...prev, quantity: numberValidatorChange(val) }
            })
          }
        >
          <SkyTableTypography status={record.status}>
            {numberValidatorDisplay(record.quantity)} (Kiện)
          </SkyTableTypography>
        </EditableStateCell>
      )
    },
    dateImported: (record: ImportationExpandableTableDataType) => {
      return (
        <EditableStateCell
          isEditing={tableProps.isEditing(record.key!)}
          dataIndex='dateImported'
          title='Ngày nhập'
          inputType='datepicker'
          required
          initialValue={dateValidatorInit(record.dateImported)}
          onValueChange={(val: Dayjs) =>
            setNewRecord((prev) => {
              return { ...prev, dateImported: dateValidatorChange(val) }
            })
          }
        >
          <SkyTableTypography status={record.status}>{dateValidatorDisplay(record.dateImported)}</SkyTableTypography>
        </EditableStateCell>
      )
    }
  }

  const tableColumns: ColumnType<ImportationExpandableTableDataType>[] = [
    {
      title: 'Lô nhập',
      dataIndex: 'quantityPO',
      render: (_value: any, record: ImportationExpandableTableDataType) => {
        return columns.quantity(record)
      }
    },
    {
      title: 'Ngày nhập',
      dataIndex: 'dateImportation',
      render: (_value: any, record: ImportationExpandableTableDataType) => {
        return columns.dateImported(record)
      }
    }
  ]

  return (
    <>
      <SkyTable
        bordered
        loading={tableProps.loading}
        columns={tableColumns}
        addingKey={tableProps.addingKey.key}
        editingKey={tableProps.editingKey}
        deletingKey={tableProps.deletingKey}
        dataSource={productRecord.expandableImportationTableDataTypes}
        rowClassName='editable-row'
        onPageChange={handlePageChange}
        isShowDeleted={showDeleted}
        pagination={{ pageSize: 5 }}
        actionProps={{
          onEdit: {
            handleClick: (record) => {
              setNewRecord({ ...record, productID: productRecord.id })
              tableProps.handleStartEditing(record.key)
            },
            isShow: !showDeleted
          },
          onSave: {
            handleClick: (record) => handleUpdate(productRecord, record)
          },
          onDelete: {
            handleClick: (record) => tableProps.handleStartDeleting(record.key),
            isShow: !showDeleted
          },
          onRestore: {
            handleClick: (record) => tableProps.handleStartRestore(record.key),
            isShow: showDeleted
          },
          onConfirmCancelEditing: () => tableProps.handleCancelEditing(),
          onConfirmCancelDeleting: () => tableProps.handleCancelDeleting(),
          onConfirmDelete: (record) => handleDeleteForever(productRecord, record),
          onConfirmCancelRestore: () => tableProps.handleCancelRestore(),
          onConfirmRestore: (record) => handleRestore(record),
          isShow: true
        }}
      />
    </>
  )
}

export default ImportationTable
