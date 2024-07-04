import { ColorPicker, Flex } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { Dayjs } from 'dayjs'
import useDevice from '~/components/hooks/useDevice'
import useTitle from '~/components/hooks/useTitle'
import BaseLayout from '~/components/layout/BaseLayout'
import EditableStateCell from '~/components/sky-ui/SkyTable/EditableStateCell'
import SkyTable from '~/components/sky-ui/SkyTable/SkyTable'
import SkyTableExpandableItemRow from '~/components/sky-ui/SkyTable/SkyTableExpandableItemRow'
import SkyTableExpandableLayout from '~/components/sky-ui/SkyTable/SkyTableExpandableLayout'
import SkyTableTypography from '~/components/sky-ui/SkyTable/SkyTableTypography'
import { dateFormatter } from '~/utils/date-formatter'
import {
  breakpoint,
  dateValidatorChange,
  dateValidatorDisplay,
  dateValidatorInit,
  numberValidatorDisplay,
  textValidatorDisplay
} from '~/utils/helpers'
import useSampleSewingViewModel from './hooks/useSampleSewingViewModel'
import { SampleSewingTableDataType } from './type'

const SampleSewingPage = () => {
  useTitle('Sample Sewing | Phung Nguyen')
  const viewModel = useSampleSewingViewModel()
  const { width } = useDevice()

  const columns = {
    productCode: (record: SampleSewingTableDataType) => {
      return (
        <SkyTableTypography strong status={record.status}>
          {textValidatorDisplay(record.productCode)}
        </SkyTableTypography>
      )
    },
    quantityPO: (record: SampleSewingTableDataType) => {
      return <SkyTableTypography status={'active'}>{numberValidatorDisplay(record.quantityPO)}</SkyTableTypography>
    },
    productColor: (record: SampleSewingTableDataType) => {
      return (
        <Flex justify='space-between' align='center' gap={10} wrap='wrap'>
          <SkyTableTypography status={record.productColor?.color?.status} className='w-fit'>
            {textValidatorDisplay(record.productColor?.color?.name)}
          </SkyTableTypography>
          {record.productColor && (
            <ColorPicker size='middle' format='hex' value={record.productColor?.color?.hexColor} disabled />
          )}
        </Flex>
      )
    },
    productGroup: (record: SampleSewingTableDataType) => {
      return (
        <SkyTableTypography status={record.productGroup?.group?.status}>
          {textValidatorDisplay(record.productGroup?.group?.name)}
        </SkyTableTypography>
      )
    },
    printablePlace: (record: SampleSewingTableDataType) => {
      return (
        <SkyTableTypography status={record.printablePlace?.print?.status}>
          {textValidatorDisplay(record.printablePlace?.print?.name)}
        </SkyTableTypography>
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
      title: 'Số lượng PO',
      dataIndex: 'quantityPO',
      width: '7%',
      responsive: ['md'],
      render: (_value: any, record: SampleSewingTableDataType) => {
        return columns.quantityPO(record)
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
      title: 'Nhóm',
      dataIndex: 'groupID',
      width: '7%',
      responsive: ['lg'],
      render: (_value: any, record: SampleSewingTableDataType) => {
        return columns.productGroup(record)
      }
    },
    {
      title: 'Nơi in',
      dataIndex: 'printID',
      width: '10%',
      responsive: ['xl'],
      render: (_value: any, record: SampleSewingTableDataType) => {
        return columns.printablePlace(record)
      }
    }
  ]

  const expandableColumns = {
    dateSubmissionNPL: (record: SampleSewingTableDataType) => {
      return (
        <EditableStateCell
          isEditing={viewModel.table.isEditing(record.key)}
          dataIndex='dateSubmissionNPL'
          title='NPL may mẫu'
          inputType='datepicker'
          required
          defaultValue={dateValidatorInit(record.sampleSewing?.dateSubmissionNPL)}
          onValueChange={(val: Dayjs) =>
            viewModel.state.setNewRecord((prev) => {
              return { ...prev, dateSubmissionNPL: dateFormatter(val, 'iso8601') }
            })
          }
        >
          <SkyTableTypography status='active'>
            {dateValidatorDisplay(record.sampleSewing?.dateSubmissionNPL)}
          </SkyTableTypography>
        </EditableStateCell>
      )
    },
    dateApprovalPP: (record: SampleSewingTableDataType) => {
      return (
        <EditableStateCell
          isEditing={viewModel.table.isEditing(record.key)}
          dataIndex='dateApprovalPP'
          title='Ngày duyệt mẫu PP'
          inputType='datepicker'
          required
          defaultValue={dateValidatorInit(record.sampleSewing?.dateApprovalPP)}
          onValueChange={(val: Dayjs) =>
            viewModel.state.setNewRecord((prev) => {
              return { ...prev, dateApprovalPP: dateValidatorChange(val) }
            })
          }
        >
          <SkyTableTypography status='active'>
            {dateValidatorDisplay(record.sampleSewing?.dateApprovalPP)}
          </SkyTableTypography>
        </EditableStateCell>
      )
    },
    dateApprovalSO: (record: SampleSewingTableDataType) => {
      return (
        <EditableStateCell
          isEditing={viewModel.table.isEditing(record.key)}
          dataIndex='dateApprovalSO'
          title='Ngày duyệt SO'
          inputType='datepicker'
          required
          defaultValue={dateValidatorInit(record.sampleSewing?.dateApprovalSO)}
          onValueChange={(val: Dayjs) =>
            viewModel.state.setNewRecord((prev) => {
              return { ...prev, dateApprovalSO: dateValidatorChange(val) }
            })
          }
        >
          <SkyTableTypography status='active'>
            {dateValidatorDisplay(record.sampleSewing?.dateApprovalSO)}
          </SkyTableTypography>
        </EditableStateCell>
      )
    },
    dateSubmissionFirstTime: (record: SampleSewingTableDataType) => {
      return (
        <EditableStateCell
          isEditing={viewModel.table.isEditing(record.key)}
          dataIndex='dateSubmissionFirstTime'
          title='Ngày gửi mẫu lần 1'
          inputType='datepicker'
          required
          defaultValue={dateValidatorInit(record.sampleSewing?.dateSubmissionFirstTime)}
          onValueChange={(val: Dayjs) =>
            viewModel.state.setNewRecord({
              ...viewModel.state.newRecord,
              dateSubmissionFirstTime: dateValidatorChange(val)
            })
          }
        >
          <SkyTableTypography status='active'>
            {dateValidatorDisplay(record.sampleSewing?.dateSubmissionFirstTime)}
          </SkyTableTypography>
        </EditableStateCell>
      )
    },
    dateSubmissionSecondTime: (record: SampleSewingTableDataType) => {
      return (
        <EditableStateCell
          isEditing={viewModel.table.isEditing(record.key)}
          dataIndex='dateSubmissionSecondTime'
          title='Ngày gửi mẫu lần 2'
          inputType='datepicker'
          required
          defaultValue={dateValidatorInit(record.sampleSewing?.dateSubmissionSecondTime)}
          onValueChange={(val: Dayjs) =>
            viewModel.state.setNewRecord({
              ...viewModel.state.newRecord,
              dateSubmissionSecondTime: dateValidatorChange(val)
            })
          }
        >
          <SkyTableTypography status='active'>
            {dateValidatorDisplay(record.sampleSewing?.dateSubmissionSecondTime)}
          </SkyTableTypography>
        </EditableStateCell>
      )
    },
    dateSubmissionThirdTime: (record: SampleSewingTableDataType) => {
      return (
        <EditableStateCell
          isEditing={viewModel.table.isEditing(record.key)}
          dataIndex='dateSubmissionThirdTime'
          title='Ngày gửi mẫu lần 3'
          inputType='datepicker'
          required
          defaultValue={dateValidatorInit(record.sampleSewing?.dateSubmissionThirdTime)}
          onValueChange={(val: Dayjs) =>
            viewModel.state.setNewRecord({
              ...viewModel.state.newRecord,
              dateSubmissionThirdTime: dateValidatorChange(val)
            })
          }
        >
          <SkyTableTypography status='active'>
            {dateValidatorDisplay(record.sampleSewing?.dateSubmissionThirdTime)}
          </SkyTableTypography>
        </EditableStateCell>
      )
    },
    dateSubmissionForthTime: (record: SampleSewingTableDataType) => {
      return (
        <EditableStateCell
          isEditing={viewModel.table.isEditing(record.key)}
          dataIndex='dateSubmissionForthTime'
          title='Ngày gửi mẫu lần 4'
          inputType='datepicker'
          required
          defaultValue={dateValidatorInit(record.sampleSewing?.dateSubmissionForthTime)}
          onValueChange={(val: Dayjs) =>
            viewModel.state.setNewRecord({
              ...viewModel.state.newRecord,
              dateSubmissionForthTime: dateValidatorChange(val)
            })
          }
        >
          <SkyTableTypography status='active'>
            {dateValidatorDisplay(record.sampleSewing?.dateSubmissionForthTime)}
          </SkyTableTypography>
        </EditableStateCell>
      )
    },
    dateSubmissionFifthTime: (record: SampleSewingTableDataType) => {
      return (
        <EditableStateCell
          isEditing={viewModel.table.isEditing(record.key)}
          dataIndex='dateSubmissionFifthTime'
          title='Ngày gửi mẫu lần 5'
          inputType='datepicker'
          required
          defaultValue={dateValidatorInit(record.sampleSewing?.dateSubmissionFifthTime)}
          onValueChange={(val: Dayjs) =>
            viewModel.state.setNewRecord({
              ...viewModel.state.newRecord,
              dateSubmissionFifthTime: dateValidatorChange(val)
            })
          }
        >
          <SkyTableTypography status='active'>
            {dateValidatorDisplay(record.sampleSewing?.dateSubmissionFifthTime)}
          </SkyTableTypography>
        </EditableStateCell>
      )
    }
  }

  return (
    <>
      <BaseLayout
        title='May mẫu'
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
            onEdit: {
              handleClick: (record) => {
                if (record.sampleSewing)
                  viewModel.state.setNewRecord({
                    dateApprovalPP: record.sampleSewing.dateApprovalPP,
                    dateApprovalSO: record.sampleSewing.dateApprovalSO,
                    dateSubmissionNPL: record.sampleSewing.dateSubmissionNPL,
                    dateSubmissionFirstTime: record.sampleSewing.dateSubmissionFirstTime,
                    dateSubmissionSecondTime: record.sampleSewing.dateSubmissionSecondTime,
                    dateSubmissionThirdTime: record.sampleSewing.dateSubmissionThirdTime,
                    dateSubmissionForthTime: record.sampleSewing.dateSubmissionForthTime,
                    dateSubmissionFifthTime: record.sampleSewing.dateSubmissionFifthTime
                  })
                viewModel.table.handleStartEditing(record.key)
              },
              isShow: !viewModel.state.showDeleted
            },
            onSave: {
              handleClick: (record) => viewModel.action.handleUpdate(record),
              isShow: !viewModel.state.showDeleted
            },
            onDelete: {
              handleClick: (record) => viewModel.table.handleStartDeleting(record.key),
              isShow: !viewModel.state.showDeleted
            },
            // onDeleteForever: {
            //   isShow: viewModel.state.showDeleted
            // },
            // onRestore: {
            //   handleClick: (record) => viewModel.table.handleStartRestore(record.key),
            //   isShow: viewModel.state.showDeleted
            // },
            // Delete forever
            // onConfirmDeleteForever: (record) => viewModel.action.handleDeleteForever(record),
            // Cancel editing
            onConfirmCancelEditing: () => viewModel.table.handleCancelEditing(),
            // Cancel delete
            onConfirmCancelDeleting: () => viewModel.table.handleCancelDeleting(),
            // Start delete
            onConfirmDelete: (record) => viewModel.action.handleDeleteForever(record),
            // Cancel restore
            onConfirmCancelRestore: () => viewModel.table.handleCancelRestore(),
            // Restore
            onConfirmRestore: (record) => viewModel.action.handleRestore(record),
            // Show hide action col
            isShow: !viewModel.state.showDeleted
          }}
          expandable={{
            expandedRowRender: (record) => {
              return (
                <>
                  <SkyTableExpandableLayout>
                    {!(width >= breakpoint.md) && (
                      <SkyTableExpandableItemRow
                        title='Số lượng PO:'
                        isEditing={viewModel.table.isEditing(`${record.id}`)}
                      >
                        {columns.quantityPO(record)}
                      </SkyTableExpandableItemRow>
                    )}

                    {!(width >= breakpoint.sm) && (
                      <SkyTableExpandableItemRow title='Màu:' isEditing={viewModel.table.isEditing(`${record.id}`)}>
                        {columns.productColor(record)}
                      </SkyTableExpandableItemRow>
                    )}

                    {!(width >= breakpoint.lg) && (
                      <SkyTableExpandableItemRow title='Nhóm:' isEditing={viewModel.table.isEditing(`${record.id}`)}>
                        {columns.productGroup(record)}
                      </SkyTableExpandableItemRow>
                    )}

                    {!(width >= breakpoint.xl) && (
                      <SkyTableExpandableItemRow title='Nơi in:' isEditing={viewModel.table.isEditing(`${record.id}`)}>
                        {columns.printablePlace(record)}
                      </SkyTableExpandableItemRow>
                    )}

                    <SkyTableExpandableItemRow title='NPL may mẫu:' isEditing={viewModel.table.isEditing(record.key)}>
                      {expandableColumns.dateSubmissionNPL(record)}
                    </SkyTableExpandableItemRow>

                    <SkyTableExpandableItemRow
                      title='Ngày duyệt mẫu PP:'
                      isEditing={viewModel.table.isEditing(record.key)}
                    >
                      {expandableColumns.dateApprovalPP(record)}
                    </SkyTableExpandableItemRow>

                    <SkyTableExpandableItemRow title='Ngày duyệt SO:' isEditing={viewModel.table.isEditing(record.key)}>
                      {expandableColumns.dateApprovalSO(record)}
                    </SkyTableExpandableItemRow>

                    <SkyTableExpandableItemRow
                      title='Ngày gửi mẫu lần 1:'
                      isEditing={viewModel.table.isEditing(record.key)}
                    >
                      {expandableColumns.dateSubmissionFirstTime(record)}
                    </SkyTableExpandableItemRow>

                    <SkyTableExpandableItemRow
                      title='Ngày gửi mẫu lần 2:'
                      isEditing={viewModel.table.isEditing(record.key)}
                    >
                      {expandableColumns.dateSubmissionSecondTime(record)}
                    </SkyTableExpandableItemRow>

                    <SkyTableExpandableItemRow
                      title='Ngày gửi mẫu lần 3:'
                      isEditing={viewModel.table.isEditing(record.key)}
                    >
                      {expandableColumns.dateSubmissionThirdTime(record)}
                    </SkyTableExpandableItemRow>

                    <SkyTableExpandableItemRow
                      title='Ngày gửi mẫu lần 4:'
                      isEditing={viewModel.table.isEditing(record.key)}
                    >
                      {expandableColumns.dateSubmissionForthTime(record)}
                    </SkyTableExpandableItemRow>

                    <SkyTableExpandableItemRow
                      title='Ngày gửi mẫu lần 5:'
                      isEditing={viewModel.table.isEditing(record.key)}
                    >
                      {expandableColumns.dateSubmissionFifthTime(record)}
                    </SkyTableExpandableItemRow>
                  </SkyTableExpandableLayout>
                </>
              )
            },
            columnWidth: '0.001%',
            onExpand: (expanded, record: SampleSewingTableDataType) =>
              viewModel.table.handleStartExpanding(expanded, record.key),
            expandedRowKeys: viewModel.table.expandingKeys
          }}
        />
      </BaseLayout>
    </>
  )
}

export default SampleSewingPage
