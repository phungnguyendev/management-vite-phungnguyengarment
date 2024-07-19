import { Flex, Space } from 'antd'
import { ColumnType } from 'antd/es/table'
import { useSelector } from 'react-redux'
import useDevice from '~/components/hooks/useDevice'
import useTitle from '~/components/hooks/useTitle'
import BaseLayout from '~/components/layout/BaseLayout'
import SkyTable from '~/components/sky-ui/SkyTable/SkyTable'
import SkyTableActionRow from '~/components/sky-ui/SkyTable/SkyTableActionRow'
import SkyTableColorPicker from '~/components/sky-ui/SkyTable/SkyTableColorPicker'
import SkyTableExpandableItemRow from '~/components/sky-ui/SkyTable/SkyTableExpandableItemRow'
import SkyTableExpandableLayout from '~/components/sky-ui/SkyTable/SkyTableExpandableLayout'
import SkyTableIcon from '~/components/sky-ui/SkyTable/SkyTableIcon'
import SkyTableTypography from '~/components/sky-ui/SkyTable/SkyTableTypography'
import SkyTableWrapperLayout from '~/components/sky-ui/SkyTable/SkyTableWrapperLayout'
import { RootState } from '~/store/store'
import { UserRoleType } from '~/typing'
import {
  breakpoint,
  handleFilterText,
  handleObjectFilterText,
  isAcceptRole,
  numberValidatorDisplay,
  textValidatorDisplay,
  uniqueArray
} from '~/utils/helpers'
import ImportationTable from './components/ImportationTable'
import ModalAddNewImportation from './components/ModalAddNewImportation'
import useImportationViewModel from './hooks/useImportationViewModel'
import { ImportationTableDataType } from './type'

const PERMISSION_ACCESS_ROLE: UserRoleType[] = ['admin', 'importation_manager']

const ImportationPage = () => {
  useTitle('Importations | Phung Nguyen')
  const viewModel = useImportationViewModel()
  const currentUser = useSelector((state: RootState) => state.user)
  const { width } = useDevice()

  const columns = {
    productCode: (record: ImportationTableDataType) => {
      return (
        <Space direction='horizontal' wrap>
          <SkyTableTypography strong status={record.status}>
            {textValidatorDisplay(record.productCode)}{' '}
          </SkyTableTypography>
          {viewModel.action.isShowStatusIcon(record) && <SkyTableIcon type={viewModel.action.statusIconType(record)} />}
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
      },
      filters: uniqueArray(
        viewModel.table.dataSource.map((item) => {
          return `${item.productCode}`
        })
      ).map((item) => {
        return {
          text: item,
          value: item
        }
      }),
      filterSearch: true,
      onFilter: (value, record) => handleFilterText(value, record.productCode)
    },
    {
      title: 'Màu',
      dataIndex: 'colorID',
      width: '10%',
      responsive: ['sm'],
      render: (_value: any, record: ImportationTableDataType) => {
        return columns.productColor(record)
      },
      filters: viewModel.state.colors.map((item) => {
        return {
          text: `${item.name}`,
          value: `${item.id}`
        }
      }),
      filterSearch: true,
      onFilter: (value, record) => handleObjectFilterText(value, record.productColor, record.productColor?.colorID)
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
      },
      filters: viewModel.state.groups.map((item) => {
        return {
          text: `${item.name}`,
          value: `${item.id}`
        }
      }),
      filterSearch: true,
      onFilter: (value, record) => handleObjectFilterText(value, record.productGroup, record.productGroup?.groupID)
    }
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
      <BaseLayout title='Xuất nhập khẩu'>
        <SkyTableWrapperLayout
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
              showAction: !viewModel.state.showDeleted && isAcceptRole(PERMISSION_ACCESS_ROLE, currentUser.roles)
            }}
            dataSource={viewModel.table.dataSource}
            pagination={{
              pageSize: viewModel.table.paginator.pageSize,
              current: viewModel.table.paginator.page,
              onChange: viewModel.action.handlePageChange
            }}
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
                        permissionAcceptRole={isAcceptRole(PERMISSION_ACCESS_ROLE, currentUser.roles)}
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
        </SkyTableWrapperLayout>
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
