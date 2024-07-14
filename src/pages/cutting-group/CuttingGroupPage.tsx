import { Checkbox, Flex, Space } from 'antd'
import { ColumnsType, ColumnType } from 'antd/es/table'
import dayjs, { Dayjs } from 'dayjs'
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
import SkyTableStatusItem from '~/components/sky-ui/SkyTable/SkyTableStatusItem'
import SkyTableTypography from '~/components/sky-ui/SkyTable/SkyTableTypography'
import SkyTableWrapperLayout from '~/components/sky-ui/SkyTable/SkyTableWrapperLayout'
import { RootState } from '~/store/store'
import { UserRoleType } from '~/typing'
import { dateFormatter } from '~/utils/date-formatter'
import {
  booleanValidatorInit,
  breakpoint,
  dateTimeValidatorChange,
  dateTimeValidatorDisplay,
  dateValidatorDisplay,
  dateValidatorInit,
  handleFilterText,
  handleObjectFilterText,
  isAcceptRole,
  isValidObject,
  numberValidatorCalc,
  numberValidatorChange,
  numberValidatorDisplay,
  numberValidatorInit,
  textValidatorDisplay,
  uniqueArray
} from '~/utils/helpers'
import CuttingGroupExpandableTable from './components/CuttingGroupExpandableTable'
import ModalAddNewCutGroupEmbroidered from './components/ModalAddNewCutGroupEmbroidered'
import useCuttingGroupViewModel from './hooks/useCuttingGroupViewModel'
import { CuttingGroupTableDataType } from './type'

const PERMISSION_ACCESS_ROLE: UserRoleType[] = ['admin', 'cutting_group_manager']

