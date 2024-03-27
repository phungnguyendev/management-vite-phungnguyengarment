import { ColorPicker, Divider, Flex, Space } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { Dayjs } from 'dayjs'
import { useSelector } from 'react-redux'
import useDevice from '~/components/hooks/useDevice'
import useTable from '~/components/hooks/useTable'
import useTitle from '~/components/hooks/useTitle'
import BaseLayout from '~/components/layout/BaseLayout'
import EditableStateCell from '~/components/sky-ui/SkyTable/EditableStateCell'
import ExpandableItemRow from '~/components/sky-ui/SkyTable/ExpandableItemRow'
import SkyTable from '~/components/sky-ui/SkyTable/SkyTable'
import SkyTableTypography from '~/components/sky-ui/SkyTable/SkyTableTypography'
import { RootState } from '~/store/store'
import {
  breakpoint,
  dateValidatorChange,
  dateValidatorDisplay,
  dateValidatorInit,
  textValidatorDisplay
} from '~/utils/helpers'
import useSampleSewing from './hooks/useSampleSewing'
import { SampleSewingTableDataType } from './type'

const SampleSewingPage = () => {
  const table = useTable<SampleSewingTableDataType>([])
  const {
    searchText,
    setSearchText,
    newRecord,
    setNewRecord,
    handleResetClick,
    handleSortChange,
    handleSearch,
    handleSaveClick,
    handleConfirmDelete,
    handlePageChange,
    productService
  } = useSampleSewing(table)
  const { width } = useDevice()
  const currentUser = useSelector((state: RootState) => state.user)
  useTitle('May mẫu')

  const columns = {
    productCode: (record: SampleSewingTableDataType) => {
      return (
        <EditableStateCell isEditing={false} dataIndex='productCode' title='Mã hàng' inputType='text' required={true}>
          <SkyTableTypography strong status={record.status}>
            {textValidatorDisplay(record.productCode)}
          </SkyTableTypography>
        </EditableStateCell>
      )
    },
    productColor: (record: SampleSewingTableDataType) => {
      return (
        <EditableStateCell isEditing={false} dataIndex='colorID' title='Màu' inputType='colorselector' required={false}>
          <Flex justify='space-between' align='center' gap={10} wrap='wrap'>
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
    dateSubmissionNPL: (record: SampleSewingTableDataType) => {
      return (
        <EditableStateCell
          isEditing={table.isEditing(record.key!)}
          dataIndex='dateSubmissionNPL'
          title='NPL may mẫu'
          inputType='datepicker'
          required={true}
          initialValue={record.sampleSewing && dateValidatorInit(record.sampleSewing.dateSubmissionNPL)}
          onValueChange={(val: Dayjs) => setNewRecord({ ...newRecord, dateSubmissionNPL: dateValidatorChange(val) })}
        >
          <SkyTableTypography status={record.status}>
            {(record.sampleSewing && dateValidatorDisplay(record.sampleSewing.dateSubmissionNPL)) ?? '--/--/----'}
          </SkyTableTypography>
        </EditableStateCell>
      )
    },
    dateApprovalPP: (record: SampleSewingTableDataType) => {
      return (
        <EditableStateCell
          isEditing={table.isEditing(record.key!)}
          dataIndex='dateApprovalPP'
          title='Ngày duyệt mẫu PP'
          inputType='datepicker'
          required={true}
          initialValue={record.sampleSewing && dateValidatorInit(record.sampleSewing.dateApprovalPP)}
          onValueChange={(val: Dayjs) => setNewRecord({ ...newRecord, dateApprovalPP: dateValidatorChange(val) })}
        >
          <SkyTableTypography status={record.status}>
            {(record.sampleSewing && dateValidatorDisplay(record.sampleSewing.dateApprovalPP)) ?? '--/--/----'}
          </SkyTableTypography>
        </EditableStateCell>
      )
    },
    dateApprovalSO: (record: SampleSewingTableDataType) => {
      return (
        <EditableStateCell
          isEditing={table.isEditing(record.key!)}
          dataIndex='dateApprovalSO'
          title='Ngày duyệt SO'
          inputType='datepicker'
          required={true}
          initialValue={record.sampleSewing && dateValidatorInit(record.sampleSewing.dateApprovalSO)}
          onValueChange={(val: Dayjs) => setNewRecord({ ...newRecord, dateApprovalSO: dateValidatorChange(val) })}
        >
          <SkyTableTypography status={record.status}>
            {(record.sampleSewing && dateValidatorDisplay(record.sampleSewing.dateApprovalSO)) ?? '--/--/----'}
          </SkyTableTypography>
        </EditableStateCell>
      )
    }
  }

  const tableColumns: ColumnsType<SampleSewingTableDataType> = [
    {
      title: 'Mã hàng',
      dataIndex: 'productCode',
      width: '15%',
      render: (_value: any, record: SampleSewingTableDataType) => {
        return columns.productCode(record)
      }
    },
    {
      title: 'Màu',
      dataIndex: 'colorID',
      width: '10%',
      responsive: ['sm'],
      render: (_value: any, record: SampleSewingTableDataType) => {
        return columns.productColor(record)
      }
    },
    {
      title: 'NPL may mẫu',
      dataIndex: 'dateSubmissionNPL',
      width: '15%',
      responsive: ['md'],
      render: (_value: any, record: SampleSewingTableDataType) => {
        return columns.dateSubmissionNPL(record)
      }
    },
    {
      title: 'Ngày duyệt mẫu PP',
      dataIndex: 'dateApprovalPP',
      width: '15%',
      responsive: ['lg'],
      render: (_value: any, record: SampleSewingTableDataType) => {
        return columns.dateApprovalPP(record)
      }
    },
    {
      title: 'Ngày duyệt SO',
      dataIndex: 'dateApprovalSO',
      width: '15%',
      responsive: ['xl'],
      render: (_value: any, record: SampleSewingTableDataType) => {
        return columns.dateApprovalSO(record)
      }
    }
  ]

  const expandableColumns = {
    dateSubmissionFirstTime: (record: SampleSewingTableDataType) => {
      return (
        <EditableStateCell
          isEditing={table.isEditing(record.key!)}
          dataIndex='dateSubmissionFirstTime'
          title='Ngày gửi mẫu lần 1'
          inputType='datepicker'
          required={true}
          initialValue={record.sampleSewing && dateValidatorInit(record.sampleSewing.dateSubmissionFirstTime)}
          onValueChange={(val: Dayjs) =>
            setNewRecord({
              ...newRecord,
              dateSubmissionFirstTime: dateValidatorChange(val)
            })
          }
        >
          <SkyTableTypography status={record.status}>
            {record.sampleSewing && dateValidatorDisplay(record.sampleSewing.dateSubmissionFirstTime)}
          </SkyTableTypography>
        </EditableStateCell>
      )
    },
    dateSubmissionSecondTime: (record: SampleSewingTableDataType) => {
      return (
        <EditableStateCell
          isEditing={table.isEditing(record.key!)}
          dataIndex='dateSubmissionSecondTime'
          title='Ngày gửi mẫu lần 2'
          inputType='datepicker'
          required={true}
          initialValue={record.sampleSewing && dateValidatorInit(record.sampleSewing.dateSubmissionSecondTime)}
          onValueChange={(val: Dayjs) =>
            setNewRecord({
              ...newRecord,
              dateSubmissionSecondTime: dateValidatorChange(val)
            })
          }
        >
          <SkyTableTypography status={record.status}>
            {record.sampleSewing && dateValidatorDisplay(record.sampleSewing.dateSubmissionSecondTime)}
          </SkyTableTypography>
        </EditableStateCell>
      )
    },
    dateSubmissionThirdTime: (record: SampleSewingTableDataType) => {
      return (
        <EditableStateCell
          isEditing={table.isEditing(record.key!)}
          dataIndex='dateSubmissionThirdTime'
          title='Ngày gửi mẫu lần 3'
          inputType='datepicker'
          required={true}
          initialValue={record.sampleSewing && dateValidatorInit(record.sampleSewing.dateSubmissionThirdTime)}
          onValueChange={(val: Dayjs) =>
            setNewRecord({
              ...newRecord,
              dateSubmissionThirdTime: dateValidatorChange(val)
            })
          }
        >
          <SkyTableTypography status={record.status}>
            {record.sampleSewing && dateValidatorDisplay(record.sampleSewing.dateSubmissionThirdTime)}
          </SkyTableTypography>
        </EditableStateCell>
      )
    },
    dateSubmissionForthTime: (record: SampleSewingTableDataType) => {
      return (
        <EditableStateCell
          isEditing={table.isEditing(record.key!)}
          dataIndex='dateSubmissionForthTime'
          title='Ngày gửi mẫu lần 4'
          inputType='datepicker'
          required={true}
          initialValue={record.sampleSewing && dateValidatorInit(record.sampleSewing.dateSubmissionForthTime)}
          onValueChange={(val: Dayjs) =>
            setNewRecord({
              ...newRecord,
              dateSubmissionForthTime: dateValidatorChange(val)
            })
          }
        >
          <SkyTableTypography status={record.status}>
            {record.sampleSewing && dateValidatorDisplay(record.sampleSewing.dateSubmissionForthTime)}
          </SkyTableTypography>
        </EditableStateCell>
      )
    },
    dateSubmissionFifthTime: (record: SampleSewingTableDataType) => {
      return (
        <EditableStateCell
          isEditing={table.isEditing(record.key!)}
          dataIndex='dateSubmissionFifthTime'
          title='Ngày gửi mẫu lần 5'
          inputType='datepicker'
          required={true}
          initialValue={record.sampleSewing && dateValidatorInit(record.sampleSewing.dateSubmissionFifthTime)}
          onValueChange={(val: Dayjs) =>
            setNewRecord({
              ...newRecord,
              dateSubmissionFifthTime: dateValidatorChange(val)
            })
          }
        >
          <SkyTableTypography status={record.status}>
            {record.sampleSewing && dateValidatorDisplay(record.sampleSewing.dateSubmissionFifthTime)}
          </SkyTableTypography>
        </EditableStateCell>
      )
    }
  }

  // const expandableCols: ColumnsType<SampleSewingTableDataType> = [
  //   {
  //     title: 'Ngày gửi mẫu lần 1',
  //     dataIndex: 'dateSubmissionFirstTime',
  //     width: '15%',
  //     render: (_value: any, record: SampleSewingTableDataType) => {
  //       return expandableColumns.dateSubmissionFirstTime(record)
  //     }
  //   },
  //   {
  //     title: 'Ngày gửi mẫu lần 2',
  //     dataIndex: 'dateSubmissionSecondTime',
  //     width: '15%',
  //     render: (_value: any, record: SampleSewingTableDataType) => {
  //       return expandableColumns.dateSubmissionSecondTime(record)
  //     }
  //   },
  //   {
  //     title: 'Ngày gửi mẫu lần 3',
  //     dataIndex: 'dateSubmissionThirdTime',
  //     width: '15%',
  //     render: (_value: any, record: SampleSewingTableDataType) => {
  //       return expandableColumns.dateSubmissionThirdTime(record)
  //     }
  //   },
  //   {
  //     title: 'Ngày gửi mẫu lần 4',
  //     dataIndex: 'dateSubmissionForthTime',
  //     width: '15%',
  //     render: (_value: any, record: SampleSewingTableDataType) => {
  //       return expandableColumns.dateSubmissionForthTime(record)
  //     }
  //   },
  //   {
  //     title: 'Ngày gửi mẫu lần 5',
  //     dataIndex: 'dateSubmissionFifthTime',
  //     width: '15%',
  //     render: (_value: any, record: SampleSewingTableDataType) => {
  //       return expandableColumns.dateSubmissionFirstTime(record)
  //     }
  //   }
  // ]

  return (
    <>
      <BaseLayout
        title='May mẫu'
        searchPlaceHolder='Mã hàng...'
        searchValue={searchText}
        onDeletedRecordStateChange={
          currentUser.userRoles.includes('admin') || currentUser.userRoles.includes('product_manager')
            ? (enable) => table.setDeletedRecordState(enable)
            : undefined
        }
        onSearchChange={(e) => setSearchText(e.target.value)}
        onSearch={(value) => handleSearch(value)}
        onSortChange={(checked) => handleSortChange(checked)}
        onResetClick={{
          onClick: () => handleResetClick(),
          isShow: true
        }}
      >
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
          actions={{
            onEdit: {
              onClick: (_e, record) => {
                setNewRecord({
                  ...record?.sampleSewing
                })
                table.handleStartEditing(record!.key!)
              },
              isShow: !table.showDeleted
            },
            onSave: {
              onClick: (_e, record) => handleSaveClick(record!, newRecord!)
            },
            onDelete: {
              onClick: (_e, record) => table.handleStartDeleting(record!.key!),
              isShow: !table.showDeleted
            },
            onConfirmCancelEditing: () => table.handleConfirmCancelEditing(),
            onConfirmCancelDeleting: () => table.handleConfirmCancelDeleting(),
            onConfirmDelete: (record) => handleConfirmDelete(record),
            isShow: currentUser.userRoles.includes('admin') || currentUser.userRoles.includes('sample_sewing_manager')
          }}
          expandable={{
            expandedRowRender: (record) => {
              return (
                <Flex vertical className='overflow-hidden'>
                  <Space direction='vertical' size={10} split={<Divider className='my-0 py-0' />}>
                    {!(width >= breakpoint.sm) && (
                      <ExpandableItemRow className='w-1/2' title='Màu:' isEditing={table.isEditing(record.id!)}>
                        {columns.productColor(record)}
                      </ExpandableItemRow>
                    )}
                    {!(width >= breakpoint.md) && (
                      <ExpandableItemRow className='w-1/2' title='NPL may mẫu:' isEditing={table.isEditing(record.id!)}>
                        {columns.dateSubmissionNPL(record)}
                      </ExpandableItemRow>
                    )}
                    {!(width >= breakpoint.lg) && (
                      <ExpandableItemRow
                        className='w-1/2'
                        title='Ngày duyệt mẫu PP:'
                        isEditing={table.isEditing(record.id!)}
                      >
                        {columns.dateApprovalPP(record)}
                      </ExpandableItemRow>
                    )}
                    {!(width >= breakpoint.xl) && (
                      <ExpandableItemRow
                        className='w-1/2'
                        title='Ngày duyệt SO:'
                        isEditing={table.isEditing(record.id!)}
                      >
                        {columns.dateApprovalSO(record)}
                      </ExpandableItemRow>
                    )}
                    <ExpandableItemRow
                      className='w-1/2'
                      title='Ngày gửi mẫu lần 1:'
                      isEditing={table.isEditing(record.id!)}
                    >
                      {expandableColumns.dateSubmissionFirstTime(record)}
                    </ExpandableItemRow>
                    <ExpandableItemRow
                      className='w-1/2'
                      title='Ngày gửi mẫu lần 2:'
                      isEditing={table.isEditing(record.id!)}
                    >
                      {expandableColumns.dateSubmissionSecondTime(record)}
                    </ExpandableItemRow>
                    <ExpandableItemRow
                      className='w-1/2'
                      title='Ngày gửi mẫu lần 3:'
                      isEditing={table.isEditing(record.id!)}
                    >
                      {expandableColumns.dateSubmissionThirdTime(record)}
                    </ExpandableItemRow>
                    <ExpandableItemRow
                      className='w-1/2'
                      title='Ngày gửi mẫu lần 4:'
                      isEditing={table.isEditing(record.id!)}
                    >
                      {expandableColumns.dateSubmissionForthTime(record)}
                    </ExpandableItemRow>
                    <ExpandableItemRow
                      className='w-1/2'
                      title='Ngày gửi mẫu lần 5:'
                      isEditing={table.isEditing(record.id!)}
                    >
                      {expandableColumns.dateSubmissionFifthTime(record)}
                    </ExpandableItemRow>
                  </Space>
                </Flex>
              )
            },
            columnWidth: '0.001%'
          }}
        />
      </BaseLayout>
    </>
  )
}

export default SampleSewingPage
