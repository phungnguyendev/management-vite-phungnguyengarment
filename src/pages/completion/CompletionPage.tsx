import { ColorPicker, Divider, Flex, Space } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { Dayjs } from 'dayjs'
import { Check } from 'lucide-react'
import React from 'react'
import { useSelector } from 'react-redux'
import useDevice from '~/components/hooks/useDevice'
import useTable, { TableItemWithKey } from '~/components/hooks/useTable'
import useTitle from '~/components/hooks/useTitle'
import BaseLayout from '~/components/layout/BaseLayout'
import EditableStateCell from '~/components/sky-ui/SkyTable/EditableStateCell'
import ExpandableItemRow from '~/components/sky-ui/SkyTable/ExpandableItemRow'
import SkyTable from '~/components/sky-ui/SkyTable/SkyTable'
import SkyTableTypography from '~/components/sky-ui/SkyTable/SkyTableTypography'
import { RootState } from '~/store/store'
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
import useCompletion from './hooks/useCompletion'
import { CompletionTableDataType } from './type'

interface Props extends React.HTMLAttributes<HTMLElement> {}

const FinishPage: React.FC<Props> = () => {
  const table = useTable<CompletionTableDataType>([])
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
  } = useCompletion(table)
  const { width } = useDevice()
  const currentUser = useSelector((state: RootState) => state.user)
  useTitle('Hoàn thành')

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
            isEditing={table.isEditing(record.id!)}
            dataIndex='quantityIroned'
            title='SL ủi được'
            inputType='number'
            required={true}
            initialValue={record.completion && numberValidatorInit(record.completion.quantityIroned)}
            value={newRecord.quantityIroned}
            onValueChange={(val) =>
              setNewRecord({
                ...newRecord,
                quantityIroned: val > 0 ? numberValidatorChange(val) : null
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
            isEditing={table.isEditing(record.id!)}
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
            isEditing={table.isEditing(record.id!)}
            dataIndex='quantityCheckPassed'
            title='SL kiểm đạt'
            inputType='number'
            required={true}
            initialValue={record.completion && numberValidatorInit(record.completion.quantityCheckPassed)}
            value={newRecord.quantityCheckPassed}
            onValueChange={(val) =>
              setNewRecord({
                ...newRecord,
                quantityCheckPassed: val > 0 ? numberValidatorChange(val) : null
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
            isEditing={table.isEditing(record.id!)}
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
            isEditing={table.isEditing(record.id!)}
            dataIndex='quantityPackaged'
            title='SL kiểm đạt'
            inputType='number'
            required={true}
            initialValue={record.completion && numberValidatorInit(record.completion.quantityPackaged)}
            value={newRecord.quantityPackaged}
            onValueChange={(val) =>
              setNewRecord({
                ...newRecord,
                quantityPackaged: val > 0 ? numberValidatorChange(val) : null
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
            isEditing={table.isEditing(record.id!)}
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
          render: (_value: any, record: TableItemWithKey<CompletionTableDataType>) => {
            return columns.ironed.quantityIroned(record)
          }
        },
        {
          title: 'Còn lại',
          dataIndex: 'remainingAmount',
          width: '10%',
          render: (_value: any, record: TableItemWithKey<CompletionTableDataType>) => {
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
          render: (_value: any, record: TableItemWithKey<CompletionTableDataType>) => {
            return columns.checkPass.quantityCheckPassed(record)
          }
        },
        {
          title: 'Còn lại',
          dataIndex: 'remainingAmount',
          width: '10%',
          render: (_value: any, record: TableItemWithKey<CompletionTableDataType>) => {
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
          render: (_value: any, record: TableItemWithKey<CompletionTableDataType>) => {
            return columns.packaged.quantityPackaged(record)
          }
        },
        {
          title: 'Còn lại',
          dataIndex: 'remainingAmount',
          width: '10%',
          render: (_value: any, record: TableItemWithKey<CompletionTableDataType>) => {
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
      render: (_value: any, record: TableItemWithKey<CompletionTableDataType>) => {
        return columns.exportedDate(record)
      }
    },
    {
      title: 'Pass FI',
      dataIndex: 'passFIDate',
      responsive: ['xxl'],
      width: '15%',
      render: (_value: any, record: TableItemWithKey<CompletionTableDataType>) => {
        return columns.passFIDate(record)
      }
    }
  ]

  // const expandableColumns: ColumnsType<CompletionTableDataType> = [
  //   {
  //     title: 'Ủi',
  //     responsive: ['md'],
  //     children: [
  //       {
  //         title: 'SL ủi được',
  //         dataIndex: 'quantityIroned',
  //         width: '10%',
  //         render: (_value: any, record: TableItemWithKey<CompletionTableDataType>) => {
  //           return columns.ironed.quantityIroned(record)
  //         }
  //       },
  //       {
  //         title: 'Còn lại',
  //         dataIndex: 'remainingAmount',
  //         width: '10%',
  //         render: (_value: any, record: TableItemWithKey<CompletionTableDataType>) => {
  //           return columns.ironed.remainingAmount(record)
  //         }
  //       }
  //     ]
  //   },
  //   {
  //     title: 'Kiểm',
  //     responsive: ['lg'],
  //     children: [
  //       {
  //         title: 'SL kiểm đạt',
  //         dataIndex: 'quantityCheckPassed',
  //         width: '10%',
  //         render: (_value: any, record: TableItemWithKey<CompletionTableDataType>) => {
  //           return columns.checkPass.quantityCheckPassed(record)
  //         }
  //       },
  //       {
  //         title: 'Còn lại',
  //         dataIndex: 'remainingAmount',
  //         width: '10%',
  //         render: (_value: any, record: TableItemWithKey<CompletionTableDataType>) => {
  //           return columns.checkPass.remainingAmount(record)
  //         }
  //       }
  //     ]
  //   },
  //   {
  //     title: 'Đóng gói',
  //     responsive: ['xl'],
  //     children: [
  //       {
  //         title: 'SL đóng được',
  //         dataIndex: 'quantityCheckPassed',
  //         width: '10%',
  //         render: (_value: any, record: TableItemWithKey<CompletionTableDataType>) => {
  //           return columns.packaged.quantityPackaged(record)
  //         }
  //       },
  //       {
  //         title: 'Còn lại',
  //         dataIndex: 'remainingAmount',
  //         width: '10%',
  //         render: (_value: any, record: TableItemWithKey<CompletionTableDataType>) => {
  //           return columns.packaged.remainingAmount(record)
  //         }
  //       }
  //     ]
  //   },
  //   {
  //     title: 'Ngày xuất hàng',
  //     dataIndex: 'exportedDate',
  //     responsive: ['xxl'],
  //     width: '10%',
  //     render: (_value: any, record: TableItemWithKey<CompletionTableDataType>) => {
  //       return columns.exportedDate(record)
  //     }
  //   },
  //   {
  //     title: 'Pass FI',
  //     dataIndex: 'passFIDate',
  //     responsive: ['xxl'],
  //     width: '15%',
  //     render: (_value: any, record: TableItemWithKey<CompletionTableDataType>) => {
  //       return columns.passFIDate(record)
  //     }
  //   }
  // ]

  return (
    <>
      <BaseLayout
        title='Hoàn thành'
        searchPlaceHolder='Mã hàng...'
        searchValue={searchText}
        onDeletedRecordStateChange={
          currentUser.userRoles.includes('admin') || currentUser.userRoles.includes('product_manager')
            ? (enable) => table.setDeletedRecordState(enable)
            : undefined
        }
        onSearchChange={(e) => setSearchText(e.target.value)}
        onSearch={(value) => handleSearch(value)}
        onSortChange={(checked) => handleSortChange(checked)}
        onResetClick={{
          onClick: () => handleResetClick(),
          isShow: true
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
          metaData={productService.metaData}
          onPageChange={handlePageChange}
          isShowDeleted={table.showDeleted}
          actions={{
            onEdit: {
              onClick: (_e, record) => {
                setNewRecord({
                  quantityIroned: record?.completion?.quantityIroned, // Using for compare check box
                  quantityCheckPassed: record?.completion?.quantityCheckPassed, // Using for compare check box
                  quantityPackaged: record?.completion?.quantityPackaged, // Using for compare check box
                  exportedDate: record?.completion?.exportedDate,
                  passFIDate: record?.completion?.passFIDate
                })
                table.handleStartEditing(record!.key!)
              },
              isShow: !table.showDeleted
            },
            onSave: {
              onClick: (_e, record) => handleSaveClick(record!)
            },
            onDelete: {
              onClick: (_e, record) => table.handleStartDeleting(record!.key!),
              isShow: !table.showDeleted
            },
            onConfirmCancelEditing: () => table.handleConfirmCancelEditing(),
            onConfirmCancelDeleting: () => table.handleConfirmCancelDeleting(),
            onConfirmDelete: (record) => handleConfirmDelete(record),
            isShow: currentUser.userRoles.includes('admin') || currentUser.userRoles.includes('completion_manager')
          }}
          expandable={{
            expandedRowRender: (record) => {
              return (
                <Flex vertical className='w-full overflow-hidden md:w-1/2'>
                  <Space direction='vertical' size={10} split={<Divider className='my-0 w-full py-0' />}>
                    {/* {!(width >= breakpoint.sm) && (
                      <ExpandableItemRow title='Số lượng PO' isEditing={table.isEditing(record.id!)}>
                        {columns.ironed.quantityIroned(record)}
                      </ExpandableItemRow>
                    )} */}
                    {/* <Flex className='z-[999] h-[200px] scroll-smooth p-2'>
                      <SkyTable
                        bordered
                        virtual
                        className='absolute'
                        scroll={{
                          x: expandableColumns(record).length > 2 ? 1500 : true,
                          y: 400
                        }}
                        rowKey='id'
                        scrollTo={3}
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
                    </Flex> */}
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
