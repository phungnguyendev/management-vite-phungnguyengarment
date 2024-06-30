import { ColorPicker, Flex } from 'antd'
import type { ColumnType } from 'antd/es/table'
import { Dayjs } from 'dayjs'
import useDevice from '~/components/hooks/useDevice'
import useTitle from '~/components/hooks/useTitle'
import BaseLayout from '~/components/layout/BaseLayout'
import EditableStateCell from '~/components/sky-ui/SkyTable/EditableStateCell'
import SkyTable from '~/components/sky-ui/SkyTable/SkyTable'
import SkyTableExpandableItemRow from '~/components/sky-ui/SkyTable/SkyTableExpandableItemRow'
import SkyTableExpandableLayout from '~/components/sky-ui/SkyTable/SkyTableExpandableLayout'
import SkyTableTypography from '~/components/sky-ui/SkyTable/SkyTableTypography'
import {
  breakpoint,
  dateValidatorChange,
  dateValidatorDisplay,
  dateValidatorInit,
  numberValidatorChange,
  numberValidatorDisplay,
  numberValidatorInit,
  textValidatorChange,
  textValidatorDisplay,
  textValidatorInit
} from '~/utils/helpers'
import ModalAddNewProduct from './components/ModalAddNewProduct'
import useProductViewModel from './hooks/useProductViewModel'
import { ProductTableDataType } from './type'

