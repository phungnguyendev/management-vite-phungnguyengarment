import { MoreOutlined } from '@ant-design/icons'
import type { MenuProps } from 'antd'
import { Button, Dropdown, Flex, Space } from 'antd'
import type { ColumnsType, ColumnType } from 'antd/es/table'
import { Dayjs } from 'dayjs'
import ExcelJS from 'exceljs'
import { saveAs } from 'file-saver'
import { Download } from 'lucide-react'
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
import SkyTableRowHighLightItem from '~/components/sky-ui/SkyTable/SkyTableRowHighLightItem'
import SkyTableTypography from '~/components/sky-ui/SkyTable/SkyTableTypography'
import SkyTableWrapperLayout from '~/components/sky-ui/SkyTable/SkyTableWrapperLayout'
import { RootState } from '~/store/store'
import { UserRoleType } from '~/typing'
import { dateFormatter } from '~/utils/date-formatter'
import {
  breakpoint,
  dateValidatorChange,
  dateValidatorDisplay,
  dateValidatorInit,
  handleFilterText,
  handleObjectFilterText,
  isAcceptRole,
  isValidArray,
  numberValidatorChange,
  numberValidatorDisplay,
  numberValidatorInit,
  textValidatorChange,
  textValidatorDisplay,
  textValidatorInit,
  uniqueArray
} from '~/utils/helpers'
import ModalAddNewProduct from './components/ModalAddNewProduct'
import useProductViewModel from './hooks/useProductViewModel'
import { ProductTableDataType } from './type'
const PERMISSION_ACCESS_ROLE: UserRoleType[] = ['admin', 'product_manager']

