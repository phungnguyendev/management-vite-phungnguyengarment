import type { ColumnsType, ColumnType } from 'antd/es/table'
import { Dayjs } from 'dayjs'
import React from 'react'
import { UseTableProps } from '~/components/hooks/useTable'
import EditableStateCell from '~/components/sky-ui/SkyTable/EditableStateCell'
import SkyTable from '~/components/sky-ui/SkyTable/SkyTable'
import SkyTableActionRow from '~/components/sky-ui/SkyTable/SkyTableActionRow'
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
  permissionAcceptRole: boolean
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

const ImportationTable: React.FC<Props> = ({ permissionAcceptRole, productRecord, viewModelProps }) => {
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
          defaultValue={numberValidatorInit(record.quantity)}
          value={newRecord.quantity}
          onValueChange={(val: number) =>
            setNewRecord((prev) => {
              return { ...prev, quantity: numberValidatorChange(val) }
            })
          }
          inputNumberProps={{
            addonAfter: 'Kiện'
          }}
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
          defaultValue={dateValidatorInit(record.dateImported)}
          onValueChange={(val: Dayjs) =>
            setNewRecord((prev) => {
              return { ...prev, dateImported: dateValidatorChange(val) }
            })
          }
        >
          <SkyTableTypography status={record.status}>{dateValidatorDisplay(record.dateImported)}</SkyTableTypography>
        </EditableStateCell>
      )
    },
    actionCol: (record: ImportationExpandableTableDataType) => {
      return (
        <SkyTableActionRow
          record={record}
          addingKey={tableProps.addingKey.key}
          editingKey={tableProps.editingKey}
          deletingKey={tableProps.deletingKey}
          buttonEdit={{
            onClick: () => {
              setNewRecord({ ...record, productID: productRecord.id })
              tableProps.handleStartEditing(record.key)
            },
            isShow: !showDeleted
          }}
          buttonSave={{
            // Save
            onClick: () => handleUpdate(productRecord, record),
            isShow: true
          }}
          // Start delete
          buttonDelete={{
            onClick: () => tableProps.handleStartDeleting(record.key),
            isShow: !showDeleted
          }}
          // Cancel editing
          onConfirmCancelEditing={() => tableProps.handleCancelEditing()}
          // Cancel delete
          onConfirmCancelDeleting={() => tableProps.handleCancelDeleting()}
          // Delete (update status record => 'deleted')
          onConfirmDelete={() => handleDeleteForever(productRecord, record)}
          // Cancel restore
          onConfirmCancelRestore={() => tableProps.handleCancelRestore()}
          // Restore
          onConfirmRestore={() => handleRestore(record)}
          // Show hide action col
        />
      )
    }
  }

  const tableColumns: ColumnsType<ImportationExpandableTableDataType> = [
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

  const actionCol: ColumnType<ImportationExpandableTableDataType> = {
    title: 'Operation',
    width: '0.001%',
    render: (_value: any, record: ImportationExpandableTableDataType) => {
      return columns.actionCol(record)
    }
  }

  return (
    <>
      <SkyTable
        size='small'
        loading={tableProps.loading}
        columns={tableColumns}
        tableColumns={{
          columns: tableColumns,
          actionColumn: actionCol,
          showAction: !showDeleted && permissionAcceptRole
        }}
        dataSource={productRecord.expandableImportationTableDataTypes}
        pagination={{ pageSize: 5, onChange: handlePageChange }}
      />
    </>
  )
}

export default ImportationTable
