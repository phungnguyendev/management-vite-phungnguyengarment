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
import SkyTableRemainingAmount from '~/components/sky-ui/SkyTable/SkyTableRemainingAmount'
import SkyTableTypography from '~/components/sky-ui/SkyTable/SkyTableTypography'
import SkyTableWrapperLayout from '~/components/sky-ui/SkyTable/SkyTableWrapperLayout'
import { RootState } from '~/store/store'
import { UserRoleType } from '~/typing'
import { dateFormatter } from '~/utils/date-formatter'
import {
  booleanValidatorInit,
  breakpoint,
  dateValidatorChange,
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
import CuttingGroupExpandableList from './components/CuttingGroupExpandableList'
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
          {viewModel.action.isShowStatusIcon(record) && <SkyTableIcon type='success' />}
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
      return <SkyTableTypography>{numberValidatorDisplay(record.quantityPO)}</SkyTableTypography>
    },
    productGroup: (record: CuttingGroupTableDataType) => {
      return (
        <SkyTableTypography status={record.productGroup?.group?.status}>
          {textValidatorDisplay(record.productGroup?.group?.name)}
        </SkyTableTypography>
      )
    },
    quantityRealCut: (record: CuttingGroupTableDataType) => {
      return (
        <EditableStateCell
          isEditing={viewModel.table.isEditing(record.key)}
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
    dateTimeCut: (record: CuttingGroupTableDataType) => {
      return (
        <EditableStateCell
          isEditing={viewModel.table.isEditing(record.key)}
          dataIndex='dateTimeCut'
          title='Ngày giờ cắt'
          inputType='dateTimePicker'
          required
          defaultValue={dateValidatorInit(record.cuttingGroup?.dateTimeCut)}
          onValueChange={(val: Dayjs) =>
            viewModel.state.setNewRecord((prev) => {
              return { ...prev, dateTimeCut: dateFormatter(val, 'dateTime') }
            })
          }
        >
          <SkyTableTypography>{textValidatorDisplay(record.cuttingGroup?.dateTimeCut)}</SkyTableTypography>
        </EditableStateCell>
      )
    },
    // Số lượng cắt còn lại
    remainingAmount: (record: CuttingGroupTableDataType) => {
      const totalAmount =
        numberValidatorCalc(record.quantityPO) - numberValidatorCalc(record.cuttingGroup?.quantityRealCut)
      return <SkyTableRemainingAmount totalAmount={totalAmount} />
    },
    // In thêu
    embroidered: {
      dateSendEmbroidered: (record: CuttingGroupTableDataType) => {
        return (
          <EditableStateCell
            isEditing={viewModel.table.isEditing(record.key)}
            dataIndex='dateSendEmbroidered'
            title='Ngày gửi in thêu'
            inputType='datepicker'
            required
            disabled={viewModel.action.isDisableRecord(record)}
            defaultValue={dateValidatorInit(record.cuttingGroup?.dateSendEmbroidered)}
            onValueChange={(val: Dayjs) =>
              viewModel.state.setNewRecord({
                ...viewModel.state.newRecord,
                dateSendEmbroidered: dateValidatorChange(val)
              })
            }
          >
            <SkyTableTypography disabled={viewModel.action.isDisableRecord(record)}>
              {dateValidatorDisplay(record.cuttingGroup?.dateSendEmbroidered)}
            </SkyTableTypography>
          </EditableStateCell>
        )
      },
      // SL in thêu còn lại
      amountQuantityEmbroidered: (record: CuttingGroupTableDataType) => {
        const sumQuantityArrivedAmount =
          numberValidatorCalc(record.cuttingGroup?.quantityArrived1Th) +
          numberValidatorCalc(record.cuttingGroup?.quantityArrived2Th) +
          numberValidatorCalc(record.cuttingGroup?.quantityArrived3Th) +
          numberValidatorCalc(record.cuttingGroup?.quantityArrived4Th) +
          numberValidatorCalc(record.cuttingGroup?.quantityArrived5Th) +
          numberValidatorCalc(record.cuttingGroup?.quantityArrived6Th) +
          numberValidatorCalc(record.cuttingGroup?.quantityArrived7Th) +
          numberValidatorCalc(record.cuttingGroup?.quantityArrived8Th) +
          numberValidatorCalc(record.cuttingGroup?.quantityArrived9Th) +
          numberValidatorCalc(record.cuttingGroup?.quantityArrived10Th)
        const total = numberValidatorCalc(record.quantityPO) - sumQuantityArrivedAmount
        return (
          <EditableStateCell
            dataIndex='amountQuantityEmbroidered'
            title='SL In thêu còn lại'
            isEditing={viewModel.table.isEditing(record.key)}
            editableRender={
              <SkyTableTypography disabled={viewModel.action.isDisableRecord(record)}>{total}</SkyTableTypography>
            }
            disabled={viewModel.action.isDisableRecord(record)}
            defaultValue={total}
            inputType='number'
          >
            <SkyTableTypography disabled={viewModel.action.isDisableRecord(record)}>
              {numberValidatorDisplay(total)}
            </SkyTableTypography>
          </EditableStateCell>
        )
      },
      // Có in thêu hay không
      syncStatus: (record: CuttingGroupTableDataType) => {
        return (
          <EditableStateCell
            isEditing={viewModel.table.isEditing(record.key)}
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
      }
    },
    // Bán thành phẩm
    btp: {
      // Số lượng giao BTP
      quantitySendDeliveredBTP: (record: CuttingGroupTableDataType) => {
        return (
          <EditableStateCell
            isEditing={viewModel.table.isEditing(record.key)}
            dataIndex='quantitySendDeliveredBTP'
            title='SL Giao BTP'
            inputType='number'
            required
            defaultValue={record.cuttingGroup ? record.cuttingGroup.quantitySendDeliveredBTP : ''}
            value={
              viewModel.state.newRecord && numberValidatorCalc(viewModel.state.newRecord?.quantitySendDeliveredBTP)
            }
            onValueChange={(val) =>
              viewModel.state.setNewRecord((prev) => {
                return { ...prev, quantitySendDeliveredBTP: val }
              })
            }
          >
            <SkyTableTypography>
              {numberValidatorDisplay(record.cuttingGroup?.quantitySendDeliveredBTP)}
            </SkyTableTypography>
          </EditableStateCell>
        )
      },
      // SL BTP Còn lại
      amountQuantityDeliveredBTP: (record: CuttingGroupTableDataType) => {
        const amountQuantityBTP =
          numberValidatorCalc(record.quantityPO) - numberValidatorCalc(record.cuttingGroup?.quantitySendDeliveredBTP)
        return (
          <EditableStateCell
            isEditing={false}
            dataIndex='amountQuantityDeliveredBTP'
            title='SL BTP Còn lại'
            inputType='number'
            required
          >
            <SkyTableTypography>
              {numberValidatorDisplay(amountQuantityBTP < 0 ? amountQuantityBTP * -1 : amountQuantityBTP)}{' '}
              <span>{amountQuantityBTP < 0 && '(Dư)'}</span>
            </SkyTableTypography>
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
          // Cancel editing
          onConfirmCancelEditing={() => viewModel.table.handleCancelEditing()}
          // Cancel delete
          onConfirmCancelDeleting={() => viewModel.table.handleCancelDeleting()}
          // Delete (update status record => 'deleted')
          onConfirmDelete={() => viewModel.action.handleDeleteForever(record)}
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
      width: '7%',
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
      title: 'Cắt',
      children: [
        {
          title: 'SL thực cắt',
          dataIndex: 'quantityRealCut',
          width: '7%',
          responsive: ['lg'],
          render: (_value: any, record: CuttingGroupTableDataType) => {
            return columns.quantityRealCut(record)
          }
        },
        {
          title: 'SL cắt còn lại',
          dataIndex: 'remainingAmount',
          width: '7%',
          responsive: ['lg'],
          render: (_value: any, record: CuttingGroupTableDataType) => {
            return columns.remainingAmount(record)
          }
        },
        {
          title: 'Ngày giờ cắt',
          dataIndex: 'dateTimeCut',
          width: '15%',
          responsive: ['xl'],
          render: (_value: any, record: CuttingGroupTableDataType) => {
            return columns.dateTimeCut(record)
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
          title: 'Ngày gửi in thêu',
          dataIndex: 'dateSendEmbroidered',
          width: '15%',
          render: (_value: any, record: CuttingGroupTableDataType) => {
            return columns.embroidered.dateSendEmbroidered(record)
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
          dataIndex: 'amountQuantityEmbroidered',
          width: '7%',
          render: (_value: any, record: CuttingGroupTableDataType) => {
            return columns.embroidered.amountQuantityEmbroidered(record)
          }
        },
        {
          title: 'In thêu?',
          dataIndex: 'syncStatus',
          width: '7%',
          render: (_value: any, record: CuttingGroupTableDataType) => {
            return columns.embroidered.syncStatus(record)
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

  // const filterItems: FilterItemDataType[] = [
  //   {
  //     label: 'Colors',
  //     render: () => {
  //       return (
  //         <EditableFormCell
  //           isEditing
  //           dataIndex='colorIDs'
  //           inputType='multipleSelect'
  //           placeholder='Select color'
  //           selectProps={{
  //             options: viewModel.state.colors.map((item, index) => {
  //               return {
  //                 key: `${item.hexColor}-${index}`,
  //                 label: `${item.name}`,
  //                 value: item.id
  //               }
  //             })
  //           }}
  //         />
  //       )
  //     }
  //   },
  //   {
  //     label: 'Groups',
  //     render: () => {
  //       return (
  //         <EditableFormCell
  //           isEditing
  //           dataIndex='groupIDs'
  //           inputType='multipleSelect'
  //           placeholder='Select group'
  //           selectProps={{
  //             options: viewModel.state.groups.map((item, index) => {
  //               return {
  //                 key: `${index}`,
  //                 label: `${item.name}`,
  //                 value: item.id
  //               }
  //             })
  //           }}
  //         />
  //       )
  //     }
  //   },
  //   {
  //     label: 'Ngày giờ cắt',
  //     render: () => {
  //       return (
  //         <EditableFormCell
  //           isEditing
  //           dataIndex='dateTimeCut'
  //           inputType='dateTimePicker'
  //           placeholder={`Ví dụ: ${dateFormatter(Date.now())}`}
  //         />
  //       )
  //     }
  //   }
  // ]

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
          // filterProps={{
          //   items: filterItems,
          //   onApply: viewModel.action.handleFiltered,
          //   onClose: () => {}
          // }}
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
                            {columns.quantityRealCut(record)}
                          </SkyTableExpandableItemRow>
                          <SkyTableExpandableItemRow
                            title='SL còn lại (Cắt):'
                            isEditing={viewModel.table.isEditing(record.key)}
                          >
                            {columns.remainingAmount(record)}
                          </SkyTableExpandableItemRow>
                        </>
                      )}
                      {!(width >= breakpoint.xl) && (
                        <SkyTableExpandableItemRow
                          title='Ngày giờ cắt:'
                          isEditing={viewModel.table.isEditing(record.key)}
                        >
                          {columns.dateTimeCut(record)}
                        </SkyTableExpandableItemRow>
                      )}
                      {!(width >= breakpoint.xxl) && (
                        <>
                          <SkyTableExpandableItemRow
                            title='Ngày gửi in thêu:'
                            isEditing={viewModel.table.isEditing(record.key)}
                          >
                            {columns.embroidered.dateSendEmbroidered(record)}
                          </SkyTableExpandableItemRow>
                          <SkyTableExpandableItemRow
                            title='SL in thêu còn lại:'
                            isEditing={viewModel.table.isEditing(record.key)}
                          >
                            {columns.embroidered.amountQuantityEmbroidered(record)}
                          </SkyTableExpandableItemRow>
                          <SkyTableExpandableItemRow
                            title='In thêu?:'
                            isEditing={viewModel.table.isEditing(record.key)}
                          >
                            {columns.embroidered.syncStatus(record)}
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
                            {columns.btp.amountQuantityDeliveredBTP(record)}
                          </SkyTableExpandableItemRow>
                        </>
                      )}
                      <CuttingGroupExpandableList
                        isEditing={viewModel.table.isEditing(record.key)}
                        disabled={viewModel.action.isDisableRecord(record)}
                        record={record}
                        newRecord={viewModel.state.newRecord}
                        setNewRecord={viewModel.state.setNewRecord}
                      />
                    </SkyTableExpandableLayout>
                  </>
                )
              },
              columnWidth: '0.001%',
              onExpand: (expanded, record: CuttingGroupTableDataType) =>
                viewModel.table.handleStartExpanding(expanded, record.key),
              expandedRowKeys: viewModel.table.expandingKeys
            }}
          />
        </SkyTableWrapperLayout>
      </BaseLayout>
    </>
  )
}

export default SampleSewingPage
