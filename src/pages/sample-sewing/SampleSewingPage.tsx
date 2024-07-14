import { Flex } from 'antd'
import { ColumnsType, ColumnType } from 'antd/es/table'
import { Dayjs } from 'dayjs'
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
  isValidObject,
  numberValidatorDisplay,
  textValidatorDisplay,
  uniqueArray
} from '~/utils/helpers'
import useSampleSewingViewModel from './hooks/useSampleSewingViewModel'
import { SampleSewingTableDataType } from './type'

const PERMISSION_ACCESS_ROLE: UserRoleType[] = ['admin', 'sample_sewing_manager']

const SampleSewingPage = () => {
  useTitle('Sample Sewing | Phung Nguyen')
  const viewModel = useSampleSewingViewModel()
  const currentUser = useSelector((state: RootState) => state.user)
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
          <SkyTableColorPicker value={record.productColor?.color?.hexColor} disabled />
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
    actionCol: (record: SampleSewingTableDataType) => {
      return (
        <SkyTableActionRow
          record={record}
          editingKey={viewModel.table.editingKey}
          deletingKey={viewModel.table.deletingKey}
          buttonEdit={{
            onClick: () => {
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
            disabled: !isValidObject(record.sampleSewing)
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
          onConfirmRestore={() => viewModel.action.handleRestore(record)}
          // Show hide action col
        />
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
      render: (_value: any, record: SampleSewingTableDataType) => {
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
      responsive: ['md'],
      render: (_value: any, record: SampleSewingTableDataType) => {
        return columns.quantityPO(record)
      }
    },
    {
      title: 'Nhóm',
      dataIndex: 'groupID',
      width: '7%',
      responsive: ['lg'],
      render: (_value: any, record: SampleSewingTableDataType) => {
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

  const actionCol: ColumnType<SampleSewingTableDataType> = {
    title: 'Operation',
    width: '0.001%',
    render: (_value: any, record: SampleSewingTableDataType) => {
      return columns.actionCol(record)
    }
  }

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
      <BaseLayout title='May mẫu'>
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
              expandedRowRender: (record) => {
                return (
                  <>
                    <SkyTableExpandableLayout>
                      {!(width >= breakpoint.md) && (
                        <SkyTableExpandableItemRow title='Số lượng PO:' isEditing={false}>
                          {columns.quantityPO(record)}
                        </SkyTableExpandableItemRow>
                      )}
                      {!(width >= breakpoint.sm) && (
                        <SkyTableExpandableItemRow title='Màu:' isEditing={false}>
                          {columns.productColor(record)}
                        </SkyTableExpandableItemRow>
                      )}
                      {!(width >= breakpoint.lg) && (
                        <SkyTableExpandableItemRow title='Nhóm:' isEditing={false}>
                          {columns.productGroup(record)}
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
                      <SkyTableExpandableItemRow
                        title='Ngày duyệt SO:'
                        isEditing={viewModel.table.isEditing(record.key)}
                      >
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
        </SkyTableWrapperLayout>
      </BaseLayout>
    </>
  )
}

export default SampleSewingPage
