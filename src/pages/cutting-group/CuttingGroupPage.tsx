import { Checkbox, ColorPicker, Divider, Flex, Space } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { Dayjs } from 'dayjs'
import useDevice from '~/components/hooks/useDevice'
import useTitle from '~/components/hooks/useTitle'
import BaseLayout from '~/components/layout/BaseLayout'
import EditableStateCell from '~/components/sky-ui/SkyTable/EditableStateCell'
import ExpandableItemRow from '~/components/sky-ui/SkyTable/ExpandableItemRow'
import SkyTable from '~/components/sky-ui/SkyTable/SkyTable'
import SkyTableTypography from '~/components/sky-ui/SkyTable/SkyTableTypography'
import {
  breakpoint,
  dateTimeValidatorDisplay,
  dateValidatorChange,
  dateValidatorDisplay,
  dateValidatorInit,
  numberValidatorCalc,
  numberValidatorChange,
  numberValidatorDisplay,
  numberValidatorInit,
  textValidatorDisplay
} from '~/utils/helpers'
import useCuttingGroupViewModel from './hooks/useCuttingGroupViewModel'
import { CuttingGroupTableDataType } from './type'

const SampleSewingPage = () => {
  useTitle('Người dùng - Phung Nguyen')
  const { state, action, table } = useCuttingGroupViewModel()
  const { newRecord, setNewRecord, showDeleted, setShowDeleted, searchTextChange, setSearchTextChange } = state
  const {
    handleUpdate,
    handleDelete,
    handleDeleteForever,
    handlePageChange,
    handleRestore,
    handleSearch,
    handleSortChange
  } = action
  const { width } = useDevice()

  const columns = {
    productCode: (record: CuttingGroupTableDataType) => {
      return (
        <EditableStateCell isEditing={false} dataIndex='productCode' title='Mã hàng' inputType='text' required>
          <SkyTableTypography strong status={record.status}>
            {textValidatorDisplay(record.productCode)}
          </SkyTableTypography>
        </EditableStateCell>
      )
    },
    productColor: (record: CuttingGroupTableDataType) => {
      return (
        <EditableStateCell isEditing={false} dataIndex='colorID' title='Màu' inputType='colorselector' required={false}>
          <Flex className='' wrap='wrap' justify='space-between' align='center' gap={10}>
            <SkyTableTypography status={record.productColor?.color?.status} className='w-fit'>
              {textValidatorDisplay(record.productColor?.color?.name)}
            </SkyTableTypography>
            {record.productColor && (
              <ColorPicker size='middle' format='hex' value={record.productColor?.color?.hexColor} disabled />
            )}
          </Flex>
        </EditableStateCell>
      )
    },
    quantityPO: (record: CuttingGroupTableDataType) => {
      return (
        <EditableStateCell isEditing={false} dataIndex='quantityPO' title='Số lượng PO' inputType='number' required>
          <SkyTableTypography status={'active'}>{numberValidatorDisplay(record.quantityPO)}</SkyTableTypography>
        </EditableStateCell>
      )
    },
    quantityRealCut: (record: CuttingGroupTableDataType) => {
      return (
        <EditableStateCell
          isEditing={table.isEditing(record.key!)}
          dataIndex='quantityRealCut'
          title='Thực cắt'
          inputType='number'
          required
          initialValue={record.cuttingGroup && numberValidatorInit(record.cuttingGroup?.quantityRealCut)}
          value={newRecord?.quantityRealCut}
          onValueChange={(val) => setNewRecord({ ...newRecord, quantityRealCut: numberValidatorChange(val) })}
        >
          <SkyTableTypography status={record.status}>
            {(record.cuttingGroup && numberValidatorDisplay(record.cuttingGroup?.quantityRealCut)) ?? '-'}
          </SkyTableTypography>
        </EditableStateCell>
      )
    },
    timeCut: (record: CuttingGroupTableDataType) => {
      return (
        <EditableStateCell
          isEditing={table.isEditing(record.key!)}
          dataIndex='timeCut'
          title='Ngày giờ cắt'
          inputType='datepicker'
          required
          initialValue={record.cuttingGroup && dateValidatorInit(record.cuttingGroup.timeCut)}
          onValueChange={(val: Dayjs) => setNewRecord({ ...newRecord, timeCut: dateValidatorChange(val) })}
        >
          <SkyTableTypography status={record.status}>
            {(record.cuttingGroup && dateTimeValidatorDisplay(record.cuttingGroup.timeCut)) ?? '--/--/----'}
          </SkyTableTypography>
        </EditableStateCell>
      )
    },
    remainingAmount: (record: CuttingGroupTableDataType) => {
      const totalAmount = (record.quantityPO ?? 0) - (record.cuttingGroup?.quantityRealCut ?? 0)
      return (
        <EditableStateCell isEditing={false} dataIndex='remainingAmount' title='Còn lại' inputType='number'>
          <SkyTableTypography status={record.status}>
            {numberValidatorDisplay(totalAmount < 0 ? totalAmount * -1 : totalAmount)}{' '}
            <span>{totalAmount < 0 && '(Dư)'}</span>
          </SkyTableTypography>
        </EditableStateCell>
      )
    },
    embroidered: {
      dateSendEmbroidered: (record: CuttingGroupTableDataType) => {
        return (
          <EditableStateCell
            isEditing={table.isEditing(record.key!)}
            dataIndex='dateSendEmbroidered'
            title='Ngày gửi in thêu'
            inputType='datepicker'
            required
            disabled={(newRecord.syncStatus && table.isEditing(record.key)) ?? false}
            initialValue={record.cuttingGroup && dateValidatorInit(record.cuttingGroup.dateSendEmbroidered)}
            onValueChange={(val: Dayjs) =>
              setNewRecord({
                ...newRecord,
                dateSendEmbroidered: dateValidatorChange(val)
              })
            }
          >
            <SkyTableTypography
              disabled={(record.cuttingGroup && record.cuttingGroup.syncStatus) ?? false}
              status={record.status}
            >
              {(record.cuttingGroup && dateValidatorDisplay(record.cuttingGroup.dateSendEmbroidered)) ?? '--/--/----'}
            </SkyTableTypography>
          </EditableStateCell>
        )
      },
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
            title='Còn lại'
            isEditing={table.isEditing(record.key)}
            editableRender={
              <SkyTableTypography
                status={record.status}
                disabled={(newRecord.syncStatus && table.isEditing(record.key)) ?? false}
              >
                {total}
              </SkyTableTypography>
            }
            disabled={(newRecord.syncStatus && table.isEditing(record.key)) ?? false}
            initialValue={total}
            inputType='number'
          >
            <SkyTableTypography
              status={record.status}
              disabled={(record.cuttingGroup && record.cuttingGroup.syncStatus) ?? false}
            >
              {numberValidatorDisplay(total)}
            </SkyTableTypography>
          </EditableStateCell>
        )
      },
      syncStatus: (record: CuttingGroupTableDataType) => {
        return (
          <EditableStateCell
            isEditing={table.isEditing(record.key!)}
            dataIndex='syncStatus'
            title='Option'
            inputType='checkbox'
            required
            initialValue={(record.cuttingGroup && record.cuttingGroup.syncStatus) ?? undefined}
            value={newRecord.syncStatus}
            onValueChange={(val: boolean) =>
              setNewRecord({
                ...newRecord,
                syncStatus: val
              })
            }
          >
            <Checkbox
              name='syncStatus'
              checked={(record.cuttingGroup && record.cuttingGroup.syncStatus) ?? undefined}
              disabled
            />
          </EditableStateCell>
        )
      }
    },
    btp: {
      quantityDeliveredBTP: (record: CuttingGroupTableDataType) => {
        return (
          <EditableStateCell
            isEditing={table.isEditing(record.key!)}
            dataIndex='quantityDeliveredBTP'
            title='SL Giao BTP'
            inputType='number'
            required
            initialValue={record.cuttingGroup ? record.cuttingGroup.quantityDeliveredBTP : ''}
            value={newRecord && numberValidatorCalc(newRecord?.quantityDeliveredBTP)}
            onValueChange={(val) => setNewRecord({ ...newRecord, quantityDeliveredBTP: val })}
          >
            <SkyTableTypography status={record.status}>
              {(record.cuttingGroup && numberValidatorDisplay(record.cuttingGroup?.quantityDeliveredBTP)) ?? '-'}
            </SkyTableTypography>
          </EditableStateCell>
        )
      },
      amountQuantityDeliveredBTP: (record: CuttingGroupTableDataType) => {
        const amountQuantityBTP =
          numberValidatorCalc(record.quantityPO) - numberValidatorCalc(record.cuttingGroup?.quantityDeliveredBTP)
        return (
          <EditableStateCell
            isEditing={false}
            dataIndex='amountQuantityDeliveredBTP'
            title='SL Còn lại'
            inputType='number'
            required
          >
            <SkyTableTypography status={record.status}>{numberValidatorDisplay(amountQuantityBTP)}</SkyTableTypography>
          </EditableStateCell>
        )
      }
    },
    embroideringArrived: {
      th1: {
        quantityArrived: (record: CuttingGroupTableDataType) => {
          return (
            <EditableStateCell
              isEditing={table.isEditing(record.key!)}
              dataIndex='quantityArrived'
              title='Thực cắt'
              inputType='number'
              required
              initialValue={record.cuttingGroup && numberValidatorInit(record.cuttingGroup.quantityArrived1Th)}
              value={newRecord?.quantityArrived1Th}
              onValueChange={(val) => setNewRecord({ ...newRecord, quantityArrived1Th: numberValidatorChange(val) })}
            >
              <SkyTableTypography status={record.status}>
                {(record.cuttingGroup && numberValidatorDisplay(record.cuttingGroup?.quantityArrived1Th)) ?? '-'}
              </SkyTableTypography>
            </EditableStateCell>
          )
        },
        dateArrived: (record: CuttingGroupTableDataType) => {
          return (
            <EditableStateCell
              isEditing={table.isEditing(record.key!)}
              dataIndex='dateArrived'
              title='Ngày về'
              inputType='datepicker'
              required
              initialValue={record.cuttingGroup && dateValidatorInit(record.cuttingGroup.dateArrived1Th)}
              onValueChange={(val: Dayjs) =>
                setNewRecord({
                  ...newRecord,
                  dateArrived1Th: dateValidatorChange(val)
                })
              }
            >
              <SkyTableTypography status={record.status}>
                {(record.cuttingGroup && dateValidatorDisplay(record.cuttingGroup.dateArrived1Th)) ?? '--/--/----'}
              </SkyTableTypography>
            </EditableStateCell>
          )
        }
      },
      th2: {
        quantityArrived: (record: CuttingGroupTableDataType) => {
          return (
            <EditableStateCell
              isEditing={table.isEditing(record.key!)}
              dataIndex='quantityArrived'
              title='Thực cắt'
              inputType='number'
              required
              initialValue={record.cuttingGroup && numberValidatorInit(record.cuttingGroup.quantityArrived2Th)}
              value={newRecord?.quantityArrived2Th}
              onValueChange={(val) => setNewRecord({ ...newRecord, quantityArrived2Th: numberValidatorChange(val) })}
            >
              <SkyTableTypography status={record.status}>
                {(record.cuttingGroup && numberValidatorDisplay(record.cuttingGroup?.quantityArrived2Th)) ?? '-'}
              </SkyTableTypography>
            </EditableStateCell>
          )
        },
        dateArrived: (record: CuttingGroupTableDataType) => {
          return (
            <EditableStateCell
              isEditing={table.isEditing(record.key!)}
              dataIndex='dateArrived'
              title='Ngày về'
              inputType='datepicker'
              required
              initialValue={record.cuttingGroup && dateValidatorInit(record.cuttingGroup.dateArrived2Th)}
              onValueChange={(val: Dayjs) =>
                setNewRecord({
                  ...newRecord,
                  dateArrived2Th: dateValidatorChange(val)
                })
              }
            >
              <SkyTableTypography status={record.status}>
                {(record.cuttingGroup && dateValidatorDisplay(record.cuttingGroup.dateArrived2Th)) ?? '--/--/----'}
              </SkyTableTypography>
            </EditableStateCell>
          )
        }
      },
      th3: {
        quantityArrived: (record: CuttingGroupTableDataType) => {
          return (
            <EditableStateCell
              isEditing={table.isEditing(record.key!)}
              dataIndex='quantityArrived'
              title='Thực cắt'
              inputType='number'
              required
              initialValue={record.cuttingGroup && numberValidatorInit(record.cuttingGroup.quantityArrived3Th)}
              value={newRecord?.quantityArrived3Th}
              onValueChange={(val) => setNewRecord({ ...newRecord, quantityArrived3Th: numberValidatorChange(val) })}
            >
              <SkyTableTypography status={record.status}>
                {(record.cuttingGroup && numberValidatorDisplay(record.cuttingGroup?.quantityArrived3Th)) ?? '-'}
              </SkyTableTypography>
            </EditableStateCell>
          )
        },
        dateArrived: (record: CuttingGroupTableDataType) => {
          return (
            <EditableStateCell
              isEditing={table.isEditing(record.key!)}
              dataIndex='dateArrived'
              title='Ngày về'
              inputType='datepicker'
              required
              initialValue={record.cuttingGroup && dateValidatorInit(record.cuttingGroup.dateArrived3Th)}
              onValueChange={(val: Dayjs) =>
                setNewRecord({
                  ...newRecord,
                  dateArrived3Th: dateValidatorChange(val)
                })
              }
            >
              <SkyTableTypography status={record.status}>
                {(record.cuttingGroup && dateValidatorDisplay(record.cuttingGroup.dateArrived3Th)) ?? '--/--/----'}
              </SkyTableTypography>
            </EditableStateCell>
          )
        }
      },
      th4: {
        quantityArrived: (record: CuttingGroupTableDataType) => {
          return (
            <EditableStateCell
              isEditing={table.isEditing(record.key!)}
              dataIndex='quantityArrived'
              title='Thực cắt'
              inputType='number'
              required
              initialValue={record.cuttingGroup && numberValidatorInit(record.cuttingGroup.quantityArrived4Th)}
              value={newRecord?.quantityArrived4Th}
              onValueChange={(val) => setNewRecord({ ...newRecord, quantityArrived4Th: numberValidatorChange(val) })}
            >
              <SkyTableTypography status={record.status}>
                {(record.cuttingGroup && numberValidatorDisplay(record.cuttingGroup?.quantityArrived4Th)) ?? '-'}
              </SkyTableTypography>
            </EditableStateCell>
          )
        },
        dateArrived: (record: CuttingGroupTableDataType) => {
          return (
            <EditableStateCell
              isEditing={table.isEditing(record.key!)}
              dataIndex='dateArrived'
              title='Ngày về'
              inputType='datepicker'
              required
              initialValue={record.cuttingGroup && dateValidatorInit(record.cuttingGroup.dateArrived4Th)}
              onValueChange={(val: Dayjs) =>
                setNewRecord({
                  ...newRecord,
                  dateArrived4Th: dateValidatorChange(val)
                })
              }
            >
              <SkyTableTypography status={record.status}>
                {(record.cuttingGroup && dateValidatorDisplay(record.cuttingGroup.dateArrived4Th)) ?? '--/--/----'}
              </SkyTableTypography>
            </EditableStateCell>
          )
        }
      },
      th5: {
        quantityArrived: (record: CuttingGroupTableDataType) => {
          return (
            <EditableStateCell
              isEditing={table.isEditing(record.key!)}
              dataIndex='quantityArrived'
              title='Thực cắt'
              inputType='number'
              required
              initialValue={record.cuttingGroup && numberValidatorInit(record.cuttingGroup.quantityArrived5Th)}
              value={newRecord?.quantityArrived5Th}
              onValueChange={(val) => setNewRecord({ ...newRecord, quantityArrived5Th: numberValidatorChange(val) })}
            >
              <SkyTableTypography status={record.status}>
                {(record.cuttingGroup && numberValidatorDisplay(record.cuttingGroup?.quantityArrived5Th)) ?? '-'}
              </SkyTableTypography>
            </EditableStateCell>
          )
        },
        dateArrived: (record: CuttingGroupTableDataType) => {
          return (
            <EditableStateCell
              isEditing={table.isEditing(record.key!)}
              dataIndex='dateArrived'
              title='Ngày về'
              inputType='datepicker'
              required
              initialValue={record.cuttingGroup && dateValidatorInit(record.cuttingGroup.dateArrived5Th)}
              onValueChange={(val: Dayjs) =>
                setNewRecord({
                  ...newRecord,
                  dateArrived5Th: dateValidatorChange(val)
                })
              }
            >
              <SkyTableTypography status={record.status}>
                {(record.cuttingGroup && dateValidatorDisplay(record.cuttingGroup.dateArrived5Th)) ?? '--/--/----'}
              </SkyTableTypography>
            </EditableStateCell>
          )
        }
      }
    }
  }

  const tableColumns: ColumnsType<CuttingGroupTableDataType> = [
    {
      title: 'Mã hàng',
      dataIndex: 'productCode',
      width: '10%',
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
      title: 'SL Thực cắt',
      dataIndex: 'quantityRealCut',
      width: '10%',
      responsive: ['lg'],
      render: (_value: any, record: CuttingGroupTableDataType) => {
        return columns.quantityRealCut(record)
      }
    },
    {
      title: 'SL Còn lại',
      dataIndex: 'remainingAmount',
      width: '10%',
      responsive: ['lg'],
      render: (_value: any, record: CuttingGroupTableDataType) => {
        return columns.remainingAmount(record)
      }
    },
    {
      title: 'Ngày giờ cắt',
      dataIndex: 'timeCut',
      width: '15%',
      responsive: ['xl'],
      render: (_value: any, record: CuttingGroupTableDataType) => {
        return columns.timeCut(record)
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
          title: 'SL còn lại',
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

  return (
    <>
      <BaseLayout
        title='Tổ cắt'
        loading={table.loading}
        searchProps={{
          onSearch: handleSearch,
          placeholder: 'Ví dụ: abc@gmail.com',
          value: searchTextChange,
          onChange: (e) => setSearchTextChange(e.target.value)
        }}
        sortProps={{
          onChange: handleSortChange
        }}
        deleteProps={{
          onChange: setShowDeleted
        }}
      >
        <SkyTable
          bordered
          loading={table.loading}
          columns={tableColumns}
          editingKey={table.editingKey}
          deletingKey={table.deletingKey}
          dataSource={table.dataSource}
          rowClassName='editable-row'
          onPageChange={handlePageChange}
          isShowDeleted={showDeleted}
          actionProps={{
            onEdit: {
              handleClick: (record) => {
                setNewRecord({
                  ...record?.cuttingGroup,
                  cuttingGroupID: record?.cuttingGroup ? record?.cuttingGroup.id : null, // Using for compare check box
                  productColorID: record?.productColor?.colorID // Using for compare check box
                })
                table.handleStartEditing(record!.key!)
              },
              isShow: !showDeleted
            },
            onSave: {
              handleClick: (record) => handleUpdate(record),
              isShow: !showDeleted
            },
            onDelete: {
              handleClick: (record) => table.handleStartDeleting(record.key),
              isShow: !showDeleted
            },
            onDeleteForever: {
              isShow: showDeleted
            },
            onRestore: {
              handleClick: (record) => table.handleStartRestore(record.key),
              isShow: showDeleted
            },
            onConfirmDeleteForever: (record) => handleDeleteForever(record.id!),
            onConfirmCancelEditing: () => table.handleCancelEditing(),
            onConfirmCancelDeleting: () => table.handleCancelDeleting(),
            onConfirmDelete: (record) => handleDelete(record),
            onConfirmCancelRestore: () => table.handleCancelRestore(),
            onConfirmRestore: (record) => handleRestore(record),
            isShow: true
          }}
          expandable={{
            expandedRowRender: (record) => {
              return (
                <Flex gap={30} vertical className='overflow-hidden'>
                  <Flex vertical>
                    <Space direction='vertical' size={10} split={<Divider className='my-0 w-full py-0' />}>
                      {!(width >= breakpoint.sm) && (
                        <ExpandableItemRow className='w-1/2' title='Màu:' isEditing={table.isEditing(record.key)}>
                          {columns.productColor(record)}
                        </ExpandableItemRow>
                      )}
                      {!(width >= breakpoint.md) && (
                        <ExpandableItemRow
                          className='w-1/2'
                          title='Số lượng PO:'
                          isEditing={table.isEditing(record.key)}
                        >
                          {columns.quantityPO(record)}
                        </ExpandableItemRow>
                      )}
                      {!(width >= breakpoint.lg) && (
                        <>
                          <ExpandableItemRow
                            className='w-1/2'
                            title='SL thực cắt:'
                            isEditing={table.isEditing(record.key)}
                          >
                            {columns.quantityRealCut(record)}
                          </ExpandableItemRow>
                          <ExpandableItemRow
                            className='w-1/2'
                            title='SL còn lại:'
                            isEditing={table.isEditing(record.key)}
                          >
                            {columns.remainingAmount(record)}
                          </ExpandableItemRow>
                        </>
                      )}
                      {!(width >= breakpoint.xl) && (
                        <ExpandableItemRow
                          className='w-1/2'
                          title='Ngày giờ cắt:'
                          isEditing={table.isEditing(record.key)}
                        >
                          {columns.timeCut(record)}
                        </ExpandableItemRow>
                      )}
                      {!(width >= breakpoint.xxl) && (
                        <>
                          <ExpandableItemRow
                            className='w-1/2'
                            title='Ngày gửi in thêu:'
                            isEditing={table.isEditing(record.key)}
                          >
                            {columns.embroidered.dateSendEmbroidered(record)}
                          </ExpandableItemRow>
                          <ExpandableItemRow
                            className='w-1/2'
                            title='SL còn lại:'
                            isEditing={table.isEditing(record.key)}
                          >
                            {columns.embroidered.amountQuantityEmbroidered(record)}
                          </ExpandableItemRow>
                          <ExpandableItemRow
                            className='w-1/2'
                            title='In thêu?:'
                            isEditing={table.isEditing(record.key)}
                          >
                            {columns.embroidered.syncStatus(record)}
                          </ExpandableItemRow>
                        </>
                      )}
                      {!(width >= breakpoint.xxl) && (
                        <>
                          <ExpandableItemRow
                            className='w-1/2'
                            title='SL Giao BTP:'
                            isEditing={table.isEditing(record.key)}
                          >
                            {columns.btp.quantityDeliveredBTP(record)}
                          </ExpandableItemRow>
                          <ExpandableItemRow
                            className='w-1/2'
                            title='Số lượng BTP còn lại:'
                            isEditing={table.isEditing(record.key)}
                          >
                            {columns.btp.amountQuantityDeliveredBTP(record)}
                          </ExpandableItemRow>
                        </>
                      )}
                    </Space>
                  </Flex>
                  <Flex vertical className=''>
                    <Space direction='vertical' size={10} split={<Divider className='my-0 py-0' />}>
                      <Flex justify='center' align='center' className='max-w-screen flex-col md:flex-row' gap={10}>
                        <SkyTableTypography code strong className='w-fit'>
                          Lần 1:
                        </SkyTableTypography>
                        <Flex className='w-full' gap={20}>
                          <ExpandableItemRow
                            className='w-fit pr-5'
                            title='SL về:'
                            isEditing={table.isEditing(record.key)}
                          >
                            {columns.embroideringArrived.th1.quantityArrived(record)}
                          </ExpandableItemRow>
                          <ExpandableItemRow
                            className='w-fit pr-5'
                            title='Ngày về:'
                            isEditing={table.isEditing(record.key)}
                          >
                            {columns.embroideringArrived.th1.dateArrived(record)}
                          </ExpandableItemRow>
                        </Flex>
                      </Flex>
                      <Flex justify='center' align='center' className='flex-col md:flex-row' gap={10}>
                        <SkyTableTypography code strong className='w-fit'>
                          Lần 2:
                        </SkyTableTypography>
                        <Flex className='w-full' gap={20}>
                          <ExpandableItemRow
                            className='w-fit pr-5'
                            title='SL về:'
                            isEditing={table.isEditing(record.key)}
                          >
                            {columns.embroideringArrived.th2.quantityArrived(record)}
                          </ExpandableItemRow>
                          <ExpandableItemRow
                            className='w-fit pr-5'
                            title='Ngày về:'
                            isEditing={table.isEditing(record.key)}
                          >
                            {columns.embroideringArrived.th2.dateArrived(record)}
                          </ExpandableItemRow>
                        </Flex>
                      </Flex>
                      <Flex justify='center' align='center' className='flex-col md:flex-row' gap={10}>
                        <SkyTableTypography code strong className='w-fit'>
                          Lần 3:
                        </SkyTableTypography>
                        <Flex className='w-full' gap={20}>
                          <ExpandableItemRow
                            className='w-fit pr-5'
                            title='SL về:'
                            isEditing={table.isEditing(record.key)}
                          >
                            {columns.embroideringArrived.th3.quantityArrived(record)}
                          </ExpandableItemRow>
                          <ExpandableItemRow
                            className='w-fit pr-5'
                            title='Ngày về:'
                            isEditing={table.isEditing(record.key)}
                          >
                            {columns.embroideringArrived.th3.dateArrived(record)}
                          </ExpandableItemRow>
                        </Flex>
                      </Flex>
                      <Flex justify='center' align='center' className='flex-col md:flex-row' gap={10}>
                        <SkyTableTypography code strong className='w-fit'>
                          Lần 4:
                        </SkyTableTypography>
                        <Flex className='w-full' gap={20}>
                          <ExpandableItemRow
                            className='w-fit pr-5'
                            title='SL về:'
                            isEditing={table.isEditing(record.key)}
                          >
                            {columns.embroideringArrived.th4.quantityArrived(record)}
                          </ExpandableItemRow>
                          <ExpandableItemRow
                            className='w-fit pr-5'
                            title='Ngày về:'
                            isEditing={table.isEditing(record.key)}
                          >
                            {columns.embroideringArrived.th4.dateArrived(record)}
                          </ExpandableItemRow>
                        </Flex>
                      </Flex>
                      <Flex justify='center' align='center' className='flex-col md:flex-row' gap={10}>
                        <SkyTableTypography code strong className='w-fit'>
                          Lần 5:
                        </SkyTableTypography>
                        <Flex className='w-full' gap={20}>
                          <ExpandableItemRow
                            className='w-fit pr-5'
                            title='SL về:'
                            isEditing={table.isEditing(record.key)}
                          >
                            {columns.embroideringArrived.th5.quantityArrived(record)}
                          </ExpandableItemRow>
                          <ExpandableItemRow
                            className='w-fit pr-5'
                            title='Ngày về:'
                            isEditing={table.isEditing(record.key)}
                          >
                            {columns.embroideringArrived.th5.dateArrived(record)}
                          </ExpandableItemRow>
                        </Flex>
                      </Flex>
                    </Space>
                  </Flex>
                </Flex>
              )
            },
            columnWidth: '0.001%'
          }}
        />
      </BaseLayout>
    </>
  )
}

export default SampleSewingPage
