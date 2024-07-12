import { Checkbox, Flex, Space } from 'antd'
import { ColumnsType, ColumnType } from 'antd/es/table'
import { Dayjs } from 'dayjs'
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
import {
  booleanValidatorInit,
  breakpoint,
  dateTimeValidatorChange,
  dateTimeValidatorDisplay,
  dateValidatorChange,
  dateValidatorDisplay,
  dateValidatorInit,
  isValidObject,
  numberValidatorCalc,
  numberValidatorChange,
  numberValidatorDisplay,
  numberValidatorInit,
  textValidatorDisplay
} from '~/utils/helpers'
import CuttingGroupExpandableItemRow from './components/CuttingGroupExpandableItemRow'
import useCuttingGroupViewModel from './hooks/useCuttingGroupViewModel'
import { CuttingGroupTableDataType } from './type'

const SampleSewingPage = () => {
  useTitle('Cutting Group - Phung Nguyen')
  const viewModel = useCuttingGroupViewModel()
  const { width } = useDevice()

  const columns = {
    productCode: (record: CuttingGroupTableDataType) => {
      return (
        <Space direction='horizontal'>
          <SkyTableTypography strong status={record.status}>
            {textValidatorDisplay(record.productCode)}
          </SkyTableTypography>
          {viewModel.action.isChecked(record) && <SkyTableStatusItem>In thêu</SkyTableStatusItem>}
        </Space>
      )
    },
    productColor: (record: CuttingGroupTableDataType) => {
      return (
        <Flex className='' wrap='wrap' justify='space-between' align='center' gap={10}>
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
    },
    // Số lượng cắt còn lại
    remainingAmount: (record: CuttingGroupTableDataType) => {
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
    // In thêu
    embroidered: {
      dateSendEmbroidered: (record: CuttingGroupTableDataType) => {
        return (
          <EditableStateCell
            isEditing={viewModel.table.isEditing(record.key!)}
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
        const totalAmount = record.cuttingGroup
          ? numberValidatorCalc(record.cuttingGroup.quantityArrived1Th) +
            numberValidatorCalc(record.cuttingGroup.quantityArrived2Th) +
            numberValidatorCalc(record.cuttingGroup.quantityArrived3Th) +
            numberValidatorCalc(record.cuttingGroup.quantityArrived4Th) +
            numberValidatorCalc(record.cuttingGroup.quantityArrived5Th)
          : 0
        const total = numberValidatorCalc(record.quantityPO) - totalAmount
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
      }
    },
    // Bán thành phẩm
    btp: {
      // Số lượng giao BTP
      quantityDeliveredBTP: (record: CuttingGroupTableDataType) => {
        return (
          <EditableStateCell
            isEditing={viewModel.table.isEditing(record.key)}
            dataIndex='quantityDeliveredBTP'
            title='SL Giao BTP'
            inputType='number'
            required
            defaultValue={record.cuttingGroup ? record.cuttingGroup.quantityDeliveredBTP : ''}
            value={viewModel.state.newRecord && numberValidatorCalc(viewModel.state.newRecord?.quantityDeliveredBTP)}
            onValueChange={(val) =>
              viewModel.state.setNewRecord((prev) => {
                return { ...prev, quantityDeliveredBTP: val }
              })
            }
          >
            <SkyTableTypography>{numberValidatorDisplay(record.cuttingGroup?.quantityDeliveredBTP)}</SkyTableTypography>
          </EditableStateCell>
        )
      },
      // SL BTP Còn lại
      amountQuantityDeliveredBTP: (record: CuttingGroupTableDataType) => {
        const amountQuantityBTP =
          numberValidatorCalc(record.quantityPO) - numberValidatorCalc(record.cuttingGroup?.quantityDeliveredBTP)
        return (
          <EditableStateCell
            isEditing={false}
            dataIndex='amountQuantityDeliveredBTP'
            title='SL BTP Còn lại'
            inputType='number'
            required
          >
            <SkyTableTypography>{numberValidatorDisplay(amountQuantityBTP)}</SkyTableTypography>
          </EditableStateCell>
        )
      }
    },
    // In thêu về
    embroideringArrived: {
      th1: {
        quantityArrived: (record: CuttingGroupTableDataType) => {
          return (
            <EditableStateCell
              isEditing={viewModel.table.isEditing(record.key!)}
              dataIndex='quantityArrived'
              title='SL Về'
              inputType='number'
              required
              placeholder='Ví dụ: 500'
              defaultValue={numberValidatorInit(record.cuttingGroup?.quantityArrived1Th)}
              disabled={viewModel.action.isDisableRecord(record)}
              value={viewModel.state.newRecord?.quantityArrived1Th}
              onValueChange={(val) =>
                viewModel.state.setNewRecord((prev) => {
                  return { ...prev, quantityArrived1Th: numberValidatorChange(val) }
                })
              }
            >
              <SkyTableTypography disabled={viewModel.action.isDisableRecord(record)}>
                {numberValidatorDisplay(record.cuttingGroup?.quantityArrived1Th)}
              </SkyTableTypography>
            </EditableStateCell>
          )
        },
        dateArrived: (record: CuttingGroupTableDataType) => {
          return (
            <EditableStateCell
              isEditing={viewModel.table.isEditing(record.key!)}
              dataIndex='dateArrived'
              title='Ngày về'
              inputType='datepicker'
              required
              disabled={viewModel.action.isDisableRecord(record)}
              defaultValue={dateValidatorInit(record.cuttingGroup?.dateArrived1Th)}
              onValueChange={(val: Dayjs) =>
                viewModel.state.setNewRecord({
                  ...viewModel.state.newRecord,
                  dateArrived1Th: dateValidatorChange(val)
                })
              }
            >
              <SkyTableTypography disabled={viewModel.action.isDisableRecord(record)}>
                {dateValidatorDisplay(record.cuttingGroup?.dateArrived1Th)}
              </SkyTableTypography>
            </EditableStateCell>
          )
        }
      },
      th2: {
        quantityArrived: (record: CuttingGroupTableDataType) => {
          return (
            <EditableStateCell
              isEditing={viewModel.table.isEditing(record.key!)}
              dataIndex='quantityArrived'
              title='Thực cắt'
              inputType='number'
              required
              placeholder='Ví dụ: 500'
              disabled={viewModel.action.isDisableRecord(record)}
              defaultValue={numberValidatorInit(record.cuttingGroup?.quantityArrived2Th)}
              value={viewModel.state.newRecord?.quantityArrived2Th}
              onValueChange={(val) =>
                viewModel.state.setNewRecord((prev) => {
                  return { ...prev, quantityArrived2Th: numberValidatorChange(val) }
                })
              }
            >
              <SkyTableTypography disabled={viewModel.action.isDisableRecord(record)}>
                {numberValidatorDisplay(record.cuttingGroup?.quantityArrived2Th)}
              </SkyTableTypography>
            </EditableStateCell>
          )
        },
        dateArrived: (record: CuttingGroupTableDataType) => {
          return (
            <EditableStateCell
              isEditing={viewModel.table.isEditing(record.key!)}
              dataIndex='dateArrived'
              title='Ngày về'
              inputType='datepicker'
              required
              disabled={viewModel.action.isDisableRecord(record)}
              defaultValue={dateValidatorInit(record.cuttingGroup?.dateArrived2Th)}
              onValueChange={(val: Dayjs) =>
                viewModel.state.setNewRecord({
                  ...viewModel.state.newRecord,
                  dateArrived2Th: dateValidatorChange(val)
                })
              }
            >
              <SkyTableTypography disabled={viewModel.action.isDisableRecord(record)}>
                {dateValidatorDisplay(record.cuttingGroup?.dateArrived2Th)}
              </SkyTableTypography>
            </EditableStateCell>
          )
        }
      },
      th3: {
        quantityArrived: (record: CuttingGroupTableDataType) => {
          return (
            <EditableStateCell
              isEditing={viewModel.table.isEditing(record.key!)}
              dataIndex='quantityArrived'
              title='Thực cắt'
              inputType='number'
              required
              disabled={viewModel.action.isDisableRecord(record)}
              placeholder='Ví dụ: 500'
              defaultValue={numberValidatorInit(record.cuttingGroup?.quantityArrived3Th)}
              value={viewModel.state.newRecord?.quantityArrived3Th}
              onValueChange={(val) =>
                viewModel.state.setNewRecord((prev) => {
                  return { ...prev, quantityArrived3Th: numberValidatorChange(val) }
                })
              }
            >
              <SkyTableTypography disabled={viewModel.action.isDisableRecord(record)}>
                {numberValidatorDisplay(record.cuttingGroup?.quantityArrived3Th)}
              </SkyTableTypography>
            </EditableStateCell>
          )
        },
        dateArrived: (record: CuttingGroupTableDataType) => {
          return (
            <EditableStateCell
              isEditing={viewModel.table.isEditing(record.key!)}
              dataIndex='dateArrived'
              title='Ngày về'
              inputType='datepicker'
              required
              disabled={viewModel.action.isDisableRecord(record)}
              defaultValue={dateValidatorInit(record.cuttingGroup?.dateArrived3Th)}
              onValueChange={(val: Dayjs) =>
                viewModel.state.setNewRecord({
                  ...viewModel.state.newRecord,
                  dateArrived3Th: dateValidatorChange(val)
                })
              }
            >
              <SkyTableTypography disabled={viewModel.action.isDisableRecord(record)}>
                {dateValidatorDisplay(record.cuttingGroup?.dateArrived3Th)}
              </SkyTableTypography>
            </EditableStateCell>
          )
        }
      },
      th4: {
        quantityArrived: (record: CuttingGroupTableDataType) => {
          return (
            <EditableStateCell
              isEditing={viewModel.table.isEditing(record.key!)}
              dataIndex='quantityArrived'
              title='Thực cắt'
              inputType='number'
              required
              disabled={viewModel.action.isDisableRecord(record)}
              placeholder='Ví dụ: 500'
              defaultValue={numberValidatorInit(record.cuttingGroup?.quantityArrived4Th)}
              value={viewModel.state.newRecord?.quantityArrived4Th}
              onValueChange={(val) =>
                viewModel.state.setNewRecord((prev) => {
                  return { ...prev, quantityArrived4Th: numberValidatorChange(val) }
                })
              }
            >
              <SkyTableTypography disabled={viewModel.action.isDisableRecord(record)}>
                {numberValidatorDisplay(record.cuttingGroup?.quantityArrived4Th)}
              </SkyTableTypography>
            </EditableStateCell>
          )
        },
        dateArrived: (record: CuttingGroupTableDataType) => {
          return (
            <EditableStateCell
              isEditing={viewModel.table.isEditing(record.key!)}
              dataIndex='dateArrived'
              title='Ngày về'
              inputType='datepicker'
              required
              disabled={viewModel.action.isDisableRecord(record)}
              defaultValue={dateValidatorInit(record.cuttingGroup?.dateArrived4Th)}
              onValueChange={(val: Dayjs) =>
                viewModel.state.setNewRecord({
                  ...viewModel.state.newRecord,
                  dateArrived4Th: dateValidatorChange(val)
                })
              }
            >
              <SkyTableTypography disabled={viewModel.action.isDisableRecord(record)}>
                {dateValidatorDisplay(record.cuttingGroup?.dateArrived4Th)}
              </SkyTableTypography>
            </EditableStateCell>
          )
        }
      },
      th5: {
        quantityArrived: (record: CuttingGroupTableDataType) => {
          return (
            <EditableStateCell
              isEditing={viewModel.table.isEditing(record.key!)}
              dataIndex='quantityArrived'
              title='Thực cắt'
              inputType='number'
              required
              disabled={viewModel.action.isDisableRecord(record)}
              placeholder='Ví dụ: 500'
              defaultValue={numberValidatorInit(record.cuttingGroup?.quantityArrived5Th)}
              value={viewModel.state.newRecord?.quantityArrived5Th}
              onValueChange={(val) =>
                viewModel.state.setNewRecord((prev) => {
                  return { ...prev, quantityArrived5Th: numberValidatorChange(val) }
                })
              }
            >
              <SkyTableTypography disabled={viewModel.action.isDisableRecord(record)}>
                {numberValidatorDisplay(record.cuttingGroup?.quantityArrived5Th)}
              </SkyTableTypography>
            </EditableStateCell>
          )
        },
        dateArrived: (record: CuttingGroupTableDataType) => {
          return (
            <EditableStateCell
              isEditing={viewModel.table.isEditing(record.key!)}
              dataIndex='dateArrived'
              title='Ngày về'
              inputType='datepicker'
              required
              disabled={viewModel.action.isDisableRecord(record)}
              defaultValue={dateValidatorInit(record.cuttingGroup?.dateArrived5Th)}
              onValueChange={(val: Dayjs) =>
                viewModel.state.setNewRecord({
                  ...viewModel.state.newRecord,
                  dateArrived5Th: dateValidatorChange(val)
                })
              }
            >
              <SkyTableTypography disabled={viewModel.action.isDisableRecord(record)}>
                {dateValidatorDisplay(record.cuttingGroup?.dateArrived5Th)}
              </SkyTableTypography>
            </EditableStateCell>
          )
        }
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
                  ...record.cuttingGroup,
                  cuttingGroupID: isValidObject(record.cuttingGroup) ? record.cuttingGroup.id : null, // Using for compare check box
                  productColorID: isValidObject(record.productColor) ? record.productColor.colorID : null // Using for compare check box
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
      width: '12%',
      render: (_value: any, record: CuttingGroupTableDataType) => {
        return columns.productCode(record)
      }
    },
    {
      title: 'Màu',
      dataIndex: 'colorID',
      width: '10%',
      responsive: ['sm'],
      render: (_value: any, record: CuttingGroupTableDataType) => {
        return columns.productColor(record)
      }
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
      }
    },
    {
      title: 'SL thực cắt',
      dataIndex: 'quantityRealCut',
      width: '10%',
      responsive: ['lg'],
      render: (_value: any, record: CuttingGroupTableDataType) => {
        return columns.quantityRealCut(record)
      }
    },
    {
      title: 'SL còn lại (Cắt)',
      dataIndex: 'remainingAmount',
      width: '10%',
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
      }
    },
    {
      title: 'In thêu',
      responsive: ['xxl'],
      children: [
        {
          title: 'Ngày gửi in thêu',
          dataIndex: 'dateSendEmbroidered',
          width: '20%',
          render: (_value: any, record: CuttingGroupTableDataType) => {
            return columns.embroidered.dateSendEmbroidered(record)
          }
        },
        {
          title: 'SL in thêu còn lại',
          dataIndex: 'amountQuantityEmbroidered',
          width: '10%',
          render: (_value: any, record: CuttingGroupTableDataType) => {
            return columns.embroidered.amountQuantityEmbroidered(record)
          }
        },
        {
          title: 'In thêu?',
          dataIndex: 'syncStatus',
          width: '15%',
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

  return (
    <>
      <BaseLayout
        title='Tổ cắt'
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
            showAction: !viewModel.state.showDeleted
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
                      <SkyTableExpandableItemRow title='Số lượng PO:' isEditing={viewModel.table.isEditing(record.key)}>
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
                        <SkyTableExpandableItemRow title='In thêu?:' isEditing={viewModel.table.isEditing(record.key)}>
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
                          {columns.btp.quantityDeliveredBTP(record)}
                        </SkyTableExpandableItemRow>
                        <SkyTableExpandableItemRow
                          title='SL BTP còn lại:'
                          isEditing={viewModel.table.isEditing(record.key)}
                        >
                          {columns.btp.amountQuantityDeliveredBTP(record)}
                        </SkyTableExpandableItemRow>
                      </>
                    )}
                    <SkyTableExpandableLayout className='w-full flex-col md:flex-row'>
                      <SkyTableExpandableLayout>
                        <CuttingGroupExpandableItemRow
                          index={1}
                          disabled={viewModel.action.isDisableRecord(record)}
                          quantityArrivedRender={columns.embroideringArrived.th1.quantityArrived(record)}
                          dateArrivedRender={columns.embroideringArrived.th1.dateArrived(record)}
                        />
                        <CuttingGroupExpandableItemRow
                          index={2}
                          disabled={viewModel.action.isDisableRecord(record)}
                          quantityArrivedRender={columns.embroideringArrived.th2.quantityArrived(record)}
                          dateArrivedRender={columns.embroideringArrived.th2.dateArrived(record)}
                        />
                        <CuttingGroupExpandableItemRow
                          index={3}
                          disabled={viewModel.action.isDisableRecord(record)}
                          quantityArrivedRender={columns.embroideringArrived.th3.quantityArrived(record)}
                          dateArrivedRender={columns.embroideringArrived.th3.dateArrived(record)}
                        />
                        <CuttingGroupExpandableItemRow
                          index={4}
                          disabled={viewModel.action.isDisableRecord(record)}
                          quantityArrivedRender={columns.embroideringArrived.th4.quantityArrived(record)}
                          dateArrivedRender={columns.embroideringArrived.th4.dateArrived(record)}
                        />
                        <CuttingGroupExpandableItemRow
                          index={5}
                          disabled={viewModel.action.isDisableRecord(record)}
                          quantityArrivedRender={columns.embroideringArrived.th5.quantityArrived(record)}
                          dateArrivedRender={columns.embroideringArrived.th5.dateArrived(record)}
                        />
                      </SkyTableExpandableLayout>
                      {/* <SkyTableExpandableLayout>
                        <CuttingGroupExpandableItemRow
                          index={6}
                          isEditing
                          quantityArrivedRender={columns.embroideringArrived.th6.quantityArrived(record)}
                          dateArrivedRender={columns.embroideringArrived.th6.dateArrived(record)}
                        />
                        <CuttingGroupExpandableItemRow
                          index={7}
                          isEditing
                          quantityArrivedRender={columns.embroideringArrived.th7.quantityArrived(record)}
                          dateArrivedRender={columns.embroideringArrived.th7.dateArrived(record)}
                        />
                        <CuttingGroupExpandableItemRow
                          index={8}
                          isEditing
                          quantityArrivedRender={columns.embroideringArrived.th8.quantityArrived(record)}
                          dateArrivedRender={columns.embroideringArrived.th8.dateArrived(record)}
                        />
                        <CuttingGroupExpandableItemRow
                          index={9}
                          isEditing
                          quantityArrivedRender={columns.embroideringArrived.th9.quantityArrived(record)}
                          dateArrivedRender={columns.embroideringArrived.th9.dateArrived(record)}
                        />
                        <CuttingGroupExpandableItemRow
                          index={10}
                          isEditing
                          quantityArrivedRender={columns.embroideringArrived.th10.quantityArrived(record)}
                          dateArrivedRender={columns.embroideringArrived.th10.dateArrived(record)}
                        />
                      </SkyTableExpandableLayout> */}
                    </SkyTableExpandableLayout>
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
      </BaseLayout>
    </>
  )
}

export default SampleSewingPage