const SampleSewingPage = () => {
  useTitle('Cutting Group - Phung Nguyen')
  const viewModel = useCuttingGroupViewModel()

  const currentUser = useSelector((state: RootState) => state.user)
  const { width } = useDevice()

  const columns = {
    productCode: (record: CuttingGroupTableDataType) => {
      return (
        <Space direction='horizontal' wrap>
          <SkyTableTypography strong status={record.status}>
            {textValidatorDisplay(record.productCode)}
          </SkyTableTypography>
          {viewModel.action.isChecked(record) && <SkyTableStatusItem>In thêu</SkyTableStatusItem>}
        </Space>
      )
    },
    productColor: (record: CuttingGroupTableDataType) => {
      return (
        <Flex wrap='wrap' justify='space-between' align='center' gap={10}>
          <SkyTableTypography status={record.productColor?.color?.status} className='w-fit'>
            {textValidatorDisplay(record.productColor?.color?.name)}
          </SkyTableTypography>
          <SkyTableColorPicker value={record.productColor?.color?.hexColor} disabled />
        </Flex>
      )
    },
    quantityPO: (record: CuttingGroupTableDataType) => {
      return <SkyTableTypography status={'active'}>{numberValidatorDisplay(record.quantityPO)}</SkyTableTypography>
    },
    productGroup: (record: CuttingGroupTableDataType) => {
      return (
        <SkyTableTypography status={record.productGroup?.group?.status}>
          {textValidatorDisplay(record.productGroup?.group?.name)}
        </SkyTableTypography>
      )
    },
    cut: {
      quantityRealCut: (record: CuttingGroupTableDataType) => {
        return (
          <EditableStateCell
            isEditing={viewModel.table.isEditing(record.key!)}
            dataIndex='quantityRealCut'
            title='Thực cắt'
            inputType='number'
            required
            placeholder='Ví dụ: 1000'
            defaultValue={numberValidatorInit(record.cuttingGroup?.quantityRealCut)}
            value={viewModel.state.newRecord?.quantityRealCut}
            onValueChange={(val: number) =>
              viewModel.state.setNewRecord((prev) => {
                return { ...prev, quantityRealCut: numberValidatorChange(val) }
              })
            }
          >
            <SkyTableTypography>{numberValidatorDisplay(record.cuttingGroup?.quantityRealCut)}</SkyTableTypography>
          </EditableStateCell>
        )
      },
      // Số lượng cắt còn lại
      remainingCuttingAmount: (record: CuttingGroupTableDataType) => {
        const totalAmount = (record.quantityPO ?? 0) - (record.cuttingGroup?.quantityRealCut ?? 0)
        return (
          <EditableStateCell isEditing={false} dataIndex='remainingAmount' title='Còn lại' inputType='number'>
            <SkyTableTypography>
              {numberValidatorDisplay(totalAmount < 0 ? totalAmount * -1 : totalAmount)}{' '}
              <span>{totalAmount < 0 && '(Dư)'}</span>
            </SkyTableTypography>
          </EditableStateCell>
        )
      },
      // Ngày giờ cắt
      dateTimeCut: (record: CuttingGroupTableDataType) => {
        return (
          <EditableStateCell
            isEditing={viewModel.table.isEditing(record.key!)}
            dataIndex='dateTimeCut'
            title='Ngày giờ cắt'
            inputType='dateTimePicker'
            required
            defaultValue={dateValidatorInit(record.cuttingGroup?.dateTimeCut)}
            onValueChange={(val: Dayjs) =>
              viewModel.state.setNewRecord((prev) => {
                return { ...prev, dateTimeCut: dateTimeValidatorChange(val) }
              })
            }
          >
            <SkyTableTypography>{dateTimeValidatorDisplay(record.cuttingGroup?.dateTimeCut)}</SkyTableTypography>
          </EditableStateCell>
        )
      }
    },
    embroidering: {
      // Có in thêu hay không
      syncStatus: (record: CuttingGroupTableDataType) => {
        return (
          <EditableStateCell
            isEditing={viewModel.table.isEditing(record.key!)}
            dataIndex='syncStatus'
            title='Option'
            inputType='checkbox'
            required
            defaultValue={booleanValidatorInit(record.cuttingGroup?.syncStatus)}
            value={viewModel.state.newRecord?.syncStatus}
            onValueChange={(val: boolean) =>
              viewModel.state.setNewRecord({
                ...viewModel.state.newRecord,
                syncStatus: val
              })
            }
          >
            <Checkbox name='syncStatus' checked={record.cuttingGroup?.syncStatus} disabled />
          </EditableStateCell>
        )
      },
      // Ngày gửi in thêu
      dateSendEmbroidered: (record: CuttingGroupTableDataType) => {
        return (
          <EditableStateCell
            isEditing={viewModel.table.isEditing(record.key!)}
            dataIndex='dateSendEmbroidered'
            title='Ngày gửi in thêu'
            inputType='datepicker'
            required
            defaultValue={dateValidatorInit(record.cuttingGroup?.dateSendEmbroidered)}
            onValueChange={(val: Dayjs) =>
              viewModel.state.setNewRecord((prev) => {
                return { ...prev, dateSendEmbroidered: dateTimeValidatorChange(val) }
              })
            }
          >
            <SkyTableTypography>
              {dateTimeValidatorDisplay(record.cuttingGroup?.dateSendEmbroidered)}
            </SkyTableTypography>
          </EditableStateCell>
        )
      },
      // SL in thêu còn lại
      remainingEmbroideredAmount: (record: CuttingGroupTableDataType) => {
        return <SkyTableTypography>{numberValidatorDisplay(record.quantityPO)}</SkyTableTypography>
      }
    },
    // Bán thành phẩm
    btp: {
      // Số lượng giao BTP
      quantitySendDeliveredBTP: (record: CuttingGroupTableDataType) => {
        return (
          <EditableStateCell
            isEditing={viewModel.table.isEditing(record.key)}
            dataIndex='quantityDeliveredBTP'
            title='SL Giao BTP'
            inputType='number'
            required
            defaultValue={numberValidatorInit(record.cuttingGroup?.quantitySendDeliveredBTP)}
            value={
              viewModel.state.newRecord && numberValidatorCalc(viewModel.state.newRecord?.quantitySendDeliveredBTP)
            }
            onValueChange={(val) =>
              viewModel.state.setNewRecord((prev) => {
                return { ...prev, quantityDeliveredBTP: val }
              })
            }
          >
            <SkyTableTypography>
              {numberValidatorDisplay(record.cuttingGroup?.quantitySendDeliveredBTP)}
            </SkyTableTypography>
          </EditableStateCell>
        )
      },
      // Ngày giao BTP
      dateSendDeliveredBTP: (record: CuttingGroupTableDataType) => {
        return (
          <EditableStateCell
            isEditing={viewModel.table.isEditing(record.key)}
            dataIndex='dateSendDeliveredBTP'
            title='Ngày giao BTP'
            inputType='number'
            required
            defaultValue={dateValidatorInit(record.cuttingGroup?.dateSendDeliveredBTP)}
            onValueChange={(val: dayjs.Dayjs) =>
              viewModel.state.setNewRecord((prev) => {
                return { ...prev, dateSendDeliveredBTP: dateTimeValidatorChange(val) }
              })
            }
          >
            <SkyTableTypography>{dateValidatorDisplay(record.cuttingGroup?.dateSendDeliveredBTP)}</SkyTableTypography>
          </EditableStateCell>
        )
      },
      // SL BTP Còn lại
      remainingDeliveredBTPAmount: (record: CuttingGroupTableDataType) => {
        const amountQuantityBTP =
          numberValidatorCalc(record.quantityPO) - numberValidatorCalc(record.cuttingGroup?.quantitySendDeliveredBTP)
        return (
          <EditableStateCell
            isEditing={false}
            dataIndex='remainingDeliveredBTPAmount'
            title='SL BTP còn lại'
            inputType='number'
            required
          >
            <SkyTableTypography>{numberValidatorDisplay(amountQuantityBTP)}</SkyTableTypography>
          </EditableStateCell>
        )
      }
    },
    actionCol: (record: CuttingGroupTableDataType) => {
      return (
        <SkyTableActionRow
          record={record}
          editingKey={viewModel.table.editingKey}
          deletingKey={viewModel.table.deletingKey}
          buttonAdd={{
            onClick: () => {
              viewModel.expandableViewModel.setNewRecord({ cuttingGroupID: record.cuttingGroup?.id })
              viewModel.state.setOpenModal(true)
              viewModel.table.handleStartAdding(`${record.productCode}`, record)
            },
            title: 'New',
            type: 'primary'
          }}
          buttonEdit={{
            onClick: () => {
              if (isValidObject(record.cuttingGroup)) {
                viewModel.state.setNewRecord({
                  ...record.cuttingGroup
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
            disabled: !isValidObject(record.cuttingGroup)
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

  const tableColumns: ColumnsType<CuttingGroupTableDataType> = [
    {
      title: 'Mã hàng',
      dataIndex: 'productCode',
      width: '10%',
      render: (_value: any, record: CuttingGroupTableDataType) => {
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
      render: (_value: any, record: CuttingGroupTableDataType) => {
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
      responsive: ['md'],
      render: (_value: any, record: CuttingGroupTableDataType) => {
        return columns.quantityPO(record)
      }
    },
    {
      title: 'Nhóm',
      dataIndex: 'groupID',
      width: '7%',
      responsive: ['xl'],
      render: (_value: any, record: CuttingGroupTableDataType) => {
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
      title: 'Tổ cắt',
      children: [
        {
          title: 'SL thực cắt',
          dataIndex: 'quantityRealCut',
          width: '10%',
          render: (_value: any, record: CuttingGroupTableDataType) => {
            return columns.cut.quantityRealCut(record)
          }
        },
        {
          title: 'SL cắt còn lại',
          dataIndex: 'remainingCuttingAmount',
          width: '7%',
          render: (_value: any, record: CuttingGroupTableDataType) => {
            return columns.cut.remainingCuttingAmount(record)
          }
        },
        {
          title: 'Ngày giờ cắt',
          dataIndex: 'dateTimeCut',
          width: '12%',
          render: (_value: any, record: CuttingGroupTableDataType) => {
            return columns.cut.dateTimeCut(record)
          },
          filters: uniqueArray(
            viewModel.table.dataSource.map((item) => {
              return dateFormatter(item.cuttingGroup?.dateTimeCut, 'dateTime')
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
              record.cuttingGroup,
              dateFormatter(record.cuttingGroup?.dateTimeCut, 'dateTime')
            )
        }
      ]
    },
    {
      title: 'In thêu',
      responsive: ['xxl'],
      children: [
        {
          title: 'In thêu?',
          dataIndex: 'syncStatus',
          width: '7%',
          render: (_value: any, record: CuttingGroupTableDataType) => {
            return columns.embroidering.syncStatus(record)
          }
        },
        {
          title: 'Ngày gửi in thêu',
          dataIndex: 'dateSendEmbroidered',
          width: '15%',
          render: (_value: any, record: CuttingGroupTableDataType) => {
            return columns.embroidering.dateSendEmbroidered(record)
          },
          filters: uniqueArray(
            viewModel.table.dataSource.map((item) => {
              return dateFormatter(item.cuttingGroup?.dateSendEmbroidered, 'dateOnly')
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
              record.cuttingGroup,
              dateFormatter(record.cuttingGroup?.dateSendEmbroidered, 'dateOnly')
            )
        },
        {
          title: 'SL in thêu còn lại',
          dataIndex: 'remainingEmbroideredAmount',
          width: '7%',
          render: (_value: any, record: CuttingGroupTableDataType) => {
            return columns.embroidering.remainingEmbroideredAmount(record)
          }
        }
      ]
    }
  ]

  const actionCol: ColumnType<CuttingGroupTableDataType> = {
    title: 'Operation',
    width: '0.001%',
    render: (_value: any, record: CuttingGroupTableDataType) => {
      return columns.actionCol(record)
    }
  }

  return (
    <>
      <BaseLayout title='Tổ cắt'>
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
                  <>
                    <SkyTableExpandableLayout>
                      {!(width >= breakpoint.sm) && (
                        <SkyTableExpandableItemRow title='Màu:' isEditing={viewModel.table.isEditing(record.key)}>
                          {columns.productColor(record)}
                        </SkyTableExpandableItemRow>
                      )}
                      {!(width >= breakpoint.md) && (
                        <SkyTableExpandableItemRow
                          title='Số lượng PO:'
                          isEditing={viewModel.table.isEditing(record.key)}
                        >
                          {columns.quantityPO(record)}
                        </SkyTableExpandableItemRow>
                      )}
                      {!(width >= breakpoint.xl) && (
                        <SkyTableExpandableItemRow title='Nhóm:' isEditing={viewModel.table.isEditing(`${record.id}`)}>
                          {columns.productGroup(record)}
                        </SkyTableExpandableItemRow>
                      )}
                      {!(width >= breakpoint.lg) && (
                        <>
                          <SkyTableExpandableItemRow
                            title='SL thực cắt:'
                            isEditing={viewModel.table.isEditing(record.key)}
                          >
                            {columns.cut.quantityRealCut(record)}
                          </SkyTableExpandableItemRow>
                          <SkyTableExpandableItemRow
                            title='SL còn lại (Cắt):'
                            isEditing={viewModel.table.isEditing(record.key)}
                          >
                            {columns.cut.remainingCuttingAmount(record)}
                          </SkyTableExpandableItemRow>
                        </>
                      )}
                      {!(width >= breakpoint.xl) && (
                        <SkyTableExpandableItemRow
                          title='Ngày giờ cắt:'
                          isEditing={viewModel.table.isEditing(record.key)}
                        >
                          {columns.cut.dateTimeCut(record)}
                        </SkyTableExpandableItemRow>
                      )}
                      {!(width >= breakpoint.xxl) && (
                        <>
                          <SkyTableExpandableItemRow
                            title='In thêu?:'
                            isEditing={viewModel.table.isEditing(record.key)}
                          >
                            {columns.embroidering.syncStatus(record)}
                          </SkyTableExpandableItemRow>
                          <SkyTableExpandableItemRow
                            title='Ngày gửi in thêu:'
                            isEditing={viewModel.table.isEditing(record.key)}
                          >
                            {columns.embroidering.dateSendEmbroidered(record)}
                          </SkyTableExpandableItemRow>
                          <SkyTableExpandableItemRow
                            title='SL in thêu còn lại:'
                            isEditing={viewModel.table.isEditing(record.key)}
                          >
                            {columns.embroidering.remainingEmbroideredAmount(record)}
                          </SkyTableExpandableItemRow>
                        </>
                      )}
                      {!(width >= breakpoint.xxl) && (
                        <>
                          <SkyTableExpandableItemRow
                            title='SL giao BTP:'
                            isEditing={viewModel.table.isEditing(record.key)}
                          >
                            {columns.btp.quantitySendDeliveredBTP(record)}
                          </SkyTableExpandableItemRow>
                          <SkyTableExpandableItemRow
                            title='SL BTP còn lại:'
                            isEditing={viewModel.table.isEditing(record.key)}
                          >
                            {columns.btp.remainingDeliveredBTPAmount(record)}
                          </SkyTableExpandableItemRow>
                        </>
                      )}
                      <CuttingGroupExpandableTable
                        viewModel={viewModel.expandableViewModel}
                        showDeleted={viewModel.state.showDeleted}
                      />
                    </SkyTableExpandableLayout>
                  </>
                )
              },
              columnWidth: '0.001%'
              // onExpand: (expanded, record: CuttingGroupTableDataType) =>
              //   viewModel.table.handleStartExpanding(expanded, record.key),
              // expandedRowKeys: viewModel.table.expandingKeys
            }}
          />
        </SkyTableWrapperLayout>
        {viewModel.state.openModal && (
          <ModalAddNewCutGroupEmbroidered
            onAddNew={viewModel.expandableViewModel.handleAddNew}
            open={viewModel.state.openModal}
            setOpenModal={viewModel.state.setOpenModal}
          />
        )}
      </BaseLayout>
    </>
  )
}

export default SampleSewingPage
