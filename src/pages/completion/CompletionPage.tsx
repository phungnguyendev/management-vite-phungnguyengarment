import { ColorPicker, Divider, Flex, Space } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { Dayjs } from 'dayjs'
import { Check } from 'lucide-react'
import useDevice from '~/components/hooks/useDevice'
import useTitle from '~/components/hooks/useTitle'
import BaseLayout from '~/components/layout/BaseLayout'
import EditableStateCell from '~/components/sky-ui/SkyTable/EditableStateCell'
import ExpandableItemRow from '~/components/sky-ui/SkyTable/ExpandableItemRow'
import SkyTable from '~/components/sky-ui/SkyTable/SkyTable'
import SkyTableTypography from '~/components/sky-ui/SkyTable/SkyTableTypography'
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
import useCompletionViewModel from './hooks/useCompletionViewModel'
import { CompletionTableDataType } from './type'

const FinishPage = () => {
  useTitle('Hoàn thành - Phung Nguyen')
  const { state, action, table } = useCompletionViewModel()
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
    productCode: (record: CompletionTableDataType) => {
      const ironedSuccess =
        numberValidatorCalc(record.quantityPO) - numberValidatorCalc(record.completion?.quantityIroned) <= 0
      const checkPassSuccess =
        numberValidatorCalc(record.quantityPO) - numberValidatorCalc(record.completion?.quantityCheckPassed) <= 0
      const packageSuccess =
        numberValidatorCalc(record.quantityPO) - numberValidatorCalc(record.completion?.quantityPackaged) <= 0
      const success = ironedSuccess && checkPassSuccess && packageSuccess
      return (
        <EditableStateCell isEditing={false} dataIndex='productCode' title='Mã hàng' inputType='text' required={true}>
          <Space size={2} direction='horizontal'>
            <SkyTableTypography strong status={'active'}>
              {textValidatorDisplay(record.productCode)}
              {success && (
                <Check size={16} color='#ffffff' className='relative top-[2px] mx-1 rounded-full bg-success p-[2px]' />
              )}
            </SkyTableTypography>
          </Space>
        </EditableStateCell>
      )
    },
    quantityPO: (record: CompletionTableDataType) => {
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
    productColor: (record: CompletionTableDataType) => {
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
    ironed: {
      quantityIroned: (record: CompletionTableDataType) => {
        return (
          <EditableStateCell
            isEditing={table.isEditing(record.key)}
            dataIndex='quantityIroned'
            title='SL ủi được'
            inputType='number'
            required={true}
            initialValue={record.completion && numberValidatorInit(record.completion.quantityIroned)}
            value={newRecord?.quantityIroned}
            onValueChange={(val: number) =>
              setNewRecord((prev) => {
                return { ...prev, quantityIroned: numberValidatorChange(val > 0 ? val : 0) }
              })
            }
          >
            <SkyTableTypography status={record.completion?.status}>
              {numberValidatorDisplay(record.completion?.quantityIroned)}
            </SkyTableTypography>
          </EditableStateCell>
        )
      },
      remainingAmount: (record: CompletionTableDataType) => {
        const amount = record.completion?.quantityIroned
          ? numberValidatorCalc(record.quantityPO) - numberValidatorCalc(record.completion.quantityIroned)
          : 0

        return (
          <EditableStateCell
            dataIndex='remainingAmount'
            title='Còn lại'
            isEditing={table.isEditing(record.key)}
            editableRender={<SkyTableTypography status={record.status}>{amount}</SkyTableTypography>}
            initialValue={amount}
            inputType='number'
          >
            <SkyTableTypography status={record.status}>{numberValidatorDisplay(amount)}</SkyTableTypography>
          </EditableStateCell>
        )
      }
    },
    checkPass: {
      quantityCheckPassed: (record: CompletionTableDataType) => {
        return (
          <EditableStateCell
            isEditing={table.isEditing(record.key)}
            dataIndex='quantityCheckPassed'
            title='SL kiểm đạt'
            inputType='number'
            required={true}
            initialValue={record.completion && numberValidatorInit(record.completion.quantityCheckPassed)}
            value={newRecord?.quantityCheckPassed}
            onValueChange={(val: number) =>
              setNewRecord((prev) => {
                return { ...prev, quantityCheckPassed: numberValidatorChange(val > 0 ? val : 0) }
              })
            }
          >
            <SkyTableTypography status={record.completion?.status}>
              {numberValidatorDisplay(record.completion?.quantityCheckPassed)}
            </SkyTableTypography>
          </EditableStateCell>
        )
      },
      remainingAmount: (record: CompletionTableDataType) => {
        const amount = record.completion?.quantityCheckPassed
          ? numberValidatorCalc(record.quantityPO) - numberValidatorCalc(record.completion.quantityCheckPassed)
          : 0
        return (
          <EditableStateCell
            dataIndex='remainingAmount'
            title='Còn lại'
            isEditing={table.isEditing(record.key)}
            editableRender={<SkyTableTypography status={record.status}>{amount}</SkyTableTypography>}
            initialValue={amount}
            inputType='number'
          >
            <SkyTableTypography status={record.status}>{numberValidatorDisplay(amount)}</SkyTableTypography>
          </EditableStateCell>
        )
      }
    },
    packaged: {
      quantityPackaged: (record: CompletionTableDataType) => {
        return (
          <EditableStateCell
            isEditing={table.isEditing(record.key)}
            dataIndex='quantityPackaged'
            title='SL kiểm đạt'
            inputType='number'
            required={true}
            initialValue={record.completion && numberValidatorInit(record.completion.quantityPackaged)}
            value={newRecord?.quantityPackaged}
            onValueChange={(val: number) =>
              setNewRecord((prev) => {
                return { ...prev, quantityPackaged: numberValidatorChange(val > 0 ? val : 0) }
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
        const amount = record.completion?.quantityPackaged
          ? numberValidatorCalc(record.quantityPO) - numberValidatorCalc(record.completion.quantityPackaged)
          : 0
        return (
          <EditableStateCell
            dataIndex='remainingAmount'
            title='Còn lại'
            isEditing={table.isEditing(record.key)}
            editableRender={<SkyTableTypography status={record.status}>{amount}</SkyTableTypography>}
            initialValue={amount}
            inputType='number'
          >
            <SkyTableTypography status={record.status}>{numberValidatorDisplay(amount)}</SkyTableTypography>
          </EditableStateCell>
        )
      }
    },
    exportedDate: (record: CompletionTableDataType) => {
      return (
        <EditableStateCell
          isEditing={table.isEditing(record.key!)}
          dataIndex='exportedDate'
          title='Ngày xuất hàng'
          inputType='datepicker'
          required={true}
          initialValue={record.completion && dateValidatorInit(record.completion.exportedDate)}
          onValueChange={(val: Dayjs) =>
            setNewRecord({
              ...newRecord,
              exportedDate: dateValidatorChange(val)
            })
          }
        >
          <SkyTableTypography status={record.status}>
            {(record.completion && dateValidatorDisplay(record.completion.exportedDate)) ?? '--/--/----'}
          </SkyTableTypography>
        </EditableStateCell>
      )
    },
    passFIDate: (record: CompletionTableDataType) => {
      return (
        <EditableStateCell
          isEditing={table.isEditing(record.key!)}
          dataIndex='passFIDate'
          title='Pass FI'
          inputType='datepicker'
          required={true}
          initialValue={record.completion && dateValidatorInit(record.completion.passFIDate)}
          onValueChange={(val: Dayjs) =>
            setNewRecord({
              ...newRecord,
              passFIDate: dateValidatorChange(val)
            })
          }
        >
          <SkyTableTypography status={record.status}>
            {(record.completion && dateValidatorDisplay(record.completion.passFIDate)) ?? '--/--/----'}
          </SkyTableTypography>
        </EditableStateCell>
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
      }
    },
    // {
    //   title: 'Số lượng PO',
    //   dataIndex: 'quantityPO',
    //   width: '10%',
    //   responsive: ['sm'],
    //   render: (_value: any, record: CompletionTableDataType) => {
    //     return columns.quantityPO(record)
    //   }
    // },
    {
      title: 'Màu',
      dataIndex: 'colorID',
      width: '10%',
      responsive: ['sm'],
      render: (_value: any, record: CompletionTableDataType) => {
        return columns.productColor(record)
      }
    },
    {
      title: 'Ủi',
      responsive: ['md'],
      children: [
        {
          title: 'SL ủi được',
          dataIndex: 'quantityIroned',
          width: '10%',
          render: (_value: any, record: CompletionTableDataType) => {
            return columns.ironed.quantityIroned(record)
          }
        },
        {
          title: 'Còn lại',
          dataIndex: 'remainingAmount',
          width: '10%',
          render: (_value: any, record: CompletionTableDataType) => {
            return columns.ironed.remainingAmount(record)
          }
        }
      ]
    },
    {
      title: 'Kiểm',
      responsive: ['lg'],
      children: [
        {
          title: 'SL kiểm đạt',
          dataIndex: 'quantityCheckPassed',
          width: '10%',
          render: (_value: any, record: CompletionTableDataType) => {
            return columns.checkPass.quantityCheckPassed(record)
          }
        },
        {
          title: 'Còn lại',
          dataIndex: 'remainingAmount',
          width: '10%',
          render: (_value: any, record: CompletionTableDataType) => {
            return columns.checkPass.remainingAmount(record)
          }
        }
      ]
    },
    {
      title: 'Đóng gói',
      responsive: ['xl'],
      children: [
        {
          title: 'SL đóng được',
          dataIndex: 'quantityCheckPassed',
          width: '10%',
          render: (_value: any, record: CompletionTableDataType) => {
            return columns.packaged.quantityPackaged(record)
          }
        },
        {
          title: 'Còn lại',
          dataIndex: 'remainingAmount',
          width: '10%',
          render: (_value: any, record: CompletionTableDataType) => {
            return columns.packaged.remainingAmount(record)
          }
        }
      ]
    },
    {
      title: 'Ngày xuất hàng',
      dataIndex: 'exportedDate',
      responsive: ['xxl'],
      width: '10%',
      render: (_value: any, record: CompletionTableDataType) => {
        return columns.exportedDate(record)
      }
    },
    {
      title: 'Pass FI',
      dataIndex: 'passFIDate',
      responsive: ['xxl'],
      width: '15%',
      render: (_value: any, record: CompletionTableDataType) => {
        return columns.passFIDate(record)
      }
    }
  ]

  return (
    <>
      <BaseLayout
        title='Hoàn thành'
        loading={table.loading}
        searchProps={{
          onSearch: handleSearch,
          placeholder: 'Ví dụ: APEX1234',
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
                setNewRecord({ ...record })
                table.handleStartEditing(record.key)
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
                <Flex vertical className='w-full overflow-hidden md:w-1/2'>
                  <Space direction='vertical' size={10} split={<Divider className='my-0 w-full py-0' />}>
                    {!(width >= breakpoint.sm) && (
                      <ExpandableItemRow className='w-1/2' title='Màu:' isEditing={table.isEditing(record.id!)}>
                        {columns.productColor(record)}
                      </ExpandableItemRow>
                    )}
                    {!(width >= breakpoint.md) && (
                      <Flex vertical align='center' gap={10}>
                        <SkyTableTypography strong className='w-fit'>
                          Ủi
                        </SkyTableTypography>
                        <Flex className='w-full' gap={10} wrap='wrap'>
                          <ExpandableItemRow
                            className='w-1/2 pr-5'
                            title='Ủi được:'
                            isEditing={table.isEditing(record.id!)}
                          >
                            {columns.ironed.quantityIroned(record)}
                          </ExpandableItemRow>
                          <ExpandableItemRow
                            className='w-1/2 pr-5'
                            title='Còn lại:'
                            isEditing={table.isEditing(record.id!)}
                          >
                            {columns.ironed.remainingAmount(record)}
                          </ExpandableItemRow>
                        </Flex>
                      </Flex>
                    )}
                    {!(width >= breakpoint.lg) && (
                      <Flex vertical align='center' gap={10}>
                        <SkyTableTypography strong className='w-fit'>
                          Kiểm
                        </SkyTableTypography>
                        <Flex className='w-full' gap={10} wrap='wrap'>
                          <ExpandableItemRow
                            className='w-1/2 pr-5'
                            title='Kiểm đạt:'
                            isEditing={table.isEditing(record.id!)}
                          >
                            {columns.checkPass.quantityCheckPassed(record)}
                          </ExpandableItemRow>
                          <ExpandableItemRow
                            className='w-1/2 pr-5'
                            title='Còn lại:'
                            isEditing={table.isEditing(record.id!)}
                          >
                            {columns.checkPass.remainingAmount(record)}
                          </ExpandableItemRow>
                        </Flex>
                      </Flex>
                    )}
                    {!(width >= breakpoint.xl) && (
                      <Flex vertical align='center' gap={10}>
                        <SkyTableTypography strong className='w-fit'>
                          Đóng gói
                        </SkyTableTypography>
                        <Flex className='w-full' gap={10} wrap='wrap'>
                          <ExpandableItemRow
                            className='w-1/2 pr-5'
                            title='Đóng được:'
                            isEditing={table.isEditing(record.id!)}
                          >
                            {columns.packaged.quantityPackaged(record)}
                          </ExpandableItemRow>
                          <ExpandableItemRow
                            className='w-1/2 pr-5'
                            title='Còn lại:'
                            isEditing={table.isEditing(record.id!)}
                          >
                            {columns.packaged.remainingAmount(record)}
                          </ExpandableItemRow>
                        </Flex>
                      </Flex>
                    )}
                    {!(width >= breakpoint.xxl) && (
                      <ExpandableItemRow className='w-1/2' title='Pass FI:' isEditing={table.isEditing(record.id!)}>
                        {columns.passFIDate(record)}
                      </ExpandableItemRow>
                    )}
                    {!(width >= breakpoint.xxl) && (
                      <ExpandableItemRow className='w-1/2' title='Ngày xuất:' isEditing={table.isEditing(record.id!)}>
                        {columns.exportedDate(record)}
                      </ExpandableItemRow>
                    )}
                  </Space>
                </Flex>
              )
            },
            columnWidth: '0.001%',
            showExpandColumn: !(width >= breakpoint.xxl)
          }}
        />
      </BaseLayout>
    </>
  )
}

export default FinishPage
