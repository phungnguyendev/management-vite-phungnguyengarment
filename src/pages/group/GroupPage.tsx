import { ColumnsType } from 'antd/es/table'
import { useSelector } from 'react-redux'
import useTable, { TableItemWithKey } from '~/components/hooks/useTable'
import BaseLayout from '~/components/layout/BaseLayout'
import ProtectedLayout from '~/components/layout/ProtectedLayout'
import EditableStateCell from '~/components/sky-ui/SkyTable/EditableStateCell'
import SkyTable from '~/components/sky-ui/SkyTable/SkyTable'
import SkyTableTypography from '~/components/sky-ui/SkyTable/SkyTableTypography'
import { RootState } from '~/store/store'
import ModalAddNewGroup from './components/ModalAddNewGroup'
import useGroup from './hooks/useGroup'
import { GroupTableDataType } from './type'

interface Props extends React.HTMLAttributes<HTMLElement> {}

const GroupPage: React.FC<Props> = () => {
  const table = useTable<GroupTableDataType>([])

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
    handleConfirmRestore,
    handlePageChange,
    groupService
  } = useGroup(table)
  const currentUser = useSelector((state: RootState) => state.user)

  const columns: ColumnsType<GroupTableDataType> = [
    {
      title: 'Tên nhóm',
      dataIndex: 'name',
      width: '15%',
      render: (_value: any, record: TableItemWithKey<GroupTableDataType>) => {
        return (
          <EditableStateCell
            isEditing={table.isEditing(record.key!)}
            dataIndex='name'
            title='Tên nhóm'
            inputType='text'
            required={true}
            initialValue={record.name}
            value={newRecord.name}
            onValueChange={(val) => setNewRecord({ ...newRecord, name: val })}
          >
            <SkyTableTypography status={record.status}>{record.name}</SkyTableTypography>
          </EditableStateCell>
        )
      }
    }
  ]

  return (
    <ProtectedLayout>
      <BaseLayout
        title='Nhóm'
        searchValue={searchText}
        onDeletedRecordStateChange={
          currentUser.userRoles.includes('admin') ? (enable) => table.setDeletedRecordState(enable) : undefined
        }
        onSearchChange={(e) => setSearchText(e.target.value)}
        onSearch={(value) => handleSearch(value)}
        onSortChange={(checked, e) => handleSortChange(checked, e)}
        onResetClick={{
          onClick: () => handleResetClick(),
          isShow: true
        }}
        onAddNewClick={{
          onClick: () => setOpenModal(true),
          isShow: currentUser.userRoles.includes('admin')
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
          metaData={groupService.metaData}
          onPageChange={handlePageChange}
          isShowDeleted={table.showDeleted}
          actions={{
            onEdit: {
              onClick: (_e, record) => {
                setNewRecord(record)
                table.handleStartEditing(record!.key!)
              },
              isShow: !table.showDeleted
            },
            onSave: {
              onClick: (_e, record) => handleSaveClick(record!)
            },
            onDelete: {
              onClick: (_e, record) => table.handleStartDeleting(record!.key!),
              isShow: !table.showDeleted
            },
            onRestore: {
              onClick: (_e, record) => table.handleStartRestore(record!.key!),
              isShow: table.showDeleted
            },
            onConfirmCancelEditing: () => table.handleConfirmCancelEditing(),
            onConfirmCancelDeleting: () => table.handleConfirmCancelDeleting(),
            onConfirmDelete: (record) => handleConfirmDelete(record),
            onConfirmCancelRestore: () => table.handleConfirmCancelRestore(),
            onConfirmRestore: (record) => handleConfirmRestore(record),
            isShow: currentUser.userRoles.includes('admin')
          }}
        />
      </BaseLayout>
      {openModal && <ModalAddNewGroup openModal={openModal} setOpenModal={setOpenModal} onAddNew={handleAddNewItem} />}
    </ProtectedLayout>
  )
}

export default GroupPage
