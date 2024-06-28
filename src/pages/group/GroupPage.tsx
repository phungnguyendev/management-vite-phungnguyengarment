import { ColumnsType } from 'antd/es/table'
import { memo } from 'react'
import useTitle from '~/components/hooks/useTitle'
import BaseLayout from '~/components/layout/BaseLayout'
import ProtectedLayout from '~/components/layout/ProtectedLayout'
import EditableStateCell from '~/components/sky-ui/SkyTable/EditableStateCell'
import SkyTable from '~/components/sky-ui/SkyTable/SkyTable'
import SkyTableTypography from '~/components/sky-ui/SkyTable/SkyTableTypography'
import { textValidatorChange, textValidatorDisplay } from '~/utils/helpers'
import ModalAddNewGroup from './components/ModalAddNewGroup'
import useGroupViewModel from './hooks/useGroupViewModel'
import { GroupTableDataType } from './type'

interface Props extends React.HTMLAttributes<HTMLElement> {}

const GroupPage: React.FC<Props> = () => {
  useTitle('Nhóm | Phung Nguyen')
  const { state, action, table } = useGroupViewModel()
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

  const tableColumns: ColumnsType<GroupTableDataType> = [
    {
      title: 'Tên',
      dataIndex: 'name',
      width: '15%',
      render: (_value: any, record: GroupTableDataType) => {
        return (
          <EditableStateCell
            isEditing={table.isEditing(record.key!)}
            dataIndex='name'
            title='Group name'
            inputType='text'
            required={true}
            initialValue={record.name}
            value={newRecord.name}
            onValueChange={(val: string) => setNewRecord({ ...newRecord, name: textValidatorChange(val) })}
          >
            <SkyTableTypography status={record.status}>{textValidatorDisplay(record.name)}</SkyTableTypography>
          </EditableStateCell>
        )
      }
    }
  ]

  return (
    <ProtectedLayout>
      <BaseLayout
        title='Danh sách nhóm'
        loading={table.loading}
        searchProps={{
          onSearch: handleSearch,
          placeholder: 'Tên nhóm..'
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
      {openModal && <ModalAddNewGroup open={openModal} setOpenModal={setOpenModal} onAddNew={handleAddNew} />}
    </ProtectedLayout>
  )
}

export default memo(GroupPage)
