import { Flex, Space } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { BarChartBig, CheckCheck, CircleAlert } from 'lucide-react'
import { SewingIcon } from '~/assets/icons'
import useDevice from '~/components/hooks/useDevice'
import useStatistic from '~/components/hooks/useStatistic'
import useTitle from '~/components/hooks/useTitle'
import BaseLayout from '~/components/layout/BaseLayout'
import ProgressBar from '~/components/sky-ui/ProgressBar'
import SkyTable from '~/components/sky-ui/SkyTable/SkyTable'
import SkyTableColorPicker from '~/components/sky-ui/SkyTable/SkyTableColorPicker'
import SkyTableExpandableItemRow from '~/components/sky-ui/SkyTable/SkyTableExpandableItemRow'
import SkyTableExpandableLayout from '~/components/sky-ui/SkyTable/SkyTableExpandableLayout'
import SkyTableIcon from '~/components/sky-ui/SkyTable/SkyTableIcon'
import SkyTableTypography from '~/components/sky-ui/SkyTable/SkyTableTypography'
import SkyTableWrapperLayout from '~/components/sky-ui/SkyTable/SkyTableWrapperLayout'
import { Product } from '~/typing'
import { dateFormatter } from '~/utils/date-formatter'
import {
  breakpoint,
  dateValidatorDisplay,
  handleFilterText,
  handleObjectFilterText,
  isValidArray,
  isValidObject,
  numberValidatorChange,
  numberValidatorDisplay,
  sumCounts,
  textValidatorDisplay,
  uniqueArray
} from '~/utils/helpers'
import StatisticCard from './components/StatisticCard'
import StatisticWrapper from './components/StatisticWapper'
import useDashboardViewModel from './hooks/useDashboardViewModel'
import { DashboardTableDataType } from './type'

const DashboardPage = () => {
  useTitle('Dashboard | Phung Nguyen')
  const { width } = useDevice()
  const viewModel = useDashboardViewModel()
  const statistic = useStatistic()

  const columns = {
    productCode: (record: DashboardTableDataType) => {
      return (
        <Space direction='horizontal' wrap>
          <SkyTableTypography strong status={record.status}>
            {textValidatorDisplay(record.productCode)}{' '}
          </SkyTableTypography>
          {statistic.isShowStatusIcon(
            record.id!,
            viewModel.state.sewingLineDeliveries,
            viewModel.state.completions
          ) && (
            <SkyTableIcon
              type={statistic.statusIconType(
                { ...record } as Product,
                viewModel.state.sewingLineDeliveries,
                viewModel.state.completions
              )}
            />
          )}
        </Space>
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

      return (
        <>
          <Flex vertical>
            <ProgressBar total={numberValidatorChange(record.quantityPO)} count={sumQuantitySewed} />
            <SkyTableTypography className='text-xs font-medium'>
              {numberValidatorDisplay(sumQuantitySewed)} / {numberValidatorDisplay(record.quantityPO)}
            </SkyTableTypography>
          </Flex>
        </>
      )
    },
    ironed: (record: DashboardTableDataType) => {
      const sumIroned = isValidObject(record.completion) ? numberValidatorChange(record.completion.quantityIroned) : 0

      return (
        <>
          <Flex vertical>
            <ProgressBar total={numberValidatorChange(record.quantityPO)} count={sumIroned} />
            <SkyTableTypography className='text-xs font-medium'>
              {numberValidatorDisplay(sumIroned)} / {numberValidatorDisplay(record.quantityPO)}
            </SkyTableTypography>
          </Flex>
        </>
      )
    },
    checked: (record: DashboardTableDataType) => {
      const sumChecked = isValidObject(record.completion)
        ? numberValidatorChange(record.completion.quantityCheckPassed)
        : 0

      return (
        <>
          <Flex vertical>
            <ProgressBar total={numberValidatorChange(record.quantityPO)} count={sumChecked} />
            <SkyTableTypography className='text-xs font-medium'>
              {numberValidatorDisplay(sumChecked)} / {numberValidatorDisplay(record.quantityPO)}
            </SkyTableTypography>
          </Flex>
        </>
      )
    },
    packaged: (record: DashboardTableDataType) => {
      const sumPackaged = isValidObject(record.completion)
        ? numberValidatorChange(record.completion.quantityPackaged)
        : 0

      return (
        <>
          <Flex vertical>
            <ProgressBar total={numberValidatorChange(record.quantityPO)} count={sumPackaged} />
            <SkyTableTypography className='text-xs font-medium'>
              {numberValidatorDisplay(sumPackaged)} / {numberValidatorDisplay(record.quantityPO)}
            </SkyTableTypography>
          </Flex>
        </>
      )
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
      render: (_value: any, record: DashboardTableDataType) => {
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
      width: '10%',
      responsive: ['md'],
      render: (_value: any, record: DashboardTableDataType) => {
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

  return (
    <>
      <BaseLayout title='Dashboard'>
        <StatisticWrapper>
          <StatisticCard
            title='Tổng mã sản phẩm'
            value={viewModel.state.products.length}
            type='base'
            icon={<BarChartBig size={32} />}
          />
          <StatisticCard
            title='Mã đã hoàn thành'
            value={statistic.amountProductCompleted(
              viewModel.state.products,
              viewModel.state.sewingLineDeliveries,
              viewModel.state.completions
            )}
            type='success'
            icon={<CheckCheck size={32} />}
          />
          <StatisticCard
            title='Mã đang may'
            value={statistic.amountProductProgressing(
              viewModel.state.products,
              viewModel.state.sewingLineDeliveries,
              viewModel.state.completions
            )}
            type='warning'
            icon={<img src={SewingIcon} className='h-[32px] w-[32px] object-contain' />}
          />
          <StatisticCard
            title='Mã bị bể'
            value={statistic.amountProductDangerous(
              viewModel.state.products,
              viewModel.state.sewingLineDeliveries,
              viewModel.state.completions
            )}
            type='danger'
            icon={<CircleAlert size={32} />}
          />
        </StatisticWrapper>
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
        </SkyTableWrapperLayout>
      </BaseLayout>
    </>
  )
}

export default DashboardPage
