import { Collapse, ColorPicker, Flex, Typography } from 'antd'
import type { ColumnType } from 'antd/es/table'
import { Dayjs } from 'dayjs'
import useDevice from '~/components/hooks/useDevice'
import useTable from '~/components/hooks/useTable'
import BaseLayout from '~/components/layout/BaseLayout'
import EditableStateCell from '~/components/sky-ui/SkyTable/EditableStateCell'
import SkyTable from '~/components/sky-ui/SkyTable/SkyTable'
import SkyTableTypography from '~/components/sky-ui/SkyTable/SkyTableTypography'
import ImportationTable from '~/pages/importation/components/ImportationTable'
import {
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
import useProduct from '../hooks/useProduct'
import { ProductTableDataType } from '../type'
import ModalAddNewProduct from './ModalAddNewProduct'
import ProductProgressStatus from './ProductProgressStatus'

const ProductTable: React.FC = () => {
  const table = useTable<ProductTableDataType>([])

  const {
    searchText,
    setSearchText,
    newRecord,
    setNewRecord,
    openModal,
    setOpenModal,
    handleResetClick,
    handleSortChange,
    handleSearch,
    handleSaveClick,
    handleAddNewItem,
    handleConfirmDelete,
    handlePageChange,
    productService,
    prints,
    groups,
    colors
  } = useProduct(table)
  const { width } = useDevice()

  const groupCol: ColumnType<ProductTableDataType> = {
    title: 'Nhóm',
    dataIndex: 'groupID',
    width: '10%',
    render: (_value: any, record: ProductTableDataType) => {
      return (
        <>
          <EditableStateCell
            isEditing={table.isEditing(record.key!)}
            dataIndex='groupID'
            title='Nhóm'
            inputType='select'
            required={false}
            onValueChange={(val) => {
              setNewRecord({ ...newRecord, groupID: numberValidatorChange(val) })
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
        </>
      )
    }
  }

  const printCol: ColumnType<ProductTableDataType> = {
    title: 'Nơi in',
    dataIndex: 'printID',
    width: '10%',
    render: (_value: any, record: ProductTableDataType) => {
      return (
        <>
          <EditableStateCell
            isEditing={table.isEditing(record.key!)}
            dataIndex='printID'
            title='Nơi in'
            inputType='select'
            required={true}
            onValueChange={(val: any) => setNewRecord({ ...newRecord, printID: numberValidatorChange(val) })}
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
        </>
      )
    }
  }

  const dateInputNPLCol: ColumnType<ProductTableDataType> = {
    title: 'NPL',
    dataIndex: 'dateInputNPL',
    width: '10%',
    render: (_value: any, record: ProductTableDataType) => {
      return (
        <>
          <EditableStateCell
            isEditing={table.isEditing(record.key!)}
            dataIndex='dateInputNPL'
            title='NPL'
            inputType='datepicker'
            required={true}
            initialValue={dateValidatorInit(record.dateInputNPL)}
            onValueChange={(val: Dayjs) => setNewRecord({ ...newRecord, dateInputNPL: dateValidatorChange(val) })}
          >
            <SkyTableTypography status={'active'}>{dateValidatorDisplay(record.dateInputNPL)}</SkyTableTypography>
          </EditableStateCell>
        </>
      )
    }
  }

  const dateInputFCRCol: ColumnType<ProductTableDataType> = {
    title: 'FCR',
    dataIndex: 'dateOutputFCR',
    width: '10%',
    render: (_value: any, record: ProductTableDataType) => {
      return (
        <>
          <EditableStateCell
            isEditing={table.isEditing(record.key!)}
            dataIndex='dateOutputFCR'
            title='FCR'
            inputType='datepicker'
            required={true}
            initialValue={dateValidatorInit(record.dateOutputFCR)}
            onValueChange={(val: Dayjs) => setNewRecord({ ...newRecord, dateOutputFCR: dateValidatorChange(val) })}
          >
            <SkyTableTypography status={'active'}>
              {record.dateOutputFCR && dateValidatorDisplay(record.dateOutputFCR)}
            </SkyTableTypography>
          </EditableStateCell>
        </>
      )
    }
  }

  const columns: ColumnType<ProductTableDataType>[] = [
    {
      title: 'Mã hàng',
      dataIndex: 'productCode',
      width: '10%',
      render: (_value: any, record: ProductTableDataType) => {
        return (
          <>
            <EditableStateCell
              isEditing={table.isEditing(record.key!)}
              dataIndex='productCode'
              title='Mã hàng'
              inputType='text'
              required={true}
              initialValue={textValidatorInit(record.productCode)}
              value={newRecord.productCode}
              onValueChange={(val) => setNewRecord({ ...newRecord, productCode: textValidatorChange(val) })}
            >
              <SkyTableTypography strong status={'active'}>
                {textValidatorDisplay(record.productCode)}
              </SkyTableTypography>
            </EditableStateCell>
          </>
        )
      }
    },
    {
      title: 'Số lượng PO',
      dataIndex: 'quantityPO',
      width: '10%',
      render: (_value: any, record: ProductTableDataType) => {
        return (
          <>
            <EditableStateCell
              isEditing={table.isEditing(record.key!)}
              dataIndex='quantityPO'
              title='Số lượng PO'
              inputType='number'
              required={true}
              initialValue={numberValidatorInit(record.quantityPO)}
              value={newRecord.quantityPO}
              onValueChange={(val) => setNewRecord({ ...newRecord, quantityPO: numberValidatorChange(val) })}
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
      render: (_value: any, record: ProductTableDataType) => {
        return (
          <>
            <EditableStateCell
              isEditing={table.isEditing(record.key!)}
              dataIndex='colorID'
              title='Màu'
              inputType='colorselector'
              required={false}
              onValueChange={(val) => setNewRecord({ ...newRecord, colorID: numberValidatorChange(val) })}
              selectProps={{
                options: colors.map((i) => {
                  return { label: i.name, value: i.id, key: i.hexColor }
                }),
                defaultValue: numberValidatorInit(record.productColor?.colorID),
                value: newRecord.colorID
              }}
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
    { ...groupCol, responsive: ['xxl'] },
    { ...printCol, responsive: ['xxl'] },
    { ...dateInputNPLCol, responsive: ['xl'] },
    { ...dateInputFCRCol, responsive: ['xl'] }
  ]

  const expandableColumns: ColumnType<ProductTableDataType>[] =
    width < 1600 ? (width < 1200 ? [groupCol, printCol, dateInputNPLCol, dateInputFCRCol] : [groupCol, printCol]) : []

  return (
    <>
      <BaseLayout
        searchPlaceHolder='Mã hàng...'
        searchValue={searchText}
        onDeletedRecordStateChange={(enable) => table.setDeletedRecordState(enable)}
        onSearchChange={(e) => setSearchText(e.target.value)}
        onSearch={(value) => handleSearch(value)}
        onSortChange={(checked) => handleSortChange(checked)}
        onResetClick={{
          onClick: () => handleResetClick()
        }}
        onAddNewClick={{
          onClick: () => setOpenModal(true)
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
                setNewRecord({ ...record })
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
            expandedRowRender: (record: ProductTableDataType) => {
              return (
                <Flex vertical gap={10}>
                  {width < 1600 && (
                    <SkyTable
                      bordered
                      loading={table.loading}
                      columns={expandableColumns}
                      dataSource={table.dataSource.filter((item: ProductTableDataType) => item.id === record.id)}
                      rowClassName='editable-row'
                      metaData={productService.metaData}
                      pagination={false}
                      isShowDeleted={table.showDeleted}
                      editingKey={table.editingKey}
                      deletingKey={table.deletingKey}
                    />
                  )}
                  <Collapse
                    className='w-full'
                    items={[
                      {
                        key: '1',
                        label: (
                          <Typography.Title className='m-0' level={5} type='secondary'>
                            Trạng thái
                          </Typography.Title>
                        ),
                        children: <ProductProgressStatus record={record} />
                      },
                      {
                        key: '2',
                        label: (
                          <Typography.Title className='m-0' level={5} type='secondary'>
                            Nhập khẩu
                          </Typography.Title>
                        ),
                        children: <ImportationTable productRecord={record} />
                      }
                    ]}
                  />
                </Flex>
              )
            },
            columnWidth: '0.001%'
          }}
        />
      </BaseLayout>
      {openModal && (
        <ModalAddNewProduct
          setLoading={table.setLoading}
          loading={table.loading}
          openModal={openModal}
          setOpenModal={setOpenModal}
          onAddNew={handleAddNewItem}
        />
      )}
    </>
  )
}

export default ProductTable