const ProductPage = () => {
  useTitle('Products | Phung Nguyen')
  const { width } = useDevice()
  const { state, action, table } = useProductViewModel()
  const {
    showDeleted,
    newRecord,
    setNewRecord,
    openModal,
    setOpenModal,
    colors,
    groups,
    prints,
    searchText,
    setSearchText
  } = state
  const {
    handleAddNew,
    handleUpdate,
    handleDelete,
    handleDeleteForever,
    handlePageChange,
    handleRestore,
    handleSearch,
    handleSortChange
  } = action

  const columns = {
    title: (record: ProductTableDataType) => {
      return (
        <EditableStateCell
          isEditing={table.isEditing(record.key!)}
          dataIndex='productCode'
          title='Mã hàng'
          inputType='text'
          required={true}
          initialValue={textValidatorInit(record.productCode)}
          value={newRecord.productCode}
          onValueChange={(val: string) =>
            setNewRecord((prev) => {
              return { ...prev, productCode: textValidatorChange(val.trim()) }
            })
          }
        >
          <SkyTableTypography strong status={'active'}>
            {textValidatorDisplay(record.productCode)}
          </SkyTableTypography>
        </EditableStateCell>
      )
    },
    quantityPO: (record: ProductTableDataType) => {
      return (
        <EditableStateCell
          isEditing={table.isEditing(record.key!)}
          dataIndex='quantityPO'
          title='Số lượng PO'
          inputType='number'
          required={true}
          initialValue={numberValidatorInit(record.quantityPO)}
          value={newRecord.quantityPO}
          onValueChange={(val: number) =>
            setNewRecord((prev) => {
              return { ...prev, quantityPO: numberValidatorChange(val) }
            })
          }
        >
          <SkyTableTypography status={'active'}>{numberValidatorDisplay(record.quantityPO)}</SkyTableTypography>
        </EditableStateCell>
      )
    },
    productColor: (record: ProductTableDataType) => {
      return (
        <EditableStateCell
          isEditing={table.isEditing(record.key!)}
          dataIndex='colorID'
          title='Màu'
          inputType='colorselector'
          onValueChange={(val: number) =>
            setNewRecord((prev) => {
              return { ...prev, colorID: numberValidatorChange(val) }
            })
          }
          defaultValue={record.productColor.colorID && record.productColor.colorID}
          selectProps={{
            options: colors.map((color) => {
              return { label: color.name, value: color.id, key: color.hexColor }
            }),
            defaultValue: record.productColor.colorID && record.productColor.colorID,
            value: newRecord.colorID
          }}
        >
          <Flex className='' wrap='wrap' justify='space-between' align='center' gap={10}>
            <SkyTableTypography status={record.productColor.color?.status} className='w-fit'>
              {textValidatorDisplay(record.productColor.color?.name)}
            </SkyTableTypography>
            <ColorPicker size='middle' format='hex' value={record.productColor?.color?.hexColor} disabled />
          </Flex>
        </EditableStateCell>
      )
    },
    productGroup: (record: ProductTableDataType) => {
      return (
        <EditableStateCell
          isEditing={table.isEditing(record.key!)}
          dataIndex='groupID'
          title='Nhóm'
          inputType='select'
          required={false}
          onValueChange={(val) => {
            setNewRecord((prev) => {
              return { ...prev, groupID: numberValidatorChange(val) }
            })
          }}
          selectProps={{
            options: groups.map((i) => {
              return { label: i.name, value: i.id, optionData: i.id }
            }),
            defaultValue: textValidatorInit(record.productGroup?.group?.name)
          }}
        >
          <SkyTableTypography status={record.productGroup?.group?.status}>
            {textValidatorDisplay(record.productGroup?.group?.name)}
          </SkyTableTypography>
        </EditableStateCell>
      )
    },
    printablePlace: (record: ProductTableDataType) => {
      return (
        <EditableStateCell
          isEditing={table.isEditing(record.key!)}
          dataIndex='printID'
          title='Nơi in'
          inputType='select'
          required={true}
          onValueChange={(val: number) =>
            setNewRecord((prev) => {
              return { ...prev, printID: numberValidatorChange(val) }
            })
          }
          selectProps={{
            options: prints.map((i) => {
              return { label: i.name, value: i.id, optionData: i.id }
            }),
            defaultValue: textValidatorInit(record.printablePlace?.print?.name)
          }}
        >
          <SkyTableTypography status={record.printablePlace?.print?.status}>
            {textValidatorDisplay(record.printablePlace?.print?.name)}
          </SkyTableTypography>
        </EditableStateCell>
      )
    },
    dateInputNPL: (record: ProductTableDataType) => {
      return (
        <EditableStateCell
          isEditing={table.isEditing(record.key!)}
          dataIndex='dateInputNPL'
          title='NPL'
          inputType='datepicker'
          required={true}
          initialValue={dateValidatorInit(record.dateInputNPL)}
          onValueChange={(val: Dayjs) =>
            setNewRecord((prev) => {
              return { ...prev, dateInputNPL: dateValidatorChange(val) }
            })
          }
        >
          <SkyTableTypography status={'active'}>{dateValidatorDisplay(record.dateInputNPL)}</SkyTableTypography>
        </EditableStateCell>
      )
    },
    dateOutputFCR: (record: ProductTableDataType) => {
      return (
        <EditableStateCell
          isEditing={table.isEditing(record.key!)}
          dataIndex='dateOutputFCR'
          title='FCR'
          inputType='datepicker'
          required={true}
          initialValue={dateValidatorInit(record.dateOutputFCR)}
          onValueChange={(val: Dayjs) =>
            setNewRecord((prev) => {
              return { ...prev, dateOutputFCR: dateValidatorChange(val) }
            })
          }
        >
          <SkyTableTypography status={'active'}>{dateValidatorDisplay(record.dateOutputFCR)}</SkyTableTypography>
        </EditableStateCell>
      )
    }
  }

  const tableColumns: ColumnType<ProductTableDataType>[] = [
    {
      title: 'Mã hàng',
      dataIndex: 'productCode',
      width: '10%',
      render: (_value: any, record: ProductTableDataType) => {
        return columns.title(record)
      }
    },
    {
      title: 'Số lượng PO',
      dataIndex: 'quantityPO',
      width: '7%',
      responsive: ['sm'],
      render: (_value: any, record: ProductTableDataType) => {
        return columns.quantityPO(record)
      }
    },
    {
      title: 'Màu',
      dataIndex: 'colorID',
      width: '10%',
      responsive: ['sm'],
      render: (_value: any, record: ProductTableDataType) => {
        return columns.productColor(record)
      }
    },
    {
      title: 'Nhóm',
      dataIndex: 'groupID',
      width: '7%',
      responsive: ['xl'],
      render: (_value: any, record: ProductTableDataType) => {
        return columns.productGroup(record)
      }
    },
    {
      title: 'Nơi in',
      dataIndex: 'printID',
      width: '10%',
      responsive: ['xxl'],
      render: (_value: any, record: ProductTableDataType) => {
        return columns.printablePlace(record)
      }
    },
    {
      title: 'Ngày nhập NPL',
      dataIndex: 'dateInputNPL',
      width: '10%',
      responsive: ['md'],
      render: (_value: any, record: ProductTableDataType) => {
        return columns.dateInputNPL(record)
      }
    },
    {
      title: 'Ngày xuất FCR',
      dataIndex: 'dateOutputFCR',
      width: '10%',
      responsive: ['lg'],
      render: (_value: any, record: ProductTableDataType) => {
        return columns.dateOutputFCR(record)
      }
    }
  ]

  return (
    <>
      <BaseLayout
        title='Danh sách sản phẩm'
        loading={table.loading}
        searchProps={{
          onSearch: handleSearch,
          placeholder: 'Mã hàng..',
          value: searchText,
          onChange: (e) => setSearchText(e.target.value)
        }}
        sortProps={{
          onChange: (checked) => handleSortChange(checked)
        }}
        deleteProps={{
          onChange: () => {}
        }}
        addNewProps={{
          onClick: () => setOpenModal(true)
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
              handleClick: (record) => handleUpdate(record!)
            },
            onDelete: {
              handleClick: (record) => table.handleStartDeleting(record.key),
              isShow: !showDeleted
            },
            onDeleteForever: {
              handleClick: (record) => handleDeleteForever(record!.id!),
              isShow: showDeleted
            },
            onRestore: {
              handleClick: (record) => table.handleStartRestore(record.key),
              isShow: showDeleted
            },
            onConfirmCancelEditing: () => table.handleCancelEditing(),
            onConfirmCancelDeleting: () => table.handleCancelDeleting(),
            onConfirmDelete: (record) => handleDelete(record),
            onConfirmCancelRestore: () => table.handleCancelRestore(),
            onConfirmRestore: (record) => handleRestore(record),
            isShow: true
          }}
          expandable={{
            expandedRowRender: (record: ProductTableDataType) => {
              return (
                <SkyTableExpandableLayout>
                  {!(width >= breakpoint.sm) && (
                    <SkyTableExpandableItemRow
                      className='w-1/2'
                      title='Số lượng PO:'
                      isEditing={table.isEditing(`${record.id}`)}
                    >
                      {columns.quantityPO(record)}
                    </SkyTableExpandableItemRow>
                  )}
                  {!(width >= breakpoint.sm) && (
                    <SkyTableExpandableItemRow
                      className='w-1/2'
                      title='Màu:'
                      isEditing={table.isEditing(`${record.id}`)}
                    >
                      {columns.productColor(record)}
                    </SkyTableExpandableItemRow>
                  )}
                  {!(width >= breakpoint.xl) && (
                    <SkyTableExpandableItemRow
                      className='w-1/2'
                      title='Nhóm:'
                      isEditing={table.isEditing(`${record.id}`)}
                    >
                      {columns.productGroup(record)}
                    </SkyTableExpandableItemRow>
                  )}
                  {!(width >= breakpoint.xxl) && (
                    <SkyTableExpandableItemRow
                      className='w-1/2'
                      title='Nơi in:'
                      isEditing={table.isEditing(`${record.id}`)}
                    >
                      {columns.printablePlace(record)}
                    </SkyTableExpandableItemRow>
                  )}
                  {!(width >= breakpoint.md) && (
                    <SkyTableExpandableItemRow
                      title='Ngày nhập NPL:'
                      className='flex w-1/2 lg:hidden'
                      isEditing={table.isEditing(`${record.id}`)}
                    >
                      {columns.dateInputNPL(record)}
                    </SkyTableExpandableItemRow>
                  )}
                  {!(width >= breakpoint.lg) && (
                    <SkyTableExpandableItemRow
                      className='w-1/2'
                      title='Ngày xuất FCR:'
                      isEditing={table.isEditing(`${record.id}`)}
                    >
                      {columns.dateInputNPL(record)}
                    </SkyTableExpandableItemRow>
                  )}
                  {/* <Collapse
                    items={[
                      {
                        key: '1',
                        label: (
                          <Typography.Title className='m-0' level={5} type='secondary'>
                            Nhập khẩu
                          </Typography.Title>
                        ),
                        children: <ImportationTable productRecord={record} />
                      }
                    ]}
                  /> */}
                </SkyTableExpandableLayout>
              )
            },
            columnWidth: '0.001%'
          }}
        />
      </BaseLayout>
      {openModal && (
        <ModalAddNewProduct
          okButtonProps={{ loading: table.loading }}
          open={openModal}
          setOpenModal={setOpenModal}
          onAddNew={handleAddNew}
        />
      )}
    </>
  )
}

export default ProductPage
