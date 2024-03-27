import { ColorPicker, Divider, Flex, Progress, Space, Typography } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { Check } from 'lucide-react'
import useDevice from '~/components/hooks/useDevice'
import useTable from '~/components/hooks/useTable'
import BaseLayout from '~/components/layout/BaseLayout'
import EditableStateCell from '~/components/sky-ui/SkyTable/EditableStateCell'
import ExpandableItemRow from '~/components/sky-ui/SkyTable/ExpandableItemRow'
import SkyTable from '~/components/sky-ui/SkyTable/SkyTable'
import SkyTableTypography from '~/components/sky-ui/SkyTable/SkyTableTypography'
import { breakpoint, numberValidatorCalc, numberValidatorDisplay, textValidatorDisplay } from '~/utils/helpers'
import StatisticSlide from './components/StatisticSlide'
import useDashboard from './hooks/useDashboard'
import { DashboardTableDataType } from './type'

const Dashboard = () => {
  const table = useTable<DashboardTableDataType>([])
  const { handlePageChange, productService } = useDashboard(table)
  const { width } = useDevice()

  const columns = {
    productCode: (record: DashboardTableDataType) => {
      const totalSewed = record.sewingLineDeliveries
        ? record.sewingLineDeliveries.reduce((acc, current) => acc + (current.quantitySewed ?? 0), 0)
        : 0
      const totalIroned = record.completion ? numberValidatorCalc(record.completion.quantityIroned) : 0
      const totalCheckPassed = record.completion ? numberValidatorCalc(record.completion.quantityCheckPassed) : 0
      const totalPackaged = record.completion ? numberValidatorCalc(record.completion.quantityPackaged) : 0
      const isSuccess =
        totalSewed === record.quantityPO &&
        totalIroned === record.quantityPO &&
        totalCheckPassed === record.quantityPO &&
        totalPackaged === record.quantityPO
      return (
        <EditableStateCell isEditing={false} dataIndex='productCode' title='Mã hàng' inputType='text' required={true}>
          <SkyTableTypography strong status={record.status}>
            {textValidatorDisplay(record.productCode)}
          </SkyTableTypography>
          {isSuccess && (
            <Check size={16} color='#ffffff' className='relative top-[2px] m-0 rounded-full bg-success p-[2px]' />
          )}
        </EditableStateCell>
      )
    },
    productColor: (record: DashboardTableDataType) => {
      return (
        <EditableStateCell isEditing={false} dataIndex='colorID' title='Màu' inputType='colorselector' required={false}>
          <Flex className='' wrap='wrap' justify='space-between' align='center' gap={10}>
            <SkyTableTypography status={record.productColor?.color?.status} className='w-fit'>
              {textValidatorDisplay(record.productColor?.color?.name)}
            </SkyTableTypography>
            {record.productColor && (
              <ColorPicker size='middle' format='hex' value={record.productColor?.color?.hexColor} disabled />
            )}
          </Flex>
        </EditableStateCell>
      )
    },
    quantityPO: (record: DashboardTableDataType) => {
      return (
        <>
          <Flex className='w-full'>
            <EditableStateCell
              isEditing={false}
              dataIndex='quantityPO'
              title='Số lượng PO'
              inputType='number'
              required={true}
            >
              <SkyTableTypography status={record.status}>
                {numberValidatorDisplay(record.quantityPO)}
              </SkyTableTypography>
            </EditableStateCell>
          </Flex>
        </>
      )
    },
    sewing: (record: DashboardTableDataType) => {
      const totalSewed = record.sewingLineDeliveries
        ? record.sewingLineDeliveries.reduce((acc, current) => acc + (current.quantitySewed ?? 0), 0)
        : 0
      const percent = (totalSewed / numberValidatorCalc(record.quantityPO)) * 100
      return (
        <>
          <Flex vertical className='w-full'>
            <Progress percent={Number(percent.toFixed(0))} size='default' />
            <SkyTableTypography status={record.status}>
              {numberValidatorDisplay(totalSewed) + ' / ' + numberValidatorDisplay(record.quantityPO)}
            </SkyTableTypography>
          </Flex>
        </>
      )
    },
    ironed: (record: DashboardTableDataType) => {
      const totalIroned = record.completion ? numberValidatorCalc(record.completion.quantityIroned) : 0
      const percent = (totalIroned / numberValidatorCalc(record.quantityPO)) * 100
      return (
        <>
          <Flex vertical className='w-full'>
            <Progress percent={Number(percent.toFixed(0))} size='default' />
            <SkyTableTypography status={record.status}>
              {numberValidatorDisplay(totalIroned) + ' / ' + numberValidatorDisplay(record.quantityPO)}
            </SkyTableTypography>
          </Flex>
        </>
      )
    },
    checkPass: (record: DashboardTableDataType) => {
      const totalCheckPassed = record.completion ? numberValidatorCalc(record.completion.quantityCheckPassed) : 0
      const percent = (totalCheckPassed / numberValidatorCalc(record.quantityPO)) * 100
      return (
        <>
          <Flex vertical className='w-full'>
            <Progress percent={Number(percent.toFixed(0))} size='default' />
            <SkyTableTypography status={record.status}>
              {numberValidatorDisplay(totalCheckPassed) + ' / ' + numberValidatorDisplay(record.quantityPO)}
            </SkyTableTypography>
          </Flex>
        </>
      )
    },
    package: (record: DashboardTableDataType) => {
      const totalPackaged = record.completion ? numberValidatorCalc(record.completion.quantityPackaged) : 0
      const percent = (totalPackaged / numberValidatorCalc(record.quantityPO)) * 100
      return (
        <>
          <Flex vertical className='w-full'>
            <Progress percent={Number(percent.toFixed(0))} size='default' />
            <SkyTableTypography status={record.status}>
              {numberValidatorDisplay(totalPackaged) + ' / ' + numberValidatorDisplay(record.quantityPO)}
            </SkyTableTypography>
          </Flex>
        </>
      )
    }
  }

  const tableColumns: ColumnsType<DashboardTableDataType> = [
    {
      title: 'Mã hàng',
      dataIndex: 'productCode',
      width: '7%',
      render: (_value: any, record: DashboardTableDataType) => {
        return columns.productCode(record)
      }
    },
    {
      title: 'Màu',
      dataIndex: 'color',
      width: '10%',
      render: (_value: any, record: DashboardTableDataType) => {
        return columns.productColor(record)
      }
    },
    // {
    //   title: 'PO',
    //   dataIndex: 'quantityPO',
    //   width: '5%',
    //   responsive: ['sm'],
    //   render: (_value: any, record: DashboardTableDataType) => {
    //     return columns.quantityPO(record)
    //   }
    // },
    {
      title: 'May',
      dataIndex: 'sewed',
      width: '10%',
      responsive: ['sm'],
      render: (_value: any, record: DashboardTableDataType) => {
        return columns.sewing(record)
      }
    },
    {
      title: 'Ủi',
      dataIndex: 'ironed',
      width: '10%',
      responsive: ['md'],
      render: (_value: any, record: DashboardTableDataType) => {
        return columns.ironed(record)
      }
    },
    {
      title: 'Kiểm',
      dataIndex: 'checkPass',
      width: '10%',
      responsive: ['lg'],
      render: (_value: any, record: DashboardTableDataType) => {
        return columns.checkPass(record)
      }
    },
    {
      title: 'Đóng gói',
      dataIndex: 'packaged',
      width: '10%',
      responsive: ['xl'],
      render: (_value: any, record: DashboardTableDataType) => {
        return columns.package(record)
      }
    }
  ]

  return (
    <>
      <Flex vertical gap={30}>
        <Typography.Title className='my-0' level={2}>
          Dashboard
        </Typography.Title>
        <Flex className='w-full'>
          <StatisticSlide className='w-full' />
          {/* <Flex vertical>
            <NotificationView className='w-96' />
          </Flex> */}
        </Flex>
        <Flex vertical>
          <Typography.Title className='my-0' level={4}>
            Tiến trình mã hàng
          </Typography.Title>
          <BaseLayout>
            <SkyTable
              bordered
              loading={table.loading}
              columns={tableColumns}
              editingKey={table.editingKey}
              deletingKey={table.deletingKey}
              dataSource={table.dataSource}
              rowClassName='editable-row'
              metaData={productService.metaData}
              onPageChange={handlePageChange}
              isShowDeleted={table.showDeleted}
              expandable={{
                expandedRowRender: (record: DashboardTableDataType) => {
                  return (
                    <Flex vertical className='w-full md:w-1/2'>
                      <Space direction='vertical' size={10} split={<Divider className='my-0 py-0' />}>
                        {/* {!(width >= breakpoint.sm) && (
                        <ExpandableItemRow title='Số lượng PO:' isEditing={table.isEditing(record.id!)}>
                          {columns.quantityPO(record)}
                        </ExpandableItemRow>
                      )} */}
                        {!(width >= breakpoint.sm) && (
                          <ExpandableItemRow title='May:' isEditing={table.isEditing(record.id!)}>
                            {columns.sewing(record)}
                          </ExpandableItemRow>
                        )}
                        {!(width >= breakpoint.md) && (
                          <ExpandableItemRow title='Ủi:' isEditing={table.isEditing(record.id!)}>
                            {columns.ironed(record)}
                          </ExpandableItemRow>
                        )}
                        {!(width >= breakpoint.lg) && (
                          <ExpandableItemRow title='Kiểm:' isEditing={table.isEditing(record.id!)}>
                            {columns.checkPass(record)}
                          </ExpandableItemRow>
                        )}
                        {!(width >= breakpoint.xl) && (
                          <ExpandableItemRow title='Đóng gói:' isEditing={table.isEditing(record.id!)}>
                            {columns.package(record)}
                          </ExpandableItemRow>
                        )}
                      </Space>
                    </Flex>
                  )
                },
                columnWidth: '0.001%',
                showExpandColumn: !(width >= breakpoint.xl)
              }}
            />
          </BaseLayout>
        </Flex>
      </Flex>
    </>
  )
}

export default Dashboard
