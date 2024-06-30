import { Checkbox, ColorPicker, Flex, Space } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { Dayjs } from 'dayjs'
import { Check } from 'lucide-react'
import useDevice from '~/components/hooks/useDevice'
import useTitle from '~/components/hooks/useTitle'
import BaseLayout from '~/components/layout/BaseLayout'
import EditableStateCell from '~/components/sky-ui/SkyTable/EditableStateCell'
import SkyTable from '~/components/sky-ui/SkyTable/SkyTable'
import SkyTableExpandableItemRow from '~/components/sky-ui/SkyTable/SkyTableExpandableItemRow'
import SkyTableExpandableLayout from '~/components/sky-ui/SkyTable/SkyTableExpandableLayout'
import SkyTableTypography from '~/components/sky-ui/SkyTable/SkyTableTypography'
import { GarmentAccessoryNote } from '~/typing'
import {
  breakpoint,
  dateValidatorChange,
  dateValidatorDisplay,
  dateValidatorInit,
  numberValidatorCalc,
  numberValidatorChange,
  numberValidatorDisplay,
  numberValidatorInit,
  textValidatorDisplay
} from '~/utils/helpers'
import useGarmentAccessoryViewModel from './hooks/useGarmentAccessoryViewModel'
import { GarmentAccessoryTableDataType } from './type'

