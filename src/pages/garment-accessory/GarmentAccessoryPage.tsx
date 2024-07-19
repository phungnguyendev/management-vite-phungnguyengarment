import { Checkbox, Flex, Space } from 'antd'
import { ColumnsType, ColumnType } from 'antd/es/table'
import { Dayjs } from 'dayjs'
import { useSelector } from 'react-redux'
import useDevice from '~/components/hooks/useDevice'
import useTitle from '~/components/hooks/useTitle'
import BaseLayout from '~/components/layout/BaseLayout'
import EditableStateCell from '~/components/sky-ui/SkyTable/EditableStateCell'
import SkyTable from '~/components/sky-ui/SkyTable/SkyTable'
import SkyTableActionRow from '~/components/sky-ui/SkyTable/SkyTableActionRow'
import SkyTableColorPicker from '~/components/sky-ui/SkyTable/SkyTableColorPicker'
import SkyTableExpandableItemRow from '~/components/sky-ui/SkyTable/SkyTableExpandableItemRow'
import SkyTableExpandableLayout from '~/components/sky-ui/SkyTable/SkyTableExpandableLayout'
import SkyTableIcon from '~/components/sky-ui/SkyTable/SkyTableIcon'
import SkyTableRowHighLightItem from '~/components/sky-ui/SkyTable/SkyTableRowHighLightItem'
import SkyTableTypography from '~/components/sky-ui/SkyTable/SkyTableTypography'
import SkyTableWrapperLayout from '~/components/sky-ui/SkyTable/SkyTableWrapperLayout'
import { RootState } from '~/store/store'
import { UserRoleType } from '~/typing'
import { dateFormatter } from '~/utils/date-formatter'
import {
  breakpoint,
  dateValidatorChange,
  dateValidatorDisplay,
  dateValidatorInit,
  handleFilterText,
  handleObjectFilterText,
  isAcceptRole,
  isValidArray,
  isValidObject,
  numberValidatorCalc,
  numberValidatorChange,
  numberValidatorDisplay,
  numberValidatorInit,
  textValidatorDisplay,
  uniqueArray
} from '~/utils/helpers'
import useGarmentAccessoryViewModel from './hooks/useGarmentAccessoryViewModel'
import { GarmentAccessoryTableDataType } from './type'

const PERMISSION_ACCESS_ROLE: UserRoleType[] = ['admin', 'accessory_manager']

