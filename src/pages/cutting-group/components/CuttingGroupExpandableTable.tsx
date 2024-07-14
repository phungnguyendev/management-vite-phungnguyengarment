import { Collapse, Typography } from 'antd'
import type { ColumnsType, ColumnType } from 'antd/es/table'
import { Dayjs } from 'dayjs'
import React, { useState } from 'react'
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
import { ImportationExpandableTableDataType } from '../../importation/type'
import { CutGroupExpandableViewModelProps } from '../hooks/useCutGroupViewModel'
import { CutGroupEmbroideringTableDataType } from '../type'

interface CuttingGroupExpandableTableProps {
  showDeleted?: boolean
  viewModel: CutGroupExpandableViewModelProps
}

const CuttingGroupExpandableTable: React.FC<CuttingGroupExpandableTableProps> = ({ showDeleted, viewModel }) => {
  const [activeKey, setActiveKey] = useState<string | string[]>([])

  const columns = {
    quantityArrived: (record: CutGroupEmbroideringTableDataType) => {
      return (
        <EditableStateCell
          isEditing={viewModel.table.isEditing(record.key)}
          dataIndex='quantityArrived'
          title='SL in thêu về'
          inputType='number'
          required
          defaultValue={numberValidatorInit(record.quantityArrived)}
          value={viewModel.newRecord.quantityArrived}
          onValueChange={(val: number) =>
            viewModel.setNewRecord((prev) => {
              return { ...prev, quantityArrived: numberValidatorChange(val) }
            })
          }
        >
          <SkyTableTypography>{numberValidatorDisplay(record.quantityArrived)}</SkyTableTypography>
        </EditableStateCell>
      )
    },
    dateArrived: (record: CutGroupEmbroideringTableDataType) => {
      return (
        <EditableStateCell
          isEditing={viewModel.table.isEditing(record.key)}
          dataIndex='dateArrived'
          title='Ngày nhập'
          inputType='datepicker'
          required
          defaultValue={dateValidatorInit(record.dateArrived)}
          onValueChange={(val: Dayjs) =>
            viewModel.setNewRecord((prev) => {
              return { ...prev, dateArrived: dateValidatorChange(val) }
            })
          }
        >
          <SkyTableTypography>{dateValidatorDisplay(record.dateArrived)}</SkyTableTypography>
        </EditableStateCell>
      )
    },
    actionCol: (record: CutGroupEmbroideringTableDataType) => {
      return (
        <SkyTableActionRow
          record={record}
          addingKey={viewModel.table.addingKey.key}
          editingKey={viewModel.table.editingKey}
          deletingKey={viewModel.table.deletingKey}
          buttonEdit={{
            onClick: () => {
              viewModel.setNewRecord({ ...record, cuttingGroupID: record.id })
              viewModel.table.handleStartEditing(record.key)
            },
            isShow: !showDeleted
          }}
          buttonSave={{
            // Save
            onClick: () => viewModel.handleUpdate(record),
            isShow: true
          }}
          // Start delete
          buttonDelete={{
            onClick: () => viewModel.table.handleStartDeleting(record.key),
            isShow: !showDeleted
          }}
          // Cancel editing
          onConfirmCancelEditing={() => viewModel.table.handleCancelEditing()}
          // Cancel delete
          onConfirmCancelDeleting={() => viewModel.table.handleCancelDeleting()}
          // Delete (update status record => 'deleted')
          onConfirmDelete={() => viewModel.handleDelete(record)}
          // Cancel restore
        />
      )
    }
  }

  const tableColumns: ColumnsType<CutGroupEmbroideringTableDataType> = [
    {
      title: 'SL in thêu về',
      dataIndex: 'quantityArrived',
      render: (_value: any, record: CutGroupEmbroideringTableDataType) => {
        return columns.quantityArrived(record)
      }
    },
    {
      title: 'Ngày về',
      dataIndex: 'dateArrived',
      render: (_value: any, record: CutGroupEmbroideringTableDataType) => {
        return columns.dateArrived(record)
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
      <Collapse
        // ={viewModel.table.isEditing(record.key)}
        activeKey={activeKey}
        onChange={(key) => setActiveKey(key)}
        items={[
          {
            key: '1',
            label: (
              <Typography.Title className='m-0' level={5} type='secondary'>
                Danh sách in thêu về
              </Typography.Title>
            ),
            children: (
              <SkyTable
                size='small'
                loading={viewModel.table.loading}
                columns={tableColumns}
                tableColumns={{
                  columns: tableColumns,
                  actionColumn: actionCol,
                  showAction: !showDeleted
                }}
                dataSource={viewModel.table.dataSource}
                pagination={{ pageSize: 5 }}
              />
            )
          }
        ]}
      />
    </>
  )
}

export default CuttingGroupExpandableTable
