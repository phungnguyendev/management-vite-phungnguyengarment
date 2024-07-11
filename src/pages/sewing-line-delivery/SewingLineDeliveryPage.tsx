import { Flex, Space } from 'antd'
import { ColumnsType, ColumnType } from 'antd/es/table'
import useDevice from '~/components/hooks/useDevice'
import useTitle from '~/components/hooks/useTitle'
import BaseLayout from '~/components/layout/BaseLayout'
import EditableStateCell from '~/components/sky-ui/SkyTable/EditableStateCell'
import SkyTable from '~/components/sky-ui/SkyTable/SkyTable'
import SkyTableActionRow from '~/components/sky-ui/SkyTable/SkyTableActionRow'
import SkyTableColorPicker from '~/components/sky-ui/SkyTable/SkyTableColorPicker'
import SkyTableExpandableItemRow from '~/components/sky-ui/SkyTable/SkyTableExpandableItemRow'
import SkyTableExpandableLayout from '~/components/sky-ui/SkyTable/SkyTableExpandableLayout'
import SkyTableRowHighLightTextItem from '~/components/sky-ui/SkyTable/SkyTableRowHighLightTextItem'
import SkyTableTypography from '~/components/sky-ui/SkyTable/SkyTableTypography'
import { SewingLineDelivery } from '~/typing'
import {
  breakpoint,
  dateValidatorDisplay,
  isExpiredDate,
  isValidArray,
  numberValidatorDisplay,
  textValidatorDisplay
} from '~/utils/helpers'
import SewingLineDeliveryExpandableList from './components/SewingLineDeliveryExpandableList'
import useSewingLineDeliveryViewModel from './hooks/useSewingLineDeliveryViewModel'
import { SewingLineDeliveryTableDataType } from './type'