const ProductPage = () => {
  useTitle('Products | Phung Nguyen')
  const { width } = useDevice()
  const currentUser = useSelector((state: RootState) => state.user)
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
          inputType='colorSelector'
          onValueChange={(val: number) =>
            viewModel.state.setNewRecord((prev) => {
              return { ...prev, colorID: numberValidatorChange(val) }
            })
          }
          defaultValue={numberValidatorInit(record.productColor?.colorID)}
          selectProps={{
            options: viewModel.state.colors.map((color) => {
              return { label: color.name, value: color.id, key: `${color.hexColor}-${color.id}` }
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
    printablePlaces: (record: ProductTableDataType) => {
      return (
        <>
          <EditableStateCell
            isEditing={viewModel.table.isEditing(record.key)}
            dataIndex='printIDs'
            title='Nơi in'
            inputType='multipleSelect'
            required
            // disabled={isDisable}
            defaultValue={record.printablePlaces?.map((item) => {
              return item.printID
            })}
            selectProps={{
              options: viewModel.state.prints.map((item) => {
                return {
                  value: item.id,
                  label: item.name
                }
              })
            }}
            onValueChange={(values: number[]) => {
              viewModel.state.setNewRecord({
                ...viewModel.state.newRecord,
                printIDs: values
              })
            }}
          >
            {isValidArray(record.printablePlaces) && (
              <Space size='small' wrap>
                {record.printablePlaces.map((item, index) => {
                  return (
                    <SkyTableRowHighLightItem key={index} status={item.print?.status}>
                      {item.print?.name}
                    </SkyTableRowHighLightItem>
                  )
                })}
              </Space>
            )}
          </EditableStateCell>
        </>
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
                printIDs: record.printablePlaces?.map((item) => {
                  return item.printID!
                }),
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

  const tableColumns: ColumnsType<ProductTableDataType> = [
    {
      title: 'Mã hàng',
      dataIndex: 'productCode',
      width: '10%',
      render: (_value: any, record: ProductTableDataType) => {
        return columns.title(record)
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
      render: (_value: any, record: ProductTableDataType) => {
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
      title: 'Nơi in',
      dataIndex: 'printID',
      width: '10%',
      responsive: ['xxl'],
      render: (_value: any, record: ProductTableDataType) => {
        return columns.printablePlaces(record)
      }
    },
    {
      title: 'Ngày nhập NPL',
      dataIndex: 'dateInputNPL',
      width: '10%',
      responsive: ['md'],
      render: (_value: any, record: ProductTableDataType) => {
        return columns.dateInputNPL(record)
      },
      filters: uniqueArray(
        viewModel.table.dataSource.map((item) => {
          return dateFormatter(item.dateInputNPL, 'dateOnly')
        })
      ).map((item) => {
        return {
          text: item,
          value: item
        }
      }),
      filterSearch: true,
      onFilter: (value, record) => handleFilterText(value, dateFormatter(record.dateInputNPL, 'dateOnly'))
    },
    {
      title: 'Ngày xuất FCR',
      dataIndex: 'dateOutputFCR',
      width: '10%',
      responsive: ['lg'],
      render: (_value: any, record: ProductTableDataType) => {
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
    }
  ]

  const actionCol: ColumnType<ProductTableDataType> = {
    title: 'Operation',
    width: '0.001%',
    render: (_value: any, record: ProductTableDataType) => {
      return columns.actionCol(record)
    }
  }

  const exportToExcel = async () => {
    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet('Products')

    const headerStyle: ExcelJS.Style = {
      font: {
        name: 'Times New Roman',
        family: 4,
        size: 12,
        bold: true
      },
      fill: {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'ffa4ffa4' }
      },
      numFmt: '%1.000',
      alignment: { wrapText: true, horizontal: 'center', vertical: 'middle' },
      protection: {
        locked: false
      },
      border: {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      }
    }
    // Định dạng các cột
    worksheet.columns = [
      {
        header: 'STT',
        key: 'orderNumber',
        width: 10
      },
      {
        header: 'MÃ HÀNG',
        key: 'productCode',
        width: 30
      },
      { header: 'Màu', key: 'productColor', width: 30 },
      { header: 'SỐ LƯỢNG PO', key: 'quantityPO', width: 30 },
      { header: 'NHÓM', key: 'productGroup', width: 30 },
      { header: 'NƠI IN', key: 'printablePlace', width: 30 },
      { header: 'NGÀY NHẬP NPL', key: 'dateInputNPL', width: 30 },
      { header: 'NGÀY XUẤT FCR', key: 'dateOutputFCR', width: 30 }
    ]

    worksheet.getCell('A1').style = headerStyle
    worksheet.getCell('B1').style = headerStyle
    worksheet.getCell('C1').style = headerStyle
    worksheet.getCell('D1').style = headerStyle
    worksheet.getCell('E1').style = headerStyle
    worksheet.getCell('F1').style = headerStyle
    worksheet.getCell('G1').style = headerStyle
    worksheet.getCell('H1').style = headerStyle

    viewModel.table.dataSource.forEach((item, index) =>
      worksheet.addRow({
        orderNumber: index,
        productCode: item.productCode,
        productColor: item.productColor?.color?.name,
        quantityPO: item.quantityPO,
        productGroup: item.productGroup?.group?.name,
        printablePlace: isValidArray(item.printablePlaces)
          ? item.printablePlaces
              ?.map((self) => {
                return self.print?.name
              })
              .join(', ')
          : '',
        dateInputNPL: dateFormatter(item.dateInputNPL, 'dateOnly'),
        dateOutputFCR: dateFormatter(item.dateOutputFCR, 'dateOnly')
      })
    )
    // Xuất file Excel
    const buffer = await workbook.xlsx.writeBuffer()
    saveAs(new Blob([buffer]), 'DS_SANPHAM.xlsx')
  }

  const dropdownItems: MenuProps['items'] = [
    {
      key: '1',
      label: (
        <Flex justify='start' align='center' gap={10} onClick={exportToExcel}>
          <Download size={20} />
          <span>Export to excel</span>
        </Flex>
      )
    }
  ]

  return (
    <>
      <BaseLayout title='Danh sách sản phẩm'>
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
          addNewProps={
            isAcceptRole(PERMISSION_ACCESS_ROLE, currentUser.roles)
              ? {
                  // Add new Button
                  onClick: () => viewModel.state.setOpenModal(true)
                }
              : undefined
          }
          moreFrames={
            <Flex justify='end' className='w-full'>
              <Dropdown menu={{ items: dropdownItems }} placement='bottomRight' trigger={['click']}>
                <Button icon={<MoreOutlined />} />
              </Dropdown>
            </Flex>
          }
        >
          <SkyTable
            loading={viewModel.table.loading}
            tableColumns={{
              columns: tableColumns,
              actionColumn: actionCol,
              showAction: isAcceptRole(PERMISSION_ACCESS_ROLE, currentUser.roles)
            }}
            dataSource={viewModel.table.dataSource}
            pagination={{
              pageSize: viewModel.table.paginator.pageSize,
              current: viewModel.table.paginator.page,
              onChange: viewModel.action.handlePageChange
            }}
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
                        {columns.printablePlaces(record)}
                      </SkyTableExpandableItemRow>
                    )}
                    {!(width >= breakpoint.md) && (
                      <SkyTableExpandableItemRow
                        title='Ngày nhập NPL:'
                        isEditing={viewModel.table.isEditing(record.key)}
                      >
                        {columns.dateInputNPL(record)}
                      </SkyTableExpandableItemRow>
                    )}
                    {!(width >= breakpoint.lg) && (
                      <SkyTableExpandableItemRow
                        title='Ngày xuất FCR:'
                        isEditing={viewModel.table.isEditing(record.key)}
                      >
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
        </SkyTableWrapperLayout>
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
