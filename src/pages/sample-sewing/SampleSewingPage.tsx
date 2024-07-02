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
  textValidatorDisplay
} from '~/utils/helpers'
import useSampleSewingViewModel from './hooks/useSampleSewingViewModel'
import { SampleSewingTableDataType } from './type'

const SampleSewingPage = () => {
  useTitle('Sample Sewing | Phung Nguyen')
  const { state, action, table } = useSampleSewingViewModel()
  const { newRecord, setNewRecord, showDeleted, setShowDeleted, searchTextChange, setSearchTextChange } = state
  const {
    handleUpdate,
    handleDelete,
    handleDeleteForever,
    handlePageChange,
    handleRestore,
    handleSearch,
    handleSortChange
  } = action
  const { width } = useDevice()

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
          onValueChange={(val: Dayjs) =>
            setNewRecord((prev) => {
              return { ...prev, dateSubmissionNPL: dateFormatter(val, 'iso8601') }
            })
          }
        >
          <SkyTableTypography status={record.status}>
            {record.sampleSewing ? dateValidatorDisplay(record.sampleSewing.dateSubmissionNPL) : dateValidatorDisplay()}
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
          // initialValue={record.sampleSewing && dateValidatorInit(record.sampleSewing.dateApprovalPP)}
          onValueChange={(val: Dayjs) =>
            setNewRecord((prev) => {
              return { ...prev, dateApprovalPP: dateValidatorChange(val) }
            })
          }
        >
          <SkyTableTypography status={record.status}>
            {record.sampleSewing ? dateValidatorDisplay(record.sampleSewing.dateApprovalPP) : dateValidatorDisplay()}
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
          // initialValue={record.sampleSewing && dateValidatorInit(record.sampleSewing.dateApprovalSO)}
          onValueChange={(val: Dayjs) =>
            setNewRecord((prev) => {
              return { ...prev, dateApprovalSO: dateValidatorChange(val) }
            })
          }
        >
          <SkyTableTypography status={record.status}>
            {record.sampleSewing ? dateValidatorDisplay(record.sampleSewing.dateApprovalSO) : dateValidatorDisplay()}
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
          // initialValue={record.sampleSewing && dateValidatorInit(record.sampleSewing.dateSubmissionFirstTime)}
          onValueChange={(val: Dayjs) =>
            setNewRecord({
              ...newRecord,
              dateSubmissionFirstTime: dateValidatorChange(val)
            })
          }
        >
          <SkyTableTypography status={record.status}>
            {record.sampleSewing
              ? dateValidatorDisplay(record.sampleSewing.dateSubmissionSecondTime)
              : dateValidatorDisplay()}
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
          // initialValue={
          //   record.sampleSewing
          //     ? dateValidatorInit(record.sampleSewing.dateSubmissionSecondTime)
          //     : dateValidatorDisplay()
          // }
          onValueChange={(val: Dayjs) =>
            setNewRecord({
              ...newRecord,
              dateSubmissionSecondTime: dateValidatorChange(val)
            })
          }
        >
          <SkyTableTypography status={record.status}>
            {record.sampleSewing
              ? dateValidatorDisplay(record.sampleSewing.dateSubmissionSecondTime)
              : dateValidatorDisplay()}
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
          // initialValue={
          //   record.sampleSewing
          //     ? dateValidatorInit(record.sampleSewing.dateSubmissionThirdTime)
          //     : dateValidatorDisplay()
          // }
          onValueChange={(val: Dayjs) =>
            setNewRecord({
              ...newRecord,
              dateSubmissionThirdTime: dateValidatorChange(val)
            })
          }
        >
          <SkyTableTypography status={record.status}>
            {record.sampleSewing
              ? dateValidatorDisplay(record.sampleSewing.dateSubmissionThirdTime)
              : dateValidatorDisplay()}
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
          // initialValue={
          //   record.sampleSewing
          //     ? dateValidatorInit(record.sampleSewing.dateSubmissionForthTime)
          //     : dateValidatorDisplay()
          // }
          onValueChange={(val: Dayjs) =>
            setNewRecord({
              ...newRecord,
              dateSubmissionForthTime: dateValidatorChange(val)
            })
          }
        >
          <SkyTableTypography status={record.status}>
            {record.sampleSewing
              ? dateValidatorDisplay(record.sampleSewing.dateSubmissionForthTime)
              : dateValidatorDisplay()}
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
          // initialValue={
          //   record.sampleSewing
          //     ? dateValidatorInit(record.sampleSewing.dateSubmissionFifthTime)
          //     : dateValidatorDisplay()
          // }
          onValueChange={(val: Dayjs) =>
            setNewRecord({
              ...newRecord,
              dateSubmissionFifthTime: dateValidatorChange(val)
            })
          }
        >
          <SkyTableTypography status={record.status}>
            {record.sampleSewing
              ? dateValidatorDisplay(record.sampleSewing.dateSubmissionFifthTime)
              : dateValidatorDisplay()}
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
        loading={table.loading}
        searchProps={{
          onSearch: handleSearch,
          placeholder: 'Tên nhóm..',
          value: searchTextChange,
          onChange: (e) => setSearchTextChange(e.target.value)
        }}
        sortProps={{
          onChange: handleSortChange
        }}
        deleteProps={{
          onChange: setShowDeleted
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
          onPageChange={handlePageChange}
          isShowDeleted={showDeleted}
          actionProps={{
            onEdit: {
              handleClick: (record) => {
                if (record.sampleSewing)
                  setNewRecord({
                    dateApprovalPP: record.sampleSewing.dateApprovalPP,
                    dateApprovalSO: record.sampleSewing.dateApprovalSO,
                    dateSubmissionNPL: record.sampleSewing.dateSubmissionNPL,
                    dateSubmissionFirstTime: record.sampleSewing.dateSubmissionFirstTime,
                    dateSubmissionSecondTime: record.sampleSewing.dateSubmissionSecondTime,
                    dateSubmissionThirdTime: record.sampleSewing.dateSubmissionThirdTime,
                    dateSubmissionForthTime: record.sampleSewing.dateSubmissionForthTime,
                    dateSubmissionFifthTime: record.sampleSewing.dateSubmissionFifthTime
                  })
                table.handleStartEditing(record.key)
              },
              isShow: !showDeleted
            },
            onSave: {
              handleClick: (record) => handleUpdate(record),
              isShow: !showDeleted
            },
            onDelete: {
              handleClick: (record) => table.handleStartDeleting(record.key),
              isShow: !showDeleted
            },
            onDeleteForever: {
              isShow: showDeleted
            },
            onRestore: {
              handleClick: (record) => table.handleStartRestore(record.key),
              isShow: showDeleted
            },
            onConfirmDeleteForever: (record) => handleDeleteForever(record.id!),
            onConfirmCancelEditing: () => table.handleCancelEditing(),
            onConfirmCancelDeleting: () => table.handleCancelDeleting(),
            onConfirmDelete: (record) => handleDelete(record),
            onConfirmCancelRestore: () => table.handleCancelRestore(),
            onConfirmRestore: (record) => handleRestore(record),
            isShow: true
          }}
          expandable={{
            expandedRowRender: (record) => {
              return (
                <SkyTableExpandableLayout>
                  {!(width >= breakpoint.sm) && (
                    <SkyTableExpandableItemRow title='Màu:' isEditing={table.isEditing(record.id!)}>
                      {columns.productColor(record)}
                    </SkyTableExpandableItemRow>
                  )}
                  {!(width >= breakpoint.md) && (
                    <SkyTableExpandableItemRow title='NPL may mẫu:' isEditing={table.isEditing(record.id!)}>
                      {columns.dateSubmissionNPL(record)}
                    </SkyTableExpandableItemRow>
                  )}
                  {!(width >= breakpoint.lg) && (
                    <SkyTableExpandableItemRow title='Ngày duyệt mẫu PP:' isEditing={table.isEditing(record.id!)}>
                      {columns.dateApprovalPP(record)}
                    </SkyTableExpandableItemRow>
                  )}
                  {!(width >= breakpoint.xl) && (
                    <SkyTableExpandableItemRow title='Ngày duyệt SO:' isEditing={table.isEditing(record.id!)}>
                      {columns.dateApprovalSO(record)}
                    </SkyTableExpandableItemRow>
                  )}
                  <SkyTableExpandableItemRow title='Ngày gửi mẫu lần 1:' isEditing={table.isEditing(record.id!)}>
                    {expandableColumns.dateSubmissionFirstTime(record)}
                  </SkyTableExpandableItemRow>
                  <SkyTableExpandableItemRow title='Ngày gửi mẫu lần 2:' isEditing={table.isEditing(record.id!)}>
                    {expandableColumns.dateSubmissionSecondTime(record)}
                  </SkyTableExpandableItemRow>
                  <SkyTableExpandableItemRow title='Ngày gửi mẫu lần 3:' isEditing={table.isEditing(record.id!)}>
                    {expandableColumns.dateSubmissionThirdTime(record)}
                  </SkyTableExpandableItemRow>
                  <SkyTableExpandableItemRow title='Ngày gửi mẫu lần 4:' isEditing={table.isEditing(record.id!)}>
                    {expandableColumns.dateSubmissionForthTime(record)}
                  </SkyTableExpandableItemRow>
                  <SkyTableExpandableItemRow title='Ngày gửi mẫu lần 5:' isEditing={table.isEditing(record.id!)}>
                    {expandableColumns.dateSubmissionFifthTime(record)}
                  </SkyTableExpandableItemRow>
                </SkyTableExpandableLayout>
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
