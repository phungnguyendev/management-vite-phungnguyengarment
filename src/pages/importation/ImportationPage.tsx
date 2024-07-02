import { ColorPicker, Flex } from 'antd'
import { ColumnType } from 'antd/es/table'
import useTitle from '~/components/hooks/useTitle'
import BaseLayout from '~/components/layout/BaseLayout'
import SkyTable from '~/components/sky-ui/SkyTable/SkyTable'
import SkyTableTypography from '~/components/sky-ui/SkyTable/SkyTableTypography'
import { numberValidatorDisplay, textValidatorDisplay } from '~/utils/helpers'
import ImportationTable from './components/ImportationTable'
import ModalAddNewImportation from './components/ModalAddNewImportation'
import useImportationViewModel from './hooks/useImportationViewModel'
import { ImportationTableDataType } from './type'

const ImportationPage = () => {
  useTitle('Importations | Phung Nguyen')
  const viewModel = useImportationViewModel()

  const columns = {
    productCode: (record: ImportationTableDataType) => {
      return (
        <SkyTableTypography strong status={record.status}>
          {textValidatorDisplay(record.productCode)}
        </SkyTableTypography>
      )
    },
    quantityPO: (record: ImportationTableDataType) => {
      return <SkyTableTypography status={'active'}>{numberValidatorDisplay(record.quantityPO)}</SkyTableTypography>
    },
    productColor: (record: ImportationTableDataType) => {
      return (
        <Flex justify='space-between' align='center' gap={10} wrap='wrap'>
          <SkyTableTypography status={record.productColor?.color?.status} className='w-fit'>
            {textValidatorDisplay(record.productColor?.color?.name)}
          </SkyTableTypography>
          <ColorPicker size='middle' format='hex' value={record.productColor?.color?.hexColor} disabled />
        </Flex>
      )
    },
    productGroup: (record: ImportationTableDataType) => {
      return (
        <SkyTableTypography status={record.productGroup?.group?.status}>
          {textValidatorDisplay(record.productGroup?.group?.name)}
        </SkyTableTypography>
      )
    },
    printablePlace: (record: ImportationTableDataType) => {
      return (
        <SkyTableTypography status={record.printablePlace?.print?.status}>
          {textValidatorDisplay(record.printablePlace?.print?.name)}
        </SkyTableTypography>
      )
    }
  }

  const tableColumns: ColumnType<ImportationTableDataType>[] = [
    {
      title: 'Mã hàng',
      dataIndex: 'productCode',
      width: '10%',
      render: (_value: any, record: ImportationTableDataType) => {
        return columns.productCode(record)
      }
    },
    {
      title: 'Số lượng PO',
      dataIndex: 'quantityPO',
      width: '7%',
      responsive: ['sm'],
      render: (_value: any, record: ImportationTableDataType) => {
        return columns.quantityPO(record)
      }
    },
    {
      title: 'Màu',
      dataIndex: 'colorID',
      width: '10%',
      responsive: ['sm'],
      render: (_value: any, record: ImportationTableDataType) => {
        return columns.productColor(record)
      }
    },
    {
      title: 'Nhóm',
      dataIndex: 'groupID',
      width: '7%',
      responsive: ['xl'],
      render: (_value: any, record: ImportationTableDataType) => {
        return columns.productGroup(record)
      }
    },
    {
      title: 'Nơi in',
      dataIndex: 'printID',
      width: '10%',
      responsive: ['xxl'],
      render: (_value: any, record: ImportationTableDataType) => {
        return columns.printablePlace(record)
      }
    }
  ]

  return (
    <>
      <BaseLayout
        title='Xuất nhập khẩu'
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
      >
        <SkyTable
          bordered
          loading={viewModel.table.loading}
          columns={tableColumns}
          editingKey={viewModel.table.editingKey}
          deletingKey={viewModel.table.deletingKey}
          dataSource={viewModel.table.dataSource}
          rowClassName='editable-row'
          onPageChange={viewModel.action.handlePageChange}
          isShowDeleted={viewModel.state.showDeleted}
          actionProps={{
            onAdd: {
              handleClick: (record) => {
                viewModel.table.handleStartAdding(`${record.productCode}`, record)
                viewModel.state.setOpenModal(true)
              },
              title: 'New package',
              isShow: true
            },
            isShow: true
          }}
          expandable={{
            expandedRowRender: (record: ImportationTableDataType) => {
              return (
                <ImportationTable
                  productRecord={record}
                  viewModelProps={{
                    tableProps: viewModel.table,
                    showDeleted: viewModel.state.showDeleted,
                    newRecord: viewModel.state.newRecord,
                    setNewRecord: viewModel.state.setNewRecord,
                    handleUpdate: viewModel.action.handleUpdate,
                    handleDelete: viewModel.action.handleDelete,
                    handleDeleteForever: viewModel.action.handleDeleteForever,
                    handleRestore: viewModel.action.handleRestore,
                    handlePageChange: viewModel.action.handlePageChange
                  }}
                />
              )
            },
            columnWidth: '0.001%',
            onExpand: (expanded, record: ImportationTableDataType) =>
              viewModel.table.handleStartExpanding(expanded, record.key),
            expandedRowKeys: viewModel.table.expandingKeys
          }}
        />
      </BaseLayout>
      {viewModel.state.openModal && (
        <ModalAddNewImportation
          title={`Thêm lô nhập mã hàng: ${viewModel.table.addingKey.key}`}
          okButtonProps={{ loading: viewModel.table.loading }}
          open={viewModel.state.openModal}
          setOpenModal={viewModel.state.setOpenModal}
          onAddNew={viewModel.action.handleAddNew}
        />
      )}
    </>
  )
}

export default ImportationPage
