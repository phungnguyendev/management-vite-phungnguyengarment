import { ColorPicker, Flex, Space } from 'antd'
import { ColumnsType } from 'antd/es/table'
import useTable from '~/components/hooks/useTable'
import BaseLayout from '~/components/layout/BaseLayout'
import EditableStateCell from '~/components/sky-ui/SkyTable/EditableStateCell'
import SkyTable from '~/components/sky-ui/SkyTable/SkyTable'
import SkyTableTypography from '~/components/sky-ui/SkyTable/SkyTableTypography'
import { SewingLine } from '~/typing'
import {
  cn,
  dateValidatorDisplay,
  numberValidatorCalc,
  numberValidatorDisplay,
  textValidatorDisplay
} from '~/utils/helpers'
import useSewingLineDelivery from '../hooks/useSewingLineDelivery'
import { ExpandableTableDataType, SewingLineDeliveryTableDataType } from '../type'

const SewingLineDeliveryTable: React.FC = () => {
  const table = useTable<SewingLineDeliveryTableDataType>([])
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
    sewingLines
  } = useSewingLineDelivery(table)

  const columns: ColumnsType<SewingLineDeliveryTableDataType> = [
    {
      title: 'Mã hàng',
      dataIndex: 'productCode',
      width: '20%',
      render: (_value: any, record: SewingLineDeliveryTableDataType) => {
        return (
          <EditableStateCell isEditing={false} dataIndex='productCode' title='Mã hàng' inputType='text' required={true}>
            <SkyTableTypography status={'active'} className='flex gap-[2px] font-bold'>
              {textValidatorDisplay(record.productCode)}
            </SkyTableTypography>
          </EditableStateCell>
        )
      }
    },
    {
      title: 'Số lượng PO',
      dataIndex: 'quantityPO',
      width: '15%',
      render: (_value: any, record: SewingLineDeliveryTableDataType) => {
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
      title: 'Màu',
      dataIndex: 'colorID',
      width: '15%',
      render: (_value: any, record: SewingLineDeliveryTableDataType) => {
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
      title: 'Chuyền may',
      dataIndex: 'accessoryNotes',
      render: (_value: any, record: SewingLineDeliveryTableDataType) => {
        const sewingLinesFiltered = sewingLines.filter(
          (item) =>
            record.sewingLineDeliveries &&
            record.sewingLineDeliveries.some((recorded) => recorded.sewingLineID === item.id)
        )

        return (
          <EditableStateCell
            isEditing={table.isEditing(record.key!)}
            dataIndex='accessoryNotes'
            title='Chuyền may'
            inputType='multipleselect'
            required={true}
            selectProps={{
              options: sewingLines.map((item) => {
                return {
                  value: item.id,
                  label: item.name
                }
              }),
              defaultValue: sewingLinesFiltered.map((item) => {
                return {
                  value: item.id,
                  label: item.name
                }
              })
            }}
            onValueChange={(values: number[]) => {
              setNewRecord(
                values.map((sewingLineID) => {
                  return {
                    sewingLineID: sewingLineID
                  }
                })
              )
            }}
          >
            <Space size='small' wrap>
              {sewingLinesFiltered.map((item, index) => {
                return (
                  <SkyTableTypography
                    key={index}
                    className='my-[2px] h-6 rounded-sm bg-border px-2 py-1'
                    status={item.status}
                  >
                    {textValidatorDisplay(item.name)}
                    {/* <Divider type='vertical' />
                    <SkyTableTypography code type='success'>
                      {numberValidatorDisplay(
                        record.sewingLineDeliveries?.find((i) => i.sewingLineID === item.id)?.quantityOriginal
                      )}
                    </SkyTableTypography> */}
                  </SkyTableTypography>
                )
              })}
            </Space>
          </EditableStateCell>
        )
      }
    }
  ]

  const expandableColumns = (data: SewingLineDeliveryTableDataType): ColumnsType<ExpandableTableDataType> => {
    const items = sewingLines.filter((item) =>
      data.sewingLineDeliveries
        ? data.sewingLineDeliveries.some((record) => record.sewingLineID === item.id)
        : undefined
    )

    return items.map((item, index) => {
      const disabled =
        data.sewingLineDeliveries && data.sewingLineDeliveries.some((record) => record.sewingLineID === item.id)
      return {
        title: <SkyTableTypography disabled={!disabled}>{item.name}</SkyTableTypography>,
        onHeaderCell: () => {
          return {
            style: {
              background: cn({
                'var(--border)': disabled && index % 2 === 0
              })
            }
          }
        },
        children: [
          {
            title: 'SL Vào chuyền',
            dataIndex: 'quantityOriginal',
            width: '10%',
            render: (_value: any, record: ExpandableTableDataType) => {
              const sewingLineDeliveryRecord = data.sewingLineDeliveries
                ? data.sewingLineDeliveries.find((i) => i.sewingLineID === item.id)
                : {}

              return (
                <EditableStateCell
                  isEditing={table.isEditing(record.key!)}
                  dataIndex='quantityOriginal'
                  title='SL Vào chuyền'
                  inputType='number'
                  required={true}
                  initialValue={record.quantityOriginal && numberValidatorDisplay(record.quantityOriginal)}
                  value={
                    newRecord &&
                    numberValidatorDisplay(newRecord.find((i) => i.sewingLineID === item.id)?.quantityOriginal)
                  }
                >
                  <SkyTableTypography status={record.status}>
                    {numberValidatorDisplay(sewingLineDeliveryRecord?.quantityOriginal)}
                  </SkyTableTypography>
                </EditableStateCell>
              )
            }
          },
          {
            title: 'May được',
            dataIndex: 'sewed',
            width: '10%',
            render: (_value: any, record: ExpandableTableDataType) => {
              const sewingLineDeliveryRecord = data.sewingLineDeliveries
                ? data.sewingLineDeliveries.find((i) => i.sewingLineID === item.id)
                : {}
              return (
                <EditableStateCell
                  isEditing={table.isEditing(record.key!)}
                  dataIndex='sewed'
                  title='May được'
                  inputType='number'
                  required={true}
                  initialValue={record.quantitySewed && numberValidatorDisplay(record.quantitySewed)}
                  value={
                    newRecord &&
                    numberValidatorDisplay(newRecord.find((i) => i.sewingLineID === item.id)?.quantitySewed)
                  }
                >
                  <SkyTableTypography status={record.status}>
                    {numberValidatorDisplay(sewingLineDeliveryRecord?.quantitySewed)}
                  </SkyTableTypography>
                </EditableStateCell>
              )
            }
          },
          {
            title: 'SL Còn lại',
            dataIndex: 'amountQuantity',
            width: '10%',
            render: (_value: any, record: ExpandableTableDataType) => {
              const totalAmount =
                numberValidatorCalc(record.quantityOriginal) - numberValidatorCalc(record.quantitySewed)
              return (
                <EditableStateCell
                  isEditing={false}
                  dataIndex='amountQuantity'
                  title='SL Còn lại'
                  inputType='number'
                  required={true}
                >
                  <SkyTableTypography status={record.status}>{numberValidatorDisplay(totalAmount)}</SkyTableTypography>
                </EditableStateCell>
              )
            }
          },
          {
            title: 'Ngày dự kiến hoàn thành',
            dataIndex: 'expiredDate',
            width: '15%',
            render: (_value: any, record: ExpandableTableDataType) => {
              const sewingLineDeliveryRecord = data.sewingLineDeliveries
                ? data.sewingLineDeliveries.find((i) => i.sewingLineID === item.id)
                : {}
              return (
                <EditableStateCell
                  isEditing={table.isEditing(record.key!)}
                  dataIndex='expiredDate'
                  title='Ngày dự kiến hoàn thành'
                  inputType='datepicker'
                  required={true}
                  initialValue={sewingLineDeliveryRecord?.expiredDate}
                >
                  <SkyTableTypography status={record.status}>
                    {dateValidatorDisplay(sewingLineDeliveryRecord?.expiredDate)}
                  </SkyTableTypography>
                </EditableStateCell>
              )
            }
          }
        ]
      }
    })
  }

  return (
    <>
      <BaseLayout
        searchValue={searchText}
        onDeletedRecordStateChange={(enable) => table.setDeletedRecordState(enable)}
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
          columns={columns}
          className='relative'
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
                if (record?.sewingLineDeliveries) {
                  setNewRecord(
                    record.sewingLineDeliveries.map((item) => {
                      return item as SewingLine
                    })
                  )
                }
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
                  <Flex vertical gap={10} className='relative z-[999] h-[200px] scroll-smooth'>
                    <SkyTable
                      bordered
                      virtual
                      className='absolute'
                      scroll={{
                        x: expandableColumns(record).length > 2 ? 1500 : true,
                        y: 400
                      }}
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
                  </Flex>
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

export default SewingLineDeliveryTable
