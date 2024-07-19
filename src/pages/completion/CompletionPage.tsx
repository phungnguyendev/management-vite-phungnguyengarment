import { Flex, Space } from 'antd'
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
import SkyTableRemainingAmount from '~/components/sky-ui/SkyTable/SkyTableRemainingAmount'
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
  isValidNumber,
  isValidObject,
  numberValidatorCalc,
  numberValidatorChange,
  numberValidatorDisplay,
  numberValidatorInit,
  textValidatorDisplay,
  uniqueArray
} from '~/utils/helpers'
import CompletionProgressItem from './components/CompletionProgressItem'
import useCompletionViewModel from './hooks/useCompletionViewModel'
import { CompletionTableDataType } from './type'

const PERMISSION_ACCESS_ROLE: UserRoleType[] = ['admin', 'completion_manager']

const FinishPage = () => {
  useTitle('Hoàn thành - Phung Nguyen')
  const viewModel = useCompletionViewModel()
  const currentUser = useSelector((state: RootState) => state.user)
  const { width } = useDevice()

  const columns = {
    productCode: (record: CompletionTableDataType) => {
      return (
        <Space size={2} direction='horizontal' wrap>
          <SkyTableTypography strong status={record.status}>
            {textValidatorDisplay(record.productCode)}{' '}
            {viewModel.action.isShowStatusIcon(record) && (
              <SkyTableIcon type={viewModel.action.statusIconType(record)} />
            )}
          </SkyTableTypography>
        </Space>
      )
    },
    quantityPO: (record: CompletionTableDataType) => {
      return (
        <EditableStateCell isEditing={false} dataIndex='quantityPO' title='Số lượng PO' inputType='number' required>
          <SkyTableTypography status={'active'}>{numberValidatorDisplay(record.quantityPO)}</SkyTableTypography>
        </EditableStateCell>
      )
    },
    productColor: (record: CompletionTableDataType) => {
      return (
        <EditableStateCell isEditing={false} dataIndex='colorID' title='Màu' inputType='colorSelector' required={false}>
          <Flex className='' wrap='wrap' justify='space-between' align='center' gap={10}>
            <SkyTableTypography status={record.productColor?.color?.status} className='w-fit'>
              {textValidatorDisplay(record.productColor?.color?.name)}
            </SkyTableTypography>
            <SkyTableColorPicker value={record.productColor?.color?.hexColor} disabled />
          </Flex>
        </EditableStateCell>
      )
    },
    productGroup: (record: CompletionTableDataType) => {
      return (
        <SkyTableTypography status={record.productGroup?.group?.status}>
          {textValidatorDisplay(record.productGroup?.group?.name)}
        </SkyTableTypography>
      )
    },
    ironed: {
      quantityIroned: (record: CompletionTableDataType) => {
        return (
          <EditableStateCell
            isEditing={viewModel.table.isEditing(record.key)}
            dataIndex='quantityIroned'
            title='SL ủi được'
            inputType='number'
            required
            placeholder='Ví dụ: 1000'
            defaultValue={numberValidatorInit(record.completion?.quantityIroned)}
            value={viewModel.state.newRecord?.quantityIroned}
            onValueChange={(val: number) =>
              viewModel.state.setNewRecord((prev) => {
                return { ...prev, quantityIroned: numberValidatorChange(val) }
              })
            }
          >
            <SkyTableTypography>{numberValidatorDisplay(record.completion?.quantityIroned)}</SkyTableTypography>
          </EditableStateCell>
        )
      },
      remainingAmount: (record: CompletionTableDataType) => {
        const amount =
          isValidObject(record.completion) && isValidNumber(record.completion.quantityIroned)
            ? numberValidatorCalc(record.quantityPO) - numberValidatorCalc(record.completion.quantityIroned)
            : numberValidatorCalc(record.quantityPO)

        return <SkyTableRemainingAmount totalAmount={amount} />
      }
    },
    checkPass: {
      quantityCheckPassed: (record: CompletionTableDataType) => {
        return (
          <EditableStateCell
            isEditing={viewModel.table.isEditing(record.key)}
            dataIndex='quantityCheckPassed'
            title='SL kiểm đạt'
            inputType='number'
            required
            placeholder='Ví dụ: 1000'
            defaultValue={numberValidatorInit(record.completion?.quantityCheckPassed)}
            value={viewModel.state.newRecord?.quantityCheckPassed}
            onValueChange={(val: number) =>
              viewModel.state.setNewRecord((prev) => {
                return { ...prev, quantityCheckPassed: numberValidatorChange(val) }
              })
            }
          >
            <SkyTableTypography>{numberValidatorDisplay(record.completion?.quantityCheckPassed)}</SkyTableTypography>
          </EditableStateCell>
        )
      },
      remainingAmount: (record: CompletionTableDataType) => {
        const amount =
          isValidObject(record.completion) && isValidNumber(record.completion.quantityCheckPassed)
            ? numberValidatorCalc(record.quantityPO) - numberValidatorCalc(record.completion.quantityCheckPassed)
            : numberValidatorCalc(record.quantityPO)
        return <SkyTableRemainingAmount totalAmount={amount} />
      }
    },
    packaged: {
      quantityPackaged: (record: CompletionTableDataType) => {
        return (
          <EditableStateCell
            isEditing={viewModel.table.isEditing(record.key)}
            dataIndex='quantityPackaged'
            title='SL đóng gói'
            inputType='number'
            required
            placeholder='Ví dụ: 1000'
            defaultValue={numberValidatorInit(record.completion?.quantityPackaged)}
            value={viewModel.state.newRecord?.quantityPackaged}
            onValueChange={(val: number) =>
              viewModel.state.setNewRecord((prev) => {
                return { ...prev, quantityPackaged: numberValidatorChange(val) }
              })
            }
          >
            <SkyTableTypography status={record.completion?.status}>
              {numberValidatorDisplay(record.completion?.quantityPackaged)}
            </SkyTableTypography>
          </EditableStateCell>
        )
      },
      remainingAmount: (record: CompletionTableDataType) => {
        const amount =
          isValidObject(record.completion) && isValidNumber(record.completion.quantityPackaged)
            ? numberValidatorCalc(record.quantityPO) - numberValidatorCalc(record.completion.quantityPackaged)
            : numberValidatorCalc(record.quantityPO)
        return <SkyTableRemainingAmount totalAmount={amount} />
      }
    },
    exportedDate: (record: CompletionTableDataType) => {
      return (
        <EditableStateCell
          isEditing={viewModel.table.isEditing(record.key!)}
          dataIndex='exportedDate'
          title='Ngày xuất hàng'
          inputType='datepicker'
          required
          defaultValue={dateValidatorInit(record.completion?.exportedDate)}
          onValueChange={(val: Dayjs) =>
            viewModel.state.setNewRecord({
              ...viewModel.state.newRecord,
              exportedDate: dateValidatorChange(val)
            })
          }
        >
          <SkyTableTypography>{dateValidatorDisplay(record.completion?.exportedDate)}</SkyTableTypography>
        </EditableStateCell>
      )
    },
    passFIDate: (record: CompletionTableDataType) => {
      return (
        <EditableStateCell
          isEditing={viewModel.table.isEditing(record.key!)}
          dataIndex='passFIDate'
          title='Pass FI'
          inputType='datepicker'
          required
          defaultValue={dateValidatorInit(record.completion?.passFIDate)}
          onValueChange={(val: Dayjs) =>
            viewModel.state.setNewRecord({
              ...viewModel.state.newRecord,
              passFIDate: dateValidatorChange(val)
            })
          }
        >
          <SkyTableTypography>{dateValidatorDisplay(record.completion?.passFIDate)}</SkyTableTypography>
        </EditableStateCell>
      )
    },
    actionCol: (record: CompletionTableDataType) => {
      return (
        <SkyTableActionRow
          record={record}
          editingKey={viewModel.table.editingKey}
          deletingKey={viewModel.table.deletingKey}
          buttonEdit={{
            onClick: () => {
              if (isValidObject(record.completion)) {
                viewModel.state.setNewRecord({
                  ...record.completion
                })
              }
              viewModel.table.handleStartEditing(record.key)
            },
            isShow: !viewModel.state.showDeleted
          }}
          buttonSave={{
            // Save
            onClick: () => viewModel.action.handleUpdate(record),
            isShow: !viewModel.state.showDeleted
          }}
          // Start delete
          buttonDelete={{
            onClick: () => viewModel.table.handleStartDeleting(record.key),
            isShow: !viewModel.state.showDeleted,
            disabled: !isValidObject(record.completion)
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
          onConfirmRestore={() => viewModel.action.handleRestore()}
          // Show hide action col
        />
      )
    }
  }

  const tableColumns: ColumnsType<CompletionTableDataType> = [
    {
      title: 'Mã hàng',
      dataIndex: 'productCode',
      width: '10%',
      render: (_value: any, record: CompletionTableDataType) => {
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
      render: (_value: any, record: CompletionTableDataType) => {
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
      width: '10%',
      responsive: ['sm'],
      render: (_value: any, record: CompletionTableDataType) => {
        return columns.quantityPO(record)
      }
    },
    {
      title: 'Nhóm',
      dataIndex: 'groupID',
      width: '7%',
      responsive: ['xl'],
      render: (_value: any, record: CompletionTableDataType) => {
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
      title: 'Ủi',
      responsive: ['xxl'],
      children: [
        {
          title: 'SL ủi được',
          dataIndex: 'quantityIroned',
          width: '7%',
          render: (_value: any, record: CompletionTableDataType) => {
            return columns.ironed.quantityIroned(record)
          }
        },
        {
          title: 'Còn lại',
          dataIndex: 'remainingAmount',
          width: '7%',
          render: (_value: any, record: CompletionTableDataType) => {
            return columns.ironed.remainingAmount(record)
          }
        }
      ]
    },
    {
      title: 'Kiểm',
      responsive: ['xxl'],
      children: [
        {
          title: 'SL kiểm đạt',
          dataIndex: 'quantityCheckPassed',
          width: '7%',
          render: (_value: any, record: CompletionTableDataType) => {
            return columns.checkPass.quantityCheckPassed(record)
          }
        },
        {
          title: 'Còn lại',
          dataIndex: 'remainingAmount',
          width: '7%',
          render: (_value: any, record: CompletionTableDataType) => {
            return columns.checkPass.remainingAmount(record)
          }
        }
      ]
    },
    {
      title: 'Đóng gói',
      responsive: ['xxl'],
      children: [
        {
          title: 'SL đóng được',
          dataIndex: 'quantityCheckPassed',
          width: '7%',
          render: (_value: any, record: CompletionTableDataType) => {
            return columns.packaged.quantityPackaged(record)
          }
        },
        {
          title: 'Còn lại',
          dataIndex: 'remainingAmount',
          width: '7%',
          render: (_value: any, record: CompletionTableDataType) => {
            return columns.packaged.remainingAmount(record)
          }
        }
      ]
    },
    {
      title: 'Ngày xuất hàng',
      dataIndex: 'exportedDate',
      responsive: ['xl'],
      width: '10%',
      render: (_value: any, record: CompletionTableDataType) => {
        return columns.exportedDate(record)
      },
      filters: uniqueArray(
        viewModel.table.dataSource.map((item) => {
          return dateFormatter(item.completion?.exportedDate, 'dateOnly')
        })
      ).map((item) => {
        return {
          text: item,
          value: item
        }
      }),
      filterSearch: true,
      onFilter: (value, record) => handleFilterText(value, dateFormatter(record.completion?.exportedDate, 'dateOnly'))
    },
    {
      title: 'Pass FI',
      dataIndex: 'passFIDate',
      responsive: ['xl'],
      width: '10%',
      render: (_value: any, record: CompletionTableDataType) => {
        return columns.passFIDate(record)
      },
      filters: uniqueArray(
        viewModel.table.dataSource.map((item) => {
          return dateFormatter(item.completion?.passFIDate, 'dateOnly')
        })
      ).map((item) => {
        return {
          text: item,
          value: item
        }
      }),
      filterSearch: true,
      onFilter: (value, record) => handleFilterText(value, dateFormatter(record.completion?.passFIDate, 'dateOnly'))
    }
  ]

  const actionCol: ColumnType<CompletionTableDataType> = {
    title: 'Operation',
    width: '0.001%',
    render: (_value: any, record: CompletionTableDataType) => {
      return columns.actionCol(record)
    }
  }

  return (
    <>
      <BaseLayout title='Hoàn thành'>
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
            bordered
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
                    {!(width >= breakpoint.sm) && (
                      <SkyTableExpandableItemRow title='Màu:' isEditing={viewModel.table.isEditing(record.key)}>
                        {columns.productColor(record)}
                      </SkyTableExpandableItemRow>
                    )}
                    {!(width >= breakpoint.xl) && (
                      <SkyTableExpandableItemRow title='Nhóm:' isEditing={viewModel.table.isEditing(record.key)}>
                        {columns.productGroup(record)}
                      </SkyTableExpandableItemRow>
                    )}
                    {!(width >= breakpoint.xl) && (
                      <SkyTableExpandableItemRow title='Pass FI:' isEditing={viewModel.table.isEditing(record.key)}>
                        {columns.passFIDate(record)}
                      </SkyTableExpandableItemRow>
                    )}
                    {!(width >= breakpoint.xl) && (
                      <SkyTableExpandableItemRow title='Ngày xuất:' isEditing={viewModel.table.isEditing(record.key)}>
                        {columns.exportedDate(record)}
                      </SkyTableExpandableItemRow>
                    )}
                    {!(width >= breakpoint.xxl) && (
                      <CompletionProgressItem
                        title='Ủi'
                        isEditing={viewModel.table.isEditing(record.key)}
                        top={{
                          title: 'Ủi được:',
                          children: columns.ironed.quantityIroned(record)
                        }}
                        bottom={{
                          title: 'Còn lại:',
                          children: columns.ironed.remainingAmount(record)
                        }}
                      />
                    )}
                    {!(width >= breakpoint.xxl) && (
                      <CompletionProgressItem
                        title='Kiểm'
                        isEditing={viewModel.table.isEditing(record.key)}
                        top={{
                          title: 'Kiểm đạt:',
                          children: columns.checkPass.quantityCheckPassed(record)
                        }}
                        bottom={{
                          title: 'Còn lại:',
                          children: columns.checkPass.remainingAmount(record)
                        }}
                      />
                    )}
                    {!(width >= breakpoint.xxl) && (
                      <CompletionProgressItem
                        title='Đóng gói'
                        isEditing={viewModel.table.isEditing(record.key)}
                        top={{
                          title: 'Đóng được:',
                          children: columns.packaged.quantityPackaged(record)
                        }}
                        bottom={{
                          title: 'Còn lại:',
                          children: columns.packaged.remainingAmount(record)
                        }}
                      />
                    )}
                  </SkyTableExpandableLayout>
                )
              },
              columnWidth: '0.001%',
              showExpandColumn: !(width >= breakpoint.xxl)
            }}
          />
        </SkyTableWrapperLayout>
      </BaseLayout>
    </>
  )
}

export default FinishPage