const SewingLineDeliveryPage = () => {
  useTitle('Chuyền may | Phung Nguyen')
  const viewModel = useSewingLineDeliveryViewModel()
  const { width } = useDevice()

  const columns = {
    productCode: (record: SewingLineDeliveryTableDataType) => {
      return (
        <SkyTableTypography strong status={record.status}>
          {textValidatorDisplay(record.productCode)}
        </SkyTableTypography>
      )
    },
    productColor: (record: SewingLineDeliveryTableDataType) => {
      return (
        <Flex wrap='wrap' justify='space-between' align='center' gap={10}>
          <SkyTableTypography className='w-fit'>
            {textValidatorDisplay(record.productColor?.color?.name)}
          </SkyTableTypography>
          <SkyTableColorPicker value={record.productColor?.color?.hexColor} disabled />
        </Flex>
      )
    },
    quantityPO: (record: SewingLineDeliveryTableDataType) => {
      return <SkyTableTypography>{numberValidatorDisplay(record.quantityPO)}</SkyTableTypography>
    },
    dateOutputFCR: (record: SewingLineDeliveryTableDataType) => {
      return (
        <SkyTableTypography>{record.dateOutputFCR && dateValidatorDisplay(record.dateOutputFCR)}</SkyTableTypography>
      )
    },
    productGroup: (record: SewingLineDeliveryTableDataType) => {
      return (
        <SkyTableTypography status={record.productGroup?.group?.status}>
          {textValidatorDisplay(record.productGroup?.group?.name)}
        </SkyTableTypography>
      )
    },
    sewingLines: (record: SewingLineDeliveryTableDataType) => {
      return (
        <EditableStateCell
          isEditing={viewModel.table.isEditing(record.key!)}
          dataIndex='sewingLineDeliveries'
          title='Chuyền may'
          inputType='multipleselect'
          required
          selectProps={{
            options: viewModel.state.sewingLines
              .sort((a, b) => a.id! - b.id!)
              .map((item) => {
                return {
                  value: item.id,
                  label: item.name
                }
              }),
            defaultValue: isValidArray(record.sewingLineDeliveries)
              ? record.sewingLineDeliveries.map((item) => {
                  return {
                    value: item.sewingLine?.id,
                    label: item.sewingLine?.name
                  }
                })
              : undefined
          }}
          onValueChange={(values: number[]) => {
            viewModel.state.setNewRecord(
              values.map((sewingLineID) => {
                return { productID: record.id, sewingLineID: sewingLineID } as SewingLineDelivery
              })
            )
          }}
        >
          {isValidArray(record.sewingLineDeliveries) && (
            <Space wrap>
              {record.sewingLineDeliveries
                .sort((a, b) => a.sewingLineID! - b.sewingLineID!)
                .map((item, index) => {
                  return (
                    <SkyTableRowHighLightTextItem
                      key={index}
                      status={item.sewingLine?.status}
                      type={isExpiredDate(record.dateOutputFCR, item.expiredDate) ? 'danger' : undefined}
                    >
                      {isExpiredDate(record.dateOutputFCR, item.expiredDate)
                        ? `${item.sewingLine?.name} (Bể)`
                        : item.sewingLine?.name}
                    </SkyTableRowHighLightTextItem>
                  )
                })}
            </Space>
          )}
        </EditableStateCell>
      )
    },
    actionCol: (record: SewingLineDeliveryTableDataType) => {
      return (
        <SkyTableActionRow
          record={record}
          editingKey={viewModel.table.editingKey}
          deletingKey={viewModel.table.deletingKey}
          buttonEdit={{
            onClick: () => {
              if (isValidArray(record.sewingLineDeliveries)) {
                viewModel.state.setNewRecord(
                  record.sewingLineDeliveries.map((item) => {
                    delete item.product
                    return item
                  })
                )
              }
              viewModel.table.handleStartEditing(record.key)
            },
            isShow: !viewModel.state.showDeleted
          }}
          buttonSave={{
            // Save
            onClick: () => viewModel.action.handleUpdate(record),
            isShow: !viewModel.state.showDeleted
          }}
          // Start delete
          buttonDelete={{
            onClick: () => viewModel.table.handleStartDeleting(record.key),
            isShow: !viewModel.state.showDeleted,
            disabled: !isValidArray(record.sewingLineDeliveries)
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
          onConfirmDelete={() => viewModel.action.handleDeleteForever(record)}
          // Cancel restore
          onConfirmCancelRestore={() => viewModel.table.handleCancelRestore()}
          // Restore
          onConfirmRestore={() => viewModel.action.handleRestore()}
          // Show hide action col
        />
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
      title: 'Màu',
      dataIndex: 'colorID',
      width: '15%',
      responsive: ['sm'],
      render: (_value: any, record: SewingLineDeliveryTableDataType) => {
        return columns.productColor(record)
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

  const actionCol: ColumnType<SewingLineDeliveryTableDataType> = {
    title: 'Operation',
    width: '0.001%',
    render: (_value: any, record: SewingLineDeliveryTableDataType) => {
      return columns.actionCol(record)
    }
  }

  return (
    <>
      <BaseLayout
        title='Chuyền may'
        loading={viewModel.table.loading}
        searchProps={{
          onSearch: viewModel.action.handleSearch,
          placeholder: 'Mã hàng..'
        }}
        sortProps={{
          onChange: viewModel.action.handleSwitchSortChange
        }}
        deleteProps={{
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
          columns={tableColumns}
          dataSource={viewModel.table.dataSource}
          onPageChange={viewModel.action.handlePageChange}
          expandable={{
            expandedRowRender: (record: SewingLineDeliveryTableDataType) => {
              return (
                <>
                  <SkyTableExpandableLayout>
                    {!(width >= breakpoint.md) && (
                      <SkyTableExpandableItemRow title='Màu:' isEditing={viewModel.table.isEditing(`${record.id}`)}>
                        {columns.productColor(record)}
                      </SkyTableExpandableItemRow>
                    )}

                    {!(width >= breakpoint.lg) && (
                      <SkyTableExpandableItemRow
                        title='Số lượng PO:'
                        isEditing={viewModel.table.isEditing(`${record.id}`)}
                      >
                        {columns.quantityPO(record)}
                      </SkyTableExpandableItemRow>
                    )}

                    {!(width >= breakpoint.xl) && (
                      <SkyTableExpandableItemRow title='Nhóm:' isEditing={viewModel.table.isEditing(`${record.id}`)}>
                        {columns.productGroup(record)}
                      </SkyTableExpandableItemRow>
                    )}

                    <SewingLineDeliveryExpandableList
                      parentRecord={record}
                      isEditing={viewModel.table.isEditing(record.key)}
                      newRecord={viewModel.state.newRecord}
                      setNewRecord={viewModel.state.setNewRecord}
                    />
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
