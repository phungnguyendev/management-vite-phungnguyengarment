import { Collapse, ColorPicker, Flex, Space, Typography } from 'antd'
import { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'
import useDevice from '~/components/hooks/useDevice'
import useTitle from '~/components/hooks/useTitle'
import BaseLayout from '~/components/layout/BaseLayout'
import EditableStateCell from '~/components/sky-ui/SkyTable/EditableStateCell'
import SkyTable from '~/components/sky-ui/SkyTable/SkyTable'
import SkyTableExpandableItemRow from '~/components/sky-ui/SkyTable/SkyTableExpandableItemRow'
import SkyTableExpandableLayout from '~/components/sky-ui/SkyTable/SkyTableExpandableLayout'
import SkyTableTypography from '~/components/sky-ui/SkyTable/SkyTableTypography'
import { SewingLineDelivery } from '~/typing'
import {
  breakpoint,
  dateValidatorDisplay,
  numberValidator,
  numberValidatorCalc,
  numberValidatorDisplay,
  textValidatorDisplay
} from '~/utils/helpers'
import useSewingLineDeliveryViewModel from './hooks/useSewingLineDeliveryViewModel'
import { SewingLineDeliveryTableDataType } from './type'

const SewingLineDeliveryPage = () => {
  useTitle('Chuyền may | Phung Nguyen')
  const { state, action, table } = useSewingLineDeliveryViewModel()
  const { sewingLines, newRecord, setNewRecord, showDeleted, setShowDeleted, searchTextChange, setSearchTextChange } =
    state
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

  const expiredDateStatus = (date1?: string | undefined, date2?: string | undefined): boolean => {
    return date1 && date2 ? (dayjs(date1).diff(date2, 'days') < 5 ? true : false) : false
  }

  const columns = {
    productCode: (record: SewingLineDeliveryTableDataType) => {
      return (
        <EditableStateCell isEditing={false} dataIndex='productCode' title='Mã hàng' inputType='text' required>
          <SkyTableTypography status={'active'} className='flex gap-[2px] font-bold'>
            {textValidatorDisplay(record.productCode)}
          </SkyTableTypography>
        </EditableStateCell>
      )
    },
    quantityPO: (record: SewingLineDeliveryTableDataType) => {
      return (
        <EditableStateCell isEditing={false} dataIndex='quantityPO' title='Số lượng PO' inputType='number' required>
          <SkyTableTypography status={'active'}>{numberValidatorDisplay(record.quantityPO)}</SkyTableTypography>
        </EditableStateCell>
      )
    },
    dateOutputFCR: (record: SewingLineDeliveryTableDataType) => {
      return (
        <EditableStateCell isEditing={false} dataIndex='dateOutputFCR' title='FCR' inputType='datepicker' required>
          <SkyTableTypography status={'active'}>
            {record.dateOutputFCR && dateValidatorDisplay(record.dateOutputFCR)}
          </SkyTableTypography>
        </EditableStateCell>
      )
    },
    productColor: (record: SewingLineDeliveryTableDataType) => {
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
    sewingLines: (record: SewingLineDeliveryTableDataType) => {
      const sewingLinesFiltered = sewingLines.filter(
        (item) =>
          record.sewingLineDeliveries &&
          record.sewingLineDeliveries.some((recorded) => recorded.sewingLineID === item.id)
      )
      return (
        <EditableStateCell
          isEditing={table.isEditing(record.key!)}
          dataIndex='sewingLines'
          title='Chuyền may'
          inputType='multipleselect'
          required
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
                } as SewingLineDelivery
              })
            )
          }}
        >
          <Space size='small' wrap>
            {sewingLinesFiltered.map((item, index) => {
              return (
                <SkyTableTypography
                  key={index}
                  className='my-[2px] h-6 rounded-sm bg-lightGrey px-2 py-1'
                  type={
                    expiredDateStatus(
                      record.dateOutputFCR,
                      record.sewingLineDeliveries?.find((i) => i.sewingLineID === item.id)?.expiredDate
                    )
                      ? 'danger'
                      : undefined
                  }
                  status={item.status}
                >
                  {textValidatorDisplay(item.name)}
                </SkyTableTypography>
              )
            })}
          </Space>
        </EditableStateCell>
      )
    }
  }

  const tableColumns: ColumnsType<SewingLineDeliveryTableDataType> = [
    {
      title: 'Mã hàng',
      dataIndex: 'productCode',
      width: '15%',
      render: (_value: any, record: SewingLineDeliveryTableDataType) => {
        return columns.productCode(record)
      }
    },
    {
      title: 'Số lượng PO',
      dataIndex: 'quantityPO',
      width: '10%',
      responsive: ['md'],
      render: (_value: any, record: SewingLineDeliveryTableDataType) => {
        return columns.quantityPO(record)
      }
    },
    {
      title: 'Màu',
      dataIndex: 'colorID',
      width: '15%',
      responsive: ['sm'],
      render: (_value: any, record: SewingLineDeliveryTableDataType) => {
        return columns.productColor(record)
      }
    },
    {
      title: 'Ngày xuất FCR',
      dataIndex: 'dateOutputFCR',
      width: '15%',
      responsive: ['lg'],
      render: (_value: any, record: SewingLineDeliveryTableDataType) => {
        return columns.dateOutputFCR(record)
      }
    },
    {
      title: 'Chuyền may',
      dataIndex: 'sewingLines',
      responsive: ['xl'],
      render: (_value: any, record: SewingLineDeliveryTableDataType) => {
        return columns.sewingLines(record)
      }
    }
  ]

  const expandableListColumn = {
    quantityOriginal: (record: SewingLineDeliveryTableDataType, item: SewingLineDelivery) => {
      return (
        <EditableStateCell
          isEditing={table.isEditing(record.key)}
          dataIndex='quantityOriginal'
          title='SL Vào chuyền'
          inputType='number'
          required
          defaultValue={item.quantityOriginal && numberValidatorDisplay(item.quantityOriginal)}
          value={
            newRecord && numberValidator(newRecord.find((i) => i.sewingLineID === item.sewingLineID)?.quantityOriginal)
          }
          onValueChange={(val) => {
            const index = newRecord.findIndex((j) => j.sewingLineID === item.sewingLineID)
            if (index !== -1) {
              newRecord[index].quantityOriginal = val
              setNewRecord([...newRecord])
            }
          }}
        >
          <SkyTableTypography status={record.status}>
            {numberValidatorDisplay(item?.quantityOriginal)}
          </SkyTableTypography>
        </EditableStateCell>
      )
    },
    quantitySewed: (record: SewingLineDeliveryTableDataType, item: SewingLineDelivery) => {
      return (
        <EditableStateCell
          isEditing={table.isEditing(record.key)}
          dataIndex='quantitySewed'
          title='May được'
          inputType='number'
          required
          defaultValue={item.quantitySewed && numberValidatorDisplay(item.quantitySewed)}
          value={
            newRecord && numberValidator(newRecord.find((i) => i.sewingLineID === item.sewingLine?.id)?.quantitySewed)
          }
          onValueChange={(val) => {
            const index = newRecord.findIndex((j) => j.sewingLineID === item.sewingLineID)
            if (index !== -1) {
              newRecord[index].quantitySewed = val
              setNewRecord([...newRecord])
            }
          }}
        >
          <SkyTableTypography status={record.status}>{numberValidatorDisplay(item?.quantitySewed)}</SkyTableTypography>
        </EditableStateCell>
      )
    },
    amountQuantity: (record: SewingLineDeliveryTableDataType, item: SewingLineDelivery) => {
      return (
        <EditableStateCell isEditing={false} dataIndex='amountQuantity' title='SL còn lại' inputType='number' required>
          <SkyTableTypography status={record.status}>
            {numberValidatorDisplay(
              numberValidatorCalc(item?.quantityOriginal) - numberValidatorCalc(item?.quantitySewed)
            )}
          </SkyTableTypography>
        </EditableStateCell>
      )
    },
    expiredDate: (record: SewingLineDeliveryTableDataType, item: SewingLineDelivery) => {
      return (
        <EditableStateCell
          isEditing={table.isEditing(record.key)}
          dataIndex='expiredDate'
          title='Ngày dự kiến hoàn thành'
          inputType='datepicker'
          required
          defaultValue={item.expiredDate && dayjs(item.expiredDate)}
          datePickerProps={{
            format: 'DD/MM/YYYY'
          }}
          onValueChange={(val) => {
            const index = newRecord.findIndex((j) => j.sewingLineID === item.sewingLineID)
            if (index !== -1) {
              newRecord[index].expiredDate = val
              setNewRecord([...newRecord])
            }
          }}
        >
          <SkyTableTypography
            type={expiredDateStatus(record.dateOutputFCR, item.expiredDate) ? 'danger' : undefined}
            status={record.status}
          >
            {dateValidatorDisplay(item?.expiredDate)}
          </SkyTableTypography>
        </EditableStateCell>
      )
    }
  }

  return (
    <>
      <BaseLayout
        title='Chuyền may'
        loading={table.loading}
        searchProps={{
          onSearch: handleSearch,
          placeholder: 'Chuyền..',
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
          className='relative'
          editingKey={table.editingKey}
          deletingKey={table.deletingKey}
          dataSource={table.dataSource}
          rowClassName='editable-row'
          onPageChange={handlePageChange}
          isShowDeleted={showDeleted}
          actionProps={{
            onEdit: {
              handleClick: (record) => {
                // setNewRecord({ ...record } )
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
            expandedRowRender: (record: SewingLineDeliveryTableDataType) => {
              return (
                <>
                  <SkyTableExpandableLayout>
                    {!(width >= breakpoint.sm) && (
                      <SkyTableExpandableItemRow className='w-1/2' title='Màu:' isEditing={table.isEditing(record.key)}>
                        {columns.productColor(record)}
                      </SkyTableExpandableItemRow>
                    )}
                    {!(width >= breakpoint.md) && (
                      <SkyTableExpandableItemRow className='w-1/2' title='Số lượng PO:' isEditing={false}>
                        {columns.quantityPO(record)}
                      </SkyTableExpandableItemRow>
                    )}
                    {!(width >= breakpoint.lg) && (
                      <SkyTableExpandableItemRow
                        className='w-1/2'
                        title='Ngày xuất FCR:'
                        isEditing={table.isEditing(record.key)}
                      >
                        {columns.dateOutputFCR(record)}
                      </SkyTableExpandableItemRow>
                    )}
                    {!(width >= breakpoint.xl) && (
                      <SkyTableExpandableItemRow
                        className='w-1/2'
                        title='Chuyền may:'
                        isEditing={table.isEditing(record.key)}
                      >
                        {columns.sewingLines(record)}
                      </SkyTableExpandableItemRow>
                    )}
                    <Collapse
                      items={[
                        {
                          key: '1',
                          label: (
                            <Typography.Title className='m-0' level={5} type='secondary'>
                              Danh sách chuyền may
                            </Typography.Title>
                          )
                          // children: (
                          //   <List
                          //     // grid={{ gutter: 16, xs: 1, sm: 2, md: 4, lg: 4, xl: 6, xxl: 3 }}
                          //     itemLayout='vertical'
                          //     dataSource={record.sewingLineDeliveries}
                          //     renderItem={(recordItem, index) => (
                          //       <List.Item key={index}>
                          //         <Flex vertical gap={20} align='center' className='w-full'>
                          //           <SkyTableTypography className='w-fit' strong>
                          //             {textValidatorDisplay(recordItem.sewingLine?.name)}{' '}
                          //             {expiredDateStatus(record.dateOutputFCR, recordItem.expiredDate) ? (
                          //               <span className='text-error'>{'(Bị bể)'}</span>
                          //             ) : (
                          //               ''
                          //             )}
                          //           </SkyTableTypography>
                          //           <SkyTableExpandableItemRow
                          //             className='w-1/2'
                          //             title='SL vào chuyền:'
                          //             isEditing={table.isEditing(recordItem.id!)}
                          //           >
                          //             {expandableListColumn.quantityOriginal(record, recordItem)}
                          //           </SkyTableExpandableItemRow>
                          //           <SkyTableExpandableItemRow
                          //             className='w-1/2'
                          //             title='SL may được:'
                          //             isEditing={table.isEditing(recordItem.id!)}
                          //           >
                          //             {expandableListColumn.quantitySewed(record, recordItem)}
                          //           </SkyTableExpandableItemRow>
                          //           <SkyTableExpandableItemRow
                          //             className='w-1/2'
                          //             title='SL còn lại:'
                          //             isEditing={table.isEditing(recordItem.id!)}
                          //           >
                          //             {expandableListColumn.amountQuantity(record, recordItem)}
                          //           </SkyTableExpandableItemRow>
                          //           <SkyTableExpandableItemRow
                          //             className='w-1/2'
                          //             title='Ngày dự kiến hoàn thành:'
                          //             isEditing={table.isEditing(recordItem.id!)}
                          //           >
                          //             {expandableListColumn.expiredDate(record, recordItem)}
                          //           </SkyTableExpandableItemRow>
                          //         </Flex>
                          //       </List.Item>
                          //     )}
                          //   />
                          // )
                        }
                      ]}
                    />

                    {/* <Flex className='z-[999] h-[200px] scroll-smooth p-2'>
                      <SkyTable
                        bordered
                        virtual
                        className='absolute'
                        scroll={{
                          x: expandableTableColumns(record).length > 2 ? 1500 : true,
                          y: 400
                        }}
                        rowKey='id'
                        scrollTo={3}
                        loading={table.loading}
                        columns={expandableTableColumns(record)}
                        rowClassName='editable-row'
                        dataSource={table.dataSource.filter((item) => item.id === record.id)}
                        metaData={productService.metaData}
                        pagination={false}
                        isShowDeleted={table.showDeleted}
                        editingKey={table.editingKey}
                        deletingKey={table.deletingKey}
                      />
                    </Flex> */}
                  </SkyTableExpandableLayout>
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

export default SewingLineDeliveryPage
