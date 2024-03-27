import { Checkbox, ColorPicker, Flex, Space } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { Dayjs } from 'dayjs'
import { Check } from 'lucide-react'
import useDevice from '~/components/hooks/useDevice'
import useTable from '~/components/hooks/useTable'
import BaseLayout from '~/components/layout/BaseLayout'
import EditableStateCell from '~/components/sky-ui/SkyTable/EditableStateCell'
import SkyTable from '~/components/sky-ui/SkyTable/SkyTable'
import SkyTableTypography from '~/components/sky-ui/SkyTable/SkyTableTypography'
import {
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
import useCuttingGroup from '../hooks/useCuttingGroup'
import { CuttingGroupTableDataType } from '../type'

interface Props extends React.HTMLAttributes<HTMLElement> {}

const CuttingGroupTable: React.FC<Props> = () => {
  const table = useTable<CuttingGroupTableDataType>([])
  const { width } = useDevice()
  const {
    searchText,
    setSearchText,
    newRecord,
    setNewRecord,
    handleResetClick,
    handleSortChange,
    handleSearch,
    handleSaveClick,
    handleConfirmDelete,
    handlePageChange,
    productService
  } = useCuttingGroup(table)

  const columns: ColumnsType<CuttingGroupTableDataType> = [
    {
      title: 'Mã hàng',
      dataIndex: 'productCode',
      width: '10%',
      render: (_value: any, record: CuttingGroupTableDataType) => {
        return (
          <EditableStateCell isEditing={false} dataIndex='productCode' title='Mã hàng' inputType='text' required={true}>
            <SkyTableTypography strong status={record.status}>
              {textValidatorDisplay(record.productCode)}
            </SkyTableTypography>
          </EditableStateCell>
        )
      }
    },
    {
      title: 'Màu',
      dataIndex: 'colorID',
      width: '10%',
      render: (_value: any, record: CuttingGroupTableDataType) => {
        return (
          <EditableStateCell
            isEditing={false}
            dataIndex='colorID'
            title='Màu'
            inputType='colorselector'
            required={false}
          >
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
      }
    },
    {
      title: 'Số lượng PO',
      dataIndex: 'quantityPO',
      width: '10%',
      render: (_value: any, record: CuttingGroupTableDataType) => {
        return (
          <EditableStateCell
            isEditing={false}
            dataIndex='quantityPO'
            title='Số lượng PO'
            inputType='number'
            required={true}
          >
            <SkyTableTypography status={'active'}>{numberValidatorDisplay(record.quantityPO)}</SkyTableTypography>
          </EditableStateCell>
        )
      }
    },
    {
      title: 'SL Thực cắt',
      dataIndex: 'quantityRealCut',
      width: '10%',
      render: (_value: any, record: CuttingGroupTableDataType) => {
        return (
          <EditableStateCell
            isEditing={table.isEditing(record.key!)}
            dataIndex='quantityRealCut'
            title='Thực cắt'
            inputType='number'
            required={true}
            initialValue={record.cuttingGroup && numberValidatorInit(record.cuttingGroup?.quantityRealCut)}
            value={newRecord?.quantityRealCut}
            onValueChange={(val) => setNewRecord({ ...newRecord, quantityRealCut: numberValidatorChange(val) })}
          >
            <SkyTableTypography status={record.status}>
              {record.cuttingGroup && numberValidatorDisplay(record.cuttingGroup?.quantityRealCut)}
            </SkyTableTypography>
          </EditableStateCell>
        )
      }
    },
    {
      title: 'Ngày giờ cắt',
      dataIndex: 'timeCut',
      width: '15%',
      render: (_value: any, record: CuttingGroupTableDataType) => {
        return (
          <EditableStateCell
            isEditing={table.isEditing(record.key!)}
            dataIndex='timeCut'
            title='Ngày giờ cắt'
            inputType='datepicker'
            required={true}
            initialValue={record.cuttingGroup && dateValidatorInit(record.cuttingGroup.timeCut)}
            onValueChange={(val: Dayjs) => setNewRecord({ ...newRecord, timeCut: dateValidatorChange(val) })}
          >
            <SkyTableTypography status={record.status}>
              {record.cuttingGroup && dateTimeValidatorDisplay(record.cuttingGroup.timeCut)}
            </SkyTableTypography>
          </EditableStateCell>
        )
      }
    },
    {
      title: 'SL Còn lại',
      dataIndex: 'remainingAmount',
      width: '10%',
      render: (_value: any, record: CuttingGroupTableDataType) => {
        const totalAmount =
          numberValidatorCalc(record.quantityPO) - numberValidatorCalc(record.cuttingGroup?.quantityRealCut)
        return (
          <EditableStateCell isEditing={false} dataIndex='remainingAmount' title='Còn lại' inputType='number'>
            <SkyTableTypography status={record.status}>
              {totalAmount < 0 ? totalAmount * -1 : totalAmount} <span>{totalAmount < 0 && '(Dư)'}</span>
            </SkyTableTypography>
          </EditableStateCell>
        )
      }
    }
  ]

  const expandableColumns = (record: CuttingGroupTableDataType): ColumnsType<CuttingGroupTableDataType> => [
    {
      title: (
        <Space size={2} direction='horizontal'>
          <SkyTableTypography strong status={'active'} className='flex gap-[2px]'>
            In thêu
          </SkyTableTypography>
          {table.isEditing(record.id!) && newRecord.syncStatus && (
            <Check size={16} color='#ffffff' className='relative top-[2px] rounded-full bg-success p-[2px]' />
          )}
          {record.cuttingGroup && record.cuttingGroup.syncStatus && !table.isEditing(record.id!) && (
            <Check size={16} color='#ffffff' className='relative top-[2px] m-0 rounded-full bg-success p-[2px]' />
          )}
        </Space>
      ),
      children: [
        {
          title: 'Ngày gửi in thêu',
          dataIndex: 'dateSendEmbroidered',
          width: '20%',
          render: (_value: any, record: CuttingGroupTableDataType) => {
            return (
              <EditableStateCell
                isEditing={table.isEditing(record.key!)}
                dataIndex='dateSendEmbroidered'
                title='Ngày gửi in thêu'
                inputType='datepicker'
                required={true}
                disabled={(newRecord.syncStatus && table.isEditing(record.id!)) ?? false}
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
                  {record.cuttingGroup && dateValidatorDisplay(record.cuttingGroup.dateSendEmbroidered)}
                </SkyTableTypography>
              </EditableStateCell>
            )
          }
        },
        {
          title: 'Còn lại',
          dataIndex: 'amountQuantityEmbroidered',
          width: '10%',
          render: (_value: any, record: CuttingGroupTableDataType) => {
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
                isEditing={table.isEditing(record.id!)}
                editableRender={
                  <SkyTableTypography
                    status={record.status}
                    disabled={(newRecord.syncStatus && table.isEditing(record.id!)) ?? false}
                  >
                    {total}
                  </SkyTableTypography>
                }
                disabled={(newRecord.syncStatus && table.isEditing(record.id!)) ?? false}
                initialValue={total}
                inputType='number'
              >
                <SkyTableTypography
                  status={record.status}
                  disabled={(record.cuttingGroup && record.cuttingGroup.syncStatus) ?? false}
                >
                  {total}
                </SkyTableTypography>
              </EditableStateCell>
            )
          }
        },
        {
          title: 'Option',
          dataIndex: 'syncStatus',
          width: '15%',
          render: (_value: any, record: CuttingGroupTableDataType) => {
            return (
              <EditableStateCell
                isEditing={table.isEditing(record.key!)}
                dataIndex='syncStatus'
                title='Option'
                inputType='checkbox'
                required={true}
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
        }
      ]
    },
    {
      title: 'Bán thành phẩm',
      children: [
        {
          title: 'SL Giao BTP',
          dataIndex: 'quantityDeliveredBTP',
          width: '25%',
          render: (_value: any, record: CuttingGroupTableDataType) => {
            return (
              <EditableStateCell
                isEditing={table.isEditing(record.key!)}
                dataIndex='quantityDeliveredBTP'
                title='SL Giao'
                inputType='number'
                required={true}
                initialValue={record.cuttingGroup ? record.cuttingGroup.quantityDeliveredBTP : ''}
                value={newRecord && (newRecord?.quantityDeliveredBTP ?? 0)}
                onValueChange={(val) => setNewRecord({ ...newRecord, quantityDeliveredBTP: val })}
              >
                <SkyTableTypography status={record.status}>
                  {record.cuttingGroup ? record.cuttingGroup?.quantityDeliveredBTP : ''}
                </SkyTableTypography>
              </EditableStateCell>
            )
          }
        },
        {
          title: 'SL Còn lại',
          dataIndex: 'amountQuantityDeliveredBTP',
          width: '25%',
          render: (_value: any, record: CuttingGroupTableDataType) => {
            const amountQuantityBTP = (record.quantityPO ?? 0) - (record.cuttingGroup?.quantityDeliveredBTP ?? 0)
            return (
              <EditableStateCell
                isEditing={false}
                dataIndex='amountQuantityDeliveredBTP'
                title='SL Còn lại'
                inputType='number'
                required={true}
              >
                <SkyTableTypography status={record.status}>{amountQuantityBTP}</SkyTableTypography>
              </EditableStateCell>
            )
          }
        }
      ]
    }
  ]

  const expandableColumns2: ColumnsType<CuttingGroupTableDataType> = [
    {
      title: 'In thêu về',
      children: [
        {
          title: 'Lần 1',
          onHeaderCell: () => {
            return {
              style: {
                background: 'var(--border)'
              }
            }
          },
          children: [
            {
              title: 'SL về',
              dataIndex: 'quantityArrived',
              render: (_value: any, record: CuttingGroupTableDataType) => {
                return (
                  <EditableStateCell
                    isEditing={table.isEditing(record.key!)}
                    dataIndex='quantityArrived'
                    title='Thực cắt'
                    inputType='number'
                    required={true}
                    initialValue={record.cuttingGroup && numberValidatorInit(record.cuttingGroup.quantityArrived1Th)}
                    value={newRecord?.quantityArrived1Th}
                    onValueChange={(val) =>
                      setNewRecord({ ...newRecord, quantityArrived1Th: numberValidatorChange(val) })
                    }
                  >
                    <SkyTableTypography status={record.status}>
                      {record.cuttingGroup && numberValidatorDisplay(record.cuttingGroup?.quantityArrived1Th)}
                    </SkyTableTypography>
                  </EditableStateCell>
                )
              }
            },
            {
              title: 'Ngày về',
              dataIndex: 'dateArrived',
              render: (_value: any, record: CuttingGroupTableDataType) => {
                return (
                  <EditableStateCell
                    isEditing={table.isEditing(record.key!)}
                    dataIndex='dateArrived'
                    title='Ngày về'
                    inputType='datepicker'
                    required={true}
                    initialValue={record.cuttingGroup && dateValidatorInit(record.cuttingGroup.dateArrived1Th)}
                    onValueChange={(val: Dayjs) =>
                      setNewRecord({
                        ...newRecord,
                        dateArrived1Th: dateValidatorChange(val)
                      })
                    }
                  >
                    <SkyTableTypography status={record.status}>
                      {record.cuttingGroup && dateValidatorDisplay(record.cuttingGroup.dateArrived1Th)}
                    </SkyTableTypography>
                  </EditableStateCell>
                )
              }
            }
          ]
        },
        {
          title: 'Lần 2',
          children: [
            {
              title: 'SL về',
              dataIndex: 'quantityArrived',
              render: (_value: any, record: CuttingGroupTableDataType) => {
                return (
                  <>
                    <EditableStateCell
                      isEditing={table.isEditing(record.key!)}
                      dataIndex='quantityArrived'
                      title='Thực cắt'
                      inputType='number'
                      required={true}
                      initialValue={record.cuttingGroup && numberValidatorInit(record.cuttingGroup.quantityArrived2Th)}
                      value={newRecord?.quantityArrived2Th}
                      onValueChange={(val) =>
                        setNewRecord({ ...newRecord, quantityArrived2Th: numberValidatorChange(val) })
                      }
                    >
                      <SkyTableTypography status={record.status}>
                        {record.cuttingGroup && numberValidatorDisplay(record.cuttingGroup?.quantityArrived2Th)}
                      </SkyTableTypography>
                    </EditableStateCell>
                  </>
                )
              }
            },
            {
              title: 'Ngày về',
              dataIndex: 'dateArrived',
              render: (_value: any, record: CuttingGroupTableDataType) => {
                return (
                  <EditableStateCell
                    isEditing={table.isEditing(record.key!)}
                    dataIndex='dateArrived'
                    title='Ngày về'
                    inputType='datepicker'
                    required={true}
                    initialValue={record.cuttingGroup && dateValidatorInit(record.cuttingGroup.dateArrived2Th)}
                    onValueChange={(val: Dayjs) =>
                      setNewRecord({
                        ...newRecord,
                        dateArrived2Th: dateValidatorChange(val)
                      })
                    }
                  >
                    <SkyTableTypography status={record.status}>
                      {record.cuttingGroup && dateValidatorDisplay(record.cuttingGroup.dateArrived2Th)}
                    </SkyTableTypography>
                  </EditableStateCell>
                )
              }
            }
          ]
        },
        {
          title: 'Lần 3',
          onHeaderCell: () => {
            return {
              style: {
                background: 'var(--border)'
              }
            }
          },
          children: [
            {
              title: 'SL về',
              dataIndex: 'quantityArrived',
              render: (_value: any, record: CuttingGroupTableDataType) => {
                return (
                  <>
                    <EditableStateCell
                      isEditing={table.isEditing(record.key!)}
                      dataIndex='quantityArrived'
                      title='Thực cắt'
                      inputType='number'
                      required={true}
                      initialValue={record.cuttingGroup && numberValidatorInit(record.cuttingGroup.quantityArrived3Th)}
                      value={newRecord?.quantityArrived3Th}
                      onValueChange={(val) =>
                        setNewRecord({ ...newRecord, quantityArrived3Th: numberValidatorChange(val) })
                      }
                    >
                      <SkyTableTypography status={record.status}>
                        {record.cuttingGroup && numberValidatorDisplay(record.cuttingGroup?.quantityArrived3Th)}
                      </SkyTableTypography>
                    </EditableStateCell>
                  </>
                )
              }
            },
            {
              title: 'Ngày về',
              dataIndex: 'dateArrived',
              render: (_value: any, record: CuttingGroupTableDataType) => {
                return (
                  <EditableStateCell
                    isEditing={table.isEditing(record.key!)}
                    dataIndex='dateArrived'
                    title='Ngày về'
                    inputType='datepicker'
                    required={true}
                    initialValue={record.cuttingGroup && dateValidatorInit(record.cuttingGroup.dateArrived3Th)}
                    onValueChange={(val: Dayjs) =>
                      setNewRecord({
                        ...newRecord,
                        dateArrived3Th: dateValidatorChange(val)
                      })
                    }
                  >
                    <SkyTableTypography status={record.status}>
                      {record.cuttingGroup && dateValidatorDisplay(record.cuttingGroup.dateArrived3Th)}
                    </SkyTableTypography>
                  </EditableStateCell>
                )
              }
            }
          ]
        },
        {
          title: 'Lần 4',
          children: [
            {
              title: 'SL về',
              dataIndex: 'quantityArrived',
              render: (_value: any, record: CuttingGroupTableDataType) => {
                return (
                  <>
                    <EditableStateCell
                      isEditing={table.isEditing(record.key!)}
                      dataIndex='quantityArrived'
                      title='Thực cắt'
                      inputType='number'
                      required={true}
                      initialValue={record.cuttingGroup && numberValidatorInit(record.cuttingGroup.quantityArrived4Th)}
                      value={newRecord?.quantityArrived4Th}
                      onValueChange={(val) =>
                        setNewRecord({ ...newRecord, quantityArrived4Th: numberValidatorChange(val) })
                      }
                    >
                      <SkyTableTypography status={record.status}>
                        {record.cuttingGroup && numberValidatorDisplay(record.cuttingGroup?.quantityArrived4Th)}
                      </SkyTableTypography>
                    </EditableStateCell>
                  </>
                )
              }
            },
            {
              title: 'Ngày về',
              dataIndex: 'dateArrived',
              render: (_value: any, record: CuttingGroupTableDataType) => {
                return (
                  <EditableStateCell
                    isEditing={table.isEditing(record.key!)}
                    dataIndex='dateArrived'
                    title='Ngày về'
                    inputType='datepicker'
                    required={true}
                    initialValue={record.cuttingGroup && dateValidatorInit(record.cuttingGroup.dateArrived4Th)}
                    onValueChange={(val: Dayjs) =>
                      setNewRecord({
                        ...newRecord,
                        dateArrived4Th: dateValidatorChange(val)
                      })
                    }
                  >
                    <SkyTableTypography status={record.status}>
                      {record.cuttingGroup && dateValidatorDisplay(record.cuttingGroup.dateArrived4Th)}
                    </SkyTableTypography>
                  </EditableStateCell>
                )
              }
            }
          ]
        },
        {
          title: 'Lần 5',
          onHeaderCell: () => {
            return {
              style: {
                background: 'var(--border)'
              }
            }
          },
          children: [
            {
              title: 'SL về',
              dataIndex: 'quantityArrived',
              render: (_value: any, record: CuttingGroupTableDataType) => {
                return (
                  <>
                    <EditableStateCell
                      isEditing={table.isEditing(record.key!)}
                      dataIndex='quantityArrived'
                      title='Thực cắt'
                      inputType='number'
                      required={true}
                      initialValue={record.cuttingGroup && numberValidatorInit(record.cuttingGroup.quantityArrived5Th)}
                      value={newRecord?.quantityArrived5Th}
                      onValueChange={(val) =>
                        setNewRecord({ ...newRecord, quantityArrived5Th: numberValidatorChange(val) })
                      }
                    >
                      <SkyTableTypography status={record.status}>
                        {record.cuttingGroup && numberValidatorDisplay(record.cuttingGroup?.quantityArrived5Th)}
                      </SkyTableTypography>
                    </EditableStateCell>
                  </>
                )
              }
            },
            {
              title: 'Ngày về',
              dataIndex: 'dateArrived',
              render: (_value: any, record: CuttingGroupTableDataType) => {
                return (
                  <EditableStateCell
                    isEditing={table.isEditing(record.key!)}
                    dataIndex='dateArrived'
                    title='Ngày về'
                    inputType='datepicker'
                    required={true}
                    initialValue={record.cuttingGroup && dateValidatorInit(record.cuttingGroup.dateArrived5Th)}
                    onValueChange={(val: Dayjs) =>
                      setNewRecord({
                        ...newRecord,
                        dateArrived5Th: dateValidatorChange(val)
                      })
                    }
                  >
                    <SkyTableTypography status={record.status}>
                      {record.cuttingGroup && dateValidatorDisplay(record.cuttingGroup.dateArrived5Th)}
                    </SkyTableTypography>
                  </EditableStateCell>
                )
              }
            }
          ]
        }
      ]
    }
  ]

  return (
    <>
      <BaseLayout
        searchValue={searchText}
        onDeletedRecordStateChange={(enable) => table.setDeletedRecordState(enable)}
        onSearchChange={(e) => setSearchText(e.target.value)}
        onSearch={(value) => handleSearch(value)}
        onSortChange={(checked, e) => handleSortChange(checked, e)}
        onResetClick={{
          onClick: () => handleResetClick(),
          isShow: true
        }}
      >
        <SkyTable
          bordered
          loading={table.loading}
          columns={columns}
          editingKey={table.editingKey}
          deletingKey={table.deletingKey}
          dataSource={table.dataSource}
          rowClassName='editable-row'
          metaData={productService.metaData}
          onPageChange={handlePageChange}
          isShowDeleted={table.showDeleted}
          actions={{
            onEdit: {
              onClick: (_e, record) => {
                setNewRecord({
                  ...record?.cuttingGroup,
                  cuttingGroupID: record?.cuttingGroup ? record?.cuttingGroup.id : null, // Using for compare check box
                  productColorID: record?.productColor?.colorID // Using for compare check box
                })
                table.handleStartEditing(record!.key!)
              }
            },
            onSave: {
              onClick: (_e, record) => handleSaveClick(record!)
            },
            onDelete: {
              onClick: (_e, record) => table.handleStartDeleting(record!.key!)
            },
            onConfirmCancelEditing: () => table.handleConfirmCancelEditing(),
            onConfirmCancelDeleting: () => table.handleConfirmCancelDeleting(),
            onConfirmDelete: (record) => handleConfirmDelete(record),
            isShow: true
          }}
          expandable={{
            expandedRowRender: (record) => {
              return (
                <>
                  {width < 1600 && (
                    <Flex vertical gap={10}>
                      <SkyTable
                        bordered
                        loading={table.loading}
                        columns={expandableColumns(record)}
                        rowClassName='editable-row'
                        dataSource={table.dataSource.filter((item) => item.id === record.id)}
                        metaData={productService.metaData}
                        pagination={false}
                        isShowDeleted={table.showDeleted}
                        editingKey={table.editingKey}
                        deletingKey={table.deletingKey}
                      />
                      <SkyTable
                        bordered
                        loading={table.loading}
                        columns={expandableColumns2}
                        rowClassName='editable-row'
                        dataSource={table.dataSource.filter((item) => item.id === record.id)}
                        metaData={productService.metaData}
                        pagination={false}
                        isShowDeleted={table.showDeleted}
                        editingKey={table.editingKey}
                        deletingKey={table.deletingKey}
                      />
                    </Flex>
                  )}
                </>
              )
            },
            columnWidth: '0.001%'
          }}
        />
      </BaseLayout>
    </>
  )
}

export default CuttingGroupTable
