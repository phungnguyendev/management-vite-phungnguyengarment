import { Flex, Space } from 'antd'
import { ColumnsType, ColumnType } from 'antd/es/table'
import { useSelector } from 'react-redux'
import useDevice from '~/components/hooks/useDevice'
import useTitle from '~/components/hooks/useTitle'
import BaseLayout from '~/components/layout/BaseLayout'
import EditableStateCell from '~/components/sky-ui/SkyTable/EditableStateCell'
import SkyTable from '~/components/sky-ui/SkyTable/SkyTable'
import SkyTableActionRow from '~/components/sky-ui/SkyTable/SkyTableActionRow'
import SkyTableColorPicker from '~/components/sky-ui/SkyTable/SkyTableColorPicker'
import SkyTableExpandableItemRow from '~/components/sky-ui/SkyTable/SkyTableExpandableItemRow'
import SkyTableExpandableLayout from '~/components/sky-ui/SkyTable/SkyTableExpandableLayout'
import SkyTableIcon from '~/components/sky-ui/SkyTable/SkyTableIcon'
import SkyTableRowHighLightItem from '~/components/sky-ui/SkyTable/SkyTableRowHighLightItem'
import SkyTableTypography from '~/components/sky-ui/SkyTable/SkyTableTypography'
import SkyTableWrapperLayout from '~/components/sky-ui/SkyTable/SkyTableWrapperLayout'
import { RootState } from '~/store/store'
import { SewingLineDelivery, UserRoleType } from '~/typing'
import { dateFormatter } from '~/utils/date-formatter'
import {
  breakpoint,
  dateValidatorDisplay,
  expiriesDateType,
  handleFilterText,
  handleObjectFilterText,
  isAcceptRole,
  isValidArray,
  isValidDate,
  numberValidatorCalc,
  numberValidatorChange,
  numberValidatorDisplay,
  textValidatorDisplay,
  uniqueArray
} from '~/utils/helpers'
import { ProductTableDataType } from '../product/type'
import SewingLineDeliveryExpandableList from './components/SewingLineDeliveryExpandableList'
import SewingLineDeliveryExpiresError from './components/SewingLineDeliveryExpiresError'
import useSewingLineDeliveryViewModel from './hooks/useSewingLineDeliveryViewModel'
import { SewingLineDeliveryTableDataType } from './type'

const PERMISSION_ACCESS_ROLE: UserRoleType[] = ['admin', 'sewing_line_manager']

const SewingLineDeliveryPage = () => {
  useTitle('Chuyền may | Phung Nguyen')
  const viewModel = useSewingLineDeliveryViewModel()
  const currentUser = useSelector((state: RootState) => state.user)
  const { width } = useDevice()

  const columns = {
    productCode: (record: SewingLineDeliveryTableDataType) => {
      return (
        <Space direction='horizontal' wrap>
          <SkyTableTypography strong status={record.status}>
            {textValidatorDisplay(record.productCode)}{' '}
          </SkyTableTypography>
          {viewModel.action.isShowStatusIcon(record) && <SkyTableIcon type={viewModel.action.statusIconType(record)} />}
        </Space>
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
          inputType='multipleSelect'
          required
          selectProps={{
            options: viewModel.state.sewingLines
              .sort((a, b) => numberValidatorChange(a.id) - numberValidatorChange(b.id))
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
                    label: <SkyTableRowHighLightItem>{item.sewingLine?.name}</SkyTableRowHighLightItem>
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
                .sort((a, b) => numberValidatorCalc(a.sewingLineID) - numberValidatorCalc(b.sewingLineID))
                .map((item, index) => {
                  return (
                    <SkyTableRowHighLightItem
                      key={index}
                      status={item.sewingLine?.status}
                      type={
                        expiriesDateType(record.dateOutputFCR, item.expiredDate) === 'danger' ? 'danger' : 'secondary'
                      }
                    >
                      {expiriesDateType(record.dateOutputFCR, item.expiredDate) === 'danger'
                        ? `${item.sewingLine?.name} (Bể)`
                        : `${item.sewingLine?.name}`}{' '}
                      {isValidDate(record.dateOutputFCR) && isValidDate(item.expiredDate) && (
                        <SewingLineDeliveryExpiresError
                          dateOutputFCR={record.dateOutputFCR}
                          dateToCheck={item.expiredDate}
                        />
                      )}
                    </SkyTableRowHighLightItem>
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
      width: '15%',
      responsive: ['sm'],
      render: (_value: any, record: SewingLineDeliveryTableDataType) => {
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
      width: '10%',
      responsive: ['md'],
      render: (_value: any, record: SewingLineDeliveryTableDataType) => {
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
      },
      filters: viewModel.state.groups.map((item) => {
        return {
          text: `${item.name}`,
          value: `${item.id}`
        }
      }),
      filterSearch: true,
      onFilter: (value, record) => handleObjectFilterText(value, record.productGroup, record.productGroup?.groupID)
    },
    {
      title: 'Ngày xuất FCR',
      dataIndex: 'dateOutputFCR',
      width: '15%',
      responsive: ['lg'],
      render: (_value: any, record: SewingLineDeliveryTableDataType) => {
        return columns.dateOutputFCR(record)
      },
      filters: uniqueArray(
        viewModel.table.dataSource.map((item) => {
          return dateFormatter(item.dateOutputFCR, 'dateOnly')
        })
      ).map((item) => {
        return {
          text: item,
          value: item
        }
      }),
      filterSearch: true,
      onFilter: (value, record) => handleFilterText(value, dateFormatter(record.dateOutputFCR, 'dateOnly'))
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
      <BaseLayout title='Chuyền may'>
        <SkyTableWrapperLayout
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
              showAction: !viewModel.state.showDeleted && isAcceptRole(PERMISSION_ACCESS_ROLE, currentUser.roles)
            }}
            columns={tableColumns}
            dataSource={viewModel.table.dataSource}
            pagination={{
              pageSize: viewModel.table.paginator.pageSize,
              current: viewModel.table.paginator.page,
              onChange: viewModel.action.handlePageChange
            }}
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
        </SkyTableWrapperLayout>
      </BaseLayout>
    </>
  )
}

export default SewingLineDeliveryPage