const GarmentAccessoryPage = () => {
  useTitle('Garment Accessory | Phung Nguyen')
  const viewModel = useGarmentAccessoryViewModel()
  const currentUser = useSelector((state: RootState) => state.user)
  const { width } = useDevice()

  const columns = {
    productCode: (record: GarmentAccessoryTableDataType) => {
      return (
        <Space direction='horizontal' wrap>
          <SkyTableTypography strong status={record.status}>
            {textValidatorDisplay(record.productCode)}
          </SkyTableTypography>
          {viewModel.action.isShowStatusIcon(record) && <SkyTableIcon type='success' />}
        </Space>
      )
    },
    quantityPO: (record: GarmentAccessoryTableDataType) => {
      return <SkyTableTypography status={'active'}>{numberValidatorDisplay(record.quantityPO)}</SkyTableTypography>
    },
    productColor: (record: GarmentAccessoryTableDataType) => {
      return (
        <Flex justify='space-between' align='center' gap={10} wrap='wrap'>
          <SkyTableTypography status={record.productColor?.color?.status} className='w-fit'>
            {textValidatorDisplay(record.productColor?.color?.name)}
          </SkyTableTypography>
          <SkyTableColorPicker value={record.productColor?.color?.hexColor} disabled />
        </Flex>
      )
    },
    productGroup: (record: GarmentAccessoryTableDataType) => {
      return (
        <SkyTableTypography status={record.productGroup?.group?.status}>
          {textValidatorDisplay(record.productGroup?.group?.name)}
        </SkyTableTypography>
      )
    },
    syncStatus: (record: GarmentAccessoryTableDataType) => {
      return (
        <EditableStateCell
          isEditing={viewModel.table.isEditing(record.key!)}
          dataIndex='syncStatus'
          title='Đồng bộ PL'
          inputType='checkbox'
          required
          defaultValue={record.expandableGarmentAccessory?.syncStatus}
          value={viewModel.state.newRecord.syncStatus}
          onValueChange={(val: boolean) =>
            viewModel.state.setNewRecord({
              ...viewModel.state.newRecord,
              syncStatus: val
            })
          }
        >
          <Checkbox name='syncStatus' checked={record.expandableGarmentAccessory?.syncStatus} disabled />
        </EditableStateCell>
      )
    },
    passingDeliveryDate: (record: GarmentAccessoryTableDataType) => {
      return (
        <EditableStateCell
          isEditing={viewModel.table.isEditing(record.key!)}
          dataIndex='passingDeliveryDate'
          title='Giao chuyền'
          inputType='datepicker'
          required
          disabled={viewModel.action.isDisabledRecord(record)}
          defaultValue={dateValidatorInit(record.expandableGarmentAccessory?.passingDeliveryDate)}
          onValueChange={(val: Dayjs) =>
            viewModel.state.setNewRecord({
              ...viewModel.state.newRecord,
              passingDeliveryDate: dateValidatorChange(val)
            })
          }
        >
          <SkyTableTypography status={'active'} disabled={viewModel.action.isDisabledRecord(record)}>
            {dateValidatorDisplay(record.expandableGarmentAccessory?.passingDeliveryDate)}
          </SkyTableTypography>
        </EditableStateCell>
      )
    },
    remainingAmount: (record: GarmentAccessoryTableDataType) => {
      const amount = record.expandableGarmentAccessory?.amountCutting
        ? numberValidatorCalc(record.quantityPO) - numberValidatorCalc(record.expandableGarmentAccessory?.amountCutting)
        : 0
      return (
        <EditableStateCell
          dataIndex='remainingAmount'
          title='Còn lại'
          isEditing={viewModel.table.isEditing(record.key)}
          editableRender={
            <SkyTableTypography status={record.status} disabled={viewModel.table.isEditing(record.key)}>
              {numberValidatorDisplay(amount)}
            </SkyTableTypography>
          }
          disabled={viewModel.action.isDisabledRecord(record)}
          defaultValue={amount}
          inputType='number'
        >
          <SkyTableTypography status={'active'} disabled={viewModel.action.isDisabledRecord(record)}>
            {numberValidatorDisplay(amount)}
          </SkyTableTypography>
        </EditableStateCell>
      )
    },
    amountCutting: (record: GarmentAccessoryTableDataType) => {
      return (
        <EditableStateCell
          isEditing={viewModel.table.isEditing(record.key!)}
          dataIndex='amountCutting'
          title='Cắt được'
          inputType='number'
          placeholder='Ví dụ: 1000'
          required
          disabled={viewModel.action.isDisabledRecord(record)}
          defaultValue={numberValidatorInit(record.expandableGarmentAccessory?.amountCutting)}
          value={viewModel.state.newRecord.amountCutting}
          onValueChange={(val: number) =>
            viewModel.state.setNewRecord({
              ...viewModel.state.newRecord,
              amountCutting: numberValidatorChange(val > 0 ? val : 0)
            })
          }
        >
          <SkyTableTypography status={'active'} disabled={viewModel.action.isDisabledRecord(record)}>
            {numberValidatorDisplay(record.expandableGarmentAccessory?.amountCutting)}
          </SkyTableTypography>
        </EditableStateCell>
      )
    },
    accessoryNotes: (record: GarmentAccessoryTableDataType) => {
      const isDisable = viewModel.table.isEditing(record.key)
        ? isValidObject(record.expandableGarmentAccessory)
          ? viewModel.state.newRecord.syncStatus ?? true
          : true
        : true
      return (
        <>
          <EditableStateCell
            isEditing={viewModel.table.isEditing(record.key)}
            dataIndex='accessoryNotes'
            title='Ghi chú'
            inputType='multipleSelect'
            required
            // disabled={isDisable}
            defaultValue={record.expandableGarmentAccessory?.accessoryNotes?.map((item) => {
              return item.id
            })}
            selectProps={{
              options: viewModel.state.accessoryNotes.map((item) => {
                return {
                  value: item.id,
                  label: item.title
                }
              })
            }}
            onValueChange={(values: number[]) => {
              viewModel.state.setNewRecord({
                ...viewModel.state.newRecord,
                accessoryNoteIDs: values
              })
            }}
          >
            {isValidObject(record.expandableGarmentAccessory) &&
              isValidArray(record.expandableGarmentAccessory.accessoryNotes) && (
                <Space size='small' wrap>
                  {record.expandableGarmentAccessory.accessoryNotes.map((item, index) => {
                    return (
                      <SkyTableRowHighLightItem
                        key={index}
                        disabled={
                          isDisable &&
                          isValidObject(record.expandableGarmentAccessory) &&
                          record.expandableGarmentAccessory.syncStatus
                        }
                        status={item.status}
                      >
                        {item.title}
                      </SkyTableRowHighLightItem>
                    )
                  })}
                </Space>
              )}
          </EditableStateCell>
        </>
      )
    },
    actionCol: (record: GarmentAccessoryTableDataType) => {
      return (
        <SkyTableActionRow
          record={record}
          editingKey={viewModel.table.editingKey}
          deletingKey={viewModel.table.deletingKey}
          buttonEdit={{
            onClick: () => {
              if (isValidObject(record.expandableGarmentAccessory)) {
                viewModel.state.setNewRecord({
                  id: record.expandableGarmentAccessory?.id, // Using for compare check box
                  amountCutting: record.expandableGarmentAccessory?.amountCutting,
                  passingDeliveryDate: record.expandableGarmentAccessory?.passingDeliveryDate,
                  accessoryNoteIDs: record.expandableGarmentAccessory?.accessoryNotes?.map((item) => {
                    return item.id!
                  }),
                  syncStatus: record.expandableGarmentAccessory?.syncStatus,
                  notes: record.expandableGarmentAccessory.notes
                })
              }
              viewModel.table.handleStartEditing(record.key)
            },
            isShow: !viewModel.state.showDeleted
          }}
          buttonSave={{
            // Save
            onClick: () => viewModel.action.handleUpdate(record),
            isShow: true
          }}
          // Start delete
          buttonDelete={{
            onClick: () => viewModel.table.handleStartDeleting(record.key),
            isShow: !viewModel.state.showDeleted,
            disabled: !isValidObject(record.expandableGarmentAccessory)
          }}
          // Start delete forever
          buttonDeleteForever={{
            onClick: () => {},
            isShow: viewModel.state.showDeleted
          }}
          // Start restore
          buttonRestore={{
            onClick: () => viewModel.table.handleStartRestore(record.key),
            isShow: viewModel.state.showDeleted
          }}
          // Delete forever
          onConfirmDeleteForever={() => viewModel.action.handleDeleteForever(record)}
          // Cancel editing
          onConfirmCancelEditing={() => viewModel.table.handleCancelEditing()}
          // Cancel delete
          onConfirmCancelDeleting={() => viewModel.table.handleCancelDeleting()}
          // Delete (update status record => 'deleted')
          onConfirmDelete={() => viewModel.action.handleDeleteForever(record)}
          // Cancel restore
          onConfirmCancelRestore={() => viewModel.table.handleCancelRestore()}
          // Restore
          onConfirmRestore={() => viewModel.action.handleRestore(record)}
          // Show hide action col
        />
      )
    }
  }

  const tableColumns: ColumnsType<GarmentAccessoryTableDataType> = [
    {
      title: 'Mã hàng',
      dataIndex: 'productCode',
      width: '10%',
      render: (_value: any, record: GarmentAccessoryTableDataType) => {
        return columns.productCode(record)
      },
      filters: uniqueArray(
        viewModel.table.dataSource.map((item) => {
          return `${item.productCode}`
        })
      ).map((item) => {
        return {
          text: item,
          value: item
        }
      }),
      filterSearch: true,
      onFilter: (value, record) => handleFilterText(value, record.productCode)
    },
    {
      title: 'Màu',
      dataIndex: 'colorID',
      width: '10%',
      responsive: ['sm'],
      render: (_value: any, record: GarmentAccessoryTableDataType) => {
        return columns.productColor(record)
      },
      filters: viewModel.state.colors.map((item) => {
        return {
          text: `${item.name}`,
          value: `${item.id}`
        }
      }),
      filterSearch: true,
      onFilter: (value, record) => handleObjectFilterText(value, record.productColor, record.productColor?.colorID)
    },
    {
      title: 'Số lượng PO',
      dataIndex: 'quantityPO',
      width: '5%',
      responsive: ['md'],
      render: (_value: any, record: GarmentAccessoryTableDataType) => {
        return columns.quantityPO(record)
      }
    },
    {
      title: 'Nhóm',
      dataIndex: 'groupID',
      width: '5%',
      responsive: ['lg'],
      render: (_value: any, record: GarmentAccessoryTableDataType) => {
        return columns.productGroup(record)
      },
      filters: viewModel.state.groups.map((item) => {
        return {
          text: `${item.name}`,
          value: `${item.id}`
        }
      }),
      filterSearch: true,
      onFilter: (value, record) => handleObjectFilterText(value, record.productGroup, record.productGroup?.groupID)
    },
    {
      title: 'Đồng bộ PL',
      dataIndex: 'syncStatus',
      width: '5%',
      responsive: ['xl'],
      render: (_value: any, record: GarmentAccessoryTableDataType) => {
        return columns.syncStatus(record)
      }
    },
    {
      title: 'Cắt được',
      dataIndex: 'amountCutting',
      width: '7%',
      responsive: ['xxl'],
      render: (_value: any, record: GarmentAccessoryTableDataType) => {
        return columns.amountCutting(record)
      }
    },
    {
      title: 'Còn lại',
      dataIndex: 'remainingAmount',
      width: '7%',
      responsive: ['xxl'],
      render: (_value: any, record: GarmentAccessoryTableDataType) => {
        return columns.remainingAmount(record)
      }
    },
    {
      title: 'Ngày giao chuyền',
      dataIndex: 'passingDeliveryDate',
      width: '7%',
      responsive: ['xxl'],
      render: (_value: any, record: GarmentAccessoryTableDataType) => {
        return columns.passingDeliveryDate(record)
      },
      filters: uniqueArray(
        viewModel.table.dataSource.map((item) => {
          return dateFormatter(item.expandableGarmentAccessory?.passingDeliveryDate, 'dateOnly')
        })
      ).map((item) => {
        return {
          text: item,
          value: item
        }
      }),
      filterSearch: true,
      onFilter: (value, record) =>
        handleObjectFilterText(
          value,
          record.expandableGarmentAccessory,
          dateFormatter(record.expandableGarmentAccessory?.passingDeliveryDate, 'dateOnly')
        )
    },
    {
      title: 'Phụ liệu còn thiếu',
      dataIndex: 'accessoryNotes',
      width: '15%',
      responsive: ['lg'],
      render: (_value: any, record: GarmentAccessoryTableDataType) => {
        return columns.accessoryNotes(record)
      }
    }
  ]

  const expandableColumns = {
    amountCutting: (record: GarmentAccessoryTableDataType) => {
      return columns.amountCutting(record)
    },
    remainingAmount: (record: GarmentAccessoryTableDataType) => {
      return columns.remainingAmount(record)
    },
    passingDeliveryDate: (record: GarmentAccessoryTableDataType) => {
      return columns.passingDeliveryDate(record)
    },
    syncStatus: (record: GarmentAccessoryTableDataType) => {
      return columns.syncStatus(record)
    },
    accessoryNotes: (record: GarmentAccessoryTableDataType) => {
      return columns.accessoryNotes(record)
    }
  }

  const actionCol: ColumnType<GarmentAccessoryTableDataType> = {
    title: 'Operation',
    width: '0.001%',
    render: (_value: any, record: GarmentAccessoryTableDataType) => {
      return columns.actionCol(record)
    }
  }

  return (
    <>
      <BaseLayout title='Nguyên phụ liệu'>
        <SkyTableWrapperLayout
          loading={viewModel.table.loading}
          searchProps={{
            onSearch: viewModel.action.handleSearch,
            placeholder: 'Mã hàng..'
          }}
          sortProps={{
            onChange: viewModel.action.handleSwitchSortChange
          }}
          deleteProps={{
            onChange: viewModel.action.handleSwitchDeleteChange
          }}
        >
          <SkyTable
            loading={viewModel.table.loading}
            tableColumns={{
              columns: tableColumns,
              actionColumn: actionCol,
              showAction: !viewModel.state.showDeleted && isAcceptRole(PERMISSION_ACCESS_ROLE, currentUser.roles)
            }}
            dataSource={viewModel.table.dataSource}
            pagination={{
              pageSize: viewModel.table.paginator.pageSize,
              current: viewModel.table.paginator.page,
              onChange: viewModel.action.handlePageChange
            }}
            expandable={{
              expandedRowRender: (record) => {
                return (
                  <SkyTableExpandableLayout>
                    {!(width >= breakpoint.md) && (
                      <SkyTableExpandableItemRow title='Số lượng PO:' isEditing={false}>
                        {columns.quantityPO(record)}
                      </SkyTableExpandableItemRow>
                    )}
                    {!(width >= breakpoint.sm) && (
                      <SkyTableExpandableItemRow title='Màu:' isEditing={false}>
                        {columns.productColor(record)}
                      </SkyTableExpandableItemRow>
                    )}
                    {!(width >= breakpoint.lg) && (
                      <SkyTableExpandableItemRow title='Nhóm:' isEditing={false}>
                        {columns.productGroup(record)}
                      </SkyTableExpandableItemRow>
                    )}
                    {!(width >= breakpoint.xl) && (
                      <SkyTableExpandableItemRow title='Đồng bộ PL:' isEditing={viewModel.table.isEditing(record.key)}>
                        {expandableColumns.syncStatus(record)}
                      </SkyTableExpandableItemRow>
                    )}
                    {!(width >= breakpoint.xxl) && (
                      <>
                        <SkyTableExpandableItemRow title='Cắt được:' isEditing={viewModel.table.isEditing(record.key)}>
                          {expandableColumns.amountCutting(record)}
                        </SkyTableExpandableItemRow>
                        <SkyTableExpandableItemRow title='Còn lại:' isEditing={viewModel.table.isEditing(record.key)}>
                          {expandableColumns.remainingAmount(record)}
                        </SkyTableExpandableItemRow>
                      </>
                    )}
                    {!(width >= breakpoint.xxl) && (
                      <SkyTableExpandableItemRow
                        title='Ngày giao chuyền:'
                        isEditing={viewModel.table.isEditing(record.key)}
                      >
                        {expandableColumns.passingDeliveryDate(record)}
                      </SkyTableExpandableItemRow>
                    )}
                    {!(width >= breakpoint.lg) && (
                      <SkyTableExpandableItemRow
                        title='Phụ liệu còn thiếu:'
                        isEditing={viewModel.table.isEditing(record.key)}
                      >
                        {expandableColumns.accessoryNotes(record)}
                      </SkyTableExpandableItemRow>
                    )}
                  </SkyTableExpandableLayout>
                )
              },
              columnWidth: '0.001%',
              showExpandColumn: !(width >= breakpoint.xxl),
              onExpand: (expanded, record: GarmentAccessoryTableDataType) =>
                viewModel.table.handleStartExpanding(expanded, record.key),
              expandedRowKeys: viewModel.table.expandingKeys
            }}
          />
        </SkyTableWrapperLayout>
      </BaseLayout>
    </>
  )
}

export default GarmentAccessoryPage
