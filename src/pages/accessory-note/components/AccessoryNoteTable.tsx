import { ColumnType } from 'antd/es/table'
import useTable, { TableItemWithKey } from '~/components/hooks/useTable'
import BaseLayout from '~/components/layout/BaseLayout'
import EditableStateCell from '~/components/sky-ui/SkyTable/EditableStateCell'
import SkyTable from '~/components/sky-ui/SkyTable/SkyTable'
import SkyTableTypography from '~/components/sky-ui/SkyTable/SkyTableTypography'
import useAccessoryNote from '../hooks/useAccessoryNote'
import { AccessoryNoteTableDataType } from '../type'
import ModalAddNewAccessoryNote from './ModalAddNewAccessoryNote'

interface Props extends React.HTMLAttributes<HTMLElement> {}

const AccessoryNoteTable: React.FC<Props> = () => {
  const table = useTable<AccessoryNoteTableDataType>([])

  const {
    searchText,
    setSearchText,
    newRecord,
    setNewRecord,
    openModal,
    setOpenModal,
    handleResetClick,
    handleSortChange,
    handleSearch,
    handleSaveClick,
    handleAddNewItem,
    handleConfirmDelete,
    handlePageChange,
    accessoryNoteService
  } = useAccessoryNote(table)

  const columns: ColumnType<AccessoryNoteTableDataType>[] = [
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      width: '15%',
      render: (_value: any, record: TableItemWithKey<AccessoryNoteTableDataType>) => {
        return (
          <EditableStateCell
            isEditing={table.isEditing(record.key!)}
            dataIndex='title'
            title='Tiêu đề'
            inputType='text'
            required={true}
            initialValue={record.title}
            value={newRecord?.title}
            onValueChange={(val) => setNewRecord({ ...newRecord, title: val })}
          >
            <SkyTableTypography status={record.status}>{record.title}</SkyTableTypography>
          </EditableStateCell>
        )
      }
    },
    {
      title: 'Mô tả',
      dataIndex: 'summary',
      width: '15%',
      render: (_value: any, record: TableItemWithKey<AccessoryNoteTableDataType>) => {
        return (
          <EditableStateCell
            isEditing={table.isEditing(record.key!)}
            dataIndex='summary'
            title='Mô tả'
            inputType='textarea'
            initialValue={record.summary}
            value={newRecord?.summary}
            onValueChange={(val) => setNewRecord({ ...newRecord, summary: val })}
          >
            <SkyTableTypography status={record.status}>{record.summary}</SkyTableTypography>
          </EditableStateCell>
        )
      }
    }
  ]

  return (
    <>
      <BaseLayout
        searchValue={searchText}
        onDeletedRecordStateChange={(enable) => table.setDeletedRecordState(enable)}
        onSearchChange={(e) => setSearchText(e.target.value)}
        onSearch={(value) => handleSearch(value)}
        onSortChange={(checked) => handleSortChange(checked)}
        onResetClick={{
          onClick: () => handleResetClick()
        }}
        onAddNewClick={{
          onClick: () => setOpenModal(true)
        }}
      >
        <SkyTable
          bordered
          loading={table.loading}
          columns={columns}
          editingKey={table.editingKey}
          deletingKey={table.deletingKey}
          dataSource={table.dataSource}
          rowClassName='editable-row'
          metaData={accessoryNoteService.metaData}
          onPageChange={handlePageChange}
          isShowDeleted={table.showDeleted}
          actions={{
            onEdit: {
              onClick: (_e, record) => {
                setNewRecord(record!)
                table.handleStartEditing(record!.key!)
              }
            },
            onSave: {
              onClick: (_e, record) => handleSaveClick(record!, newRecord)
            },
            onDelete: {
              onClick: (_e, record) => table.handleStartDeleting(record!.key!)
            },
            onConfirmCancelEditing: () => table.handleConfirmCancelEditing(),
            onConfirmCancelDeleting: () => table.handleConfirmCancelDeleting(),
            onConfirmDelete: (record) => handleConfirmDelete(record),
            isShow: true
          }}
        />
      </BaseLayout>
      {openModal && (
        <ModalAddNewAccessoryNote openModal={openModal} setOpenModal={setOpenModal} onAddNew={handleAddNewItem} />
      )}
    </>
  )
}

export default AccessoryNoteTable
