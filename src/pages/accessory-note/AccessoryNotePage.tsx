import { ColumnsType } from 'antd/es/table'
import { memo } from 'react'
import useTitle from '~/components/hooks/useTitle'
import BaseLayout from '~/components/layout/BaseLayout'
import ProtectedLayout from '~/components/layout/ProtectedLayout'
import EditableStateCell from '~/components/sky-ui/SkyTable/EditableStateCell'
import SkyTable from '~/components/sky-ui/SkyTable/SkyTable'
import SkyTableTypography from '~/components/sky-ui/SkyTable/SkyTableTypography'
import { textValidatorChange, textValidatorDisplay } from '~/utils/helpers'
import ModalAddNewAccessoryNote from './components/ModalAddNewAccessoryNote'
import useAccessoryNoteViewModel from './hooks/useAccessoryNoteViewModel'
import { AccessoryNoteTableDataType } from './type'

interface Props extends React.HTMLAttributes<HTMLElement> {}

const AccessoryNotePage: React.FC<Props> = () => {
  useTitle('Accessory Note - Phung Nguyen')
  const { state, action, table } = useAccessoryNoteViewModel()
  const { newRecord, setNewRecord, openModal, setOpenModal, showDeleted, setShowDeleted } = state
  const {
    handleAddNew,
    handleUpdate,
    handleDelete,
    handleDeleteForever,
    handlePageChange,
    handleRestore,
    handleSearch,
    handleSortChange
  } = action

  const tableColumns: ColumnsType<AccessoryNoteTableDataType> = [
    {
      title: 'Tên',
      dataIndex: 'title',
      width: '15%',
      render: (_value: any, record: AccessoryNoteTableDataType) => {
        return (
          <EditableStateCell
            isEditing={table.isEditing(record.key!)}
            dataIndex='title'
            title='Sewing line title'
            inputType='text'
            required={true}
            initialValue={record.title}
            value={newRecord.title}
            onValueChange={(val: string) =>
              setNewRecord((prev) => {
                return { ...prev, title: textValidatorChange(val.trim()) }
              })
            }
          >
            <SkyTableTypography status={record.status}>{textValidatorDisplay(record.title)}</SkyTableTypography>
          </EditableStateCell>
        )
      }
    },
    {
      title: 'Chi tiết',
      dataIndex: 'summary',
      width: '15%',
      render: (_value: any, record: AccessoryNoteTableDataType) => {
        return (
          <EditableStateCell
            isEditing={table.isEditing(record.key!)}
            dataIndex='summary'
            title='Summary'
            inputType='text'
            required={true}
            initialValue={record.summary}
            value={newRecord.summary}
            onValueChange={(val: string) =>
              setNewRecord((prev) => {
                return { ...prev, summary: textValidatorChange(val.trim()) }
              })
            }
          >
            <SkyTableTypography status={record.status}>{textValidatorDisplay(record.summary)}</SkyTableTypography>
          </EditableStateCell>
        )
      }
    }
  ]

  return (
    <ProtectedLayout>
      <BaseLayout
        title='Danh sách ghi chú phụ liệu'
        loading={table.loading}
        searchProps={{
          onSearch: handleSearch,
          placeholder: 'Ví dụ: Chưa về'
        }}
        sortProps={{
          onChange: handleSortChange
        }}
        deleteProps={{
          onChange: setShowDeleted
        }}
        addNewProps={{
          onClick: () => setOpenModal(true)
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
                setNewRecord({ ...record })
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
        />
      </BaseLayout>
      {openModal && <ModalAddNewAccessoryNote open={openModal} setOpenModal={setOpenModal} onAddNew={handleAddNew} />}
    </ProtectedLayout>
  )
}

export default memo(AccessoryNotePage)
