import { Checkbox, ColorPicker, Flex, Space } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { Dayjs } from 'dayjs'
import { Check } from 'lucide-react'
import useTable, { TableItemWithKey } from '~/components/hooks/useTable'
import BaseLayout from '~/components/layout/BaseLayout'
import EditableStateCell from '~/components/sky-ui/SkyTable/EditableStateCell'
import SkyTable from '~/components/sky-ui/SkyTable/SkyTable'
import SkyTableTypography from '~/components/sky-ui/SkyTable/SkyTableTypography'
import { GarmentAccessoryNote } from '~/typing'
import {
  dateValidatorChange,
  dateValidatorDisplay,
  dateValidatorInit,
  numberValidatorCalc,
  numberValidatorChange,
  numberValidatorDisplay,
  numberValidatorInit,
  textValidatorDisplay
} from '~/utils/helpers'
import useGarmentAccessory from '../hooks/useGarmentAccessory'
import { GarmentAccessoryTableDataType } from '../type'

interface Props extends React.HTMLAttributes<HTMLElement> {}

const GarmentAccessoryTable: React.FC<Props> = () => {
  const table = useTable<GarmentAccessoryTableDataType>([])
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
    productService,
    accessoryNotes
  } = useGarmentAccessory(table)

  const columns: ColumnsType<GarmentAccessoryTableDataType> = [
    {
      title: 'Mã hàng',
      dataIndex: 'productCode',
      width: '10%',
      render: (_value: any, record: GarmentAccessoryTableDataType) => {
        return (
          <>
            <EditableStateCell
              isEditing={false}
              dataIndex='productCode'
              title='Mã hàng'
              inputType='text'
              required={true}
            >
              <Space size={2} direction='horizontal'>
                <SkyTableTypography strong status={'active'} className='flex gap-[2px]'>
                  {textValidatorDisplay(record.productCode)}
                </SkyTableTypography>
                {table.isEditing(record.id!) && newRecord.syncStatus && (
                  <Check size={16} color='#ffffff' className='relative top-[2px] rounded-full bg-success p-[2px]' />
                )}
                {record.garmentAccessory && record.garmentAccessory.syncStatus && !table.isEditing(record.id!) && (
                  <Check size={16} color='#ffffff' className='relative top-[2px] m-0 rounded-full bg-success p-[2px]' />
                )}
              </Space>
            </EditableStateCell>
          </>
        )
      }
    },
    {
      title: 'Số lượng PO',
      dataIndex: 'quantityPO',
      width: '10%',
      render: (_value: any, record: GarmentAccessoryTableDataType) => {
        return (
          <>
            <EditableStateCell
              isEditing={false}
              dataIndex='quantityPO'
              title='Số lượng PO'
              inputType='number'
              required={true}
            >
              <SkyTableTypography status={'active'}>{numberValidatorDisplay(record.quantityPO)}</SkyTableTypography>
            </EditableStateCell>
          </>
        )
      }
    },
    {
      title: 'Màu',
      dataIndex: 'colorID',
      width: '10%',
      render: (_value: any, record: GarmentAccessoryTableDataType) => {
        return (
          <>
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
          </>
        )
      }
    },
    {
      title: 'Cắt phụ liệu',
      children: [
        {
          title: 'Cắt được',
          dataIndex: 'amountCutting',
          width: '10%',
          render: (_value: any, record: TableItemWithKey<GarmentAccessoryTableDataType>) => {
            return (
              <EditableStateCell
                isEditing={table.isEditing(record.key!)}
                dataIndex='amountCutting'
                title='Cắt được'
                inputType='number'
                required={true}
                disabled={(newRecord.syncStatus && table.isEditing(record.id!)) ?? false}
                initialValue={record.garmentAccessory && numberValidatorInit(record.garmentAccessory.amountCutting)}
                value={newRecord.amountCutting}
                onValueChange={(val) =>
                  setNewRecord({
                    ...newRecord,
                    amountCutting: val > 0 ? numberValidatorChange(val) : null
                  })
                }
              >
                <SkyTableTypography
                  status={record.status}
                  disabled={(record.garmentAccessory && record.garmentAccessory.syncStatus) ?? false}
                >
                  {numberValidatorDisplay(record.garmentAccessory?.amountCutting)}
                </SkyTableTypography>
              </EditableStateCell>
            )
          }
        },
        {
          title: 'Còn lại',
          dataIndex: 'remainingAmount',
          width: '10%',
          render: (_value: any, record: TableItemWithKey<GarmentAccessoryTableDataType>) => {
            const amount = record.garmentAccessory?.amountCutting
              ? numberValidatorCalc(record.quantityPO) - numberValidatorCalc(record.garmentAccessory?.amountCutting)
              : 0
            return (
              <EditableStateCell
                dataIndex='remainingAmount'
                title='Còn lại'
                isEditing={table.isEditing(record.id!)}
                editableRender={
                  <SkyTableTypography
                    status={record.status}
                    disabled={(newRecord.syncStatus && table.isEditing(record.id!)) ?? false}
                  >
                    {amount}
                  </SkyTableTypography>
                }
                disabled={(newRecord.syncStatus && table.isEditing(record.id!)) ?? false}
                initialValue={amount}
                inputType='number'
              >
                <SkyTableTypography
                  status={record.status}
                  disabled={(record.garmentAccessory && record.garmentAccessory.syncStatus) ?? false}
                >
                  {amount}
                </SkyTableTypography>
              </EditableStateCell>
            )
          }
        }
      ]
    },
    {
      title: 'Ngày giao chuyền',
      dataIndex: 'passingDeliveryDate',
      width: '15%',
      render: (_value: any, record: TableItemWithKey<GarmentAccessoryTableDataType>) => {
        return (
          <EditableStateCell
            isEditing={table.isEditing(record.key!)}
            dataIndex='passingDeliveryDate'
            title='Giao chuyền'
            inputType='datepicker'
            required={true}
            disabled={(newRecord.syncStatus && table.isEditing(record.id!)) ?? false}
            initialValue={record.garmentAccessory && dateValidatorInit(record.garmentAccessory.passingDeliveryDate)}
            onValueChange={(val: Dayjs) =>
              setNewRecord({
                ...newRecord,
                passingDeliveryDate: dateValidatorChange(val)
              })
            }
          >
            <SkyTableTypography
              status={record.status}
              disabled={(record.garmentAccessory && record.garmentAccessory.syncStatus) ?? false}
            >
              {record.garmentAccessory && dateValidatorDisplay(record.garmentAccessory.passingDeliveryDate)}
            </SkyTableTypography>
          </EditableStateCell>
        )
      }
    },
    {
      title: 'Đồng bộ PL',
      dataIndex: 'syncStatus',
      width: '10%',
      render: (_value: any, record: TableItemWithKey<GarmentAccessoryTableDataType>) => {
        return (
          <EditableStateCell
            isEditing={table.isEditing(record.key!)}
            dataIndex='syncStatus'
            title='Đồng bộ PL'
            inputType='checkbox'
            required={true}
            initialValue={(record.garmentAccessory && record.garmentAccessory.syncStatus) ?? undefined}
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
              checked={(record.garmentAccessory && record.garmentAccessory.syncStatus) ?? undefined}
              disabled
            />
          </EditableStateCell>
        )
      }
    },
    {
      title: 'Ghi chú',
      dataIndex: 'accessoryNotes',
      render: (_value: any, record: TableItemWithKey<GarmentAccessoryTableDataType>) => {
        return (
          <>
            <EditableStateCell
              isEditing={table.isEditing(record.key!)}
              dataIndex='accessoryNotes'
              title='Ghi chú'
              inputType='multipleselect'
              required={true}
              disabled={(newRecord.syncStatus && table.isEditing(record.id!)) ?? false}
              selectProps={{
                options: accessoryNotes.map((item) => {
                  return {
                    value: item.id,
                    label: item.title
                  }
                }),
                defaultValue:
                  record.garmentAccessoryNotes &&
                  record.garmentAccessoryNotes.map((item) => {
                    return {
                      value: item.accessoryNote?.id,
                      label: item.accessoryNote?.title
                    }
                  })
              }}
              onValueChange={(val: number[]) => {
                setNewRecord({
                  ...newRecord,
                  garmentAccessoryNotes: val.map((item) => {
                    return { accessoryNoteID: item, noteStatus: 'enough' } as GarmentAccessoryNote
                  })
                })
              }}
            >
              <Space size='small' wrap>
                {record.garmentAccessoryNotes &&
                  record.garmentAccessoryNotes.map((item, index) => {
                    return (
                      <SkyTableTypography
                        className='my-[2px] h-6 rounded-sm bg-black bg-opacity-[0.06] px-2 py-1'
                        key={index}
                        disabled={(record.garmentAccessory && record.garmentAccessory.syncStatus) ?? false}
                        status={item.status}
                      >
                        {textValidatorDisplay(item.accessoryNote?.title)}
                      </SkyTableTypography>
                    )
                  })}
              </Space>
            </EditableStateCell>
          </>
        )
      }
    }
  ]

  return (
    <>
      <BaseLayout
        searchPlaceHolder='Mã hàng...'
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
                  garmentAccessoryID: record?.garmentAccessory?.id, // Using for compare check box
                  productColorID: record?.productColor?.colorID, // Using for compare check box
                  amountCutting: record?.garmentAccessory?.amountCutting,
                  passingDeliveryDate: record?.garmentAccessory?.passingDeliveryDate,
                  garmentAccessoryNotes: record?.garmentAccessoryNotes,
                  syncStatus: record?.garmentAccessory?.syncStatus
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
        />
      </BaseLayout>
    </>
  )
}

export default GarmentAccessoryTable
