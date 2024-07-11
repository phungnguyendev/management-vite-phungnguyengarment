import { Flex, Space } from 'antd'
import { ColumnType } from 'antd/es/table'
import useDevice from '~/components/hooks/useDevice'
import useTitle from '~/components/hooks/useTitle'
import BaseLayout from '~/components/layout/BaseLayout'
import SkyTable from '~/components/sky-ui/SkyTable/SkyTable'
import SkyTableActionRow from '~/components/sky-ui/SkyTable/SkyTableActionRow'
import SkyTableColorPicker from '~/components/sky-ui/SkyTable/SkyTableColorPicker'
import SkyTableExpandableItemRow from '~/components/sky-ui/SkyTable/SkyTableExpandableItemRow'
import SkyTableExpandableLayout from '~/components/sky-ui/SkyTable/SkyTableExpandableLayout'
import SkyTableStatusItem from '~/components/sky-ui/SkyTable/SkyTableStatusItem'
import SkyTableTypography from '~/components/sky-ui/SkyTable/SkyTableTypography'
import { breakpoint, numberValidatorDisplay, textValidatorDisplay } from '~/utils/helpers'
import ImportationTable from './components/ImportationTable'
import ModalAddNewImportation from './components/ModalAddNewImportation'
import useImportationViewModel from './hooks/useImportationViewModel'
import { ImportationTableDataType } from './type'

const ImportationPage = () => {
  useTitle('Importations | Phung Nguyen')
  const viewModel = useImportationViewModel()
  const { width } = useDevice()

  const columns = {
    productCode: (record: ImportationTableDataType) => {
      return (
        <Space direction='horizontal'>
          <SkyTableTypography strong status={record.status}>
            {textValidatorDisplay(record.productCode)}{' '}
          </SkyTableTypography>
          {viewModel.action.isCheckImported(record) && <SkyTableStatusItem>Imported</SkyTableStatusItem>}
        </Space>
      )
    },
    quantityPO: (record: ImportationTableDataType) => {
      return <SkyTableTypography>{numberValidatorDisplay(record.quantityPO)}</SkyTableTypography>
    },
    productColor: (record: ImportationTableDataType) => {
      return (
        <Flex justify='space-between' align='center' gap={10} wrap='wrap'>
          <SkyTableTypography status={record.productColor?.color?.status} className='w-fit'>
            {textValidatorDisplay(record.productColor?.color?.name)}
          </SkyTableTypography>
          <SkyTableColorPicker value={record.productColor?.color?.hexColor} disabled />
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
    actionCol: (record: ImportationTableDataType) => {
      return (
        <SkyTableActionRow
          record={record}
          editingKey={viewModel.table.editingKey}
          deletingKey={viewModel.table.deletingKey}
          buttonAdd={{
            onClick: () => {
              viewModel.table.handleStartAdding(`${record.productCode}`, record)
              viewModel.state.setOpenModal(true)
            },
            title: 'New package',
            isShow: !viewModel.state.showDeleted
          }}
        />
      )
    }
  }

  const tableColumns: ColumnType<ImportationTableDataType>[] = [
    {
      title: 'Mã hàng',
      dataIndex: 'productCode',
      width: '7%',
      render: (_value: any, record: ImportationTableDataType) => {
        return columns.productCode(record)
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
      title: 'Số lượng PO',
      dataIndex: 'quantityPO',
      width: '7%',
      responsive: ['lg'],
      render: (_value: any, record: ImportationTableDataType) => {
        return columns.quantityPO(record)
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
    }
    // {
    //   title: 'Nơi in',
    //   dataIndex: 'printID',
    //   width: '10%',
    //   responsive: ['xl'],
    //   render: (_value: any, record: ImportationTableDataType) => {
    //     return columns.printablePlace(record)
    //   }
    // }
  ]

  const actionCol: ColumnType<ImportationTableDataType> = {
    title: 'Operation',
    width: '0.001%',
    render: (_value: any, record: ImportationTableDataType) => {
      return columns.actionCol(record)
    }
  }

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
          loading={viewModel.table.loading}
          tableColumns={{
            columns: tableColumns,
            actionColumn: actionCol,
            showAction: !viewModel.state.showDeleted
          }}
          dataSource={viewModel.table.dataSource}
          onPageChange={viewModel.action.handlePageChange}
          expandable={{
            expandedRowRender: (record: ImportationTableDataType) => {
              return (
                <>
                  <SkyTableExpandableLayout>
                    {!(width >= breakpoint.lg) && (
                      <SkyTableExpandableItemRow
                        title='Số lượng PO:'
                        isEditing={viewModel.table.isEditing(`${record.id}`)}
                      >
                        {columns.quantityPO(record)}
                      </SkyTableExpandableItemRow>
                    )}

                    {!(width >= breakpoint.md) && (
                      <SkyTableExpandableItemRow title='Màu:' isEditing={viewModel.table.isEditing(`${record.id}`)}>
                        {columns.productColor(record)}
                      </SkyTableExpandableItemRow>
                    )}

                    {!(width >= breakpoint.xl) && (
                      <SkyTableExpandableItemRow title='Nhóm:' isEditing={viewModel.table.isEditing(`${record.id}`)}>
                        {columns.productGroup(record)}
                      </SkyTableExpandableItemRow>
                    )}

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
                        handlePageChange: viewModel.action.handlePageExpandedChange
                      }}
                    />
                  </SkyTableExpandableLayout>
                </>
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
          title={`Thêm lô nhập mã hàng: #${viewModel.table.addingKey.key}`}
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