const GarmentAccessoryPage = () => {
  useTitle('Phụ liệu - Phung Nguyen')
  const { state, action, table } = useGarmentAccessoryViewModel()
  const {
    accessoryNotes,
    newRecord,
    setNewRecord,
    showDeleted,
    setShowDeleted,
    searchTextChange,
    setSearchTextChange
  } = state
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
    productCode: (record: GarmentAccessoryTableDataType) => {
      return (
        <EditableStateCell isEditing={false} dataIndex='productCode' title='Mã hàng' inputType='text' required={true}>
          <Space size={2} direction='horizontal'>
            <SkyTableTypography strong status={'active'} className='flex gap-[2px]'>
              {textValidatorDisplay(record.productCode)}
            </SkyTableTypography>
            {table.isEditing(record.key) && newRecord.syncStatus && (
              <Check size={16} color='#ffffff' className='relative top-[2px] rounded-full bg-success p-[2px]' />
            )}
            {record.garmentAccessory && record.garmentAccessory.syncStatus && !table.isEditing(record.key) && (
              <Check size={16} color='#ffffff' className='relative top-[2px] m-0 rounded-full bg-success p-[2px]' />
            )}
          </Space>
        </EditableStateCell>
      )
    },
    quantityPO: (record: GarmentAccessoryTableDataType) => {
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
    },
    productColor: (record: GarmentAccessoryTableDataType) => {
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
    garmentAccessory: {
      amountCutting: (record: GarmentAccessoryTableDataType) => {
        return (
          <EditableStateCell
            isEditing={table.isEditing(record.key!)}
            dataIndex='amountCutting'
            title='Cắt được'
            inputType='number'
            required={true}
            disabled={(newRecord.syncStatus && table.isEditing(record.key)) ?? false}
            initialValue={record.garmentAccessory && numberValidatorInit(record.garmentAccessory.amountCutting)}
            value={newRecord.amountCutting}
            onValueChange={(val: number) =>
              setNewRecord({
                ...newRecord,
                amountCutting: numberValidatorChange(val > 0 ? val : 0)
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
      },
      remainingAmount: (record: GarmentAccessoryTableDataType) => {
        const amount = record.garmentAccessory?.amountCutting
          ? numberValidatorCalc(record.quantityPO) - numberValidatorCalc(record.garmentAccessory?.amountCutting)
          : 0
        return (
          <EditableStateCell
            dataIndex='remainingAmount'
            title='Còn lại'
            isEditing={table.isEditing(record.key)}
            editableRender={
              <SkyTableTypography
                status={record.status}
                disabled={(newRecord.syncStatus && table.isEditing(record.key)) ?? false}
              >
                {numberValidatorDisplay(amount)}
              </SkyTableTypography>
            }
            disabled={(newRecord.syncStatus && table.isEditing(record.key)) ?? false}
            initialValue={amount}
            inputType='number'
          >
            <SkyTableTypography
              status={record.status}
              disabled={(record.garmentAccessory && record.garmentAccessory.syncStatus) ?? false}
            >
              {numberValidatorDisplay(amount)}
            </SkyTableTypography>
          </EditableStateCell>
        )
      },
      passingDeliveryDate: (record: GarmentAccessoryTableDataType) => {
        return (
          <EditableStateCell
            isEditing={table.isEditing(record.key!)}
            dataIndex='passingDeliveryDate'
            title='Giao chuyền'
            inputType='datepicker'
            required={true}
            disabled={(newRecord.syncStatus && table.isEditing(record.key)) ?? false}
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
              {(record.garmentAccessory && dateValidatorDisplay(record.garmentAccessory.passingDeliveryDate)) ??
                '--/--/----'}
            </SkyTableTypography>
          </EditableStateCell>
        )
      },
      syncStatus: (record: GarmentAccessoryTableDataType) => {
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
      },
      accessoryNotes: (record: GarmentAccessoryTableDataType) => {
        return (
          <EditableStateCell
            isEditing={table.isEditing(record.key!)}
            dataIndex='accessoryNotes'
            title='Ghi chú'
            inputType='multipleselect'
            required={true}
            disabled={(newRecord.syncStatus && table.isEditing(record.key)) ?? false}
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
        )
      }
    }
  }

  const tableColumns: ColumnsType<GarmentAccessoryTableDataType> = [
    {
      title: 'Mã hàng',
      dataIndex: 'productCode',
      width: '12%',
      render: (_value: any, record: GarmentAccessoryTableDataType) => {
        return columns.productCode(record)
      }
    },
    // {
    //   title: 'Số lượng PO',
    //   dataIndex: 'quantityPO',
    //   width: '10%',
    //   responsive: ['sm'],
    //   render: (_value: any, record: GarmentAccessoryTableDataType) => {
    //     return columns.quantityPO(record)
    //   }
    // },
    {
      title: 'Màu',
      dataIndex: 'colorID',
      width: '15%',
      responsive: ['sm'],
      render: (_value: any, record: GarmentAccessoryTableDataType) => {
        return columns.productColor(record)
      }
    },
    {
      title: 'Cắt phụ liệu',
      responsive: ['md'],
      children: [
        {
          title: 'Cắt được',
          dataIndex: 'amountCutting',
          width: '10%',
          render: (_value: any, record: GarmentAccessoryTableDataType) => {
            return columns.garmentAccessory.amountCutting(record)
          }
        },
        {
          title: 'Còn lại',
          dataIndex: 'remainingAmount',
          width: '10%',
          render: (_value: any, record: GarmentAccessoryTableDataType) => {
            return columns.garmentAccessory.remainingAmount(record)
          }
        }
      ]
    },
    {
      title: 'Ngày giao chuyền',
      dataIndex: 'passingDeliveryDate',
      responsive: ['lg'],
      width: '15%',
      render: (_value: any, record: GarmentAccessoryTableDataType) => {
        return columns.garmentAccessory.passingDeliveryDate(record)
      }
    },
    {
      title: 'Đồng bộ PL',
      dataIndex: 'syncStatus',
      responsive: ['md'],
      width: '10%',
      render: (_value: any, record: GarmentAccessoryTableDataType) => {
        return columns.garmentAccessory.syncStatus(record)
      }
    },
    {
      title: 'Ghi chú',
      dataIndex: 'accessoryNotes',
      responsive: ['xl'],
      render: (_value: any, record: GarmentAccessoryTableDataType) => {
        return columns.garmentAccessory.accessoryNotes(record)
      }
    }
  ]

  return (
    <>
      <BaseLayout
        title='Phụ liệu'
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
                  garmentAccessoryID: record?.garmentAccessory?.id, // Using for compare check box
                  productColorID: record?.productColor?.colorID, // Using for compare check box
                  amountCutting: record?.garmentAccessory?.amountCutting,
                  passingDeliveryDate: record?.garmentAccessory?.passingDeliveryDate,
                  garmentAccessoryNotes: record?.garmentAccessoryNotes,
                  syncStatus: record?.garmentAccessory?.syncStatus
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
                <SkyTableExpandableLayout>
                  {!(width >= breakpoint.sm) && (
                    <SkyTableExpandableItemRow className='w-1/2' title='Màu:' isEditing={table.isEditing(record.key)}>
                      {columns.productColor(record)}
                    </SkyTableExpandableItemRow>
                  )}
                  {!(width >= breakpoint.md) && (
                    <>
                      <SkyTableExpandableItemRow
                        className='w-1/2'
                        title='Cắt được:'
                        isEditing={table.isEditing(record.key)}
                      >
                        {columns.garmentAccessory.amountCutting(record)}
                      </SkyTableExpandableItemRow>
                      <SkyTableExpandableItemRow
                        className='w-1/2'
                        title='Còn lại:'
                        isEditing={table.isEditing(record.key)}
                      >
                        {columns.garmentAccessory.remainingAmount(record)}
                      </SkyTableExpandableItemRow>
                    </>
                  )}
                  {!(width >= breakpoint.lg) && (
                    <SkyTableExpandableItemRow
                      className='w-1/2'
                      title='Ngày giao chuyền:'
                      isEditing={table.isEditing(record.key)}
                    >
                      {columns.garmentAccessory.passingDeliveryDate(record)}
                    </SkyTableExpandableItemRow>
                  )}
                  {!(width >= breakpoint.md) && (
                    <SkyTableExpandableItemRow
                      className='w-1/2'
                      title='Đồng bộ PL:'
                      isEditing={table.isEditing(record.key)}
                    >
                      {columns.garmentAccessory.syncStatus(record)}
                    </SkyTableExpandableItemRow>
                  )}
                  {!(width >= breakpoint.xl) && (
                    <SkyTableExpandableItemRow
                      className='w-1/3'
                      title='Ghi chú:'
                      isEditing={table.isEditing(record.key)}
                    >
                      {columns.garmentAccessory.accessoryNotes(record)}
                    </SkyTableExpandableItemRow>
                  )}
                </SkyTableExpandableLayout>
              )
            },
            columnWidth: '0.001%',
            showExpandColumn: !(width >= breakpoint.xl)
          }}
        />
      </BaseLayout>
    </>
  )
}

export default GarmentAccessoryPage
