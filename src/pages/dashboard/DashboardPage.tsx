import { Flex } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import useDevice from '~/components/hooks/useDevice'
import useTitle from '~/components/hooks/useTitle'
import BaseLayout from '~/components/layout/BaseLayout'
import ProgressBar from '~/components/sky-ui/ProgressBar'
import SkyTable from '~/components/sky-ui/SkyTable/SkyTable'
import SkyTableColorPicker from '~/components/sky-ui/SkyTable/SkyTableColorPicker'
import SkyTableExpandableItemRow from '~/components/sky-ui/SkyTable/SkyTableExpandableItemRow'
import SkyTableExpandableLayout from '~/components/sky-ui/SkyTable/SkyTableExpandableLayout'
import SkyTableTypography from '~/components/sky-ui/SkyTable/SkyTableTypography'
import {
  breakpoint,
  dateValidatorDisplay,
  isValidArray,
  isValidObject,
  numberValidatorChange,
  numberValidatorDisplay,
  sumCounts,
  textValidatorDisplay
} from '~/utils/helpers'
import useDashboardViewModel from './hooks/useDashboardViewModel'
import { DashboardTableDataType } from './type'

const DashboardPage = () => {
  useTitle('Dashboard | Phung Nguyen')
  const { width } = useDevice()
  const viewModel = useDashboardViewModel()

  const columns = {
    title: (record: DashboardTableDataType) => {
      return (
        <SkyTableTypography strong status={record.status}>
          {textValidatorDisplay(record.productCode)}
        </SkyTableTypography>
      )
    },
    quantityPO: (record: DashboardTableDataType) => {
      return <SkyTableTypography>{numberValidatorDisplay(record.quantityPO)}</SkyTableTypography>
    },
    productColor: (record: DashboardTableDataType) => {
      return (
        <Flex wrap='wrap' justify='space-between' align='center' gap={10}>
          <SkyTableTypography status={record.productColor?.color?.status} className='w-fit'>
            {textValidatorDisplay(record.productColor?.color?.name)}
          </SkyTableTypography>
          <SkyTableColorPicker value={record.productColor?.color?.hexColor} disabled />
        </Flex>
      )
    },
    productGroup: (record: DashboardTableDataType) => {
      return (
        <SkyTableTypography status={record.productGroup?.group?.status}>
          {textValidatorDisplay(record.productGroup?.group?.name)}
        </SkyTableTypography>
      )
    },
    dateOutputFCR: (record: DashboardTableDataType) => {
      return <SkyTableTypography>{dateValidatorDisplay(record.dateOutputFCR)}</SkyTableTypography>
    },
    sewed: (record: DashboardTableDataType) => {
      const quantitySewedList = isValidArray(record.sewingLineDeliveries)
        ? record.sewingLineDeliveries.map((item) => {
            return numberValidatorChange(item.quantitySewed)
          })
        : []
      const sumQuantitySewed = sumCounts(quantitySewedList)

      return <ProgressBar total={numberValidatorChange(record.quantityPO)} count={sumQuantitySewed} />
    },
    ironed: (record: DashboardTableDataType) => {
      const sumIroned = isValidObject(record.completion) ? numberValidatorChange(record.completion.quantityIroned) : 0

      return <ProgressBar total={numberValidatorChange(record.quantityPO)} count={sumIroned} />
    },
    checked: (record: DashboardTableDataType) => {
      const sumChecked = isValidObject(record.completion)
        ? numberValidatorChange(record.completion.quantityCheckPassed)
        : 0

      return <ProgressBar total={numberValidatorChange(record.quantityPO)} count={sumChecked} />
    },
    packaged: (record: DashboardTableDataType) => {
      const sumPackaged = isValidObject(record.completion)
        ? numberValidatorChange(record.completion.quantityPackaged)
        : 0

      return <ProgressBar total={numberValidatorChange(record.quantityPO)} count={sumPackaged} />
    }
  }

  const progressHorizontalCol: ColumnsType<DashboardTableDataType> = [
    {
      title: 'Tiến trình',
      children: [
        {
          title: 'May',
          dataIndex: 'sewed',
          width: '10%',
          render: (_value: any, record: DashboardTableDataType) => {
            return columns.sewed(record)
          }
        },
        {
          title: 'Ủi',
          dataIndex: 'ironed',
          width: '10%',
          render: (_value: any, record: DashboardTableDataType) => {
            return columns.ironed(record)
          }
        },
        {
          title: 'Kiểm',
          dataIndex: 'checked',
          width: '10%',
          render: (_value: any, record: DashboardTableDataType) => {
            return columns.checked(record)
          }
        },
        {
          title: 'Đóng gói',
          dataIndex: 'packaged',
          width: '10%',
          render: (_value: any, record: DashboardTableDataType) => {
            return columns.packaged(record)
          }
        }
      ]
    }
  ]

  const progressVerticalCol: ColumnsType<DashboardTableDataType> = [
    {
      title: 'Tiến trình',
      width: '15%',
      render: (_value: any, record: DashboardTableDataType) => {
        return (
          <Flex vertical>
            <SkyTableTypography>May {columns.sewed(record)}</SkyTableTypography>
            <SkyTableTypography>Ủi {columns.ironed(record)}</SkyTableTypography>
            <SkyTableTypography>Kiểm {columns.checked(record)}</SkyTableTypography>
            <SkyTableTypography>Đóng gói {columns.packaged(record)}</SkyTableTypography>
          </Flex>
        )
      }
    }
  ]

  const tableColumns: ColumnsType<DashboardTableDataType> = [
    {
      title: 'Mã hàng',
      dataIndex: 'productCode',
      width: '10%',
      render: (_value: any, record: DashboardTableDataType) => {
        return columns.title(record)
      }
    },
    {
      title: 'Màu',
      dataIndex: 'colorID',
      width: '10%',
      responsive: ['sm'],
      render: (_value: any, record: DashboardTableDataType) => {
        return columns.productColor(record)
      }
    },
    {
      title: 'Số lượng PO',
      dataIndex: 'quantityPO',
      width: '7%',
      responsive: ['sm'],
      render: (_value: any, record: DashboardTableDataType) => {
        return columns.quantityPO(record)
      }
    },
    {
      title: 'Nhóm',
      dataIndex: 'groupID',
      width: '7%',
      responsive: ['xl'],
      render: (_value: any, record: DashboardTableDataType) => {
        return columns.productGroup(record)
      }
    },
    {
      title: 'Ngày xuất FCR',
      dataIndex: 'dateOutputFCR',
      width: '10%',
      responsive: ['md'],
      render: (_value: any, record: DashboardTableDataType) => {
        return columns.dateOutputFCR(record)
      }
    }
  ]

  return (
    <>
      <Flex vertical gap={40}>
        {/* <StatisticWrapper>
          <StatisticCard title='Tổng mã hàng' value={100} subTitle='100%' type='default' />
          <StatisticCard title='Mã đang may' value={50} subTitle='Chiếm 50% (50/100)' type='success' />
          <StatisticCard title='Mã đang sửa' value={30} subTitle='Chiếm 30% (30/100)' type='warning' />
          <StatisticCard title='Mã bị bể' value={20} subTitle='Chiếm 20% (20/100)' type='danger' />
        </StatisticWrapper> */}
        <BaseLayout
          title='Dashboard'
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
              columns:
                width >= breakpoint.lg
                  ? [...tableColumns, ...progressHorizontalCol]
                  : [...tableColumns, ...progressVerticalCol]
            }}
            dataSource={viewModel.table.dataSource}
            pagination={{
              pageSize: viewModel.table.paginator.pageSize,
              current: viewModel.table.paginator.page,
              onChange: viewModel.action.handlePageChange
            }}
            onPageChange={viewModel.action.handlePageChange}
            expandable={{
              expandedRowRender: (record: DashboardTableDataType) => {
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
                    {!(width >= breakpoint.md) && (
                      <SkyTableExpandableItemRow
                        title='Ngày xuất FCR:'
                        isEditing={viewModel.table.isEditing(record.key)}
                      >
                        {columns.dateOutputFCR(record)}
                      </SkyTableExpandableItemRow>
                    )}
                  </SkyTableExpandableLayout>
                )
              },
              columnWidth: '0.001%',
              onExpand: (expanded, record: DashboardTableDataType) =>
                viewModel.table.handleStartExpanding(expanded, record.key),
              expandedRowKeys: viewModel.table.expandingKeys,
              showExpandColumn: !(width >= breakpoint.xl)
            }}
          />
        </BaseLayout>
      </Flex>
    </>
  )
}

export default DashboardPage
