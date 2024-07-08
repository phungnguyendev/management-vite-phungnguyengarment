import { Flex } from 'antd'
import type { ColumnType } from 'antd/es/table'
import { Dayjs } from 'dayjs'
import useDevice from '~/components/hooks/useDevice'
import useTitle from '~/components/hooks/useTitle'
import BaseLayout from '~/components/layout/BaseLayout'
import EditableStateCell from '~/components/sky-ui/SkyTable/EditableStateCell'
import SkyTable from '~/components/sky-ui/SkyTable/SkyTable'
import SkyTableActionRow from '~/components/sky-ui/SkyTable/SkyTableActionRow'
import SkyTableColorPicker from '~/components/sky-ui/SkyTable/SkyTableColorPicker'
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
  const viewModel = useProductViewModel()

  const columns = {
    title: (record: ProductTableDataType) => {
      return (
        <EditableStateCell
          isEditing={viewModel.table.isEditing(record.key)}
          dataIndex='productCode'
          title='Mã hàng'
          inputType='text'
          required
          defaultValue={textValidatorInit(record.productCode)}
          value={viewModel.state.newRecord.productCode}
          onValueChange={(val: string) =>
            viewModel.state.setNewRecord((prev) => {
              return { ...prev, productCode: textValidatorChange(val) }
            })
          }
        >
          <SkyTableTypography strong status={record.status}>
            {textValidatorDisplay(record.productCode)}
          </SkyTableTypography>
        </EditableStateCell>
      )
    },
    quantityPO: (record: ProductTableDataType) => {
      return (
        <EditableStateCell
          isEditing={viewModel.table.isEditing(record.key)}
          dataIndex='quantityPO'
          title='Số lượng PO'
          inputType='number'
          required
          defaultValue={numberValidatorInit(record.quantityPO)}
          value={viewModel.state.newRecord.quantityPO}
          onValueChange={(val: number) =>
            viewModel.state.setNewRecord((prev) => {
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
          isEditing={viewModel.table.isEditing(record.key)}
          dataIndex='colorID'
          title='Màu'
          required
          inputType='colorselector'
          onValueChange={(val: number) =>
            viewModel.state.setNewRecord((prev) => {
              return { ...prev, colorID: numberValidatorChange(val) }
            })
          }
          defaultValue={numberValidatorInit(record.productColor?.colorID)}
          selectProps={{
            options: viewModel.state.colors.map((color) => {
              return { label: color.name, value: color.id, key: color.hexColor }
            })
          }}
        >
          <Flex wrap='wrap' justify='space-between' align='center' gap={10}>
            <SkyTableTypography status={record.productColor?.color?.status} className='w-fit'>
              {textValidatorDisplay(record.productColor?.color?.name)}
            </SkyTableTypography>
            <SkyTableColorPicker value={record.productColor?.color?.hexColor} disabled />
          </Flex>
        </EditableStateCell>
      )
    },
    productGroup: (record: ProductTableDataType) => {
      return (
        <EditableStateCell
          isEditing={viewModel.table.isEditing(record.key)}
          dataIndex='groupID'
          title='Nhóm'
          required
          inputType='select'
          onValueChange={(val) => {
            viewModel.state.setNewRecord((prev) => {
              return { ...prev, groupID: numberValidatorChange(val) }
            })
          }}
          defaultValue={numberValidatorInit(record.productGroup?.groupID)}
          selectProps={{
            options: viewModel.state.groups.map((i) => {
              return { label: i.name, value: i.id }
            })
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
          isEditing={viewModel.table.isEditing(record.key)}
          dataIndex='printID'
          title='Nơi in'
          inputType='select'
          onValueChange={(val: number) =>
            viewModel.state.setNewRecord((prev) => {
              return { ...prev, printID: numberValidatorChange(val) }
            })
          }
          defaultValue={numberValidatorInit(record.printablePlace?.printID)}
          selectProps={{
            options: viewModel.state.prints.map((i) => {
              return { label: i.name, value: i.id }
            })
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
          isEditing={viewModel.table.isEditing(record.key)}
          dataIndex='dateInputNPL'
          title='NPL'
          inputType='datepicker'
          required
          defaultValue={dateValidatorInit(record.dateInputNPL)}
          onValueChange={(val: Dayjs) =>
            viewModel.state.setNewRecord((prev) => {
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
          isEditing={viewModel.table.isEditing(record.key)}
          dataIndex='dateOutputFCR'
          title='FCR'
          inputType='datepicker'
          required
          defaultValue={dateValidatorInit(record.dateOutputFCR)}
          onValueChange={(val: Dayjs) =>
            viewModel.state.setNewRecord((prev) => {
              return { ...prev, dateOutputFCR: dateValidatorChange(val) }
            })
          }
        >
          <SkyTableTypography status={'active'}>{dateValidatorDisplay(record.dateOutputFCR)}</SkyTableTypography>
        </EditableStateCell>
      )
    },
    actionCol: (record: ProductTableDataType) => {
      return (
        <SkyTableActionRow
          record={record}
          editingKey={viewModel.table.editingKey}
          deletingKey={viewModel.table.deletingKey}
          buttonEdit={{
            onClick: () => {
              viewModel.state.setNewRecord({
                productCode: record.productCode,
                quantityPO: record.quantityPO,
                colorID: record.productColor?.colorID,
                groupID: record.productGroup?.groupID,
                printID: record.printablePlace?.printID,
                dateInputNPL: record.dateInputNPL,
                dateOutputFCR: record.dateOutputFCR
              })
              viewModel.table.handleStartEditing(record.key)
            },
            isShow: !viewModel.state.showDeleted
          }}
          buttonSave={{
            // Save
            onClick: () => viewModel.action.handleUpdate(record),
            isShow: true
          }}
          // Start delete
          buttonDelete={{
            onClick: () => viewModel.table.handleStartDeleting(record.key),
            isShow: !viewModel.state.showDeleted
          }}
          // Start delete forever
          buttonDeleteForever={{
            onClick: () => {},
            isShow: viewModel.state.showDeleted
          }}
          // Start restore
          buttonRestore={{
            onClick: () => viewModel.table.handleStartRestore(record.key),
            isShow: viewModel.state.showDeleted
          }}
          // Delete forever
          onConfirmDeleteForever={() => viewModel.action.handleDeleteForever(record)}
          // Cancel editing
          onConfirmCancelEditing={() => viewModel.table.handleCancelEditing()}
          // Cancel delete
          onConfirmCancelDeleting={() => viewModel.table.handleCancelDeleting()}
          // Delete (update status record => 'deleted')
          onConfirmDelete={() => viewModel.action.handleDelete(record)}
          // Cancel restore
          onConfirmCancelRestore={() => viewModel.table.handleCancelRestore()}
          // Restore
          onConfirmRestore={() => viewModel.action.handleRestore(record)}
          // Show hide action col
        />
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
      title: 'Màu',
      dataIndex: 'colorID',
      width: '10%',
      responsive: ['sm'],
      render: (_value: any, record: ProductTableDataType) => {
        return columns.productColor(record)
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

  const actionCol: ColumnType<ProductTableDataType> = {
    title: 'Operation',
    width: '0.001%',
    render: (_value: any, record: ProductTableDataType) => {
      return columns.actionCol(record)
    }
  }

  return (
    <>
      <BaseLayout
        title='Danh sách sản phẩm'
        loading={viewModel.table.loading}
        searchProps={{
          // Search Input
          onSearch: viewModel.action.handleSearch,
          placeholder: 'Mã hàng..'
        }}
        sortProps={{
          // Sort Switch Button
          onChange: viewModel.action.handleSwitchSortChange
        }}
        deleteProps={{
          // Show delete list Switch Button
          onChange: viewModel.action.handleSwitchDeleteChange
        }}
        addNewProps={{
          // Add new Button
          onClick: () => viewModel.state.setOpenModal(true)
        }}
      >
        <SkyTable
          loading={viewModel.table.loading}
          tableColumns={{
            columns: tableColumns,
            actionColumn: actionCol
          }}
          dataSource={viewModel.table.dataSource}
          onPageChange={viewModel.action.handlePageChange}
          expandable={{
            expandedRowRender: (record: ProductTableDataType) => {
              return (
                <SkyTableExpandableLayout>
                  {!(width >= breakpoint.sm) && (
                    <SkyTableExpandableItemRow title='Số lượng PO:' isEditing={viewModel.table.isEditing(record.key)}>
                      {columns.quantityPO(record)}
                    </SkyTableExpandableItemRow>
                  )}
                  {!(width >= breakpoint.sm) && (
                    <SkyTableExpandableItemRow title='Màu:' isEditing={viewModel.table.isEditing(record.key)}>
                      {columns.productColor(record)}
                    </SkyTableExpandableItemRow>
                  )}
                  {!(width >= breakpoint.xl) && (
                    <SkyTableExpandableItemRow title='Nhóm:' isEditing={viewModel.table.isEditing(record.key)}>
                      {columns.productGroup(record)}
                    </SkyTableExpandableItemRow>
                  )}
                  {!(width >= breakpoint.xxl) && (
                    <SkyTableExpandableItemRow title='Nơi in:' isEditing={viewModel.table.isEditing(record.key)}>
                      {columns.printablePlace(record)}
                    </SkyTableExpandableItemRow>
                  )}
                  {!(width >= breakpoint.md) && (
                    <SkyTableExpandableItemRow title='Ngày nhập NPL:' isEditing={viewModel.table.isEditing(record.key)}>
                      {columns.dateInputNPL(record)}
                    </SkyTableExpandableItemRow>
                  )}
                  {!(width >= breakpoint.lg) && (
                    <SkyTableExpandableItemRow title='Ngày xuất FCR:' isEditing={viewModel.table.isEditing(record.key)}>
                      {columns.dateInputNPL(record)}
                    </SkyTableExpandableItemRow>
                  )}
                </SkyTableExpandableLayout>
              )
            },
            columnWidth: '0.001%',
            onExpand: (expanded, record: ProductTableDataType) =>
              viewModel.table.handleStartExpanding(expanded, record.key),
            expandedRowKeys: viewModel.table.expandingKeys
          }}
        />
      </BaseLayout>
      {viewModel.state.openModal && (
        <ModalAddNewProduct
          okButtonProps={{ loading: viewModel.table.loading }}
          open={viewModel.state.openModal}
          setOpenModal={viewModel.state.setOpenModal}
          onAddNew={viewModel.action.handleAddNew}
        />
      )}
    </>
  )
}

export default ProductPage
